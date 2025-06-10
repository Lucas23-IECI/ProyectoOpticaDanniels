import { Router } from "express";
import {
    actualizarProductoController,
    buscarProductosController,
    crearProductoController,
    eliminarProductoController
} from "../controllers/producto.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { productSchema } from "../validations/producto.validation.js";

const router = Router();

router
    .post("/", validateSchema(productSchema), crearProductoController)
    .get("/", buscarProductosController)
    .put("/:id", validateSchema(productSchema), actualizarProductoController)
    .delete("/:id", eliminarProductoController);

export default router;
