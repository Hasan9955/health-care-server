import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/response";
import { authServices } from "./auth.service";


const loginUser = catchAsync(async (req, res) => {

    const result = await authServices.loginUser(req.body);
    const { refreshToken, needPasswordChange, accessToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });


    sendResponse(res, {
        statusCode: 200,
        message: 'User login successfully!',
        data: {
            needPasswordChange,
            accessToken
        }
    })
})


const refreshToken = catchAsync(async (req, res) => {

    const token = req.cookies;
    const result = await authServices.refreshToken(token.refreshToken);  

    sendResponse(res, {
        statusCode: 200,
        message: 'Token generated successfully!',
        data: result
    })
})


export const authController = {
    loginUser,
    refreshToken
}