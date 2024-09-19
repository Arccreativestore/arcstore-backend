import { GraphQLError } from "graphql"
import { model, ObjectId, Schema } from "mongoose"


interface IFaq extends Document {
    author: ObjectId
    name: string
    question: string
    answer: string
    category: ObjectId[]
    tags: string[]
    helpful: number
    notHelpful: number
    related: ObjectId[]
    status: boolean
    updatedBy: ObjectId
}

const faqSchema = new Schema<IFaq>({

    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        index: true
    },
    name:{
        type: String,
        index: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: [{type: Schema.Types.ObjectId,   ref: 'categories'}],
        index: true
    },
    tags: {
        type: [String]
    },
    helpful: {
        type: Number,
        default: 0
    },
    notHelpful: {
        type: Number,
        default: 0
    },
    related: {
        type: [{type: Schema.Types.ObjectId}],
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        index: true
    },
    status: {
        type: Boolean
    }

},
{
    timestamps: true
})



const faqModel = (isTest: boolean = false)=>{
    if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")
    
    let collectionName = isTest ? "test_faq" : "faq"
    return model<IFaq>(collectionName, faqSchema, collectionName)
}
    
   
export default faqModel