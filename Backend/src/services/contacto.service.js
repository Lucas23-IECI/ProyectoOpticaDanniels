"use strict";
import { AppDataSource } from "../config/configDb.js";
import MensajeContacto from "../entity/contacto.entity.js";
import logger from "../config/logger.js";
import { sendContactNotificationEmail } from "../helpers/email.helper.js";

/**
 * Crear un mensaje de contacto (público).
 */
export async function crearMensajeContactoService(body) {
  try {
    const mensajeRepo = AppDataSource.getRepository(MensajeContacto);

    const nuevoMensaje = mensajeRepo.create({
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono || null,
      asunto: body.asunto || null,
      mensaje: body.mensaje,
    });

    const mensajeGuardado = await mensajeRepo.save(nuevoMensaje);

    // Notificar al admin por email (no bloquear si falla)
    sendContactNotificationEmail(mensajeGuardado).catch((err) => {
      logger.warn("[CONTACTO] Error enviando notificación:", err.message);
    });

    return [mensajeGuardado, null];
  } catch (error) {
    logger.error("Error en crearMensajeContactoService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Obtener todos los mensajes (admin) con filtrado.
 */
export async function obtenerMensajesService(query = {}) {
  try {
    const mensajeRepo = AppDataSource.getRepository(MensajeContacto);

    const where = {};
    if (query.leido !== undefined) where.leido = query.leido === "true";
    if (query.respondido !== undefined) where.respondido = query.respondido === "true";

    const mensajes = await mensajeRepo.find({
      where,
      order: { createdAt: "DESC" },
    });

    return [mensajes, null];
  } catch (error) {
    logger.error("Error en obtenerMensajesService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Obtener un mensaje por ID (admin).
 */
export async function obtenerMensajePorIdService(id) {
  try {
    const mensajeRepo = AppDataSource.getRepository(MensajeContacto);

    const mensaje = await mensajeRepo.findOne({ where: { id: parseInt(id) } });
    if (!mensaje) return [null, "Mensaje no encontrado."];

    return [mensaje, null];
  } catch (error) {
    logger.error("Error en obtenerMensajePorIdService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Marcar mensaje como leído (admin).
 */
export async function marcarMensajeLeidoService(id) {
  try {
    const mensajeRepo = AppDataSource.getRepository(MensajeContacto);

    const mensaje = await mensajeRepo.findOne({ where: { id: parseInt(id) } });
    if (!mensaje) return [null, "Mensaje no encontrado."];

    mensaje.leido = true;
    const actualizado = await mensajeRepo.save(mensaje);
    return [actualizado, null];
  } catch (error) {
    logger.error("Error en marcarMensajeLeidoService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Marcar mensaje como respondido (admin).
 */
export async function marcarMensajeRespondidoService(id) {
  try {
    const mensajeRepo = AppDataSource.getRepository(MensajeContacto);

    const mensaje = await mensajeRepo.findOne({ where: { id: parseInt(id) } });
    if (!mensaje) return [null, "Mensaje no encontrado."];

    mensaje.respondido = true;
    mensaje.leido = true; // Si respondió, también lo leyó
    const actualizado = await mensajeRepo.save(mensaje);
    return [actualizado, null];
  } catch (error) {
    logger.error("Error en marcarMensajeRespondidoService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Eliminar mensaje (admin).
 */
export async function eliminarMensajeService(id) {
  try {
    const mensajeRepo = AppDataSource.getRepository(MensajeContacto);

    const mensaje = await mensajeRepo.findOne({ where: { id: parseInt(id) } });
    if (!mensaje) return [null, "Mensaje no encontrado."];

    await mensajeRepo.remove(mensaje);
    return [{ eliminado: true }, null];
  } catch (error) {
    logger.error("Error en eliminarMensajeService:", error);
    return [null, "Error interno del servidor."];
  }
}
