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
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
// functionality of multer storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
//Functionality of upload in cloudinary
// Configuration
cloudinary_1.v2.config({
    cloud_name: 'djh6t55nn',
    api_key: '713998522948863',
    api_secret: '9pyex37WBq-9HOnofBSWIuuZEEw'
});
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        // Upload an image
        cloudinary_1.v2.uploader.upload(file.path, 
        // { public_id: file.originalname },
        (error, result) => {
            fs_1.default.unlinkSync(file.path);
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    // console.log(optimizeUrl);
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto', 
    //     width: 500,
    //     height: 500,
    // });
    // console.log(autoCropUrl);    
});
exports.fileUploader = {
    upload,
    uploadToCloudinary
};
