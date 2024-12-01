import catchAsync from "../../utility/catchAsync";
import pick from "../../utility/pick";
import sendResponse from "../../utility/response";
import { doctorScheduleFilterableFields } from "./doctorSchedule.constant";
import { doctorScheduleServices } from "./doctorSchedule.service";


const getDoctorSchedules = catchAsync(async (req, res) => {
    const query = req.query;
    const user = req.user; 
    const filterQuery = pick(query, ['startDateTime', 'endDateTime', 'isBooked']);
    const options = pick(query, ['page', 'limit', 'sortBy', 'sortOrder']); 

    const result = await doctorScheduleServices.getDoctorSchedules(user, filterQuery, options)

    sendResponse(res, {
        message: "Doctor Schedules retrieved successfully",
        statusCode: 200,
        data: result
    })
})


const createDoctorSchedule = catchAsync(async (req, res) => { 
    
    const user = req.user
    const result = await doctorScheduleServices.createDoctorSchedule(user, req.body)
    
    sendResponse(res, {
        message: "Doctor schedule created successfully!",
        statusCode: 200, 
        data: result 
    })
})

const deleteFromDB = catchAsync(async (req, res) => { 
    
    const user = req.user
    const id = req.params.id
    const result = await doctorScheduleServices.deleteFromDB(user, id)
    
    sendResponse(res, {
        message: "Doctor schedule deleted successfully!",
        statusCode: 200, 
        data: result 
    })
})


export const doctorScheduleController = {
    createDoctorSchedule,
    getDoctorSchedules,
    deleteFromDB

}