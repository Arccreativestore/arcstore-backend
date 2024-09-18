import Joi from "joi";
import { ObjectId } from "mongoose";
import { User } from "../../app";
import { BadreqError } from "../../middleware/errors";


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

export interface IReg {
  email: string;
  firstName: string;
  lastName?: string;
  password?: string | null;
  role: "USER" | "STAFF" | "CREATOR" | "SUPERADMIN";
  profilePicture?: string | null;
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

// Common reusable rules
const emailRule = Joi.string().email().required().messages({
  "string.email": "please enter a valid Email Address",
  "any.required": "Email is required",
});

const passwordRule = Joi.string().min(6).alphanum().required().messages({
  "string.min": "please enter a strong password",
  "any.required": "Password is required",
});

const usernameRule = Joi.string().min(3).required().messages({
  "string.min": "please enter a valid username",
  "any.required": "Username is required",
});

const roleRule = Joi.string()
  .valid("USER", "CREATOR", "SUPERADMIN", "STAFF")
  .required()
  .messages({
    "any.only": "role must be one of [USER, STAFF, CREATOR]",
    "any.required": "role is required",
  });

 const regValidationSchema = Joi.object({
  email: emailRule,
  password: passwordRule,
  firstName: usernameRule,
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
  token: usernameRule
 })
/// IS EMAIL ?
export const isEmail = (data: { email: string }) => {
  const { error } = EmailValidationSchema.validate(data);
  if (error) {
    throw new BadreqError("Please enter a valid Email Address ");
  }
};

// VALIDATE REGISTERATION
export const validateRegistrationInput = (data: IReg): void => {
  const { error } = regValidationSchema.validate(data);
  if (error) {
    throw new BadreqError(error.message);
  }
};

// VALIDATE LOGIN
export const validateLoginInput = (data: {
  email: string;
  password: string;
}): void => {
  const { error } = loginValidationSchema.validate(data);
  if (error) {
    throw new BadreqError(error.message);
  }
};
// validate reset password Route
export const validateresetInput = (data: {
  email: string
  newPassword: string
  token: string
}): void => {
  const { error } = resetPasswordValidateSchema.validate(data);
  if (error) {
    throw new BadreqError(error.message);
  }
};
