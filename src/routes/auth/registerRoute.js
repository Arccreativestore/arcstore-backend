const registerController = require("../../controllers/auth/registerController.js");
const router = require('express').Router()
const { ConflictError, NotFoundError, UnauthorizedError, BadreqError} = require("../../../utils/errors.js")
const { body, validationResult } = require("express-validator");
const validateRequestBody = [
 
    body('email').notEmpty().isEmail().withMessage("Please enter a valid email"),
    body('username').notEmpty().isString().withMessage("Please enter a valid username"),
    body('password').isAlphanumeric().notEmpty().withMessage("Please enter a strong password"),

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

router.post('/', validateRequestBody, registerController)




module.exports = router