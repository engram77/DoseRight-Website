// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0kFcBdg19vkvFpQqV6qtGktizKa3Xyms",
  authDomain: "doseright-39af2.firebaseapp.com",
  databaseURL: "https://doseright-39af2-default-rtdb.firebaseio.com",
  projectId: "doseright-39af2",
  storageBucket: "doseright-39af2.appspot.com",
  messagingSenderId: "818031218712",
  appId: "1:818031218712:web:cfa6c25fb90edef16ff36d"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
