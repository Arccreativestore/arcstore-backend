import axios, { AxiosResponse } from 'axios';
import { PAYSTACK_BASE_URL, PAYSTACK_SECRET_KEY } from "../config/config.js";
import __Subscription, { IStatusEnum, ISubscriptions } from "../models/subscription.js";
import __Payment, { IPurchase, transactionStatus } from "../models/payments.js";
import { ErrorHandlers } from './errorHandler.js';
import Base from '../base.js';
import moment from 'moment';

class PaystackSubscriptionService {
    
    private async makeRequest(method: string, path: string, data?: any): Promise<any> {
        try {
            const response = await axios({
                method,
                url: `${PAYSTACK_BASE_URL}${path}`, 
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                data,
            });
            return response.data.data; // Access data property
        } catch (error: any) {
            console.error(`Paystack API error (${method} ${path}):`, error.response?.data || error.message);
            throw error; // Re-throw for handling at the caller level
        }
    }

    async processWebhook(payload: { event: string, data: any }): Promise<void> {
        const reference = payload.data.reference;
        switch (payload.event) {
            case 'charge.success':
                return this.processData(payload.data);
            case 'charge.failed':
                await __Payment().updateOne({ _id: reference }, { $set: { status: transactionStatus.fraud } });
                break;
            case 'subscription.create':
                await this.handleSubscriptionCreate(payload.data);
                break;
            case 'subscription.disable':
                await this.handleSubscriptionCancel(payload.data);
                break;
            case 'invoice.upcoming':
                await this.notifyUpcomingInvoice(payload.data);
                break;
            default:
                console.log("Unable to process webhook");
                break;
        }
    }

   
    //webhook methods
    async handleSubscriptionCreate(data: Record<string, any>) {
        // Implement logic to handle subscription creation
        const payment:IPurchase | any = __Payment().findOne({paystackRef:data.reference})
        const subscription:ISubscriptions | any = await __Subscription().findOne({paymentId: payment?._id})
        if (!subscription) {
            return
        }

        const now = moment()
        const endDate = now.add(1, 'month')
        // subscription.subscriptionId = data.subscription_code;
        subscription.expiresAt = endDate;
        subscription.status = IStatusEnum.ACTIVE
        await subscription.save()
    }

    async handleSubscriptionCancel(data: Record<string, any>) {
        // Implement logic to handle subscription cancellation
        const subscription:any = await __Subscription().findOne({subscriptionId: data.subscription_code})
        if (!subscription) {
            return
        }
        subscription.status = "cancelled"
        await subscription.save()
    }


    async notifyUpcomingInvoice(data: Record<string, any>) {
        // Implement logic to notify customer of upcoming invoice
    }




    //In code 
    async createSubscription(subscriptionData: { email: string; plan: string; currency:string, amount:number, metadata?: any }): Promise<any> {
        try {
            const { email, plan, metadata, amount, currency } = subscriptionData;
            const initResponse = await this.makeRequest('POST', '/transaction/initialize', {
                email,
                amount:amount * 100,
                currency,
                plan, 
                metadata,
                
            });

            return initResponse;

        } catch (error) {
            console.error("Error creating Paystack subscription:", error);
            throw error;
        }
    }

    async createPlan(planData: { name: string; amount: number; interval: 'monthly' | 'annual'; description?: string }): Promise<any> {
        try {
            const plan = await this.makeRequest('POST', '/plan', {...planData,  amount: planData.amount * 100});
            
            return plan;
        } catch (error) {
            console.error("Error creating Paystack plan:", error);
            throw error;
        }
    }

    async verifyTransaction(reference: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.data; // Access data property
        } catch (error) {
            console.log(error);
            throw new ErrorHandlers().ValidationError('Failed to verify transaction');
        }
    }

    async processData(data: Record<string, any>) {
        const isTransaction = await __Payment().findById(data.reference);
        if (!isTransaction) {
            console.log(JSON.stringify(data, null, 2), "Error processing payment");
            return;
        }

        const formattedPayload: Record<string, any> = {
            userId: isTransaction.userId,
            paymentId: isTransaction._id,
            amount: isTransaction.amountPaid,
            type: isTransaction.paymentMethod,
            expiresAt: isTransaction.expiresAt,
        };

        if (isTransaction.teamMembers) {
            formattedPayload.teamMembers = isTransaction.teamMembers;
        }

        try {
            await new Base().handleMongoError(__Subscription().create(formattedPayload));

            isTransaction.status = transactionStatus.success;
            await isTransaction.save();
        } catch (error) {
            console.error("Error processing subscription:", error);
        }
    }


    async fetchPlan(planIdOrCode: string): Promise<any> {
        try {
            const plan = await this.makeRequest('GET', `/plan/${planIdOrCode}`);
            return plan;
        } catch (error) {
            console.error(`Error fetching Paystack plan (${planIdOrCode}):`, error);
          
        }
    }


    async fetchSubscription(subCode: string): Promise<any> {
        try {
            const subDetails = await this.makeRequest('GET', `/subscription/${subCode}`);
            return subDetails;
        } catch (error) {
            console.error(`Error fetching Paystack subscription (${subCode}):`, error);
   
        }
    }

   async cancelSubscription(code:string):Promise<{status:boolean, message:string}>{
        try {
            const fetSubDetails = await this.fetchSubscription(code)
            const response = await this.makeRequest('POST', '/subscription/disable', {code, token: fetSubDetails.email_token})
        return response

        } catch (error) {
            console.error(`Error cancelling Paystack subscription (${code}):`, error);
        }
    }

}

export default PaystackSubscriptionService;