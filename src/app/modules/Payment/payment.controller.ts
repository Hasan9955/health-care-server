import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/response";
import { paymentServices } from "./payment.service";



const initPayment = catchAsync(async (req, res) => { 

    const result = await paymentServices.initPayment();

    sendResponse(res, {
        message: "Payment initiate successfully",
        statusCode: 200,
        data: result
    })
})


export const paymentControllers = {
    initPayment
}