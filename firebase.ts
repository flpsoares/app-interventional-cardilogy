import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseAuth from "firebase/auth";

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: 'AIzaSyBwrGQDe7uN1i8ihuRMjaWnG0mugt1i5zs',
  authDomain: 'interventional-cardiology.firebaseapp.com',
  projectId: 'interventional-cardiology',
  storageBucket: 'interventional-cardiology.appspot.com',
  messagingSenderId: '1060177607346',
  appId: '1:1060177607346:web:859ed113c2a68a7ee867ab',
  measurementId: 'G-H1HCBEZWL4'
}

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
const auth = firebaseAuth.initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export { database, storage, auth }; 

export default app;
