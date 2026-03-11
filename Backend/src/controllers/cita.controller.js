"use strict";
import {
  crearCitaService,
  obtenerCitasUsuarioService,
  obtenerTodasCitasService,
  obtenerCitaPorIdService,
  actualizarEstadoCitaService,
  cancelarCitaService,
  obtenerDisponibilidadService,
} from "../services/cita.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { sendCitaStatusEmail } from "../helpers/email.helper.js";
import logger from "../config/logger.js";

/**
 * POST /api/citas — usuario autenticado crea cita
 */
export const crearCita = async (req, res) => {
  try {
    const userId = req.user.id;
    const [cita, error] = await crearCitaService(userId, req.body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Cita agendada correctamente.", cita);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * GET /api/citas/mis-citas — citas del usuario autenticado
 */
export const obtenerMisCitas = async (req, res) => {
  try {
    const userId = req.user.id;
    const [citas, error] = await obtenerCitasUsuarioService(userId);

    if (error) return handleErrorServer(res, 500, error);

    handleSuccess(res, 200, "Citas obtenidas correctamente.", citas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * GET /api/citas/admin — todas las citas (admin)
 */
export const obtenerTodasCitas = async (req, res) => {
  try {
    const [citas, error] = await obtenerTodasCitasService(req.query);

    if (error) return handleErrorServer(res, 500, error);

    handleSuccess(res, 200, "Citas obtenidas correctamente.", citas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * GET /api/citas/:id — detalle de una cita (admin)
 */
export const obtenerCitaPorId = async (req, res) => {
  try {
    const [cita, error] = await obtenerCitaPorIdService(req.params.id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Cita obtenida correctamente.", cita);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * PATCH /api/citas/:id/estado — admin cambia estado
 */
export const actualizarEstadoCita = async (req, res) => {
  try {
    const [cita, error] = await actualizarEstadoCitaService(req.params.id, req.body);

    if (error) return handleErrorClient(res, 400, error);

    // Notificar al usuario por email (async, no bloquea)
    sendCitaStatusEmail(cita).catch((err) =>
      logger.error("Error enviando email estado cita:", err)
    );

    handleSuccess(res, 200, "Estado de cita actualizado.", cita);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * PATCH /api/citas/:id/cancelar — usuario cancela su cita
 */
export const cancelarCita = async (req, res) => {
  try {
    const userId = req.user.id;
    const [cita, error] = await cancelarCitaService(req.params.id, userId);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Cita cancelada correctamente.", cita);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * GET /api/citas/disponibilidad/:fecha — slots disponibles (público)
 */
export const obtenerDisponibilidad = async (req, res) => {
  try {
    const { fecha } = req.params;

    // Validar formato básico
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return handleErrorClient(res, 400, "Formato de fecha inválido. Use YYYY-MM-DD.");
    }

    const [disponibilidad, error] = await obtenerDisponibilidadService(fecha);

    if (error) return handleErrorServer(res, 500, error);

    handleSuccess(res, 200, "Disponibilidad obtenida.", disponibilidad);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
