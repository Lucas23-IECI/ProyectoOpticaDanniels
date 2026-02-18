import { Router } from "express";
import {
    actualizarEstadoOrdenController,
    crearOrdenController,
    eliminarOrdenController,
    obtenerOrdenesController,
    obtenerOrdenPorIdController
} from "../controllers/orden.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { ordenSchema } from "../validations/orden.validation.js";
import { actualizarEstadoSchema } from "../validations/ordenEstado.validation.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .post("/", authenticateJwt, validateSchema(ordenSchema), crearOrdenController)
    .get("/", authenticateJwt, obtenerOrdenesController)
    .get("/detalle/:id", authenticateJwt, obtenerOrdenPorIdController)
    .patch("/:id", authenticateJwt, isAdmin, validateSchema(actualizarEstadoSchema), actualizarEstadoOrdenController)
    .delete("/:id", authenticateJwt, isAdmin, eliminarOrdenController);

export default router;
