import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";


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
    }
];

// LOOP ALL ROUTE
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
});