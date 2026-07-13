// firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDM6MN__48RJX7qEogIHLKB0pl9sDR1840",
    authDomain: "mypwaapp-b385b.firebaseapp.com",
    projectId: "mypwaapp-b385b",
    storageBucket: "mypwaapp-b385b.firebasestorage.app",
    messagingSenderId: "388926845795",
    appId: "1:388926845795:web:e9c63694d1af802897d956",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

export { messaging, db };
