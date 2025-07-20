"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRoutes = void 0;
const express_1 = require("express");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const client_1 = require("@prisma/client");
const patient_controller_1 = require("./patient.controller");
const router = (0, express_1.Router)();
router.get('/', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), patient_controller_1.PatientControllers.getAllPatients);
router.get('/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), patient_controller_1.PatientControllers.getSinglePatient);
router.delete('/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), patient_controller_1.PatientControllers.softDeletePatient);
router.delete('/delete/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), patient_controller_1.PatientControllers.deletePatient);
router.patch('/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), patient_controller_1.PatientControllers.updatePatient);
exports.patientRoutes = router;
