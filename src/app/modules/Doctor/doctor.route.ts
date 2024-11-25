import { Router } from "express";
import { doctorControllers } from "./doctor.controller";
import { fileUploader } from "../../utility/fileUploader";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/verifyAuth";



const router = Router();


router.get('/',
    doctorControllers.getAllDoctors)

router.get('/:id', doctorControllers.getSingleDoctor)

router.delete('/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
     doctorControllers.softDeleteDoctor)

router.delete('/delete/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
     doctorControllers.deleteDoctor)

router.patch('/:id',
    fileUploader.upload.single('file'),
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR), doctorControllers.updateDoctor)



export const doctorRoutes = router;