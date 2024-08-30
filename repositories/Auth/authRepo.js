const logger = require("../../config/logger.js");
const pool = require("../../config/pgConfig.js");
const userepo = require("../Irepo/userepo.js");


class authRepo {


    async findEmail(email) {
        try {
            if (!email) {
                console.log('no data passed to repo')
                return null
            }
    
            const findEmail = await userepo.find(email)
    
            if (findEmail) {
                return findEmail.dataValues
            }
    
            return null
        } catch (error) {
            logger.error(`Error at the findEmail authrepo: ${error.message}`)
        }
    }
    async newAccount(data) {
       try {
        const {email, username, password} = data

        const newAccount = await userepo.create(data)

        if (newAccount) {

            delete newAccount.dataValues.password
            delete newAccount.dataValues.createdAt
            delete newAccount.dataValues.updatedAt
            return newAccount.dataValues
        }
        return null
       } catch (error) {
        logger.error(`Error at the newAccount authrepo: ${error.message}`)
       }

    }
    async verify(id)
    {
        try {
            
            const verify = await userepo.verify(id)
        
        if(verify)
        {
            return verify
        }
        } catch (error) {
            logger.error(`Error at the verify authrepo: ${error.message}`)
        }
    }

 
}
module.exports = new authRepo()