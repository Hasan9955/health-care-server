import { UserStatus } from "@prisma/client";
import generateToken, { verifyToken } from "../../utility/generateToken";
import { prisma } from "../../utility/prisma";
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
import Config from "../../../Config";
import emailSender from "../../utility/emailSender";
import AppError from "../../error/appError";

const loginUser = async (payload: {
    email: string;
    password: string;
}) => { 
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password)

    if(!isCorrectPassword){
        throw new Error('Password does not matched!')
    } 

    const accessToken = generateToken({
        email: userData.email,
        role: userData.role,
        status: userData.status,
        id: userData.id
    },
    Config.access_secret as string,
    Config.access_exp as string
    )
    
    const refreshToken = generateToken({
        email: userData.email,
        role: userData.role,
        status: userData.status,
        id: userData.id
    },
    Config.refresh_secret as string,
    Config.refresh_exp as string
    )
    
    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken,
        refreshToken
    }

}


const refreshToken = async (token: string) => {

    if(!token){
        throw new Error("Refresh token not found!")
    }
    let decodedData;
    try {
        decodedData = jwt.verify(token, 'hasan') as JwtPayload; 
    } catch (error) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE
        }
    })

    const accessToken = generateToken({
        email: userData.email,
        role: userData.role,
        status: userData.status,
        id: userData.id
    },
    Config.access_secret as string,
    Config.access_exp as string
    )
    
    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken
    }

}


const changePassword = async (user: any, payload: any) => {
  
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password)

    if(!isCorrectPassword){
        throw new Error('Password does not matched!')
    } 

    
    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10)
    

    const updateUser = await prisma.user.update({
        where: {
            email: userData.email,
            status: UserStatus.ACTIVE
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    updateUser.password = '';

    return updateUser;

}


const forgotPassword = async (payload: {email: string}) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const resetPasswordToken = generateToken(
        {
            email: userData.email, id: userData.id, role: userData.role, status: userData.status
        },
        Config.reset_pass_secret as string,
        Config.reset_pass_exp as string
    )

    
    const resetPassLink = Config.reset_pass_link + `?userId=${userData.id}&token=${resetPasswordToken}` 
 

    emailSender(userData.email, resetPassLink) 
    
    return resetPassLink


}


const resetPassword = async (token: string, payload: {email: string, password: string}) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    
    const isValidToken = verifyToken(token, Config.reset_pass_secret as string)
    
    if(!isValidToken) {
        throw new AppError(403, 'Forbidden access!')
    }
    
    if(isValidToken.email !== userData.email) {
        throw new AppError(403, 'Forbidden access!')
    }

    const hashedPassword: string = await bcrypt.hash(payload.password, 10) 

    await prisma.user.update({
        where: {
            email: userData.email,
            status: UserStatus.ACTIVE
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

}




export const authServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}