import Base from '../../base.js';
import __Subscription, { IStatusEnum, ISubscriptions } from "../../models/subscription.js";
import __Payment, {IPaymentMethodEnum, IPurchase, transactionStatus} from "../../models/payments.js";
import PaystackService from "../../helpers/paystackService.js";
import { ErrorHandlers } from '../../helpers/errorHandler.js';
import { User } from '../../app.js';
import __Plan, {IPlan, subPlans} from '../../models/plan'
import __Asset from '../../models/asset.js';
import { STRIPE_SECRET_KEY} from '../../config/config'
import { ObjectId } from 'mongoose';
import { CreatePlanValidation, IPlanValidation, IUnitType, IUpdatePlanValidation, UpdatePlanValidation } from './validation.js';
import { LocationService } from '../../helpers/locationAndCurrency.js';
import { Decimal128 } from 'mongodb';

import Stripe from 'stripe';
import TeamSubscriptionService from '../../helpers/stripeService.js';
import PaystackSubscriptionService from '../../helpers/paystackV2.js';
import moment from 'moment';

const stripe = new Stripe(STRIPE_SECRET_KEY);

class SubscriptionDatasource extends Base {

    async addSubscription(data: any): Promise<string> {
        await this.handleMongoError(__Subscription().create(data))
        return 'Added successfully'
    }

    // async InitializePayment(planId: string, teamMembers: string[], user: User): Promise<{ ref:string, publicKey:string, data:Record<string,any>}> {
     
    //     const plan: IPlan | null = await __Plan().findOne({_id: planId});
  
    //     if (!plan) throw new ErrorHandlers().ValidationError('Unable to perform this operation');
    //     const {unit, amount, minUsers, annualCommitment } = plan

    //     let amountToBePaid

    //     teamMembers && teamMembers.length && teamMembers.push(user._id.toString())

    //     // Ensure its individual/team(yearly) subscription 
    //     if(unit === IUnitType.year && teamMembers && teamMembers.length < minUsers){ 
    //         throw new ErrorHandlers().UserInputError("This plan requires minimum of 2 team members")
    //     }

    //     const {data} = await new LocationService().getUserLocationWithCurrency(Number(amount.toString()))

    //     const {convertedAmount,currency, symbol}=data
    //      if(teamMembers && teamMembers?.length >= minUsers && annualCommitment ){
    //      amountToBePaid = Number(convertedAmount) * teamMembers.length

    //      }else{
    //         amountToBePaid = convertedAmount
    //      }

    //     const {totalAmount, expiresAt} = this.calculateSubscription(unit, amountToBePaid.toString())
    //     const created:any = await this.handleMongoError(__Payment().create({
    //         userId: user?._id,
    //         amountPaid:totalAmount,
    //         paymentMethod:IPaymentMethodEnum.PayStack,
    //         planId,
    //         currency,
    //         teamMembers,
    //         expiresAt,
    //     }));

    //     if (!created?._id) throw new ErrorHandlers().ValidationError('Unable to initialize payment, try again.');
    //     return { ref: created?._id, publicKey: PAYSTACK_PUBLIC_KEY as string,
    //         data:{
    //             totalAmount:created.totalAmount,
    //             paymentMethod:IPaymentMethodEnum.PayStack,
    //             currency:created.currency,
    //             symbol:created.symbol
    //         }}
    // }


    async InitializePayment(planId: string, teamMembers: string[], user: User): Promise<{ ref:string, authorization_url:string}> {
      
        const plan: IPlan | null = await __Plan().findOne({_id: planId});
  
        if (!plan) throw new ErrorHandlers().ValidationError('Unable to perform this operation');
        const {unit, amount, minUsers, annualCommitment } = plan

        let amountToBePaid:number

        teamMembers && teamMembers.length && teamMembers.push(user?._id.toString())

        // Ensure its individual/team(yearly) subscription 
        if(unit === IUnitType.year && teamMembers && teamMembers.length < minUsers){ 
            throw new ErrorHandlers().UserInputError("This plan requires minimum of 2 team members")
        }

        const {data} = await new LocationService().getUserLocationWithCurrency(Number(amount.toString()))

        const {convertedAmount,currency}=data
         if(teamMembers && teamMembers?.length >= minUsers && annualCommitment ){
         amountToBePaid = Number(convertedAmount) * teamMembers.length

         }else{
            amountToBePaid = convertedAmount
         }

        const now = moment();
        const endDate = now.clone().add(1, 'month');
        
        let currentPlan: any 

        if(teamMembers && teamMembers.length > 1){

            const newPlan = await new PaystackSubscriptionService().createPlan({
                name:'customized team plan', 
                interval:'monthly', 
                amount:Math.round(Number(amountToBePaid)), description:`${user.email} customized plan` 
            })

            currentPlan=newPlan.plan_code
        }else{
            currentPlan= plan.paystackPlanCode
        }


         const processPlan = await new PaystackSubscriptionService().createSubscription({
            email:user.email,
            amount:Math.round(Number(amountToBePaid)),
            currency,
            plan:currentPlan,
            metadata:{
                planId,
                userId:user._id.toString()
            }

        })

        const created:any = await this.handleMongoError(__Payment().create({
            userId: user?._id,
            amountPaid:Math.round(Number(amountToBePaid)),
            paymentMethod:IPaymentMethodEnum.PayStack,
            planId,
            currency,
            teamMembers,
            subscriptionCode:processPlan.subscription_code,
            paystackRef:processPlan.reference,
            expiresAt:endDate,
        }));




        if (!created?._id) throw new ErrorHandlers().ValidationError('Unable to initialize payment, try again.');
        return { ref:processPlan.reference, authorization_url:processPlan.authorization_url
        }
    }


    async verifyTransaction(paymentRef: string, user: User): Promise<string> {

        const isTransaction: IPurchase | null = await __Payment().findOne({paystackRef: paymentRef});
        if (!isTransaction) throw new ErrorHandlers().ValidationError('Unable to perform this operation');

    
        if (isTransaction.status === transactionStatus.success) return "Payment completed successfully.";
        const incomingPayStackData = await new PaystackService().verifyTransaction(paymentRef)
      

        let updateStatus: transactionStatus;
    
          const now = moment();
            const endDate = now.clone().add(1, 'month');

        if (incomingPayStackData.status === transactionStatus.success) {
            await this.updatePaymentStatus(paymentRef, transactionStatus.success);
      
            const formattedPay = {
                userId:isTransaction.userId, 
                planId : isTransaction.planId,
                amountPaid: incomingPayStackData.amount / 100,
                expiresAt:endDate,
                subscriptionCode:isTransaction.subscriptionCode,
                paymentId:isTransaction._id as ObjectId,
                paymentMethod: isTransaction.paymentMethod,
                status:IStatusEnum.ACTIVE,
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


        await this.updatePaymentStatus(isTransaction._id.toString(), updateStatus);
        return `${updateStatus === transactionStatus.fraud ? fraudMessage : "Transaction processing"}`
    }


    async cancelSubscription(subscriptionId:string):Promise<{status:boolean, message:string}>{
        const subDetails = await __Subscription().findById(subscriptionId)
        
        if(subDetails.paymentMethod === IPaymentMethodEnum.PayStack){
            const { subscriptionCode }   = subDetails
            return new PaystackSubscriptionService().cancelSubscription(subscriptionCode)
        }else{

            // TODO:Handle google/stripe subscription cancellation 
            return {status:false, message:"Stripe cancellation not implemented"}
        }
    }

    async updatePaymentStatus(paymentId: string,  status: transactionStatus) {
        return __Payment().updateOne({paystackRef: paymentId}, {$set: {status}});
    }

    async getAllMySubscriptions(userId:ObjectId){
        return __Subscription().find({userId})
    }

    async getAllSubscriptions(){
        return __Subscription().find({})
    }

    async getSubscriptionById(subId:string):Promise<ISubscriptions | null>{
        return __Subscription().findById(subId)
    }

        //Pricing
        async addPlan(data: IPlanValidation): Promise<string> {
            await CreatePlanValidation(data)
            let minUsers  
            if(data.type ===subPlans.Team && data.unit === IUnitType.year ){
                minUsers = 2
            }

            let userPerYear
            if(data.unit === IUnitType.year){
                userPerYear = Number(data.amount.toString()) * 12
            }
            await this.handleMongoError(__Plan().create({...data, minUsers, userPerYear}))
            return 'Plan created successfully'
        }
    
        async updatePlan(data: IUpdatePlanValidation): Promise<string> {
            await  UpdatePlanValidation(data)
            const {planId, ...body} = data
            const pricing = await __Plan().findById(planId)

            if(!pricing) throw new ErrorHandlers().ValidationError("Plan not found")
                   // Calculate `userPerYear`
    if (
        (pricing.type === subPlans.Team || pricing.type === subPlans.Individual) &&
        (pricing.duration === 12 || pricing.unit === IUnitType.year)
    ) {
        body.userPerYear = Decimal128.fromString((parseFloat(pricing.amount.toString()) * 12).toString());
    } else {
        body.userPerYear = pricing.amount;
    }

            const updated = await __Plan().updateOne({_id: planId}, {$set: body})

              if(updated.matchedCount > 0)  return 'Plan updated successfully'
            throw new ErrorHandlers().ValidationError("Unable to update the plan")
        }
    
        async getAllPlan(): Promise<any[]> {
            const data: any[] = await __Plan().find({})
            return data?.map(async (item: any) => {
                const amount: string = item.amount?.toString()
                const perUser = item?.userPerYear
                const conversionResult :any= await new LocationService().getUserLocationWithCurrency(Number(amount))
                const perYearConversion :any= perUser  && await new LocationService().getUserLocationWithCurrency(Number(perUser))
                delete item?.amount
                return {
                    seasonId: item.seasonId,
                    type: item.type,
                    unit: item.unit,
                    duration: item.duration,
                    disable: item.disable,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    _id: item._id,
                    amount:conversionResult.data.convertedAmount,
                    userPerYear:perYearConversion.data.convertedAmount
                }
            });
        }
    
        async getPlanById(planId: string): Promise<any> {
            const data: IPlan | null = await __Plan().findOne({_id: planId});
            if (!data) return null;
            const amount: string = data?.amount.toString()
            // @ts-ignore
            const conversionResult :any= await new LocationService().getUserLocationWithCurrency(Number(amount))
            delete data?.amount
            return {
                type: data.type,
                unit: data.unit,
                duration: data.duration,
                disable: data.disable,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                _id: data._id,
                amount: conversionResult.data.convertedAmount
            }
        }


        // async processGooglePayment(planId:string, teamMembers:string[], user:any){  
        //     const plan=  await __Plan().findById(planId)
        //     const {unit, amount, minUsers, annualCommitment , baseCurrency, userPerYear} = plan
        

        //     const {data} = await new LocationService().getUserLocationWithCurrency(Number(amount.toString()))
      
        //       const {convertedAmount,currency, symbol}=data

        //       const googlePayService = new GooglePayService()
        //       const paymentData =  googlePayService.createPaymentData(convertedAmount, currency); 
        //       const token = await googlePayService.processPayment(paymentData);
    
      
        //       let amountToBePaid
      
        //       teamMembers && teamMembers.length && teamMembers.push(user._id.toString())
      
        //       // Ensure its individual/team(yearly) subscription 
        //       if(unit === IUnitType.year && teamMembers && teamMembers.length < minUsers){ 
        //           throw new ErrorHandlers().UserInputError("This plan requires minimum of 2 team members")
        //       }
      
              
        //        if(teamMembers && teamMembers?.length >= minUsers && annualCommitment ){
        //        amountToBePaid = Number(convertedAmount) * teamMembers.length
      
        //        }else{
        //           amountToBePaid = convertedAmount
        //        }
      
        //       const {totalAmount, expiresAt} = this.calculateSubscription(unit, amountToBePaid.toString())

        //       const charge = await stripe.charges.create({
        //         amount: parseInt(totalAmount) * 100, 
        //         currency:currency,
        //         source: token, 
        //         receipt_email: user.email,
        //         metadata: { planId, userId:user._id.toString() },
        //       });

        //       await this.handleMongoError(__Payment().create({
        //           userId: user?._id,
        //           stripeCustomerId:charge.id,
        //           amountPaid:totalAmount,
        //           paymentMethod:IPaymentMethodEnum.PayStack,
        //           planId,
        //           currency,
        //           teamMembers,
        //           expiresAt,
        //       }));

        //       return charge; 
      
        //     }

        async processGooglePayment(planId:string, teamMembers:string[], paymentMethod:string, user:any){  
            const plan=  await __Plan().findById(planId)
            const {unit, amount, minUsers, annualCommitment , baseCurrency, userPerYear} = plan
        
       let teamSize =   teamMembers && teamMembers.length && teamMembers.push(user._id.toString())

            const {data} = await new LocationService().getUserLocationWithCurrency(Number(amount.toString()))
      
              const {convertedAmount,currency, symbol}=data

        const stripeData = await new TeamSubscriptionService(STRIPE_SECRET_KEY).createSubscriptionOrOneTimePayment(user.email, paymentMethod, planId, Math.round(convertedAmount), currency, teamSize, teamSize ? false:true )
      
              let amountToBePaid
      
            
              // Ensure its individual/team(yearly) subscription 
              if(unit === IUnitType.year && teamMembers && teamMembers.length < minUsers){ 
                  throw new ErrorHandlers().UserInputError("This plan requires minimum of 2 team members")
              }
      
              
               if(teamMembers && teamMembers?.length >= minUsers && annualCommitment ){
               amountToBePaid = Number(convertedAmount) * teamMembers.length
      
               }else{
                  amountToBePaid = convertedAmount
               }
      
              const {totalAmount, expiresAt} = this.calculateSubscription(unit, amountToBePaid.toString())

              
              await this.handleMongoError(__Payment().create({
                  userId: user?._id,
                  amountPaid:totalAmount,
                  paymentMethod:IPaymentMethodEnum.GooglePay,
                  planId,
                  currency,
                  teamMembers,
                  expiresAt,
              }));

              return stripeData; 
      
            }

}

export default SubscriptionDatasource
