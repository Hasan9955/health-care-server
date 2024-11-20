import { NextFunction, Request, Response } from "express"
import JwtHelpers, { JwtPayload } from "jsonwebtoken";
import Config from "../../Config";
import AppError from "../error/appError";



const auth = (...roles: string[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                throw new AppError(401, "You are not authorized")
            }

            const verifiedUser = JwtHelpers.verify(token, Config.access_secret as string) as JwtPayload
            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new AppError(401, "You are not authorized")
            }

            next();

        } catch (error) {
            next(error)
        }
    }




}


export default auth;