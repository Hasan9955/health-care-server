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
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtyServices = void 0;
const fileUploader_1 = require("../../utility/fileUploader");
const prisma_1 = require("../../utility/prisma");
const insertIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const payload = req.body;
    if (file) {
        const uploadFile = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.icon = uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.url;
    }
    const result = yield prisma_1.prisma.specialties.create({
        data: payload
    });
    return result;
});
const getAllSpecialties = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.specialties.findMany();
    return result;
});
const deleteSpecialties = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.specialties.delete({
        where: {
            id: id
        }
    });
    return result;
});
exports.specialtyServices = {
    insertIntoDB,
    getAllSpecialties,
    deleteSpecialties
};
