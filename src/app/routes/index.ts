import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { scheduleRoutes } from "../modules/schedule/schedule.routes";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.routes";
import { specialtiesRoutes } from "../modules/specialties/specialties.routes";


// DEFAULT ROUTE
export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/schedule",
        route: scheduleRoutes
    },
    {
        path: "/doctor-schedule",
        route: doctorScheduleRoutes
    },
    {
        path: '/specialties',
        route: specialtiesRoutes
    }
];

// LOOP ALL ROUTE
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
});