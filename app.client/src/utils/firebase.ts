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
    const permission = await Notification.requestPermission();
    console.log("[FCM] Notification permission state:", permission);

    if (permission !== "granted") {
      console.warn("[FCM] Notification permission not granted.");
      return;
    }

    // ── CRITICAL FIX: Use the ALREADY ACTIVE service worker registration ──
    // Do NOT call navigator.serviceWorker.register() here again.
    // Calling register() every time the app opens creates a new SW context
    // and orphans the old push subscription, breaking background notifications.
    let registration: ServiceWorkerRegistration;
    try {
      // First check if our SW is already registered
      const existingRegs = await navigator.serviceWorker.getRegistrations();
      const existingFCMReg = existingRegs.find(r => r.active?.scriptURL.includes('firebase-messaging-sw.js'));

      if (existingFCMReg) {
        console.log("[FCM] Using existing ServiceWorker registration:", existingFCMReg.scope);
        registration = existingFCMReg;
      } else {
        // Only register if not already registered
        console.log("[FCM] No existing SW found. Registering firebase-messaging-sw.js for the first time...");
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        console.log("[FCM] ServiceWorker registered:", registration.scope);
      }
    } catch (swError) {
      console.error("[FCM] ServiceWorker registration failed:", swError);
      return;
    }

    // Wait for the service worker to be active
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: "BKMF72hneHKoD4eMXu6N7m1Pa6gdR0X-WZZVjEU4Mu7SmWFnVMJf3SWwTHoVr_BJtHbUlGGeyQ-zak_jna0kAYI",
      serviceWorkerRegistration: registration
    });

    if (!token) {
      console.warn("[FCM] getToken returned empty or null token!");
      return;
    }

    console.log("[FCM] Got FCM token from Firebase:", token.substring(0, 20) + "...");

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
      // Do NOT set fcmTokenRegistered=true so it retries next mount
      return;
    }

    console.log("[FCM] Backend Token Registration SUCCESSFUL! Status: 200 OK");

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
      // Get current token BEFORE deleting so we can call backend
      let currentToken: string | null = null;
      try {
        // Try to get the existing SW registration to grab the current token
        const existingRegs = await navigator.serviceWorker.getRegistrations();
        const fcmReg = existingRegs.find(r => r.active?.scriptURL.includes('firebase-messaging-sw.js'));
        if (fcmReg) {
          currentToken = await getToken(messaging, {
            vapidKey: "BKMF72hneHKoD4eMXu6N7m1Pa6gdR0X-WZZVjEU4Mu7SmWFnVMJf3SWwTHoVr_BJtHbUlGGeyQ-zak_jna0kAYI",
            serviceWorkerRegistration: fcmReg
          });
        }
      } catch {
        // Ignore - token may already be gone
      }

      // Delete from Firebase (browser-side)
      await deleteToken(messaging);
      console.log("[FCM] Firebase token deleted on logout.");

      // Delete from backend database
      if (currentToken) {
        try {
          const { OpenAPI } = await import("@/api/core/OpenAPI");
          const res = await fetch(`${OpenAPI.BASE}/api/v1/User/FCMToken?token=${encodeURIComponent(currentToken)}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (res.ok) {
            console.log("[FCM] Token deleted from backend database.");
          } else {
            console.warn("[FCM] Backend token delete returned status:", res.status);
          }
        } catch (backendErr) {
          console.error("[FCM] Failed to delete token from backend:", backendErr);
        }
      }
    } catch (err) {
      console.error("[FCM] Unable to delete Firebase token.", err);
    }
  }
};
