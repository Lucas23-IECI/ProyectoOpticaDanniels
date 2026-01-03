"use strict";
import { Router } from "express";
import {
    getEstadisticasGenerales,
    getEstadisticasProductos,
    getEstadisticasUsuarios
} from "../controllers/reporte.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    .use(isAdmin);

router
    .get("/generales", getEstadisticasGenerales)
    .get("/usuarios", getEstadisticasUsuarios)
    .get("/productos", getEstadisticasProductos);

export default router;