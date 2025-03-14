import multer from "multer";
import multerS3 from "multer-s3";
import { DeleteObjectCommand, GetObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME, AWS_HOSTNAME_URL, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "../config/config.js";
import {Readable} from "stream";
import { NextFunction, Response,Request} from 'express'
import Base from "../base";



class FileUploader {
    private bucketName = AWS_BUCKET_NAME as string
    private s3Config: S3ClientConfig;
    private s3: S3Client;
    public upload: multer.Multer;


    constructor() {
        this.s3Config = {
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID as string,
                secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
            },
            endpoint: AWS_HOSTNAME_URL,
            forcePathStyle: true,
        };


        this.s3 = new S3Client(this.s3Config);
        this.upload = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: this.bucketName,
                metadata: function (req: Request, file: Express.Multer.File, cb): void {

                    cb(null, {fieldName: file.fieldname});
                },
                key: function (req: Request, file: Express.Multer.File, cb): void {
 
                    const ext = file.mimetype.split('/').pop()
                    const generatedKey: string = new Base().generateUniqueId()

                    cb(null,`${generatedKey}.${ext}`)
                }
            })
        });


    }

    // Get File Presigned URL , default to 6 days => aws max 7 days.
    public async getFileUrl(key: string, fileExpiryDate: number = 6 * 24 * 60 * 60): Promise<string> {
        const command: GetObjectCommand = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key
        });

        const url: string = await getSignedUrl(this.s3, command, { expiresIn: fileExpiryDate });
        
        return url
    }

    //Uploade multiple files 
    public async handleMultipleUpload(req: any, res: any, next: NextFunction): Promise<void> {
        
        const uploadMultiple = this.upload.fields([
            { name: 'files', maxCount: 6 }, 
            { name: 'thumbnail', maxCount: 1 }
        ]);

        uploadMultiple(req, res, async (err) => {
            if (err) return res.status(400).send(err);

            const files: any[] = req.files as any[];

            if (!files || files.length === 0)  return res.status(400).send('No files uploaded.');
            

            try {
        
                req.uploads = await Promise.all(files.map(async (file) => {
                    return {key: file.key, mimetype: file.mimetype, size:file.size};
                }));
                return next()
            } catch (error) {
                console.error('Error processing files:', error);
                next(error);
            }
        });
    }


    public async handleFileWithThumbnailUpload(req: any, res: any, next: NextFunction): Promise<void> {
        // Expect one file and one thumbnail
        const uploadMultiple = this.upload.fields([
            { name: 'file', maxCount: 1 }, 
            { name: 'thumbnail', maxCount: 1 }
        ]);
    
        uploadMultiple(req, res, async (err) => {
            if (err) return res.status(400).json({ error: err.message });
    
            // Extract file and thumbnail from req.files
            const file = req.files?.['file'] ? req.files['file'][0] : null;
            const thumbnail = req.files?.['thumbnail'] ? req.files['thumbnail'][0] : null;
    
            // Ensure at least the file is present
            if (!file) return res.status(400).json({ message: 'No file uploaded.' });
    
            try {
                req.uploads = {
                    file: { key: file.key, mimetype: file.mimetype, size:file.size },
                    thumbnail: thumbnail 
                        ? { key: thumbnail.key, mimetype: thumbnail.mimetype }
                        : null, // Handle missing thumbnail gracefully
                };
    
                return next();
            } catch (error) {
                console.error('Error processing file and thumbnail:', error);
                next(error);
            }
        });
    }
    

    //Unlink or delete file from from aws
    public async deleteFile(key: string): Promise<void> {
        try {
            const command: DeleteObjectCommand = new DeleteObjectCommand({Bucket: AWS_BUCKET_NAME, Key: key});
            await this.s3.send(command);
        } catch (err) {
            console.error("Error deleting file from S3:", err);
            throw err;
        }
    }


     bufferToReadableStream(buffer: Buffer): Readable {
        return Readable.from(buffer);
    }

}

const fileUploader = new FileUploader();
export const upload = fileUploader.upload;
export const createPresignedUrl = fileUploader.getFileUrl.bind(fileUploader);
export const handleMultipleFileUpload = fileUploader.handleMultipleUpload.bind(fileUploader)
export const handleFileWithThumbnailUpload = fileUploader.handleFileWithThumbnailUpload.bind(fileUploader)

export const deleteFileFromS3 = fileUploader.deleteFile.bind(fileUploader);

