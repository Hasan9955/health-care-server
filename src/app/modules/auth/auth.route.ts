import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";



const router = Router();

router.post('/login', authController.loginUser)

router.post('/change-password', auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN), authController.changePassword)

router.post('/refresh-token', authController.refreshToken)

router.post('/forgot-password', authController.forgotPassword)

router.post('/reset-password', authController.resetPassword)



export const authRoutes = router;