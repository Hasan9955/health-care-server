"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../utility/fileUploader");
const router = (0, express_1.Router)();
router.get('/', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.userControllers.getAllUsers);
router.post('/create-admin', fileUploader_1.fileUploader.upload.single('file'), (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.userControllers.createAdmin);
router.post('/create-doctor', fileUploader_1.fileUploader.upload.single('file'), (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.userControllers.createDoctor);
router.post('/create-patient', fileUploader_1.fileUploader.upload.single('file'), user_controller_1.userControllers.createPatient);
router.patch('/update-me', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.PATIENT, client_1.UserRole.DOCTOR), fileUploader_1.fileUploader.upload.single('file'), user_controller_1.userControllers.updateMyProfile);
router.get('/me', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.PATIENT, client_1.UserRole.DOCTOR), user_controller_1.userControllers.myProfile);
exports.userRoutes = router;
