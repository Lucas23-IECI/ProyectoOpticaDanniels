"use strict";
import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";

import { HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import indexRoutes from "./routes/index.routes.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import { createInitialUsers } from "./config/initialSetup.js";
import { migrateUsers } from "./helpers/migrateUsers.js";
import logger from "./config/logger.js";

async function setupServer() {
    try {
        const app = express();

        app.disable("x-powered-by");

        app.use(helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
        }));

        app.use("/uploads", express.static("uploads"));

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:4173",
            "http://146.83.198.35",
        ];

        app.use(cors({
            origin: (origin, callback) => {
                // Permitir requests sin origin (Postman, curl, server-to-server)
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin)) return callback(null, true);
                return callback(new Error(`Origin ${origin} no permitido por CORS`));
            },
            credentials: true,
        }));

        app.use(
            urlencoded({
                extended: true,
                limit: "1mb",
            })
        );

        app.use(
            json({
                limit: "1mb",
            })
        );

        app.use(cookieParser());
        app.use(morgan("dev"));

        app.use(passport.initialize());

        passportJwtSetup();

        app.use("/api", indexRoutes);

        app.get("/", (_req, res) => {
            res.send("API Óptica Danniels corriendo correctamente.");
        });

        app.listen(PORT, () => {
            logger.info(`✅ Servidor corriendo en ${HOST}:${PORT}/api`);
        });
    } catch (error) {
        logger.error("❌ Error en index.js -> setupServer(), el error es: ", error);
    }
}

async function setupAPI() {
    try {
        await connectDB();
        await setupServer();

        // Intentar crear usuarios iniciales si no existen
        try {
            await createInitialUsers();
        } catch (error) {
            logger.warn("⚠️  Error al crear usuarios iniciales (puede ser que la tabla no exista aún):", error.message);
            logger.info("ℹ️  Esto es normal si es el primer inicio y la base de datos no está inicializada.");
        }

        // Intentar migración solo si no hubo errores graves
        try {
            await migrateUsers();
        } catch (error) {
            logger.warn("⚠️  Error en migración de usuarios:", error.message);
            logger.info("ℹ️  La aplicación continuará funcionando.");
        }

    } catch (error) {
        logger.error("❌ Error en index.js -> setupAPI(), el error es: ", error);
        throw error;
    }
}

setupAPI()
    .then(() => logger.info("✅ API Iniciada exitosamente"))
    .catch((error) =>
        logger.error("❌ Error final en index.js -> setupAPI():", error)
    );
