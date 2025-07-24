import axios, { HttpStatusCode } from "axios";
import Config from "../../Config";
import AppError from "../error/appError";
import { IPaymentData } from "../Interfaces/ssl.interface";


export const sslService = async (paymentData: IPaymentData) => {

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