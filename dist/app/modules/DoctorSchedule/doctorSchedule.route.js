"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorScheduleRoutes = void 0;
const express_1 = require("express");
const doctorSchedule_controller_1 = require("./doctorSchedule.controller");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get('/', (0, verifyAuth_1.default)(client_1.UserRole.DOCTOR), doctorSchedule_controller_1.doctorScheduleController.getDoctorSchedules);
router.post('/', (0, verifyAuth_1.default)(client_1.UserRole.DOCTOR), doctorSchedule_controller_1.doctorScheduleController.createDoctorSchedule);
router.delete('/:id', (0, verifyAuth_1.default)(client_1.UserRole.DOCTOR), doctorSchedule_controller_1.doctorScheduleController.deleteFromDB);
exports.doctorScheduleRoutes = router;
