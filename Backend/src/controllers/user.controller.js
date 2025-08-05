"use strict";
import {
    deleteUserService,
    getUserService,
    getUsersService,
    updateUserService,
} from "../services/user.service.js";
import {
    userBodyValidation,
    userQueryValidation,
} from "../validations/user.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getUser(req, res) {
    try {
        const { rut, id, email } = req.query;

        const { error } = userQueryValidation.validate({ rut, id, email });

        if (error) return handleErrorClient(res, 400, error.message);

        const [user, errorUser] = await getUserService({ rut, id, email });

        if (errorUser) return handleErrorClient(res, 404, errorUser);

        handleSuccess(res, 200, "Usuario encontrado", user);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getUsers(req, res) {
    try {
        const [users, errorUsers] = await getUsersService();

        if (errorUsers) return handleErrorClient(res, 404, errorUsers);

        users.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Usuarios encontrados", users);
    } catch (error) {
        handleErrorServer(
            res,
            500,
            error.message,
        );
    }
}

export async function updateUser(req, res) {
    try {
        const { rut, id, email } = req.query;
        const { body } = req;

        console.log('=== UPDATE USER REQUEST ===');
        console.log('Query params:', { rut, id, email });
        console.log('Body recibido:', JSON.stringify(body, null, 2));

        const { error: queryError } = userQueryValidation.validate({
            rut,
            id,
            email,
        });

        if (queryError) {
            console.log('Error de validación en query:', queryError.details);
            return handleErrorClient(
                res,
                400,
                "Error de validación en la consulta",
                queryError.message,
            );
        }

        console.log('Query validation exitosa');

        const { error: bodyError } = userBodyValidation.validate(body);

        if (bodyError) {
            console.log('Error de validación en body:', bodyError.details);
            return handleErrorClient(
                res,
                400,
                "Error de validación en los datos enviados",
                bodyError.message,
            );
        }

        console.log('Body validation exitosa, llamando a updateUserService...');

        const [user, userError] = await updateUserService({ rut, id, email }, body);

        if (userError) {
            console.log('Error en updateUserService:', userError);
            return handleErrorClient(res, 400, "Error modificando al usuario", userError);
        }

        console.log('Usuario actualizado exitosamente:', user);
        handleSuccess(res, 200, "Usuario modificado correctamente", user);
    } catch (error) {
        console.error('Error en updateUser controller:', error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteUser(req, res) {
    try {
        const { rut, id, email } = req.query;

        const { error: queryError } = userQueryValidation.validate({
            rut,
            id,
            email,
        });

        if (queryError) {
            return handleErrorClient(
                res,
                400,
                "Error de validación en la consulta",
                queryError.message,
            );
        }

        const [userDelete, errorUserDelete] = await deleteUserService({
            rut,
            id,
            email,
        });

        if (errorUserDelete) return handleErrorClient(res, 404, "Error eliminado al usuario", errorUserDelete);

        handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}