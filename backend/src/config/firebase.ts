import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}
console.log("Firebase Config:", {
  projectId: process.env.FIREBASE_PROJECT_ID ? "PRESENTE" : "FALTANTE",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? "PRESENTE" : "FALTANTE",
  privateKeyPresent: !!process.env.FIREBASE_PRIVATE_KEY,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
export const db = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();
