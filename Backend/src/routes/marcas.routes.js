"use strict";
import { Router } from "express";
import {
    getMarcasController,
    crearMarcaController,
    actualizarMarcaController,
    eliminarMarcaController,
} from "../controllers/marcas.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .get("/", getMarcasController)
    .post("/", authenticateJwt, isAdmin, crearMarcaController)
    .put("/:id", authenticateJwt, isAdmin, actualizarMarcaController)
    .delete("/:id", authenticateJwt, isAdmin, eliminarMarcaController);

export default router;
