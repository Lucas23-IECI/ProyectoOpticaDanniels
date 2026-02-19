import { Router } from "express";
import {
    actualizarEstadoOrdenController,
    boletaOrdenController,
    costoEnvioController,
    crearOrdenController,
    eliminarOrdenController,
    misOrdenesController,
    obtenerOrdenesController,
    obtenerOrdenPorIdController,
    regionesEnvioController,
} from "../controllers/orden.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { ordenSchema } from "../validations/orden.validation.js";
import { actualizarEstadoSchema } from "../validations/ordenEstado.validation.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    // Públicas (no requieren auth)
    .get("/costo-envio", costoEnvioController)
    .get("/regiones-envio", regionesEnvioController)
    // Usuario autenticado
    .get("/mis-ordenes", authenticateJwt, misOrdenesController)
    .post("/", authenticateJwt, validateSchema(ordenSchema), crearOrdenController)
    .get("/detalle/:id", authenticateJwt, obtenerOrdenPorIdController)
    .get("/:id/boleta", authenticateJwt, boletaOrdenController)
    // Admin
    .get("/", authenticateJwt, isAdmin, obtenerOrdenesController)
    .patch("/:id", authenticateJwt, isAdmin, validateSchema(actualizarEstadoSchema), actualizarEstadoOrdenController)
    .delete("/:id", authenticateJwt, isAdmin, eliminarOrdenController);

export default router;
