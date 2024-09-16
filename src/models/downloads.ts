import { GraphQLError } from "graphql";
import { model, ObjectId, Schema } from "mongoose";

interface Idownloads {
    asset__id: ObjectId
    user_id: ObjectId
}

const downloadsSchema  = new Schema<Idownloads>({

    asset__id: {
        type: Schema.Types.ObjectId,
        ref: 'assets'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
},
{
    timestamps: true
})

export const downloadsModel = (isTest: boolean = false)=>{
if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")

let collectionName = isTest ? "downloads" : "test_downloads"
return model<Idownloads>(collectionName, downloadsSchema, collectionName)
}