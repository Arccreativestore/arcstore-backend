
const oauthCbController = async (req, res)=>{
    
        const { user, accessToken } = req.user;

       try {
        res.json({
            message: 'Authentication successful',
            user,
            accessToken
        });
       } catch (error) {
        console.log(error.message)
       }
    
}
module.exports = oauthCbController