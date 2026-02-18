"use strict";
import nodemailer from "nodemailer";
import {
    FRONTEND_URL,
    SMTP_HOST,
    SMTP_PASS,
    SMTP_PORT,
    SMTP_USER,
} from "../config/configEnv.js";
import logger from "../config/logger.js";

/**
 * Envía un email de recuperación de contraseña.
 * Si las credenciales SMTP no están configuradas, hace fallback a log del token.
 * @param {string} email - Email del destinatario
 * @param {string} token - Token de reset generado
 * @returns {Promise<[boolean|null, string|null]>}
 */
export async function sendPasswordResetEmail(email, token) {
    const resetUrl = `${FRONTEND_URL}/recuperar-password?token=${token}`;

    // Fallback: si no hay SMTP configurado, loguear el link
    if (!SMTP_USER || !SMTP_PASS) {
        logger.warn("[EMAIL] SMTP no configurado — mostrando link de recovery en logs");
        logger.info(`[PASSWORD RESET] URL: ${resetUrl}`);
        return [true, null];
    }

    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        const tableStyle = [
            "background:#ffffff",
            "border-radius:12px",
            "box-shadow:0 2px 12px rgba(0,0,0,0.08)",
            "padding:40px",
        ].join(";");

        const bodyStyle = [
            "margin:0",
            "padding:0",
            "background:#f4f6f9",
            "font-family:'Segoe UI',Arial,sans-serif",
        ].join(";");

        const btnStyle = [
            "display:inline-block",
            "background:#2147A2",
            "color:#ffffff",
            "text-decoration:none",
            "padding:14px 32px",
            "border-radius:8px",
            "font-size:16px",
            "font-weight:600",
        ].join(";");

        const year = new Date().getFullYear();

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"></head>
        <body style="${bodyStyle}">
          <table width="100%" cellpadding="0" cellspacing="0"
            style="padding:40px 0;">
            <tr><td align="center">
              <table width="520" cellpadding="0"
                cellspacing="0" style="${tableStyle}">
                <tr><td align="center"
                  style="padding-bottom:24px;">
                  <h1 style="margin:0;color:#2147A2;
                    font-size:24px;">Óptica Danniels</h1>
                </td></tr>
                <tr><td style="padding-bottom:16px;">
                  <h2 style="margin:0;color:#333;
                    font-size:20px;">
                    Recuperación de contraseña</h2>
                </td></tr>
                <tr><td style="padding-bottom:24px;
                  color:#555;font-size:15px;
                  line-height:1.6;">
                  <p>Recibimos una solicitud para
                    restablecer tu contraseña.
                    Haz clic en el botón:</p>
                </td></tr>
                <tr><td align="center"
                  style="padding-bottom:24px;">
                  <a href="${resetUrl}"
                    style="${btnStyle}">
                    Restablecer contraseña
                  </a>
                </td></tr>
                <tr><td style="padding-bottom:16px;
                  color:#888;font-size:13px;
                  line-height:1.5;">
                  <p>Si no solicitaste este cambio,
                    ignora este correo.
                    El enlace expira en
                    <strong>1 hora</strong>.</p>
                  <p>URL alternativa:</p>
                  <p style="word-break:break-all;
                    color:#2147A2;">
                    ${resetUrl}</p>
                </td></tr>
                <tr><td style="border-top:1px solid #eee;
                  padding-top:16px;color:#aaa;
                  font-size:12px;text-align:center;">
                  © ${year} Óptica Danniels
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>`;

        await transporter.sendMail({
            from: `"Óptica Danniels" <${SMTP_USER}>`,
            to: email,
            subject: "Recuperación de contraseña — Óptica Danniels",
            html: htmlContent,
        });

        logger.info(`[EMAIL] Email de recovery enviado a ${email}`);
        return [true, null];
    } catch (error) {
        logger.error(`[EMAIL] Error enviando email a ${email}:`, error.message);
        // No bloquear el flujo — loguear el link como fallback
        logger.info(`[PASSWORD RESET] Fallback URL: ${resetUrl}`);
        return [null, error.message];
    }
}
