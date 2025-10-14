import { Router } from "express";
import { login } from "./auth.controller";

export const authRoutes = Router()
    .post("/login", login)