import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/response";
import { paymentServices } from "./payment.service";



const initPayment = catchAsync(async (req, res) => { 
    const {appointmentId} = req.params;
    const result = await paymentServices.initPayment(appointmentId);

    sendResponse(res, {
        message: "Payment initiate successfully",
        statusCode: 200,
        data: result
    })
})

const validatePayment = catchAsync(async (req, res) => { 
    
    const result = await paymentServices.validatePayment(req.query);

    sendResponse(res, {
        message: "Payment validate successfully",
        statusCode: 200,
        data: result
    })
})


export const paymentControllers = {
    initPayment,
    validatePayment
}