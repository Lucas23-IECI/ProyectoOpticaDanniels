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
        .max(30)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .required()
        .messages({
            "string.empty": "El primer nombre no puede estar vacío.",
            "any.required": "El primer nombre es obligatorio.",
            "string.base": "El primer nombre debe ser de tipo texto.",
            "string.min": "El primer nombre debe tener al menos 2 caracteres.",
            "string.max": "El primer nombre debe tener como máximo 30 caracteres.",
            "string.pattern.base": "El primer nombre solo puede contener letras y espacios.",
        }),
    segundoNombre: Joi.string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .allow(null, "")
        .messages({
            "string.base": "El segundo nombre debe ser de tipo texto.",
            "string.min": "El segundo nombre debe tener al menos 2 caracteres.",
            "string.max": "El segundo nombre debe tener como máximo 30 caracteres.",
            "string.pattern.base": "El segundo nombre solo puede contener letras y espacios.",
        }),
    apellidoPaterno: Joi.string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .required()
        .messages({
            "string.empty": "El apellido paterno no puede estar vacío.",
            "any.required": "El apellido paterno es obligatorio.",
            "string.base": "El apellido paterno debe ser de tipo texto.",
            "string.min": "El apellido paterno debe tener al menos 2 caracteres.",
            "string.max": "El apellido paterno debe tener como máximo 30 caracteres.",
            "string.pattern.base": "El apellido paterno solo puede contener letras y espacios.",
        }),
    apellidoMaterno: Joi.string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .allow(null, "")
        .messages({
            "string.base": "El apellido materno debe ser de tipo texto.",
            "string.min": "El apellido materno debe tener al menos 2 caracteres.",
            "string.max": "El apellido materno debe tener como máximo 30 caracteres.",
            "string.pattern.base": "El apellido materno solo puede contener letras y espacios.",
        }),
    rut: Joi.string()
        .min(9)
        .max(12)
        .required()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
    email: Joi.string()
        .min(15)
        .max(35)
        .email()
        .required()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "any.required": "El correo electrónico es obligatorio.",
            "string.base": "El correo electrónico debe ser de tipo texto.",
            "string.email": "El correo electrónico debe finalizar en @gmail.cl.",
            "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
            "string.max": "El correo electrónico debe tener como máximo 35 caracteres.",
        })
        .custom(domainEmailValidator, "Validación dominio email"),
    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9]+$/)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "any.required": "La contraseña es obligatorio.",
            "string.base": "La contraseña debe ser de tipo texto.",
            "string.min": "La contraseña debe tener al menos 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base": "La contraseña solo puede contener letras y números.",
        }),
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });