const logger = require("../../../config/logger");


const oauthCbController = async (req, res)=>{
    
        const { user, accessToken } = req.user;

       try {
        res.json({
            message: 'Authentication successful',
            user,
            accessToken
        });
       } catch (error) {
        logger.error(`Registeraton Error at the oauthCB controller: ${error.message}`)
       }
    
}
module.exports = oauthCbController