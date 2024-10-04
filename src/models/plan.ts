import {Schema, Document, model, PaginateModel, Model, ObjectId} from 'mongoose';
import { Decimal128 } from 'mongodb';
export enum  IUnitType {
    month= 'month',
    year= 'year'
}

export enum subPlans {
    freemium = "freemium",
    premium = "premium",
}

export interface IPlan extends Document {
    type: subPlans
    amount: Decimal128
    discount: number
    disable: boolean
    unit: IUnitType
    duration: number,
    updatedAt?:Date
    createdAt?:Date
    features:[ObjectId]
}


interface IPlanDoc<T extends Document> extends Model<T>, PaginateModel<T> {
}

const IPlanSchema: Schema = new Schema<IPlan>({

        type: {
            type: String,
            enum: Object.values(subPlans),
            default: subPlans.premium
        },

        amount: {
            type: Decimal128,
            default:0
        },

        discount: {
            type: Number,
            max: 1,
            min: 0,
        },

        duration: {
            type: Number,
        },
        
        unit: {
            type: String,
            enum:IUnitType
        },

        disable: {
            type: Boolean,
            default: false
        },
        
        features:{
            type:[Schema.Types.ObjectId]
        }
    },
    {
        versionKey: false,
        timestamps: true,
        toObject: {
            virtuals: true,
        },
        toJSON: { virtuals: true, versionKey: false },
    }
);

export default function (isTest: boolean = false) {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_plans' : "plans";
   return model<IPlan, IPlanDoc<IPlan>>(collectionName, IPlanSchema, collectionName);

  
}

