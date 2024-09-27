import axios, {AxiosResponse} from 'axios';
import {PAYSTACK_BASE_URL, PAYSTACK_SECRET_KEY} from "../config/config.js";
import __Subscription from "../models/subscription.js";
import __Payment, { IPurchase, transactionStatus} from "../models/purchaseHistory";
import { ErrorHandlers } from './errorHandler.js';
import Base from '../base.js';

class PaystackService {

    async processWebhook(payload: { event: string, data: any }): Promise<void> {
        const reference = payload.data.reference;
        switch (payload.event) {
            case 'charge.success':
                return this.processData(payload.data)
            case 'charge.failed':
                await __Payment().updateOne({_id: reference}, {$set: {status: transactionStatus.fraud}});
                break;
            default:
                console.log("Unable to process webhook")
                break;
        }
    }

    async verifyTransaction(reference: string) {
        try {
            const response: AxiosResponse<any> = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
      
            return response.data.data;
        } catch (error) {
            console.log(error)
            throw new ErrorHandlers().ValidationError('Failed to verify transaction');
        }
    }

    async processData(data: Record<string, any>) {
        const isTransaction: IPurchase | null = await __Payment().findOne({_id: data.reference});
        if (!isTransaction) return console.log(JSON.stringify(data, null, 2), "Error processing payment");

        const formattedPayload: Record<string, any> = {
            userId: isTransaction.userId,
            paymentId: isTransaction._id,
            amount: isTransaction.amountPaid,
            type:isTransaction.paymentMethod
        }
        await new Base().handleMongoError( __Subscription().create(formattedPayload))

    }

}

export default PaystackService;
