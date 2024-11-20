import { Router } from "express"
import { userControllers } from "./user.controller"; 
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utility/fileUploader";


const router = Router();

router.post('/', 
    fileUploader.upload.single('file'),
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), 
    userControllers.createAdmin)


export const userRoutes = router;


