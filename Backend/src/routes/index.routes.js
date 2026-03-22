"use strict";
import { Router } from "express";
import productoRoutes from "./producto.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import ordenRoutes from "./orden.routes.js";
import direccionRoutes from "./direccion.routes.js";
import reporteRoutes from "./reporte.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import reviewRoutes from "./review.routes.js";
import pagoRoutes from "./pago.routes.js";
import citaRoutes from "./cita.routes.js";
import contactoRoutes from "./contacto.routes.js";
import marcasRoutes from "./marcas.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/productos", productoRoutes)
    .use("/ordenes", ordenRoutes)
    .use("/direcciones", direccionRoutes)
    .use("/reportes", reporteRoutes)
    .use("/wishlist", wishlistRoutes)
    .use("/reviews", reviewRoutes)
    .use("/pagos", pagoRoutes)
    .use("/citas", citaRoutes)
    .use("/contacto", contactoRoutes)
    .use("/marcas", marcasRoutes);

export default router;
