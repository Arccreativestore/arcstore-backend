const userModel = require("../../models/authModel");
const Irepository = require("./Irepository");

class userRepo extends Irepository {

    async find(email) {
        return await userModel.findOne({ where: { email }, attributes: ['id','email', 'password', 'username']})
    }
    async create(data) {
        return await userModel.create(data)
    }
    async updatePassword(hashPassword, email)
    {
        return await userModel.update({ password: hashPassword}, { where: {email: email}})
    }
    async verify(id) {
       
      return await userModel.update(
            { verified: true },
            {
                where: { id: id },
            }
        )
    }
}


module.exports = new userRepo()