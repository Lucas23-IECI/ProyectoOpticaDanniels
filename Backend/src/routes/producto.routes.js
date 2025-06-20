import { Router } from "express";
import {
    actualizarProductoController,
    buscarProductosController,
    crearProductoController,
    eliminarProductoController,
} from "../controllers/producto.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { productSchema } from "../validations/producto.validation.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .post("/", authenticateJwt, isAdmin, validateSchema(productSchema), crearProductoController)
    .get("/", buscarProductosController)
    .put("/:id", authenticateJwt, isAdmin, validateSchema(productSchema), actualizarProductoController)
    .delete("/:id", authenticateJwt, isAdmin, eliminarProductoController);

export default router;
