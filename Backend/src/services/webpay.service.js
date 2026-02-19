"use strict";
import Transbank from "transbank-sdk";
const { WebpayPlus, Options, Environment } = Transbank;
import {
    APP_URL,
    FRONTEND_URL,
    WEBPAY_API_KEY,
    WEBPAY_COMMERCE_CODE,
    WEBPAY_ENVIRONMENT,
} from "../config/configEnv.js";
import logger from "../config/logger.js";

// Configurar Transbank WebPay Plus
let tx;

if (WEBPAY_ENVIRONMENT === "Integration") {
    // Modo sandbox: sin credenciales, el SDK usa las de prueba
    tx = new WebpayPlus.Transaction();
    logger.info("WebPay configurado en modo integración (sandbox).");
} else {
    // Modo producción: usar credenciales reales
    const options = new Options(
        WEBPAY_COMMERCE_CODE, WEBPAY_API_KEY, Environment.Production,
    );
    tx = new WebpayPlus.Transaction(options);
    logger.info("WebPay configurado en modo producción.");
}

/**
 * Crea una transacción WebPay Plus.
 * @param {string} buyOrder   — Identificador único de la orden (max 26 chars)
 * @param {string} sessionId  — ID de sesión del usuario
 * @param {number} amount     — Monto en CLP (sin decimales)
 * @param {string} returnUrl  — URL de retorno después del pago
 */
export async function crearTransaccionWebpay(
    buyOrder, sessionId, amount, returnUrl,
) {
    try {
        const response = await tx.create(
            buyOrder,
            sessionId,
            amount,
            returnUrl || `${APP_URL}/api/pagos/webpay/retorno`,
        );
        logger.info(`WebPay transacción creada: ${buyOrder}`);
        return {
            url: response.url,
            token: response.token,
        };
    } catch (error) {
        logger.error("Error creando transacción WebPay:", error);
        throw error;
    }
}

/**
 * Confirma una transacción WebPay Plus con el token recibido.
 * @param {string} token — Token de la transacción
 */
export async function confirmarTransaccionWebpay(token) {
    try {
        const response = await tx.commit(token);
        logger.info(`WebPay confirmada: ${response.buy_order} — status: ${response.status}`);
        return {
            buyOrder: response.buy_order,
            sessionId: response.session_id,
            amount: response.amount,
            status: response.status,
            authorizationCode: response.authorization_code,
            responseCode: response.response_code,
            transactionDate: response.transaction_date,
            cardNumber: response.card_detail?.card_number,
            paymentType: response.payment_type_code,
            rawResponse: response,
        };
    } catch (error) {
        logger.error("Error confirmando transacción WebPay:", error);
        throw error;
    }
}

/**
 * URL del frontend para redirección post-pago.
 */
export function getWebpayReturnUrl(ordenId) {
    return `${APP_URL}/api/pagos/webpay/retorno`;
}

export function getWebpayFinalUrl(ordenId, status) {
    return `${FRONTEND_URL}/checkout/resultado?ordenId=${ordenId}&status=${status}`;
}
