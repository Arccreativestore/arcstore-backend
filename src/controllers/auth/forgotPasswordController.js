const logger = require("../../../config/logger.js");
const forgotPasswordService = require("../../../services/Auth/forgotPasswordService.js");
const { ConflictError, NotFoundError, UnauthorizedError, BadreqError } = require("../../../utils/errors.js")


const forgotPasswordController = async (req, res, next) => {

   try {
    
    const { email } = req.body || {}

    if(!email)
    {
        throw new BadreqError('email field is missing')
    }

    const forgotPassword = await forgotPasswordService.forgotPassword({email})
    return res.status(forgotPassword.statusCode).json(forgotPassword)
   
} catch (error) {
    if (error.isOperational) {
        return next(error) 
      }
      logger.error(`Forgot Password Error at the forgot password Controller: ${error.message}`)
      return next(error)
   }
}

module.exports = forgotPasswordController