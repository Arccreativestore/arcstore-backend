const { logger } = require("../../../config/nodemailerConfig")
const authServices = require("../../../services/Auth/authServices")
const jwt = require('jsonwebtoken')


const verifyMailController = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            return res.status(400).json({ status: 401, message: "Bad request" })
        }
        const decode = jwt.verify(token, process.env.ACCESS_SECRETKEY, async(err, user) => {
            if (err) {
                return res.status(401).json({ status: 401, data: {}, message: "link has expired" })
            }

            const email = await authServices.verifyEmail(user)

            if (email) {

                return res.status(email.status).json(email)
            }


        })
      
    } catch (error) {
        logger.error(`verify Mail Error at the verify Mail controller: ${error.message}`)
    }

}
module.exports = verifyMailController