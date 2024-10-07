import Joi from "joi";
import { ObjectId } from "mongoose";
import { User } from "../../app";
import { ErrorHandlers } from "../../helpers/errorHandler";
import { PhoneNumber } from "graphql-scalars/typings/mocks";


export interface dbResponse {
  _id: ObjectId;
  email: string;
  verifiedDate: Date;
  emailVerified: boolean;
  password: string;
  role: "USER" | "STAFF" | "CREATOR" | "SUPERADMIN";
  profilePicture: string;
  firstName: string;
  lastName: string;
  permissionGroup?: ObjectId[];
}
export interface registerResponse {
  status: "success";
  _id: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "STAFF" | "CREATOR" | "SUPERADMIN";
}

export interface Generalres{
  status: string
  message: string 
}

export interface IReg {
  email: string;
  firstName: string;
  lastName?: string;
  password?: string 
  profilePicture?: string | null
  role: "USER" 
  emailVerified?: boolean;
  verifiedDate?: Date;
}

export interface IresetPassword {
  user_id: ObjectId;
  email: string;
  sha256Hash: string;
  expiresAt: number;
}
export interface Imail {
  token: string;
}

export interface IUserMutation {
  userRegistration(
    __: unknown,
    { data }: { data: IReg }
  ): Promise<registerResponse>;
}

export interface IVerifyUserMutation {
  verifyAccount(
    _: any,
    args: any,
    { user }: { user: User }
  ): Promise<{ status: string, message: string }>
}

export interface IupdateProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
// Common reusable rules

// Define individual validation rules
const emailRule = Joi.string().email().required().messages({
  'string.email': 'Please enter a valid Email Address',
  'any.required': 'Email is required',
});

const passwordRule = Joi.string().min(6).alphanum().required().messages({
  'string.min': 'Please enter a strong password (minimum 6 alphanumeric characters)',
  'any.required': 'Password is required',
});

const usernameRule = Joi.string().min(3).required().messages({
  'string.min': 'Please enter a valid username (minimum 3 characters)',
  'any.required': 'Username is required',
});

const roleRule = Joi.string()
  .valid('USER')
  .required()
  .messages({
    'any.only': 'Role must be one of [USER, STAFF, CREATOR, SUPERADMIN]',
    'any.required': 'Role is required',
  });

// Define validation schemas
const regValidationSchema = Joi.object({
  email: emailRule,
  password: passwordRule,
  firstName: usernameRule,
  lastName: usernameRule,
  role: roleRule,
});

const loginValidationSchema = Joi.object({
  email: emailRule,
  password: passwordRule,
});

const EmailValidationSchema = Joi.object({
  email: emailRule,
});

const resetPasswordValidateSchema = Joi.object({
  email: emailRule,
  newPassword: passwordRule,
  token: Joi.string().required().messages({
    'any.required': 'Token is required',
  }),
});

const updateProfileSchema = Joi.object({
  email: Joi.string().email()
  .messages({
    'string.email': 'Please enter a valid Email Address',
  }),
  firstName: Joi.string().min(3)
  .messages({
    'string.min': 'Please enter a valid username (minimum 3 characters)',
  }),
  lastName: Joi.string().min(3)
  .messages({
    'string.min': 'Please enter a valid username (minimum 3 characters)',
  }),
  PhoneNumber: Joi.string().min(4).max(15)
  .messages({
    'string.min': 'phone Number cannot be less than 3 digits', 
    'string.max': 'Phone Number should not exceed 15 digits'})
})

const validatePasswordSchema = Joi.object({
  password: passwordRule
})


// Validate Email
export const isEmail = (data: { email: string }) => {
  const { error, value } = EmailValidationSchema.validate(data, {abortEarly: false});
  if (error) {
    throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }
  return value;
};

// Validate Registration
export const validateRegistrationInput = (data: any) => {
  const { error, value } = regValidationSchema.validate(data,{ abortEarly: false });
  if (error) {
    throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  return value;
}
}

// Validate Login
export const validateLoginInput = (data: {email: string; password: string;}) => {
  const { error, value } = loginValidationSchema.validate(data, { abortEarly: false });
  if (error) {
    throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }
  return value;
};

// Validate Reset Password Route
export const validateresetInput = (data: {email: string; newPassword: string;token: string;}) => {
  const { error, value } = resetPasswordValidateSchema.validate(data,{ abortEarly: false });
  if (error) {
    throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }
  return value;
};

export const validateUpdateProfileInput= (data: IupdateProfile)=> {
  const {error, value } = updateProfileSchema.validate(data, {abortEarly: false})
  if (error) {
    throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }
  return value
}

export const validatePassword = (password: string)=>{
  const { error, value } =  validatePasswordSchema.validate({password}, {abortEarly: false})
  if (error) {
    throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }
  return value

}