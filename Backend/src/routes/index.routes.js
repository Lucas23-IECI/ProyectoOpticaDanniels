"use strict";
import { Router } from "express";
import productoRoutes from "./producto.routes.js";

const router = Router();

router
    .use("/productos", productoRoutes);

export default router;
