import express from 'express';
import passport from 'passport';
import apiControllers from './controllers/controllers';


const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',  
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    new apiControllers().googleCallback
);

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile'] })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/', session: false }),
    new apiControllers().facebookCallback
);

export default router;