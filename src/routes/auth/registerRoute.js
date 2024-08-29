const registerController = require("../../controllers/auth/registerController.js");
const router = require('express').Router()


router.post('/', registerController)




module.exports = router