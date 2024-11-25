import catchAsync from "../../utility/catchAsync";
import { doctorServices } from "./doctor.service";
import sendResponse from "../../utility/response";
import pick from "../../utility/pick";
import { doctorFilterableFields } from "./doctor.constant";
import { TQuery } from "../admin/admin.service";



const getAllDoctors = catchAsync(async (req, res) => { 
    const query = req.query;
    const filterQuery = pick(query, doctorFilterableFields);
    const options = pick(query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await doctorServices.getAllDoctors(filterQuery as TQuery, options);

    sendResponse(res, {
        message: "Doctor retrieved successfully",
        statusCode: 200,
        meta: result.meta,
        data: result.data
    })
})


const getSingleDoctor = catchAsync(async (req, res) => {   
    const result = await doctorServices.getSingleDoctor(req.params.id);

    sendResponse(res, {
        message: "Doctor updated successfully",
        statusCode: 200, 
        data: result 
    })
})

const softDeleteDoctor = catchAsync(async (req, res) => {   
    const result = await doctorServices.softDeleteDoctor(req.params.id);

    sendResponse(res, {
        message: "Doctor deleted successfully",
        statusCode: 200, 
        data: result 
    })
})

const deleteDoctor = catchAsync(async (req, res) => {   
    const result = await doctorServices.deleteDoctor(req.params.id);

    sendResponse(res, {
        message: "Doctor deleted successfully",
        statusCode: 200, 
        data: result 
    })
})


const updateDoctor = catchAsync(async (req, res) => {   
    req.body = JSON.parse(req.body.data) 
    
    const result = await doctorServices.updateDoctor(req);

    sendResponse(res, {
        message: "Doctor updated successfully",
        statusCode: 200, 
        data: result 
    })
})




export const doctorControllers = {
    updateDoctor,
    getAllDoctors,
    getSingleDoctor,
    deleteDoctor,
    softDeleteDoctor
}