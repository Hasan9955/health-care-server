import jwt from 'jsonwebtoken';

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

export default generateToken;