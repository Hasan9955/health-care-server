"use strict";
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
exports.AdminControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utility/catchAsync"));
const pick_1 = __importDefault(require("../../utility/pick"));
const admin_constant_1 = require("./admin.constant");
const admin_service_1 = require("./admin.service");
const response_1 = __importDefault(require("../../utility/response"));
const getAllAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const filterQuery = (0, pick_1.default)(query, admin_constant_1.adminFilterableFields);
    const options = (0, pick_1.default)(query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = yield admin_service_1.AdminServices.getAllFromDB(filterQuery, options);
    (0, response_1.default)(res, {
        message: "All admins retrieved successfully",
        statusCode: 200,
        meta: result.meta,
        data: result.data
    });
}));
const getSingleAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.getSingleAdmin(id);
    (0, response_1.default)(res, {
        message: "Admin data retrieved successfully",
        statusCode: 200,
        data: result
    });
}));
const updateAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield admin_service_1.AdminServices.updateAdmin(id, payload);
    (0, response_1.default)(res, {
        message: "Admin data updated successfully",
        statusCode: 200,
        data: result
    });
}));
const softDeleteAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.softDeleteAdmin(id);
    (0, response_1.default)(res, {
        message: "Admin deleted successfully",
        statusCode: 200,
        data: result
    });
}));
const deleteAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.deleteAdmin(id);
    (0, response_1.default)(res, {
        message: "Admin deleted successfully",
        statusCode: 200,
        data: result
    });
}));
exports.AdminControllers = {
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
};
