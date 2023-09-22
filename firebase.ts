import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseAuth from "firebase/auth";

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: "AIzaSyBMWdELBTqHGN32d88Sc6cx2xgmBZ1mHd4",
  authDomain: "interventional-cardiolog-ba8d6.firebaseapp.com",
  projectId: "interventional-cardiolog-ba8d6",
  storageBucket: "interventional-cardiolog-ba8d6.appspot.com",
  messagingSenderId: "136069687954",
  appId: "1:136069687954:web:bced094b00fce828c8944b"
}

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
const auth = firebaseAuth.initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export { database, storage, auth }; 

export default app;
