const { error } = require("winston")
const logger = require("../../../config/logger")
const authServices = require("../../../services/Auth/authServices")
const {BadreqError} = require("../../../utils/errors")


const loginController = async(req,res,next)=>{
   try {
    const { email, password} = req.body
    if(!email || !password)
    {
        return next( new BadreqError('please provide all details for registeration'))
    }
    const login = await authServices.login({email, password})
    if(login)
    {
        return res.status(login.status).json(login)
    }
    throw new Error('error logging in')
   } catch (error) {
    if (error.isOperational) {
        return next(error) 
    }
    logger.error(`Login Error at the login Controller: ${error.message}`)
    return next(error)
    
   }
}
module.exports = loginController