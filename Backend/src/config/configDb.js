"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD, DATABASE_URL } from "./configEnv.js";
import logger from "./logger.js";

// Nota: DB_HOST viene del .env. Si no estuviera, caemos a HOST.
const DB_HOST = process.env.DB_HOST || HOST;

// Si DATABASE_URL existe (Neon, Render, etc.), usar conexión directa con SSL.
// Si no, usar variables individuales (desarrollo local / Docker).
const dataSourceOptions = DATABASE_URL
    ? {
        type: "postgres",
        url: DATABASE_URL,
        entities: ["src/entity/**/*.js"],
        synchronize: false,
        logging: false,
        ssl: { rejectUnauthorized: false },
    }
    : {
        type: "postgres",
        host: DB_HOST,
        port: 5432,
        username: `${DB_USERNAME}`,
        password: `${PASSWORD}`,
        database: `${DATABASE}`,
        entities: ["src/entity/**/*.js"],
        synchronize: false,
        logging: false,
    };

export const AppDataSource = new DataSource(dataSourceOptions);

export async function connectDB() {
    const MAX_RETRIES = 10;
    const WAIT_MS = 2000;

    for (let i = 1; i <= MAX_RETRIES; i++) {
        try {
            await AppDataSource.initialize();
            logger.info("=> Conexión exitosa a la base de datos!");
            return;
        } catch (error) {
            if (i === MAX_RETRIES) {
                logger.error("Error al conectar con la base de datos:", error);
                process.exit(1);
            }
            logger.warn(`Postgres aún no está listo (intento ${i}/${MAX_RETRIES}). Reintentando en ${WAIT_MS} ms...`);
            await new Promise((r) => setTimeout(r, WAIT_MS));
        }
    }
}
