const authRepo = require("../../repositories/Auth/authRepo")
const { BadreqError, NotFoundError } = require("../../utils/errors")
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const resetPasswordRepo = require("../../repositories/Auth/forgotPasswordRepo")
const logger = require("../../config/logger")
const forgotPasswordMail = require("../../utils/forgotPasswordMail")
const forgotPasswordRepo = require("../../repositories/Auth/forgotPasswordRepo")

class ResetPasswordService {

    async forgotPassword(data) {
        try {
            
            if (!data) {
                throw new BadreqError('email field is missing')
            }
            const { email } = data
           
            const findEmail = await authRepo.findEmail(email) 
       
            if(!findEmail)
            {
                   throw new NotFoundError('No Account found with that email')
            }
            
            const username = findEmail.username
            const generateRandom = crypto.randomBytes(32).toString('hex')
            const token = await bcrypt.hash(generateRandom, 12)
            const expiredAt = new Date(Date.now() + 900000)

            const reset = await resetPasswordRepo.create({ user_email: email, token, expiredAt })
            if(!reset)
            {
                throw new Error('error reseting email, please try again later')
            }
            const link = `http://localhost:8080/reset-password?token=${token}&email=${email}`

            const sendMail = await forgotPasswordMail(username, link, email)     // will most likely change 
           
            if(!sendMail)
            {
                 throw new Error('Error sending Email')
            }
            return { status: "success", data:{}, message: "Please check your email and follow the steps to reset your password", statusCode: 200}

        } catch (error) {
            if (error.isOperational) {
                throw error
            }
            logger.error(`forgot password service Error at the forgot password service: ${error.message}`)
            throw new Error('server error')
        
        }
    }

    
    async resetPassword(data){
           
        try {
            if(!data)
                {
                    throw new BadreqError('required fields are missing')
                }

                const {NewPassword, token, email} = data

                const findUser = await authRepo.findEmail(email)
                if(!findUser)
                {
                    throw new NotFoundError('user does not exist')
                }

                const findToken = await forgotPasswordRepo.findtoken({token, email})
               
                if(!findToken)
                {
                    throw new NotFoundError('token does not exist')
                }
            
                const expiredAt = findToken.expiredAt
                
                if(expiredAt < Date.now())
                {
                    throw new BadreqError('link has expired please request a new link')
                }

                const hashPassword = await bcrypt.hash(NewPassword, 12)
                const newPassword = await forgotPasswordRepo.updatePassword({ hashPassword, email })

                if(!newPassword)
                {
                    throw new Error('Error changing password')
                }
               
                return { status: "success", data: {}, message: "password changed successfully", statusCode: 200}


        } catch (error) {
            if (error.isOperational) {
                throw error
            }
            logger.error(`reset password service Error at the forgot password service: ${error.message}`)
            throw new Error('server error')
        }
    }
}

module.exports = new ResetPasswordService()
