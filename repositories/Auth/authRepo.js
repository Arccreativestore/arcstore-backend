const pool = require("../../config/pgConfig.js");
const userepo = require("../Irepo/userepo.js");


class authRepo {


    async findEmail(email) {
        if (!email) {
            console.log('no data passed to repo')
            return null
        }

        const findEmail = await userepo.find(email)

        if (findEmail) {
            return findEmail.dataValues
        }

        return null
    }
    async newAccount(data) {
        const {email, username, password} = data

        if (!email || !username || !password) {
            console.log('no or bad data passed')
            return null
        }



        const newAccount = await userepo.create({email,username, password})

        if (newAccount) {

            delete newAccount.dataValues.password
            return newAccount.dataValues
        }
        return null

    }
}
module.exports = new authRepo()