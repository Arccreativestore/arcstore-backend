import pkg from 'node-mailjet'
const { Client } = pkg
import {  SendEmailV3_1, LibraryResponse } from 'node-mailjet';
const  MJ_APIKEY = "kknknk"
const MJ_SECRETKEY = "ghvhvh"


import sendpulse from "sendpulse-api";
import { SENDPULSE_ID, SENDPULSE_SECRETKEY } from "../../config/config";
import { logger } from "../../config/logger";

const TOKEN_STORAGE = "/tmp/";

export async function ForgotPasswordMail(username: string, otp: string, email: string) {
  sendpulse.init(SENDPULSE_ID, SENDPULSE_SECRETKEY, TOKEN_STORAGE, function (token: any) {
    if (token && token.is_error) {
      logger.error("SendPulse Token Error:", token);
      return;
    }
    console.log(otp)
   // console.log("Your token:", token);

    const emailData = {
      subject: "Here’s Your Password Reset Code",
      from: {
        name: "Wooky",
        email: "info@arccreatives.store",
      },
      to: [
        {
          email: email,
          name: username,
        },
      ],
      template: {
        id: 211783, 
        variables: {
          name: username,
          otp: otp,
        },
      },
    };

    sendpulse.smtpSendMail((response: any) => {
     // console.log("SendPulse Response:", response);
     // logger.info("Email sent response: ", response);
    }, emailData);
  });
}




export async function resetPasswordMail(name: string, userEmail: string) {
  try {
   
   
  const mailjet = new Client({
  apiKey: MJ_APIKEY,
  apiSecret: MJ_SECRETKEY
});
  const data: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: 'contact@arccreatives.store',
          Name: 'Arc Creatives',
        },
        To: [
          {
            Email: userEmail
          },
        ],
        Variables:
        {
          firstname: name
        },
       TemplateID: 6291782,
       TemplateLanguage: true,
       Subject: 'Your Password Has Been Reset',
       
      },
    ],
  };

  const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
          .post('send', { version: 'v3.1' })
          .request(data);

  const { Status } = result.body.Messages[0];
  console.log(result.body.Messages[0])


  } catch (err) {
    console.error('Error sending email:', err.statusCode, err.message);
    console.error(err.response.body);
  }
}
