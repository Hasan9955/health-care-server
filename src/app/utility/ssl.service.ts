import axios, { HttpStatusCode } from "axios";
import Config from "../../Config";
import AppError from "../error/appError";


export const sslService = async (paymentData: {
    amount: number;
    transactionId: string;
    name: string;
    email: string;
    contactNumber: string;
    address: string | null;
}) => {

    try {


        const data = {
            store_id: Config.ssl.store_id,
            store_passwd: Config.ssl.store_passwd,
            total_amount: paymentData.amount,
            currency: 'BDT',
            tran_id: paymentData.transactionId, // use unique tran_id for each api call
            success_url: Config.ssl.success_url,
            fail_url: Config.ssl.fail_url,
            cancel_url: Config.ssl.cancel_url,
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'N/A',
            product_name: 'Appointment.',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: paymentData.name,
            cus_email: paymentData.email,
            cus_add1: paymentData.address,
            cus_add2: 'N/A',
            cus_city: 'N/A',
            cus_state: 'N/A',
            cus_postcode: 'N/A',
            cus_country: 'Bangladesh',
            cus_phone: paymentData.contactNumber,
            cus_fax: paymentData.contactNumber,
            ship_name: 'N/A',
            ship_add1: 'N/A',
            ship_add2: 'N/A',
            ship_city: 'N/A',
            ship_state: 'N/A',
            ship_postcode: 1000,
            ship_country: 'N/A',
        };

        const response = await axios({
            method: 'post',
            url: Config.ssl.ssl_payment_api,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        return response.data;
    }
    catch (error) {
        throw new AppError(HttpStatusCode.BadRequest, 'Payment initiation failed!');
    }


}


export const validateSslPayment = async (payload: any) => {
    try{

        // amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=blood687cc0631d70c&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=6d2df323a72e2fd471768bbf28a0fbe5&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id
        
         const response = await axios ({
                method: 'GET',
                url: `${Config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${Config.ssl.store_id}&store_passwd=${Config.ssl.store_passwd}&format=json`,
            })
        
           return response.data;
        
    }
    catch(error) {
        throw new AppError(HttpStatusCode.BadRequest, 'Payment validation failed!');
    }
}