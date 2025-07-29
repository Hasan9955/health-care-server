import { Router } from "express";
import { prescriptionControllers } from "./prescription.controller";



const router = Router();


router.post("/", prescriptionControllers.createPrescription);


export const prescriptionRoutes = router;