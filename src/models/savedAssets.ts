import { GraphQLError } from "graphql";
import { Model, model, ObjectId, PipelineStage, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface Isaved extends Document {
    assetId: ObjectId
    userId: ObjectId
    savedAt: Date
}

interface IsavedAssetsModel extends Model<Isaved> {
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>;
}

const savedAssetsSchema  = new Schema<Isaved>({

    assetId: {
        type: Schema.Types.ObjectId,
        ref: 'assets'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    savedAt: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
    versionKey: false,
})

savedAssetsSchema.plugin(mongooseAggregatePaginate);
const savedAssetsModel = (isTest: boolean = false)=>{
if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")

let collectionName = isTest ? "test_savedAssets" : "savedAssets"
return model<Isaved, IsavedAssetsModel>(collectionName, savedAssetsSchema, collectionName)
}

export default savedAssetsModel