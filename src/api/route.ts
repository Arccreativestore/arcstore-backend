import express, {NextFunction, Request, Response} from "express";
import passport from 'passport'
const router = express.Router()
import GeneralController from "../helpers/generalController";

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get("/auth/google/callback",  
    passport.authenticate('google', { failureRedirect: '/auth/google', session: false }),
    new GeneralController().oAuthCallback
)
export default router;