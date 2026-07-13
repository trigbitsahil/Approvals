
import { useEffect, useState } from "react";
import { messaging, db } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const vapidKey = "BOyh_f-Oiv-PovpPqgy6P5cvEfnznVhx1_zrf5ReDHnE8dMMzIH_LmMrgwvM4ZOAcDePwAQ7hPafRH66fwziR8A";

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return "mobile";
    if (/iPad|Tablet/i.test(ua)) return "tablet";
    return "desktop";
}

async function saveTokenToFirestore(token: string) {
    const deviceType = getDeviceType();
    const deviceId = `${deviceType}_${token.slice(-6)}`;

    await setDoc(doc(db, "fcmTokens", deviceId), {
        token,
        deviceType,
        userAgent: navigator.userAgent,
        savedAt: new Date(),
    });

    console.log(`✅ Token saved to Firestore [${deviceId}]`);
}

export function PushManager() {
    const [needsPermission, setNeedsPermission] = useState(false);

    useEffect(() => {
        if (!("serviceWorker" in navigator) || !("Notification" in window)) {
            console.warn("Service workers or Notifications not supported on this browser.");
            return;
        }

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (Notification.permission === "default") {
            if (isSafari) {
                // Safari strictly requires a user gesture, so show the button
                setNeedsPermission(true);
            }
        }

        navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
                console.log("✅ Service Worker registered:", registration.scope);

                // If already granted, get the token quietly in the background
                if (Notification.permission === "granted") {
                    getTokenForRegistration(registration);
                } else if (Notification.permission === "default" && !isSafari) {
                    // For Chrome and other browsers that allow auto-prompting on load
                    Notification.requestPermission().then((permission) => {
                        if (permission === "granted") {
                            getTokenForRegistration(registration);
                        }
                    }).catch(err => console.error("Error requesting permission:", err));
                }
            })
            .catch((err) => {
                console.error("Service Worker registration failed:", err);
            });

        // Handle foreground messages
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("🔔 Foreground message received:", payload);

            const title =
                payload.notification?.title ||
                payload.data?.title ||
                "New Notification";

            const body =
                payload.notification?.body ||
                payload.data?.body ||
                "";

            if (Notification.permission === "granted") {
                new Notification(title, {
                    body,
                    icon: "/pwa-192x192.png",
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const getTokenForRegistration = (registration: ServiceWorkerRegistration) => {
        getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        })
            .then((currentToken) => {
                if (currentToken) {
                    console.log("📲 FCM Token:", currentToken);
                    saveTokenToFirestore(currentToken);
                } else {
                    console.warn("No registration token available. Check VAPID key & SW.");
                }
            })
            .catch((err) => {
                console.error("Error retrieving FCM token:", err);
            });
    };

    const handleRequestPermission = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                setNeedsPermission(false);
                navigator.serviceWorker.ready.then((registration) => {
                    getTokenForRegistration(registration);
                });
            } else {
                console.warn("Notification permission denied by user.");
                setNeedsPermission(false); // Hide the button if they deny it
            }
        }).catch(err => {
            console.error("Error requesting permission:", err);
        });
    };

    if (!needsPermission) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <Button
                onClick={handleRequestPermission}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center gap-2 rounded-full px-4"
            >
                <Bell className="w-4 h-4" />
                Enable Push Notifications
            </Button>
        </div>
    );
}

