"use strict";
import {
  crearMensajeContactoService,
  obtenerMensajesService,
  obtenerMensajePorIdService,
  marcarMensajeLeidoService,
  marcarMensajeRespondidoService,
  eliminarMensajeService,
} from "../services/contacto.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * POST /api/contacto — público, enviar mensaje de contacto
 */
export const crearMensajeContacto = async (req, res) => {
  try {
    const [mensaje, error] = await crearMensajeContactoService(req.body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.", mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * GET /api/contacto/admin — admin, obtener todos los mensajes
 */
export const obtenerMensajes = async (req, res) => {
  try {
    const [mensajes, error] = await obtenerMensajesService(req.query);

    if (error) return handleErrorServer(res, 500, error);

    handleSuccess(res, 200, "Mensajes obtenidos correctamente.", mensajes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * GET /api/contacto/:id — admin, obtener mensaje por ID
 */
export const obtenerMensajePorId = async (req, res) => {
  try {
    const [mensaje, error] = await obtenerMensajePorIdService(req.params.id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Mensaje obtenido correctamente.", mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * PATCH /api/contacto/:id/leido — admin, marcar como leído
 */
export const marcarMensajeLeido = async (req, res) => {
  try {
    const [mensaje, error] = await marcarMensajeLeidoService(req.params.id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Mensaje marcado como leído.", mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * PATCH /api/contacto/:id/respondido — admin, marcar como respondido
 */
export const marcarMensajeRespondido = async (req, res) => {
  try {
    const [mensaje, error] = await marcarMensajeRespondidoService(req.params.id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Mensaje marcado como respondido.", mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};

/**
 * DELETE /api/contacto/:id — admin, eliminar mensaje
 */
export const eliminarMensaje = async (req, res) => {
  try {
    const [result, error] = await eliminarMensajeService(req.params.id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Mensaje eliminado correctamente.", result);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
