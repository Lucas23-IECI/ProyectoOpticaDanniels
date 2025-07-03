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

const router = Router();

router
    .post("/", authenticateJwt, validateSchema(ordenSchema), crearOrdenController)
    .get("/", obtenerOrdenesController)
    .get("/detalle/:id", obtenerOrdenPorIdController)
    .patch("/:id", validateSchema(actualizarEstadoSchema), actualizarEstadoOrdenController)
    .delete("/:id", eliminarOrdenController);

export default router;
