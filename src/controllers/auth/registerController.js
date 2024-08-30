
const logger = require("../../../config/logger.js");
const authServices = require("../../../services/Auth/authServices.js");
const {BadreqError} = require("../../../utils/errors.js");


const registerController = async (req, res, next)=>{

 try {
  const {email, username, password} = req.body
  
  if(!email || !username || !password)
  {
    
     throw next( new BadreqError('please provide all details for registeration'))
  }
  
  const register = await authServices.register({email, username, password})
  if(register)
  {
  
    return res.status(register.status).json(register)
  }
 return next( new Error('server error'))
 } catch (error) {
  if (error.isOperational) {
    return next(error) 
  }
  logger.error(`Register Error at the register Controller: ${error.message}`)
  return next(error)
      
 }
}

module.exports = registerController

