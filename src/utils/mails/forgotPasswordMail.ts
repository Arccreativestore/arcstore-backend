import { transporter } from "../../config/nodeMailerConfig"
import { logger } from "../../config/logger"

export const forgotPasswordMail = async (name:string, link:string , email:string) => {

  try {
    
    const sendMail = await transporter.sendMail({

        from: '"ARC-CREATIVES" <arccreatives@gmail.com>', 
        to: email,
        subject: "RESET YOUR PASSWORD",  
        html: `<p>Hi There ${name}</p>
        <p> click the link to reset your password</p>
        <a href = "${link}">Reset Password</a>
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
  } catch (err: any) {
   logger.error(`error at the forgot password mail ${err.message}`)
  }
    
}


export const resetPasswordMail = async ( email:string) => {

  try {
    
    const sendMail = await transporter.sendMail({

        from: '"ARC-CREATIVES" <arccreatives@gmail.com>', 
        to: email,
        subject: "PASSWORD CHANGED!",  
        html: `
        <p> your password has been changed</p>
         <p>if this action was not carried out by you please send a mail to</p>
          <p><a href="mailto:support@arc-creatives.com">support@arc-creatives.com</a></p>
          `
    })

    if(sendMail.accepted)
    {
     return true
    }
    else
    {
        return false
    }
  } catch (err: any) {
   logger.error(`error at the forgot password mail ${err.message}`)
  }
    
}

