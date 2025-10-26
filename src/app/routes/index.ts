import { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.routes";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.routes";
import { AppointmentRoutes } from "../modules/appointment/appointment.routes";
import { MetaRoutes } from "../modules/meta/meta.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { PrescriptionRoutes } from "../modules/prescription/prescription.routes";
import { PatientRoutes } from "../modules/patient/patient.routes";
import { DoctorRoutes } from "../modules/doctor/doctor.routes";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.routes";
import { UserRoutes } from "../modules/user/user.route";


// DEFAULT ROUTE
export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/schedule',
        route: ScheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
    {
        path: '/appointment',
        route: AppointmentRoutes
    },
    {
        path: '/prescription',
        route: PrescriptionRoutes
    },
    {
        path: '/review',
        route: ReviewRoutes
    },
    {
        path: '/metadata',
        route: MetaRoutes
    },
];


// LOOP ALL ROUTE
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
});