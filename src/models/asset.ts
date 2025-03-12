import { Document, Model, model, ObjectId, PipelineStage, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import slugify from 'slugify';


export enum LicenseType {
    Free='free',
    Premium="premium"
}
export enum Colors {
    TERRA_COTTA = "#E75F59",
    INDIAN_YELLOW = "#EFA543",
    ROSE_QUARTZ = "#F5C3CC",
    MAIZE_CRAYON = "#F7DC8B",
    MEDIUM_AQUAMARINE = "#75CF9A",
    CORNFLOWER_BLUE = "#9FCCF6",
    BRIGHT_ROYAL_BLUE = "#3672E3",
    PERIWINKLE = "#8080EA",
    GUNMETAL = "#1F262C",
    PURE_WHITE = "#FFFFFF",
    PURE_BLACK = "#000000",
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
    link:string
    deleted:boolean
    color:Colors
    published:boolean
    status:IStatus
    reviewedBy:ObjectId
    reviewedAt:Date
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

    link:{
        type:String,
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
        default:LicenseType.Free,
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

    color:{
        type:String,
        enum:Object.values(Colors),
    },
    reviewedBy:{
        type: Schema.Types.ObjectId,
        ref:"users"
    },

    
    reviewedAt:{
        type:Date
    },
    size: {
        type: String,
        required: false
    },
    fileFormat: {
        type: String,
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
