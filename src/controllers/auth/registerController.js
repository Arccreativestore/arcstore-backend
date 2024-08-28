const authServices = require("../../../services/Auth/authServices.js");


const registerController = async (req, res)=>{

  const {email, username, password} = req.body
  
  if(!email || !username || !password)
  {
    return res.status(400).json({status: 400, data: {}, message: "Bad request"})
  }
  const register = await authServices.register({email, username, password})
  if(register)
  {
    
    return res.status(register.status).json(register)
  }
 return res.status(500).send('server error')
}

module.exports = registerController