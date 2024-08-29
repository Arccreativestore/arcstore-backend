
const router = require('express').Router()
const passport = require('passport')


router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))




module.exports = router