
const router = require('express').Router()
const passport = require('passport');
const oauthCbController = require('../../controllers/auth/oauthCbController');




router.get('/',
    passport.authenticate('google', { failureRedirect: '/api/v1/register', session: false }),
    oauthCbController
);


module.exports = router