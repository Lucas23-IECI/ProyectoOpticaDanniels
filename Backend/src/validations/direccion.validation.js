import Joi from "joi";

const safeString = (maxLength) => Joi.string()
    .max(maxLength)
    .pattern(/^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s\-.,()#]+$/)
    .messages({
        "string.pattern.base": "Solo se permiten letras, números, espacios y algunos signos de puntuación básicos",
        "string.max": `No debe exceder ${maxLength} caracteres`,
        "string.empty": "Este campo no puede estar vacío"
    });

const safeStringOptional = (maxLength) => Joi.string()
    .max(maxLength)
    .pattern(/^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s\-.,()#]*$/)
    .allow(null, "")
    .optional()
    .messages({
        "string.pattern.base": "Solo se permiten letras, números, espacios y algunos signos de puntuación básicos",
        "string.max": `No debe exceder ${maxLength} caracteres`
    });

const direccionCompleta = () => Joi.string()
    .min(5)
    .max(255)
    .pattern(/^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s\-.,()#]+$/)
    .messages({
        "string.pattern.base": "Solo se permiten letras, números, espacios y algunos signos de puntuación básicos",
        "string.min": "La dirección debe tener al menos 5 caracteres",
        "string.max": "La dirección no puede exceder 255 caracteres",
        "string.empty": "La dirección es obligatoria"
    });

const direccionCompletaOptional = () => Joi.string()
    .min(5)
    .max(255)
    .pattern(/^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s\-.,()#]*$/)
    .allow(null, "")
    .optional()
    .messages({
        "string.pattern.base": "Solo se permiten letras, números, espacios y algunos signos de puntuación básicos",
        "string.min": "La dirección debe tener al menos 5 caracteres",
        "string.max": "La dirección no puede exceder 255 caracteres"
    });

const codigoPostalValidation = () => Joi.string()
    .pattern(/^[0-9]{7}$/)
    .allow(null, "")
    .optional()
    .messages({
        "string.pattern.base": "El código postal debe tener exactamente 7 dígitos",
        "string.empty": "Código postal puede estar vacío"
    });

// Esquema para crear direcciones
export const direccionSchema = Joi.object({
    tipo: Joi.string()
        .valid("casa", "trabajo", "otro")
        .default("casa")
        .messages({
            "any.only": "El tipo debe ser: casa, trabajo o otro"
        }),
    direccion: direccionCompleta().required(),
    ciudad: safeString(100).required().messages({
        "any.required": "La ciudad es obligatoria"
    }),
    region: safeString(100).required().messages({
        "any.required": "La región es obligatoria"
    }),
    codigoPostal: codigoPostalValidation(),
    esPrincipal: Joi.boolean().default(false)
});

// Esquema para actualizar direcciones
export const direccionUpdateSchema = Joi.object({
    tipo: Joi.string()
        .valid("casa", "trabajo", "otro")
        .optional()
        .messages({
            "any.only": "El tipo debe ser: casa, trabajo o otro"
        }),
    direccion: direccionCompletaOptional(),
    ciudad: safeStringOptional(100),
    region: safeStringOptional(100),
    codigoPostal: codigoPostalValidation(),
    esPrincipal: Joi.boolean().optional()
});

// Esquema para IDs
export const direccionIdSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "number.base": "El ID debe ser un número",
        "number.integer": "El ID debe ser un número entero",
        "number.positive": "El ID debe ser positivo",
        "any.required": "El ID es obligatorio"
    })
}); 