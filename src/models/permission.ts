import { Document, Model, model, PipelineStage, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IPermission extends Document {
    method: string
    description: String
    title: string
    disable:boolean
    display:boolean,
    group:string,
}

interface IPermissionModel extends Model<IPermission> {
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>;
}

const PermissionSchema = new Schema<IPermission>({
    method: {
        type: String,
        index:true
    },

    description: {
        type: String,
        required: true,
        index: true,
        lowercase:true
    },


    title: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },

    disable: {
        type: Boolean,
        required: true,
        default:false
    },

    group:{
        type:String,
        trim:true,
        index:true,
        lowercase:true
    },

    display:{
        type:Boolean,
        default:false
    }

}, {
    timestamps: true,
    versionKey: false,

});

PermissionSchema.plugin(mongooseAggregatePaginate);

export default function (isTest: boolean = false) {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_permissions' : "permissions";
    return model<IPermission, IPermissionModel>(collectionName, PermissionSchema, collectionName);

}
