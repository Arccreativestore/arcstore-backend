const pool = require("../../config/pgConfig.js");
const authRepo = require("../../repositories/Auth/authRepo.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const verifyEmail = require("../../utils/mailTransporter.js");
const logger = require("../../config/logger.js");
const env = require('dotenv').config()
class authService {

    async register(data) {
        const { username, email } = data
        try {
            const checkEmail = await authRepo.findEmail(email)

            if (checkEmail) {
                return { status: 409, data: {}, message: "email already exist" }
            }

            const newPassword = await bcrypt.hash(data.password, 12)
            data.password = newPassword
            const newAccount = await authRepo.newAccount(data)

            if (!newAccount) {
                return { status: 500, data: {}, message: "error creating account" }
            }

            const payload = {
                id: newAccount.id
            }

            const token = jwt.sign(payload, process.env.ACCESS_SECRETKEY, { expiresIn: '1hr' })
            await verifyEmail(username, token, email)
            return { status: 201, data: { newAccount }, message: "Account created successfully" }

        } catch (error) {
            logger.error(`Registeration Error at the register service: ${error.message}`)
        }
    }

    async login(data) {

        const { email, password } = data

       try {
        
        const checkEmail = await authRepo.findEmail(email)

        if (!checkEmail) {
            return { status: 404, data: {}, message: "email does not exist" }
        }

        const comparePass = await bcrypt.compare(password, checkEmail.password)

        if (comparePass) {

            const payload = {
                id: checkEmail.id
            }
            const accessToken = jwt.sign(payload, process.env.ACCESS_SECRETKEY, { expiresIn: "15m" })
            return { status: 200, data: { accessToken }, message: "user logged in" }
        }
        return { status: 401, data: {}, message: "incorrect password" }

       } catch (error) {
        logger.error(`Login Error at the login service: ${error.message}`)
       }
    }
    async verifyEmail(data)
    {
        const {id}= data
      try {

        const verifyEmail = await authRepo.verify(id)
        if(verifyEmail)
        {
            return {status: 200, data:{verifyEmail}, message: "email verified"}
        }
        return null


      } catch (error) {
        logger.error(`Verify Mail Error at the Verify Mail service: ${error.message}`)
      }
    }
}

module.exports = new authService()