"use strict";
import { Router } from "express";
import {
    forgotPassword,
    login,
    logout,
    profile,
    register,
    resetPassword,
    updateProfile,
} from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
    forgotPasswordValidation,
    profileUpdateValidation,
    resetPasswordValidation,
} from "../validations/auth.validation.js";

const router = Router();

router
    .post("/login", login)
    .post("/register", register)
    .post("/logout", logout)
    .post("/forgot-password", validateSchema(forgotPasswordValidation), forgotPassword)
    .post("/reset-password", validateSchema(resetPasswordValidation), resetPassword);

router.get("/profile", authenticateJwt, profile);
router.put("/profile", authenticateJwt, validateSchema(profileUpdateValidation), updateProfile);

export default router;