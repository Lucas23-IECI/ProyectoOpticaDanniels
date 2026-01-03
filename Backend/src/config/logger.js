import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir niveles de logging
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Definir colores para cada nivel
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

// Formato personalizado
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Formato para consola (más legible)
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}`
    )
);

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../../logs');

// Crear transports (destinos de los logs)
const transports = [
    // Consola - siempre activa
    new winston.transports.Console({
        format: consoleFormat,
    }),
    // Archivo para todos los logs
    new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        format,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
    // Archivo solo para errores
    new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        format,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
];

// Crear logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    format,
    transports,
    exitOnError: false,
});

// Método helper para logging de requests HTTP
logger.http = (message) => {
    logger.log('http', message);
};

export default logger;
