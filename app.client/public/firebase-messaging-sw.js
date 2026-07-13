importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDM6MN__48RJX7qEogIHLKB0pl9sDR1840",
    authDomain: "mypwaapp-b385b.firebaseapp.com",
    projectId: "mypwaapp-b385b",
    storageBucket: "mypwaapp-b385b.firebasestorage.app",
    messagingSenderId: "388926845795",
    appId: "1:388926845795:web:e9c63694d1af802897d956"
});

const messaging = firebase.messaging();

// ✅ Handles background messages (app closed / in background)
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message", payload);

    // Support both notification payload AND data-only payload (mobile-friendly)
    const title =
        (payload.notification && payload.notification.title) ||
        (payload.data && payload.data.title) ||
        "New Notification";

    const body =
        (payload.notification && payload.notification.body) ||
        (payload.data && payload.data.body) ||
        "";

    const notificationOptions = {
        body,
        icon: "/pwa-192x192.png", // Use your real PWA icon
        badge: "/pwa-192x192.png",
        data: payload.data || {},
        // Required for Android to show notification reliably
        requireInteraction: false,
        vibrate: [200, 100, 200],
    };

    self.registration.showNotification(title, notificationOptions);
});

// ✅ Handle notification click — opens app
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});
