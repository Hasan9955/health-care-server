import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";



const router = Router();


router.post('/',
    auth(UserRole.DOCTOR),
    doctorScheduleController.createDoctorSchedule)


export const doctorScheduleRoutes = router;