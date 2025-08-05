"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
    const validDomains = [".cl", ".com"];
    const hasValidDomain = validDomains.some(domain => value.endsWith(domain));
    
    if (!hasValidDomain) {
        return helper.message(
            "El correo electrónico debe ser de dominio .cl o .com"
        );
    }
    return value;
};

export const authValidation = Joi.object({
    email: Joi.string()
        .min(8)
        .max(50)
        .email()
        .required()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "any.required": "El correo electrónico es obligatorio.",
            "string.base": "El correo electrónico debe ser de tipo texto.",
            "string.email": "El correo electrónico debe ser de dominio .cl o .com",
            "string.min": "El correo electrónico debe tener al menos 8 caracteres.",
            "string.max": "El correo electrónico debe tener como máximo 50 caracteres.",
        })
        .custom(domainEmailValidator, "Validación dominio email"),
    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9]+$/)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "any.required": "La contraseña es obligatoria.",
            "string.base": "La contraseña debe ser de tipo texto.",
            "string.min": "La contraseña debe tener al menos 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base": "La contraseña solo puede contener letras y números.",
        }),
}).unknown(false).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

export const registerValidation = Joi.object({
    primerNombre: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "El primer nombre no puede estar vacío.",
            "any.required": "El primer nombre es obligatorio.",
            "string.base": "El primer nombre debe ser de tipo texto.",
            "string.min": "El primer nombre debe tener al menos 2 caracteres.",
            "string.max": "El primer nombre debe tener como máximo 50 caracteres.",
        }),
    segundoNombre: Joi.string()
        .allow(null, "")
        .optional()
        .messages({
            "string.base": "El segundo nombre debe ser de tipo texto.",
        }),
    apellidoPaterno: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "El apellido paterno no puede estar vacío.",
            "any.required": "El apellido paterno es obligatorio.",
            "string.base": "El apellido paterno debe ser de tipo texto.",
            "string.min": "El apellido paterno debe tener al menos 2 caracteres.",
            "string.max": "El apellido paterno debe tener como máximo 50 caracteres.",
        }),
    apellidoMaterno: Joi.string()
        .allow(null, "")
        .optional()
        .messages({
            "string.base": "El apellido materno debe ser de tipo texto.",
        }),
    rut: Joi.string()
        .min(9)
        .max(12)
        .required()
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
        }),
    email: Joi.string()
        .min(5)
        .max(100)
        .email()
        .required()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "any.required": "El correo electrónico es obligatorio.",
            "string.base": "El correo electrónico debe ser de tipo texto.",
            "string.email": "El correo electrónico debe tener un formato válido.",
            "string.min": "El correo electrónico debe tener al menos 5 caracteres.",
            "string.max": "El correo electrónico debe tener como máximo 100 caracteres.",
        }),
    password: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "any.required": "La contraseña es obligatoria.",
            "string.base": "La contraseña debe ser de tipo texto.",
            "string.min": "La contraseña debe tener al menos 6 caracteres.",
            "string.max": "La contraseña debe tener como máximo 50 caracteres.",
        }),
    telefono: Joi.string()
        .allow(null, "")
        .optional()
        .max(15)
        .messages({
            "string.max": "El teléfono debe tener como máximo 15 caracteres.",
        }),
    fechaNacimiento: Joi.string()
        .allow(null, "")
        .optional()
        .messages({
            "string.base": "La fecha de nacimiento debe ser de tipo texto.",
        }),
    genero: Joi.string()
        .allow(null, "")
        .optional()
        .valid("masculino", "femenino", "otro", "no especificar")
        .messages({
            "any.only": "El género debe ser masculino, femenino, otro o no especificar.",
        }),
    rol: Joi.string()
        .valid("usuario", "administrador")
        .default("usuario")
        .messages({
            "any.only": "El rol debe ser usuario o administrador.",
        }),
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });