import {model, Schema, Document} from "mongoose";

export interface ICountry extends Document {
  name: string
  code: string
  isActive: boolean
}

const countrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim:true
    },
    code: {
      type: String,
      unique: true,
      index: true,
      trim:true
    },
    isActive: {
      type: Boolean,
      default: false,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<ICountry>("countries", countrySchema);

