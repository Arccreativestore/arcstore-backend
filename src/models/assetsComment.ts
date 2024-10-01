import { number } from "joi";
import { model, Model, ObjectId, PipelineStage, Schema } from "mongoose";


interface Icomment extends Document {
assetId: ObjectId
userId: ObjectId
comment: string
}

interface IcommentModel extends Model<Icomment>{
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>
}

const likesSchema = new Schema<Icomment>({

    assetId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'assets'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    comment: {
        type: String,
        trim: true,
        required: true
    }

},
{
    versionKey: false,
    timestamps: true
})

const commentsModel = (isTest: boolean = false)=>{
    if(isTest == undefined|| isTest == null) throw new Error('Invalid environment');
    let collectionName = isTest ? 'test_assetsComment' : 'assetsComment'
    return model<Icomment, IcommentModel>(collectionName, likesSchema, collectionName)
}

export default commentsModel