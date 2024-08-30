const { ConflictError, NotFoundError, UnauthorizedError, BadreqError} = require("../../../utils/errors.js")
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const verifyMailController = require('../../controllers/auth/verifyMailController')
const { body, validationResult, param } = require("express-validator");
const validateRequestBody = [
 
    
    param('token').isJWT().withMessage('invalid link, please request a new link to verify'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          
            const arr = errors.errors.map((msg)=> msg.msg)
            console.log(arr)
           return next(new BadreqError(arr))
        }
        next();
    }
];
router.get('/:token', validateRequestBody, verifyMailController)




module.exports = router