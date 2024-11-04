import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { adminRoutes } from "../modules/admin/admin.routes";

const router = Router();
const allRoutes = [
    {
        path: '/users',
        element: userRoutes
    },
    {
        path: '/admins',
        element: adminRoutes
    }
]


allRoutes.forEach((route) => router.use(route.path, route.element) )

export const mainRoutes = router
