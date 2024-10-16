import { model, Schema, Types } from "mongoose";

interface I2fa {
    userId: Types.ObjectId
    otp: number
    expiresAt: Date
}

const _2faSchema = new Schema<I2fa>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },

    otp: {
        type: Number,
        required: true
    },
    expiresAt:{
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true,
    versionKey: false
})

const _2faModel = (isTest: boolean = false)=>{
    if(isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_2fa' : '_2fa';
    return model<I2fa>(collectionName, _2faSchema, collectionName)
}

export default _2faModel