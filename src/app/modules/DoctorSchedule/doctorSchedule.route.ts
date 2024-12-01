import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";



const router = Router();


router.get('/', 
    auth(UserRole.DOCTOR),
    doctorScheduleController.getDoctorSchedules
)

router.post('/',
    auth(UserRole.DOCTOR),
    doctorScheduleController.createDoctorSchedule)

router.delete('/:id',
    auth(UserRole.DOCTOR),
    doctorScheduleController.deleteFromDB
)

export const doctorScheduleRoutes = router;