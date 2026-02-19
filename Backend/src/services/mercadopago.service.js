"use strict";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import {
    APP_URL,
    FRONTEND_URL,
    MERCADOPAGO_ACCESS_TOKEN,
} from "../config/configEnv.js";
import logger from "../config/logger.js";

let client = null;

function getClient() {
    if (!client && MERCADOPAGO_ACCESS_TOKEN) {
        client = new MercadoPagoConfig({
            accessToken: MERCADOPAGO_ACCESS_TOKEN,
        });
    }
    return client;
}

/**
 * Crea una preferencia de pago en MercadoPago.
 * @param {Object} params
 * @param {number} params.ordenId
 * @param {string} params.titulo
 * @param {number} params.monto - en CLP
 * @param {string} params.email - del comprador
 */
export async function crearPreferenciaMercadoPago({
    ordenId, titulo, monto, email,
}) {
    const mp = getClient();
    if (!mp) {
        throw new Error("MercadoPago no está configurado. Falta ACCESS_TOKEN.");
    }

    const preference = new Preference(mp);

    const response = await preference.create({
        body: {
            items: [
                {
                    id: String(ordenId),
                    title: titulo || `Orden #${ordenId} — Óptica Danniels`,
                    quantity: 1,
                    unit_price: monto,
                    currency_id: "CLP",
                },
            ],
            payer: {
                email: email || "comprador@test.com",
            },
            back_urls: {
                success: `${FRONTEND_URL}/checkout/resultado?status=aprobado&orden=${ordenId}`,
                failure: `${FRONTEND_URL}/checkout/resultado?status=rechazado&orden=${ordenId}`,
                pending: `${FRONTEND_URL}/checkout/resultado?status=pendiente&orden=${ordenId}`,
            },
            auto_return: "approved",
            notification_url: `${APP_URL}/api/pagos/mercadopago/webhook`,
            external_reference: String(ordenId),
        },
    });

    logger.info(`MercadoPago preferencia creada para orden #${ordenId}`);

    return {
        preferenceId: response.id,
        initPoint: response.init_point,
        sandboxInitPoint: response.sandbox_init_point,
    };
}

/**
 * Obtiene el detalle de un pago de MercadoPago por ID.
 */
export async function obtenerPagoMercadoPago(paymentId) {
    const mp = getClient();
    if (!mp) {
        throw new Error("MercadoPago no está configurado.");
    }

    const payment = new Payment(mp);
    const response = await payment.get({ id: paymentId });

    return {
        id: response.id,
        status: response.status,
        statusDetail: response.status_detail,
        amount: response.transaction_amount,
        externalReference: response.external_reference,
        rawResponse: response,
    };
}
