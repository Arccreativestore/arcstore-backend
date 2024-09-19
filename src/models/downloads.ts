import { GraphQLError } from "graphql";
import { model, ObjectId, Schema } from "mongoose";

interface Idownloads extends Document {
    assetId: ObjectId
    userId: ObjectId
}

const downloadsSchema  = new Schema<Idownloads>({

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

const downloadsModel = (isTest: boolean = false)=>{
if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")

let collectionName = isTest ? "test_downloads" : "downloads"
return model<Idownloads>(collectionName, downloadsSchema, collectionName)
}


export default downloadsModel