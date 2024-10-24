import { model, Model, ObjectId, PipelineStage, Schema } from "mongoose";


interface Ilikes extends Document {
assetId: ObjectId
userId: ObjectId
}

interface IlikesModel extends Model<Ilikes>{
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>
}

const likesSchema = new Schema<Ilikes>({

    assetId: {
        type: Schema.Types.ObjectId,
        required: true,
        index:true,
        ref: 'assets'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index:true,
        ref: 'users'
    },
},
{
    versionKey: false,
    timestamps: true
})
likesSchema.index({userId:1, assetId:1}, {unique:true})
const likesModel = (isTest: boolean = false)=>{
    if(isTest == undefined|| isTest == null) throw new Error('Invalid environment');
    let collectionName = isTest ? 'test_asset_likes' : 'asset_likes'
    return model<Ilikes, IlikesModel>(collectionName, likesSchema, collectionName)
}

export default likesModel