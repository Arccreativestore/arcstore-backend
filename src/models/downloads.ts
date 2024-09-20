// models/Download.ts
import { Document, Model, model, ObjectId, PipelineStage, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

interface IDownload extends Document {
    userId: ObjectId;
    assetId: ObjectId;
    downloadedAt: Date;
}

interface IDownloadModel extends Model<IDownload> {
    aggregatePaginate(pipeline: PipelineStage[], options: any): Promise<any>;
}

const DownloadSchema = new Schema<IDownload>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true,
    },
    assetId: {
        type: Schema.Types.ObjectId,
        ref: 'assets',
        required: true,
        index: true,
    },
    downloadedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    versionKey: false,
});

DownloadSchema.plugin(mongooseAggregatePaginate);

const downloadsModel = (isTest: boolean = false) => {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_downloads' : 'downloads';
    return model<IDownload, IDownloadModel>(collectionName, DownloadSchema, collectionName);
};

export default downloadsModel;
