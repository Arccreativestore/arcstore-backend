import { model, ObjectId, Schema } from "mongoose";
import { Decimal128 } from 'mongodb'
import { IPaymentMethodEnum, transactionStatus } from "./payments";



export enum IStatusEnum{
    ACTIVE='active',
    INACTIVE='inactive'
}

export interface ISubscriptions extends Document{
    _id?:ObjectId
    userId: ObjectId
    planId : ObjectId
    amountPaid: Decimal128
    expiresAt: Date
    paymentId:ObjectId
    status:IStatusEnum
    paymentMethod: IPaymentMethodEnum
    teamMembers:ObjectId[]
    subscriptionCode:string

}


const subSchema = new Schema<ISubscriptions>({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        index: true
    },

    status:{
        type:String,
        enum:Object.values(IStatusEnum),
        default:IStatusEnum.ACTIVE
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
subscriptionCode:{
type:String,

},
    paymentMethod:{
        type: String,
        enum:Object.values(IPaymentMethodEnum)
    },

    teamMembers:[Schema.Types.ObjectId]
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