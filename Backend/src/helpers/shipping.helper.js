"use strict";

/**
 * Tabla de costos de envío por región/comuna.
 * Origen: Av. Manuel Rodríguez 426, Chiguayante, Biobío.
 *
 * Se mantiene como mapa para búsqueda O(1).
 * Costo en CLP. 0 = gratis (Gran Concepción).
 */

const ENVIO_POR_REGION = {
  "Arica y Parinacota": { base: 8990, extra: 9990 },
  "Tarapacá":           { base: 8990, extra: 9990 },
  "Antofagasta":        { base: 7990, extra: 8990 },
  "Atacama":            { base: 6990, extra: 7490 },
  "Coquimbo":           { base: 5990, extra: 6490 },
  "Valparaíso":         { base: 4990, extra: 5490 },
  "Metropolitana de Santiago": { base: 3990, extra: 4490 },
  "O'Higgins":          { base: 3490, extra: 3990 },
  "Maule":              { base: 2990, extra: 2990 },
  "Ñuble":              { base: 1990, extra: 2490 },
  "Biobío":             { base: 0,    extra: 1490 },
  "La Araucanía":       { base: 2990, extra: 3490 },
  "Los Ríos":           { base: 3490, extra: 3990 },
  "Los Lagos":          { base: 3990, extra: 4990 },
  "Aysén":              { base: 7990, extra: 8990 },
  "Magallanes":         { base: 9990, extra: 10990 },
};

/** Comunas del Gran Concepción — envío gratis */
const COMUNAS_GRATIS = new Set([
  "Chiguayante",
  "Concepción",
  "Hualpén",
  "Penco",
  "San Pedro de la Paz",
  "Talcahuano",
]);

/** Comunas cercanas — tarifa reducida */
const COMUNAS_CERCANAS = {
  "Coronel": 990,
  "Hualqui": 990,
  "Lota": 990,
  "Santa Juana": 990,
  "Tomé": 990,
};

/**
 * Calcula el costo de envío basado en región y comuna.
 * @param {string} region - Nombre de la región
 * @param {string} comuna - Nombre de la comuna
 * @returns {{ costoEnvio: number, zona: string }}
 */
export function calcularCostoEnvio(region, comuna) {
  if (!region) {
    return { costoEnvio: 0, zona: "desconocida" };
  }

  // Biobío tiene lógica especial por cercanía a la tienda
  if (region === "Biobío") {
    if (COMUNAS_GRATIS.has(comuna)) {
      return { costoEnvio: 0, zona: "gran_concepcion" };
    }
    if (COMUNAS_CERCANAS[comuna] !== undefined) {
      return { costoEnvio: COMUNAS_CERCANAS[comuna], zona: "cercana" };
    }
    return { costoEnvio: 1490, zona: "regional" };
  }

  const datos = ENVIO_POR_REGION[region];
  if (!datos) {
    return { costoEnvio: 5990, zona: "desconocida" };
  }

  return { costoEnvio: datos.base, zona: "nacional" };
}

/**
 * Retorna las regiones disponibles para envío.
 */
export function obtenerRegionesEnvio() {
  return Object.keys(ENVIO_POR_REGION).map((nombre) => ({
    nombre,
    costoBase: ENVIO_POR_REGION[nombre].base,
  }));
}
