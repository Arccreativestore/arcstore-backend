import Base from "../base";
import __File, { IFile, IUploadFor } from "../models/files";
import __Asset from '../models/asset'
import { CreateAssetValidation, IAssetValidation } from "../services/asset/validation";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";  
import { IAccount } from "../models/user";
import { createPresignedUrl } from "./uploadService";
import { ErrorHandlers } from "./errorHandler";


export interface FileRes{
    url: string; type: string
}
export interface CustomRequest extends Request{
    user:IAccount,
    uploads:FileRes[]
}
class CompleteUpload {
    private base = new Base();

    async processOtherImages(req: CustomRequest, res: Response) {
        
        try {
            const user = req.user
            const profileFor:IUploadFor = req.body.uploadFor || IUploadFor.Others
            const file:{mimetype:string, key:string} = req.file as any
       
            if(!user && !file){
                    res.status(400).json( { message: "Image not processed", error: true, data: {} })
            }else{
            
                const formattedUploadedFile =  {
                    userId: user._id,
                    type: file.mimetype,
                    key: file.key,
                    uploaded: true,
                    uploadFor:profileFor
                };


            const uploadImage = await __File().create(formattedUploadedFile);
           


            // Response to indicate success
            const response = { message: "Image added successfully", error: false, data: uploadImage };
            res.status(201).json(response);
        }
        } catch (error: any) {
            // Handle errors and send response
            res.status(400).json({ message: error.message || "Unable to add image", error: true });
        }
    }

    async processFileUpload(req: CustomRequest, res: Response) {
        try {
            
            const { user } = req;

          
            const uploads:any = req?.file || req?.uploads
            let body:any = req?.body

            body.tags = JSON.parse(body.tags)

            // Validate the request body

            await CreateAssetValidation({...body,authorId:user._id.toString()});

    
    

            // Normalize uploads to an array (in case it's a single file)
            const uploadArray = Array.isArray(uploads) ? uploads : [uploads];
        
            // Format the uploaded files
            const formattedUploadedFile = uploadArray.map((upload: { key: string; mimetype: string }) => {
                
                return {
                    userId: user._id,
                    type: upload.mimetype,
                    key: upload.key,
                    uploaded: true,
                    uploadFor:IUploadFor.AssetUpload
                };
            });

            // Save uploaded files as assets in the database
            const uploadedAssets: any[] = await __File().insertMany(formattedUploadedFile);
            const uploadedIds: ObjectId[] = uploadedAssets.map((asset) => asset._id);

            // Create a Asset using the uploaded asset IDs
            const created: any = await __Asset().insertMany({
                ...body, 
                uploads: uploadedIds,
                files:uploadedIds,
                authorId: user?._id   
                
            });

            // Response to indicate success
            const response = { message: "File(s) added successfully", error: false, data: created };
            res.status(201).json(response);
        } catch (error: any) {
            // Handle errors and send response
            res.status(400).json({ message: error.message || "Unable to create asset", error: true });
        }
    }


    //Get presigned url
    async getPresignedUrl(req: Request, res: Response){
        const key= req.params.key
       const url = await createPresignedUrl(key as string )
  
        res.redirect(url)
    }

    // Utility to truncate text to a maximum length
    truncateText(text: string, maxLength: number = 30) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength - 3) + '...';
    }

  
}

export default CompleteUpload;
