
import { logger } from "../../config/logger";
import {
  forgotPasswordMail,
  resetPasswordMail,
} from "../../utils/mails/forgotPasswordMail";
import { verifyEmail } from "../../utils/mails/verifyMail"

import { EventEmitter } from 'events';
export const eventEmitter = new EventEmitter();


  //verify mail event
  eventEmitter.on("newUser", (data: any)=>{
    try {
        const { username, token, email } = data;
        verifyEmail(username, token, email);
      } catch (err) {
        logger.error(`error sending verify mail ${err}`);
        throw new Error("error sending email");
      }
  })

  //forgot password mail event
  eventEmitter.on("forgotPassword", (data: any) => {
   try {
     const { username, link, email } = data;
     forgotPasswordMail(username, link, email);
   } catch (err) {
     logger.error(`error sending forgot password mail ${err}`);
     throw new Error("error sending email");
   }
 });
 // reset alert mail
 eventEmitter.on("resetPassword", (email: string) => {
  try {
     resetPasswordMail(email);
  } catch (err) {
     logger.error(`error sending reset password mail alert ${err}`);
     throw new Error("error sending email");
  }
 });
