import { userServices } from "./user.service";
import catchAsync from "../../utility/catchAsync";
import { userValidation } from "./user.validation";
import { userFilterableFields } from "./user.constant";
import sendResponse from "../../utility/response";
import pick from "../../utility/pick";
import { JwtPayload } from "jsonwebtoken";



const createAdmin = catchAsync(async (req, res) => {
    req.body = userValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))

    const result = await userServices.createAdmin(req);

        res.status(200).json({
            success: true,
            status: 200,
            message: 'Admin created successfully!',
            data: result
        })
})

const createDoctor = catchAsync(async (req, res) => {
    req.body = userValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))

    const result = await userServices.createDoctor(req);

        res.status(200).json({
            success: true,
            status: 200,
            message: 'Doctor created successfully!',
            data: result
        })
})

const createPatient = catchAsync(async (req, res) => {
    req.body = userValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))

    const result = await userServices.createPatient(req);

        res.status(200).json({
            success: true,
            status: 200,
            message: 'Patient created successfully!',
            data: result
        })
})

const getAllUsers = catchAsync(async (req, res) => {
    const query = req.query;
    const filterQuery = pick(query, userFilterableFields);
    const options = pick(query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await userServices.getAllFromDB(filterQuery, options);

    sendResponse(res, {
        message: "Users retrieved successfully",
        statusCode: 200,
        meta: result.meta,
        data: result.data
    })
})

const myProfile = catchAsync(async (req, res) => { 

    const result = await userServices.myProfile(req.user as JwtPayload);

    sendResponse(res, {
        message: "profile data retrieved successfully",
        statusCode: 200, 
        data: result 
    })
})

const updateMyProfile = catchAsync(async (req, res) => { 
    req.body = JSON.parse(req.body.data)
    const user = req.user
    const result = await userServices.updateMyProfile(user as JwtPayload, req);

    sendResponse(res, {
        message: "profile updated successfully",
        statusCode: 200, 
        data: result 
    })
})

export const userControllers = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    myProfile,
    updateMyProfile
}