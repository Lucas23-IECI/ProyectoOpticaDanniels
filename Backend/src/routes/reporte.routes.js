"use strict";
import { Router } from "express";
import {
    getEstadisticasGenerales,
    getEstadisticasOrdenes,
    getEstadisticasProductos,
    getEstadisticasUsuarios,
} from "../controllers/reporte.controller.js";
import { exportarReporte } from "../controllers/reporteExport.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    .use(isAdmin);

router
    .get("/exportar", exportarReporte)
    .get("/generales", getEstadisticasGenerales)
    .get("/usuarios", getEstadisticasUsuarios)
    .get("/productos", getEstadisticasProductos)
    .get("/ordenes", getEstadisticasOrdenes);

export default router;