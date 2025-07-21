"use strict";
import { Router } from "express";
import { login, logout, profile, register, updateProfile } from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
    .post("/login", login)
    .post("/register", register)
    .post("/logout", logout);


router.get("/profile", authenticateJwt, profile);
router.put("/profile", authenticateJwt, updateProfile);

export default router;