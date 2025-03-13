import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAyIyTPSiYw_JvlIz9MG7TRqcUZ50RV5g",
  authDomain: "herenow-d005d.firebaseapp.com",
  projectId: "herenow-d005d",
  storageBucket: "herenow-d005d.firebasestorage.app",
  messagingSenderId: "408613288410",
  appId: "1:408613288410:web:2456701f76365831b7e8e3",
  measurementId: "G-95013JRP3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export default db;