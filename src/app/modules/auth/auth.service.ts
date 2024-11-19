import { UserStatus } from "@prisma/client";
import generateToken from "../../utility/generateToken";
import { prisma } from "../../utility/prisma";
import bcrypt from 'bcrypt'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import Config from "../../../Config";

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




export const authServices = {
    loginUser,
    refreshToken
}