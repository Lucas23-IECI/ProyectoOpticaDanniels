/**
 * seed-productos.js — Carga masiva de 30+ productos de prueba
 *
 * Uso:
 *   node src/scripts/seed-productos.js
 *
 * Requisitos:
 *   - Backend corriendo en localhost:3000
 *   - Usuario admin seed.admin@optica.cl / SeedAdmin2026  (o ajustar abajo)
 *
 * Cubre:
 *   - nombres largos / cortos
 *   - caracteres especiales (tildes, ñ, paréntesis)
 *   - precios extremos (min 1, max 999999999)
 *   - stock 0, 1, grande
 *   - categorías variadas (opticos, sol, accesorios)
 *   - subcategorías reales
 *   - oferta + descuento
 *   - SKUs duplicados (para validar error 400)
 *   - payloads incompletos (nombre faltante, precio faltante)
 *   - descripción < 10 chars (debería fallar)
 *   - precio negativo (debería fallar)
 *   - stock negativo (debería fallar)
 *   - categoría inválida (debería fallar)
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "http://localhost:3000";
const LOGIN_EMAIL = "seed.admin@optica.cl";
const LOGIN_PASS = "SeedAdmin2026";

// ─── Helpers ──────────────────────────────────────────────────

function httpRequest(method, urlPath, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(urlPath, API_BASE);
        const isMultipart = body instanceof Buffer;
        const reqHeaders = { ...headers };
        if (!isMultipart && body) {
            reqHeaders["Content-Type"] = "application/json";
        }

        const req = http.request(
            {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method,
                headers: reqHeaders,
            },
            (res) => {
                let data = "";
                res.on("data", (c) => (data += c));
                res.on("end", () => {
                    try {
                        resolve({ status: res.statusCode, body: JSON.parse(data) });
                    } catch {
                        resolve({ status: res.statusCode, body: data });
                    }
                });
            }
        );
        req.on("error", reject);
        if (body) req.write(isMultipart ? body : JSON.stringify(body));
        req.end();
    });
}

function buildMultipartBody(fields, imageBuffer, imageName, boundary) {
    let body = "";
    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined || value === null) continue;
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
        body += `${value}\r\n`;
    }

    const parts = [Buffer.from(body, "utf-8")];

    if (imageBuffer) {
        const ext = path.extname(imageName).toLowerCase();
        const mimeMap = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
        const mime = mimeMap[ext] || "application/octet-stream";
        const filePart =
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="imagen"; filename="${imageName}"\r\n` +
            `Content-Type: ${mime}\r\n\r\n`;
        parts.push(Buffer.from(filePart, "utf-8"));
        parts.push(imageBuffer);
        parts.push(Buffer.from("\r\n", "utf-8"));
    }

    parts.push(Buffer.from(`--${boundary}--\r\n`, "utf-8"));
    return Buffer.concat(parts);
}

// ─── Fixtures ──────────────────────────────────────────────────

const VALID_PRODUCTS = [
    // 1-5: Ópticos variados
    { nombre: "Lentes Ópticos Clásicos Ray-Ban RB5228", descripcion: "Montura rectangular clasica para uso diario", precio: 89990, categoria: "opticos", subcategoria: "graduados", stock: 50, marca: "Ray-Ban", codigoSKU: "RB-5228-BLK", activo: true, oferta: false, descuento: 0 },
    { nombre: "Gafas Oakley Crosslink (deportivas)", descripcion: "Montura deportiva resistente a impactos con sistema de patillas intercambiables", precio: 134990, categoria: "opticos", subcategoria: "graduados", stock: 25, marca: "Oakley", codigoSKU: "OAK-CROSS-01", activo: true, oferta: true, descuento: 15 },
    { nombre: "Lentes Progresivos Varilux Comfort Max", descripcion: "Progresivos premium con tecnologia de ultima generacion para mayor comodidad visual", precio: 299990, categoria: "opticos", subcategoria: "progresivos", stock: 10, marca: "Essilor", codigoSKU: "ESS-VRLX-CM", activo: true, oferta: false, descuento: 0 },
    { nombre: "Montura Bifocal Carolina Herrera CH-123", descripcion: "Bifocales elegantes con diseño femenino sofisticado en acetato italiano", precio: 189990, categoria: "opticos", subcategoria: "bifocales", stock: 8, marca: "Carolina Herrera", codigoSKU: "CH-BIF-123", activo: true, oferta: true, descuento: 20 },
    { nombre: "Lentes Lectura Económicos 2.5", descripcion: "Económicos lentes de lectura para presbicia, ideales para uso ocasional", precio: 12990, categoria: "opticos", subcategoria: "lectura", stock: 200, marca: "OptiHouse", codigoSKU: "OH-LECT-25", activo: true, oferta: false, descuento: 0 },

    // 6-10: Sol variados
    { nombre: "Ray-Ban Aviator Classic Gold", descripcion: "Los icónicos lentes aviador con montura dorada y cristales verdes G-15", precio: 179990, categoria: "sol", subcategoria: "clasicos", stock: 30, marca: "Ray-Ban", codigoSKU: "RB-AVI-GLD", activo: true, oferta: false, descuento: 0 },
    { nombre: "Oakley Radar EV Path Prizm", descripcion: "Lentes deportivos de alto rendimiento con tecnologia Prizm para ciclismo y running", precio: 249990, categoria: "sol", subcategoria: "deportivos", stock: 15, marca: "Oakley", codigoSKU: "OAK-RADAR-EV", activo: true, oferta: true, descuento: 10 },
    { nombre: "Gucci GG0036S Oversized", descripcion: "Gafas oversized con diseño de lujo italiano y logo GG en las patillas doradas", precio: 459990, categoria: "sol", subcategoria: "clasicos", stock: 5, marca: "Gucci", codigoSKU: "GUC-0036S", activo: true, oferta: false, descuento: 0 },
    { nombre: "Maui Jim Peahi Polarizado", descripcion: "Lentes polarizados premium para actividades nauticas con proteccion total UV", precio: 329990, categoria: "sol", subcategoria: "deportivos", stock: 12, marca: "Maui Jim", codigoSKU: "MJ-PEAHI-01", activo: true, oferta: false, descuento: 0 },
    { nombre: "Prada SPR 01OS Cinema", descripcion: "Gafas de sol sofisticadas con diseño cinema y detalles premium en acetato", precio: 389990, categoria: "sol", subcategoria: "clasicos", stock: 7, marca: "Prada", codigoSKU: "PRA-01OS-CIN", activo: true, oferta: true, descuento: 25 },

    // 11-15: Accesorios
    { nombre: "Estuche Rígido Premium Cuero", descripcion: "Estuche protector rigido en cuero genuino con forro de microfibra interior suave", precio: 24990, categoria: "accesorios", subcategoria: "", stock: 100, marca: "OptiHouse", codigoSKU: "OH-EST-CUERO", activo: true, oferta: false, descuento: 0 },
    { nombre: "Paño Microfibra XL (30x30cm)", descripcion: "Paño extra grande de microfibra para limpieza de lentes sin rayar la superficie", precio: 3990, categoria: "accesorios", subcategoria: "", stock: 500, marca: "OptiHouse", codigoSKU: "OH-PANO-XL", activo: true, oferta: false, descuento: 0 },
    { nombre: "Spray Limpiador Antiempañante", descripcion: "Solución limpiadora con efecto antiempañante de larga duración para lentes ópticos", precio: 7990, categoria: "accesorios", subcategoria: "", stock: 150, marca: "OptiClean", codigoSKU: "OC-SPRAY-AE", activo: true, oferta: true, descuento: 30 },
    { nombre: "Cordón Deportivo Neopreno", descripcion: "Cordón ajustable de neopreno para sujetar lentes durante actividades deportivas intensas", precio: 5990, categoria: "accesorios", subcategoria: "", stock: 80, marca: "SportVision", codigoSKU: "SV-CORD-NEO", activo: true, oferta: false, descuento: 0 },
    { nombre: "Kit Reparación Lentes Ópticos", descripcion: "Kit completo con destornilladores, almohadillas nasales, tornillos de repuesto y pinzas", precio: 9990, categoria: "accesorios", subcategoria: "", stock: 60, marca: "FixOptic", codigoSKU: "FO-KIT-REP", activo: true, oferta: false, descuento: 0 },

    // 16-20: Edge cases - nombres y chars especiales
    { nombre: "AB", descripcion: "Producto con nombre muy corto de solo dos letras para test", precio: 1, categoria: "accesorios", subcategoria: "", stock: 1, marca: "Test", codigoSKU: "TST-SHORT-01", activo: true, oferta: false, descuento: 0 },
    { nombre: "Lentes Ópticos con Descripción Súper Larga Para Verificar el Límite de Caracteres del Campo Nombre Que Permite Hasta 255 Chars Máximo en la Base de Datos y en la Validación Joi", descripcion: "Descripcion también extensa para probar limites de validación del campo descripcion", precio: 49990, categoria: "opticos", subcategoria: "monofocales", stock: 3, marca: "TestBrand", codigoSKU: "TST-LONG-NAME", activo: true, oferta: false, descuento: 0 },
    { nombre: "Gafas Niño Flexible (5-10 años)", descripcion: "Montura infantil flexible e irrompible con bisagras de muelle para niños activos", precio: 39990, categoria: "opticos", subcategoria: "graduados", stock: 40, marca: "KidsVision", codigoSKU: "KV-NINO-510", activo: true, oferta: true, descuento: 50 },
    { nombre: "Versace Medusa Edición Especial", descripcion: "Edición limitada con detalles en oro de la emblematica colección Medusa de Versace", precio: 599990, categoria: "sol", subcategoria: "clasicos", stock: 2, marca: "Versace", codigoSKU: "VRS-MDS-ESP", activo: true, oferta: false, descuento: 0 },
    { nombre: "Paño Económico Pack x3", descripcion: "Pack de tres paños de microfibra estándar para limpieza de lentes de distintos tamaños", precio: 2990, categoria: "accesorios", subcategoria: "", stock: 999, marca: "OptiHouse", codigoSKU: "OH-PANO-3PK", activo: true, oferta: false, descuento: 0 },

    // 21-25: Extremos de precio y stock
    { nombre: "Cristal Monofocal Básico", descripcion: "Cristal oftálmico monofocal básico para monturas estándar, material CR-39 resistente", precio: 1, categoria: "opticos", subcategoria: "monofocales", stock: 0, marca: "BasicLens", codigoSKU: "BL-MONO-01", activo: false, oferta: false, descuento: 0 },
    { nombre: "Colección Diamante Swarovski Exclusive", descripcion: "Gafas de colección con cristales Swarovski incrustados pieza exclusiva edición numerada", precio: 999999999, categoria: "sol", subcategoria: "clasicos", stock: 1, marca: "Swarovski", codigoSKU: "SWK-DIAMANTE", activo: true, oferta: false, descuento: 0 },
    { nombre: "Lentes Contact Solution 360ml", descripcion: "Solución multiuso para limpieza y almacenamiento de lentes de contacto durante la noche", precio: 8990, categoria: "accesorios", subcategoria: "", stock: 9999, marca: "ContactCare", codigoSKU: "CC-SOL-360", activo: true, oferta: true, descuento: 100 },
    { nombre: "Clip-On Magnético Polarizado", descripcion: "Clip magnético polarizado que se adapta sobre lentes ópticos, convierte en lentes de sol", precio: 19990, categoria: "accesorios", subcategoria: "", stock: 45, marca: "MagClip", codigoSKU: "MC-CLIP-POL", activo: true, oferta: true, descuento: 5 },
    { nombre: "Gafas Tom Ford FT5178 Rectangular", descripcion: "Montura rectangular en acetato negro con el icónico detalle dorado lateral Tom Ford", precio: 349990, categoria: "opticos", subcategoria: "graduados", stock: 6, marca: "Tom Ford", codigoSKU: "TF-5178-RCT", activo: true, oferta: false, descuento: 0 },
];

// Products that SHOULD fail validation
const INVALID_PRODUCTS = [
    { label: "Sin nombre", data: { descripcion: "Producto sin campo nombre para probar validacion requerida", precio: 10000, categoria: "sol", stock: 5, marca: "Test", codigoSKU: "TST-NO-NAME" }, expectedError: "nombre" },
    { label: "Sin precio", data: { nombre: "Producto Sin Precio", descripcion: "Producto sin campo precio para probar validacion requerida", categoria: "sol", stock: 5, marca: "Test", codigoSKU: "TST-NO-PRICE" }, expectedError: "precio" },
    { label: "Descripción < 10 chars", data: { nombre: "Test Desc Corta", descripcion: "Corta", precio: 10000, categoria: "sol", stock: 5, marca: "Test", codigoSKU: "TST-DESC-SHORT" }, expectedError: "descripcion" },
    { label: "Precio negativo", data: { nombre: "Precio Negativo Test", descripcion: "Producto con precio negativo para probar limite inferior", precio: -100, categoria: "sol", stock: 5, marca: "Test", codigoSKU: "TST-PRICE-NEG" }, expectedError: "precio" },
    { label: "Stock negativo", data: { nombre: "Stock Negativo Test", descripcion: "Producto con stock negativo para probar que la validacion lo rechaza", precio: 10000, categoria: "sol", stock: -5, marca: "Test", codigoSKU: "TST-STOCK-NEG" }, expectedError: "stock" },
    { label: "Categoría inválida", data: { nombre: "Categoria Invalida Test", descripcion: "Producto con categoria que no existe para probar enum validation", precio: 10000, categoria: "electrónica", stock: 5, marca: "Test", codigoSKU: "TST-CAT-INV" }, expectedError: "categoria" },
    { label: "SKU duplicado (de #1)", data: { nombre: "SKU Duplicado Test", descripcion: "Producto con SKU que ya existe para probar unique constraint", precio: 10000, categoria: "sol", stock: 5, marca: "Test", codigoSKU: "RB-5228-BLK" }, expectedError: "codigoSKU" },
    { label: "Sin marca", data: { nombre: "Sin Marca Test", descripcion: "Producto sin marca para verificar que es campo requerido", precio: 10000, categoria: "sol", stock: 5, codigoSKU: "TST-NO-MARCA" }, expectedError: "marca" },
    { label: "Sin stock", data: { nombre: "Sin Stock Field Test", descripcion: "Producto sin campo stock para verificar que es requerido", precio: 10000, categoria: "sol", marca: "Test", codigoSKU: "TST-NO-STOCK" }, expectedError: "stock" },
    { label: "Sin SKU", data: { nombre: "Sin SKU Test", descripcion: "Producto sin codigo SKU para verificar que es requerido", precio: 10000, categoria: "sol", stock: 5, marca: "Test" }, expectedError: "codigoSKU" },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
    console.log("╔══════════════════════════════════════════════════════╗");
    console.log("║   SEED PRODUCTOS — Óptica Danniels                  ║");
    console.log("╚══════════════════════════════════════════════════════╝\n");

    // 1. Login
    console.log("→ Autenticando como admin...");
    const loginRes = await httpRequest("POST", "/api/auth/login", {
        email: LOGIN_EMAIL,
        password: LOGIN_PASS,
    });

    if (loginRes.status !== 200) {
        console.error("✗ Login falló:", JSON.stringify(loginRes.body));
        console.error("\n  Asegúrate de que el usuario seed existe. Ejecuta:");
        console.error("  node -e \"... INSERT INTO users ...\"");
        process.exit(1);
    }

    const token = loginRes.body.data.token;
    console.log("✓ Login exitoso. Token obtenido.\n");

    // 2. Get a sample image from existing uploads
    const uploadsDir = path.resolve(__dirname, "../../uploads/productos");
    let sampleImage = null;
    let sampleImageName = "sample.jpg";
    try {
        const files = fs.readdirSync(uploadsDir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
        if (files.length > 0) {
            sampleImage = fs.readFileSync(path.join(uploadsDir, files[0]));
            sampleImageName = files[0];
            console.log(`→ Usando imagen existente: ${files[0]} (${(sampleImage.length / 1024).toFixed(1)} KB)\n`);
        }
    } catch {
        console.log("→ No se encontraron imágenes existentes, creando productos sin imagen.\n");
    }

    // 3. Create valid products
    console.log("━━━ FASE 1: PRODUCTOS VÁLIDOS (25) ━━━\n");
    const results = { ok: 0, fail: 0, details: [] };

    for (let i = 0; i < VALID_PRODUCTS.length; i++) {
        const p = VALID_PRODUCTS[i];
        const num = String(i + 1).padStart(2, "0");

        // Always use multipart (multer on the route expects it)
        const useImage = sampleImage && i % 3 !== 2;
        const boundary = "----SeedBoundary" + Date.now() + i;
        const bodyBuf = buildMultipartBody(
            p,
            useImage ? sampleImage : null,
            useImage ? sampleImageName : null,
            boundary
        );
        const res = await httpRequest("POST", "/api/productos", bodyBuf, {
            Authorization: `Bearer ${token}`,
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "Content-Length": bodyBuf.length,
        });

        const ok = res.status === 201;
        const icon = ok ? "✓" : "✗";
        const tag = useImage ? " [+img]" : "";
        console.log(`  ${icon} #${num} ${p.nombre.substring(0, 50).padEnd(50)} → ${res.status}${tag}`);

        if (ok) results.ok++;
        else results.fail++;

        results.details.push({
            num: i + 1,
            nombre: p.nombre,
            sku: p.codigoSKU,
            status: res.status,
            ok,
            message: ok ? "Creado" : (res.body?.message || res.body?.details || "Error"),
            withImage: useImage,
        });
    }

    // 4. Test invalid products
    console.log("\n━━━ FASE 2: PRODUCTOS INVÁLIDOS (10) — Deben fallar ━━━\n");
    const invalResults = { expectedFail: 0, unexpectedOk: 0, details: [] };

    for (let i = 0; i < INVALID_PRODUCTS.length; i++) {
        const { label, data, expectedError } = INVALID_PRODUCTS[i];
        const num = String(i + 1).padStart(2, "0");

        const boundary = "----SeedInvalid" + Date.now() + i;
        const bodyBuf = buildMultipartBody(data, null, null, boundary);

        const res = await httpRequest("POST", "/api/productos", bodyBuf, {
            Authorization: `Bearer ${token}`,
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "Content-Length": bodyBuf.length,
        });

        const rejected = res.status >= 400;
        const icon = rejected ? "✓" : "✗";
        console.log(`  ${icon} #${num} ${label.padEnd(30)} → ${res.status} (esperado: 4xx)`);

        if (rejected) invalResults.expectedFail++;
        else invalResults.unexpectedOk++;

        invalResults.details.push({
            num: i + 1,
            label,
            expectedError,
            status: res.status,
            rejected,
            message: typeof res.body === "object" ? (res.body.message || JSON.stringify(res.body.details)) : res.body,
        });
    }

    // 5. Summary
    console.log("\n╔══════════════════════════════════════════════════════╗");
    console.log("║                   RESUMEN                            ║");
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log(`║  Válidos:   ${String(results.ok).padStart(2)} creados / ${String(results.fail).padStart(2)} fallidos (de 25)       ║`);
    console.log(`║  Inválidos: ${String(invalResults.expectedFail).padStart(2)} rechazados / ${String(invalResults.unexpectedOk).padStart(2)} inesperados (de 10) ║`);
    console.log("╚══════════════════════════════════════════════════════╝");

    // 6. Write results JSON
    const outputPath = path.resolve(__dirname, "seed-results.json");
    const report = {
        timestamp: new Date().toISOString(),
        validProducts: results,
        invalidProducts: invalResults,
    };
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`\n→ Resultados guardados en: ${outputPath}`);
}

main().catch((err) => {
    console.error("Error fatal:", err);
    process.exit(1);
});
