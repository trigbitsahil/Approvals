import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Clock, 
  Upload, 
  Plus, 
  Star, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle,
  FileCheck,
  RotateCcw,
  X,
  Settings,
  RotateCw,
  Check,
  Info,
  Sliders,
  Undo,
  Calendar,
  Trash2,
  Eye,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SurveyService, CreateSurveyCommand } from "@/api/services/SurveyService";
import { DocumentsService } from "@/api/services/DocumentsService";

const WIZARD_STEPS = [
  "Photos",
  "Condition",
  "Lighting",
  "Cleanliness",
  "Safety",
  "Review"
];

const WIZARD_STEPS_LABELS: Record<string, string> = {
  front: "Front View",
  side: "Side View",
  closeup: "Close-up",
  issue: "Issue Photo"
};

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

export default function SurveyWizard() {
  const { id, mediaId: routeMediaId } = useParams<{ id?: string; mediaId?: string }>();
  const navigate = useNavigate();
  const mediaId = id || routeMediaId || "MED-002";

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [surveyDetail, setSurveyDetail] = useState<any>(null);

  useEffect(() => {
    if (mediaId && !mediaId.startsWith("MED-")) {
      SurveyService.getSurveyById(mediaId).then((res) => {
        if (res?.success && res.data) {
          setSurveyDetail(res.data);
          if (res.data.structureStatus) setStructureStatus(res.data.structureStatus as any);
          if (res.data.structureComments && res.data.structureComments !== "N/A") setStructureComments(res.data.structureComments);
          if (res.data.brandingStatus) setBrandingStatus(res.data.brandingStatus as any);
          if (res.data.brandingComments && res.data.brandingComments !== "N/A") setBrandingComments(res.data.brandingComments);
          if (res.data.powerStatus) setPowerStatus(res.data.powerStatus as any);
          if (res.data.ledStatus) setLedStatus(res.data.ledStatus as any);
          if (res.data.brightnessStatus) setBrightnessStatus(res.data.brightnessStatus as any);
          if (res.data.lightingIssueCategory && res.data.lightingIssueCategory !== "N/A") setLightingIssueCategory(res.data.lightingIssueCategory);
          if (res.data.lightingComments && res.data.lightingComments !== "N/A") setLightingComments(res.data.lightingComments);
          if (res.data.housekeepingScore) setCleanlinessScore(res.data.housekeepingScore);
          if (res.data.housekeepingTags) setCleanlinessTags(res.data.housekeepingTags);
          if (res.data.housekeepingComments && res.data.housekeepingComments !== "N/A") setCleanlinessComments(res.data.housekeepingComments);
          if (res.data.safetySeverity) setSafetySeverity(res.data.safetySeverity as any);
          if (res.data.notifyOperations) setNotifyOperations(res.data.notifyOperations);
          if (res.data.safetyComments && res.data.safetyComments !== "N/A") setSafetyComments(res.data.safetyComments);
        }
      }).catch(err => console.error("Error loading survey detail:", err));
    }
  }, [mediaId]);

  // --- Step 1 Data: Photos
  const [photoFront, setPhotoFront] = useState<string | null>(null);
  const [photoSide, setPhotoSide] = useState<string | null>(null);
  const [photoCloseUp, setPhotoCloseUp] = useState<string | null>(null);
  const [photoIssue, setPhotoIssue] = useState<string | null>(null);

  // --- Step 2 Data: Condition
  const [structureStatus, setStructureStatus] = useState<"Good" | "Fair" | "Poor" | "Critical">("Good");
  const [structureComments, setStructureComments] = useState("");
  const [brandingStatus, setBrandingStatus] = useState<"Excellent" | "Faded" | "Torn" | "Missing">("Excellent");
  const [brandingComments, setBrandingComments] = useState("");

  // --- Step 3 Data: Lighting
  const [powerStatus, setPowerStatus] = useState<"Available" | "Outage">("Available");
  const [ledStatus, setLedStatus] = useState<"Working" | "Partial" | "Failed">("Working");
  const [brightnessStatus, setBrightnessStatus] = useState<"Excellent" | "Dim" | "Not Visible">("Excellent");
  const [lightingIssueCategory, setLightingIssueCategory] = useState<string>("");
  const [lightingComments, setLightingComments] = useState("");

  // --- Step 4 Data: Cleanliness
  const [cleanlinessScore, setCleanlinessScore] = useState<number>(5);
  const [cleanlinessTags, setCleanlinessTags] = useState<string[]>([]);
  const [cleanlinessComments, setCleanlinessComments] = useState("");

  // --- Step 5 Data: Safety
  const [safetyHazards, setSafetyHazards] = useState<string[]>([]);
  const [safetySeverity, setSafetySeverity] = useState<"Low" | "Medium" | "High">("Low");
  const [notifyOperations, setNotifyOperations] = useState(false);
  const [safetyComments, setSafetyComments] = useState("");

  // --- Watermark Camera Modal State ---
  const [activeCaptureCard, setActiveCaptureCard] = useState<string | null>(null);
  const [tempRawImageSrc, setTempRawImageSrc] = useState<string | null>(null);
  const [tempLocationDetails, setTempLocationDetails] = useState<LocationDetails | null>(null);
  const [tempStrokes, setTempStrokes] = useState<Stroke[]>([]);
  const [tempCurrentStroke, setTempCurrentStroke] = useState<Stroke | null>(null);
  const [tempBrightness, setTempBrightness] = useState<number>(100);
  const [tempContrast, setTempContrast] = useState<number>(100);
  const [tempSaturation, setTempSaturation] = useState<number>(100);
  const [tempGrayscale, setTempGrayscale] = useState<number>(0);
  const [tempRotation, setTempRotation] = useState<0 | 90 | 180 | 270>(0);
  const [tempCustomText, setTempCustomText] = useState("");
  const [tempShowCoordinates, setTempShowCoordinates] = useState(true);
  const [tempShowTimestamp, setTempShowTimestamp] = useState(true);
  const [tempShowAddress, setTempShowAddress] = useState(true);
  const [tempShowCustomText, setTempShowCustomText] = useState(true);
  const [tempTheme, setTempTheme] = useState<"dark" | "light">("dark");
  const [tempOverlayOpacity, setTempOverlayOpacity] = useState(0.65);
  const [tempTextSize, setTempTextSize] = useState<"sm" | "md" | "lg">("md");

  // Camera devices
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [modalActiveDeviceId, setModalActiveDeviceId] = useState<string>("");
  const [modalStream, setModalStream] = useState<MediaStream | null>(null);
  const [modalLoadingCamera, setModalLoadingCamera] = useState(false);
  const [modalCameraError, setModalCameraError] = useState<string | null>(null);
  const [modalFetchingLocation, setModalFetchingLocation] = useState(false);
  const [modalIsDrawMode, setModalIsDrawMode] = useState(false);
  const [modalIsDrawing, setModalIsDrawing] = useState(false);
  const [modalPencilColor, setModalPencilColor] = useState("#EF4444");
  const [modalPencilWidth, setModalPencilWidth] = useState(5);

  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- Dynamic Issues List and compliance metrics ---
  const issuesList = useMemo(() => {
    const list: string[] = [];
    if (structureStatus === "Fair") list.push("Structure condition is Fair");
    if (structureStatus === "Poor") list.push("Structure condition is Poor");
    if (structureStatus === "Critical") list.push("Structure condition is Critical");
    if (brandingStatus === "Faded") list.push("Branding logo is Faded");
    if (brandingStatus === "Torn") list.push("Branding banner is Torn");
    if (brandingStatus === "Missing") list.push("Branding is completely Missing");
    if (powerStatus === "Outage") list.push("Power supply is Outage");
    if (ledStatus === "Partial") list.push("LED display panel is partially failed");
    if (ledStatus === "Failed") list.push(`LED screen completely Failed (Category: ${lightingIssueCategory || "Unknown"})`);
    if (brightnessStatus === "Dim") list.push("Screen brightness is Dim");
    if (brightnessStatus === "Not Visible") list.push("Screen output is Not Visible");
    if (cleanlinessScore <= 3) list.push(`Cleanliness rating is Low (${cleanlinessScore}/5 Stars)`);
    if (safetyHazards.length > 0) {
      safetyHazards.forEach(hazard => list.push(`Safety hazard detected: ${hazard}`));
    }
    return list;
  }, [structureStatus, brandingStatus, powerStatus, ledStatus, brightnessStatus, lightingIssueCategory, cleanlinessScore, safetyHazards]);

  const complianceScore = useMemo(() => {
    let score = 100;
    
    // Deductions
    if (structureStatus === "Fair") score -= 15;
    if (structureStatus === "Poor") score -= 35;
    if (structureStatus === "Critical") score -= 60;
    
    if (brandingStatus === "Faded") score -= 10;
    if (brandingStatus === "Torn") score -= 25;
    if (brandingStatus === "Missing") score -= 45;
    
    if (powerStatus === "Outage") score -= 30;
    if (ledStatus === "Partial") score -= 20;
    if (ledStatus === "Failed") score -= 50;

    if (brightnessStatus === "Dim") score -= 15;
    if (brightnessStatus === "Not Visible") score -= 35;

    score -= (5 - cleanlinessScore) * 8;
    score -= safetyHazards.length * 15;

    return Math.max(0, Math.min(100, score));
  }, [structureStatus, brandingStatus, powerStatus, ledStatus, brightnessStatus, cleanlinessScore, safetyHazards]);

  const issueCount = issuesList.length;

  // --- Photo Capture / Upload Modal Handlers ---
  const openCameraForCard = (cardKey: string) => {
    setActiveCaptureCard(cardKey);
    let existingImage = null;
    if (cardKey === "front") existingImage = photoFront;
    if (cardKey === "side") existingImage = photoSide;
    if (cardKey === "closeup") existingImage = photoCloseUp;
    if (cardKey === "issue") existingImage = photoIssue;

    setTempRawImageSrc(existingImage);
    setTempStrokes([]);
    setTempRotation(0);
    setTempBrightness(100);
    setTempContrast(100);
    setTempSaturation(100);
    setTempGrayscale(0);
    setTempCustomText(`Asset: ${mediaId} - ${WIZARD_STEPS_LABELS[cardKey]}`);

    // Initial Geolocation & Camera enumeration
    fetchModalLocation();
    getModalCameraDevices();
  };

  const fetchModalLocation = (): Promise<LocationDetails> => {
    return new Promise((resolve, reject) => {
      setModalFetchingLocation(true);
      if (!navigator.geolocation) {
        const err = "Geolocation is not supported by your browser.";
        toast.error(err);
        setModalFetchingLocation(false);
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
            } else {
              details.address = `GPS: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            }
          } catch (geoErr) {
            console.error("Reverse geocoding failed", geoErr);
            details.address = `GPS: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
          }

          setTempLocationDetails(details);
          setModalFetchingLocation(false);
          resolve(details);
        },
        (error) => {
          console.error("Geolocation error:", error);
          const errorMsg = "Could not fetch precise GPS location.";
          toast.error(errorMsg);
          setModalFetchingLocation(false);
          reject(errorMsg);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  };

  const getModalCameraDevices = async () => {
    try {
      const devicesInfo = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devicesInfo.filter(device => device.kind === "videoinput");
      setCameraDevices(videoDevices);
      if (videoDevices.length > 0 && !modalActiveDeviceId) {
        const backCam = videoDevices.find(d => 
          d.label.toLowerCase().includes("back") || 
          d.label.toLowerCase().includes("environment") ||
          d.label.toLowerCase().includes("rear")
        );
        setModalActiveDeviceId(backCam ? backCam.deviceId : videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
    }
  };

  const startModalCamera = async (deviceId: string) => {
    setModalLoadingCamera(true);
    setModalCameraError(null);
    stopModalCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setModalStream(newStream);
      setModalLoadingCamera(false);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setModalCameraError(err.message || "Failed to start camera. Please ensure permissions are granted.");
      setModalLoadingCamera(false);
    }
  };

  const stopModalCamera = () => {
    if (modalStream) {
      modalStream.getTracks().forEach(track => track.stop());
      setModalStream(null);
    }
  };

  // Watch modal camera triggers
  useEffect(() => {
    if (activeCaptureCard && modalActiveDeviceId && !tempRawImageSrc) {
      startModalCamera(modalActiveDeviceId);
    }
    return () => {
      stopModalCamera();
    };
  }, [modalActiveDeviceId, activeCaptureCard, tempRawImageSrc]);

  useEffect(() => {
    if (modalVideoRef.current && modalStream) {
      modalVideoRef.current.srcObject = modalStream;
      modalVideoRef.current.play().catch(err => console.error("Play failed:", err));
    }
  }, [modalStream, modalVideoRef.current]);

  // ★ KEY EFFECT: re-draw canvas whenever image or any edit/watermark setting changes
  useEffect(() => {
    if (!tempRawImageSrc) return;
    const img = new Image();
    img.onload = () => applyWatermarkAndEdits(img);
    img.src = tempRawImageSrc;
  }, [
    tempRawImageSrc,
    tempBrightness, tempContrast, tempSaturation, tempGrayscale, tempRotation,
    tempShowAddress, tempShowCoordinates, tempShowTimestamp, tempShowCustomText,
    tempCustomText, tempTheme, tempOverlayOpacity, tempTextSize,
    tempStrokes, tempCurrentStroke, tempLocationDetails
  ]);

  // Capture current frame
  const modalCapturePhoto = () => {
    const video = modalVideoRef.current;
    if (!video || !modalStream) {
      toast.error("Camera is not streaming.");
      return;
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      setTempRawImageSrc(tempCanvas.toDataURL("image/jpeg"));
      setTempStrokes([]);
      stopModalCamera();
      toast.success("Photo captured! Use control tabs to edit or draw markups.");
    }
  };

  // Handle local image upload instead of live feed
  const handleModalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopModalCamera();
    const reader = new FileReader();
    reader.onload = (event) => {
      setTempRawImageSrc(event.target?.result as string);
      setTempStrokes([]);
      fetchModalLocation().catch(() => {});
    };
    reader.readAsDataURL(file);
  };

  // Canvas drawing event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!modalIsDrawMode) return;
    const canvas = modalCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setModalIsDrawing(true);
    setTempCurrentStroke({
      points: [{ x, y }],
      color: modalPencilColor,
      width: modalPencilWidth
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!modalIsDrawing || !tempCurrentStroke || !modalIsDrawMode) return;
    const canvas = modalCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const boundedX = Math.max(0, Math.min(1, x));
    const boundedY = Math.max(0, Math.min(1, y));

    setTempCurrentStroke(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, { x: boundedX, y: boundedY }]
      };
    });
  };

  const handlePointerUp = () => {
    if (!modalIsDrawing || !tempCurrentStroke) return;
    setTempStrokes(prev => [...prev, tempCurrentStroke]);
    setTempCurrentStroke(null);
    setModalIsDrawing(false);
  };

  const undoLastStroke = () => {
    setTempStrokes(prev => prev.slice(0, -1));
  };

  const clearStrokes = () => {
    setTempStrokes([]);
  };

  const handleModalReset = () => {
    setTempRawImageSrc(null);
    setTempStrokes([]);
    setModalIsDrawMode(false);
    setTempRotation(0);
    setTempBrightness(100);
    setTempContrast(100);
    setTempSaturation(100);
    setTempGrayscale(0);
    if (modalActiveDeviceId) {
      startModalCamera(modalActiveDeviceId);
    }
  };

  const closeCameraModal = () => {
    stopModalCamera();
    setActiveCaptureCard(null);
  };

  const saveCapturedPhoto = () => {
    const canvas = modalCanvasRef.current;
    if (!canvas) {
      toast.error("Error: Canvas is not loaded.");
      return;
    }
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    if (activeCaptureCard === "front") setPhotoFront(dataUrl);
    if (activeCaptureCard === "side") setPhotoSide(dataUrl);
    if (activeCaptureCard === "closeup") setPhotoCloseUp(dataUrl);
    if (activeCaptureCard === "issue") setPhotoIssue(dataUrl);

    closeCameraModal();
    toast.success(`${WIZARD_STEPS_LABELS[activeCaptureCard || ""]} view photo updated and watermarked!`);
  };

  // Watermark drawing implementation
  const applyWatermarkAndEdits = (imgElement: HTMLImageElement) => {
    const canvas = modalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isRotated90or270 = tempRotation === 90 || tempRotation === 270;
    const targetWidth = isRotated90or270 ? imgElement.naturalHeight : imgElement.naturalWidth;
    const targetHeight = isRotated90or270 ? imgElement.naturalWidth : imgElement.naturalHeight;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.save();
    // 1. Adjustments/Filters
    ctx.filter = `brightness(${tempBrightness}%) contrast(${tempContrast}%) saturate(${tempSaturation}%) grayscale(${tempGrayscale}%)`;

    // 2. Rotation
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((tempRotation * Math.PI) / 180);

    ctx.drawImage(
      imgElement,
      -imgElement.naturalWidth / 2,
      -imgElement.naturalHeight / 2,
      imgElement.naturalWidth,
      imgElement.naturalHeight
    );
    ctx.restore();

    // 3. Draw markup strokes
    const scale = Math.min(targetWidth, targetHeight) / 800;
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

    tempStrokes.forEach(drawSingleStroke);
    if (tempCurrentStroke) {
      drawSingleStroke(tempCurrentStroke);
    }

    // 4. Stamping Watermark text overlay
    const details = tempLocationDetails || {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      timestamp: new Date().toLocaleString(),
      address: "GPS coordinates loading..."
    };

    const baseFontSize = tempTextSize === "sm" ? 12 : tempTextSize === "md" ? 15 : 18;
    const fontSize = Math.max(12, Math.round(baseFontSize * scale));
    const padding = Math.max(16, Math.round(20 * scale));
    const lineSpacing = Math.max(6, Math.round(8 * scale));

    ctx.font = `bold ${fontSize}px sans-serif`;

    const lines: string[] = [];
    if (tempShowAddress && details.address) {
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
    } else if (tempShowAddress) {
      lines.push("📍 Location details recorded");
    }

    if (tempShowCoordinates && details.latitude && details.longitude) {
      lines.push(`🌐 Lat: ${details.latitude.toFixed(6)}°, Lon: ${details.longitude.toFixed(6)}° (±${Math.round(details.accuracy)}m)`);
    }

    if (tempShowTimestamp) {
      lines.push(`📅 ${details.timestamp}`);
    }

    if (tempShowCustomText && tempCustomText.trim()) {
      lines.push(`🏷️ ${tempCustomText.trim()}`);
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

      ctx.fillStyle = tempTheme === "dark"
        ? `rgba(15, 23, 42, ${tempOverlayOpacity})`
        : `rgba(255, 255, 255, ${tempOverlayOpacity})`;
      ctx.fill();

      ctx.lineWidth = Math.max(1, Math.round(1.5 * scale));
      ctx.strokeStyle = tempTheme === "dark" ? `rgba(255, 255, 255, 0.15)` : `rgba(15, 23, 42, 0.15)`;
      ctx.stroke();

      ctx.fillStyle = tempTheme === "dark" ? "#FFFFFF" : "#0F172A";
      ctx.textBaseline = "top";

      lines.forEach((line, index) => {
        const lineY = boxY + padding + index * (fontSize + lineSpacing);
        ctx.fillText(line, boxX + padding, lineY);
      });

      ctx.restore();
    }
  };

  const rotateImage = () => {
    setTempRotation(prev => {
      if (prev === 0) return 90;
      if (prev === 90) return 180;
      if (prev === 180) return 270;
      return 0;
    });
  };

  const clearPhoto = (type: string) => {
    if (type === "front") setPhotoFront(null);
    if (type === "side") setPhotoSide(null);
    if (type === "closeup") setPhotoCloseUp(null);
    if (type === "issue") setPhotoIssue(null);
  };

  const handleTagToggle = (tag: string) => {
    if (cleanlinessTags.includes(tag)) {
      setCleanlinessTags(cleanlinessTags.filter(t => t !== tag));
    } else {
      setCleanlinessTags([...cleanlinessTags, tag]);
    }
  };

  const handleHazardToggle = (hazard: string) => {
    if (safetyHazards.includes(hazard)) {
      setSafetyHazards(safetyHazards.filter(h => h !== hazard));
    } else {
      setSafetyHazards([...safetyHazards, hazard]);
    }
  };

  const handleNotifyOps = () => {
    setNotifyOperations(true);
    toast.warning("Operations team notified immediately of high safety hazard.");
  };

  // --- Wizard Navigation and validations ---
  const handleNext = () => {
    if (step === 1 && !photoFront) {
      toast.error("Please capture at least the FRONT VIEW photo before proceeding.");
      return;
    }
    if (step === 2 && (structureStatus === "Poor" || structureStatus === "Critical")) {
      if (!structureComments) {
        toast.error("Comments are mandatory when structure status is Poor or Critical.");
        return;
      }
      if (!photoIssue) {
        toast.error("An Issue Photo is mandatory under checklist requirements for Poor or Critical structures.");
        return;
      }
    }
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  // --- Document Service API Photo Upload Helpers ---
  const uploadSurveyPhoto = async (photoBase64: string, suffix: string, surveyId: string) => {
    const base64Content = photoBase64.split(",")[1];
    const fileName = `${mediaId}_${suffix}.jpg`;
    await DocumentsService.postApiVDocuments("1", {
      name: fileName,
      description: `Survey ${suffix} photo for audit ${surveyId}`,
      content: base64Content,
      category: "Survey",
      categoryId: surveyId,
      extension: ".jpg",
      contentType: "image/jpeg",
      documentFileName: fileName,
      documentDate: new Date().toISOString(),
    } as any);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      const payload: CreateSurveyCommand = {
        mediaTypeId: surveyDetail?.mediaTypeId || mediaId,
        inspectorEmail: "ops_inspector@outdoors.com",
        surveyDate: new Date().toISOString(),
        weekNumber: Math.floor((new Date().getDate() - 1) / 7) + 1,
        weekNum: surveyDetail?.weekNum || String(Math.floor((new Date().getDate() - 1) / 7) + 1),
        status: "Completed",
        structureStatus,
        structureComments: structureComments || "N/A",
        brandingStatus,
        brandingComments: brandingComments || "N/A",
        powerStatus,
        ledStatus,
        brightnessStatus,
        lightingIssueCategory: ledStatus === "Failed" ? (lightingIssueCategory || "Unknown") : "N/A",
        lightingComments: lightingComments || "N/A",
        housekeepingScore: cleanlinessScore,
        housekeepingTags: cleanlinessTags,
        housekeepingComments: cleanlinessComments || "N/A",
        safetySeverity,
        notifyOperations,
        safetyComments: safetyComments || "N/A",
        compliancePercent: complianceScore,
        issueCount,
        remarks: `Auto calculated score ${complianceScore}%`
      };

      const isEditing = mediaId && !mediaId.startsWith("MED-");
      const res = isEditing
        ? await SurveyService.updateSurvey({ ...payload, surveyId: mediaId } as any)
        : await SurveyService.createSurvey(payload);
      if (res?.success && res?.data?.surveyId) {
        const surveyId = res.data.surveyId;
        
        // Upload captured photos in parallel to Document Service API
        const uploadPromises = [];
        if (photoFront) uploadPromises.push(uploadSurveyPhoto(photoFront, "front", surveyId));
        if (photoSide) uploadPromises.push(uploadSurveyPhoto(photoSide, "side", surveyId));
        if (photoCloseUp) uploadPromises.push(uploadSurveyPhoto(photoCloseUp, "closeup", surveyId));
        if (photoIssue) uploadPromises.push(uploadSurveyPhoto(photoIssue, "issue", surveyId));

        if (uploadPromises.length > 0) {
          toast.loading("Uploading photos to server...", { id: "survey-photo-upload" });
          try {
            await Promise.all(uploadPromises);
            toast.success("All survey photos stored in document registry!", { id: "survey-photo-upload" });
          } catch (uploadErr) {
            console.error("Photos upload failed:", uploadErr);
            toast.error("Failed to upload survey photos, but report was created.", { id: "survey-photo-upload" });
          }
        }

        toast.success("Survey uploaded and compliance report generated successfully!");
        navigate("/survey/supervisor");
      } else {
        throw new Error(res?.message || "Failed to submit survey.");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to upload survey. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const pencilColors = [
    { value: "#EF4444", label: "Red" },
    { value: "#F59E0B", label: "Yellow" },
    { value: "#10B981", label: "Green" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#FFFFFF", label: "White" },
    { value: "#000000", label: "Black" }
  ];

  return (
<div className="flex flex-col min-h-screen bg-background pb-20 text-neutral-800 dark:text-neutral-200">
      {/* Wizard Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base font-bold">Survey Wizard</h1>
            <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 flex-wrap">
              {surveyDetail?.mediaUnitName && (
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {surveyDetail.mediaUnitName}
                </span>
              )}
              {surveyDetail?.mediaTypeName && (
                <>
                  <span className="text-neutral-300 dark:text-neutral-750">•</span>
                  <span className="font-semibold text-primary">{surveyDetail.mediaTypeName}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Wizard Multi-step Indicator */}
        <div className="mt-3.5 flex items-center justify-between gap-1 text-[10px] font-semibold text-neutral-400">
          {WIZARD_STEPS.map((name, idx) => (
            <div key={name} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`h-1.5 w-full rounded-full ${step >= idx + 1 ? "bg-primary" : "bg-neutral-200 dark:bg-neutral-800"}`} />
              <span className={step === idx + 1 ? "text-primary font-bold" : ""}>{name}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 max-w-lg mx-auto w-full space-y-6">
        
        {/* STEP 1: MEDIA PHOTOGRAPHS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Step 1: Media Photographs</h2>
              <p className="text-xs text-neutral-500">Please capture clear views of the asset. GPS tagging is mandatory.</p>
            </div>

            {/* Photo Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Front View *", state: photoFront, key: "front" },
                { label: "Side View", state: photoSide, key: "side" },
                { label: "Close-up", state: photoCloseUp, key: "closeup" },
                { label: "Issue Photo", state: photoIssue, key: "issue" }
              ].map((card) => (
                <div key={card.key} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex flex-col justify-between items-center text-center space-y-3">
                  <span className="text-xs font-semibold">{card.label}</span>
                  
                  {card.state ? (
                    <div className="relative w-full aspect-video rounded bg-neutral-100 dark:bg-neutral-900 border overflow-hidden flex items-center justify-center group">
                      <img src={card.state} alt={card.label} className="w-full h-full object-cover rounded-md" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <Button 
                          size="sm"
                          variant="secondary"
                          className="h-7 text-[10px] px-2 rounded-md bg-white text-black hover:bg-neutral-200"
                          onClick={() => openCameraForCard(card.key)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-7 w-7 rounded-md"
                          onClick={(e) => { e.stopPropagation(); clearPhoto(card.key); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => openCameraForCard(card.key)}
                      className="w-full aspect-video rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center cursor-pointer hover:border-primary/55 bg-neutral-50 dark:bg-neutral-900 transition-colors"
                    >
                      <Camera className="h-6 w-6 text-neutral-400" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 text-[9px] text-neutral-400 font-mono">
                    <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5 text-emerald-500" /> GPS Tagged</span>
                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5 text-emerald-500" /> Timestamped</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: CONDITION */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Step 2: Condition</h2>
              <p className="text-xs text-neutral-500">Inspect the structure stability and branding condition.</p>
            </div>

            {/* Structure Section */}
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
              <Label className="text-sm font-bold block">Structure Condition *</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "Good", color: "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20 active:bg-emerald-500" },
                  { key: "Fair", color: "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20 active:bg-amber-500" },
                  { key: "Poor", color: "hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20 active:bg-orange-500" },
                  { key: "Critical", color: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 active:bg-red-500" }
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setStructureStatus(lvl.key as any)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      structureStatus === lvl.key 
                        ? lvl.key === "Good" ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : lvl.key === "Fair" ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"
                          : lvl.key === "Poor" ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                        : `border-neutral-200 dark:border-neutral-800 ${lvl.color}`
                    }`}
                  >
                    {lvl.key}
                  </button>
                ))}
              </div>

              {(structureStatus === "Poor" || structureStatus === "Critical") && (
                <div className="space-y-3 pt-2 animate-in slide-in-from-top-1 duration-200">
                  <Label className="text-xs text-red-500 font-bold block">Comment (Mandatory for Poor/Critical) *</Label>
                  <Textarea 
                    placeholder="Describe structure issues (e.g. rusting bolts, cracks, bent frame)"
                    value={structureComments}
                    onChange={(e) => setStructureComments(e.target.value)}
                  />

                  {/* Issue Photo Capture Area (UX Optimization) */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 mt-2">
                    <Label className="text-xs text-red-500 font-bold block mb-2">Issue Photo (Mandatory for Poor/Critical) *</Label>
                    {photoIssue ? (
                      <div className="relative w-full h-32 rounded bg-neutral-100 dark:bg-neutral-900 border overflow-hidden flex items-center justify-center group">
                        <img src={photoIssue} alt="Issue photo" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <Button 
                            size="sm"
                            variant="secondary"
                            className="h-7 text-[10px] bg-white text-black hover:bg-neutral-100"
                            onClick={() => openCameraForCard("issue")}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="h-7 w-7 rounded-md"
                            onClick={(e) => { e.stopPropagation(); clearPhoto("issue"); }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openCameraForCard("issue")}
                        className="w-full border-dashed border-2 py-8 rounded-lg flex flex-col gap-1.5 items-center hover:border-red-500 text-neutral-500 hover:text-red-500 transition-all bg-neutral-50/50 dark:bg-neutral-900/30"
                      >
                        <Camera className="h-5 w-5" />
                        <span className="text-[11px] font-semibold">Snap / Upload Issue Photo</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Branding Section */}
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
              <Label className="text-sm font-bold block">Branding Status *</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "Excellent", color: "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20" },
                  { key: "Faded", color: "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20" },
                  { key: "Torn", color: "hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20" },
                  { key: "Missing", color: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" }
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setBrandingStatus(lvl.key as any)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      brandingStatus === lvl.key 
                        ? lvl.key === "Excellent" ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : lvl.key === "Faded" ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"
                          : lvl.key === "Torn" ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                        : `border-neutral-200 dark:border-neutral-800 ${lvl.color}`
                    }`}
                  >
                    {lvl.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LIGHTING / LED */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Step 3: Lighting / LED</h2>
              <p className="text-xs text-neutral-500">Examine electrical supplies and display performance.</p>
            </div>

            {/* Power Section */}
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
              <Label className="text-sm font-bold block">Power Supply Status *</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "Available", color: "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20" },
                  { key: "Outage", color: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" }
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setPowerStatus(lvl.key as any)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      powerStatus === lvl.key 
                        ? lvl.key === "Available" ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                        : `border-neutral-200 dark:border-neutral-800 ${lvl.color}`
                    }`}
                  >
                    {lvl.key}
                  </button>
                ))}
              </div>
            </div>

            {/* LED Screen Section */}
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
              <Label className="text-sm font-bold block">LED Panel Status *</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "Working", color: "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20" },
                  { key: "Partial", color: "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20" },
                  { key: "Failed", color: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" }
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setLedStatus(lvl.key as any)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      ledStatus === lvl.key 
                        ? lvl.key === "Working" ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : lvl.key === "Partial" ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                        : `border-neutral-200 dark:border-neutral-800 ${lvl.color}`
                    }`}
                  >
                    {lvl.key}
                  </button>
                ))}
              </div>

              {ledStatus === "Failed" && (
                <div className="space-y-2 pt-2 animate-in slide-in-from-top-1 duration-200">
                  <Label className="text-xs text-red-500 font-bold block">Issue Category *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Controller", "Power", "Panel", "Network", "Unknown"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setLightingIssueCategory(cat)}
                        className={`py-1.5 text-xs rounded border ${
                          lightingIssueCategory === cat 
                            ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold" 
                            : "border-neutral-200 dark:border-neutral-800"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Brightness Section */}
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
              <Label className="text-sm font-bold block">Screen Brightness Level *</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "Excellent", color: "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20" },
                  { key: "Dim", color: "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20" },
                  { key: "Not Visible", color: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" }
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setBrightnessStatus(lvl.key as any)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      brightnessStatus === lvl.key 
                        ? lvl.key === "Excellent" ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : lvl.key === "Dim" ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                        : `border-neutral-200 dark:border-neutral-800 ${lvl.color}`
                    }`}
                  >
                    {lvl.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CLEANLINESS */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Step 4: Cleanliness</h2>
              <p className="text-xs text-neutral-500">Rate cleanliness score of the media surrounding area.</p>
            </div>

            <div className="bg-white dark:bg-neutral-950 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6 text-center">
              <Label className="text-sm font-bold block text-left">Housekeeping Rating *</Label>
              
              {/* Star Rating Select Control */}
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCleanlinessScore(star)}
                    className="p-1 focus:outline-none transition-transform active:scale-95"
                  >
                    <Star 
                      className={`h-9 w-9 ${
                        cleanlinessScore >= star 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-neutral-200 dark:text-neutral-850"
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-500 block">
                {cleanlinessScore === 5 && "Excellent"}
                {cleanlinessScore === 4 && "Good"}
                {cleanlinessScore === 3 && "Average"}
                {cleanlinessScore === 2 && "Poor"}
                {cleanlinessScore === 1 && "Immediate Action Needed"}
              </span>

              {/* Quick Tags */}
              <div className="space-y-2 pt-2 text-left">
                <Label className="text-xs font-bold text-neutral-400">Quick Observation Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {["Dust", "Trash", "Water Leakage", "Vegetation", "Graffiti"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                        cleanlinessTags.includes(tag)
                          ? "bg-primary border-primary text-primary-foreground font-bold shadow-sm"
                          : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea 
                placeholder="Housekeeping and maintenance comments (optional)..."
                value={cleanlinessComments}
                onChange={(e) => setCleanlinessComments(e.target.value)}
                className="text-left mt-4"
              />
            </div>
          </div>
        )}

        {/* STEP 5: SAFETY */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Step 5: Safety Observations</h2>
              <p className="text-xs text-neutral-500">Record any potential structural or electrical safety concerns.</p>
            </div>

            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
              <Label className="text-sm font-bold block">Safety Hazards Present</Label>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Loose Structure",
                  "Open Wiring",
                  "Water Leakage",
                  "Broken Lighting",
                  "Traffic Hazard",
                  "Unauthorized Access"
                ].map((hazard) => (
                  <button
                    key={hazard}
                    type="button"
                    onClick={() => handleHazardToggle(hazard)}
                    className={`py-3 px-2.5 text-xs rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                      safetyHazards.includes(hazard)
                        ? "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 font-bold"
                        : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300"
                    }`}
                  >
                    <span>{hazard}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity and Operations Notification Trigger */}
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
              <Label className="text-sm font-bold block">Hazard Severity *</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "Low", color: "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20" },
                  { key: "Medium", color: "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20" },
                  { key: "High", color: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" }
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setSafetySeverity(lvl.key as any)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      safetySeverity === lvl.key 
                        ? lvl.key === "Low" ? "bg-emerald-500 border-emerald-500 text-white shadow-md"
                          : lvl.key === "Medium" ? "bg-amber-500 border-amber-500 text-white shadow-md"
                          : "bg-red-600 border-red-600 text-white shadow-md"
                        : `border-neutral-200 dark:border-neutral-800 ${lvl.color}`
                    }`}
                  >
                    {lvl.key}
                  </button>
                ))}
              </div>

              {safetySeverity === "High" && (
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 space-y-3 animate-pulse">
                  <div className="flex gap-2">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <div className="text-left">
                      <h4 className="font-bold text-sm">Critical Safety Alert</h4>
                      <p className="text-xs">High-severity issue requires immediate dispatcher operational notification.</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="w-full text-xs font-bold gap-1"
                    onClick={handleNotifyOps}
                  >
                    Notify Operations Team Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & SUBMIT */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Step 6: Review & Submit</h2>
              <p className="text-xs text-neutral-500">Verify scores and uploads before sending to supervisor portal.</p>
            </div>

            {/* Checklist items status */}
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Mandatory Views Captured
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Yes</span>
              </div>
              <div className="flex justify-between text-sm border-t border-neutral-100 dark:border-neutral-900 pt-2.5">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> GPS Coordinates Tagged
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Yes</span>
              </div>
              <div className="flex justify-between text-sm border-t border-neutral-100 dark:border-neutral-900 pt-2.5">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Checklist Status Checked
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Yes</span>
              </div>
            </div>

            {/* Compliance scoring preview card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-neutral-950 dark:to-neutral-900 border border-primary/20 dark:border-neutral-800 rounded-xl p-5 text-center shadow-sm space-y-3">
              <span className="text-xs text-neutral-500 block uppercase tracking-wider font-bold">Estimated Compliance Score</span>
              <span className={`text-5xl font-extrabold ${complianceScore > 75 ? "text-emerald-500" : complianceScore > 40 ? "text-amber-500" : "text-red-500"}`}>
                {complianceScore}%
              </span>
              <p className="text-xs text-neutral-500">
                Calculated based on {issueCount} identified checklist deviations.
              </p>
            </div>

            {/* Dynamic list of issues */}
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-left space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Identified Issues / Checklist Deviations</h3>
              {issuesList.length > 0 ? (
                <ul className="space-y-1.5">
                  {issuesList.map((issue, index) => (
                    <li key={index} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> No issues detected. Asset fully compliant!
                </p>
              )}
            </div>

            {/* Primary Action Button */}
            <Button 
              className="w-full py-6 text-base font-semibold rounded-xl gap-2 shadow-md bg-primary hover:bg-primary/95 text-primary-foreground"
              disabled={saving}
              onClick={handleSubmit}
            >
              {saving ? "Uploading Survey & Photos..." : "Submit Inspection"}
            </Button>
          </div>
        )}

        {/* Sticky footer nav controls */}
        <div className="flex gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-6">
          {step > 1 && (
            <Button 
              variant="outline" 
              className="flex-1 py-5 rounded-xl border-neutral-200 dark:border-neutral-800"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          {step < 6 && (
            <Button 
              className="flex-1 py-5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>

      </div>

      {/* --- WATERMARK CAMERA MODAL DIALOG --- */}
      <Dialog open={activeCaptureCard !== null} onOpenChange={(open) => { if (!open) closeCameraModal(); }}>
        <DialogContent className="max-w-5xl w-[95vw] h-[92vh] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-neutral-950 border-neutral-800 text-white rounded-2xl">
          <DialogHeader className="px-6 py-4 border-b border-neutral-800 flex flex-row items-center justify-between shrink-0">
            <DialogTitle className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary animate-pulse" />
              GPS Watermark Camera: {activeCaptureCard ? WIZARD_STEPS_LABELS[activeCaptureCard] : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            
            {/* Left Column: Live camera feed or active canvas editor (takes 2/3 space) */}
            <div className="min-h-[50vh] md:min-h-0 md:flex-1 md:w-2/3 bg-neutral-900 flex flex-col p-3 md:p-4 shrink-0 md:shrink relative">
              <div className="flex-1 min-h-[42vh] md:min-h-0 relative rounded-xl border border-neutral-800 bg-neutral-900 flex items-center justify-center overflow-hidden">
                {tempRawImageSrc ? (
                  <div className="w-full h-full flex items-center justify-center p-2 bg-neutral-900 select-none relative">
                    <canvas
                      ref={modalCanvasRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className={`max-w-full max-h-full object-contain rounded-md shadow-lg touch-none ${
                        modalIsDrawMode ? "cursor-crosshair" : "cursor-default"
                      }`}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-emerald-500/80 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-md">
                        <Check className="h-3.5 w-3.5" /> Image Processed
                      </div>
                      {modalIsDrawMode && (
                        <div className="bg-red-500/85 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-md animate-pulse">
                          <Check className="h-3.5 w-3.5" /> Draw active on canvas
                        </div>
                      )}
                    </div>
                  </div>
                ) : modalStream ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      ref={modalVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
                    <div className="absolute top-4 left-4 bg-neutral-900/85 backdrop-blur border border-neutral-850 text-white text-[10px] px-2.5 py-1.5 rounded-md flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Feed
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center p-6 max-w-sm">
                    <div className="rounded-full bg-white/5 p-4 border border-white/10">
                      <Camera className="h-8 w-8 text-neutral-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Camera stream inactive</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        {modalCameraError || "Connect camera feed to capture a watermarked photo, or upload an image file from storage."}
                      </p>
                    </div>
                    <div className="flex gap-2.5">
                      {cameraDevices.length > 0 && (
                        <Button
                          onClick={() => startModalCamera(modalActiveDeviceId)}
                          className="rounded-lg text-xs font-semibold"
                        >
                          Start Camera
                        </Button>
                      )}
                      <label className="rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleModalImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom camera controls row */}
              <div className="mt-3 py-3 px-4 rounded-xl border border-neutral-800 bg-neutral-950/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  {modalStream && (
                    <>
                      <Button
                        onClick={modalCapturePhoto}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 text-xs py-2 px-4 font-bold"
                      >
                        <Camera className="h-4 w-4" /> Snap Photo
                      </Button>
                      {cameraDevices.length > 1 && (
                        <select
                          value={modalActiveDeviceId}
                          onChange={(e) => setModalActiveDeviceId(e.target.value)}
                          className="rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs px-2.5 py-1.5 outline-none cursor-pointer"
                        >
                          {cameraDevices.map((device, idx) => (
                            <option key={device.deviceId} value={device.deviceId}>
                              {device.label || `Camera ${idx + 1}`}
                            </option>
                          ))}
                        </select>
                      )}
                    </>
                  )}
                  {tempRawImageSrc && (
                    <Button
                      onClick={handleModalReset}
                      variant="outline"
                      className="border-neutral-800 hover:bg-neutral-900 text-white text-xs gap-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Take Another
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleModalImageUpload}
                      className="hidden"
                    />
                  </label>
                  {tempRawImageSrc && (
                    <Button
                      onClick={saveCapturedPhoto}
                      className="bg-primary text-primary-foreground gap-1 text-xs py-2 px-4 font-bold shadow-md"
                    >
                      <Check className="h-4 w-4" /> Save & Apply
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Customization and Edit Controls Panel (takes 1/3 space) */}
            {tempRawImageSrc ? (
              <div className="md:w-1/3 bg-neutral-950 p-4 border-t border-neutral-800 md:border-t-0 md:border-l overflow-y-auto max-h-[45vh] md:max-h-none space-y-6">
                
                {/* Pencil drawings annotation tools */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" /> Pencil & Markings
                  </h3>
                  <button
                    onClick={() => setModalIsDrawMode(!modalIsDrawMode)}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      modalIsDrawMode 
                        ? "bg-red-600 hover:bg-red-500 text-white border-red-600 shadow" 
                        : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                    }`}
                  >
                    {modalIsDrawMode ? "Stop Marking" : "Pencil Tool (Draw on Photo)"}
                  </button>

                  {modalIsDrawMode && (
                    <div className="space-y-3.5 pt-1.5 animate-in slide-in-from-top-1">
                      <div>
                        <span className="text-[10px] text-neutral-400 block mb-1.5">Brush Color</span>
                        <div className="flex flex-wrap gap-1.5">
                          {pencilColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setModalPencilColor(color.value)}
                              className={`h-5 w-5 rounded-full border transition-transform ${
                                modalPencilColor === color.value ? "scale-115 border-white ring-2 ring-primary/40" : "border-neutral-800 hover:scale-105"
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-neutral-400">Brush Size</span>
                          <span className="font-mono text-primary font-bold">{modalPencilWidth}px</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="25"
                          value={modalPencilWidth}
                          onChange={(e) => setModalPencilWidth(Number(e.target.value))}
                          className="w-full accent-primary bg-neutral-900 rounded-lg cursor-pointer h-1.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                          onClick={undoLastStroke}
                          disabled={tempStrokes.length === 0}
                          size="sm"
                          variant="outline"
                          className="border-neutral-800 text-[10px] text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40"
                        >
                          <Undo className="h-3 w-3 mr-1" /> Undo ({tempStrokes.length})
                        </Button>
                        <Button
                          onClick={clearStrokes}
                          disabled={tempStrokes.length === 0}
                          size="sm"
                          variant="outline"
                          className="border-neutral-800 text-[10px] text-red-400 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40"
                        >
                          <X className="h-3 w-3 mr-1" /> Clear All
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Adjustments filter controls */}
                <div className="space-y-4 border-t border-neutral-850 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" /> Image Edits
                    </h3>
                    <button
                      onClick={() => {
                        setTempRotation(0);
                        setTempBrightness(100);
                        setTempContrast(100);
                        setTempSaturation(100);
                        setTempGrayscale(0);
                      }}
                      className="text-[10px] text-neutral-500 hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                    <span className="text-[11px] text-neutral-400">Orientation</span>
                    <Button
                      onClick={rotateImage}
                      size="sm"
                      variant="outline"
                      className="border-neutral-800 bg-neutral-900 text-white h-7 px-3 text-[10px]"
                    >
                      <RotateCw className="h-3 w-3 mr-1" /> Rotate {tempRotation}°
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-neutral-400">Brightness</span>
                      <span className="font-mono text-neutral-300">{tempBrightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={tempBrightness}
                      onChange={(e) => setTempBrightness(Number(e.target.value))}
                      className="w-full accent-primary bg-neutral-900 rounded-lg cursor-pointer h-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-neutral-400">Contrast</span>
                      <span className="font-mono text-neutral-300">{tempContrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={tempContrast}
                      onChange={(e) => setTempContrast(Number(e.target.value))}
                      className="w-full accent-primary bg-neutral-900 rounded-lg cursor-pointer h-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-neutral-400">Saturation</span>
                      <span className="font-mono text-neutral-300">{tempSaturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={tempSaturation}
                      onChange={(e) => setTempSaturation(Number(e.target.value))}
                      className="w-full accent-primary bg-neutral-900 rounded-lg cursor-pointer h-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-neutral-400">Grayscale Filter</span>
                      <span className="font-mono text-neutral-300">{tempGrayscale}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tempGrayscale}
                      onChange={(e) => setTempGrayscale(Number(e.target.value))}
                      className="w-full accent-primary bg-neutral-900 rounded-lg cursor-pointer h-1.5"
                    />
                  </div>
                </div>

                {/* Watermark Details overlay customizer */}
                <div className="space-y-4 border-t border-neutral-850 pt-4 text-left">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" /> Overlay Details
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 block font-semibold">Custom Text Label</label>
                    <textarea
                      value={tempCustomText}
                      onChange={(e) => setTempCustomText(e.target.value)}
                      placeholder="Custom label on watermark..."
                      className="w-full min-h-[48px] rounded-lg bg-neutral-900 border border-neutral-800 text-xs p-2 outline-none focus:border-primary/55 resize-none text-white"
                    />
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-400 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={tempShowAddress}
                        onChange={(e) => setTempShowAddress(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-neutral-800 bg-neutral-900 text-primary focus:ring-primary/50"
                      />
                      <span>📍 Address Location</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-400 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={tempShowCoordinates}
                        onChange={(e) => setTempShowCoordinates(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-neutral-800 bg-neutral-900 text-primary focus:ring-primary/50"
                      />
                      <span>🌐 Lat, Long coordinates</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-400 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={tempShowTimestamp}
                        onChange={(e) => setTempShowTimestamp(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-neutral-800 bg-neutral-900 text-primary focus:ring-primary/50"
                      />
                      <span>📅 Date & timestamp</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-400 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={tempShowCustomText}
                        onChange={(e) => setTempShowCustomText(e.target.checked)}
                        disabled={!tempCustomText.trim()}
                        className="h-3.5 w-3.5 rounded border-neutral-800 bg-neutral-900 text-primary focus:ring-primary/50 disabled:opacity-30"
                      />
                      <span className={!tempCustomText.trim() ? "opacity-30" : ""}>🏷️ Custom Text label</span>
                    </label>
                  </div>

                  {/* Watermark Styling attributes */}
                  <div className="space-y-3 pt-3 border-t border-neutral-850">
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-1.5">Watermark Theme</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTempTheme("dark")}
                          className={`py-1 rounded text-[10px] font-semibold border ${
                            tempTheme === "dark" ? "bg-neutral-900 border-primary text-white" : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"
                          }`}
                        >
                          Dark Base
                        </button>
                        <button
                          type="button"
                          onClick={() => setTempTheme("light")}
                          className={`py-1 rounded text-[10px] font-semibold border ${
                            tempTheme === "light" ? "bg-white border-primary text-black" : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"
                          }`}
                        >
                          Light Base
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-1.5">Font Size</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["sm", "md", "lg"] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setTempTextSize(sz)}
                            className={`py-1 rounded text-[10px] capitalize font-semibold border ${
                              tempTextSize === sz ? "bg-primary border-primary text-primary-foreground" : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-neutral-400">Overlay Opacity</span>
                        <span className="font-mono text-neutral-300">{Math.round(tempOverlayOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={tempOverlayOpacity * 100}
                        onChange={(e) => setTempOverlayOpacity(Number(e.target.value) / 100)}
                        className="w-full accent-primary bg-neutral-900 rounded-lg cursor-pointer h-1.5"
                      />
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="md:w-1/3 bg-neutral-950 p-6 border-t border-neutral-800 md:border-t-0 md:border-l border-neutral-800 flex flex-col items-center justify-center text-center text-neutral-500 min-h-[6rem] md:min-h-0">
                <Info className="h-6 w-6 text-neutral-700 mb-2" />
                <p className="text-xs">Take or upload a photo to customize options, markup details, or apply geocoded details.</p>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
