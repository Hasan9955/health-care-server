import jwt, { JwtPayload } from 'jsonwebtoken';

export type TokenPayload = {
    email: string;
    role: string; 
    id: string;
    status: string;
}

const generateToken = (payload: TokenPayload, secret: string, expiresIn: string) => {

    const token = jwt.sign(
        payload,
        secret,
        {
            algorithm: 'HS256',
            expiresIn
        })

    return token;
}


export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as JwtPayload;
}

// export const verifyToken = (token: string, secret: string) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const decoded = jwt.verify(token, secret) as JwtPayload
//             return decoded
//         } catch (error) {
//             next(error)
//         }
//     }
// }

export default generateToken;