// src/firebase.js
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

// Firebase config → buraya Realtime Database URL’ini de ekle
const firebaseConfig = {
  apiKey: "AIzaSyD2-GMYcIUsRMXWiQwrITYFCgBK4JJD2Lg",
  authDomain: "vocabshare-9d64a.firebaseapp.com",
  databaseURL: "https://vocabshare-9d64a-default-rtdb.firebaseio.com",
  projectId: "vocabshare-9d64a",
  storageBucket: "vocabshare-9d64a.firebasestorage.app",
  messagingSenderId: "479290224430",
  appId: "1:479290224430:web:e7b73124a8cb68ca2214bf",
  measurementId: "G-C4JZ0H4KFY"
}

// Firebase başlat
const app = initializeApp(firebaseConfig)

// Realtime Database export
export const db = getDatabase(app)
