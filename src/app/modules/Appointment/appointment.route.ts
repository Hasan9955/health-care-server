import { Router } from "express";
import { appointmentControllers } from "./appointment.controller";
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../utility/validateRequest";
import { appointmentValidation } from "./Appointment.validation";


const router = Router();

router.get('/all-appointments', 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
     appointmentControllers.getAllAppointments
)

router.get(
    '/my-appointments',
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    appointmentControllers.myAppointments
)

router.post('/', 
    auth(UserRole.PATIENT),
    validateRequest(appointmentValidation.createAppointmentValidationSchema),
    appointmentControllers.createAppointment)


export const appointmentRoutes = router;