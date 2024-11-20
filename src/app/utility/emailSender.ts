import nodemailer from 'nodemailer';
import Config from '../../Config';

const emailSender = async (
    email: string,
    resetLink: string
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: Config.app_email,
            pass: Config.app_password,
        },
        // if there have an error
        // tls: {
        //     rejectUnauthorized: false
        // }
    });
  

    await transporter.sendMail({
        from: `"PH Health Care" <${Config.app_email}>`,
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
 
};

export default emailSender;
