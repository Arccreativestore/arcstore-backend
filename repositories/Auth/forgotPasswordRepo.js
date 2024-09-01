const logger = require("../../config/logger.js")
const { BadreqError } = require("../../utils/errors.js")
const forgotPasswordDb = require("../Irepo/forgotPasswordDb.js")
const resetPasswordDb = require("../Irepo/forgotPasswordDb.js")
const userDb = require("../Irepo/userDb.js")

class resetPasswordRepo {

    async create(data) {
        try {
            const { user_email, token, expiredAt } = data
            if (!user_email || !token || !expiredAt) {
                return null
            }
            const reset = await resetPasswordDb.create({ user_email, token, expiredAt })
            if (reset) {
                return reset
            }
            return null
        } catch (error) {
            logger.error(`
                create method Error at the forgot password repo: ${error.message}`)
            throw new Error('server error')
        }

    }

    async findtoken(data)
    {
        try {
            
            if (!data) {
                return null
            }
            const { email, token } = data
            const find = await forgotPasswordDb.findToken(email, token)
            if(find)
            {
                return find
            }
            return null
        } catch (error) {
            logger.error(`find token method Error at the forgot password repo: ${error.message}`)
            throw new Error('error updating password')
        }
           

    }
    async updatePassword(data) {

        try {
            if (!data) {
                return null
            }
            const { email, hashPassword } = data
            const newPassword = await userDb.updatePassword(hashPassword, email)
            if (newPassword[0] = 1) {
                return newPassword
            }
            return null
        } catch (error) {
            logger.error(`update password method Error at the forgot password repo: ${error.message}`)
            throw new Error('error updating password')
        }

    }
}
module.exports = new resetPasswordRepo()