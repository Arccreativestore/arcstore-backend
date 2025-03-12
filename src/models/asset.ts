import { Document, Model, model, ObjectId, PipelineStage, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import slugify from 'slugify';


export enum LicenseType {
    Regular='regular',
    Extended="extended"
}

export interface IRating{
    count: number;
    total: number;
}
export enum IStatus {
    Pending='pending',
    Approved='approved',
    Declined='declined'
}
export interface IAsset extends Document {
    title: string;
    slug: string;
    description: string;
    price: number;
    authorId: ObjectId;
    categoryId: ObjectId;
    tags: string[];
    views: number;
    downloads: number;
    ratings:IRating
    licenseType: LicenseType
    files:ObjectId[]
    deleted:boolean
    published:boolean
    status:IStatus
    reviewedBy:ObjectId
    reviewedAt:Date
    color: string
    size: string
    fileFormat: string
}
interface IAssetModel extends Model<IAsset> {
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>;
}
const AssetSchema = new Schema<IAsset>({
    title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref:"users",
        required: true,
        index: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref:'categories',
        required: true,
        index: true,
    },
    tags: {
        type: [{ type: String }],
        required: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    downloads: {
        type: Number,
        default: 0,
    },

    files:{
        ref:"files",
        type:[Schema.Types.ObjectId]
    }, 

    ratings: {
        count: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    licenseType: {
        type: String,
        enum: Object.values(LicenseType),
        default:LicenseType.Regular,
        required: true,
    },
    deleted: {
        type: Boolean,
        required: true,
        default:false
    },

    published: {
        type: Boolean,
        required: true,
        default:false,
    },
    status:{
        type:String,
        enum:Object.values(IStatus),
        default:IStatus.Pending,
    },
    reviewedBy:{
        type: Schema.Types.ObjectId,
        ref:"users"
    },
    
    reviewedAt:{
        type:Date
    },
    color: {
        type: String,
        required: false
    },
    size: {
        type: String,
        required: false
    },
    fileFormat: {
        type: String,
        required: true  // 
    }
}, {
    timestamps: true,
    versionKey: false,
});

AssetSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
});

AssetSchema.plugin(mongooseAggregatePaginate);
const AssetModel = (isTest: boolean = false) => {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_assets' : 'assets';
    return model<IAsset, IAssetModel>(collectionName, AssetSchema, collectionName);
};

export default AssetModel;
