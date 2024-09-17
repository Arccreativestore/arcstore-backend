import { Document, model, Schema } from 'mongoose';
import slugify from 'slugify';  

export interface ICategory extends Document {
    title: string;
    slug: string;
    description: string;
    disable: boolean;
    deleted: boolean; 
}

const CategorySchema = new Schema<ICategory>({
    title: {
        type: String,
        required: true,
        unique: true,
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
    disable: {
        type: Boolean,
        required: true,
        default: false,
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});

CategorySchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
});

const CategoryModel = (isTest: boolean = false) => {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_categories' : 'categories';
    return model<ICategory>(collectionName, CategorySchema, collectionName);
};

export default CategoryModel;
