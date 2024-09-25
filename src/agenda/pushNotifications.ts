import admin from "../firebase";
import agenda from "../config/agenda";

agenda.define('send push notification',  { lockLifetime: 10000, concurrency: 10 }, async (job: any, done) => {
  const { token, title, body } = job.attrs.data;  

  const message = {
    notification: {
      title,
      body,
    },
    token: token,  
  };

  try {
    await admin.messaging().send(message);  
    console.log(`Notification sent to: ${token}`);
    done();
  } catch (error) {
    console.error('Error sending notification:', error);
    done();
  }
});

export const addNotificationJob = (tokensArray: Array<string>, title: string, body: string) => {
    tokensArray.forEach(token => {
     agenda.now('send push notification', {
        token,      
        title,      
        body,       
    })});
};
  