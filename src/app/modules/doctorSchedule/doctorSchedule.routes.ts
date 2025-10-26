import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDoctorScheduleSchema } from "./doctorSchedule.validation";
import { createDoctorSchedule, getAllSchedule, getMySchedule } from "./doctorSchedule.controller";
import { deleteDoctorService } from "../doctor/doctor.service";


// DOCTOR SCHEDULE ROUTES
export const doctorScheduleRoutes = Router()
    .get('/', checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), getAllSchedule)
    .get('/my-schedule', checkAuth(UserRole.DOCTOR), getMySchedule)
    .post("/", checkAuth(UserRole.DOCTOR), validateRequest(createDoctorScheduleSchema), createDoctorSchedule)
    .delete('/:id', checkAuth(UserRole.DOCTOR), deleteDoctorService)