import { Document, Model, model, PipelineStage, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface Ifeautures extends Document {
    method: string
    description: String
    title: string
    disable:boolean
    display:boolean,
    group:string,
}

const FeaturesSchema = new Schema<Ifeautures>({
    method: {
        type: String,
        index:true
    },

    description: {
        type: String,
        required: true,
        index: true,
        lowercase:true
    },


    title: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },

    disable: {
        type: Boolean,
        required: true,
        default:false
    },

    group:{
        type:String,
        trim:true,
        index:true,
        lowercase:true
    },

    display:{
        type:Boolean,
        default:false
    }

}, {
    timestamps: true,
    versionKey: false,

});
const featuresModel =  function (isTest: boolean = false) {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_features' : "Features";
    return model<Ifeautures>(collectionName, FeaturesSchema, collectionName);

}


export default featuresModel