"use strict";
import puppeteer from "puppeteer";
import { AppDataSource } from "../config/configDb.js";
import Orden from "../entity/orden.entity.js";
import logger from "../config/logger.js";

/**
 * Genera un número de boleta único secuencial.
 * Formato: BOL-YYYYMMDD-XXXX
 */
const generarNumeroBoleta = async () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const prefijo = `BOL-${yyyy}${mm}${dd}`;

    const ordenRepo = AppDataSource.getRepository(Orden);
    const ultimaBoleta = await ordenRepo
        .createQueryBuilder("o")
        .where("o.numeroBoleta LIKE :prefijo", { prefijo: `${prefijo}%` })
        .orderBy("o.numeroBoleta", "DESC")
        .getOne();

    let secuencia = 1;
    if (ultimaBoleta?.numeroBoleta) {
        const partes = ultimaBoleta.numeroBoleta.split("-");
        secuencia = parseInt(partes[2] || "0") + 1;
    }

    return `${prefijo}-${String(secuencia).padStart(4, "0")}`;
};

/**
 * Genera el HTML de la boleta.
 */
const generarHTMLBoleta = (orden) => {
    const fecha = new Date(orden.createdAt).toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatPrecio = (val) =>
        `$${Number(val).toLocaleString("es-CL")}`;

    const productosHTML = orden.productos.map((op) => {
        const nombre = op.producto?.nombre || "Producto";
        const precioUnit = Number(op.precio);
        const descuento = op.descuento || 0;
        const subtotal = Number(op.subtotal || op.cantidad * precioUnit);
        return `
        <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">
                ${nombre}
                ${descuento > 0
                    ? `<span style="color:#e53e3e;font-size:12px;">
                        (-${descuento}%)</span>`
                    : ""}
            </td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;
                text-align:center;">${op.cantidad}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;
                text-align:right;">${formatPrecio(precioUnit)}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;
                text-align:right;">${formatPrecio(subtotal)}</td>
        </tr>`;
    }).join("");

    const metodoEntrega = orden.metodoEntrega === "retiro"
        ? "Retiro en tienda"
        : "Envío a domicilio";

    const metodoPago = {
        webpay: "WebPay Plus",
        mercadopago: "MercadoPago",
    }[orden.metodoPago] || orden.metodoPago || "N/A";

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background: #fff;
                color: #333;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #2147A2;
            }
            .logo-section h1 {
                color: #2147A2;
                font-size: 28px;
                margin-bottom: 4px;
            }
            .logo-section p {
                color: #666;
                font-size: 13px;
            }
            .boleta-info {
                text-align: right;
            }
            .boleta-info .boleta-num {
                color: #2147A2;
                font-size: 20px;
                font-weight: 700;
            }
            .boleta-info .boleta-fecha {
                color: #666;
                font-size: 14px;
                margin-top: 4px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }
            .info-box {
                background: #f8f9fc;
                padding: 16px;
                border-radius: 8px;
            }
            .info-box h3 {
                color: #2147A2;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }
            .info-box p {
                font-size: 14px;
                line-height: 1.5;
                color: #444;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            thead th {
                background: #2147A2;
                color: #fff;
                padding: 10px 12px;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            thead th:first-child { border-radius: 8px 0 0 0; }
            thead th:last-child { border-radius: 0 8px 0 0; }
            .totals {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 30px;
            }
            .totals-box {
                width: 280px;
                background: #f8f9fc;
                padding: 16px;
                border-radius: 8px;
            }
            .totals-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                font-size: 14px;
            }
            .totals-row.total {
                border-top: 2px solid #2147A2;
                margin-top: 8px;
                padding-top: 10px;
                font-weight: 700;
                font-size: 18px;
                color: #2147A2;
            }
            .disclaimer {
                background: #fff3cd;
                border: 1px solid #ffc107;
                border-radius: 8px;
                padding: 12px 16px;
                font-size: 12px;
                color: #856404;
                text-align: center;
                margin-bottom: 20px;
            }
            .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo-section">
                <h1>Óptica Danniels</h1>
                <p>Av. Manuel Rodríguez 426, Chiguayante</p>
                <p>Región del Biobío, Chile</p>
            </div>
            <div class="boleta-info">
                <div class="boleta-num">${orden.numeroBoleta}</div>
                <div class="boleta-fecha">${fecha}</div>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-box">
                <h3>Datos del Cliente</h3>
                <p><strong>${orden.nombre}</strong></p>
                <p>${orden.correo}</p>
                ${orden.telefono ? `<p>${orden.telefono}</p>` : ""}
            </div>
            <div class="info-box">
                <h3>Datos de Entrega</h3>
                <p><strong>${metodoEntrega}</strong></p>
                ${orden.metodoEntrega === "envio"
                    ? `<p>${orden.direccion}</p>`
                    : "<p>Av. Manuel Rodríguez 426, Chiguayante</p>"}
                <p>Pago: ${metodoPago}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="text-align:left;">Producto</th>
                    <th>Cant.</th>
                    <th style="text-align:right;">P. Unit.</th>
                    <th style="text-align:right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${productosHTML}
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-box">
                <div class="totals-row">
                    <span>Neto</span>
                    <span>${formatPrecio(Math.round(Number(orden.subtotal) / 1.19))}</span>
                </div>
                <div class="totals-row">
                    <span>IVA (19%)</span>
                    <span>${formatPrecio(Number(orden.iva))}</span>
                </div>
                ${Number(orden.costoEnvio) > 0
                    ? `<div class="totals-row">
                        <span>Envío</span>
                        <span>${formatPrecio(Number(orden.costoEnvio))}</span>
                    </div>`
                    : `<div class="totals-row">
                        <span>Envío</span>
                        <span style="color:#38a169;">Gratis</span>
                    </div>`}
                <div class="totals-row total">
                    <span>Total</span>
                    <span>${formatPrecio(Number(orden.total))}</span>
                </div>
            </div>
        </div>

        <div class="disclaimer">
            ⚠️ Este documento es una boleta de venta simulada
            con fines académicos. No constituye un DTE
            (Documento Tributario Electrónico) válido ante el SII.
        </div>

        <div class="footer">
            <p>Gracias por tu compra en Óptica Danniels</p>
            <p>© ${new Date().getFullYear()} Óptica Danniels — Todos los derechos reservados</p>
        </div>
    </body>
    </html>`;
};

/**
 * Genera un PDF de boleta para una orden.
 * @param {number} ordenId
 * @returns {Promise<Buffer>} Buffer del PDF
 */
export const generarBoletaPDF = async (ordenId) => {
    const ordenRepo = AppDataSource.getRepository(Orden);
    const orden = await ordenRepo.findOne({
        where: { id: parseInt(ordenId) },
        relations: { productos: { producto: true } },
    });

    if (!orden) {
        throw { status: 404, message: "Orden no encontrada." };
    }

    // Asignar número de boleta si no tiene
    if (!orden.numeroBoleta) {
        orden.numeroBoleta = await generarNumeroBoleta();
        await ordenRepo.save(orden);
    }

    const html = generarHTMLBoleta(orden);

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
            ],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "Letter",
            printBackground: true,
            margin: {
                top: "20px",
                bottom: "20px",
                left: "20px",
                right: "20px",
            },
        });

        return pdfBuffer;
    } catch (error) {
        logger.error("Error generando boleta PDF:", error);
        throw { status: 500, message: "Error al generar la boleta PDF." };
    } finally {
        if (browser) await browser.close();
    }
};
