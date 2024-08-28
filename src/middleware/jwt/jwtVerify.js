
const jwt = require('jsonwebtoken')

const jwtVerify = async (req, res, next) => {

    const header = req.headers.authorization
    if (!header) {
        return res.status(400).json({ status: 401, data: {}, message: "Authorization headers missing" })
    }
    const token = header.split(" ")[1]
    if (!token) {
        return res.status(400).json({ status: 401, data: {}, message: "token is missing in header" })
    }
    jwt.verify(token, process.env.ACCESS_SECRETKEY, (err, user) => {
        if (err) {
            return res.status(401).json({ status: 401, data: {}, message: "token is invalid" })
        }
        req.user = user
        next()
    })

}
module.exports = jwtVerify