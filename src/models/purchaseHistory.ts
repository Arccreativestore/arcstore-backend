import { GraphQLError } from "graphql";
import { DateTypeDefinition } from "graphql-scalars";
import { model, ObjectId, Schema } from "mongoose";


interface Ipurchase extends Document {
    userId: ObjectId
    assetId: Array<ObjectId>
    purchaseDate: Date
    amountPayed: number
    paymentMethod: ObjectId
    currency: string
    status: boolean
}

const purchaseHistorySchema = new Schema<Ipurchase>({
    userId:
    {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    assetId: {
        type: [{type: Schema.Types.ObjectId, ref: 'assets', required: true, index: true}]
    },
    purchaseDate: {
        type: Date,
        default: Date.now()
    },
    amountPayed: {
        type: Number,
        required: true
    },
    currency: {
        type: String
    },
    paymentMethod: {
        type: Schema.Types.ObjectId,
        ref: 'userPaymentMethod'
    },
    status: {
        type: Boolean
    }
},
{
    timestamps: true
})



const purchaseHistoryModel = (isTest: boolean = false)=>{
    if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")
    
    let collectionName = isTest ? "test_purchaseHistory" : "purchaseHistory"
    return model<Ipurchase>(collectionName, purchaseHistorySchema, collectionName)
    }
    
    
    export default purchaseHistoryModel