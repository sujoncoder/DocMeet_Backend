import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { createSchedule, deleteSchedule, schedulesForDoctor } from "./schedule.controller";


// SCHEDULR ROUTES
export const scheduleRoutes = Router()
    .get("/", checkAuth(UserRole.DOCTOR, UserRole.DOCTOR), schedulesForDoctor)

    .post("/", checkAuth(UserRole.DOCTOR), createSchedule)
    .delete("/:id", checkAuth(UserRole.DOCTOR), deleteSchedule)