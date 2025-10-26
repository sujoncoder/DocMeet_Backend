import { Router } from "express";
import { deleteDoctor, getAISuggestion, getAllDoctor, getDoctorById, softDelete, updateDoctor } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";


// DOCTOR ROUTES
export const DoctorRoutes = Router()
    .get("/", getAllDoctor)
    .post("/suggestion", getAISuggestion)
    .get('/:id', getDoctorById)
    .patch("/:id", checkAuth(UserRole.ADMIN, UserRole.DOCTOR), updateDoctor)
    .delete('/:id', checkAuth(UserRole.ADMIN), deleteDoctor)
    .delete('/soft/:id', checkAuth(UserRole.ADMIN), softDelete)