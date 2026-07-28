importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

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
    console.log("[firebase-messaging-sw.js] Received background data message", payload);
    // Note: Do NOT call self.registration.showNotification here if the backend sends 
    // a Notification object (WebpushNotification or ApnsAlert). 
    // FCM SDK automatically handles displaying the notification in the background!
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
