import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../utility/validateRequest";
import { adminUpdateValidationSchema } from "./admin.validation";
import auth from "../../middlewares/verifyAuth";
import { UserRole } from "@prisma/client";




const router = Router();

router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.getAllAdmins)

router.get('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.getSingleAdmin)

router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.deleteAdmin)

router.delete('/soft/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.softDeleteAdmin)

router.patch(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(adminUpdateValidationSchema),
    AdminControllers.updateAdmin
)


export const adminRoutes = router;