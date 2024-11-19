import { Router } from "express";
import { AdminControllers } from "./admin.controller"; 
import validateRequest from "../../utility/validateRequest";
import { adminUpdateValidationSchema } from "./admin.validation";




const router = Router();

router.get('/', AdminControllers.getAllAdmins)

router.get('/:id', AdminControllers.getSingleAdmin)

router.delete('/:id', AdminControllers.deleteAdmin)

router.delete('/soft/:id', AdminControllers.softDeleteAdmin)

router.patch('/:id', validateRequest(adminUpdateValidationSchema), AdminControllers.updateAdmin)


export const adminRoutes = router;