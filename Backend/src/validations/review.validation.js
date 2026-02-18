"use strict";
import Joi from "joi";

/** Validación para crear una reseña */
export const createReviewValidation = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": "La calificación debe ser un número.",
      "number.min": "La calificación mínima es 1.",
      "number.max": "La calificación máxima es 5.",
      "any.required": "La calificación es obligatoria.",
    }),
  comentario: Joi.string()
    .max(1000)
    .allow("", null)
    .messages({
      "string.max": "El comentario no puede exceder 1000 caracteres.",
    }),
  productoId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del producto debe ser un número.",
      "any.required": "El ID del producto es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales.",
  });

/** Validación para que un admin modere una reseña (aprobar/rechazar) */
export const updateReviewEstadoValidation = Joi.object({
  estado: Joi.string()
    .valid("aprobada", "rechazada")
    .required()
    .messages({
      "any.only": "El estado debe ser 'aprobada' o 'rechazada'.",
      "any.required": "El estado es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales.",
  });
