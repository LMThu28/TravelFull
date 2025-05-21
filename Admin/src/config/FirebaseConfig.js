// Import the functions you need from the SDKs you need
// JavaScript
// src.firebase.js
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSSPBo1xMEqjPlsmscoXvAPat2rNR1s-M",
  authDomain: "zalo-app-66612.firebaseapp.com",
  databaseURL: "https://zalo-app-66612-default-rtdb.firebaseio.com",
  projectId: "zalo-app-66612",
  storageBucket: "zalo-app-66612.appspot.com",
  messagingSenderId: "1075698897426",
  appId: "1:1075698897426:web:4e8536e451ed77a0767ecb",
  measurementId: "G-3C42XLGJ3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

export default app;
