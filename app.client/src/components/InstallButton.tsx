// src/components/InstallButton.tsx
import { useEffect, useState } from "react";

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = (window.navigator as any).standalone === true;

  // Detect if already running as PWA
  const isPwa = window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  useEffect(() => {
    if (isPwa) {
      setIsInstallable(false);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Fallback: Check after some time if event didn't fire
    const fallbackTimer = setTimeout(() => {
      if (!isInstallable && !isIos && !isPwa) {
        // You can show a manual "Add to Home Screen" hint for Android too
        console.log("beforeinstallprompt did not fire - showing fallback");
      }
    }, 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(fallbackTimer);
    };
  }, [isInstallable, isIos, isPwa]);

  // Android Install
  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // iOS - Early Return
  if (isIos && !isStandalone && !isPwa) {
    return (
      <>
        <button
          onClick={() => setShowIosModal(true)}
          className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          Install App
        </button>

        {showIosModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 text-white p-6 rounded-2xl w-full max-w-[340px] shadow-xl">
              <h2 className="font-bold text-xl mb-3">Install App</h2>
              <p className="mb-4 text-zinc-400">Add this app to your home screen for quick access:</p>

              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>Tap the <b>⋯</b> menu at the bottom</li>
                <li>Tap <b>Share</b> (square with arrow)</li>
                <li>Scroll and tap <b>Add to Home Screen</b></li>
              </ol>

              <button
                onClick={() => setShowIosModal(false)}
                className="mt-6 w-full bg-primary py-3 rounded-xl font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Android / Chrome Install Button
  if (isInstallable && deferredPrompt) {
    return (
      <button
        onClick={handleAndroidInstall}
        className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
      >
        Install App
      </button>
    );
  }

  return null;
};

export default InstallButton;