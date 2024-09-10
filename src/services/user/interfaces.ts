import Joi, { string } from 'joi'
import { ObjectId } from 'mongoose'


export interface dbResponse {
    _id: ObjectId
    email: string
    verifiedDate: Date
    emailVerified: boolean
    password: string
    role: "USER" | "STAFF" | "CREATOR" | "SUPERADMIN", 
    profilePicture: string
    username: string
    permissionGroup?:ObjectId[]
}


export interface registerResponse
{
    status: "success", 
    _id: ObjectId, 
    email: string, 
    username: string, 
    role: "USER" | "STAFF" | "CREATOR" | "SUPERADMIN",
}


export interface IReg {
    email: string,
    username: string,
    password?: string | null,
    role:  "USER" | "STAFF" | "CREATOR" | "SUPERADMIN", 
    profilePicture?: string | null,
    verified?: boolean
}

export interface Imail
{
    token: string
}

export interface IUserMutation {
    userRegistration(
      __: unknown,
      { data }: { data: IReg }
    ): Promise<registerResponse>;

}
  
  
export interface IVerifyUserMutation {
    verifyAccount(_: any, args: any, context: { req: Request }): Promise<{ status: string; verify: any }>;
}

export const regValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'please enter a valid Email Address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).alphanum().required().messages({
        'string.min': 'please enter a strong password',
        'any.required': 'Password is required'
    }),
    username: Joi.string().min(3).required().messages({
        'string.min': 'please enter a valid username',
        'any.required': 'Username is required'
    }),
    role: Joi.string().valid('USER', 'CREATOR', 'SUPERADMIN', 'STAFF').required().messages({
        'any.only': 'role must be one of [USER, STAFF, CREATOR]',
        'any.required': 'role is required'
    })
    
});