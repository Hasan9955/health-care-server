"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
router.get('/', admin_controller_1.AdminControllers.getAllAdmins);
router.get('/:id', admin_controller_1.AdminControllers.getSingleAdmin);
router.delete('/:id', admin_controller_1.AdminControllers.deleteAdmin);
router.patch('/:id', admin_controller_1.AdminControllers.updateAdmin);
exports.adminRoutes = router;
