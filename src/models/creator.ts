import { model, Model, ObjectId, PipelineStage, Schema } from "mongoose"



export interface Icreator extends Document {
    userId: ObjectId
    firstName: string
    lastName: string
    country: string
    city: string
    address: string
    postalCode: string
    phoneNumber: string
    disabled: boolean
    isPrivate: boolean
    followers?: ObjectId[]
    followersRequest?: ObjectId[]
}
interface IcreatorModel extends Model<Icreator>{
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>
}

const schema = new Schema<Icreator>({
    userId: {
        type: Schema.Types.ObjectId,
        unique: true,
        ref: 'users'
    },

    firstName: {
        type: String,
        trim: true
    },

    lastName: {
        type: String,
        trim: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    postalCode:{
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    phoneNumber: {
        type: String,
        required: true
    },
    
    isPrivate: {
        type: Boolean,
        default: false
    },
    
    followers: [{type: Schema.Types.ObjectId, ref: 'users'}],
    followersRequest: [{type: Schema.Types.ObjectId, ref: 'users'}],

    disabled: {
        type: Boolean,
        default: false
    }
},{
    versionKey: false,
    timestamps: true
})

const creatorsModel = (isTest: boolean = false)=>{
    if(isTest == undefined|| isTest == null) throw new Error('Invalid environment');
    let collectionName = isTest ? 'test_creators' : 'creators'
    return model<Icreator, IcreatorModel>(collectionName, schema, collectionName)
}

export default creatorsModel