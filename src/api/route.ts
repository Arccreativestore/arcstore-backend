import express, {NextFunction, Request, Response} from "express";
import passport from 'passport'
const router = express.Router()
import GeneralController from "../helpers/generalController";
import {handleMultipleFileUpload, upload} from '../helpers/uploadService'
import { authMiddleware } from "../middleware/authMiddleware";
import CompleteUpload from "../helpers/completeUpload";

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get("/auth/google/callback",  
    passport.authenticate('google', { failureRedirect: '/auth/google', session: false }),
    new GeneralController().oAuthCallback
)





router.get('/asset/:id', authMiddleware, async(req:Request, res:Response, next:NextFunction)=>{
    await new CompleteUpload().createPresignedUrl(req, res)
})

router.post('/asset/upload/single', authMiddleware, upload.single('file'), async(req:Request, res:Response, next:NextFunction)=>{
    await new CompleteUpload().processFileUpload(req, res)
})


router.post('/asset/upload/multiple', authMiddleware, handleMultipleFileUpload, async(req:Request, res:Response, next:NextFunction)=>{
    await new CompleteUpload().processFileUpload(req, res)
})





export default router;