"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authController.loginUser);
router.post('/change-password', (0, verifyAuth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT, client_1.UserRole.SUPER_ADMIN), auth_controller_1.authController.changePassword);
router.post('/refresh-token', auth_controller_1.authController.refreshToken);
router.post('/forgot-password', auth_controller_1.authController.forgotPassword);
router.post('/reset-password', auth_controller_1.authController.resetPassword);
exports.authRoutes = router;
