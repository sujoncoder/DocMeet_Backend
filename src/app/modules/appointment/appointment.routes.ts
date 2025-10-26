import { Router } from "express";
import { UserRole } from "@prisma/client";
import { createAppointment, getAllAppointment, getMyAppointment, updateAppointmentStatus } from "./appointment.controller";
import { checkAuth } from "../../middlewares/checkAuth";


// APPOINTMENT ROUTES
export const AppointmentRoutes = Router()
    .get('/', checkAuth(UserRole.ADMIN), getAllAppointment)
    .get("/my-appointments", checkAuth(UserRole.PATIENT, UserRole.DOCTOR), getMyAppointment)
    .post("/", checkAuth(UserRole.PATIENT), createAppointment)
    .patch("/status/:id", checkAuth(UserRole.ADMIN, UserRole.DOCTOR), updateAppointmentStatus)