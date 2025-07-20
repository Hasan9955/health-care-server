"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../utility/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get('/', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), admin_controller_1.AdminControllers.getAllAdmins);
router.get('/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), admin_controller_1.AdminControllers.getSingleAdmin);
router.delete('/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), admin_controller_1.AdminControllers.deleteAdmin);
router.delete('/soft/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), admin_controller_1.AdminControllers.softDeleteAdmin);
router.patch('/:id', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(admin_validation_1.adminUpdateValidationSchema), admin_controller_1.AdminControllers.updateAdmin);
exports.adminRoutes = router;
