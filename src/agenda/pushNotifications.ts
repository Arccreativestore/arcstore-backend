import admin from "../firebase";
import agenda from "../config/agenda";
import { ObjectId } from "mongoose";
import datasource from "../services/notifications/datasource";

agenda.define('send push notification',  { lockLifetime: 10000, concurrency: 10 }, async (job: any, done) => {
  const { tokensArray, title, body } = job.attrs.data;  

  const message = {
    notification: {
      title,
      body,
    },
    tokens: tokensArray,  
  };

  try {
    await admin.messaging().sendEachForMulticast(message);  
    done();
  } catch (error) {
    console.error('Error sending notification:', error);
    done();
  }
});

  
agenda.define('new assets push notifications',  { lockLifetime: 10000, concurrency: 10 }, async (job:any, done)=>{
  
  
  const getCategories = await new datasource().categoriesWithUploads() as any[]
  if(getCategories.length === 0) return
  const getUserToken = await new datasource().getFcmTokensForCategories(getCategories)

  const message = {
    notification: {
      title: 'New assets Available',
      body: 'We have new assets we think you might like'
    },
    tokens: getUserToken,  
  };


  try {
    await admin.messaging().sendEachForMulticast(message);  
    done();
  } catch (error) {
    console.error('Error sending notification:', error);
    done();
  }
})
  agenda.every('7 days', 'new assets push notifications')  

agenda.define('new asset interaction notification', async(job: any, done)=>{
   
  const { fcmToken, msg } = job.attrs.data;  

  if(!fcmToken) return
  const message = {
    notification: {
      title: 'New asset interaction',
      body: msg
    },
    token: fcmToken,  
  };


  try {
    await admin.messaging().send(message);  
    done();
  } catch (error) {
    console.error('Error sending notification:', error);
    done();
  }

})