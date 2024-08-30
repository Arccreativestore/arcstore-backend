const loginController = require("../../controllers/auth/loginController")
const router = require('express').Router()
const { body, validationResult } = require("express-validator");
const validateRequestBody = [
 
    body('email').notEmpty().isEmail().withMessage("Please enter a valid email"),
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

router.post('/', validateRequestBody, loginController)




module.exports = router