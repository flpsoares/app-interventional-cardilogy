import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseAuth from "firebase/auth";

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: "AIzaSyCLvZVvxNOaxV76dzzX98lX7Xhglc2N9GE",
  authDomain: "app-interventional-cardiology.firebaseapp.com",
  projectId: "app-interventional-cardiology",
  storageBucket: "app-interventional-cardiology.appspot.com",
  messagingSenderId: "432097600821",
  appId: "1:432097600821:web:8871fb1ea0ebe7c19ad87c"
}

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
const auth = firebaseAuth.initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export { database, storage, auth }; 

export default app;
