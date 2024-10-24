import express,{Response, Request, NextFunction} from 'express';
import passport from 'passport';
import apiControllers from './controllers/controllers';
import { authMiddleware } from '../middleware/authMiddleware';
import { handleMultipleFileUpload, upload } from '../helpers/uploadService';
import CompleteUpload, { CustomRequest } from '../helpers/completeUpload';


const router = express.Router();



router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * 
 * @description authenticate with google
 * @param {Request} req
 * @param {Response} res 
 * 
 * @response 200 {             
 *   accessToken: string,      // access token
 * }
 * 
 */
router.get('/auth/google/callback',  
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    new apiControllers().googleCallback
);

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile'] })
);
/**
 * 
 * @description authenticate with facebook
 * @param {Request} req
 * @param {Response} res 
 * 
 * @response 200 {             
 *   accessToken: string,  // access token
 * }
 * 
 */
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/', session: false }),
    new apiControllers().facebookCallback
);


/**
 * 
 * @description Creates a presigned URL for accessing an asset
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * 
 * @param {string} req.params.key - The ID of the asset for which to generate the presigned URL (required)
 * @param {number} req.query.exp - The expiration time for the presigned URL in seconds (optional)
 * 
 * @response 302 {
 *   // Redirects to the presigned URL
 * }
 * 
 * @response 200 {
 *   message: string,      // Success message
 *   error: boolean,       // Indicates if there was an error (false for success)
 *   url: string           // The generated presigned URL for the asset
 * }
 * 
 * @response 404 {
 *   message: string,      // Error message indicating asset not found
 *   error: boolean        // Indicates there was an error (true)
 * }
 * 
 * @response 400 {
 *   message: string,      // Error message for invalid request
 *   error: boolean        // Indicates there was an error (true)
 * }
 */
router.get('/asset/:key', authMiddleware, async(req:Request, res:Response, next:NextFunction)=>{
    await new CompleteUpload().getPresignedUrl(req, res)
})

/**
 * @route POST /asset/upload/single
 * @description Upload single assets
 * @access Private
 * 
 * @body {
 *   title: string,        // Title of the asset (required)
 *   description: string,  // Description of the asset (required)
 *   price: number,       // Price of the asset (required)
 *   categoryId: ObjectId, // ID of the category for the asset (required)
 *   tags: string[],  // Tags of the asset (required)
 *  @response 201 {
 *   message: string,      // Success message
 *   error: boolean,       // Indicates if there was an error (false for success)
 *   data: any             // The created asset data
 * }
 * 
 * @response 400 {
 *   message: string,      // Error message
 *   error: boolean        // Indicates there was an error (true)
 * }
 */
router.post('/asset/upload/single', authMiddleware, upload.single('file'), async(req:Request, res:Response, next:NextFunction)=>{
    await new CompleteUpload().processFileUpload(req as CustomRequest, res)
})

/**
 * @route POST /asset/upload/multiple
 * @description Upload multiple assets
 * @access Private

 * @body {
 *   title: string,        // Title of the asset (required)
 *   description: string,  // Description of the asset (required)
 *   price: number,       // Price of the asset (required)
 *   categoryId: ObjectId, // ID of the category for the asset (required)
 *   tags: string[],  // Tags of the asset (required)
 * @response 201 {
 *   message: string,      // Success message
 *   error: boolean,       // Indicates if there was an error (false for success)
 *   data: any             // The created asset data
 * }
 * 
 * @response 400 {
 *   message: string,      // Error message
 *   error: boolean        // Indicates there was an error (true)
 * }
 */


router.post('/asset/upload/multiple', authMiddleware, handleMultipleFileUpload, async(req:Request, res:Response, next:NextFunction)=>{
    await new CompleteUpload().processFileUpload(req as CustomRequest, res)
})


router.post('/image/upload', authMiddleware, upload.single('file'), async(req:Request, res:Response, next:NextFunction)=>{
    await new CompleteUpload().processOtherImages(req as CustomRequest, res)
})


export default router;