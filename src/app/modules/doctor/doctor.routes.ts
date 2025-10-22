import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { deleteDoctor, getAISuggestion, getAllDoctor, getDoctorById, softDelete, updateDoctor } from "./doctor.controller";


// DOCTOR ROUTES
export const doctorRoutes = Router()
    .get("/", getAllDoctor)
    .post("/suggestion", getAISuggestion)
    .get('/:id', getDoctorById)
    .patch("/:id", updateDoctor)
    .delete('/:id', checkAuth(UserRole.ADMIN), deleteDoctor)
    .delete('/soft/:id', checkAuth(UserRole.ADMIN), softDelete)