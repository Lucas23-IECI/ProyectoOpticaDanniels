"use strict";
import Joi from "joi";

/** Validación para enviar mensaje de contacto (público) */
export const crearMensajeContactoValidation = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.min": "El nombre debe tener al menos 2 caracteres.",
      "string.max": "El nombre no puede exceder 100 caracteres.",
      "any.required": "El nombre es obligatorio.",
    }),
  email: Joi.string()
    .email()
    .max(150)
    .required()
    .messages({
      "string.email": "El email no es válido.",
      "string.max": "El email no puede exceder 150 caracteres.",
      "any.required": "El email es obligatorio.",
    }),
  telefono: Joi.string()
    .pattern(/^\+?[\d\s()-]{7,20}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "El teléfono no es válido.",
    }),
  asunto: Joi.string()
    .max(200)
    .allow("", null)
    .messages({
      "string.max": "El asunto no puede exceder 200 caracteres.",
    }),
  mensaje: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      "string.min": "El mensaje debe tener al menos 10 caracteres.",
      "string.max": "El mensaje no puede exceder 2000 caracteres.",
      "any.required": "El mensaje es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales.",
  });
