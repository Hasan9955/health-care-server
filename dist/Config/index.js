"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL,
    port: process.env.PORT,
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    access_exp: process.env.ACCESS_TOKEN_EXP,
    refresh_exp: process.env.REFRESH_TOKEN_EXP,
    reset_pass_secret: process.env.RESET_PASS_SECRET,
    reset_pass_exp: process.env.RESET_PASS_EXP,
    reset_pass_link: process.env.RESET_PASS_LINK,
    app_password: process.env.APP_PASSWORD,
    app_email: process.env.APP_EMAIL
};
