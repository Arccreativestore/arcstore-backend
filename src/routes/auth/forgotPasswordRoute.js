const router = require('express').Router()
const { BadreqError } = require("../../../utils/errors");
const { body, validationResult } = require("express-validator");
const resetPasswordController = require('../../controllers/auth/forgotPasswordController');
const validateRequestBody = [
 
    body('email').notEmpty().isEmail().withMessage("Please enter a valid email"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          
            const arr = errors.errors.map((msg)=> msg.msg)
            console.log(arr)
           return next( new BadreqError(arr))
        }
        next();
    }
];

router.post('/', validateRequestBody, resetPasswordController)




module.exports = router