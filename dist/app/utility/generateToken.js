"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn
    });
    return token;
};
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
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
exports.default = generateToken;
