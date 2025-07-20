import catchAsync from "../../utility/catchAsync";
import pick from "../../utility/pick";
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

const getASchedule = catchAsync(async (req, res) => {
    const id = req.params.id; 

    const result = await scheduleServices.getASchedule(id); 

    sendResponse(res, {
        message: "Schedules retrieved successfully",
        statusCode: 200,
        data: result
    })
})


const getAllSchedules = catchAsync(async (req, res) => {
    const query = req.query;
    const user = req.user;
    const filterQuery = pick(query, ['startDateTime', 'endDateTime']);
    const options = pick(query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await scheduleServices.getAllSchedules(user, filterQuery, options)

    sendResponse(res, {
        message: "Schedules retrieved successfully",
        statusCode: 200,
        data: result
    })
})


export const scheduleControllers = {
    insertIntoDB,
    getAllSchedules,
    getASchedule
}