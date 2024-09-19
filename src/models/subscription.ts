import { model, ObjectId, Schema } from "mongoose";

enum subPlans {
    basic = "BASIC",
    premium = "PREMIUM",
    team = "TEAM"
}
interface Isubscriptions extends Document{
    userId: ObjectId
    plan : subPlans
    amountPayed: number
    duration: Date
    expiresAt: Date
    paymentMethod: ObjectId
    features: Array<Schema.Types.ObjectId>
}

const subSchema = new Schema<Isubscriptions>({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        index: true
    },
    plan: {
        type: String,
        enum: subPlans
    },
    duration: {
        type: Date
    },
    expiresAt: {
        typ: Date
    },
    amountPayed:{
        type: Number
    },
    paymentMethod:{
        type: Schema.Types.ObjectId,
        ref: 'userPaymentMethod'
    },
    features: {
        type: [Schema.Types.ObjectId],
        ref: 'features'
    }
},
{
    timestamps: true
})

const subscriptionsModel = (isTest: boolean = false)=>{
    if (isTest == undefined || isTest == null) {
        throw new Error("environment is not valid");
      }
      const collectionName = isTest ? "test_subscriptions" : "subscriptions";
      return model<Isubscriptions>(collectionName, subSchema, collectionName);
}

export default subscriptionsModel