"use strict";
import express, { json, urlencoded } from "express";
import { HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";

async function setupServer() {
    try {
        const app = express();

        app.disable("x-powered-by");

        app.use(
            urlencoded({
                extended: true,
                limit: "1mb",
            }),
        );

        app.use(
            json({
                limit: "1mb",
            }),
        );

        app.get("/", (_req, res) => {
            res.send("API Óptica Danniels corriendo correctamente.");
        });

        app.listen(PORT, () => {
            console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
        });
    } catch (error) {
        console.log("Error en index.js -> setupServer(), el error es: ", error);
    }
}

async function setupAPI() {
    try {
        await connectDB();
        await setupServer();
    } catch (error) {
        console.log("Error en index.js -> setupAPI(), el error es: ", error);
    }
}

setupAPI()
    .then(() => console.log("=> API Iniciada exitosamente"))
    .catch((error) =>
        console.log("Error en index.js -> setupAPI(), el error es: ", error),
    );
