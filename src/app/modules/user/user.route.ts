import { Router } from "express"
import { userControllers } from "./user.controller";
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utility/fileUploader";


const router = Router();


router.get('/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    userControllers.getAllUsers)

router.post('/create-admin',
    fileUploader.upload.single('file'),
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    userControllers.createAdmin)

router.post('/create-doctor',
    fileUploader.upload.single('file'),
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    userControllers.createDoctor)

router.post('/create-patient',
    fileUploader.upload.single('file'),
    userControllers.createPatient)

router.patch('/update-me', 
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
    fileUploader.upload.single('file'),
    userControllers.updateMyProfile)

router.get('/me',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
    userControllers.myProfile)

export const userRoutes = router;


