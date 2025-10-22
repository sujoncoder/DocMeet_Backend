import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { createAppointment } from "./appointment.controller";


// APPOINTMENT ROUTES
export const appointmentRoutes = Router()
    .post("/", checkAuth(UserRole.PATIENT), createAppointment)
