const rPasswordModel = require("../../models/resetPassword")


class passwordResetDb{

    async create(data)
    {
        return await rPasswordModel.create(data)
    }
    async findToken(user_email, token)
    {
        return await rPasswordModel.findOne({ where: {user_email, token}, attributes: ['token', 'expiredAt']})
    }
}

module.exports = new passwordResetDb()