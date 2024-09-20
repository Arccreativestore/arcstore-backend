import { GraphQLError } from "graphql"
import { PipelineStage } from "mongoose"
import { Model, model, ObjectId, Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import slugify from "slugify"

interface IFaq extends Document {
    author: ObjectId
    authorName: string
    question: string
    slug: string
    answer: string
    category: ObjectId[]
    tags: string[]
    helpful: number
    notHelpful: number
    related: ObjectId[]
    status: boolean
    updatedBy: ObjectId
}


interface IFaqModel extends Model<IFaq> {
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>;
}

const faqSchema = new Schema<IFaq>({

    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        index: true
    },
    authorName:{
        type: String,
        index: true,
    },
    question: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
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
    timestamps: true,
    versionKey: false,
})

faqSchema.pre('validate', function (next){
    if (this.title) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
})

faqSchema.plugin(mongooseAggregatePaginate)
const faqModel = (isTest: boolean = false)=>{
    if(isTest == undefined || isTest == null) throw new GraphQLError("Environment is invalid")
    
    let collectionName = isTest ? "test_faq" : "faq"
    return model<IFaq, IFaqModel>(collectionName, faqSchema, collectionName)
}
    
   
export default faqModel