import sendpulse from "sendpulse-api";
import { SENDPULSE_ID, SENDPULSE_SECRETKEY } from "../../config/config";
import { logger } from "../../config/logger";

const TOKEN_STORAGE = "/tmp/";

export async function verifyEmail(userEmail: string, name: string) {
  sendpulse.init(SENDPULSE_ID, SENDPULSE_SECRETKEY, TOKEN_STORAGE, function (token: any) {
    if (token && token.is_error) {
      logger.error("SendPulse Token Error:", token);
      return;
    }

   // console.log("Your token:", token);

    const emailData = {
      subject: "🎉 Welcome to Wooky – Your Creative Journey Starts Now!",
      from: {
        name: "Wooky",
        email: "info@arccreatives.store",
      },
      to: [
        {
          email: userEmail,
          name: name,
        },
      ],
      template: {
        id: 208909, 
        variables: {
          name: name,
          code: "123456",
        },
      },
    };

    sendpulse.smtpSendMail((response: any) => {
      console.log("SendPulse Response:", response);
      logger.info("Email sent response: ", response);
    }, emailData);
  });
}
