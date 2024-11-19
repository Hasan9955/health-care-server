"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRoutes = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const admin_routes_1 = require("../modules/admin/admin.routes");
const router = (0, express_1.Router)();
const allRoutes = [
    {
        path: '/users',
        element: user_route_1.userRoutes
    },
    {
        path: '/admins',
        element: admin_routes_1.adminRoutes
    }
];
allRoutes.forEach((route) => router.use(route.path, route.element));
exports.mainRoutes = router;
