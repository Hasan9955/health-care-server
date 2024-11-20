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

const changePassword = catchAsync(async (req, res) => {
    const user = req.user; 
    const result = await authServices.changePassword(user, req.body);  

    sendResponse(res, {
        statusCode: 200,
        message: 'Password changed successfully!',
        data: result
    })
})

const forgotPassword = catchAsync(async (req, res) => { 
    const result = await authServices.forgotPassword(req.body);  

    sendResponse(res, {
        statusCode: 200,
        message: ' ',
        data: result
    })
})

const resetPassword = catchAsync(async (req, res) => { 

    const token = req.headers.authorization || '';

    await authServices.resetPassword(token, req.body);  

    sendResponse(res, {
        statusCode: 200,
        message: 'Password reset successfully',
        data: null
    })
})







export const authController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}