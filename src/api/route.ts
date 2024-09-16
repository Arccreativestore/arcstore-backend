import express, {NextFunction, Request, Response} from "express";
import passport from 'passport'
const router = express.Router()
import GeneralController from "../helpers/generalController";
import {handleMultipleFileUpload} from '../helpers/uploadService'

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get("/auth/google/callback",  
    passport.authenticate('google', { failureRedirect: '/auth/google', session: false }),
    new GeneralController().oAuthCallback
)




router.get('/asset/upload', handleMultipleFileUpload, async(req:Request, res:Response, next:NextFunction)=>{
    
})
export default router;