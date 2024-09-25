import { model, ObjectId, Schema } from "mongoose";
import { Decimal128 } from 'mongodb'
import { IPaymentMethodEnum } from "./purchaseHistory";

export interface ISubscriptions extends Document{
    _id?:ObjectId
    userId: ObjectId
    planId : ObjectId
    amountPaid: Decimal128
    expiresAt: Date
    paymentId:ObjectId
    paymentMethod: IPaymentMethodEnum
}


const subSchema = new Schema<ISubscriptions>({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        index: true
    },
    
    paymentId:{
        type:Schema.Types.ObjectId,
        index:true,
    },

    planId: {
        type: Schema.Types.ObjectId,
        index:true
    },

    expiresAt: {
        typ: Date
    },

    amountPaid:{
        type: Decimal128
    },

    paymentMethod:{
        type: String,
        enum:Object.values(IPaymentMethodEnum)
    },
},
{
    timestamps: true
})

const subscriptionsModel = (isTest: boolean = false)=>{
    if (isTest == undefined || isTest == null) throw new Error("environment is not valid");
      const collectionName = isTest ? "test_subscriptions" : "subscriptions";
      return model<ISubscriptions>(collectionName, subSchema, collectionName);
}

export default subscriptionsModel