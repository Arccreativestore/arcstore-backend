const { logger } = require("../../../config/nodemailerConfig")
const authServices = require("../../../services/Auth/authServices")
const jwt = require('jsonwebtoken')
const { ConflictError, NotFoundError, UnauthorizedError, BadreqError} = require("../../../utils/errors.js")

const verifyMailController = async (req, res, next) => {
    try {
        const { token } = req.params
        if (!token) {
           throw new BadreqError('token is missing or invalid')
        }
        const decode = jwt.verify(token, process.env.ACCESS_SECRETKEY, async(err, user) => {
           try {
            if (err) {
                throw new UnauthorizedError('link is expired, please request a new link')
             }
 
             const email = await authServices.verifyEmail(user)
 
             if (email) {
 
                 return res.status(email.status).json(email)
             }
               throw new Error('error verifying account')
           } catch (error) {
            if (error.isOperational) {
                return next(error) 
              }
              logger.error(`verify mail Error at the verify mail Controller: ${error.message}`)
              return next(error)
           }

        })
      
    } catch (error) {
        if (error.isOperational) {
            return next(error) 
          }
          logger.error(`verify mail Error at the verify mail Controller: ${error.message}`)
          return next(error)
          
    }

}
module.exports = verifyMailController