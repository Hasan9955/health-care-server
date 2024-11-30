import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/response";
import { doctorScheduleServices } from "./doctorSchedule.service";


const createDoctorSchedule = catchAsync(async (req, res) => { 
    
    const user = req.user
    const result = await doctorScheduleServices.createDoctorSchedule(user, req.body)
    
    sendResponse(res, {
        message: "Doctor schedule created successfully!",
        statusCode: 200, 
        data: result 
    })
})


export const doctorScheduleController = {
    createDoctorSchedule,

}