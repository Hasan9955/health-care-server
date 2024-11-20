import { Router } from "express"
import { userControllers } from "./user.controller"; 
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.post('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), userControllers.createAdmin)


export const userRoutes = router;


