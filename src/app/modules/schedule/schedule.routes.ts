import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { Router } from "express";
import { createSchedule, deleteSchedule, schedulesForDoctor } from "./schedule.controller";


// SCHEDULE ROUTES
export const ScheduleRoutes = Router()
    .get("/", checkAuth(UserRole.DOCTOR, UserRole.DOCTOR), schedulesForDoctor)
    .post("/", checkAuth(UserRole.ADMIN), createSchedule)
    .delete("/:id", checkAuth(UserRole.ADMIN), deleteSchedule)