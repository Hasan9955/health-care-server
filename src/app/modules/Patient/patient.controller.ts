import catchAsync from "../../utility/catchAsync";
import pick from "../../utility/pick";
import sendResponse from "../../utility/response";
import { TQuery } from "../admin/admin.service";
import { patientFilterableFields } from "./patient.constant";
import { PatientServices } from "./patient.service";

 

const getAllPatients = catchAsync(async (req, res) => {
    const query = req.query;
    const filterQuery = pick(query, patientFilterableFields);
    const options = pick(query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await PatientServices.getAllFromDB(filterQuery as TQuery, options);

    sendResponse(res, {
        message: "All Patients retrieved successfully",
        statusCode: 200,
        meta: result?.meta,
        data: result?.data
    })
})


const getSinglePatient = catchAsync(async (req, res) => {

    const { id } = req.params;
    const result = await PatientServices.getSinglePatient(id); 

    sendResponse(res, {
        message: "Patient data retrieved successfully",
        statusCode: 200,
        data: result
    })
})


const updatePatient = catchAsync(async (req, res) => {

    const { id } = req.params;
    const payload = req.body;
    const result = await PatientServices.updatePatient(id, payload);

    sendResponse(res, {
        message: "Patient data updated successfully",
        statusCode: 200,
        data: result
    })
})


const softDeletePatient = catchAsync(async (req, res) => {

    const { id } = req.params; 
    const result = await PatientServices.softDeletePatient(id)
    
    sendResponse(res, {
        message: "Patient deleted successfully",
        statusCode: 200,
        data: result
    })
})

const deletePatient = catchAsync(async (req, res) => {

    const { id } = req.params; 
    const result = await PatientServices.deletePatient(id)
    
    sendResponse(res, {
        message: "Patient deleted successfully",
        statusCode: 200,
        data: result
    })
})

export const PatientControllers = {
    getAllPatients,
    getSinglePatient,
    updatePatient,
    deletePatient,
    softDeletePatient
}