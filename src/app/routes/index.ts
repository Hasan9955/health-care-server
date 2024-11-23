import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { specialtiesRoutes } from "../modules/specialties/specialties.route";

const router = Router();
const allRoutes = [
    {
        path: '/users',
        route: userRoutes
    },
    {
        path: '/admins',
        route: adminRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/specialties',
        route: specialtiesRoutes
    }
]


allRoutes.forEach((route) => router.use(route.path, route.route) )

export const mainRoutes = router;
