import { Router } from "express";
import { login, logout, me } from "@/controllers/authController";
import { requireAuth } from "@/middleware/requireAuth";

export const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAuth, me);
