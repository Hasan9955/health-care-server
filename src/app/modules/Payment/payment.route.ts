import { Router } from "express"
import { paymentControllers } from './payment.controller';



const router = Router();


// Validate SSL payment
router.get(
    '/ipn',
    paymentControllers.validatePayment
)

router.post(
    '/init-payment/:appointmentId',
    paymentControllers.initPayment
)



export const paymentRoutes = router;


