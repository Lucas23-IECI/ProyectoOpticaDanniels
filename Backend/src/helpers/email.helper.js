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
 * Crea un transporter de nodemailer.
 * Si no hay SMTP configurado, retorna null.
 */
const crearTransporter = () => {
    if (!SMTP_USER || !SMTP_PASS) return null;
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
};

/** Estilos reutilizables */
const BRAND_COLOR = "#2147A2";
const YEAR = new Date().getFullYear();

const bodyStyle = [
    "margin:0", "padding:0", "background:#f4f6f9",
    "font-family:'Segoe UI',Arial,sans-serif",
].join(";");

const tableStyle = [
    "background:#ffffff", "border-radius:12px",
    "box-shadow:0 2px 12px rgba(0,0,0,0.08)", "padding:40px",
].join(";");

const btnStyle = [
    "display:inline-block", `background:${BRAND_COLOR}`,
    "color:#ffffff", "text-decoration:none",
    "padding:14px 32px", "border-radius:8px",
    "font-size:16px", "font-weight:600",
].join(";");

const wrapEmail = (innerContent) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="${bodyStyle}">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="${tableStyle}">
        <tr><td align="center" style="padding-bottom:24px;">
          <h1 style="margin:0;color:${BRAND_COLOR};font-size:24px;">
            Óptica Danniels</h1>
        </td></tr>
        ${innerContent}
        <tr><td style="border-top:1px solid #eee;padding-top:16px;
          color:#aaa;font-size:12px;text-align:center;">
          © ${YEAR} Óptica Danniels
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

/**
 * Envía un email de recuperación de contraseña.
 */
export async function sendPasswordResetEmail(email, token) {
    const resetUrl = `${FRONTEND_URL}/recuperar-password?token=${token}`;

    if (!SMTP_USER || !SMTP_PASS) {
        logger.warn("[EMAIL] SMTP no configurado — mostrando link de recovery en logs");
        logger.info(`[PASSWORD RESET] URL: ${resetUrl}`);
        return [true, null];
    }

    try {
        const transporter = crearTransporter();
        const htmlContent = wrapEmail(`
            <tr><td style="padding-bottom:16px;">
              <h2 style="margin:0;color:#333;font-size:20px;">
                Recuperación de contraseña</h2>
            </td></tr>
            <tr><td style="padding-bottom:24px;color:#555;font-size:15px;line-height:1.6;">
              <p>Recibimos una solicitud para restablecer tu contraseña.
                Haz clic en el botón:</p>
            </td></tr>
            <tr><td align="center" style="padding-bottom:24px;">
              <a href="${resetUrl}" style="${btnStyle}">Restablecer contraseña</a>
            </td></tr>
            <tr><td style="padding-bottom:16px;color:#888;font-size:13px;line-height:1.5;">
              <p>Si no solicitaste este cambio, ignora este correo.
                El enlace expira en <strong>1 hora</strong>.</p>
              <p>URL alternativa:</p>
              <p style="word-break:break-all;color:${BRAND_COLOR};">${resetUrl}</p>
            </td></tr>
        `);

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
        logger.info(`[PASSWORD RESET] Fallback URL: ${resetUrl}`);
        return [null, error.message];
    }
}

/**
 * Envía un email de confirmación de orden al cliente.
 * @param {Object} orden — La orden con sus productos poblados
 */
export async function sendOrderConfirmationEmail(orden) {
    const transporter = crearTransporter();
    if (!transporter) {
        logger.warn("[EMAIL] SMTP no configurado — omitiendo confirmación de orden");
        return [true, null];
    }

    try {
        const formatPrecio = (v) => `$${Number(v).toLocaleString("es-CL")}`;
        const misComprasUrl = `${FRONTEND_URL}/mis-compras`;

        const productosRows = (orden.productos || []).map((op) => {
            const nombre = op.producto?.nombre || "Producto";
            return `<tr>
                <td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:14px;">
                    ${nombre}</td>
                <td style="padding:6px 8px;border-bottom:1px solid #eee;
                    text-align:center;font-size:14px;">${op.cantidad}</td>
                <td style="padding:6px 8px;border-bottom:1px solid #eee;
                    text-align:right;font-size:14px;">${formatPrecio(op.precio)}</td>
            </tr>`;
        }).join("");

        const entrega = orden.metodoEntrega === "retiro"
            ? "Retiro en tienda (Av. Manuel Rodríguez 426, Chiguayante)"
            : `Envío a: ${orden.direccion}`;

        const htmlContent = wrapEmail(`
            <tr><td style="padding-bottom:16px;">
              <h2 style="margin:0;color:#333;font-size:20px;">
                ¡Orden confirmada! 🎉</h2>
            </td></tr>
            <tr><td style="padding-bottom:16px;color:#555;font-size:15px;line-height:1.6;">
              <p>Hola <strong>${orden.nombre}</strong>,</p>
              <p>Tu orden <strong>#${orden.id}</strong> ha sido recibida
                exitosamente.</p>
            </td></tr>
            <tr><td style="padding-bottom:16px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #eee;border-radius:8px;">
                <thead>
                  <tr style="background:${BRAND_COLOR};">
                    <th style="padding:8px;color:#fff;font-size:13px;
                      text-align:left;">Producto</th>
                    <th style="padding:8px;color:#fff;font-size:13px;
                      text-align:center;">Cant.</th>
                    <th style="padding:8px;color:#fff;font-size:13px;
                      text-align:right;">Precio</th>
                  </tr>
                </thead>
                <tbody>${productosRows}</tbody>
              </table>
            </td></tr>
            <tr><td style="padding-bottom:16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:14px;color:#555;padding:4px 0;">
                    Subtotal</td>
                  <td style="font-size:14px;text-align:right;padding:4px 0;">
                    ${formatPrecio(orden.subtotal)}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#555;padding:4px 0;">
                    IVA (19%)</td>
                  <td style="font-size:14px;text-align:right;padding:4px 0;">
                    ${formatPrecio(orden.iva)}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#555;padding:4px 0;">Envío</td>
                  <td style="font-size:14px;text-align:right;padding:4px 0;">
                    ${Number(orden.costoEnvio) > 0
                        ? formatPrecio(orden.costoEnvio)
                        : "<span style='color:#38a169;'>Gratis</span>"}</td>
                </tr>
                <tr>
                  <td style="font-size:18px;font-weight:700;color:${BRAND_COLOR};
                    padding:8px 0;border-top:2px solid ${BRAND_COLOR};">Total</td>
                  <td style="font-size:18px;font-weight:700;color:${BRAND_COLOR};
                    text-align:right;padding:8px 0;
                    border-top:2px solid ${BRAND_COLOR};">
                    ${formatPrecio(orden.total)}</td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding-bottom:16px;color:#555;font-size:14px;">
              <p><strong>Entrega:</strong> ${entrega}</p>
            </td></tr>
            <tr><td align="center" style="padding-bottom:24px;">
              <a href="${misComprasUrl}" style="${btnStyle}">Ver mis compras</a>
            </td></tr>
        `);

        await transporter.sendMail({
            from: `"Óptica Danniels" <${SMTP_USER}>`,
            to: orden.correo,
            subject: `Orden #${orden.id} confirmada — Óptica Danniels`,
            html: htmlContent,
        });

        logger.info(`[EMAIL] Confirmación de orden #${orden.id} enviada a ${orden.correo}`);
        return [true, null];
    } catch (error) {
        logger.error(`[EMAIL] Error enviando confirmación orden #${orden.id}:`, error.message);
        return [null, error.message];
    }
}

/**
 * Envía un email cuando el estado de una orden cambia.
 * @param {Object} orden — orden con nombre, correo, estado
 * @param {string} nuevoEstado
 */
export async function sendOrderStatusEmail(orden, nuevoEstado) {
    const transporter = crearTransporter();
    if (!transporter) {
        logger.warn("[EMAIL] SMTP no configurado — omitiendo notificación estado");
        return [true, null];
    }

    try {
        const ESTADO_LABEL = {
            pagada: { emoji: "✅", label: "Pagada", desc: "Tu pago ha sido confirmado." },
            en_preparacion: { emoji: "📦", label: "En preparación", desc: "Estamos preparando tu pedido." },
            enviada: { emoji: "🚚", label: "Enviada", desc: "Tu pedido ya está en camino." },
            entregada: { emoji: "🎉", label: "Entregada", desc: "Tu pedido ha sido entregado." },
            cancelada: { emoji: "❌", label: "Cancelada", desc: "Tu orden ha sido cancelada." },
        };

        const estadoInfo = ESTADO_LABEL[nuevoEstado] || {
            emoji: "ℹ️", label: nuevoEstado, desc: `Estado actualizado a: ${nuevoEstado}`,
        };

        const misComprasUrl = `${FRONTEND_URL}/mis-compras`;

        const htmlContent = wrapEmail(`
            <tr><td style="padding-bottom:16px;">
              <h2 style="margin:0;color:#333;font-size:20px;">
                ${estadoInfo.emoji} Orden #${orden.id} — ${estadoInfo.label}</h2>
            </td></tr>
            <tr><td style="padding-bottom:24px;color:#555;font-size:15px;line-height:1.6;">
              <p>Hola <strong>${orden.nombre}</strong>,</p>
              <p>${estadoInfo.desc}</p>
            </td></tr>
            <tr><td align="center" style="padding-bottom:24px;">
              <a href="${misComprasUrl}" style="${btnStyle}">Ver detalle de mi orden</a>
            </td></tr>
        `);

        await transporter.sendMail({
            from: `"Óptica Danniels" <${SMTP_USER}>`,
            to: orden.correo,
            subject: `Orden #${orden.id} — ${estadoInfo.label} — Óptica Danniels`,
            html: htmlContent,
        });

        logger.info(`[EMAIL] Notificación estado "${nuevoEstado}" orden #${orden.id} a ${orden.correo}`);
        return [true, null];
    } catch (error) {
        logger.error(`[EMAIL] Error notificación estado orden #${orden.id}:`, error.message);
        return [null, error.message];
    }
}

/**
 * Envía notificación al admin cuando llega un mensaje de contacto.
 */
export async function sendContactNotificationEmail(mensaje) {
    const transporter = crearTransporter();
    if (!transporter) {
        logger.warn("[EMAIL] SMTP no configurado — omitiendo notificación de contacto");
        return [true, null];
    }

    try {
        const htmlContent = wrapEmail(`
            <tr><td style="padding-bottom:16px;">
              <h2 style="margin:0;color:#333;font-size:20px;">
                Nuevo mensaje de contacto</h2>
            </td></tr>
            <tr><td style="padding-bottom:24px;color:#555;font-size:15px;line-height:1.6;">
              <p><strong>Nombre:</strong> ${mensaje.nombre}</p>
              <p><strong>Email:</strong> ${mensaje.email}</p>
              ${mensaje.telefono ? `<p><strong>Teléfono:</strong> ${mensaje.telefono}</p>` : ""}
              ${mensaje.asunto ? `<p><strong>Asunto:</strong> ${mensaje.asunto}</p>` : ""}
              <p><strong>Mensaje:</strong></p>
              <p style="background:#f8f9fa;padding:12px;border-radius:8px;border-left:4px solid ${BRAND_COLOR};">
                ${mensaje.mensaje}
              </p>
            </td></tr>
            <tr><td align="center" style="padding-bottom:24px;">
              <a href="${FRONTEND_URL}/admin" style="${btnStyle}">Ver en panel admin</a>
            </td></tr>
        `);

        await transporter.sendMail({
            from: `"Óptica Danniels" <${SMTP_USER}>`,
            to: SMTP_USER, // Enviar al admin
            subject: `Nuevo mensaje de contacto — ${mensaje.nombre}`,
            html: htmlContent,
        });

        logger.info(`[EMAIL] Notificación de contacto enviada (de ${mensaje.email})`);
        return [true, null];
    } catch (error) {
        logger.error(`[EMAIL] Error notificación contacto:`, error.message);
        return [null, error.message];
    }
}
