"use strict";
import { Router } from "express";
import {
  crearMensajeContacto,
  obtenerMensajes,
  obtenerMensajePorId,
  marcarMensajeLeido,
  marcarMensajeRespondido,
  eliminarMensaje,
} from "../controllers/contacto.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { crearMensajeContactoValidation } from "../validations/contacto.validation.js";

const router = Router();

// Ruta pública — enviar mensaje de contacto
router.post("/", validateSchema(crearMensajeContactoValidation), crearMensajeContacto);

// Rutas admin
router.get("/admin", authenticateJwt, isAdmin, obtenerMensajes);
router.get("/:id", authenticateJwt, isAdmin, obtenerMensajePorId);
router.patch("/:id/leido", authenticateJwt, isAdmin, marcarMensajeLeido);
router.patch("/:id/respondido", authenticateJwt, isAdmin, marcarMensajeRespondido);
router.delete("/:id", authenticateJwt, isAdmin, eliminarMensaje);

export default router;
