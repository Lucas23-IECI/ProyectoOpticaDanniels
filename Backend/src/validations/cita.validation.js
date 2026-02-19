"use strict";
import Joi from "joi";

const TIPOS_SERVICIO = [
  "examen_visual",
  "asesoria_lentes",
  "reparacion_marcos",
  "adaptacion_contacto",
  "control_oftalmologico",
  "consulta_general",
];

const ESTADOS_CITA = [
  "pendiente",
  "confirmada",
  "completada",
  "cancelada",
  "no_asistio",
];

/** Validación para crear una cita */
export const crearCitaValidation = Joi.object({
  tipoServicio: Joi.string()
    .valid(...TIPOS_SERVICIO)
    .required()
    .messages({
      "any.only": "El tipo de servicio no es válido.",
      "any.required": "El tipo de servicio es obligatorio.",
    }),
  fecha: Joi.date()
    .iso()
    .min("now")
    .required()
    .messages({
      "date.base": "La fecha debe ser válida.",
      "date.min": "La fecha no puede ser en el pasado.",
      "any.required": "La fecha es obligatoria.",
    }),
  hora: Joi.string()
    .pattern(/^([0-8]\d|09|1[0-7]):[0-3]0$/)
    .required()
    .messages({
      "string.pattern.base": "La hora debe estar en formato HH:MM (slots de 30 min, 09:00-17:30).",
      "any.required": "La hora es obligatoria.",
    }),
  notas: Joi.string()
    .max(500)
    .allow("", null)
    .messages({
      "string.max": "Las notas no pueden exceder 500 caracteres.",
    }),
  telefono: Joi.string()
    .pattern(/^\+?[\d\s()-]{7,20}$/)
    .required()
    .messages({
      "string.pattern.base": "El teléfono no es válido.",
      "any.required": "El teléfono es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales.",
  });

/** Validación para que admin actualice estado de cita */
export const actualizarEstadoCitaValidation = Joi.object({
  estado: Joi.string()
    .valid(...ESTADOS_CITA)
    .required()
    .messages({
      "any.only": "El estado debe ser: pendiente, confirmada, completada, cancelada o no_asistio.",
      "any.required": "El estado es obligatorio.",
    }),
  notasAdmin: Joi.string()
    .max(500)
    .allow("", null)
    .messages({
      "string.max": "Las notas del admin no pueden exceder 500 caracteres.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales.",
  });
