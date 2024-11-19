import { NextFunction, Request, Response, Router } from "express"
import { userControllers } from "./user.controller";
import JwtHelpers from "jsonwebtoken";
import Config from "../../../Config";


const router = Router();

const auth = (...roles: string[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                throw new Error("You are not authorized")
            }

            const verifiedUser = JwtHelpers.verify(token, Config.access_secret as string)

            console.log(verifiedUser);


        } catch (error) {
            next(error)
        }
    }
}


router.post('/', auth("ADMIN"), userControllers.createAdmin)


export const userRoutes = router;


