import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "./arc-store-push-notifications-firebase-adminsdk-llfe8-364d3c57fd.json" 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export default admin