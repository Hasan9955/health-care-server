import { userServices } from "./user.service";
import catchAsync from "../../utility/catchAsync";
import { userValidation } from "./user.validation";



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

export const userControllers = {
    createAdmin
}