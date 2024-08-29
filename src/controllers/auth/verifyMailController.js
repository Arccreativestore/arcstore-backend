const authServices = require("../../../services/Auth/authServices")
const jwt = require('jsonwebtoken')


const verifyMailController = async (req, res) => {
    const { token } = req.params
    if (!token) {
        return res.status(400).json({ status: 401, message: "Bad request" })
    }
    const decode = jwt.verify(token, process.env.ACCESS_SECRETKEY)
    if (decode) {

        const email = await authServices.verifyEmail(decode)
        console.log(email)
        if (email) {

            return res.status(email.status).json(email)
        }
        return res.status(500).json({ status: 500, data: {}, message: "server error" })
    }
    return res.status(400).json({ status: 400, message: "link has expired" })

}
module.exports = verifyMailController