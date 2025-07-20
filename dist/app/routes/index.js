"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRoutes = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const admin_routes_1 = require("../modules/admin/admin.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const specialties_route_1 = require("../modules/specialties/specialties.route");
const doctor_route_1 = require("../modules/Doctor/doctor.route");
const patient_route_1 = require("../modules/Patient/patient.route");
const schedule_route_1 = require("../modules/schedule/schedule.route");
const doctorSchedule_route_1 = require("../modules/DoctorSchedule/doctorSchedule.route");
const router = (0, express_1.Router)();
const allRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes
    },
    {
        path: '/admins',
        route: admin_routes_1.adminRoutes
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes
    },
    {
        path: '/doctor',
        route: doctor_route_1.doctorRoutes
    },
    {
        path: '/specialties',
        route: specialties_route_1.specialtiesRoutes
    },
    {
        path: '/patient',
        route: patient_route_1.patientRoutes
    },
    {
        path: '/schedule',
        route: schedule_route_1.scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorSchedule_route_1.doctorScheduleRoutes
    },
];
allRoutes.forEach((route) => router.use(route.path, route.route));
exports.mainRoutes = router;
