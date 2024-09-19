import { GraphQLError } from "graphql";
import { model, ObjectId, Schema } from "mongoose";

interface Isaved extends Document {
    assetId: ObjectId
    userId: ObjectId
}

const savedAssetsSchema  = new Schema<Isaved>({

    assetId: {
        type: Schema.Types.ObjectId,
        ref: 'assets'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
},
{
    timestamps: true
})

const savedAssetsModel = (isTest: boolean = false)=>{
if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")

let collectionName = isTest ? "test_savedAssets" : "savedAssets"
return model<Isaved>(collectionName, savedAssetsSchema, collectionName)
}

export default savedAssetsModel