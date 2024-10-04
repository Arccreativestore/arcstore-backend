import { number } from "joi";
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
        ref: 'assets'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'users'
    },
},
{
    versionKey: false,
    timestamps: true
})

const likesModel = (isTest: boolean = false)=>{
    if(isTest == undefined|| isTest == null) throw new Error('Invalid environment');
    let collectionName = isTest ? 'test_assetLikes' : 'assetLikes'
    return model<Ilikes, IlikesModel>(collectionName, likesSchema, collectionName)
}

export default likesModel