// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";
import { OpenAPI } from "@/api/core/OpenAPI";
import { getAccessToken } from "./authToken";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE9dY3Wx_5n4NGisWCcB-ZvW8d83BCFpU",
  authDomain: "approvals-app-85fd1.firebaseapp.com",
  projectId: "approvals-app-85fd1",
  storageBucket: "approvals-app-85fd1.firebasestorage.app",
  messagingSenderId: "468801254357",
  appId: "1:468801254357:web:f2192338167120d304835c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = typeof window !== 'undefined' && 'serviceWorker' in navigator ? getMessaging(app) : null;

export const requestFirebaseNotificationPermission = async () => {
  if (!messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const token = await getToken(messaging, { 
        vapidKey: "BKMF72hneHKoD4eMXu6N7m1Pa6gdR0X-WZZVjEU4Mu7SmWFnVMJf3SWwTHoVr_BJtHbUlGGeyQ-zak_jna0kAYI",
        serviceWorkerRegistration: registration
      });
      
      if (token) {
        // Send token to backend
        await fetch(`${OpenAPI.BASE}/api/v1/User/FCMToken`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            token,
            deviceDetails: navigator.userAgent 
          })
        });
      }
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
    // If Firebase gets stuck due to old project config, clear the indexedDB cache
    if (error instanceof TypeError && error.message.includes('pushManager')) {
      console.log('Clearing Firebase Messaging IndexedDB due to corrupt token state...');
      const req = indexedDB.deleteDatabase('firebase-messaging-database');
      req.onsuccess = () => {
        console.log('Database deleted successfully. Please reload the page.');
      };
    }
  }
};

export const onMessageListener = (callback: (payload: any) => void) => {
  if (messaging) {
    return onMessage(messaging, callback);
  }
  return null;
};

export { messaging };

export const unregisterFirebaseToken = async () => {
  if (messaging) {
    try {
      await deleteToken(messaging);
      console.log("Firebase token deleted on logout.");
    } catch (err) {
      console.error("Unable to delete Firebase token.", err);
    }
  }
};
