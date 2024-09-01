const pool = require("../../config/pgConfig.js");
const authRepo = require("../../repositories/Auth/authRepo.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const verifyEmail = require("../../utils/verifyAccountMail.js");
const logger = require("../../config/logger.js");
const { ConflictError, NotFoundError, UnauthorizedError } = require("../../utils/errors.js");
const env = require('dotenv').config()

class authService {

    async register(data) {
        const { username, email } = data
        try {
            const checkEmail = await authRepo.findEmail(email)

            if (checkEmail) {
                throw new ConflictError('email already exist')
            }

            const newPassword = await bcrypt.hash(data.password, 12)
            data.password = newPassword
            const newAccount = await authRepo.newAccount(data)

            if (!newAccount) {
                throw new Error('Error creating account')
            }

            const payload = {
                id: newAccount.id
            }

            const token = jwt.sign(payload, process.env.ACCESS_SECRETKEY, { expiresIn: '1hr' }) // might change the expired format
            await verifyEmail(username, token, email) // might change
            return { status: "success", data: { newAccount }, message: "Account created successfully", statusCode: 202 }

        } catch (error) {

            if (error.isOperational) {
                throw error
            }
            logger.error(`Registeration Error at the register service: ${error.message}`)
            throw new Error('server error')
        }
    }

    async login(data) {

        const { email, password } = data

        try {

            const checkEmail = await authRepo.findEmail(email)

            if (!checkEmail) {
                throw new NotFoundError('email does not exist, please create an account first')
            }

            const comparePass = await bcrypt.compare(password, checkEmail.password)

            if (comparePass) {

                const payload = {
                    id: checkEmail.id
                }
                const accessToken = jwt.sign(payload, process.env.ACCESS_SECRETKEY, { expiresIn: "15m" })
                return { status: "success", data: { accessToken }, message: "user logged in", statusCode: 200 }
            }
            throw new UnauthorizedError('password is incorrect')

        } catch (error) {
            if (error.isOperational) {
                throw error
            }
            logger.error(`Login Error at the login service: ${error.message}`)
            throw new Error('server error')
        }
    }
    async verifyEmail(data) {
        const { id } = data
        try {

            const verifyEmail = await authRepo.verify(id)
            if (verifyEmail) {
                return { status: "success", data: { verifyEmail }, message: "email verified", statusCode: 200 }
            }
            return null


        } catch (error) {
            if (error.isOperational) {
                throw error
            }
            logger.error(`verify mail Error at the verify service: ${error.message}`)
            throw new Error('server error')
        }
    }
}

module.exports = new authService()