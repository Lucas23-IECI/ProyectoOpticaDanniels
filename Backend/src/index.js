"use strict";
import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import indexRoutes from "./routes/index.routes.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import { createInitialUsers } from "./config/initialSetup.js";

async function setupServer() {
    try {
        const app = express();

        app.disable("x-powered-by");

        app.use("/uploads", express.static("uploads"));

        app.use(cors({
            origin: true,
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

        app.use(session({
            secret: cookieKey,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                sameSite: "strict",
            },
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        passportJwtSetup();

        app.use("/api", indexRoutes);

        app.get("/", (_req, res) => {
            res.send("API Óptica Danniels corriendo correctamente.");
        });

        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en ${HOST}:${PORT}/api`);
        });
    } catch (error) {
        console.log("❌ Error en index.js -> setupServer(), el error es: ", error);
    }
}

async function setupAPI() {
    try {
        await connectDB();
        await setupServer();
        await createInitialUsers();
    } catch (error) {
        console.log("❌ Error en index.js -> setupAPI(), el error es: ", error);
    }
}

setupAPI()
    .then(() => console.log("✅ API Iniciada exitosamente"))
    .catch((error) =>
        console.log("❌ Error final en index.js -> setupAPI():", error)
    );
