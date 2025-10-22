import { Router } from "express";
import { getAllDoctor, updateDoctor } from "./doctor.controller";


// DOCTOR ROUTES
export const doctorRoutes = Router()
    .get("/", getAllDoctor)
    .patch("/:id", updateDoctor)