importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

// ── Force the new service worker to activate immediately ──
// Without this, a new SW version waits until all tabs are closed before taking over.
// skipWaiting() ensures the new SW immediately controls all clients.
self.addEventListener("install", (event) => {
    console.log("[firebase-messaging-sw.js] Service Worker installing...");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[firebase-messaging-sw.js] Service Worker activating...");
    // Take control of all open clients immediately
    event.waitUntil(clients.claim());
});

firebase.initializeApp({
    apiKey: "AIzaSyDE9dY3Wx_5n4NGisWCcB-ZvW8d83BCFpU",
    authDomain: "approvals-app-85fd1.firebaseapp.com",
    projectId: "approvals-app-85fd1",
    storageBucket: "approvals-app-85fd1.firebasestorage.app",
    messagingSenderId: "468801254357",
    appId: "1:468801254357:web:f2192338167120d304835c"
});

const messaging = firebase.messaging();

// ✅ Handles background messages (app closed / in background)
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message", JSON.stringify(payload));
    
    // If the payload already has a notification object, the browser/FCM SDK 
    // will display it automatically. We must NOT call showNotification again here.
    if (payload.notification) {
        console.log("[firebase-messaging-sw.js] Native notification detected, letting FCM SDK handle display.");
        return;
    }

    const title = payload?.data?.title || 'New Notification';
    const body = payload?.data?.body || 'You have a new update.';

    const notificationOptions = {
        body: body,
        icon: '/notification-icon.png',
        badge: '/notification-icon.png',
        tag: 'approval-notification-' + Date.now(),
        renotify: true,
        requireInteraction: false,
        data: {
            url: payload?.data?.click_action || '/'
        }
    };

    console.log("[firebase-messaging-sw.js] Showing custom fallback notification:", title, body);
    return self.registration.showNotification(title, notificationOptions);
});

// ✅ Handle notification click — opens app
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
