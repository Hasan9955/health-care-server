import { Admin, Prisma } from "@prisma/client"
import { adminSearchableFields } from "./admin.constant";
import calculatePagination from "../../utility/pagination";
import { prisma } from "../../utility/prisma";



export type TQuery = {
    searchTerm: string;
    [key: string]: string;
}


const getAllFromDB = async (query: TQuery, options: any) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    console.log(options);
    const { searchTerm, ...filterData } = query;
    const addCondition: Prisma.AdminWhereInput[] = [];

    if (query.searchTerm) {
        addCondition.push({
            OR: adminSearchableFields.map(field => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        addCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }

    const whereCondition: Prisma.AdminWhereInput = { AND: addCondition }

    const result = await prisma.admin.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        } 
    })

    const total = await prisma.admin.count({
        where: whereCondition
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: {
            result
        }
    };

}


const getSingleAdmin = async (id: string) => {
    const result = await prisma.admin.findUnique({
        where: {
            id
        }
    })
    return result;
}


const updateAdmin = async (id: string, payload: Partial<Admin>) => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.admin.update({
        where: {
            id
        },
        data: payload
    })
    return result;

}

const softDeleteAdmin = async (id: string, payload: Partial<Admin>) => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.admin.update({
        where: {
            id
        },
        data: payload
    })
    return result;

}


const deleteAdmin = async (id: string) => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.$transaction(async (transactionClient) => {

        const deletedAdminData = await transactionClient.admin.delete({
            where: {
                id
            }
        })

        const deleteUserData = await transactionClient.user.delete({
            where: {
                email: deletedAdminData.email
            }
        })

        return deletedAdminData

    })
}


export const AdminServices = {
    getAllFromDB,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin
}