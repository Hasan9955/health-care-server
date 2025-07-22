import { Router } from "express"
import { paymentControllers } from './payment.controller';



const router = Router();



router.post(
    '/init-payment',
    paymentControllers.initPayment
)



export const paymentRoutes = router;


