"use strict";
import { AppDataSource } from "../config/configDb.js";
import Cita from "../entity/cita.entity.js";
import logger from "../config/logger.js";

const HORARIO_INICIO = 9; // 09:00
const HORARIO_FIN = 18;   // 18:00 (último slot 17:30)
const SLOT_MINUTOS = 30;

/**
 * Genera todos los slots de un día (09:00 a 17:30, cada 30 min).
 */
function generarSlots() {
  const slots = [];
  for (let h = HORARIO_INICIO; h < HORARIO_FIN; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTOS) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

/**
 * Crear una cita nueva (usuario autenticado).
 */
export async function crearCitaService(userId, body) {
  try {
    const citaRepo = AppDataSource.getRepository(Cita);

    // Validar que no sea domingo (0) ni sábado (6)
    const dia = new Date(body.fecha + "T12:00:00").getDay();
    if (dia === 0 || dia === 6) {
      return [null, "No se pueden agendar citas en fines de semana."];
    }

    // Validar slot disponible
    const existente = await citaRepo.findOne({
      where: { fecha: body.fecha, hora: body.hora },
    });
    if (existente && existente.estado !== "cancelada") {
      return [null, "Este horario ya está reservado. Por favor elige otro."];
    }

    const nuevaCita = citaRepo.create({
      userId,
      tipoServicio: body.tipoServicio,
      fecha: body.fecha,
      hora: body.hora,
      notas: body.notas || null,
      telefono: body.telefono,
      estado: "pendiente",
    });

    const citaGuardada = await citaRepo.save(nuevaCita);
    return [citaGuardada, null];
  } catch (error) {
    logger.error("Error en crearCitaService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Obtener citas del usuario autenticado.
 */
export async function obtenerCitasUsuarioService(userId) {
  try {
    const citaRepo = AppDataSource.getRepository(Cita);

    const citas = await citaRepo.find({
      where: { userId },
      order: { fecha: "DESC", hora: "DESC" },
    });

    return [citas, null];
  } catch (error) {
    logger.error("Error en obtenerCitasUsuarioService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Obtener todas las citas (admin).
 */
export async function obtenerTodasCitasService(query = {}) {
  try {
    const citaRepo = AppDataSource.getRepository(Cita);

    const where = {};
    if (query.estado) where.estado = query.estado;
    if (query.fecha) where.fecha = query.fecha;

    const citas = await citaRepo.find({
      where,
      relations: ["usuario"],
      order: { fecha: "ASC", hora: "ASC" },
    });

    // Limpiar datos del usuario
    const citasLimpias = citas.map((c) => ({
      id: c.id,
      tipoServicio: c.tipoServicio,
      fecha: c.fecha,
      hora: c.hora,
      estado: c.estado,
      notas: c.notas,
      notasAdmin: c.notasAdmin,
      telefono: c.telefono,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      usuario: c.usuario
        ? {
            id: c.usuario.id,
            primerNombre: c.usuario.primerNombre,
            apellidoPaterno: c.usuario.apellidoPaterno,
            email: c.usuario.email,
            telefono: c.usuario.telefono,
          }
        : null,
    }));

    return [citasLimpias, null];
  } catch (error) {
    logger.error("Error en obtenerTodasCitasService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Obtener una cita por ID.
 */
export async function obtenerCitaPorIdService(id) {
  try {
    const citaRepo = AppDataSource.getRepository(Cita);

    const cita = await citaRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["usuario"],
    });

    if (!cita) return [null, "Cita no encontrada."];

    return [cita, null];
  } catch (error) {
    logger.error("Error en obtenerCitaPorIdService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Actualizar estado de una cita (admin).
 */
export async function actualizarEstadoCitaService(id, body) {
  try {
    const citaRepo = AppDataSource.getRepository(Cita);

    const cita = await citaRepo.findOne({ where: { id: parseInt(id) } });
    if (!cita) return [null, "Cita no encontrada."];

    cita.estado = body.estado;
    if (body.notasAdmin !== undefined) cita.notasAdmin = body.notasAdmin;

    const citaActualizada = await citaRepo.save(cita);
    return [citaActualizada, null];
  } catch (error) {
    logger.error("Error en actualizarEstadoCitaService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Cancelar una cita (usuario puede cancelar sus propias citas pendientes/confirmadas).
 */
export async function cancelarCitaService(citaId, userId) {
  try {
    const citaRepo = AppDataSource.getRepository(Cita);

    const cita = await citaRepo.findOne({ where: { id: parseInt(citaId) } });
    if (!cita) return [null, "Cita no encontrada."];

    if (cita.userId !== userId) {
      return [null, "No tienes permiso para cancelar esta cita."];
    }

    if (!["pendiente", "confirmada"].includes(cita.estado)) {
      return [null, "Solo se pueden cancelar citas pendientes o confirmadas."];
    }

    cita.estado = "cancelada";
    const citaCancelada = await citaRepo.save(cita);
    return [citaCancelada, null];
  } catch (error) {
    logger.error("Error en cancelarCitaService:", error);
    return [null, "Error interno del servidor."];
  }
}

/**
 * Obtener disponibilidad de un día específico.
 * Retorna slots disponibles con formato HH:MM.
 */
export async function obtenerDisponibilidadService(fecha) {
  try {
    const citaRepo = AppDataSource.getRepository(Cita);

    // Validar que no sea fin de semana
    const dia = new Date(fecha + "T12:00:00").getDay();
    if (dia === 0 || dia === 6) {
      return [{ fecha, disponible: false, slots: [], mensaje: "No hay atención los fines de semana." }, null];
    }

    // Obtener citas reservadas para esa fecha (no canceladas)
    const citasDelDia = await citaRepo
      .createQueryBuilder("cita")
      .select("cita.hora")
      .where("cita.fecha = :fecha", { fecha })
      .andWhere("cita.estado != :cancelada", { cancelada: "cancelada" })
      .getMany();

    const horasOcupadas = new Set(
      citasDelDia.map((c) => {
        // hora puede venir como "09:00:00" — normalizar a "09:00"
        const h = String(c.hora);
        return h.length > 5 ? h.substring(0, 5) : h;
      }),
    );

    const todosSlots = generarSlots();
    const slotsDisponibles = todosSlots.filter((s) => !horasOcupadas.has(s));

    return [
      {
        fecha,
        disponible: slotsDisponibles.length > 0,
        slots: slotsDisponibles,
        totalSlots: todosSlots.length,
        ocupados: horasOcupadas.size,
      },
      null,
    ];
  } catch (error) {
    logger.error("Error en obtenerDisponibilidadService:", error);
    return [null, "Error interno del servidor."];
  }
}
