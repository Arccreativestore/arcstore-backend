import { GraphQLError } from "graphql";
import { DateTypeDefinition } from "graphql-scalars";
import { model, ObjectId, Schema } from "mongoose";
import {Decimal128} from 'mongodb';


export enum IPaymentMethodEnum {
    PayStack='paystack',
    GooglePay='GooglePay'
}
export enum transactionStatus {
    pending = "pending",
    success = "success",
    reversal = "reversal",
    failure = "failure",
    fraud = 'fraud',
}
export interface IPurchase extends Document {
    _id?:ObjectId
    userId: ObjectId
    planId:ObjectId
    purchaseDate: Date
    amountPaid: Decimal128
    paymentMethod: IPaymentMethodEnum
    currency: string
    stripeCustomerId:string
    expiresAt:Date,
    subscriptionCode:string,
    paystackRef:string
    teamMembers:ObjectId[]
    status: transactionStatus
}

const purchaseHistorySchema = new Schema<IPurchase>({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },

    planId:{
        type:Schema.Types.ObjectId,
        index:true,
    },

    stripeCustomerId:{
        type:String

    },

    paystackRef:{
        type:String
    },
    purchaseDate: {
        type: Date,
        default: Date.now()
    },

    expiresAt: {
        type: Date
    },

    amountPaid: {
        type: Decimal128,
        required: true
    },
    subscriptionCode: {
        type: String,
    },

    currency: {
        type: String,
    },

    paymentMethod: {
        type: String,
        enum:Object.values(IPaymentMethodEnum),
        default:IPaymentMethodEnum.PayStack
    },

    status: {
        type: String,
        enum:Object.values(transactionStatus),
        default:transactionStatus.pending
    },

    teamMembers:[Schema.Types.ObjectId]
    
},
{
    timestamps: true,
    versionKey: false,
})

const purchaseHistoryModel = (isTest: boolean = false)=>{
    if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")
    
    let collectionName = isTest ? "test_payments" : "payments"
    return model<IPurchase>(collectionName, purchaseHistorySchema, collectionName)
    }
    
    export default purchaseHistoryModel