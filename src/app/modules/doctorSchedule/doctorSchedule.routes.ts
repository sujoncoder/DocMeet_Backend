import { Router } from "express";

import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { createDoctorSchedule } from "./doctorSchedule.controller";


// DOCTOR SCHEDULE ROUTES
export const doctorScheduleRoutes = Router()
    .post("/", checkAuth(UserRole.DOCTOR), createDoctorSchedule)