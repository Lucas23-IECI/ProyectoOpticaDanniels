"use strict";
import { Router } from "express";
import {
    iniciarPagoWebpay,
    retornoWebpay,
    iniciarPagoMercadoPago,
    webhookMercadoPago,
    estadoPagoController,
} from "../controllers/pago.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// ==========================================
// WebPay Plus
// ==========================================
// Iniciar pago — requiere auth
router.post("/webpay/crear", authenticateJwt, iniciarPagoWebpay);
// Retorno de WebPay — NO requiere auth (redirige el navegador)
router.post("/webpay/retorno", retornoWebpay);

// ==========================================
// MercadoPago
// ==========================================
// Iniciar pago — requiere auth
router.post("/mercadopago/crear", authenticateJwt, iniciarPagoMercadoPago);
// Webhook — NO requiere auth (llamado por MercadoPago)
router.post("/mercadopago/webhook", webhookMercadoPago);

// ==========================================
// Consulta estado
// ==========================================
router.get("/estado/:ordenId", authenticateJwt, estadoPagoController);

export default router;
