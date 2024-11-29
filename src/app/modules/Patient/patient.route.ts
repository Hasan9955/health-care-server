import { Router } from "express";
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";
import { PatientControllers } from "./patient.controller";



const router = Router();

router.get('/',  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.getAllPatients)

router.get('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.getSinglePatient)

router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.softDeletePatient)

router.delete('/delete/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.deletePatient)


router.patch('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.updatePatient)


export const patientRoutes = router;