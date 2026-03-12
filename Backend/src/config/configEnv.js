"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const envFilePath = path.resolve(_dirname, ".env");

dotenv.config({ path: envFilePath, override: false });

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.PASSWORD;
export const DATABASE = process.env.DATABASE;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const cookieKey = process.env.cookieKey;

// SMTP — Recuperación de contraseña
export const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
export const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 587;
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// WebPay — Transbank (sandbox por defecto)
export const WEBPAY_COMMERCE_CODE = process.env.WEBPAY_COMMERCE_CODE
  || "597055555532";
export const WEBPAY_API_KEY = process.env.WEBPAY_API_KEY
  || "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
export const WEBPAY_ENVIRONMENT = process.env.WEBPAY_ENVIRONMENT
  || "Integration";

// MercadoPago — Sandbox
export const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN
  || "";
export const MERCADOPAGO_PUBLIC_KEY = process.env.MERCADOPAGO_PUBLIC_KEY
  || "";

// URL pública del backend (para callbacks de pasarelas)
export const APP_URL = process.env.APP_URL
  || `http://localhost:${process.env.PORT || 3000}`;

// Conexión directa a BD (Neon, Render, etc.)
export const DATABASE_URL = process.env.DATABASE_URL || "";

// CORS — Orígenes permitidos (separados por coma)
export const CORS_ORIGINS = process.env.CORS_ORIGINS || "";

// Cloudinary — Almacenamiento de imágenes en la nube
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

// Entorno
export const NODE_ENV = process.env.NODE_ENV || "development";