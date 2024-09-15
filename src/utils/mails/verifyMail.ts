import pkg from 'node-mailjet'
const { Client } = pkg
import {  SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import {  MJ_APIKEY, MJ_SECRETKEY} from '../../config/config'


export async function verifyEmail(userEmail: string, username: string, token: string) {
  try {
    const verificationLink = `http://localhost:3000/api/v1/verify/?token=${token}`
   
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
          firstname: username,
          verification_link: verificationLink,
        },
       TemplateID: 6291738,
       TemplateLanguage: true,
       Subject: 'VERIFY YOUR EMAIL',
       
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


