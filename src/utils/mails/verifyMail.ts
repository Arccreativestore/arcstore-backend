import { logger } from "../../config/logger";
import { transporter } from "../../config/nodeMailerConfig";



export const verifyEmail = async (name : string,token : string, email: string): Promise<boolean> => {

  try {
    const link= `http://localhost:3000/verify/${token}`//for dev
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
  } catch (err) {
    const error = err as Error
    logger.error(error.message)
    return false
  }
    
}

