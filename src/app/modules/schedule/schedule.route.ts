import { Router } from "express";
import { scheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.post('/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    scheduleControllers.insertIntoDB)

router.get('/', 
    auth(UserRole.DOCTOR),
    scheduleControllers.getAllSchedules)

export const scheduleRoutes = router;