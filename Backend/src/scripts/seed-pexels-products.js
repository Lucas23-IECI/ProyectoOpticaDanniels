/* eslint-disable max-len, no-console */
/**
 * seed-pexels-products.js — Descarga fotos de Pexels y crea 50 productos con 5 imágenes c/u
 *
 * Uso:
 *   node src/scripts/seed-pexels-products.js
 *
 * Requisitos:
 *   - PostgreSQL corriendo con la base de datos ProyectoOpticaDanniels
 *   - Las tablas productos y producto_imagenes deben existir
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ──────────────────────────────────────────────────
const PEXELS_API_KEY = "uBGFCRVEjXeW09BzuXaWrCufndzDt27q1wiGdGJ2gL2PGFlwPVjjoQiy";
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads/productos");
const DB_CONFIG = {
    host: "localhost",
    port: 5432,
    user: "lucas23",
    password: "lucas2323",
    database: "ProyectoOpticaDanniels",
};

// Images per product
const IMAGES_PER_PRODUCT = 5;

// ─── 50 Products Definition ──────────────────────────────────

const PRODUCTS = [
    // ═══ ÓPTICOS - Graduados (12) ═══
    { nombre: "Ray-Ban RB5154 Clubmaster Optics", descripcion: "Montura icónica Clubmaster con parte superior en acetato y marco inferior en metal pulido, perfecta para un look intelectual y sofisticado", precio: 119990, categoria: "opticos", subcategoria: "graduados", stock: 35, marca: "Ray-Ban", codigoSKU: "RB-5154-CLB", genero: "unisex", material: "Acetato y metal", forma: "Browline", color_armazon: "Negro/Dorado" },
    { nombre: "Oakley Pitchman R Carbon", descripcion: "Montura ultraligera en O-Matter con detalles en fibra de carbono, diseñada para máxima comodidad durante todo el día", precio: 159990, categoria: "opticos", subcategoria: "graduados", stock: 20, marca: "Oakley", codigoSKU: "OAK-PITCH-CB", genero: "hombre", material: "O-Matter", forma: "Rectangular", color_armazon: "Gris carbón" },
    { nombre: "Dolce & Gabbana DG3349 Floral", descripcion: "Elegante montura femenina en acetato italiano con sutil estampado floral en las patillas y acabado brillante premium", precio: 229990, categoria: "opticos", subcategoria: "graduados", stock: 12, marca: "Dolce & Gabbana", codigoSKU: "DG-3349-FLR", genero: "mujer", material: "Acetato italiano", forma: "Cat-eye", color_armazon: "Borgoña floral" },
    { nombre: "Persol PO3007V Typewriter Edition", descripcion: "Inspirada en la tradición artesanal italiana, con bisagra Meflecto patentada para ajuste perfecto y comodidad superior", precio: 199990, categoria: "opticos", subcategoria: "graduados", stock: 15, marca: "Persol", codigoSKU: "PO-3007V-TW", genero: "unisex", material: "Acetato", forma: "Redonda", color_armazon: "Habana" },
    { nombre: "Emporio Armani EA3099 Minimal", descripcion: "Diseño minimalista y moderno con montura ligera en metal mate, ideal para el profesional contemporáneo que busca elegancia", precio: 139990, categoria: "opticos", subcategoria: "graduados", stock: 28, marca: "Emporio Armani", codigoSKU: "EA-3099-MIN", genero: "hombre", material: "Metal", forma: "Rectangular", color_armazon: "Gunmetal" },
    { nombre: "Vogue VO5276 Butterfly", descripcion: "Montura femenina estilo butterfly en acetato bicolor con detalles metálicos en las patillas, elegante y versátil para uso diario", precio: 79990, categoria: "opticos", subcategoria: "graduados", stock: 40, marca: "Vogue Eyewear", codigoSKU: "VO-5276-BTF", genero: "mujer", material: "Acetato", forma: "Butterfly", color_armazon: "Rosa/Transparente" },
    { nombre: "Hugo Boss BOSS 1265 Executive", descripcion: "Montura premium en titanio con diseño ejecutivo sobrio, ultraligera con almohadillas de silicona ajustables para máximo confort", precio: 189990, categoria: "opticos", subcategoria: "graduados", stock: 18, marca: "Hugo Boss", codigoSKU: "HB-1265-EXE", genero: "hombre", material: "Titanio", forma: "Rectangular", color_armazon: "Negro mate" },
    { nombre: "Kate Spade Atalina/F", descripcion: "Montura oversized con estampado de confetti característico de Kate Spade, lúdica y femenina con detalles de cristal", precio: 129990, categoria: "opticos", subcategoria: "graduados", stock: 22, marca: "Kate Spade", codigoSKU: "KS-ATAL-CF", genero: "mujer", material: "Acetato", forma: "Cuadrada", color_armazon: "Negro confetti" },
    { nombre: "Puma PU0259O Sport Lifestyle", descripcion: "Montura deportiva urbana con gomas antideslizantes en las patillas y puente, ideal para estilos de vida activos", precio: 69990, categoria: "opticos", subcategoria: "graduados", stock: 45, marca: "Puma", codigoSKU: "PU-0259O-SP", genero: "unisex", material: "TR90", forma: "Rectangular", color_armazon: "Azul/Negro" },
    { nombre: "Silhouette Titan Minimal Art", descripcion: "La montura al aire más ligera del mundo, sin marco ni tornillos, pesa solo 1.8 gramos con tecnología austriaca de punta", precio: 399990, categoria: "opticos", subcategoria: "graduados", stock: 5, marca: "Silhouette", codigoSKU: "SIL-TITAN-MA", genero: "unisex", material: "Titanio", forma: "Ovalada", color_armazon: "Oro rosa" },
    { nombre: "Tommy Hilfiger TH 1813 Classic", descripcion: "Diseño clásico americano con franja tricolor característica en las patillas, combinando acetato y metal con estilo preppy", precio: 99990, categoria: "opticos", subcategoria: "graduados", stock: 30, marca: "Tommy Hilfiger", codigoSKU: "TH-1813-CLS", genero: "unisex", material: "Acetato y metal", forma: "Rectangular", color_armazon: "Azul marino" },
    { nombre: "Lacoste L2852 Petit Piqué", descripcion: "Montura inspirada en la elegancia deportiva de Lacoste con textura petit piqué en las patillas y acabado premium", precio: 109990, categoria: "opticos", subcategoria: "graduados", stock: 25, marca: "Lacoste", codigoSKU: "LC-2852-PQ", genero: "hombre", material: "Acetato", forma: "Rectangular", color_armazon: "Verde oscuro" },

    // ═══ ÓPTICOS - Progresivos (3) ═══
    { nombre: "Varilux Comfort Max Progressive", descripcion: "Lentes progresivos premium con la tecnología más avanzada de Essilor, visión nítida a todas las distancias sin esfuerzo", precio: 349990, categoria: "opticos", subcategoria: "progresivos", stock: 8, marca: "Essilor", codigoSKU: "ESS-VRLX-MAX", genero: "unisex", material: "Policarbonato", forma: "Rectangular", color_armazon: "Negro" },
    { nombre: "Zeiss SmartLife Progressive", descripcion: "Progresivos de última generación diseñados para el uso intensivo de dispositivos digitales, con tecnología SmartView de Zeiss", precio: 449990, categoria: "opticos", subcategoria: "progresivos", stock: 6, marca: "Zeiss", codigoSKU: "ZS-SMART-PRG", genero: "unisex", material: "Mineral", forma: "Ovalada", color_armazon: "Dorado" },
    { nombre: "Hoya iD MySelf Progressive", descripcion: "Progresivos personalizados con medición binocular 3D para una adaptación instantánea y campos visuales amplios", precio: 389990, categoria: "opticos", subcategoria: "progresivos", stock: 7, marca: "Hoya", codigoSKU: "HY-IDMY-PRG", genero: "unisex", material: "Trivex", forma: "Cuadrada", color_armazon: "Gris" },

    // ═══ ÓPTICOS - Lectura (2) ═══
    { nombre: "Lentes Lectura Premium Flexibles +2.0", descripcion: "Lentes de lectura con montura ultra flexible TR90, ideales para presbicia con tratamiento antirreflejante incluido", precio: 19990, categoria: "opticos", subcategoria: "lectura", stock: 100, marca: "OptiHouse", codigoSKU: "OH-LECT-20F", genero: "unisex", material: "TR90", forma: "Rectangular", color_armazon: "Negro" },
    { nombre: "Lentes Lectura Retro Redondos +1.5", descripcion: "Estilo vintage redondo en metal dorado para lectura, ligeros y cómodos con almohadillas de silicona suave", precio: 14990, categoria: "opticos", subcategoria: "lectura", stock: 80, marca: "OptiHouse", codigoSKU: "OH-LECT-15R", genero: "unisex", material: "Metal", forma: "Redonda", color_armazon: "Dorado" },

    // ═══ SOL - Clásicos (10) ═══
    { nombre: "Ray-Ban Aviator Classic RB3025", descripcion: "El ícono absoluto en gafas de sol, montura dorada con cristales verdes G-15 que definen el estilo desde 1937", precio: 189990, categoria: "sol", subcategoria: "clasicos", stock: 40, marca: "Ray-Ban", codigoSKU: "RB-3025-AVI", genero: "unisex", material: "Metal", forma: "Aviador", color_armazon: "Dorado", color_cristal: "Verde G-15", polarizado: false },
    { nombre: "Ray-Ban Wayfarer Original RB2140", descripcion: "Las gafas más reconocidas del mundo, diseño atemporal en acetato negro con cristales verdes clásicos G-15", precio: 169990, categoria: "sol", subcategoria: "clasicos", stock: 35, marca: "Ray-Ban", codigoSKU: "RB-2140-WAY", genero: "unisex", material: "Acetato", forma: "Wayfarer", color_armazon: "Negro", color_cristal: "Verde G-15", polarizado: false },
    { nombre: "Gucci GG1169S Chain Temple", descripcion: "Gafas de sol de lujo con detalle de cadena dorada en las patillas, cristales degradados marrón y montura en acetato premium", precio: 489990, categoria: "sol", subcategoria: "clasicos", stock: 4, marca: "Gucci", codigoSKU: "GUC-1169S-CH", genero: "mujer", material: "Acetato", forma: "Oversized", color_armazon: "Habana", color_cristal: "Marrón degradado", polarizado: false },
    { nombre: "Prada PR 17WS Symbole", descripcion: "De la colección Symbole, diseño geométrico vanguardista con el triángulo icónico de Prada grabado en las patillas", precio: 429990, categoria: "sol", subcategoria: "clasicos", stock: 6, marca: "Prada", codigoSKU: "PRA-17WS-SYM", genero: "mujer", material: "Acetato", forma: "Geométrica", color_armazon: "Negro", color_cristal: "Gris oscuro", polarizado: false },
    { nombre: "Tom Ford FT0996 Whitney Oversized", descripcion: "Oversized en acetato con el emblemático detalle T en metal dorado, sofisticación y glamour para cualquier ocasión", precio: 379990, categoria: "sol", subcategoria: "clasicos", stock: 8, marca: "Tom Ford", codigoSKU: "TF-0996-WHT", genero: "mujer", material: "Acetato", forma: "Oversized", color_armazon: "Negro brillante", color_cristal: "Gris degradado", polarizado: false },
    { nombre: "Versace VE4361 Biggie", descripcion: "Gafas bold con el Medusa dorado en relieve, acetato grueso y cristales oscuros para un statement de moda único", precio: 359990, categoria: "sol", subcategoria: "clasicos", stock: 7, marca: "Versace", codigoSKU: "VRS-4361-BIG", genero: "unisex", material: "Acetato", forma: "Cuadrada", color_armazon: "Negro/Dorado", color_cristal: "Gris oscuro", polarizado: false },
    { nombre: "Carrera 1047/S Navigator", descripcion: "Estilo navigator deportivo con doble puente metálico, herencia racing de Carrera en un diseño urbano y contemporáneo", precio: 149990, categoria: "sol", subcategoria: "clasicos", stock: 20, marca: "Carrera", codigoSKU: "CAR-1047-NAV", genero: "hombre", material: "Metal", forma: "Navigator", color_armazon: "Negro mate", color_cristal: "Gris", polarizado: true },
    { nombre: "Dior DiorBlackSuit S12I", descripcion: "Elegancia parisina con montura en acetato oscuro y el detalle CD Icon distintivo, cristales minerales de alta definición", precio: 459990, categoria: "sol", subcategoria: "clasicos", stock: 3, marca: "Dior", codigoSKU: "DIOR-BS-S12", genero: "hombre", material: "Acetato", forma: "Rectangular", color_armazon: "Negro", color_cristal: "Gris", polarizado: false },
    { nombre: "Celine CL40187I Bold Round", descripcion: "Redondas oversized en acetato grueso, estética minimalista francesa con cristales orgánicos, perfecto para rostros ovalados", precio: 399990, categoria: "sol", subcategoria: "clasicos", stock: 5, marca: "Celine", codigoSKU: "CEL-40187-BR", genero: "mujer", material: "Acetato", forma: "Redonda", color_armazon: "Habana oscuro", color_cristal: "Marrón", polarizado: false },
    { nombre: "Saint Laurent SL 1/F Classic Flat Top", descripcion: "Flat top icónico con líneas rectas minimalistas, acetato premium y cristales de máxima claridad óptica", precio: 369990, categoria: "sol", subcategoria: "clasicos", stock: 9, marca: "Saint Laurent", codigoSKU: "YSL-SL1F-FT", genero: "unisex", material: "Acetato", forma: "Flat top", color_armazon: "Negro", color_cristal: "Gris", polarizado: false },

    // ═══ SOL - Deportivos (5) ═══
    { nombre: "Oakley Radar EV Path Prizm Road", descripcion: "Lentes deportivos de alto rendimiento con tecnología Prizm que realza los contrastes del asfalto y señalización vial", precio: 259990, categoria: "sol", subcategoria: "deportivos", stock: 18, marca: "Oakley", codigoSKU: "OAK-RADEV-PRZ", genero: "unisex", material: "O-Matter", forma: "Envolvente", color_armazon: "Negro mate", color_cristal: "Prizm Road", polarizado: false },
    { nombre: "Oakley Sutro S Matte Black", descripcion: "Pantalla envolvente con tecnología Prizm Black para luz intensa, diseño bold inspirado en la arquitectura de San Francisco", precio: 219990, categoria: "sol", subcategoria: "deportivos", stock: 22, marca: "Oakley", codigoSKU: "OAK-SUTRO-MB", genero: "unisex", material: "O-Matter", forma: "Pantalla", color_armazon: "Negro mate", color_cristal: "Prizm Black", polarizado: false },
    { nombre: "Maui Jim Peahi Polarizado Plus", descripcion: "Polarizados premium para deportes náuticos con tecnología PolarizedPlus2 que elimina al cien por ciento los reflejos del agua", precio: 339990, categoria: "sol", subcategoria: "deportivos", stock: 10, marca: "Maui Jim", codigoSKU: "MJ-PEAHI-PP", genero: "hombre", material: "Nylon", forma: "Envolvente", color_armazon: "Negro brillante", color_cristal: "Gris neutro", polarizado: true },
    { nombre: "Smith Bobcat ChromaPop", descripcion: "Lentes ciclismo con tecnología ChromaPop que filtra la luz para colores más vivos y detalles más nítidos en el camino", precio: 179990, categoria: "sol", subcategoria: "deportivos", stock: 15, marca: "Smith Optics", codigoSKU: "SMT-BOBCAT-CP", genero: "unisex", material: "TR90", forma: "Pantalla", color_armazon: "Mate negro", color_cristal: "ChromaPop Sun Black", polarizado: false },
    { nombre: "Bolle Shifter Phantom Court", descripcion: "Diseñados para running con lentes fotocromáticos Phantom que se adaptan automáticamente a las condiciones de luz", precio: 159990, categoria: "sol", subcategoria: "deportivos", stock: 14, marca: "Bolle", codigoSKU: "BOL-SHIFT-PC", genero: "unisex", material: "TR90", forma: "Envolvente", color_armazon: "Negro/Rojo", color_cristal: "Phantom Court", polarizado: false },

    // ═══ ACCESORIOS (13) ═══
    { nombre: "Estuche Rígido Premium Cuero Italiano", descripcion: "Estuche protector rígido artesanal en cuero genuino italiano con forro de terciopelo suave, cierre magnético premium", precio: 29990, categoria: "accesorios", subcategoria: "", stock: 60, marca: "OptiHouse", codigoSKU: "OH-EST-CUIT", genero: "unisex", material: "Cuero italiano" },
    { nombre: "Estuche Deportivo Neopreno con Clip", descripcion: "Estuche semi rígido en neopreno resistente al agua con clip de cinturón integrado, ideal para deportes y viajes", precio: 14990, categoria: "accesorios", subcategoria: "", stock: 80, marca: "SportVision", codigoSKU: "SV-EST-NEO", genero: "unisex", material: "Neopreno" },
    { nombre: "Paño Microfibra Premium Pack x5", descripcion: "Set de cinco paños de microfibra ultra suave de doble cara para limpieza sin rayar, colores surtidos tamaño generoso", precio: 6990, categoria: "accesorios", subcategoria: "", stock: 200, marca: "OptiClean", codigoSKU: "OC-PANO-5PK", genero: "unisex" },
    { nombre: "Spray Limpiador Antiempañante 60ml", descripcion: "Solución limpiadora profesional con efecto antiempañante de larga duración, seguro para todo tipo de cristales y tratamientos", precio: 8990, categoria: "accesorios", subcategoria: "", stock: 150, marca: "OptiClean", codigoSKU: "OC-SPRAY-60", genero: "unisex" },
    { nombre: "Kit Limpieza Completo Profesional", descripcion: "Kit completo con spray limpiador de 120ml, dos paños de microfibra, destornillador de precisión y estuche organizador", precio: 15990, categoria: "accesorios", subcategoria: "", stock: 70, marca: "OptiClean", codigoSKU: "OC-KIT-PRO", genero: "unisex" },
    { nombre: "Cordón Cadena Dorada Elegante", descripcion: "Cadena porta gafas en metal dorado con enganche universal de silicona, añade un toque glamuroso y funcional a tus lentes", precio: 12990, categoria: "accesorios", subcategoria: "", stock: 55, marca: "AureaChain", codigoSKU: "AC-CORD-GLD", genero: "mujer", material: "Metal dorado" },
    { nombre: "Cordón Deportivo Neopreno Ajustable", descripcion: "Cordón deportivo en neopreno flotante con sistema de ajuste rápido, ideal para deportes acuáticos y actividades al aire libre", precio: 7990, categoria: "accesorios", subcategoria: "", stock: 90, marca: "SportVision", codigoSKU: "SV-CORD-ADJ", genero: "unisex", material: "Neopreno" },
    { nombre: "Almohadillas Nasales Silicona x10 Pares", descripcion: "Pack de diez pares de almohadillas nasales de silicona hipo alergénica con sistema push-in universal para mayor comodidad", precio: 4990, categoria: "accesorios", subcategoria: "", stock: 300, marca: "FixOptic", codigoSKU: "FO-ALM-10PR", genero: "unisex" },
    { nombre: "Kit Reparación Óptica Profesional", descripcion: "Kit de reparación con destornilladores de precisión, pinzas, tornillos surtidos, almohadillas y lupa, todo en estuche compacto", precio: 11990, categoria: "accesorios", subcategoria: "", stock: 45, marca: "FixOptic", codigoSKU: "FO-KIT-PRF", genero: "unisex" },
    { nombre: "Clip-On Magnético Polarizado Universal", descripcion: "Clip magnético polarizado de alta definición que convierte tus lentes ópticos en gafas de sol, fácil colocación instantánea", precio: 24990, categoria: "accesorios", subcategoria: "", stock: 35, marca: "MagClip", codigoSKU: "MC-CLIP-UNV", genero: "unisex", color_cristal: "Gris", polarizado: true },
    { nombre: "Funda de Viaje Multi-Gafa (3 pares)", descripcion: "Organizador de viaje premium para tres pares de gafas con compartimentos acolchados individuales y cierre de cremallera", precio: 19990, categoria: "accesorios", subcategoria: "", stock: 25, marca: "OptiHouse", codigoSKU: "OH-FUNDA-3P", genero: "unisex", material: "Nylon balístico" },
    { nombre: "Toallitas Húmedas Limpia Lentes x100", descripcion: "Cien toallitas húmedas individuales prehumedecidas con solución antivaho para limpieza rápida en cualquier momento y lugar", precio: 9990, categoria: "accesorios", subcategoria: "", stock: 120, marca: "OptiClean", codigoSKU: "OC-TOALL-100", genero: "unisex" },
    { nombre: "Soporte Exhibidor de Madera Bambú", descripcion: "Soporte exhibidor artesanal en bambú natural para tres pares de gafas, perfecto para tocador o escritorio con diseño elegante", precio: 16990, categoria: "accesorios", subcategoria: "", stock: 30, marca: "OptiHouse", codigoSKU: "OH-SOP-BAMB", genero: "unisex", material: "Bambú" },

    // ═══ EXTRAS para completar 50 ═══
    { nombre: "Michael Kors MK4030 Vianna Cat-Eye", descripcion: "Elegante montura cat-eye femenina en acetato con el logo MK grabado en las patillas, sofisticación y estilo moderno", precio: 149990, categoria: "opticos", subcategoria: "graduados", stock: 16, marca: "Michael Kors", codigoSKU: "MK-4030-VIA", genero: "mujer", material: "Acetato", forma: "Cat-eye", color_armazon: "Borgoña" },
    { nombre: "Nike 7090 Flexon Deportivo", descripcion: "Montura deportiva ultraligera con tecnología Flexon que retorna siempre a su forma original, ideal para uso diario activo", precio: 89990, categoria: "opticos", subcategoria: "graduados", stock: 32, marca: "Nike", codigoSKU: "NK-7090-FLX", genero: "hombre", material: "Flexon", forma: "Rectangular", color_armazon: "Negro mate" },
    { nombre: "Ray-Ban Round Metal RB3447 Lennon", descripcion: "Las clásicas gafas redondas inspiradas en John Lennon, montura en metal dorado con cristales verdes minerales", precio: 179990, categoria: "sol", subcategoria: "clasicos", stock: 25, marca: "Ray-Ban", codigoSKU: "RB-3447-RND", genero: "unisex", material: "Metal", forma: "Redonda", color_armazon: "Dorado", color_cristal: "Verde G-15", polarizado: false },
    { nombre: "Oakley Holbrook XL Prizm Polarizado", descripcion: "Versión oversized del icónico Holbrook con lentes Prizm polarizados para máxima definición y reducción de reflejos", precio: 229990, categoria: "sol", subcategoria: "deportivos", stock: 18, marca: "Oakley", codigoSKU: "OAK-HOLB-XLP", genero: "hombre", material: "O-Matter", forma: "Cuadrada", color_armazon: "Negro mate", color_cristal: "Prizm Black", polarizado: true },
    { nombre: "Estuche Plegable Ultra Compacto", descripcion: "Estuche plegable ultra delgado que se aplana completamente para llevar en el bolsillo, con interior de microfibra suave", precio: 11990, categoria: "accesorios", subcategoria: "", stock: 65, marca: "OptiHouse", codigoSKU: "OH-EST-PLEG", genero: "unisex", material: "PU Leather" },
];

// Search queries for Pexels — varied to get diverse images
const SEARCH_QUERIES = [
    // Optical frames
    "eyeglasses on white background",
    "prescription glasses close up",
    "reading glasses elegant",
    "optical frames fashion",
    "designer eyewear display",
    "eyeglasses face portrait",
    "modern eyeglasses",
    "vintage eyeglasses",
    "round eyeglasses",
    "rectangular glasses",
    // Sunglasses
    "sunglasses fashion",
    "aviator sunglasses",
    "designer sunglasses",
    "luxury sunglasses close up",
    "sport sunglasses",
    "sunglasses outdoor",
    "sunglasses portrait woman",
    "sunglasses portrait man",
    "cat eye sunglasses",
    "wayfarer sunglasses",
    // Accessories
    "glasses case leather",
    "eyeglasses accessories",
    "cleaning glasses cloth",
    "glasses display stand",
    "eyewear collection",
];

// ─── Helpers ──────────────────────────────────────────────────

function httpsGet(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Follow redirect
                return httpsGet(res.headers.location, headers).then(resolve).catch(reject);
            }
            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                const buffer = Buffer.concat(chunks);
                resolve({ status: res.statusCode, headers: res.headers, buffer });
            });
        });
        req.on("error", reject);
        req.setTimeout(30000, () => { req.destroy(); reject(new Error("Timeout")); });
    });
}

async function searchPexels(query, perPage = 15, page = 1) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=landscape`;
    const res = await httpsGet(url, { Authorization: PEXELS_API_KEY });
    if (res.status !== 200) {
        throw new Error(`Pexels API error ${res.status}: ${res.buffer.toString()}`);
    }
    return JSON.parse(res.buffer.toString());
}

async function downloadImage(url, destPath) {
    const res = await httpsGet(url);
    if (res.status !== 200) {
        throw new Error(`Download failed ${res.status}`);
    }
    fs.writeFileSync(destPath, res.buffer);
    return res.buffer.length;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ─── Database (direct pg, no ORM) ────────────────────────────

let pg;
try {
    pg = await import("pg");
} catch {
    console.error("❌ Necesitas instalar pg: npm install pg");
    process.exit(1);
}

const { Client } = pg.default || pg;

async function getDbClient() {
    const client = new Client(DB_CONFIG);
    await client.connect();
    return client;
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║  SEED PEXELS — 50 Productos × 5 Imágenes = 250 fotos     ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");

    // 1. Ensure uploads directory
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });

    // 2. Collect images from Pexels
    console.log("━━━ FASE 1: Descargando imágenes de Pexels ━━━\n");

    const allImageUrls = [];

    for (let i = 0; i < SEARCH_QUERIES.length; i++) {
        const query = SEARCH_QUERIES[i];
        process.stdout.write(`  🔍 [${i + 1}/${SEARCH_QUERIES.length}] "${query}"...`);

        try {
            const result = await searchPexels(query, 15, 1);
            const photos = result.photos || [];
            for (const photo of photos) {
                allImageUrls.push({
                    url: photo.src.medium, // ~350x200, good quality, fast download
                    photographer: photo.photographer,
                    id: photo.id,
                });
            }
            console.log(` ${photos.length} fotos`);
        } catch (err) {
            console.log(` ❌ Error: ${err.message}`);
        }

        // Rate limit: max 200 req/hour → be safe
        await sleep(400);
    }

    console.log(`\n  📸 Total imágenes recolectadas: ${allImageUrls.length}`);

    // We need 250 images (50 products × 5 each). Shuffle and pick.
    const needed = PRODUCTS.length * IMAGES_PER_PRODUCT;
    if (allImageUrls.length < needed) {
        console.log(`  ⚠️  Solo hay ${allImageUrls.length} imágenes, se reutilizarán algunas`);
    }

    // Shuffle
    for (let i = allImageUrls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allImageUrls[i], allImageUrls[j]] = [allImageUrls[j], allImageUrls[i]];
    }

    // 3. Download images to disk
    console.log("\n━━━ FASE 2: Descargando imágenes a disco ━━━\n");

    const downloadedPaths = []; // Array of arrays: [[img1,img2,...], [img1,...], ...]
    let downloadCount = 0;
    let downloadErrors = 0;

    for (let p = 0; p < PRODUCTS.length; p++) {
        const productImages = [];
        process.stdout.write(`  📦 Producto ${String(p + 1).padStart(2, "0")}/50: `);

        for (let img = 0; img < IMAGES_PER_PRODUCT; img++) {
            const idx = (p * IMAGES_PER_PRODUCT + img) % allImageUrls.length;
            const imageData = allImageUrls[idx];
            const fileName = `prod${String(p + 1).padStart(2, "0")}_img${img + 1}_${imageData.id}.jpg`;
            const filePath = path.join(UPLOADS_DIR, fileName);

            // Skip if already downloaded
            if (fs.existsSync(filePath)) {
                productImages.push(fileName);
                process.stdout.write("·");
                downloadCount++;
                continue;
            }

            try {
                await downloadImage(imageData.url, filePath);
                productImages.push(fileName);
                downloadCount++;
                process.stdout.write("✓");
                await sleep(200); // Be nice to Pexels
            } catch (err) {
                downloadErrors++;
                process.stdout.write("✗");
            }
        }

        downloadedPaths.push(productImages);
        console.log(` (${productImages.length} imágenes)`);
    }

    console.log(`\n  ✅ Descargadas: ${downloadCount} | ❌ Errores: ${downloadErrors}`);

    // 4. Insert into database
    console.log("\n━━━ FASE 3: Insertando productos en la base de datos ━━━\n");

    const db = await getDbClient();

    try {
        // First, clean existing products if user wants fresh start
        const existingCount = await db.query("SELECT COUNT(*) FROM productos");
        console.log(`  📊 Productos existentes: ${existingCount.rows[0].count}`);

        // Delete old images and products
        console.log("  🗑️  Limpiando productos e imágenes anteriores...");
        await db.query("DELETE FROM producto_imagenes");
        await db.query("DELETE FROM productos");
        await db.query("ALTER SEQUENCE productos_id_seq RESTART WITH 1");
        await db.query("ALTER SEQUENCE producto_imagenes_id_seq RESTART WITH 1");
        console.log("  ✓ Base de datos limpia\n");

        let insertedProducts = 0;
        let insertedImages = 0;

        for (let p = 0; p < PRODUCTS.length; p++) {
            const prod = PRODUCTS[p];
            const images = downloadedPaths[p] || [];
            const principalImage = images.length > 0 ? images[0] : null;

            try {
                // Insert product
                const result = await db.query(
                    `INSERT INTO productos (
                        nombre, descripcion, precio, categoria, subcategoria,
                        imagen_url, stock, activo, marca, "codigoSKU",
                        oferta, descuento, genero, material, forma,
                        color_armazon, color_cristal, polarizado, tipo_cristal,
                        "createdAt", "updatedAt"
                    ) VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, $10,
                        $11, $12, $13, $14, $15,
                        $16, $17, $18, $19,
                        NOW(), NOW()
                    ) RETURNING id`,
                    [
                        prod.nombre,
                        prod.descripcion,
                        prod.precio,
                        prod.categoria,
                        prod.subcategoria || "",
                        principalImage,
                        prod.stock,
                        prod.activo !== false,
                        prod.marca,
                        prod.codigoSKU,
                        prod.oferta || false,
                        prod.descuento || 0,
                        prod.genero || "",
                        prod.material || "",
                        prod.forma || "",
                        prod.color_armazon || "",
                        prod.color_cristal || "",
                        prod.polarizado || false,
                        prod.tipo_cristal || "",
                    ]
                );

                const productId = result.rows[0].id;
                insertedProducts++;

                // Insert images
                for (let i = 0; i < images.length; i++) {
                    const imgUrl = images[i];
                    await db.query(
                        `INSERT INTO producto_imagenes (
                            producto_id, imagen_url, posicion, es_principal, "createdAt"
                        ) VALUES ($1, $2, $3, $4, NOW())`,
                        [productId, imgUrl, i, i === 0]
                    );
                    insertedImages++;
                }

                const ofertaTag = prod.oferta ? ` 🏷️${prod.descuento}%` : "";
                console.log(`  ✓ #${String(p + 1).padStart(2, "0")} ${prod.nombre.substring(0, 45).padEnd(45)} | ${prod.categoria.padEnd(10)} | ${images.length} imgs${ofertaTag}`);
            } catch (err) {
                console.log(`  ✗ #${String(p + 1).padStart(2, "0")} ${prod.nombre.substring(0, 45)} → ${err.message}`);
            }
        }

        console.log("\n━━━ RESUMEN ━━━\n");
        console.log(`  📦 Productos insertados: ${insertedProducts}/50`);
        console.log(`  🖼️  Imágenes insertadas:  ${insertedImages}/250`);
        console.log(`  📁 Directorio: ${UPLOADS_DIR}`);

        // Verify
        const finalCount = await db.query("SELECT COUNT(*) FROM productos");
        const imgCount = await db.query("SELECT COUNT(*) FROM producto_imagenes");
        console.log(`\n  🔍 Verificación DB: ${finalCount.rows[0].count} productos, ${imgCount.rows[0].count} imágenes`);

    } finally {
        await db.end();
    }

    console.log("\n✅ ¡Seed completado! Los productos están listos.\n");
}

main().catch((err) => {
    console.error("\n❌ Error fatal:", err);
    process.exit(1);
});
