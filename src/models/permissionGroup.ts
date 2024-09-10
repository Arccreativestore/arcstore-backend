import { Document, model, ObjectId, Schema } from 'mongoose';

export interface IPermissionGroup extends Document {
    permissions: ObjectId[];
    title: string;
    disable: boolean;
    description: string;
}

const PermissionSchema = new Schema<IPermissionGroup>({
    permissions: {
        type: [{ type: Schema.Types.ObjectId }],
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    disable: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const __PermissionGroupModel = (isTest: boolean = false) => {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_permission_groups' : 'permission_groups';
    return model<IPermissionGroup>(collectionName, PermissionSchema, collectionName);
};

export default __PermissionGroupModel;
