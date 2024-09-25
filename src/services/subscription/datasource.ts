import Base from '../../base.js';
import __Subscription, { ISubscriptions } from "../../models/subscription.js";
import __Payment, {IPaymentMethodEnum, IPurchase, transactionStatus} from "../../models/purchaseHistory";
import PaystackService from "../../helpers/paymentService";
import { ErrorHandlers } from '../../helpers/errorHandler.js';
import { User } from '../../app.js';
import __Plan, {IPlan} from '../../models/plan'
import __Asset, { IAsset } from '../../models/asset.js';
import {PAYSTACK_PUBLIC_KEY} from '../../config/config'
import { ObjectId } from 'mongoose';



class SubscriptionDatasource extends Base {

    async addSubscription(data: any): Promise<string> {
        await this.handleMongoError(__Subscription().create(data))
        return 'Added successfully'
    }

    async InitializePayment(assetIds: string[], paymentMethod: IPaymentMethodEnum, user: User): Promise<{ ref:string, publicKey:string }> {
        const asset: IAsset[] | null = await __Asset().find({_id: {$ne: assetIds }});
        if (!asset) throw new ErrorHandlers().ValidationError('Unable to perform this operation');

        const price:number = asset.reduce((acc, item)=> acc + item.price, 0)

        const {_id} = await this.handleMongoError(__Payment().create({
            userId: user._id,
            amountPaid:price,
            paymentMethod:paymentMethod
        }));

        if (!_id) throw new ErrorHandlers().ValidationError('Unable to initialize payment, try again.');
        return { ref: _id, publicKey: PAYSTACK_PUBLIC_KEY as string }


    }

    async verifyTransaction(paymentRef: string, user: User): Promise<string> {

        const isTransaction: IPurchase | null = await __Payment().findOne({_id: paymentRef});
        if (!isTransaction) throw new ErrorHandlers().ValidationError('Unable to perform this operation');

        const plan = await __Plan().findOne({_id:isTransaction.planId})
        if (!plan) throw new ErrorHandlers().ValidationError('Unable to perform this operation');
        if (isTransaction.status === transactionStatus.success) return "Payment completed successfully.";
        const incomingPayStackData = await new PaystackService().verifyTransaction(paymentRef)
      

        let updateStatus: transactionStatus;
      const { amount, unit, discount, duration} = plan
      const amtPaid = Number(amount.toString()) * 100

        const {expiresAt, totalAmount}  =   this.calculateSubscription(unit, amtPaid.toString(), discount, duration)
        if (incomingPayStackData.status === transactionStatus.success && amount === incomingPayStackData.amount) {
            await this.updatePaymentStatus(paymentRef, transactionStatus.success);
      
            const formattedPay = {
                userId:isTransaction.userId, 
                planId : isTransaction.planId,
                amountPaid: totalAmount,
                expiresAt,
                paymentId:isTransaction._id as ObjectId,
                paymentMethod: isTransaction.paymentMethod,
            }

            await this.handleMongoError(__Subscription().create(formattedPay))
            return 'Subscription successfully added'
        }
        let incomingStatus = incomingPayStackData.status
        const fraudMessage: string = "Payment manipulation detected";

        updateStatus = incomingStatus === 'reversed' ? 
                        transactionStatus.reversal: 
                        incomingPayStackData.amount < Number(isTransaction.amountPaid.toString()) ? 
                        transactionStatus.fraud : 
                        transactionStatus.pending;


        await this.updatePaymentStatus(paymentRef, updateStatus);
        return `${updateStatus === transactionStatus.fraud ? fraudMessage : "Transaction processing"}`
    }

    async updatePaymentStatus(paymentId: string,  status: transactionStatus) {
        return __Payment().updateOne({_id: paymentId}, {$set: {status}});
    }

    async getAllMySubscriptions(userId:ObjectId){}

    async getAllSubscriptions(){}

    async getSubscriptionById(subId:string):Promise<ISubscriptions | null>{
        return null
    }

}

export default SubscriptionDatasource