"use strict";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import logger from "../config/logger.js";

const BRAND_COLOR = "#2147A2";
const MESES = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// ─────────────────── Helpers ───────────────────

const formatPrecio = (v) =>
    `$${Number(v || 0).toLocaleString("es-CL")}`;

/** Genera tarjeta de estadística para PDF */
const statCard = (value, label) =>
    "<div class=\"stat-card\">"
    + `<div class="stat-value">${value}</div>`
    + `<div class="stat-label">${label}</div></div>`;

/** Genera filas de tabla HTML desde un array */
const mapRows = (arr, fn) =>
    (arr || []).map(fn).join("");

/** Genera fila con N celdas */
const rowN = (...cells) =>
    `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;

/** Genera tabla HTML completa */
const htmlTable = (headers, rowsHtml) => {
    const ths = headers
        .map((h) => `<th>${h}</th>`).join("");
    return `<table><thead><tr>${ths}</tr></thead>`
        + `<tbody>${rowsHtml}</tbody></table>`;
};

const REPORT_CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family:'Segoe UI',Arial,sans-serif;
    color:#333; padding:40px;
  }
  h1 {
    color:${BRAND_COLOR}; font-size:22px;
    margin-bottom:8px;
  }
  .subtitle {
    color:#666; font-size:13px; margin-bottom:24px;
  }
  h2 {
    color:${BRAND_COLOR}; font-size:16px;
    margin:24px 0 12px;
    border-bottom:2px solid ${BRAND_COLOR};
    padding-bottom:4px;
  }
  table {
    width:100%; border-collapse:collapse;
    margin-bottom:16px; font-size:13px;
  }
  th {
    background:${BRAND_COLOR}; color:#fff;
    padding:8px 12px; text-align:left; font-size:12px;
  }
  td { padding:8px 12px; border-bottom:1px solid #eee; }
  tr:nth-child(even) { background:#f8faff; }
  .stat-grid {
    display:grid; gap:12px; margin-bottom:20px;
    grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
  }
  .stat-card {
    background:#f8faff; border:1px solid #e5e9f5;
    border-radius:8px; padding:12px; text-align:center;
  }
  .stat-value {
    font-size:24px; font-weight:700;
    color:${BRAND_COLOR};
  }
  .stat-label {
    font-size:12px; color:#666; margin-top:4px;
  }
  .footer {
    margin-top:32px; border-top:1px solid #eee;
    padding-top:12px; font-size:11px;
    color:#aaa; text-align:center;
  }`;

const wrapHTMLReport = (title, body) => {
    const dateStr = new Date().toLocaleDateString(
        "es-CL", { dateStyle: "long" },
    );
    const year = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8">
<style>${REPORT_CSS}</style>
</head>
<body>
  <h1>Óptica Danniels — ${title}</h1>
  <div class="subtitle">Generado el ${dateStr}</div>
  ${body}
  <div class="footer">
    © ${year} Óptica Danniels — Reporte automático
  </div>
</body>
</html>`;
};

// ─────────────────── PDF Generation ───────────────────

async function renderHTMLToPDF(html) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        return await page.pdf({
            format: "Letter",
            printBackground: true,
            margin: { top: "30px", bottom: "30px", left: "30px", right: "30px" },
        });
    } finally {
        if (browser) await browser.close();
    }
}

// ─────────────────── HTML Builders ───────────────────

function buildGeneralesHTML(data) {
    const { usuarios, productos, tendencias } = data;

    const sUsuarios = `<div class="stat-grid">
      ${statCard(usuarios.total, "Total")}
      ${statCard(usuarios.administradores, "Admins")}
      ${statCard(usuarios.regulares, "Regulares")}
      ${statCard(usuarios.ultimos30Dias, "Últimos 30 días")}
    </div>`;

    const tGenero = htmlTable(
        ["Género", "Cantidad"],
        mapRows(usuarios.porGenero, (g) =>
            rowN(g.genero, g.cantidad)),
    );

    const valInv = formatPrecio(productos.valorInventario);
    const sProductos = `<div class="stat-grid">
      ${statCard(productos.total, "Total")}
      ${statCard(productos.activos, "Activos")}
      ${statCard(productos.enOferta, "En Oferta")}
      ${statCard(productos.stockBajo, "Stock Bajo")}
      ${statCard(valInv, "Valor Inventario")}
    </div>`;

    const tCategoria = htmlTable(
        ["Categoría", "Cantidad"],
        mapRows(productos.porCategoria, (c) =>
            rowN(c.categoria, c.cantidad)),
    );

    const tTendencia = htmlTable(
        ["Mes", "Registros"],
        mapRows(tendencias.registrosPorMes, (t) =>
            rowN(`${MESES[t.mes]} ${t.año}`, t.cantidad)),
    );

    return wrapHTMLReport("Reporte General", `
      <h2>Usuarios</h2>
      ${sUsuarios}${tGenero}
      <h2>Productos</h2>
      ${sProductos}${tCategoria}
      <h2>Tendencia Registros (últimos 6 meses)</h2>
      ${tTendencia}
    `);
}

function buildUsuariosHTML(data) {
    const tRol = htmlTable(
        ["Rol", "Cantidad"],
        mapRows(data.porRol, (r) =>
            rowN(r.rol, r.cantidad)),
    );
    const tGenero = htmlTable(
        ["Género", "Cantidad"],
        mapRows(data.porGenero, (g) =>
            rowN(g.genero, g.cantidad)),
    );
    const tEdad = htmlTable(
        ["Rango", "Cantidad"],
        mapRows(data.distribucionPorEdad, (e) =>
            rowN(e.rango, e.cantidad)),
    );
    const tMes = htmlTable(
        ["Mes", "Registros"],
        mapRows(data.registrosPorMes, (t) =>
            rowN(`${MESES[t.mes]} ${t.año}`, t.cantidad)),
    );
    const tUltimos = htmlTable(
        ["ID", "Nombre", "Email", "Rol", "Fecha"],
        mapRows(data.ultimosUsuarios, (u) => {
            const nombre = [
                u.primerNombre || "",
                u.apellidoPaterno || "",
            ].join(" ").trim();
            const fecha = new Date(u.createdAt)
                .toLocaleDateString("es-CL");
            return rowN(
                u.id, nombre, u.email, u.rol, fecha,
            );
        }),
    );

    return wrapHTMLReport("Reporte de Usuarios", `
      <h2>Distribución por Rol</h2>${tRol}
      <h2>Distribución por Género</h2>${tGenero}
      <h2>Distribución por Edad</h2>${tEdad}
      <h2>Registros por Mes</h2>${tMes}
      <h2>Últimos Usuarios Registrados</h2>${tUltimos}
    `);
}

function buildProductosHTML(data) {
    const tCat = htmlTable(
        ["Categoría", "Cantidad"],
        mapRows(data.porCategoria, (c) =>
            rowN(c.categoria, c.cantidad)),
    );
    const tMarca = htmlTable(
        ["Marca", "Cantidad"],
        mapRows(data.porMarca, (m) =>
            rowN(m.marca, m.cantidad)),
    );
    const tPrecios = htmlTable(
        ["Rango", "Cantidad"],
        mapRows(data.distribucionPrecios, (p) =>
            rowN(p.rango, p.cantidad)),
    );
    const tStock = htmlTable(
        ["Nombre", "Marca", "Categoría", "Stock", "Precio"],
        mapRows(data.stockBajo, (p) => {
            const color = p.stock <= 3
                ? "#e74c3c" : "#e67e22";
            const stk = "<span style=\"color:"
                + `${color};font-weight:700;\">`
                + `${p.stock}</span>`;
            return rowN(
                p.nombre,
                p.marca || "N/A",
                p.categoria || "N/A",
                stk,
                formatPrecio(p.precio),
            );
        }),
    );
    const tCaros = htmlTable(
        ["Nombre", "Marca", "Precio", "Stock"],
        mapRows(data.masCaros, (p) => rowN(
            p.nombre,
            p.marca || "N/A",
            formatPrecio(p.precio),
            p.stock,
        )),
    );

    return wrapHTMLReport("Reporte de Productos", `
      <h2>Por Categoría</h2>${tCat}
      <h2>Top Marcas</h2>${tMarca}
      <h2>Distribución de Precios</h2>${tPrecios}
      <h2>Productos con Stock Bajo (&lt; 10)</h2>
      ${tStock}
      <h2>Productos Más Caros</h2>${tCaros}
    `);
}

function buildOrdenesHTML(data) {
    const {
        resumen, porEstado, tendencias,
        topProductos, ultimasOrdenes,
    } = data;

    const ingTot = formatPrecio(resumen.ingresosTotales);
    const ing30 = formatPrecio(resumen.ingresos30Dias);
    const promedio = formatPrecio(resumen.promedioOrden);

    const stats = `<div class="stat-grid">
      ${statCard(resumen.totalOrdenes, "Total Órdenes")}
      ${statCard(resumen.ordenesUltimos30Dias, "Últimos 30 días")}
      ${statCard(ingTot, "Ingresos Totales")}
      ${statCard(ing30, "Ingresos 30 días")}
      ${statCard(promedio, "Promedio Orden")}
    </div>`;

    const tEstado = htmlTable(
        ["Estado", "Cantidad"],
        mapRows(porEstado, (e) =>
            rowN(e.estado, e.cantidad)),
    );
    const tTend = htmlTable(
        ["Mes", "Órdenes", "Ingresos"],
        mapRows(tendencias, (t) => rowN(
            `${MESES[t.mes]} ${t.año}`,
            t.cantidad,
            formatPrecio(t.ingresos),
        )),
    );
    const tTop = htmlTable(
        ["Producto", "Marca", "Vendidos", "Ingresos"],
        mapRows(topProductos, (p) => rowN(
            p.nombre,
            p.marca || "N/A",
            p.cantidadVendida,
            formatPrecio(p.ingresos),
        )),
    );
    const tUltimas = htmlTable(
        ["ID", "Cliente", "Total", "Estado", "Fecha"],
        mapRows(ultimasOrdenes, (o) => {
            const fecha = new Date(o.fecha)
                .toLocaleDateString("es-CL");
            return rowN(
                `#${o.id}`,
                o.nombre || "N/A",
                formatPrecio(o.total),
                o.estado,
                fecha,
            );
        }),
    );

    return wrapHTMLReport("Reporte de Órdenes", `
      <h2>Resumen</h2>${stats}
      <h2>Órdenes por Estado</h2>${tEstado}
      <h2>Tendencia Mensual</h2>${tTend}
      <h2>Top 10 Productos Más Vendidos</h2>${tTop}
      <h2>Últimas 10 Órdenes</h2>${tUltimas}
    `);
}

const HTML_BUILDERS = {
    generales: buildGeneralesHTML,
    usuarios: buildUsuariosHTML,
    productos: buildProductosHTML,
    ordenes: buildOrdenesHTML,
};

// ─────────────────── PDF Export ───────────────────

export async function generarReportePDF(tipo, datos) {
    const builder = HTML_BUILDERS[tipo];
    if (!builder) throw { status: 400, message: `Tipo de reporte inválido: ${tipo}` };

    const html = builder(datos);
    return await renderHTMLToPDF(html);
}

// ─────────────────── Excel Export ───────────────────

function addTableSheet(workbook, sheetName, columns, rows) {
    const ws = workbook.addWorksheet(sheetName);
    ws.columns = columns.map((col) => ({
        header: col.header,
        key: col.key,
        width: col.width || 18,
    }));

    // Style header
    ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2147A2" } };
    ws.getRow(1).alignment = { horizontal: "center" };

    rows.forEach((row) => ws.addRow(row));

    // auto-fit column widths
    ws.columns.forEach((col) => {
        let maxLen = col.header?.length || 10;
        col.eachCell?.({ includeEmpty: false }, (cell) => {
            const len = String(cell.value || "").length;
            if (len > maxLen) maxLen = len;
        });
        col.width = Math.min(maxLen + 4, 40);
    });

    return ws;
}

export async function generarReporteExcel(tipo, datos) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Óptica Danniels";
    workbook.created = new Date();

    switch (tipo) {
        case "generales": {
            const { usuarios, productos, tendencias } = datos;
            addTableSheet(workbook, "Resumen Usuarios", [
                { header: "Métrica", key: "metrica" },
                { header: "Valor", key: "valor" },
            ], [
                { metrica: "Total", valor: usuarios.total },
                { metrica: "Administradores", valor: usuarios.administradores },
                { metrica: "Regulares", valor: usuarios.regulares },
                { metrica: "Últimos 30 días", valor: usuarios.ultimos30Dias },
            ]);
            addTableSheet(workbook, "Usuarios por Género", [
                { header: "Género", key: "genero" },
                { header: "Cantidad", key: "cantidad" },
            ], usuarios.porGenero || []);
            addTableSheet(workbook, "Productos por Categoría", [
                { header: "Categoría", key: "categoria" },
                { header: "Cantidad", key: "cantidad" },
            ], productos.porCategoria || []);
            addTableSheet(workbook, "Tendencia Registros", [
                { header: "Año", key: "año" },
                { header: "Mes", key: "mesNombre" },
                { header: "Registros", key: "cantidad" },
            ], (tendencias.registrosPorMes || []).map((t) => ({ ...t, mesNombre: MESES[t.mes] })));
            break;
        }
        case "usuarios": {
            addTableSheet(workbook, "Por Rol", [
                { header: "Rol", key: "rol" },
                { header: "Cantidad", key: "cantidad" },
            ], datos.porRol || []);
            addTableSheet(workbook, "Por Género", [
                { header: "Género", key: "genero" },
                { header: "Cantidad", key: "cantidad" },
            ], datos.porGenero || []);
            addTableSheet(workbook, "Distribución Edad", [
                { header: "Rango", key: "rango" },
                { header: "Cantidad", key: "cantidad" },
            ], datos.distribucionPorEdad || []);
            addTableSheet(workbook, "Registros por Mes", [
                { header: "Año", key: "año" },
                { header: "Mes", key: "mesNombre" },
                { header: "Registros", key: "cantidad" },
            ], (datos.registrosPorMes || []).map((t) => ({ ...t, mesNombre: MESES[t.mes] })));
            addTableSheet(workbook, "Últimos Registros", [
                { header: "ID", key: "id" },
                { header: "Nombre", key: "nombre" },
                { header: "Email", key: "email" },
                { header: "Rol", key: "rol" },
                { header: "Fecha", key: "fecha" },
            ], (datos.ultimosUsuarios || []).map((u) => ({
                id: u.id,
                nombre: `${u.primerNombre || ""} ${u.apellidoPaterno || ""}`.trim(),
                email: u.email,
                rol: u.rol,
                fecha: new Date(u.createdAt).toLocaleDateString("es-CL"),
            })));
            break;
        }
        case "productos": {
            addTableSheet(workbook, "Por Categoría", [
                { header: "Categoría", key: "categoria" },
                { header: "Cantidad", key: "cantidad" },
            ], datos.porCategoria || []);
            addTableSheet(workbook, "Top Marcas", [
                { header: "Marca", key: "marca" },
                { header: "Cantidad", key: "cantidad" },
            ], datos.porMarca || []);
            addTableSheet(workbook, "Distribución Precios", [
                { header: "Rango", key: "rango" },
                { header: "Cantidad", key: "cantidad" },
            ], datos.distribucionPrecios || []);
            addTableSheet(workbook, "Stock Bajo", [
                { header: "Nombre", key: "nombre" },
                { header: "Marca", key: "marca" },
                { header: "Categoría", key: "categoria" },
                { header: "Stock", key: "stock" },
                { header: "Precio", key: "precio" },
            ], (datos.stockBajo || []).map((p) => ({
                nombre: p.nombre,
                marca: p.marca || "N/A",
                categoria: p.categoria || "N/A",
                stock: p.stock,
                precio: p.precio,
            })));
            addTableSheet(workbook, "Más Caros", [
                { header: "Nombre", key: "nombre" },
                { header: "Marca", key: "marca" },
                { header: "Precio", key: "precio" },
                { header: "Stock", key: "stock" },
            ], (datos.masCaros || []).map((p) => ({
                nombre: p.nombre,
                marca: p.marca || "N/A",
                precio: p.precio,
                stock: p.stock,
            })));
            break;
        }
        case "ordenes": {
            const { resumen, porEstado, tendencias, topProductos, ultimasOrdenes } = datos;
            addTableSheet(workbook, "Resumen", [
                { header: "Métrica", key: "metrica" },
                { header: "Valor", key: "valor" },
            ], [
                { metrica: "Total Órdenes", valor: resumen.totalOrdenes },
                { metrica: "Últimos 30 días", valor: resumen.ordenesUltimos30Dias },
                { metrica: "Ingresos Totales", valor: resumen.ingresosTotales },
                { metrica: "Ingresos 30 días", valor: resumen.ingresos30Dias },
                { metrica: "Promedio Orden", valor: resumen.promedioOrden },
            ]);
            addTableSheet(workbook, "Por Estado", [
                { header: "Estado", key: "estado" },
                { header: "Cantidad", key: "cantidad" },
            ], porEstado || []);
            addTableSheet(workbook, "Tendencia Mensual", [
                { header: "Año", key: "año" },
                { header: "Mes", key: "mesNombre" },
                { header: "Órdenes", key: "cantidad" },
                { header: "Ingresos", key: "ingresos" },
            ], (tendencias || []).map((t) => ({ ...t, mesNombre: MESES[t.mes] })));
            addTableSheet(workbook, "Top Productos", [
                { header: "Producto", key: "nombre" },
                { header: "Marca", key: "marca" },
                { header: "Vendidos", key: "cantidadVendida" },
                { header: "Ingresos", key: "ingresos" },
            ], topProductos || []);
            addTableSheet(workbook, "Últimas Órdenes", [
                { header: "ID", key: "id" },
                { header: "Cliente", key: "nombre" },
                { header: "Total", key: "total" },
                { header: "Estado", key: "estado" },
                { header: "Fecha", key: "fecha" },
            ], (ultimasOrdenes || []).map((o) => ({
                ...o,
                fecha: new Date(o.fecha).toLocaleDateString("es-CL"),
            })));
            break;
        }
        default:
            throw { status: 400, message: `Tipo de reporte inválido: ${tipo}` };
    }

    return await workbook.xlsx.writeBuffer();
}

// ─────────────────── CSV Export ───────────────────

function escapeCSV(val) {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
        return `"${str.replace(/"/g, "\"\"")}"`;
    }
    return str;
}

function arrayToCSV(headers, rows) {
    const headerLine = headers.map(escapeCSV).join(",");
    const dataLines = rows.map((row) =>
        headers.map((h) => escapeCSV(row[h] ?? "")).join(","),
    );
    return [headerLine, ...dataLines].join("\n");
}

export function generarReporteCSV(tipo, datos) {
    switch (tipo) {
        case "generales": {
            const { usuarios, productos, tendencias } = datos;
            const sections = [];
            sections.push("=== USUARIOS ===");
            sections.push(arrayToCSV(["genero", "cantidad"], usuarios.porGenero || []));
            sections.push("\n=== PRODUCTOS POR CATEGORIA ===");
            sections.push(arrayToCSV(["categoria", "cantidad"], productos.porCategoria || []));
            sections.push("\n=== TENDENCIA REGISTROS ===");
            sections.push(arrayToCSV(["año", "mes", "cantidad"],
                (tendencias.registrosPorMes || []).map((t) => ({ ...t, mes: MESES[t.mes] }))));
            return sections.join("\n");
        }
        case "usuarios": {
            const sections = [];
            sections.push("=== POR ROL ===");
            sections.push(arrayToCSV(["rol", "cantidad"], datos.porRol || []));
            sections.push("\n=== POR GENERO ===");
            sections.push(arrayToCSV(["genero", "cantidad"], datos.porGenero || []));
            sections.push("\n=== POR EDAD ===");
            sections.push(arrayToCSV(["rango", "cantidad"], datos.distribucionPorEdad || []));
            sections.push("\n=== REGISTROS POR MES ===");
            sections.push(arrayToCSV(["año", "mes", "cantidad"],
                (datos.registrosPorMes || []).map((t) => ({ ...t, mes: MESES[t.mes] }))));
            return sections.join("\n");
        }
        case "productos": {
            const sections = [];
            sections.push("=== POR CATEGORIA ===");
            sections.push(arrayToCSV(["categoria", "cantidad"], datos.porCategoria || []));
            sections.push("\n=== TOP MARCAS ===");
            sections.push(arrayToCSV(["marca", "cantidad"], datos.porMarca || []));
            sections.push("\n=== STOCK BAJO ===");
            const hdrs = [
                "nombre", "marca", "categoria",
                "stock", "precio",
            ];
            const stockRows = (datos.stockBajo || [])
                .map((p) => ({
                    nombre: p.nombre,
                    marca: p.marca || "N/A",
                    categoria: p.categoria || "N/A",
                    stock: p.stock,
                    precio: p.precio,
                }));
            sections.push(arrayToCSV(hdrs, stockRows));
            return sections.join("\n");
        }
        case "ordenes": {
            const { resumen, porEstado, tendencias, topProductos } = datos;
            const sections = [];
            sections.push("=== RESUMEN ===");
            sections.push(`Total Ordenes,${resumen.totalOrdenes}`);
            sections.push(`Ingresos Totales,${resumen.ingresosTotales}`);
            sections.push(`Promedio Orden,${resumen.promedioOrden}`);
            sections.push("\n=== POR ESTADO ===");
            sections.push(arrayToCSV(["estado", "cantidad"], porEstado || []));
            sections.push("\n=== TENDENCIA MENSUAL ===");
            sections.push(arrayToCSV(["año", "mes", "cantidad", "ingresos"],
                (tendencias || []).map((t) => ({ ...t, mes: MESES[t.mes] }))));
            sections.push("\n=== TOP PRODUCTOS ===");
            sections.push(arrayToCSV(["nombre", "marca", "cantidadVendida", "ingresos"], topProductos || []));
            return sections.join("\n");
        }
        default:
            throw { status: 400, message: `Tipo de reporte inválido: ${tipo}` };
    }
}
