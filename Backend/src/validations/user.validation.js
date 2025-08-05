"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
    if (!value.endsWith(".cl") && !value.endsWith(".com")) {
        return helper.message(
            "El correo electrónico debe terminar en .cl o .com"
        );
    }
    return value;
};

// Validación de teléfono chileno
const telefonoChilenoValidator = (value, helper) => {
    if (!value || value.trim() === "") return value; // Permitir vacío
    
    // Limpiar espacios extra
    const cleanValue = value.trim();
    
    // Patrón para teléfonos chilenos: +56 9 XXXX XXXX o +56 2 XXXX XXXX
    const telefonoPattern = /^\+56\s[29]\d{4}\s\d{4}$/;
    
    if (!telefonoPattern.test(cleanValue)) {
        return helper.message(
            "Formato inválido. Use: +56 9 XXXX XXXX (móvil) o +56 2 XXXX XXXX (fijo)"
        );
    }
    return cleanValue;
};

// Validación de fecha de nacimiento
const fechaNacimientoValidator = (value, helper) => {
    if (!value || value === "") return value; // Permitir vacío
    
    let fecha;
    try {
        // Si viene en formato DD/MM/YYYY, convertirlo
        if (typeof value === "string" && value.includes("/")) {
            const [day, month, year] = value.split("/");
            fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
            fecha = new Date(value);
        }
    } catch (error) {
        return helper.message("Fecha de nacimiento inválida");
    }
    
    const hoy = new Date();
    const edadMinima = new Date();
    edadMinima.setFullYear(hoy.getFullYear() - 120); // Máximo 120 años
    const edadMaxima = new Date();
    edadMaxima.setFullYear(hoy.getFullYear() - 13); // Mínimo 13 años
    
    if (isNaN(fecha.getTime())) {
        return helper.message("Fecha de nacimiento inválida");
    }
    
    if (fecha > hoy) {
        return helper.message("La fecha de nacimiento no puede ser futura");
    }
    
    if (fecha < edadMinima) {
        return helper.message("La fecha de nacimiento no puede ser anterior a 1904");
    }
    
    if (fecha > edadMaxima) {
        return helper.message("Debes tener al menos 13 años");
    }
    
    return fecha;
};

export const userQueryValidation = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El id debe ser un número.",
            "number.integer": "El id debe ser un número entero.",
            "number.positive": "El id debe ser un número positivo.",
        }),
    email: Joi.string()
        .min(10)
        .max(35)
        .email()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "string.base": "El correo electrónico debe ser de tipo string.",
            "string.email": "El correo electrónico debe finalizar en .cl o .com.",
            "string.min":
                "El correo electrónico debe tener como mínimo 10 caracteres.",
            "string.max":
                "El correo electrónico debe tener como máximo 35 caracteres.",
        })
        .custom(domainEmailValidator, "Validación dominio email"),
    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
})
    .or("id", "email", "rut")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing":
            "Debes proporcionar al menos un parámetro: id, email o rut.",
    });

export const userBodyValidation = Joi.object({
    primerNombre: Joi.string()
        .min(2)
        .max(50)
        .messages({
            "string.empty": "El primer nombre no puede estar vacío.",
            "string.base": "El primer nombre debe ser de tipo string.",
            "string.min": "El primer nombre debe tener como mínimo 2 caracteres.",
            "string.max": "El primer nombre debe tener como máximo 50 caracteres.",
        }),
    segundoNombre: Joi.string()
        .allow(null, "")
        .optional()
        .messages({
            "string.base": "El segundo nombre debe ser de tipo string.",
        }),
    apellidoPaterno: Joi.string()
        .min(2)
        .max(50)
        .messages({
            "string.empty": "El apellido paterno no puede estar vacío.",
            "string.base": "El apellido paterno debe ser de tipo string.",
            "string.min": "El apellido paterno debe tener como mínimo 2 caracteres.",
            "string.max": "El apellido paterno debe tener como máximo 50 caracteres.",
        }),
    apellidoMaterno: Joi.string()
        .allow(null, "")
        .optional()
        .messages({
            "string.base": "El apellido materno debe ser de tipo string.",
        }),
    email: Joi.string()
        .min(5)
        .max(100)
        .email()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "string.base": "El correo electrónico debe ser de tipo string.",
            "string.email": "El correo electrónico debe tener un formato válido.",
            "string.min": "El correo electrónico debe tener como mínimo 5 caracteres.",
            "string.max": "El correo electrónico debe tener como máximo 100 caracteres.",
        }),
    telefono: Joi.string()
        .max(20)
        .allow(null, "")
        .optional()
        .messages({
            "string.max": "El teléfono no puede exceder 20 caracteres.",
        }),
    fechaNacimiento: Joi.string()
        .allow(null, "")
        .optional()
        .messages({
            "string.base": "La fecha de nacimiento debe ser de tipo string.",
        }),
    genero: Joi.string()
        .valid("masculino", "femenino", "otro", "no especificar", "Masculino", "Femenino", "No binario", "Prefiero no decir")
        .allow(null, "")
        .optional()
        .messages({
            "any.only": "El género debe ser una opción válida.",
        }),
    password: Joi.string()
        .min(6)
        .max(50)
        .allow("")
        .optional()
        .messages({
            "string.base": "La contraseña debe ser de tipo string.",
            "string.min": "La contraseña debe tener como mínimo 6 caracteres.",
            "string.max": "La contraseña debe tener como máximo 50 caracteres.",
        }),
    newPassword: Joi.string()
        .min(6)
        .max(50)
        .allow("")
        .optional()
        .messages({
            "string.base": "La nueva contraseña debe ser de tipo string.",
            "string.min": "La nueva contraseña debe tener como mínimo 6 caracteres.",
            "string.max": "La nueva contraseña debe tener como máximo 50 caracteres.",
        }),
    rut: Joi.string()
        .min(9)
        .max(12)
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
        }),
    rol: Joi.string()
        .valid("usuario", "administrador")
        .messages({
            "string.base": "El rol debe ser de tipo string.",
            "any.only": "El rol debe ser usuario o administrador.",
        }),
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });