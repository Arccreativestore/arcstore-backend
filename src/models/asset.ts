import { Document, model, ObjectId, Schema } from 'mongoose';
import slugify from 'slugify';


export enum LicenseType {
    Regular='regular',
    Extended="extended"
}

export interface IRating{
    count: number;
    total: number;
}

export interface IAsset extends Document {
    title: string;
    slug: string;
    description: string;
    price: number;
    author: ObjectId;
    category: ObjectId;
    tags: string[];
    views: number;
    downloads: number;
    ratings:IRating
    licenseType: LicenseType
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
        required: true,
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
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    category: {
        type: Schema.Types.ObjectId,
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

const AssetModel = (isTest: boolean = false) => {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_assets' : 'assets';
    return model<IAsset>(collectionName, AssetSchema, collectionName);
};

export default AssetModel;
