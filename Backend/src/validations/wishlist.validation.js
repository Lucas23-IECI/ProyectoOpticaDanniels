"use strict";
import Joi from "joi";

/** Validación para agregar un producto a la wishlist */
export const addWishlistValidation = Joi.object({
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
