import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { specialtiesRoutes } from "../modules/specialties/specialties.route";
import { doctorRoutes } from "../modules/Doctor/doctor.route";
import { patientRoutes } from "../modules/Patient/patient.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { doctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.route";
import { appointmentRoutes } from "../modules/Appointment/appointment.route";

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
        path: '/doctor',
        route: doctorRoutes
    },
    {
        path: '/specialties',
        route: specialtiesRoutes
    }, 
    {
        path: '/patient',
        route: patientRoutes
    }, 
    {
        path: '/schedule',
        route: scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/appointment',
        route: appointmentRoutes
    },
]


allRoutes.forEach((route) => router.use(route.path, route.route) )

export const mainRoutes = router;
