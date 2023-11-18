import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIMyT0BdwnnZV2u_PgeCqC3HUlfCToZm4",
  authDomain: "arnifitask.firebaseapp.com",
  projectId: "arnifitask",
  storageBucket: "arnifitask.appspot.com",
  messagingSenderId: "729733897661",
  appId: "1:729733897661:web:b388a07287488e4e4346d4",
  measurementId: "G-1G1XWSG86L",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };
