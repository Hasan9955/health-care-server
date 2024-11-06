import catchAsync from "../../utility/catchAsync";
import pick from "../../utility/pick";
import { adminFilterableFields } from "./admin.constant";
import { AdminServices, TQuery } from "./admin.service";


const getAllAdmins = catchAsync(async (req, res) => {
    const query = req.query;
    const filterQuery = pick(query, adminFilterableFields);
    const options = pick(query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await AdminServices.getAllFromDB(filterQuery as TQuery, options);
    res.status(200).json({
        success: true,
        message: "All admins retrieved successfully",
        status: 200,
        meta: result.meta,
        data: result.data
    })
})


const getSingleAdmin = catchAsync(async (req, res) => {

    const { id } = req.params;
    const result = await AdminServices.getSingleAdmin(id)
    res.status(200).json({
        success: true,
        message: "Admin data retrieved successfully",
        status: 200,
        data: result
    })
})


const updateAdmin = catchAsync(async (req, res) => {

    const { id } = req.params;
    const payload = req.body;
    const result = await AdminServices.updateAdmin(id, payload)
    res.status(200).json({
        success: true,
        message: "Admin data updated successfully",
        status: 200,
        data: result
    })
})


const deleteAdmin = catchAsync(async (req, res) => {

    const { id } = req.params; 
    const result = await AdminServices.deleteAdmin(id)
    res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
        status: 200,
        data: result
    })
})

export const AdminControllers = {
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin
}