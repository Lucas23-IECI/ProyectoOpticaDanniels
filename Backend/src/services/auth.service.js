"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { getNombreCompleto } from "../helpers/nameHelpers.js";

export async function loginService(user) {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { email, password } = user;

        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });

        const userFound = await userRepository.findOne({
            where: { email },
            relations: ["direcciones"]
        });

        if (!userFound) {
            return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
        }

        const isMatch = await comparePassword(password, userFound.password);

        if (!isMatch) {
            return [null, createErrorMessage("password", "La contraseña es incorrecta")];
        }

        const payload = {
            id: userFound.id,
            primerNombre: userFound.primerNombre,
            segundoNombre: userFound.segundoNombre,
            apellidoPaterno: userFound.apellidoPaterno,
            apellidoMaterno: userFound.apellidoMaterno,
            nombreCompleto: getNombreCompleto(userFound),
            email: userFound.email,
            rut: userFound.rut,
            rol: userFound.rol,
        };

        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: "100y",
        });

        return [accessToken, null];
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return [null, "Error interno del servidor"];
    }
}


export async function registerService(user) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const { primerNombre, segundoNombre, apellidoPaterno, apellidoMaterno, rut, email } = user;

        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });

        const existingEmailUser = await userRepository.findOne({
            where: {
                email,
            },
        });

        if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

        const existingRutUser = await userRepository.findOne({
            where: {
                rut,
            },
        });

        if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

        const newUser = userRepository.create({
            primerNombre,
            segundoNombre: segundoNombre || null,
            apellidoPaterno,
            apellidoMaterno: apellidoMaterno || null,
            email,
            rut,
            password: await encryptPassword(user.password),
            rol: "usuario",
        });

        await userRepository.save(newUser);

        const { password, ...dataUser } = newUser;

        return [dataUser, null];
    } catch (error) {
        console.error("Error al registrar un usuario", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateUserService(userId, updateData) {
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });

        // Buscar el usuario
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["direcciones"]
        });

        if (!user) {
            return [null, createErrorMessage("user", "Usuario no encontrado")];
        }

        // Si se va a cambiar contraseña, validar la actual
        if (updateData.newPassword) {
            if (!updateData.password) {
                return [null, createErrorMessage("password", "Contraseña actual requerida")];
            }

            const isMatch = await comparePassword(updateData.password, user.password);
            if (!isMatch) {
                return [null, createErrorMessage("password", "Contraseña actual incorrecta")];
            }

            // Encriptar nueva contraseña
            updateData.password = await encryptPassword(updateData.newPassword);
            delete updateData.newPassword;
        }

        // Verificar si el email ya existe (si se está cambiando)
        if (updateData.email && updateData.email !== user.email) {
            const existingEmailUser = await userRepository.findOne({
                where: { email: updateData.email }
            });

            if (existingEmailUser) {
                return [null, createErrorMessage("email", "Correo electrónico en uso")];
            }
        }

        // Filtrar campos vacíos y preparar datos para actualizar
        const fieldsToUpdate = {};
        const optionalFields = ["telefono", "fechaNacimiento", "genero", "segundoNombre", "apellidoMaterno"];
        
        Object.keys(updateData).forEach(key => {
            const value = updateData[key];
            
            // Para campos obligatorios, solo incluir si tienen valor
            if (value !== null && value !== undefined && value !== "") {
                fieldsToUpdate[key] = value;
            }
            // Para campos opcionales, convertir cadena vacía a null
            else if (optionalFields.includes(key) && (value === "" || value === null)) {
                fieldsToUpdate[key] = null;
            }
        });

        // Actualizar campos básicos del usuario solo si hay campos para actualizar
        if (Object.keys(fieldsToUpdate).length > 0) {
            await userRepository.update(userId, fieldsToUpdate);
        }
        
        // Obtener usuario actualizado con direcciones
        const updatedUser = await userRepository.findOne({
            where: { id: userId },
            relations: ["direcciones"]
        });

        // Remover password del resultado
        const { password, ...dataUser } = updatedUser;

        return [dataUser, null];
    } catch (error) {
        console.error("Error al actualizar usuario", error);
        return [null, "Error interno del servidor"];
    }
}