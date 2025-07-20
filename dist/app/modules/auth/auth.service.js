"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const client_1 = require("@prisma/client");
const generateToken_1 = __importStar(require("../../utility/generateToken"));
const prisma_1 = require("../../utility/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Config_1 = __importDefault(require("../../../Config"));
const emailSender_1 = __importDefault(require("../../utility/emailSender"));
const appError_1 = __importDefault(require("../../error/appError"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password does not matched!');
    }
    const accessToken = (0, generateToken_1.default)({
        email: userData.email,
        role: userData.role,
        status: userData.status,
        id: userData.id
    }, Config_1.default.access_secret, Config_1.default.access_exp);
    const refreshToken = (0, generateToken_1.default)({
        email: userData.email,
        role: userData.role,
        status: userData.status,
        id: userData.id
    }, Config_1.default.refresh_secret, Config_1.default.refresh_exp);
    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken,
        refreshToken
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new Error("Refresh token not found!");
    }
    let decodedData;
    try {
        decodedData = jsonwebtoken_1.default.verify(token, 'hasan');
    }
    catch (error) {
        throw new Error("You are not authorized!");
    }
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData === null || decodedData === void 0 ? void 0 : decodedData.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const accessToken = (0, generateToken_1.default)({
        email: userData.email,
        role: userData.role,
        status: userData.status,
        id: userData.id
    }, Config_1.default.access_secret, Config_1.default.access_exp);
    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password does not matched!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    const updateUser = yield prisma_1.prisma.user.update({
        where: {
            email: userData.email,
            status: client_1.UserStatus.ACTIVE
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });
    updateUser.password = '';
    return updateUser;
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const resetPasswordToken = (0, generateToken_1.default)({
        email: userData.email, id: userData.id, role: userData.role, status: userData.status
    }, Config_1.default.reset_pass_secret, Config_1.default.reset_pass_exp);
    const resetPassLink = Config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPasswordToken}`;
    (0, emailSender_1.default)(userData.email, resetPassLink);
    return resetPassLink;
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isValidToken = (0, generateToken_1.verifyToken)(token, Config_1.default.reset_pass_secret);
    if (!isValidToken) {
        throw new appError_1.default(403, 'Forbidden access!');
    }
    if (isValidToken.email !== userData.email) {
        throw new appError_1.default(403, 'Forbidden access!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    yield prisma_1.prisma.user.update({
        where: {
            email: userData.email,
            status: client_1.UserStatus.ACTIVE
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });
});
exports.authServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
