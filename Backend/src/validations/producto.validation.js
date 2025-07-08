import Joi from "joi";

export const productSchema = Joi.object({
    nombre: Joi.string().max(255).optional(),
    descripcion: Joi.string().optional(),
    precio: Joi.alternatives().try(
        Joi.number().positive().precision(2),
        Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value) => parseFloat(value))
    ).optional(),
    categoria: Joi.string()
        .valid("opticos", "sol", "accesorios")
        .optional(),
    imagen_url: Joi.string().uri().max(500).optional().allow(""), 
    stock: Joi.alternatives().try(
        Joi.number().integer().min(0),
        Joi.string().pattern(/^\d+$/).custom((value) => parseInt(value))
    ).optional(),
    activo: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    marca: Joi.string().max(100).optional(),
    codigoSKU: Joi.string().max(100).optional(),
    oferta: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    descuento: Joi.alternatives().try(
        Joi.number().min(0).max(100).precision(2),
        Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value) => parseFloat(value))
    ).optional(),
}).min(1);

export const productUpdateSchema = Joi.object({
    nombre: Joi.string().max(255).optional(),
    descripcion: Joi.string().optional(),
    precio: Joi.alternatives().try(
        Joi.number().positive().precision(2),
        Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value) => parseFloat(value))
    ).optional(),
    categoria: Joi.string()
        .valid("opticos", "sol", "accesorios")
        .optional(),
    imagen_url: Joi.string().uri().max(500).optional().allow(""), 
    stock: Joi.alternatives().try(
        Joi.number().integer().min(0),
        Joi.string().pattern(/^\d+$/).custom((value) => parseInt(value))
    ).optional(),
    activo: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    marca: Joi.string().max(100).optional(),
    codigoSKU: Joi.string().max(100).optional(),
    oferta: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    descuento: Joi.alternatives().try(
        Joi.number().min(0).max(100).precision(2),
        Joi.string().pattern(/^\d+(\.\d{1,2})?$/).custom((value) => parseFloat(value))
    ).optional(),
}).min(1);
