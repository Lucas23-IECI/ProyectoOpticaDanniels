"use strict";
import { loginService, registerService } from "../services/auth.service.js";
import {
    authValidation,
    registerValidation,
} from "../validations/auth.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function profile(req, res) {
    try {
        const userId = req.user.id;
        const { AppDataSource } = await import("../config/configDb.js");
        const User = (await import("../entity/user.entity.js")).default;
        
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["direcciones"]
        });

        if (!user) {
            return handleErrorClient(res, 404, "Usuario no encontrado");
        }

        // Remover password del resultado
        const { password, ...userData } = user;

        handleSuccess(res, 200, "Perfil obtenido correctamente", userData);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function login(req, res) {
    try {
        const { body } = req;

        const { error } = authValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [accessToken, errorToken] = await loginService(body);

        if (errorToken) {
            return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);
        }

        handleSuccess(res, 200, "Inicio de sesión exitoso", { token: accessToken });
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function register(req, res) {
    try {
        const { body } = req;
        
        console.log('=== REGISTER REQUEST ===');
        console.log('Body recibido:', JSON.stringify(body, null, 2));

        const { error } = registerValidation.validate(body);

        if (error) {
            console.log('Error de validación:', error.details);
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        console.log('Validación exitosa, llamando a registerService...');

        const [newUser, errorNewUser] = await registerService(body);

        if (errorNewUser) {
            console.log('Error en registerService:', errorNewUser);
            return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);
        }

        console.log('Usuario creado exitosamente:', newUser);
        handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
    } catch (error) {
        console.error('Error en register controller:', error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        // Validar que el usuario existe
        if (!userId) {
            return handleErrorClient(res, 401, "Usuario no autenticado");
        }

        // Usar el servicio para actualizar el usuario
        const { updateUserService } = await import("../services/auth.service.js");
        const [updatedUser, error] = await updateUserService(userId, updateData);

        if (error) {
            if (error.dataInfo === "password") {
                return handleErrorClient(res, 401, error.message);
            }
            if (error.dataInfo === "email") {
                return handleErrorClient(res, 409, error.message);
            }
            return handleErrorClient(res, 400, error.message);
        }

        handleSuccess(res, 200, "Perfil actualizado correctamente", updatedUser);
    } catch (error) {
        console.error("Error en updateProfile:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function logout(req, res) {
    try {
        handleSuccess(res, 200, "Sesión cerrada exitosamente");
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
