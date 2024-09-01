const transporter = require("../config/nodemailerConfig");

const forgotPasswordMail = async (name, link , email) => {

  try {
    
    const sendMail = await transporter.sendMail({

        from: '"ARC-CREATIVES" <arccreatives@gmail.com>', 
        to: email,
        subject: "RESET YOUR PASSWORD",  
        html: `<p>Hi There ${name}</p>
        <p> click the link to reset your password</p>
        <a href = "${link}">Rest Password</a>
         <p> Note that this link expires in 15 minutes </p>`
        
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

module.exports = forgotPasswordMail