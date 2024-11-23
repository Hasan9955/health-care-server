import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/response';
import { specialtyServices } from './specialties.service';
import { specialtiesValidation } from './specialties.validation';

const insertIntoDB = catchAsync(async (req, res) => {
    req.body = specialtiesValidation.createSpecialties.parse(JSON.parse(req.body.data))

    const result = await specialtyServices.insertIntoDB(req);

    sendResponse(res, {
        message: "Specialty created successfully",
        statusCode: 200,
        data: result
    })
})

const getAllSpecialties = catchAsync(async (req, res) => { 

    const result = await specialtyServices.getAllSpecialties();

    sendResponse(res, {
        message: "Specialties retrieved successfully",
        statusCode: 200,
        data: result
    })
})

const deleteSpecialties = catchAsync(async (req, res) => { 

    const result = await specialtyServices.deleteSpecialties(req.params.id);

    sendResponse(res, {
        message: "Specialty deleted successfully",
        statusCode: 200,
        data: result
    })
})

export const specialtyController = {
    insertIntoDB,
    getAllSpecialties,
    deleteSpecialties
}