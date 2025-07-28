import catchAsync from "../../utility/catchAsync";
import pick from "../../utility/pick";
import sendResponse from "../../utility/response";
import { appointmentService } from "./appointment.service";


const createAppointment = catchAsync(async (req, res) => {
    const user = req.user;
    
    const result = await appointmentService.createAppointment(user, req.body);

    sendResponse(res, {
        message: "Appointment created successfully",
        statusCode: 200,
        data: result
    })
})

const getAllAppointments = catchAsync(async (req, res) => {
    const user = req.user;
    const filter = pick(req.query, ['status', 'paymentStatus'])
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);


    const result = await appointmentService.getAllAppointments(user, filter, options)

    sendResponse(res, {
        message: "Appointments retrieved successfully",
        statusCode: 200,
        data: result
    })
})


const myAppointments = catchAsync(async (req, res) => {
    const user = req.user;
    const filter = pick(req.query, ['status', 'paymentStatus'])
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);


    const result = await appointmentService.myAppointments(user, filter, options)

    sendResponse(res, {
        message: "Appointments retrieved successfully",
        statusCode: 200,
        data: result
    })
})


const changeAppointmentStatus = catchAsync(async (req, res) => {
     const {id} = req.params;
     const {status} = req.body;
    const user = req.user;

    const result = await appointmentService.changeAppointmentStatus(id, status, user)

    sendResponse(res, {
        message: "Appointments status updated successfully",
        statusCode: 200,
        data: result
    })
})



const cancelUnpaidAppointments = catchAsync(async (req, res) => {
     
    const result = await appointmentService.cancelUnpaidAppointments();

    sendResponse(res, {
        message: "Unpaid appointments canceled successfully",
        statusCode: 200,
        data: result
    })
})


export const appointmentControllers = {
    createAppointment,
    myAppointments,
    getAllAppointments,
    changeAppointmentStatus,
    cancelUnpaidAppointments
}