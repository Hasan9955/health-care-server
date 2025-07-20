"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleRoutes = void 0;
const express_1 = require("express");
const schedule_controller_1 = require("./schedule.controller");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', (0, verifyAuth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), schedule_controller_1.scheduleControllers.insertIntoDB);
router.get('/', (0, verifyAuth_1.default)(client_1.UserRole.DOCTOR), schedule_controller_1.scheduleControllers.getAllSchedules);
exports.scheduleRoutes = router;
