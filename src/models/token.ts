import { model, ObjectId, Schema } from "mongoose"


interface Itoken extends Document{
tokenId: string
user_id: ObjectId
used: boolean
expiresAt: Date
}

const tokenSchema = new Schema<Itoken>({
    tokenId: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    expiresAt :{
        type: Date,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false,
})

export const tokenModel = (isTest: boolean = false)=>{
    let collectionName;
    if (isTest == undefined || isTest == null) {
        throw new Error("environment is not valid");
      }

    if(isTest)
    {
       collectionName = "test_refreshtoken"
    }
    collectionName = "refreshToken"
    return model<Itoken>(collectionName, tokenSchema, collectionName)
}