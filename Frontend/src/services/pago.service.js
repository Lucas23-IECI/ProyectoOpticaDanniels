import axios from "./root.service.js";

/**
 * Iniciar pago con WebPay Plus.
 * @param {number} ordenId
 * @returns {{ url: string, token: string }}
 */
export async function iniciarPagoWebpay(ordenId) {
    const response = await axios.post("/pagos/webpay/crear", { ordenId });
    return response.data.data;
}

/**
 * Iniciar pago con MercadoPago.
 * @param {number} ordenId
 * @returns {{ preferenceId, initPoint, sandboxInitPoint }}
 */
export async function iniciarPagoMercadoPago(ordenId) {
    const response = await axios.post("/pagos/mercadopago/crear", { ordenId });
    return response.data.data;
}

/**
 * Consultar el estado de pago de una orden.
 * @param {number} ordenId
 */
export async function getEstadoPago(ordenId) {
    const response = await axios.get(`/pagos/estado/${ordenId}`);
    return response.data.data;
}
