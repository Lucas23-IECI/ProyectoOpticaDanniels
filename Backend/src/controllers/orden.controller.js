import {
    actualizarEstadoOrdenService,
    crearOrdenService,
    eliminarOrdenService,
    obtenerOrdenesService,
    obtenerOrdenPorIdService,
    obtenerMisOrdenesService,
} from "../services/orden.service.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";
import {
    calcularCostoEnvio,
    obtenerRegionesEnvio,
} from "../helpers/shipping.helper.js";
import { generarBoletaPDF } from "../services/boleta.service.js";
import {
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
} from "../helpers/email.helper.js";

export const crearOrdenController = async (req, res) => {
    try {
        const usuarioId = req.user?.id || null;
        const correoIngresado = req.body?.cliente?.correo;

        if (usuarioId) {
            const userRepo = AppDataSource.getRepository(User);
            const usuarioActual = await userRepo.findOneBy({ id: usuarioId });

            if (!usuarioActual) {
                return handleErrorClient(res, 404, "Usuario autenticado no encontrado.");
            }

            if (correoIngresado !== usuarioActual.email) {
                const correoOcupado = await userRepo.findOneBy({ email: correoIngresado });

                if (correoOcupado) {
                    return handleErrorClient(
                        res,
                        400,
                        "El correo ingresado ya está asociado a otra cuenta. Debes usar el correo de tu sesión.",
                    );
                }
            }
        }

        const ordenCreada = await crearOrdenService(req.body, usuarioId);

        // Enviar email de confirmación (async, no bloquea la respuesta)
        sendOrderConfirmationEmail(ordenCreada).catch(() => {});

        handleSuccess(res, 201, "Orden creada exitosamente.", ordenCreada);
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const obtenerOrdenesController = async (req, res) => {
    try {
        const parametrosPermitidos = ["correo", "estado", "orden", "desde", "hasta"];
        const keysQuery = Object.keys(req.query);

        const parametrosInvalidos = keysQuery.filter(k => !parametrosPermitidos.includes(k));

        if (parametrosInvalidos.length > 0) {
            return handleErrorClient(
                res,
                400,
                `Parámetros inválidos en la URL: ${parametrosInvalidos.join(", ")}`,
            );
        }

        const { correo, estado, orden, desde, hasta } = req.query;
        const filtros = { correo, estado, orden, desde, hasta };

        const ordenes = await obtenerOrdenesService(filtros);

        if (!ordenes || ordenes.length === 0) {
            return handleSuccess(res, 200, "No se encontraron órdenes con los filtros especificados.", { ordenes: [] });
        }

        handleSuccess(res, 200, "Órdenes encontradas correctamente.", { ordenes });
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};



export const obtenerOrdenPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await obtenerOrdenPorIdService(id);

        if (!orden) {
            return handleErrorClient(res, 404, "Orden no encontrada.");
        }

        // Ownership check: si la orden tiene usuario, verificar que sea el dueño o admin
        const esAdmin = req.user?.rol === "administrador";
        const esDueno = orden.usuario && orden.usuario.id === req.user?.id;
        const esAnonima = !orden.usuario;

        if (!esAdmin && !esDueno && !esAnonima) {
            return handleErrorClient(res, 403, "No tienes permiso para ver esta orden.");
        }

        handleSuccess(res, 200, "Orden obtenida correctamente.", orden);
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const actualizarEstadoOrdenController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const ordenActualizada = await actualizarEstadoOrdenService(id, estado);

        // Notificar al cliente por email (async, no bloquea)
        sendOrderStatusEmail(ordenActualizada, estado).catch(() => {});

        handleSuccess(res, 200, "Estado de la orden actualizado correctamente.", ordenActualizada);
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const eliminarOrdenController = async (req, res) => {
    try {
        const { id } = req.params;
        await eliminarOrdenService(id);

        handleSuccess(res, 200, "Orden eliminada correctamente.");
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

/** GET /ordenes/costo-envio?region=...&comuna=... */
export const costoEnvioController = async (req, res) => {
    try {
        const { region, comuna } = req.query;
        if (!region) {
            return handleErrorClient(res, 400, "Se requiere el parámetro 'region'.");
        }
        const resultado = calcularCostoEnvio(region, comuna || "");
        handleSuccess(res, 200, "Costo de envío calculado.", resultado);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

/** GET /ordenes/regiones-envio */
export const regionesEnvioController = async (_req, res) => {
    try {
        const regiones = obtenerRegionesEnvio();
        handleSuccess(res, 200, "Regiones disponibles.", regiones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

/** GET /ordenes/mis-ordenes — órdenes del usuario autenticado */
export const misOrdenesController = async (req, res) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            return handleErrorClient(res, 401, "Debes iniciar sesión.");
        }
        const ordenes = await obtenerMisOrdenesService(usuarioId);
        handleSuccess(res, 200, "Mis órdenes obtenidas correctamente.", { ordenes });
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

/** GET /ordenes/:id/boleta — Descarga boleta PDF */
export const boletaOrdenController = async (req, res) => {
    try {
        const { id } = req.params;
        const pdfBuffer = await generarBoletaPDF(id);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="boleta-orden-${id}.pdf"`,
            "Content-Length": pdfBuffer.length,
        });
        res.send(pdfBuffer);
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};
