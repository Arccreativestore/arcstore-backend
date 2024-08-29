
const router = require('express').Router()
const passport = require('passport');
const oauthCbController = require('../../controllers/auth/oauthCbController');




router.get('/',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    oauthCbController
);


module.exports = router