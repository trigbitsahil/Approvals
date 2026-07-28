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
  console.log("[FCM] requestFirebaseNotificationPermission triggered...");
  if (!messaging) {
    console.warn("[FCM] Firebase messaging is NOT supported or initialized on this device.");
    return;
  }

  try {
    let permission = Notification.permission;
    
    // On iOS Safari, calling requestPermission without a user gesture throws or silently breaks PushManager!
    // Only request it if it's not already granted.
    if (permission !== "granted") {
      permission = await Notification.requestPermission();
    }
    
    console.log("[FCM] Notification permission state:", permission);

    if (permission === "granted") {
      // Prevent re-registering the service worker on every app load which breaks iOS Web Push
      let registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      if (!registration) {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log("[FCM] ServiceWorker registered successfully:", registration.scope);
      } else {
        console.log("[FCM] Using existing ServiceWorker registration");
      }

      const token = await getToken(messaging, { 
        vapidKey: "BKMF72hneHKoD4eMXu6N7m1Pa6gdR0X-WZZVjEU4Mu7SmWFnVMJf3SWwTHoVr_BJtHbUlGGeyQ-zak_jna0kAYI",
        serviceWorkerRegistration: registration
      });
      
      if (token) {
        console.log("[FCM] Got FCM token from Firebase:", token.substring(0, 15) + "...");

        const accessToken = getAccessToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        console.log("[FCM] Registering token with backend at:", `${OpenAPI.BASE}/api/v1/User/FCMToken`);
        const response = await fetch(`${OpenAPI.BASE}/api/v1/User/FCMToken`, {
          method: 'POST',
          credentials: 'include',
          headers,
          body: JSON.stringify({ 
            token,
            deviceDetails: navigator.userAgent 
          })
        });

        if (!response.ok) {
          console.error(`[FCM] Backend Token Registration FAILED! Status: ${response.status}`);
        } else {
          console.log("[FCM] Backend Token Registration SUCCESSFUL! Status: 200 OK");
        }
      } else {
        console.warn("[FCM] getToken returned empty or null token!");
      }
    }
  } catch (error) {
    console.error("[FCM] Error in requestFirebaseNotificationPermission:", error);
    if (error instanceof TypeError && error.message.includes('pushManager')) {
      console.log('[FCM] Clearing Firebase Messaging IndexedDB due to corrupt token state...');
      const req = indexedDB.deleteDatabase('firebase-messaging-database');
      req.onsuccess = () => {
        console.log('[FCM] Database deleted successfully. Please reload the page.');
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
