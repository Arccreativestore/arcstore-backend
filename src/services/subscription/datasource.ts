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
import { CreatePlanValidation, IPlanValidation, IUpdatePlanValidation, UpdatePlanValidation } from './validation.js';



class SubscriptionDatasource extends Base {

    async addSubscription(data: any): Promise<string> {
        await this.handleMongoError(__Subscription().create(data))
        return 'Added successfully'
    }

    async InitializePayment(planId: string, paymentMethod: IPaymentMethodEnum, user: User): Promise<{ ref:string, publicKey:string }> {
        const plan: IPlan | null = await __Plan().findOne({_id: planId});
  
        if (!plan) throw new ErrorHandlers().ValidationError('Unable to perform this operation');
        const {unit, amount, discount, duration } = plan
        const {totalAmount} = this.calculateSubscription(unit, amount.toString(), discount, duration)
   
        const created = await this.handleMongoError(__Payment().create({
            userId: user?._id,
            amountPaid:totalAmount,
            paymentMethod:paymentMethod,
            planId
        }));
     
        if (!created?._id) throw new ErrorHandlers().ValidationError('Unable to initialize payment, try again.');
        return { ref: created?._id, publicKey: PAYSTACK_PUBLIC_KEY as string }
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

    async cancelSubscription(subscriptionId:string){}

    async updatePaymentStatus(paymentId: string,  status: transactionStatus) {
        return __Payment().updateOne({_id: paymentId}, {$set: {status}});
    }

    async getAllMySubscriptions(userId:ObjectId){}

    async getAllSubscriptions(){}

    async getSubscriptionById(subId:string):Promise<ISubscriptions | null>{
        return null
    }

        //Pricing
        async addPlan(data: IPlanValidation): Promise<string> {
            await CreatePlanValidation(data)
            await this.handleMongoError(__Plan().create({...data}))
            return 'Plan created successfully'
        }
    
        async updatePlan(data: IUpdatePlanValidation): Promise<string> {
            await  UpdatePlanValidation(data)
            const {planId, ...body} = data
            const pricing = await __Plan().findById(planId)

            if(!pricing) throw new ErrorHandlers().ValidationError("Plan not found")
            const updated = await __Plan().updateOne({_id: planId}, {$set: body})

              if(updated.matchedCount > 0)  return 'Plan updated successfully'
            throw new ErrorHandlers().ValidationError("Unable to update the plan")
        }
    
        async getAllPlan(): Promise<any[]> {
            const data: any[] = await __Plan().find({})
            return data?.map((item: any) => {
                const amount: string = item.amount?.toString()
    
                delete item?.amount
                return {
                    seasonId: item.seasonId,
                    type: item.type,
                    discount: item.discount,
                    unit: item.unit,
                    duration: item.duration,
                    disable: item.disable,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    _id: item._id,
                    amount
                }
            });
        }
    
        async getPlanById(planId: string): Promise<any> {
            const data: IPlan | null = await __Plan().findOne({_id: planId});
            if (!data) return null;
            const amount: string = data?.amount.toString()
            // @ts-ignore
            delete data?.amount
            return {
                type: data.type,
                discount: data.discount,
                unit: data.unit,
                duration: data.duration,
                disable: data.disable,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                _id: data._id,
                amount: amount
            }
        }

}

export default SubscriptionDatasource
