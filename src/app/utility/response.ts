import { Response } from "express"

const sendResponse = <T>(
    res: Response,
    payload: {
        statusCode: number,
        message: string,
        meta?: {
            page: number,
            limit: number,
            total: number
        },
        data: T | null | undefined
    }
) => {
    res.status(payload.statusCode).json({
        success: true,
        message: payload.message,
        status: payload.statusCode,
        meta: payload?.meta || null || undefined,
        data: payload?.data || null || undefined
    })
}

export default sendResponse;