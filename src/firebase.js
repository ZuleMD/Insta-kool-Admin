import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "insta-kool.firebaseapp.com",
    projectId: "insta-kool",
    storageBucket: "insta-kool.appspot.com",
    messagingSenderId: "560988453952",
    appId: "1:560988453952:web:356157183b4ba6722a33a5",
    measurementId: "G-0Z59EQ2K9R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);