
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const verifyMailController = require('../../controllers/auth/verifyMailController')

router.get('/:token', verifyMailController)




module.exports = router