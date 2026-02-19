"use strict";
import { AppDataSource } from "../config/configDb.js";
import Orden from "../entity/orden.entity.js";
import Pago from "../entity/pago.entity.js";
import {
    confirmarTransaccionWebpay,
    crearTransaccionWebpay,
    getWebpayFinalUrl,
} from "../services/webpay.service.js";
import {
    crearPreferenciaMercadoPago,
    obtenerPagoMercadoPago,
} from "../services/mercadopago.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";
import logger from "../config/logger.js";

// ==========================================
// WEBPAY PLUS
// ==========================================

/**
 * POST /pagos/webpay/crear
 * Body: { ordenId }
 * Inicia una transacción WebPay Plus para la orden dada.
 */
export const iniciarPagoWebpay = async (req, res) => {
    try {
        const { ordenId } = req.body;
        if (!ordenId) {
            return handleErrorClient(res, 400, "Se requiere ordenId.");
        }

        const ordenRepo = AppDataSource.getRepository(Orden);
        const orden = await ordenRepo.findOne({
            where: { id: parseInt(ordenId) },
        });

        if (!orden) {
            return handleErrorClient(res, 404, "Orden no encontrada.");
        }

        if (orden.estadoPago === "pagada") {
            return handleErrorClient(res, 400, "Esta orden ya fue pagada.");
        }

        const buyOrder = `OD-${orden.id}-${Date.now()}`.slice(0, 26);
        const sessionId = `S-${req.user?.id || "anon"}-${Date.now()}`;
        const amount = Math.round(Number(orden.total));

        const { url, token } = await crearTransaccionWebpay(
            buyOrder, sessionId, amount,
        );

        // Guardar token en la orden
        orden.tokenWs = token;
        await ordenRepo.save(orden);

        // Registrar pago iniciado
        const pagoRepo = AppDataSource.getRepository(Pago);
        await pagoRepo.save(pagoRepo.create({
            orden: { id: orden.id },
            monto: amount,
            metodo: "webpay",
            estado: "iniciado",
            transactionId: buyOrder,
        }));

        handleSuccess(res, 200, "Transacción WebPay creada.", { url, token });
    } catch (error) {
        logger.error("Error iniciando pago WebPay:", error);
        handleErrorServer(res, 500, error.message);
    }
};

/**
 * POST /pagos/webpay/retorno
 * WebPay redirige aquí con token_ws en el body.
 * Confirma la transacción y redirige al frontend.
 */
export const retornoWebpay = async (req, res) => {
    try {
        const token = req.body.token_ws || req.query.token_ws;

        if (!token) {
            // Usuario canceló — token_ws ausente, TBK_TOKEN presente
            const tbkOrden = req.body.TBK_ORDEN_COMPRA || req.query.TBK_ORDEN_COMPRA;
            logger.info(`WebPay cancelado por usuario. Orden: ${tbkOrden}`);
            return res.redirect(
                getWebpayFinalUrl(tbkOrden || 0, "cancelado"),
            );
        }

        const resultado = await confirmarTransaccionWebpay(token);

        // Buscar orden por tokenWs
        const ordenRepo = AppDataSource.getRepository(Orden);
        const orden = await ordenRepo.findOne({
            where: { tokenWs: token },
        });

        if (!orden) {
            logger.error(`Orden no encontrada para tokenWs: ${token}`);
            return res.redirect(getWebpayFinalUrl(0, "error"));
        }

        // Actualizar pago
        const pagoRepo = AppDataSource.getRepository(Pago);
        const pago = await pagoRepo.findOne({
            where: { orden: { id: orden.id }, metodo: "webpay" },
            order: { createdAt: "DESC" },
        });

        if (pago) {
            pago.estado = resultado.responseCode === 0 ? "aprobado" : "rechazado";
            pago.authorizationCode = String(resultado.authorizationCode || "");
            pago.responseCode = String(resultado.responseCode);
            pago.rawResponse = resultado.rawResponse;
            pago.transactionId = resultado.buyOrder;
            await pagoRepo.save(pago);
        }

        // Actualizar orden
        if (resultado.responseCode === 0) {
            orden.estadoPago = "pagada";
            orden.estado = "pagada";
            orden.transactionId = resultado.buyOrder;
            orden.metodoPago = "webpay";
        } else {
            orden.estadoPago = "rechazada";
        }
        await ordenRepo.save(orden);

        const status = resultado.responseCode === 0 ? "aprobado" : "rechazado";
        return res.redirect(getWebpayFinalUrl(orden.id, status));
    } catch (error) {
        logger.error("Error en retorno WebPay:", error);
        return res.redirect(getWebpayFinalUrl(0, "error"));
    }
};

// ==========================================
// MERCADO PAGO
// ==========================================

/**
 * POST /pagos/mercadopago/crear
 * Body: { ordenId }
 */
export const iniciarPagoMercadoPago = async (req, res) => {
    try {
        const { ordenId } = req.body;
        if (!ordenId) {
            return handleErrorClient(res, 400, "Se requiere ordenId.");
        }

        const ordenRepo = AppDataSource.getRepository(Orden);
        const orden = await ordenRepo.findOne({
            where: { id: parseInt(ordenId) },
        });

        if (!orden) {
            return handleErrorClient(res, 404, "Orden no encontrada.");
        }

        if (orden.estadoPago === "pagada") {
            return handleErrorClient(res, 400, "Esta orden ya fue pagada.");
        }

        const amount = Math.round(Number(orden.total));

        const { preferenceId, initPoint, sandboxInitPoint } =
            await crearPreferenciaMercadoPago({
                ordenId: orden.id,
                titulo: `Orden #${orden.id} — Óptica Danniels`,
                monto: amount,
                email: orden.correo,
            });

        // Registrar pago iniciado
        const pagoRepo = AppDataSource.getRepository(Pago);
        await pagoRepo.save(pagoRepo.create({
            orden: { id: orden.id },
            monto: amount,
            metodo: "mercadopago",
            estado: "iniciado",
            transactionId: preferenceId,
        }));

        orden.metodoPago = "mercadopago";
        await ordenRepo.save(orden);

        handleSuccess(res, 200, "Preferencia MercadoPago creada.", {
            preferenceId,
            initPoint,
            sandboxInitPoint,
        });
    } catch (error) {
        logger.error("Error iniciando pago MercadoPago:", error);
        handleErrorServer(res, 500, error.message);
    }
};

/**
 * POST /pagos/mercadopago/webhook
 * Webhook de notificación de MercadoPago.
 */
export const webhookMercadoPago = async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type !== "payment" || !data?.id) {
            return res.sendStatus(200);
        }

        const pagoMP = await obtenerPagoMercadoPago(data.id);
        const ordenId = parseInt(pagoMP.externalReference);

        if (!ordenId) {
            logger.warn(`Webhook MP: external_reference no válido: ${pagoMP.externalReference}`);
            return res.sendStatus(200);
        }

        const ordenRepo = AppDataSource.getRepository(Orden);
        const orden = await ordenRepo.findOneBy({ id: ordenId });

        if (!orden) {
            logger.warn(`Webhook MP: Orden #${ordenId} no encontrada.`);
            return res.sendStatus(200);
        }

        // Actualizar pago
        const pagoRepo = AppDataSource.getRepository(Pago);
        const pago = await pagoRepo.findOne({
            where: { orden: { id: orden.id }, metodo: "mercadopago" },
            order: { createdAt: "DESC" },
        });

        const estadoPago = pagoMP.status === "approved" ? "aprobado" : "rechazado";

        if (pago) {
            pago.estado = estadoPago;
            pago.transactionId = String(pagoMP.id);
            pago.rawResponse = pagoMP.rawResponse;
            await pagoRepo.save(pago);
        }

        // Actualizar orden
        if (pagoMP.status === "approved") {
            orden.estadoPago = "pagada";
            orden.estado = "pagada";
            orden.transactionId = String(pagoMP.id);
        } else {
            orden.estadoPago = "rechazada";
        }
        await ordenRepo.save(orden);

        logger.info(`Webhook MP: Orden #${ordenId} -> ${estadoPago}`);
        return res.sendStatus(200);
    } catch (error) {
        logger.error("Error en webhook MercadoPago:", error);
        return res.sendStatus(500);
    }
};

/**
 * GET /pagos/estado/:ordenId
 * Consulta el estado de pago de una orden.
 */
export const estadoPagoController = async (req, res) => {
    try {
        const { ordenId } = req.params;
        const ordenRepo = AppDataSource.getRepository(Orden);
        const orden = await ordenRepo.findOne({
            where: { id: parseInt(ordenId) },
            relations: { pagos: true },
        });

        if (!orden) {
            return handleErrorClient(res, 404, "Orden no encontrada.");
        }

        handleSuccess(res, 200, "Estado de pago.", {
            ordenId: orden.id,
            estadoPago: orden.estadoPago,
            metodoPago: orden.metodoPago,
            pagos: orden.pagos,
        });
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};
