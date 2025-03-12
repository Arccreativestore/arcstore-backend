import {Document, Model, model, ObjectId, PaginateModel, Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

export enum IUploadFor {
    UploadPix= 'profile_pix',
    AssetUpload='asset_uploads',
    CoverPix="cover_pix", 
    Others="others"
}


export interface IFile extends Document {
  type: FileFormats
  userId: ObjectId
  uploaded: boolean
  uploadFor:  IUploadFor
  key: string
  url?: string,
  thumbnailUrl?: string
}

export enum FileFormats {
    JPG = "image/jpeg",
    JPEG = "image/jpeg",
    PNG = "image/png",
    GIF = "image/gif",
    SVG = "image/svg+xml",
    WEBP = "image/webp",
    TIFF = "image/tiff",
    TIF = "image/tiff",
    BMP = "image/bmp",
    HEIC = "image/heic",
    HEIF = "image/heif",

    MP4 = "video/mp4",
    MOV = "video/quicktime",
    AVI = "video/x-msvideo",
    WMV = "video/x-ms-wmv",
    MKV = "video/x-matroska",
    FLV = "video/x-flv",
    WEBM = "video/webm",

    MP3 = "audio/mpeg",
    WAV = "audio/wav",
    AAC = "audio/aac",
    FLAC = "audio/flac",
    OGG = "audio/ogg",
    WMA = "audio/x-ms-wma",

    PDF = "application/pdf",
    DOC = "application/msword",
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLS = "application/vnd.ms-excel",
    XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PPT = "application/vnd.ms-powerpoint",
    PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    TXT = "text/plain",
    CSV = "text/csv",
    RTF = "application/rtf",

    OBJ = "model/obj",
    STL = "model/stl",
    FBX = "model/fbx",
    GLTF = "model/gltf+json",
    GLB = "model/gltf-binary",

    PSD = "image/vnd.adobe.photoshop",
    AI = "application/postscript",
    EPS = "application/postscript",
    CDR = "application/x-coreldraw",
    SKETCH = "application/x-sketch",
    FIG = "application/x-figma",

    ZIP = "application/zip",
    RAR = "application/x-rar-compressed",
    SEVEN_Z = "application/x-7z-compressed",
    TAR = "application/x-tar"
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
      enum:Object.values(FileFormats),
      required: true,
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


