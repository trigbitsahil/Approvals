"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FileText, ImageIcon } from "lucide-react";
import { FormDataService } from "@/api/services/FormDataService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { clientConfig } from "@/config/client";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
}

interface MediaFile {
  name: string;
  type: string;
  size: number;
  data: string; // base64 data URL
}

interface MediaItem {
  type: "poster" | "slideshow" | "pdf";
  files: MediaFile[]; // Changed from File[] to MediaFile[]
  urls?: string[];
}

const PdfViewer = ({ url, filename }: { url: string; filename: string }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground font-medium">No PDF URL provided</p>
      </div>
    );
  }

  // Using unpkg for the worker matching the pdfjs-dist version in package.json
  const workerUrl = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  return (
    <div className="w-full h-full relative group flex items-center justify-center bg-slate-900/50">
      <div className="w-full h-full overflow-hidden">
        <Worker workerUrl={workerUrl}>
          <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
      {/* <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 shadow-md"
          onClick={() => window.open(url, "_blank")}
        >
          View Fullscreen
        </Button>
      </div> */}
    </div>
  );
};

export default function MediaFormPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // if used, else remove
  const location = useLocation();
  const [formData, setFormData] = useState<{
    name: string;
    fields: FormField[];
    values?: Record<string, any>;
    media?: MediaItem;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmissionView, setIsSubmissionView] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.padding = "0";
      document.body.style.margin = "0";
      document.body.style.height = "100dvh";
    }

    const fetchForm = async () => {
      try {
        if (id) {
          const response = await FormDataService.getFormDataById(id, "1");
          const form = response.data;
          if (form) {
            let fields = [];
            let values = {};
            if (form.templateRow) {
              try {
                const parsed = JSON.parse(form.templateRow);
                fields = parsed.fields || [];

                const submissionData = location.state?.submissionData;
                if (submissionData) {
                  setIsSubmissionView(true);
                  try {
                    values = JSON.parse(submissionData);
                  } catch (e) {
                    values = parsed.values || {};
                  }
                } else {
                  setIsSubmissionView(false);
                  values = parsed.values || {};
                }
              } catch (e) { }
            }
            // Fetch media from DocumentsService
            let media = undefined;
            try {
              const mediaRes = await DocumentsService.getApiVDocuments("1", "FormData", id);
              if (mediaRes.success && mediaRes.data && mediaRes.data.length > 0) {
                const docs = mediaRes.data;
                const hasPdf = docs.some(d => d.extension?.toLowerCase().includes("pdf"));
                const type = (docs.length > 1) ? "slideshow" : (hasPdf ? "pdf" : "poster");

                media = {
                  type: type as any,
                  files: docs.map(d => ({
                    name: d.name || "File",
                    type: d.extension?.toLowerCase() === "pdf" ? "application/pdf" : "image/jpeg",
                    size: 0,
                    data: d.url || d.blobUrl || ""
                  })),
                  urls: docs.map(d => d.url || d.blobUrl || "").filter(url => !!url)
                };
              } else if (form.templateRow) {
                // Fallback to templateRow if API returns nothing
                try {
                  const parsed = JSON.parse(form.templateRow);
                  media = parsed.media || undefined;
                } catch (e) { }
              }
            } catch (e) {
              console.error("Error fetching media from API:", e);
            }

            setFormData({
              name: form.formLinkName || "Untitled Form",
              fields: fields,
              values: values,
              media: media,
            });
          }
        }
      } catch (error) {
        console.error("Error loading form:", error);
        toast.error("Failed to load form from server");
      } finally {
        setIsLoading(false);
        // Force carousel/layout recalculation on first render
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 100);
      }
    };

    fetchForm();

    return () => {
      document.body.style.overflow = "";
      document.body.style.padding = "";
      document.body.style.margin = "";
      document.body.style.height = "";
    };
  }, [id, location.state?.submissionData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p>Loading preview...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p>Form not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen md:h-screen bg-background transition-colors duration-300">
      {/* Media Preview Section (Left Side) */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-card border-b md:border-b-0 md:border-r border-border overflow-hidden flex flex-col">
        {formData.media ? (
          <div className="flex-1 flex flex-col min-h-0 h-full">
            {formData.media.type === "pdf" && (formData.media.urls?.[0] || formData.media.files?.[0]?.data) && (
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 h-full overflow-hidden bg-accent/5 relative">
                  <PdfViewer
                    url={formData.media.urls?.[0] || formData.media.files?.[0]?.data || ""}
                    filename={formData.media.files[0]?.name || "Document.pdf"}
                  />
                </div>
                <div className="flex justify-end items-center shrink-0 py-2 px-3 border-t border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 hover:bg-accent"
                    onClick={() =>
                      window.open(
                        formData.media?.urls?.[0] ||
                        formData.media?.files?.[0]?.data,
                        "_blank"
                      )
                    }
                  >
                    View Source
                  </Button>
                </div>
              </div>
            )}
            {formData.media.type === "poster" && (formData.media.urls?.[0] || formData.media.files?.[0]?.data) && (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-full max-w-[480px] aspect-[4/3] flex items-center justify-center overflow-hidden bg-muted/10 rounded-lg border border-border/30">
                  <img
                    src={formData.media.urls?.[0] || formData.media.files?.[0]?.data || "/placeholder.svg"}
                    alt="Poster"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error("Image failed to load:", e.currentTarget.src);
                      e.currentTarget.src = "https://placehold.co/600x400?text=Image+Load+Error";
                    }}
                  />
                </div>
              </div>
            )}
            {formData.media.type === "slideshow" && (formData.media.urls?.length || formData.media.files?.length) && (
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden w-full">
                  <Carousel className="w-full h-full flex flex-col">
                    <CarouselContent className="h-full">
                      {(formData.media.urls || formData.media.files?.map(f => f.data)).map((url, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className="flex items-center justify-center w-full h-full">
                            {url?.toLowerCase().includes(".pdf") ? (
                              <div className="w-full h-full">
                                <PdfViewer url={url} filename={formData.media.files[index]?.name || "Document.pdf"} />
                              </div>
                            ) : (
                              <div className="w-full max-w-[600px] aspect-[4/3] flex items-center justify-center overflow-hidden bg-muted/10 rounded-lg border border-border/30">
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`Slide ${index + 1}`}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/600x400?text=Image+Load+Error";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-4 py-3 shrink-0">
                      <CarouselPrevious className="static translate-y-0 text-foreground border-border hover:bg-accent" />
                      <CarouselNext className="static translate-y-0 text-foreground border-border hover:bg-accent" />
                    </div>
                  </Carousel>
                </div>
              </div>
            )}
            {!formData.media.urls?.length && !formData.media.files?.length && (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="h-16 w-16 mb-2" />
                <p>No media files found for type: {formData.media.type}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="h-24 w-24 mb-4" />
            <p className="text-lg font-medium">No media attached to this form</p>
            <p className="text-sm">Use the form dashboard to upload media files.</p>
          </div>
        )}
      </div>

      {/* Form Preview Section (Right Side) */}
      <div className="w-full md:w-1/2 flex-1 md:h-full overflow-auto p-4 md:p-8 bg-background/50">
        <h2 className="text-xl font-bold mb-6 text-foreground">Form Preview</h2>
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h1 className="text-2xl font-bold mb-6 text-card-foreground">{formData.name}</h1>
          <div className="space-y-4">
            {formData.fields.length > 0 ? (
              formData.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </label>
                  {renderField(field, formData.values?.[field.id])}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No fields in this form</p>
            )}

            {/* reCAPTCHA Section */}
            {/* <div className="mt-8 pt-6 border-t border-border">
              {isSubmissionView ? (
                <div className="flex items-center gap-3 p-4 bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800 dark:text-green-300">Identity Verified</p>
                    <p className="text-xs text-green-600/80 dark:text-green-400/60">reCAPTCHA verification completed at time of submission</p>
                  </div>
                </div>
              ) : clientConfig.recaptcha.key ? (
                <ReCAPTCHA
                  sitekey={clientConfig.recaptcha.key}
                  size="normal"
                />
              ) : (
                <div className="p-3 border border-amber-200 bg-amber-50 rounded text-amber-800 text-xs">
                  reCAPTCHA Site Key missing
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderField(field: FormField, savedValue?: any) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "phone":
      return (
        <input
          type={field.type}
          placeholder={field.placeholder}
          value={savedValue || ""}
          className="w-full p-2 bg-background border border-input rounded text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          readOnly
        />
      );
    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          value={savedValue || ""}
          className="w-full p-2 bg-background border border-input rounded h-24 text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          readOnly
        />
      );
    case "select":
      return (
        <select
          value={savedValue || ""}
          className="w-full p-2 bg-background border border-input rounded text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          disabled
        >
          <option value="">{field.placeholder || "Select an option"}</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case "radio":
    case "radioGroup":
      return (
        <div className="space-y-2">
          {field.options?.map((opt, i) => (
            <label key={i} className="flex items-center space-x-2 text-foreground">
              <input
                type="radio"
                name={`radio-${field.label}`}
                value={opt.value}
                checked={savedValue === opt.value}
                className="text-primary"
                readOnly
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-center space-x-2 text-foreground">
          <input
            type="checkbox"
            checked={savedValue || false}
            className="text-primary rounded border-input"
            readOnly
          />
          <span>{field.label}</span>
        </label>
      );
    case "toggle":
      return (
        <div className="flex items-center space-x-2">
          <div
            className={`w-12 h-6 rounded-full ${savedValue ? "bg-primary" : "bg-muted"
              } relative transition-colors border border-input`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${savedValue ? "translate-x-6" : "translate-x-0.5"
                }`}
            />
          </div>
          <span className="text-sm text-foreground">{savedValue ? "On" : "Off"}</span>
        </div>
      );
    case "date":
      return (
        <input
          type="date"
          value={
            savedValue ? new Date(savedValue).toISOString().split("T")[0] : ""
          }
          className="w-full p-2 bg-background border border-input rounded text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          readOnly
        />
      );
    case "time":
      return (
        <input
          type="time"
          value={savedValue || ""}
          className="w-full p-2 bg-background border border-input rounded text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          readOnly
        />
      );
    case "file":
    case "image":
      return (
        <div className="border-2 border-dashed border-border rounded p-4 bg-accent/5">
          {savedValue ? (
            <div className="space-y-2">
              {Array.isArray(savedValue) ? (
                savedValue.map((file: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-2 text-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{savedValue.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(savedValue.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No file uploaded</p>
          )}
        </div>
      );
    default:
      return (
        <input
          type="text"
          placeholder="Unknown field type"
          value={savedValue || ""}
          className="w-full p-2 bg-background border border-input rounded text-foreground"
          readOnly
        />
      );
  }
}
