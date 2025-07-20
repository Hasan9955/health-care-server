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
const nodemailer_1 = __importDefault(require("nodemailer"));
const Config_1 = __importDefault(require("../../Config"));
const emailSender = (email, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: Config_1.default.app_email,
            pass: Config_1.default.app_password,
        },
        // if there have an error
        // tls: {
        //     rejectUnauthorized: false
        // }
    });
    yield transporter.sendMail({
        from: `"PH Health Care" <${Config_1.default.app_email}>`,
        to: email,
        subject: "Reset your password!",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="text-align: center; color: #4CAF50;">Reset Your Password</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Don't worry, it happens to the best of us!</p>
                <p style="font-size: 16px; margin: 20px 0;">Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" 
                       style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                        Reset Password
                    </a>
                </div>
                <p style="margin-top: 20px;">If you did not request a password reset, please ignore this email. This reset link will expire in 10 minutes.</p>
                <p style="margin-top: 20px;">Thank you,<br>The PH Health Care Team</p>
                <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
                    <p>If you need further assistance, please contact our support team.</p>
                </div>
            </div>`,
    });
});
exports.default = emailSender;
