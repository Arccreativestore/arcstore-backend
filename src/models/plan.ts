import {Schema, Document, model, PaginateModel, Model, ObjectId} from 'mongoose';
import { Decimal128 } from 'mongodb';
export enum  IUnitType {
    month= 'monthly',
    year= 'yearly'
}

export enum subPlans {
    Individual = "individual",
    Team = "team",
}

export interface IPlan extends Document {
    type: subPlans
    amount: Decimal128
    disable: boolean
    unit: IUnitType
    duration: number,
    minUsers:number
    baseCurrency:'usd',
    annualCommitment:boolean
    userPerYear:Decimal128
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
            default: subPlans.Individual
        },

        amount: {
            type: Decimal128,
            default:0
        },

        userPerYear:{
            type: Decimal128,
            default:0
        },

        duration: {
            type: Number,
        },
        
        unit: {
            type: String,
            enum:IUnitType
        },
        minUsers: {
            type: Number,
            default:null
        },

        disable: {
            type: Boolean,
            default: false
        },

        baseCurrency:{
            type:String,
            default:"usd"
        },
        annualCommitment:{
            type:Boolean,
            default:false
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


IPlanSchema.index({unit:1, type:1}, {unique:true})
export default function (isTest: boolean = false) {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_plans' : "plans";
   return model<IPlan, IPlanDoc<IPlan>>(collectionName, IPlanSchema, collectionName);

  
}

