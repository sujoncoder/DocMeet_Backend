import { Router } from "express";
import { getAllDoctors } from "./doctor.controller";


// DOCTOR ROUTES
export const doctorRoutes = Router()
    .get("/", getAllDoctors)