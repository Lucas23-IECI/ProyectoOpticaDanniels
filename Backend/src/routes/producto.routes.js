import { Router } from "express";
import {
    actualizarProductoController,
    buscarProductosController,
    crearProductoController,
    eliminarProductoController,
    subirImagenProductoController,
} from "../controllers/producto.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateProductoMultipart } from "../middlewares/validateProductoMultipart.js";
import { validateProductUpdateMultipart } from "../middlewares/validateProductUpdateMultipart.js";
import { productSchema, productUpdateSchema } from "../validations/producto.validation.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import uploadProducto from "../middlewares/uploadProducto.middleware.js";

const router = Router();

router
    .post("/", 
        authenticateJwt, 
        isAdmin, 
        uploadProducto.single("imagen"), 
        validateProductoMultipart, 
        crearProductoController
    )
    .get("/", buscarProductosController)
    .put("/:id", 
        authenticateJwt, 
        isAdmin, 
        uploadProducto.single("imagen"),
        validateProductUpdateMultipart,
        validateSchema(productUpdateSchema), 
        actualizarProductoController
    )
    .delete("/:id", authenticateJwt, isAdmin, eliminarProductoController);

router.post(
    "/:id/imagen",
    authenticateJwt,
    isAdmin,
    uploadProducto.single("imagen"),
    subirImagenProductoController
);

router.put(
    "/:id/imagen",
    authenticateJwt,
    isAdmin,
    uploadProducto.single("imagen"),
    subirImagenProductoController
);

export default router;
