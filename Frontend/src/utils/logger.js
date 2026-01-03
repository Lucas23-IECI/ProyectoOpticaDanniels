/**
 * Logger personalizado para Frontend
 * Solo activo en modo desarrollo
 * En producción, todos los logs están deshabilitados
 */

const isDevelopment = import.meta.env.DEV;

// Prefijo para identificar logs de la aplicación
const APP_PREFIX = '[OpticaDanniels]';

// Colores para diferentes niveles (solo en desarrollo)
const COLORS = {
    log: '#0ea5e9',      // azul cielo
    info: '#10b981',     // verde
    warn: '#f59e0b',     // amarillo/naranja
    error: '#ef4444',    // rojo
    debug: '#8b5cf6',    // púrpura
};

/**
 * Crea un logger con el estilo apropiado
 */
const createLogger = (level, color) => {
    return (...args) => {
        if (!isDevelopment) return; // No hacer nada en producción

        const style = `color: ${color}; font-weight: bold;`;
        console[level](`%c${APP_PREFIX}`, style, ...args);
    };
};

/**
 * Logger principal
 */
const logger = {
    log: createLogger('log', COLORS.log),
    info: createLogger('info', COLORS.info),
    warn: createLogger('warn', COLORS.warn),
    error: createLogger('error', COLORS.error),
    debug: createLogger('debug', COLORS.debug),

    /**
     * Logger para estados de componentes
     */
    state: (...args) => {
        if (!isDevelopment) return;
        const style = `color: ${COLORS.debug}; font-weight: bold;`;
        console.log(`%c${APP_PREFIX} [STATE]`, style, ...args);
    },

    /**
     * Logger para API calls
     */
    api: (...args) => {
        if (!isDevelopment) return;
        const style = `color: ${COLORS.info}; font-weight: bold;`;
        console.log(`%c${APP_PREFIX} [API]`, style, ...args);
    },

    /**
     * Logger para navegación
     */
    nav: (...args) => {
        if (!isDevelopment) return;
        const style = `color: ${COLORS.log}; font-weight: bold;`;
        console.log(`%c${APP_PREFIX} [NAV]`, style, ...args);
    },
};

export default logger;
