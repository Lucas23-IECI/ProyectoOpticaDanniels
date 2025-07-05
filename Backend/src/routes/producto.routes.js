import { Router } from "express";
import {
    actualizarProductoController,
    buscarProductosController,
    crearProductoController,
    eliminarProductoController,
    subirImagenProductoController,
} from "../controllers/producto.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { productSchema } from "../validations/producto.validation.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import uploadProducto from "../middlewares/uploadProducto.middleware.js";

const router = Router();

router
    .post("/", authenticateJwt, isAdmin, validateSchema(productSchema), crearProductoController)
    .get("/", buscarProductosController)
    .put("/:id", authenticateJwt, isAdmin, validateSchema(productSchema), actualizarProductoController)
    .delete("/:id", authenticateJwt, isAdmin, eliminarProductoController);

router.post(
    "/:id/imagen",
    authenticateJwt,
    isAdmin,
    uploadProducto.single("imagen"),
    subirImagenProductoController
);

export default router;
