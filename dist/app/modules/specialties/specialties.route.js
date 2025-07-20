"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtiesRoutes = void 0;
const express_1 = require("express");
const specialties_controller_1 = require("./specialties.controller");
const fileUploader_1 = require("../../utility/fileUploader");
const client_1 = require("@prisma/client");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const router = (0, express_1.Router)();
router.post('/', fileUploader_1.fileUploader.upload.single('file'), (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), specialties_controller_1.specialtyController.insertIntoDB);
router.get('/', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), specialties_controller_1.specialtyController.getAllSpecialties);
router.delete('/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), specialties_controller_1.specialtyController.deleteSpecialties);
exports.specialtiesRoutes = router;
