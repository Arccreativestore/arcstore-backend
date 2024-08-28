const loginController = require("../controllers/auth/loginController")


const router = require('express').Router()


router.post('/', loginController)




module.exports = router