import mongoose, { Schema, Document, ObjectId, model } from "mongoose";

export type AvailableForHireEnum = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "REMOTE";

export interface ILocation {
  country: string;
  state: string;
  city: string;
}

export interface IWork extends Document {
  userId: ObjectId;
  companyName: string;
  position: string;
  externalUrl: string;
  phoneNumber: string;
  location: ILocation;
  about: string;
  skills: string[];
  roleType: AvailableForHireEnum;
}
const LocationSchema: Schema = new Schema<ILocation>(
    {
      country: { type: String, required: true },
      state: { type: String },
      city: { type: String },
    },
    { _id: false }
  );
  
  const WorkSchema: Schema = new Schema<IWork>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },
      companyName: {
        type: String,
        trim: true,
        minlength: 2,
      },

      position: {
        type: String,
        trim: true,
        minlength: 2,
      },

      externalUrl: {
        type: String,
        trim: true,
      },

      phoneNumber: {
        type: String,
        required: true,
        trim: true,
      },
      
      location: {
        type: LocationSchema,
        required: true,
    
      },
      about: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      skills: {
        type: [String],
        required: true,
    
      },
      roleType: {
        type: String,
        enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "REMOTE"],
        required: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  
   const workModel = (isTest: boolean = false) => {
    if (isTest === undefined || isTest === null) {
      throw new Error("Environment is not valid");
    }
    const collectionName = isTest ? "test_work" : "works";
    return model<IWork>(collectionName, WorkSchema, collectionName);
  };
  export default workModel