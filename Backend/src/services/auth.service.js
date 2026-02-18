"use strict";
import crypto from "crypto";
import User from "../entity/user.entity.js";
import PasswordReset from "../entity/passwordReset.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { getNombreCompleto } from "../helpers/nameHelpers.js";
import logger from "../config/logger.js";

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
            expiresIn: "24h",
        });

        return [accessToken, null];
    } catch (error) {
        logger.error("Error al iniciar sesión:", error);
        return [null, "Error interno del servidor"];
    }
}


export async function registerService(user) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const { 
            primerNombre, 
            segundoNombre, 
            apellidoPaterno, 
            apellidoMaterno, 
            rut, 
            email, 
            telefono, 
            fechaNacimiento, 
            genero, 
            rol 
        } = user;

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
            telefono: telefono || null,
            fechaNacimiento: fechaNacimiento || null,
            genero: genero || null,
            password: await encryptPassword(user.password),
            rol: rol || "usuario",
        });

        await userRepository.save(newUser);

        const { password, ...dataUser } = newUser;

        return [dataUser, null];
    } catch (error) {
        logger.error("Error al registrar un usuario", error);
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
        logger.error("Error al actualizar usuario", error);
        return [null, "Error interno del servidor"];
    }
}

export async function forgotPasswordService(email) {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const resetRepository = AppDataSource.getRepository(PasswordReset);

        // Siempre responder 200 para no revelar si el email existe
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            // No revelar que el email no existe — responder igual
            return [{ message: "Si el correo existe, recibirás un enlace de recuperación." }, null];
        }

        // Invalidar tokens anteriores del mismo email
        await resetRepository
            .createQueryBuilder()
            .update()
            .set({ used: true })
            .where("email = :email AND used = false", { email })
            .execute();

        // Generar token seguro
        const token = crypto.randomBytes(32).toString("hex");

        // Expiración: 1 hora
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const resetEntry = resetRepository.create({
            token,
            email,
            expiresAt,
            used: false,
        });

        await resetRepository.save(resetEntry);

        // Mock: log del token en vez de enviar email (email real se implementará después)
        logger.info(`[PASSWORD RESET] Token generado para ${email}: ${token}`);
        logger.info(`[PASSWORD RESET] URL de reset: /reset-password?token=${token}`);

        return [{ message: "Si el correo existe, recibirás un enlace de recuperación." }, null];
    } catch (error) {
        logger.error("Error en forgotPasswordService:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function resetPasswordService(token, newPassword) {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const resetRepository = AppDataSource.getRepository(PasswordReset);

        // Buscar token válido (no usado, no expirado)
        const resetEntry = await resetRepository
            .createQueryBuilder("pr")
            .where("pr.token = :token", { token })
            .andWhere("pr.used = false")
            .andWhere("pr.expiresAt > :now", { now: new Date() })
            .getOne();

        if (!resetEntry) {
            return [null, "El enlace de recuperación es inválido o ha expirado."];
        }

        // Buscar usuario por email
        const user = await userRepository.findOne({ where: { email: resetEntry.email } });

        if (!user) {
            return [null, "Usuario no encontrado."];
        }

        // Encriptar y actualizar contraseña
        const hashedPassword = await encryptPassword(newPassword);
        await userRepository.update(user.id, { password: hashedPassword });

        // Marcar token como usado
        await resetRepository.update(resetEntry.id, { used: true });

        logger.info(`[PASSWORD RESET] Contraseña actualizada para ${resetEntry.email}`);

        return [{ message: "Contraseña actualizada correctamente." }, null];
    } catch (error) {
        logger.error("Error en resetPasswordService:", error);
        return [null, "Error interno del servidor"];
    }
}