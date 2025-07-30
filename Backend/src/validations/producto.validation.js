import Joi from "joi";

const safeString = (maxLength) => Joi.string()
    .max(maxLength)
    .pattern(/^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s\-.,()]+$/)
    .messages({
        "string.pattern.base": "Solo se permiten letras, números, espacios y algunos signos de puntuación básicos",
        "string.max": `No debe exceder ${maxLength} caracteres`,
        "string.empty": "Este campo no puede estar vacío"
    });

const skuPattern = () => Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z0-9\-_]+$/)
    .custom((value, helpers) => {
        if (value.endsWith('-')) {
            return helpers.error('string.custom', { message: 'El código SKU no puede terminar con guión' });
        }
        return value;
    })
    .messages({
        "string.pattern.base": "El SKU solo puede contener letras, números, guiones y guiones bajos",
        "string.min": "El SKU debe tener al menos 3 caracteres",
        "string.max": "El SKU no puede exceder 100 caracteres",
        "string.custom": "El código SKU no puede terminar con guión"
    });

const priceValidation = () => Joi.alternatives().try(
    Joi.number().integer().positive().min(1).max(999999999),
    Joi.string().pattern(/^\d+$/).custom((value) => {
        const num = parseInt(value);
        if (num < 1 || num > 999999999) {
            throw new Error("El precio debe ser un número entero entre 1 y 999,999,999");
        }
        return num;
    })
).messages({
    "number.integer": "El precio debe ser un número entero (sin decimales)",
    "number.positive": "El precio debe ser mayor a 0",
    "number.min": "El precio debe ser mayor a 0",
    "number.max": "El precio no puede exceder 999,999,999"
});

const discountValidation = () => Joi.alternatives().try(
    Joi.number().integer().min(0).max(100),
    Joi.string().pattern(/^\d+$/).custom((value) => {
        const num = parseInt(value);
        if (num < 0 || num > 100) {
            throw new Error("El descuento debe ser un número entero entre 0 y 100");
        }
        return num;
    })
).messages({
    "number.integer": "El descuento debe ser un número entero",
    "number.min": "El descuento no puede ser negativo",
    "number.max": "El descuento no puede exceder 100%"
});

export const productSchema = Joi.object({
    nombre: safeString(255).required(),
    descripcion: safeString(1000).min(10).required().messages({
        "string.min": "La descripción debe tener al menos 10 caracteres"
    }),
    precio: priceValidation().required(),
    categoria: Joi.string()
        .valid("opticos", "sol", "accesorios")
        .required()
        .messages({
            "any.only": "La categoría debe ser: opticos, sol o accesorios"
        }),
    subcategoria: Joi.string()
        .max(100)
        .optional()
        .allow(""),
    imagen_url: Joi.string().max(500).optional().allow(""), 
    stock: Joi.alternatives().try(
        Joi.number().integer().min(0).max(9999),
        Joi.string().pattern(/^\d+$/).custom((value) => {
            const num = parseInt(value);
            if (num < 0 || num > 9999) {
                throw new Error("El stock debe ser un número entre 0 y 9999");
            }
            return num;
        })
    ).required(),
    activo: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    marca: safeString(100).required(),
    codigoSKU: skuPattern().required(),
    oferta: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    descuento: discountValidation().optional(),
});

export const productUpdateSchema = Joi.object({
    nombre: safeString(255).optional(),
    descripcion: safeString(1000).min(10).optional().messages({
        "string.min": "La descripción debe tener al menos 10 caracteres"
    }),
    precio: priceValidation().optional(),
    categoria: Joi.string()
        .valid("opticos", "sol", "accesorios")
        .optional()
        .messages({
            "any.only": "La categoría debe ser: opticos, sol o accesorios"
        }),
    subcategoria: Joi.string()
        .max(100)
        .optional()
        .allow(""),
    imagen_url: Joi.string().max(500).optional().allow(""), 
    stock: Joi.alternatives().try(
        Joi.number().integer().min(0).max(9999),
        Joi.string().pattern(/^\d+$/).custom((value) => {
            const num = parseInt(value);
            if (num < 0 || num > 9999) {
                throw new Error("El stock debe ser un número entre 0 y 9999");
            }
            return num;
        })
    ).optional(),
    activo: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    marca: safeString(100).optional(),
    codigoSKU: skuPattern().optional(),
    oferta: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid("true", "false").custom((value) => value === "true")
    ).optional(),
    descuento: discountValidation().optional(),
}).min(1);
