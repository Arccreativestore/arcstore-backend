import pkg from 'node-mailjet'
const { Client } = pkg
import {  SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import {  MJ_APIKEY, MJ_SECRETKEY} from '../../config/config'


export async function forgotPasswordMail(name: string, link: string, userEmail: string) {
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
          firstname: name,
          reset_link: link,
        },
       TemplateID: 6291772,
       TemplateLanguage: true,
       Subject: 'RESET YOUR PASSWORD',
       
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
