import {Document, Model, model, ObjectId, PaginateModel, Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

export enum IUploadFor {
    UploadPix= 'profile_pix',
    AssetUpload='asset_uploads',
    CoverPix="cover_pix", 
    Others="others"
}


export interface IFile extends Document {
  type: string
  userId: ObjectId
  uploaded: boolean
  uploadFor:  IUploadFor
  key: string
  url?: string,
  thumbnailUrl?: string
}


interface IFileDoc<T extends Document> extends Model<T>, PaginateModel<T> {
}

const fileSchema = new Schema<IFile>({

    key: {
      type: String,
      trim: true
    },

    uploadFor: {
      type: String,
      enum:Object.values(IUploadFor),
      required: true,
      default: IUploadFor.UploadPix
    },

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },

    type: {
      type: String,
      trim: true,
      required: true
    },

    thumbnailUrl: {
      type: String,
    },

    uploaded: {
      type: Boolean,
      default: false
    },

  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {virtuals: true, versionKey: false},
  });

fileSchema.plugin(mongoosePaginate);

export default function (isTest: boolean = false) {
  if (isTest === undefined || isTest === null) throw new Error('Invalid environment')
  const collectionName = isTest ? 'test_files' : "files"
  return model<IFile, IFileDoc<IFile>>(collectionName, fileSchema, collectionName)
}


