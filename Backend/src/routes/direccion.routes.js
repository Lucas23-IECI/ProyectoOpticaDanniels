import { Router } from "express";
import {
    actualizarDireccionController,
    crearDireccionController,
    eliminarDireccionController,
    establecerPrincipalController,
    obtenerDireccionController,
    obtenerDireccionesController
} from "../controllers/direccion.controller.js";
import { validateParams, validateSchema } from "../middlewares/validateSchema.js";
import { direccionIdSchema, direccionSchema, direccionUpdateSchema } from "../validations/direccion.validation.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
    // Crear nueva dirección - requiere autenticación
    .post("/",
        authenticateJwt,
        validateSchema(direccionSchema),
        crearDireccionController
    )
    // Obtener todas las direcciones del usuario - requiere autenticación
    .get("/",
        authenticateJwt,
        obtenerDireccionesController
    )
    // Obtener dirección específica por ID - requiere autenticación
    .get("/:id",
        authenticateJwt,
        validateParams(direccionIdSchema),
        obtenerDireccionController
    )
    // Actualizar dirección - requiere autenticación
    .put("/:id",
        authenticateJwt,
        validateParams(direccionIdSchema),
        validateSchema(direccionUpdateSchema),
        actualizarDireccionController
    )
    // Eliminar dirección - requiere autenticación (solo valida ID)
    .delete("/:id",
        authenticateJwt,
        validateParams(direccionIdSchema),
        eliminarDireccionController
    )
    // Establecer como dirección principal - requiere autenticación (solo valida ID)
    .patch("/:id/principal",
        authenticateJwt,
        validateParams(direccionIdSchema),
        establecerPrincipalController
    );

export default router; 