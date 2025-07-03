import Joi from "joi";

export const actualizarEstadoSchema = Joi.object({
    estado: Joi.string()
        .valid("pendiente", "pagada", "en preparación", "en camino", "entregada", "cancelada")
        .required()
        .messages({
            "any.only": "Estado inválido. Los estados permitidos son: pendiente, pagada, en preparación, en camino, entregada, cancelada.",
            "string.empty": "El estado no puede estar vacío.",
            "any.required": "El estado es obligatorio.",
        }),
});
