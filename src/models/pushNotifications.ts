import { GraphQLError } from "graphql"
import { Model, model, Mongoose, PipelineStage, Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


interface Inotificaton extends Document {
    title: string
    message: string
    forwardedTo: Array<string>
}

interface IFaqModel extends Model<Inotificaton> {
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>;
}

const notichema = new Schema<Inotificaton>({
    title: {
        type: String,
        trim: true,
        required: true
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
    forwardedTo: [{type: Schema.Types.ObjectId, ref: 'users'}]
}, {
    timestamps: true,
    versionKey: false,
})

notichema.plugin(mongooseAggregatePaginate)
const pushNotificationModel = (isTest: boolean = false)=>{
    if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")
    
        let collectionName = isTest ? "test_pushNotifications" : "pushNotifications"
        return model<Inotificaton, IFaqModel>(collectionName, notichema, collectionName)
}

export default pushNotificationModel
