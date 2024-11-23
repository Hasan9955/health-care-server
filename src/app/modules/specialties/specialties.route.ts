import { Router } from "express";
import { specialtyController } from "./specialties.controller";
import { fileUploader } from "../../utility/fileUploader";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/verifyAuth";


const router = Router();


router.post('/',
    fileUploader.upload.single('file'),
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    specialtyController.insertIntoDB)

router.get('/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    specialtyController.getAllSpecialties)

router.delete('/:id', 
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    specialtyController.deleteSpecialties )
    
export const specialtiesRoutes = router;