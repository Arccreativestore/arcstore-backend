import { boolean, required } from "joi";
import mongoose, { Document, model, ObjectId, Schema } from "mongoose";

interface IRpassword extends Document
{
    user_id: ObjectId
    email: string
    otp: string
    expiresAt: Date,
    passwordChanged: boolean
}

const resetPasswordSchema = new Schema<IRpassword>({
    user_id:
    {
        type: Schema.Types.ObjectId,
        ref: 'test_users'  // change on prod
    },
    email:
    {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    otp:
    {
        type: String,
        required: true,
    },
    expiresAt:
    {
        type: Date,
        required: true
    },
    passwordChanged:
    {
        type: Boolean,
        default: false
    }
},
{ timestamps: true,
  versionKey: false,})

export const resetPasswordModel = (isTest: boolean = false) =>{

    if(isTest == undefined || isTest == null)
    {
        throw new Error('environment is not valid')
    }
    const collectionName = isTest ? "test_reset_password" : "resetPassword"
    return model<IRpassword>(collectionName, resetPasswordSchema, collectionName)

}