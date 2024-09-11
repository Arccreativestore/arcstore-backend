import { NextFunction } from "express";
import mongoose, { Schema, ObjectId, model, Document } from "mongoose";
import bcrypt from "bcrypt";
export type RoleEnum = "USER" | "SUPERADMIN" | "STAFF" | "CREATOR";

export interface IAccount extends Document {
  email: string;
  verifiedDate: Date;
  emailVerified: boolean;
  password: string;
  role: RoleEnum;
  profilePicture: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  permissionGroup?: ObjectId[];
  permissions?: string[];
}

const UserSchema: Schema = new Schema<IAccount>(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["USER", "SUPERADMIN", "CREATOR", "STAFF"],
      default: "USER",
    },
    phoneNumber:
    {
      type: Number
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    permissionGroup: {
      type: [Schema.Types.ObjectId],
    },
    verifiedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);
// Pre-save middleware to hash password

UserSchema.pre<IAccount>("save", async function (next) {
  const user = this;

  // If the password hasn't been modified, skip hashing
  if (!user.isModified("password")) return next();

  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);

    // Replace the plain password with the hashed one
    user.password = hash;

    next();
  } catch (error) {
    next(error);
  }
});


export const userModel = (isTest: boolean = true) => {
  if (isTest == undefined || isTest == null) {
    throw new Error("environment is not valid");
  }
  const collectionName = isTest ? "test_users" : "users";
  return model<IAccount>(collectionName, UserSchema, collectionName);
};
