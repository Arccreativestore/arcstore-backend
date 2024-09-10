import Joi from 'joi'

export interface registerResponse {
    status: string
    _id: number,
    email: string,
    username: string,
    role: "USER" | "STAFF" | "CREATOR" | "SUPERADMIN", 
}

export interface IReg {
    email: string,
    username: string,
    password: string
}
export interface Imail
{
    token: string
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
    })
});