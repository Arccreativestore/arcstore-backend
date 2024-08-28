const pool = require("../../config/pgConfig");
const userModel = require("../../models/authModel");

class authRepo{


    async findEmail(data)
    {
         const findEmail = await userModel.findOne({where: { email: data}})
         
    }
}
module.exports = new authRepo()