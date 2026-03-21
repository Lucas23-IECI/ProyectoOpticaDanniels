import { Router } from "express";
import {
    actualizarProductoController,
    buscarProductosController,
    crearProductoController,
    eliminarProductoController,
    obtenerSugerenciasBusquedaController,
    subirImagenProductoController,
    getProductosStockBajoController,
    enviarAlertaStockController,
    obtenerFacetasController,
} from "../controllers/producto.controller.js";
import {
    obtenerImagenesController,
    agregarImagenesController,
    eliminarImagenController,
    reordenarImagenesController,
    establecerPrincipalController,
} from "../controllers/productoImagen.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateProductoMultipart } from "../middlewares/validateProductoMultipart.js";
import { validateProductUpdateMultipart } from "../middlewares/validateProductUpdateMultipart.js";
import { productSchema, productUpdateSchema } from "../validations/producto.validation.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import uploadProducto from "../middlewares/uploadProducto.middleware.js";
import { uploadProductoMultiple } from "../middlewares/uploadProducto.middleware.js";

const router = Router();

router
    .post("/",
        authenticateJwt,
        isAdmin,
        uploadProducto.single("imagen"),
        validateProductoMultipart,
        crearProductoController
    )
    .get("/stock-bajo", authenticateJwt, isAdmin, getProductosStockBajoController)
    .post("/stock-bajo/alerta", authenticateJwt, isAdmin, enviarAlertaStockController)
    .get("/facetas", obtenerFacetasController)
    .get("/", buscarProductosController)
    .get("/sugerencias", obtenerSugerenciasBusquedaController)
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

// === Multi-image endpoints ===
router.get("/:id/imagenes", obtenerImagenesController);

router.post(
    "/:id/imagenes",
    authenticateJwt,
    isAdmin,
    uploadProductoMultiple.array("imagenes", 5),
    agregarImagenesController
);

router.put("/:id/imagenes/reordenar", authenticateJwt, isAdmin, reordenarImagenesController);

router.put("/imagenes/:imagenId/principal", authenticateJwt, isAdmin, establecerPrincipalController);

router.delete("/imagenes/:imagenId", authenticateJwt, isAdmin, eliminarImagenController);

export default router;
