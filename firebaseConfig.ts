import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBU3Rq5vArOca0ppzK3stoZ_sdNIcPEKgA",
    authDomain: "herenow-8d697.firebaseapp.com",
    databaseURL: "https://herenow-8d697-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "herenow-8d697",
    storageBucket: "herenow-8d697.firebasestorage.app",
    messagingSenderId: "341807883129",
    appId: "1:341807883129:web:f5b2bc741bf8f57f1fc5a8",
    measurementId: "G-RWFDTY3R31"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export default db;