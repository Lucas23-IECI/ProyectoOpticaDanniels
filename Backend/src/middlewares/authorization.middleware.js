import {
    handleErrorClient,
    handleErrorServer,
} from "../handlers/responseHandlers.js";

/**
 * Middleware que verifica si el usuario autenticado tiene rol de administrador.
 * Lee el rol directamente del JWT (req.user) en vez de hacer query a la BD.
 * Requiere que authenticateJwt se ejecute antes en la cadena de middlewares.
 */
export async function isAdmin(req, res, next) {
    try {
        if (!req.user) {
            return handleErrorClient(
                res,
                401,
                "No autenticado",
                "Debe iniciar sesión para acceder a este recurso."
            );
        }

        if (req.user.rol !== "administrador") {
            return handleErrorClient(
                res,
                403,
                "Error al acceder al recurso",
                "Se requiere un rol de administrador para realizar esta acción."
            );
        }
        next();
    } catch (error) {
        handleErrorServer(
            res,
            500,
            error.message,
        );
    }
}