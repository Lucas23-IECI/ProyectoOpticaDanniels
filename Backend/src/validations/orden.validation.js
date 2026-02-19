import Joi from "joi";

export const ordenSchema = Joi.object({
    cliente: Joi.object({
        nombre: Joi.string().min(2).max(100).required(),
        correo: Joi.string().email().required(),
        telefono: Joi.string().pattern(/^[\d\s+()-]+$/).required(),
        direccion: Joi.string().min(5).max(200).required(),
        observaciones: Joi.string().max(500).allow(""),
    }).required(),

    productos: Joi.array()
        .items(
            Joi.object({
                id: Joi.number().integer().positive().required(),
                cantidad: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),

    metodoEntrega: Joi.string()
        .valid("envio", "retiro")
        .default("envio"),

    metodoPago: Joi.string()
        .valid("webpay", "mercadopago")
        .default("webpay"),

    region: Joi.string().max(100).when("metodoEntrega", {
        is: "envio",
        then: Joi.required(),
        otherwise: Joi.optional().allow(""),
    }),

    comuna: Joi.string().max(100).when("metodoEntrega", {
        is: "envio",
        then: Joi.required(),
        otherwise: Joi.optional().allow(""),
    }),

    direccionId: Joi.number().integer().positive().optional().allow(null),

    costoEnvio: Joi.number().min(0).default(0),
});
