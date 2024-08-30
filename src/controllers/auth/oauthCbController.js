const logger = require("../../../config/logger");


const oauthCbController = async (req, res, next)=>{
    
        const { user, accessToken } = req.user;

       try {
        res.json({
            message: 'Authentication successful',
            user,
            accessToken
        });
       } catch (error) {
        if (error.isOperational) {
            return next(error) 
        }
        logger.error(`Login Error at the oauthCB controller: ${error.message}`)
        return next(error)
        
       }
}
module.exports = oauthCbController
