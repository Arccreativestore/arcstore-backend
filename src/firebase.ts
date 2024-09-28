import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
const serviceAccount = process.env.FIREBASE_CONFIG

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export default admin