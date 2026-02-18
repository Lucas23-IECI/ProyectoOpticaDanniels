"use strict";
import {
    forgotPasswordService,
    loginService,
    registerService,
    resetPasswordService,
    updateUserService as updateProfileService,
} from "../services/auth.service.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
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

        const { error } = registerValidation.validate(body);

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [newUser, errorNewUser] = await registerService(body);

        if (errorNewUser) {
            return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);
        }

        handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        if (!userId) {
            return handleErrorClient(res, 401, "Usuario no autenticado");
        }

        const [updatedUser, error] = await updateProfileService(userId, updateData);

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
        handleErrorServer(res, 500, error.message);
    }
}

export async function logout(req, res) {
    // Logout stateless: el client elimina el token del localStorage.
    // No se implementa blacklist server-side por diseño arquitectónico:
    // - Proyecto académico sin alta concurrencia
    // - JWT expira en 24h (auth.service.js)
    // - Blacklist añade complejidad (store + cleanup) sin beneficio real
    try {
        handleSuccess(res, 200, "Sesión cerrada exitosamente");
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        const [result, error] = await forgotPasswordService(email);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        handleSuccess(res, 200, "Si el correo existe, se ha enviado un enlace de recuperación", result);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        const [result, error] = await resetPasswordService(token, newPassword);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        handleSuccess(res, 200, "Contraseña actualizada correctamente", result);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
