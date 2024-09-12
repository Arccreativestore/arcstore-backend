import express, {NextFunction, Request, Response} from "express";
import passport from 'passport'
import apiControllers from "./controllers/controllers";
const router = express.Router()


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get("/auth/google/callback",  
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    new apiControllers().oAuthCallback
)
export default router;