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
        .max(30)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
        .messages({
            "string.empty": "El primer nombre no puede estar vacío.",
            "string.base": "El primer nombre debe ser de tipo string.",
            "string.min": "El primer nombre debe tener como mínimo 2 caracteres.",
            "string.max": "El primer nombre debe tener como máximo 30 caracteres.",
            "string.pattern.base": "El primer nombre solo puede contener letras (sin espacios).",
        }),
    segundoNombre: Joi.string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
        .allow(null, "")
        .messages({
            "string.base": "El segundo nombre debe ser de tipo string.",
            "string.min": "El segundo nombre debe tener como mínimo 2 caracteres.",
            "string.max": "El segundo nombre debe tener como máximo 30 caracteres.",
            "string.pattern.base": "El segundo nombre solo puede contener letras (sin espacios).",
        }),
    apellidoPaterno: Joi.string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
        .messages({
            "string.empty": "El apellido paterno no puede estar vacío.",
            "string.base": "El apellido paterno debe ser de tipo string.",
            "string.min": "El apellido paterno debe tener como mínimo 2 caracteres.",
            "string.max": "El apellido paterno debe tener como máximo 30 caracteres.",
            "string.pattern.base": "El apellido paterno solo puede contener letras (sin espacios).",
        }),
    apellidoMaterno: Joi.string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
        .allow(null, "")
        .messages({
            "string.base": "El apellido materno debe ser de tipo string.",
            "string.min": "El apellido materno debe tener como mínimo 2 caracteres.",
            "string.max": "El apellido materno debe tener como máximo 30 caracteres.",
            "string.pattern.base": "El apellido materno solo puede contener letras (sin espacios).",
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
    telefono: Joi.string()
        .max(20)
        .allow(null, "")
        .custom(telefonoChilenoValidator, "Validación teléfono chileno")
        .messages({
            "string.max": "El teléfono no puede exceder 20 caracteres.",
        }),
    fechaNacimiento: Joi.date()
        .allow(null, "")
        .custom(fechaNacimientoValidator, "Validación fecha de nacimiento")
        .messages({
            "date.base": "La fecha de nacimiento debe ser una fecha válida.",
        }),
    genero: Joi.string()
        .valid("Masculino", "Femenino", "No binario", "Prefiero no decir")
        .allow(null, "")
        .messages({
            "any.only": "El género debe ser: Masculino, Femenino, No binario o Prefiero no decir.",
        }),
    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9]+$/)
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "string.base": "La contraseña debe ser de tipo string.",
            "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base":
                "La contraseña solo puede contener letras y números.",
        }),
    newPassword: Joi.string()
        .min(8)
        .max(26)
        .allow("")
        .pattern(/^[a-zA-Z0-9]+$/)
        .messages({
            "string.empty": "La nueva contraseña no puede estar vacía.",
            "string.base": "La nueva contraseña debe ser de tipo string.",
            "string.min": "La nueva contraseña debe tener como mínimo 8 caracteres.",
            "string.max": "La nueva contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base":
                "La nueva contraseña solo puede contener letras y números.",
        }),
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
    rol: Joi.string()
        .min(4)
        .max(15)
        .messages({
            "string.base": "El rol debe ser de tipo string.",
            "string.min": "El rol debe tener como mínimo 4 caracteres.",
            "string.max": "El rol debe tener como máximo 10 caracteres.",
        }),
})
    .or(
        "primerNombre",
        "segundoNombre",
        "apellidoPaterno",
        "apellidoMaterno",
        "email",
        "telefono",
        "fechaNacimiento",
        "genero",
        "password",
        "newPassword",
        "rut",
        "rol"
    )
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing":
            "Debes proporcionar al menos un campo: primerNombre, segundoNombre, apellidoPaterno, " +
            "apellidoMaterno, email, telefono, fechaNacimiento, genero, password, newPassword, rut o rol.",
    });