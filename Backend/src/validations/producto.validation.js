import Joi from "joi";

export const productSchema = Joi.object({
    nombre: Joi.string().max(255).required(),
    descripcion: Joi.string().min(5).required(),
    precio: Joi.alternatives().try(
        Joi.number().positive().precision(2),
        Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value) => parseFloat(value))
    ).required(),
    categoria: Joi.string()
        .valid("opticos", "sol", "accesorios")
        .required(),
    imagen_url: Joi.string().max(500).optional().allow(""), 
    stock: Joi.alternatives().try(
        Joi.number().integer().min(0),
        Joi.string().pattern(/^\d+$/).custom((value) => parseInt(value))
    ).required(),
    activo: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    marca: Joi.string().max(100).required(),
    codigoSKU: Joi.string().min(3).max(100).required(),
    oferta: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    descuento: Joi.alternatives().try(
        Joi.number().min(0).max(100).precision(2),
        Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value) => parseFloat(value))
    ).optional(),
});

export const productUpdateSchema = Joi.object({
    nombre: Joi.string().max(255).optional(),
    descripcion: Joi.string().min(5).optional(),
    precio: Joi.alternatives().try(
        Joi.number().positive().precision(2),
        Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value) => parseFloat(value))
    ).optional(),
    categoria: Joi.string()
        .valid("opticos", "sol", "accesorios")
        .optional(),
    imagen_url: Joi.string().max(500).optional().allow(""), 
    stock: Joi.alternatives().try(
        Joi.number().integer().min(0),
        Joi.string().pattern(/^\d+$/).custom((value) => parseInt(value))
    ).optional(),
    activo: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    marca: Joi.string().max(100).optional(),
    codigoSKU: Joi.string().min(3).max(100).optional(),
    oferta: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    descuento: Joi.alternatives().try(
        Joi.number().min(0).max(100).precision(2),
        Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value) => parseFloat(value))
    ).optional(),
}).min(1);
