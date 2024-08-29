const authServices = require("../../../services/Auth/authServices")



const loginController = async(req,res)=>{
   try {
    const { email, password} = req.body
    if(!email || !password)
    {
        return res.status(400).json({status: 401, data:{}, message: "Bad request"})
    }
    const login = await authServices.login({email, password})
    if(login)
    {
        return res.status(login.status).json(login)
    }
    return res.status(500).json({status: 500, data:{}, message: "server error"})
   } catch (error) {
    console.log(error.message)
   }
}
module.exports = loginController