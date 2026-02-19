"use strict";
import { Router } from "express";
import {
  crearCita,
  obtenerMisCitas,
  obtenerTodasCitas,
  obtenerCitaPorId,
  actualizarEstadoCita,
  cancelarCita,
  obtenerDisponibilidad,
} from "../controllers/cita.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
  crearCitaValidation,
  actualizarEstadoCitaValidation,
} from "../validations/cita.validation.js";

const router = Router();

// Ruta pública — disponibilidad de un día
router.get("/disponibilidad/:fecha", obtenerDisponibilidad);

// Rutas autenticadas (usuario)
router.post("/", authenticateJwt, validateSchema(crearCitaValidation), crearCita);
router.get("/mis-citas", authenticateJwt, obtenerMisCitas);
router.patch("/:id/cancelar", authenticateJwt, cancelarCita);

// Rutas admin
router.get("/admin", authenticateJwt, isAdmin, obtenerTodasCitas);
router.get("/:id", authenticateJwt, isAdmin, obtenerCitaPorId);
router.patch("/:id/estado", authenticateJwt, isAdmin, validateSchema(actualizarEstadoCitaValidation), actualizarEstadoCita);

export default router;
