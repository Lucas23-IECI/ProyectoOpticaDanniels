"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD } from "./configEnv.js";

// Nota: DB_HOST viene del .env. Si no estuviera, caemos a HOST.
const DB_HOST = process.env.DB_HOST || HOST;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: 5432,
    username: `${DB_USERNAME}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    entities: ["src/entity/**/*.js"],
    // IMPORTANTE: no dejar que TypeORM toque el esquema creado por init.sql
    synchronize: false,
    logging: false,
});

export async function connectDB() {
    const MAX_RETRIES = 10;
    const WAIT_MS = 2000;

    for (let i = 1; i <= MAX_RETRIES; i++) {
        try {
            await AppDataSource.initialize();
            console.log("=> Conexión exitosa a la base de datos!");
            return;
        } catch (error) {
            if (i === MAX_RETRIES) {
                console.error("Error al conectar con la base de datos:", error);
                process.exit(1);
            }
            console.log(`Postgres aún no está listo (intento ${i}/${MAX_RETRIES}). Reintentando en ${WAIT_MS} ms...`);
            await new Promise((r) => setTimeout(r, WAIT_MS));
        }
    }
}
