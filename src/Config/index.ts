import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(process.cwd(), '.env') })


export default {
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
    app_email: process.env.APP_EMAIL,
    ssl: {
        store_id: process.env.SSL_STORE_ID,
        store_passwd: process.env.SSL_STORE_PASSWORD,
        success_url: process.env.SSL_SUCCESS_URL,
        fail_url: process.env.SSL_FAIL_URL,
        cancel_url: process.env.SSL_CANCEL_URL,
        ssl_payment_api: process.env.SSL_PAYMENT_API,
        ssl_validation_api: process.env.SSL_VALIDATION_API,
    }

}