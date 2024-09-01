const transporter = require("../config/nodemailerConfig");

const verifyEmail = async (name,token, email) => {

  try {
    const link= `http://localhost:8080/verify/${token}`
    const sendMail = await transporter.sendMail({

        from: '"ARC-CREATIVES" <arccreatives@gmail.com>', 
        to: email,
        subject: "PLEASE VERIFY YOUR EMAIL ADDRESS",  
        html: `<p>Hi There ${name}</p>
        <p> click the link to verify your email</p>
        <a href = "${link}">Verify email</a>
         <p> Note that this link expires in 1hr </p>`
        
    })
    
    if(sendMail.accepted)
    {
     return true
    }
    else
    {
        return false
    }
  } catch (error) {
    console.log(error.message)
  }
    
}

module.exports = verifyEmail