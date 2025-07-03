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
});
