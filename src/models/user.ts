import { NextFunction } from "express";
import mongoose, { Schema, ObjectId,model, Document } from "mongoose";
import bcrypt from 'bcrypt'
export type RoleEnum = 'USER' | 'SUPERADMIN'  | 'STAFF' | 'CREATOR';

export interface IAccount extends Document{

    email: string
    verifiedDate: Date
    emailVerified: boolean
    password: string
    role: RoleEnum
    profilePicture: string
    username: string
    permissionGroup?:ObjectId[]
}



const UserSchema: Schema = new Schema<IAccount>({
 
    email : {
    type: String,
    required: true,
    index: true,
    unique: true,
    trim: true
    },

    username: {
        type: String,
        required: true,
        trim: true
    },

    emailVerified: {
        type: Boolean
    },

    role: {
        type: String,
        enum: ['USER', 'SUPERADMIN','CREATOR', 'STAFF'],
        default: 'USER'
    },

    permissionGroup:{
        type:[Schema.Types.ObjectId],
        
    },

    verifiedDate: {
        type: Date
    },

}, { timestamps: true })

export const userModel = model("users", UserSchema)
// HASH PASSWORD
UserSchema.pre<IAccount>('save', async function (next) {
  const user = this; 

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error: any) {
    next(error);
  }
});

// export default function (isTest: boolean = false) {
//     if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
//     const collectionName = isTest ? 'test_accounts' : "accounts";
//     return model<IAccount>(collectionName, UserSchema, collectionName);
// }