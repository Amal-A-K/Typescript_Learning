import { initializeApp, FirebaseApp } from "firebase/app";
// import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "<YOURAPIKEY>",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "<YOURAUTHDOAMIN>",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "<YOURPROJECTID>",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "<YOURSTORAGEBUCKET>",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "<YOURMESSAGINGSENDERID>",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "<YOURAPPID>",
  measurementId:process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "<YOURMEASUREMENTID>"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
// const analytics: Analytics = getAnalytics(app);
const auth: Auth = getAuth(app);

export { auth };
export default app;