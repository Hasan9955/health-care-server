import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

const createAdmin  = async (payload: any) => {

    const hashedPassword: string = await bcrypt.hash(payload.password, 10)
    
    const userData = {
        email: payload.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData
        })

        const createdAdminData = await transactionClient.admin.create({
            data: payload.admin
        })

        return {
            createdUserData,
            createdAdminData
        }

    })


    return result
}



export const userServices = {
    createAdmin
}