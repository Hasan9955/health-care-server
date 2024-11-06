import { Router } from "express";
import { AdminControllers } from "./admin.controller";


const router = Router(); 

router.get('/', AdminControllers.getAllAdmins)

router.get('/:id', AdminControllers.getSingleAdmin)

router.delete('/:id', AdminControllers.deleteAdmin)

router.patch('/:id', AdminControllers.updateAdmin)


export const adminRoutes = router;