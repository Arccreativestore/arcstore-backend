const userModel = require("../../models/authModel");
const Irepository = require("./Irepository");

class userRepo extends Irepository{

    async find(email)
    {
        return await userModel.findOne({where: {email: email}})
    }
    async create(data)
    {
        return await userModel.create(data)
    }
}


module.exports = new userRepo()