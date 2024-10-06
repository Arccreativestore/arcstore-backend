
import jwt from "jsonwebtoken"
import { VERIFYEMAIL_SECRETKEY } from "../../config/config"
export const verifyEmailPayload = (token: string)=>{
   try {
    const payload = jwt.verify(token, VERIFYEMAIL_SECRETKEY as string)
    if (payload) return payload
   } catch (error) {
    throw error
   }

}