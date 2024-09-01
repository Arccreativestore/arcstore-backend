const logger = require("../../../config/logger.js");
const resetPasswordService = require("../../../services/Auth/forgotPasswordService.js");
const { ConflictError, NotFoundError, UnauthorizedError, BadreqError } = require("../../../utils/errors.js")


const resetPasswordController = async (req, res, next) => {

   try {
    
    const { NewPassword, token, email } = req.body || {}

    if(!NewPassword || !token || !email)
    {
        throw new BadreqError('required fields are missing')
    }

    const resetpassword = await resetPasswordService.resetPassword({NewPassword, token, email})
    return res.status(resetpassword.statusCode).json(resetpassword)
   
} catch (error) {
    if (error.isOperational) {
        return next(error) 
      }
      logger.error(`reset Password Error at the reset password Controller: ${error.message}`)
      return next(error)
   }
}

module.exports = resetPasswordController