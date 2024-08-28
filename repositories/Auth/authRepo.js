const pool = require("../../config/pgConfig.js");
const userModel = require("../../models/authModel.js");

class authRepo {


    async findEmail(data) {
        if (!data) {
            console.log('no data passed to repo')
        }
        const findEmail = await userModel.findOne({ where: { email: data } })
        if (findEmail) {
            return true
        }
        return false
    }
    async newAccount(data) {
        if (!data) {
            console.log('no data passed to repo')
        }
        const { email, username, password } = data
        const newAccount = await userModel.create({
            email,
            username,
            password
        })
        if (newAccount) {
            delete newAccount.dataValues.password
            // console.log(newAccount.dataValues)
            return newAccount.dataValues

        }
        return {}

    }
}
module.exports = new authRepo()