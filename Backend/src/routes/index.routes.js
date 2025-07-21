"use strict";
import { Router } from "express";
import productoRoutes from "./producto.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import ordenRoutes from "./orden.routes.js";
import direccionRoutes from "./direccion.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/productos", productoRoutes)
    .use("/ordenes", ordenRoutes)
    .use("/direcciones", direccionRoutes);

export default router;
