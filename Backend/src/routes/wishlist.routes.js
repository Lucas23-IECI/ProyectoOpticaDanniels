"use strict";
import { Router } from "express";
import {
  addToWishlist,
  checkWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { addWishlistValidation } from "../validations/wishlist.validation.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJwt);

// GET /api/wishlist — Lista la wishlist del usuario
router.get("/", getWishlist);

// POST /api/wishlist — Agrega un producto a la wishlist
router.post("/", validateSchema(addWishlistValidation), addToWishlist);

// GET /api/wishlist/check/:productoId — Verifica si un producto está en la wishlist
router.get("/check/:productoId", checkWishlist);

// DELETE /api/wishlist/:productoId — Elimina un producto de la wishlist
router.delete("/:productoId", removeFromWishlist);

export default router;
