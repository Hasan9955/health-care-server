import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/response";
import { prescriptionServices } from "./prescription.service";



const createPrescription = catchAsync(async (req, res) => {

    const payload = req.body;
    const prescription = await prescriptionServices.createPrescription(payload);
    
    sendResponse(res, {
        message: "Prescription created successfully",
        statusCode: 200,
        data: prescription
    })
})


export const prescriptionControllers = {
    createPrescription
};