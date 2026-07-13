import React, { useRef, useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Calendar,
  Download,
  Upload,
  Settings,
  RefreshCw,
  RotateCw,
  Check,
  X,
  Eye,
  FileImage,
  Info,
  Sliders,
  RotateCcw,
  PenTool,
  Undo
} from "lucide-react";
import { toast } from "sonner";

interface LocationDetails {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  address?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

export default function WatermarkCameraPage() {
  // Streams and media elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string>("");

  // App States
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isLiveCapture, setIsLiveCapture] = useState(false);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);

  // Customization Options
  const [customText, setCustomText] = useState("");
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showCustomText, setShowCustomText] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [overlayOpacity, setOverlayOpacity] = useState(0.65);
  const [textSize, setTextSize] = useState<"sm" | "md" | "lg">("md");

  // Image Editing / Adjustments
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);

  // Pencil Annotations
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pencilColor, setPencilColor] = useState("#EF4444"); // default red
  const [pencilWidth, setPencilWidth] = useState(5);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  // Load available camera devices
  const getCameraDevices = async () => {
    try {
      const devicesInfo = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devicesInfo.filter(device => device.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !activeDeviceId) {
        const backCam = videoDevices.find(d => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
        setActiveDeviceId(backCam ? backCam.deviceId : videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
    }
  };

  // Start Camera Feed
  const startCamera = async (deviceId: string) => {
    setLoadingCamera(true);
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setLoadingCamera(false);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setCameraError(err.message || "Failed to start camera. Please ensure permissions are granted.");
      setLoadingCamera(false);
    }
  };

  // Stop Camera Feed
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Watch stream state and assign to video element once mounted
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error("Video play failed:", err);
      });
    }
  }, [stream, videoRef.current]);

  // Fetch Geolocation
  const fetchLocation = (): Promise<LocationDetails> => {
    return new Promise((resolve, reject) => {
      setFetchingLocation(true);
      if (!navigator.geolocation) {
        const err = "Geolocation is not supported by your browser.";
        toast.error(err);
        setFetchingLocation(false);
        reject(err);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          const timestamp = new Date().toLocaleString();

          const details: LocationDetails = {
            latitude: lat,
            longitude: lon,
            accuracy,
            timestamp,
          };

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
              { headers: { "Accept-Language": "en" } }
            );
            if (response.ok) {
              const data = await response.json();
              details.address = data.display_name;
            }
          } catch (geoErr) {
            console.error("Reverse geocoding failed", geoErr);
          }

          setLocationDetails(details);
          setFetchingLocation(false);
          resolve(details);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMsg = "Could not fetch location.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = "Location access denied. Please enable location permissions.";
          }
          toast.error(errorMsg);
          setFetchingLocation(false);
          reject(errorMsg);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  // Lifecycle initialization
  useEffect(() => {
    getCameraDevices();
    fetchLocation().catch(() => { });

    navigator.mediaDevices.addEventListener("devicechange", getCameraDevices);

    return () => {
      stopCamera();
      navigator.mediaDevices.removeEventListener("devicechange", getCameraDevices);
    };
  }, []);

  // Watch for active device changes and start camera
  useEffect(() => {
    if (activeDeviceId) {
      startCamera(activeDeviceId);
    }
  }, [activeDeviceId]);

  // Handle camera toggle/switch
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveDeviceId(e.target.value);
  };

  // Re-fetch Geolocation
  const refreshLocation = async () => {
    try {
      toast.promise(fetchLocation(), {
        loading: "Fetching precise GPS location...",
        success: "GPS coordinates updated!",
        error: (err) => `${err}`
      });
    } catch { }
  };

  // Handle uploaded image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    resetEdits();
    setStrokes([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImageSrc(event.target?.result as string);
      setIsLiveCapture(false);
      fetchLocation().catch(() => { });
    };
    reader.readAsDataURL(file);
  };

  // Reset edits to original values
  const resetEdits = () => {
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
  };

  // Redraw canvas with edits, annotations, and watermarks
  const applyWatermarkAndEdits = (imgElement: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isRotated90or270 = rotation === 90 || rotation === 270;
    const targetWidth = isRotated90or270 ? imgElement.naturalHeight : imgElement.naturalWidth;
    const targetHeight = isRotated90or270 ? imgElement.naturalWidth : imgElement.naturalHeight;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.save();

    // 1. Apply image adjustments/filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`;

    // 2. Perform rotation
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    ctx.drawImage(
      imgElement,
      -imgElement.naturalWidth / 2,
      -imgElement.naturalHeight / 2,
      imgElement.naturalWidth,
      imgElement.naturalHeight
    );

    ctx.restore();

    // 3. Draw Annotations (Strokes) on top of the edited image
    const scale = Math.min(targetWidth, targetHeight) / 800; // scaling factor

    const drawSingleStroke = (stroke: Stroke) => {
      if (stroke.points.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(stroke.points[0].x * targetWidth, stroke.points[0].y * targetHeight);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * targetWidth, stroke.points[i].y * targetHeight);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Draw saved strokes
    strokes.forEach(drawSingleStroke);

    // Draw active stroke if currently drawing
    if (currentStroke) {
      drawSingleStroke(currentStroke);
    }

    // 4. Render watermark overlay
    const details = locationDetails || {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      timestamp: new Date().toLocaleString(),
      address: "Location details not available"
    };

    const baseFontSize = textSize === "sm" ? 12 : textSize === "md" ? 15 : 18;
    const fontSize = Math.max(12, Math.round(baseFontSize * scale));
    const padding = Math.max(16, Math.round(20 * scale));
    const lineSpacing = Math.max(6, Math.round(8 * scale));

    ctx.font = `bold ${fontSize}px sans-serif`;

    const lines: string[] = [];
    if (showAddress && details.address) {
      const maxChar = Math.round(45 / scale);
      const words = details.address.split(", ");
      let currentLine = "📍 ";

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + (currentLine === "📍 " ? "" : ", ") + words[i];
        if (testLine.length > maxChar && currentLine !== "📍 ") {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
    } else if (showAddress) {
      lines.push("📍 GPS Location Recorded");
    }

    if (showCoordinates && details.latitude && details.longitude) {
      lines.push(`🌐 Lat: ${details.latitude.toFixed(6)}°, Lon: ${details.longitude.toFixed(6)}° (±${Math.round(details.accuracy)}m)`);
    }

    if (showTimestamp) {
      lines.push(`📅 ${details.timestamp}`);
    }

    if (showCustomText && customText.trim()) {
      lines.push(`🏷️ ${customText.trim()}`);
    }

    if (lines.length > 0) {
      let maxTextWidth = 0;
      lines.forEach(line => {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxTextWidth) {
          maxTextWidth = metrics.width;
        }
      });

      const boxWidth = maxTextWidth + padding * 2;
      const boxHeight = lines.length * (fontSize + lineSpacing) - lineSpacing + padding * 2;

      const boxX = targetWidth - boxWidth - padding;
      const boxY = targetHeight - boxHeight - padding;
      const radius = Math.max(8, Math.round(12 * scale));

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(boxX + radius, boxY);
      ctx.lineTo(boxX + boxWidth - radius, boxY);
      ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
      ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
      ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
      ctx.lineTo(boxX + radius, boxY + boxHeight);
      ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
      ctx.lineTo(boxX, boxY + radius);
      ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
      ctx.closePath();

      ctx.fillStyle = theme === "dark"
        ? `rgba(15, 23, 42, ${overlayOpacity})`
        : `rgba(255, 255, 255, ${overlayOpacity})`;
      ctx.fill();

      ctx.lineWidth = Math.max(1, Math.round(1.5 * scale));
      ctx.strokeStyle = theme === "dark" ? `rgba(255, 255, 255, 0.15)` : `rgba(15, 23, 42, 0.15)`;
      ctx.stroke();

      ctx.fillStyle = theme === "dark" ? "#FFFFFF" : "#0F172A";
      ctx.textBaseline = "top";

      lines.forEach((line, index) => {
        const lineY = boxY + padding + index * (fontSize + lineSpacing);
        ctx.fillText(line, boxX + padding, lineY);
      });

      ctx.restore();
    }

    // Export image for download
    setWatermarkedImage(canvas.toDataURL("image/jpeg", 0.95));
  };

  // Capture Live Video Frame
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !stream) {
      toast.error("Camera stream is not ready.");
      return;
    }

    fetchLocation().then(() => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setRawImageSrc(tempCanvas.toDataURL("image/jpeg"));
        setIsLiveCapture(true);
        setStrokes([]);
        stopCamera();
        toast.success("Photo captured! Click 'Draw on Image' to draw or use edits.");
      }
    }).catch(() => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setRawImageSrc(tempCanvas.toDataURL("image/jpeg"));
        setIsLiveCapture(true);
        setStrokes([]);
        stopCamera();
      }
    });
  };

  // Redraw when settings, edits, or strokes change
  useEffect(() => {
    if (rawImageSrc) {
      const img = new Image();
      img.onload = () => {
        applyWatermarkAndEdits(img);
      };
      img.src = rawImageSrc;
    }
  }, [
    rawImageSrc,
    rotation,
    brightness,
    contrast,
    saturation,
    grayscale,
    showCoordinates,
    showTimestamp,
    showAddress,
    showCustomText,
    customText,
    theme,
    overlayOpacity,
    textSize,
    locationDetails,
    strokes,
    currentStroke
  ]);

  // Restart / Reset
  const handleReset = () => {
    setRawImageSrc(null);
    setWatermarkedImage(null);
    setStrokes([]);
    setIsDrawMode(false);
    resetEdits();
    if (activeDeviceId) {
      startCamera(activeDeviceId);
    }
  };

  // Rotate image clockwise by 90 degrees
  const rotateImage = () => {
    setRotation(prev => {
      if (prev === 0) return 90;
      if (prev === 90) return 180;
      if (prev === 180) return 270;
      return 0;
    });
  };

  // Drawing event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Normalize coordinates relative to bounding client size
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setIsDrawing(true);
    setCurrentStroke({
      points: [{ x, y }],
      color: pencilColor,
      width: pencilWidth
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke || !isDrawMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Boundary constraints
    const boundedX = Math.max(0, Math.min(1, x));
    const boundedY = Math.max(0, Math.min(1, y));

    setCurrentStroke(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, { x: boundedX, y: boundedY }]
      };
    });
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentStroke) return;
    setStrokes(prev => [...prev, currentStroke]);
    setCurrentStroke(null);
    setIsDrawing(false);
  };

  const undoLastStroke = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const clearStrokes = () => {
    setStrokes([]);
  };

  // Preset pencil color array
  const pencilColors = [
    { value: "#EF4444", label: "Red" },
    { value: "#F59E0B", label: "Yellow" },
    { value: "#10B981", label: "Green" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#FFFFFF", label: "White" },
    { value: "#000000", label: "Black" }
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary animate-pulse" />
            GPS Watermark Camera
          </h1>
          <p className="text-sm text-muted-foreground">
            Capture photos or upload images with verified geolocation and address details stamped on the bottom right.
          </p>
        </div>

        {/* Location Info Banner */}
        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-slate-900/60 p-3 backdrop-blur-md">
          <MapPin className={`h-5 w-5 ${fetchingLocation ? "text-primary animate-bounce" : "text-emerald-400"}`} />
          <div className="text-left">
            <p className="text-xs font-semibold text-white">Device Geolocation</p>
            <p className="text-[11px] text-muted-foreground">
              {fetchingLocation ? (
                "Fetching precision coordinates..."
              ) : locationDetails ? (
                `${locationDetails.latitude.toFixed(4)}°, ${locationDetails.longitude.toFixed(4)}° (±${Math.round(locationDetails.accuracy)}m)`
              ) : (
                "GPS coordinates not loaded"
              )}
            </p>
          </div>
          <button
            onClick={refreshLocation}
            disabled={fetchingLocation}
            className="rounded p-1 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
            title="Update current coordinates"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${fetchingLocation ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Video Stream HUD or Active Canvas HUD */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 shadow-2xl flex items-center justify-center">

            {/* 1. Show canvas when raw image is loaded */}
            {rawImageSrc ? (
              <div className="relative w-full h-full flex items-center justify-center p-2 bg-slate-900 select-none">
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className={`max-w-full max-h-full object-contain rounded-md shadow-lg touch-none ${isDrawMode ? "cursor-crosshair" : "cursor-default"
                    }`}
                />

                {/* HUD annotation badge indicator */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-emerald-500/80 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-md">
                    <Check className="h-3 w-3" /> Image Loaded
                  </div>
                  {/* {isDrawMode && (
                    <div className="bg-red-500/80 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-md animate-pulse">
                      <PenTool className="h-3 w-3 animate-bounce" /> Pencil Active: Draw on canvas
                    </div>
                  )}   */}
                </div>
              </div>
            ) : stream ? (
              /* 2. Live camera feed active */
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30 pointer-events-none" />

                <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur border border-white/10 text-white text-[11px] px-2.5 py-1.5 rounded-md flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Camera Feed
                </div>
              </div>
            ) : (
              /* 3. Camera inactive / error state */
              <div className="flex flex-col items-center gap-4 text-center p-6 max-w-md">
                <div className="rounded-full bg-white/5 p-4 border border-white/10">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Camera is disconnected</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cameraError || "Start the camera stream to snap a location-watermarked photo, or upload an existing file below."}
                  </p>
                </div>
                <div className="flex gap-2">
                  {devices.length > 0 && (
                    <button
                      onClick={() => startCamera(activeDeviceId)}
                      className="rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground px-4 py-2 text-xs font-semibold shadow transition-all"
                    >
                      Start Camera
                    </button>
                  )}
                  <label className="rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 text-white px-4 py-2 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Camera controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-2">
              {stream && (
                <>
                  <button
                    onClick={capturePhoto}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold shadow-lg transition-all"
                  >
                    <Camera className="h-4 w-4" />
                    Capture Photo
                  </button>

                  {devices.length > 1 && (
                    <select
                      value={activeDeviceId}
                      onChange={handleDeviceChange}
                      className="rounded-lg bg-slate-950 border border-white/10 text-white text-xs px-3 py-2 outline-none focus:border-primary/50 cursor-pointer"
                    >
                      {devices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${devices.indexOf(device) + 1}`}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              )}

              {rawImageSrc && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950 hover:bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold transition-all"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Reset / Take Another
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="rounded-lg border border-white/10 bg-slate-950 hover:bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" />
                Upload New Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {watermarkedImage && (
                <a
                  href={watermarkedImage}
                  download={`GPS_Watermark_${Date.now()}.jpg`}
                  className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 text-xs font-bold shadow-md transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download Image
                </a>
              )}
            </div>
          </div>

          {/* Editing and Annotation Panels (moved below camera) */}
          {rawImageSrc && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Annotations & Pencil Markup Panel */}
              <div className="rounded-xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md shadow-xl space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-primary" />
                    Pencil & Marking
                  </span>
                  <span className="text-[10px] text-muted-foreground">Draw on preview</span>
                </h2>

                {/* Toggle Draw Mode */}
                <button
                  onClick={() => setIsDrawMode(!isDrawMode)}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold border transition-all ${isDrawMode
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-lg"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-white/5"
                    }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  {isDrawMode ? "Stop Drawing" : "Pencil Tool (Draw on Image)"}
                </button>

                {isDrawMode && (
                  <div className="space-y-4 pt-2 animate-fade-in">

                    {/* Pencil Brush Colors */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-300 block mb-2">Color</span>
                      <div className="flex flex-wrap gap-2">
                        {pencilColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setPencilColor(color.value)}
                            className={`h-6 w-6 rounded-full border transition-all relative flex items-center justify-center ${pencilColor === color.value
                              ? "border-primary scale-110 shadow-md ring-2 ring-primary/20"
                              : "border-white/10 hover:scale-105"
                              }`}
                            style={{ backgroundColor: color.value }}
                            title={color.label}
                          >
                            {pencilColor === color.value && (
                              <Check
                                className={`h-3.5 w-3.5 ${color.value === "#FFFFFF" || color.value === "#F59E0B" ? "text-slate-900" : "text-white"
                                  }`}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pencil Brush Size */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-300">Pencil Size</span>
                        <span className="text-primary font-mono">{pencilWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        value={pencilWidth}
                        onChange={(e) => setPencilWidth(Number(e.target.value))}
                        className="w-full accent-primary bg-slate-900 rounded-lg cursor-pointer h-1.5"
                      />
                    </div>

                    {/* Drawing Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={undoLastStroke}
                        disabled={strokes.length === 0}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-slate-900 px-3 py-2 text-xs text-white hover:bg-slate-800 disabled:opacity-40 transition-all font-medium"
                      >
                        <Undo className="h-3.5 w-3.5" />
                        Undo ({strokes.length})
                      </button>
                      <button
                        onClick={clearStrokes}
                        disabled={strokes.length === 0}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-slate-900 px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 disabled:opacity-40 transition-all font-medium"
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Adjustments (Editing) Panel */}
              <div className="rounded-xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md shadow-xl space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Image Adjustments
                  </span>
                  <button
                    onClick={resetEdits}
                    className="text-[10px] text-muted-foreground hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                </h2>

                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs font-semibold text-slate-300">Rotate</span>
                  <button
                    onClick={rotateImage}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-800 transition-all font-medium"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    {rotation}°
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Brightness</span>
                    <span className="text-slate-400 font-mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-primary bg-slate-900 rounded-lg cursor-pointer h-1.5"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Contrast</span>
                    <span className="text-slate-400 font-mono">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-primary bg-slate-900 rounded-lg cursor-pointer h-1.5"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Saturation</span>
                    <span className="text-slate-400 font-mono">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-primary bg-slate-900 rounded-lg cursor-pointer h-1.5"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Grayscale</span>
                    <span className="text-slate-400 font-mono">{grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={grayscale}
                    onChange={(e) => setGrayscale(Number(e.target.value))}
                    className="w-full accent-primary bg-slate-900 rounded-lg cursor-pointer h-1.5"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Options & Customization panels */}
        <div className="lg:col-span-4 flex flex-col gap-6">



          {/* Watermark customization panel */}
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md shadow-xl space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Watermark Customizer
            </h2>

            {/* Custom note textbox */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Custom Note / Tag</label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Site Visit #4, Building Exterior Inspection"
                className="w-full min-h-[60px] rounded-lg bg-slate-900 border border-white/10 text-white text-xs p-3 outline-none focus:border-primary/50 placeholder:text-slate-600 transition-all resize-none"
              />
            </div>

            {/* Toggle checkboxes */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 block mb-1">Overlay Metadata Fields</span>

              <label className="flex items-center gap-3 cursor-pointer group text-xs text-slate-400 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showAddress}
                  onChange={(e) => setShowAddress(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-slate-900 text-primary focus:ring-primary/50"
                />
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary transition-colors" />
                  Reverse-Geocoded Address
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group text-xs text-slate-400 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showCoordinates}
                  onChange={(e) => setShowCoordinates(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-slate-900 text-primary focus:ring-primary/50"
                />
                <span className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary transition-colors" />
                  GPS Lat / Lon / Accuracy
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group text-xs text-slate-400 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showTimestamp}
                  onChange={(e) => setShowTimestamp(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-slate-900 text-primary focus:ring-primary/50"
                />
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary transition-colors" />
                  Current Date / Time
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group text-xs text-slate-400 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showCustomText}
                  onChange={(e) => setShowCustomText(e.target.checked)}
                  disabled={!customText.trim()}
                  className="h-4 w-4 rounded border-white/10 bg-slate-900 text-primary focus:ring-primary/50 disabled:opacity-40"
                />
                <span className={`flex items-center gap-1.5 ${!customText.trim() ? "opacity-40" : ""}`}>
                  <FileImage className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary transition-colors" />
                  Custom Note / Text
                </span>
              </label>
            </div>

            {/* Styling theme options */}
            <div className="space-y-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">Overlay Theme</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`rounded-lg px-3 py-2 text-xs font-medium border transition-all ${theme === "dark"
                      ? "bg-slate-900 text-white border-primary shadow"
                      : "bg-slate-950 text-slate-400 border-white/5 hover:bg-slate-900"
                      }`}
                  >
                    Dark Background
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`rounded-lg px-3 py-2 text-xs font-medium border transition-all ${theme === "light"
                      ? "bg-white text-slate-900 border-primary shadow"
                      : "bg-slate-950 text-slate-400 border-white/5 hover:bg-slate-900"
                      }`}
                  >
                    Light Background
                  </button>
                </div>
              </div>

              {/* Text sizing options */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">Overlay Text Size</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["sm", "md", "lg"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setTextSize(sz)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border capitalize transition-all ${textSize === sz
                        ? "bg-primary text-primary-foreground border-primary shadow"
                        : "bg-slate-950 text-slate-400 border-white/5 hover:bg-slate-900"
                        }`}
                    >
                      {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background opacity slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Overlay Opacity</span>
                  <span className="text-primary font-mono">{Math.round(overlayOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={overlayOpacity * 100}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value) / 100)}
                  className="w-full accent-primary bg-slate-900 rounded-lg cursor-pointer h-1.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
