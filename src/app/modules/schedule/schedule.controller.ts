import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/response";
import { scheduleServices } from "./schedule.service";


const insertIntoDB = catchAsync(async (req, res) => {
    
    const result = await scheduleServices.insertIntoDB(req.body)

    sendResponse(res, {
        message: "Schedule created successfully",
        statusCode: 200,
        data: result
    })
})

const getAllSchedules = catchAsync(async (req, res) => {
    
    const result = await scheduleServices.getAllSchedules()

    sendResponse(res, {
        message: "Schedules retrieved successfully",
        statusCode: 200,
        data: result
    })
})


export const scheduleControllers = {
    insertIntoDB,
    getAllSchedules
}