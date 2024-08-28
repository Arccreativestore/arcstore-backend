const pool = require("../../config/pgConfig");
const authRepo = require("../../repositories/Auth/authRepo");
const bcrypt = require('bcrypt')

class authService{

async register(data){
    const {username, email, password} = data
    const checkEmail = await authRepo.findEmail(email)
    if(register)
    {
        return {status: 409, data: {}, message: "email already exist"}
    }
    const newPassword = await bcrypt.hash(password, 12)
    const newAccount = await authRepo.newAccount(data)

    if(!newAccount)
    {
        return {status: 500, data: {}, message: "error creating account"}
    }
    return {status: 201, data: {newAccount}, message: "Account created successfully"}


}
}

module.exports = new authService()