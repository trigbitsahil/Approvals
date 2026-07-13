"use client";

import { useRef, useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { getProductByBarcode } from "@/api/services/productApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Square, Search } from "lucide-react";

interface ScannerProps {
  onScan?: (code: string) => void;
  onBlur?: (code: string) => void;
}

export default function Scanner({ onScan, onBlur }: ScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);

  const [scanning, setScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async (barcode: string) => {
    if (onScan) {
      onScan(barcode);
    }
    try {
      setLoading(true);
      const data = await getProductByBarcode(barcode);
      setProduct(data);
    } catch {
      // alert("Product Not Found ❌");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const startScanner = () => {
    if (scanning) return;
    setScanning(true);
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState();
        if (state === 2) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {}
    setScanning(false);
  };

  useEffect(() => {
    if (!scanning || !readerRef.current) return;

    const qr = new Html5Qrcode(readerRef.current.id);
    scannerRef.current = qr;

    qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 220 },
      async (decodedText) => {
        setManualBarcode(decodedText);
        await stopScanner();
        fetchProduct(decodedText);
      },
      (errorMessage) => {
        // console.warn(errorMessage);
      },
    ).catch(() => setScanning(false));

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch {}
      }
    };
  }, [scanning]);

  const handleManualSearch = () => {
    if (!manualBarcode.trim()) return;
    fetchProduct(manualBarcode.trim());
  };

  return (
    <div className="w-full flex flex-col items-center mt-2 sm:mt-8 space-y-4 sm:space-y-6">
      <Card
        className="
        w-full 
        max-w-md 
        p-3 sm:p-6 
        rounded-2xl 
        shadow-xl
        bg-white 
        dark:bg-zinc-900
        text-black 
        dark:text-white
        border 
        border-gray-200 
        dark:border-zinc-800
      "
      >
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={startScanner}
            disabled={scanning}
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              font-medium
              transition
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-80
              disabled:opacity-50
            "
          >
            <Camera size={16} />
            Scan
          </button>

          {scanning && (
            <button
              onClick={stopScanner}
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-xl
                font-medium
                transition
                bg-red-600 text-white
                hover:bg-red-700
              "
            >
              <Square size={16} />
              Stop
            </button>
          )}
        </div>

        {scanning && (
          <div
            id="reader"
            ref={readerRef}
            className="
              w-full
              aspect-video
              rounded-2xl
              overflow-hidden
              border
              border-gray-300
              dark:border-zinc-700
              shadow-lg
              mb-6
            "
          />
        )}

        <div>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
            Enter Barcode Manually
          </p>

          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onBlur={() => onBlur?.(manualBarcode)}
              placeholder="Enter barcode"
              className="
      flex-1
      min-w-0
      px-3 py-2
      rounded-xl
      bg-gray-100
      dark:bg-zinc-800
      border
      border-gray-300
      dark:border-zinc-700
      text-black
      dark:text-white
      text-sm
      focus:outline-none
    "
            />

            <button
              onClick={handleManualSearch}
              className="
      shrink-0
      h-9
      w-9
      flex items-center justify-center
      rounded-xl
      bg-black text-white
      dark:bg-white dark:text-black
      hover:opacity-80
    "
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </Card>

      {loading && (
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Loading product...
        </p>
      )}

      {product && (
        <Card
          className="
          w-full 
          max-w-md 
          p-3 sm:p-6 
          rounded-2xl 
          shadow-xl
          bg-white 
          dark:bg-zinc-900
          text-black 
          dark:text-white
          border 
          border-gray-200 
          dark:border-zinc-800
        "
        >
          <h2 className="text-xl font-semibold mb-3">{product.productName}</h2>

          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
            Barcode: {product.barcode}
          </p>

          <p className="text-2xl font-bold">₹ {product.price}</p>
        </Card>
      )}
    </div>
  );
}
