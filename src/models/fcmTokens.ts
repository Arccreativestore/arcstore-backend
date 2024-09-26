import { GraphQLError } from "graphql"
import { model, ObjectId, Schema } from "mongoose"

interface Ifcm extends Document {
    userId: ObjectId
    fcmToken: string
    preferences: Array<ObjectId>
}

const fcmSchema = new Schema<Ifcm>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'users'
    },
    fcmToken: {
        type: String,
        trim: true,
        unique: true
    },
    preferences: [{type: Schema.Types.ObjectId, ref: 'categories'}]
},
{
    timestamps: true,
    versionKey: false,
})

const fcmModel = (isTest: boolean = false)=>{
    if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")
    
        let collectionName = isTest ? "test_fcmTokens" : "fcmTokens"
        return model<Ifcm>(collectionName, fcmSchema, collectionName)
}

export default fcmModel