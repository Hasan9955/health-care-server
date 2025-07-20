"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRoutes = void 0;
const express_1 = require("express");
const doctor_controller_1 = require("./doctor.controller");
const fileUploader_1 = require("../../utility/fileUploader");
const client_1 = require("@prisma/client");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const router = (0, express_1.Router)();
router.get('/', doctor_controller_1.doctorControllers.getAllDoctors);
router.get('/:id', doctor_controller_1.doctorControllers.getSingleDoctor);
router.delete('/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), doctor_controller_1.doctorControllers.softDeleteDoctor);
router.delete('/delete/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), doctor_controller_1.doctorControllers.deleteDoctor);
router.patch('/:id', fileUploader_1.fileUploader.upload.single('file'), (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR), doctor_controller_1.doctorControllers.updateDoctor);
exports.doctorRoutes = router;
