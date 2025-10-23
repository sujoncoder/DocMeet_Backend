import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { createAppointment, getMyAppointment, updateAppointmentStatus } from "./appointment.controller";


// APPOINTMENT ROUTES
export const appointmentRoutes = Router()
    .get("/my-appointments", checkAuth(UserRole.PATIENT, UserRole.DOCTOR), getMyAppointment)
    .post("/", checkAuth(UserRole.PATIENT), createAppointment)
    .patch("/status/:id", checkAuth(UserRole.ADMIN, UserRole.DOCTOR), updateAppointmentStatus)