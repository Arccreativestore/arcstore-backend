const pool = require("../../config/pgConfig.js");
const authRepo = require("../../repositories/Auth/authRepo.js");
const bcrypt = require('bcrypt')

class authService{

async register(data){
    const {email} = data
    const checkEmail = await authRepo.findEmail(email)
    if(checkEmail)
    {
        return {status: 409, data: {}, message: "email already exist"}
    }
    console.log

    const newPassword = await bcrypt.hash(data.password, 12)
    data.password = newPassword
    const newAccount = await authRepo.newAccount(data)

    if(!newAccount)
    {
        return {status: 500, data: {}, message: "error creating account"}
    }
    return {status: 201, data: {newAccount}, message: "Account created successfully"}


}
}

module.exports = new authService()