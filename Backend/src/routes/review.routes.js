"use strict";
import { Router } from "express";
import {
    getReviewsByProducto,
    getReviewStats,
    createReview,
    getAllReviews,
    updateReviewEstado,
    deleteReview,
} from "../controllers/review.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createReviewValidation, updateReviewEstadoValidation } from "../validations/review.validation.js";

const router = Router();

// Rutas públicas
router.get("/producto/:productoId", getReviewsByProducto);
router.get("/producto/:productoId/stats", getReviewStats);

// Rutas autenticadas
router.post("/", authenticateJwt, validateSchema(createReviewValidation), createReview);

// Rutas admin
router.get("/admin", authenticateJwt, isAdmin, getAllReviews);
router.patch("/:id/estado", authenticateJwt, isAdmin, validateSchema(updateReviewEstadoValidation), updateReviewEstado);
router.delete("/:id", authenticateJwt, isAdmin, deleteReview);

export default router;
