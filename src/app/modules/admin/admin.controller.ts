import { Response } from "express";
import catchAsync from "../../utility/catchAsync";
import pick from "../../utility/pick";
import { adminFilterableFields } from "./admin.constant";
import { AdminServices, TQuery } from "./admin.service";
import sendResponse from "../../utility/response";



const getAllAdmins = catchAsync(async (req, res) => {
    const query = req.query;
    const filterQuery = pick(query, adminFilterableFields);
    const options = pick(query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await AdminServices.getAllFromDB(filterQuery as TQuery, options);

    sendResponse(res, {
        message: "All admins retrieved successfully",
        statusCode: 200,
        meta: result.meta,
        data: result.data
    })
})


const getSingleAdmin = catchAsync(async (req, res) => {

    const { id } = req.params;
    const result = await AdminServices.getSingleAdmin(id); 

    sendResponse(res, {
        message: "Admin data retrieved successfully",
        statusCode: 200,
        data: result
    })
})


const updateAdmin = catchAsync(async (req, res) => {

    const { id } = req.params;
    const payload = req.body;
    const result = await AdminServices.updateAdmin(id, payload);

    sendResponse(res, {
        message: "Admin data updated successfully",
        statusCode: 200,
        data: result
    })
})


const softDeleteAdmin = catchAsync(async (req, res) => {

    const { id } = req.params; 
    const result = await AdminServices.softDeleteAdmin(id)
    
    sendResponse(res, {
        message: "Admin deleted successfully",
        statusCode: 200,
        data: result
    })
})

const deleteAdmin = catchAsync(async (req, res) => {

    const { id } = req.params; 
    const result = await AdminServices.deleteAdmin(id)
    
    sendResponse(res, {
        message: "Admin deleted successfully",
        statusCode: 200,
        data: result
    })
})

export const AdminControllers = {
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
}