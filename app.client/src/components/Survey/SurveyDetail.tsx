import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Percent, AlertTriangle, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SurveyService, SurveyDetailVM } from "@/api/services/SurveyService";
import { DocumentsService } from "@/api/services/DocumentsService";

const statusColor = (val?: string) => {
  if (!val) return "text-neutral-400";
  const v = val.toLowerCase();
  if (["good", "excellent", "working", "available", "completed"].includes(v)) return "text-emerald-600 dark:text-emerald-400";
  if (["fair", "dim", "partial", "faded"].includes(v)) return "text-amber-500";
  if (["poor", "torn", "failed", "outage", "missing"].includes(v)) return "text-orange-500";
  if (["critical", "not visible"].includes(v)) return "text-red-600";
  return "text-neutral-600 dark:text-neutral-300";
};

const complianceColor = (score?: number) => {
  if (score == null) return "text-neutral-400";
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-500";
  return "text-red-600";
};

interface DocumentVM {
  documentId?: string;
  documentUrlID?: string;
  name?: string;
  content?: string;
  contentType?: string;
  category?: string;
  categoryId?: string;
  categoryID?: string;
  extension?: string;
  documentFileName?: string;
  blobUrl?: string;
}

export default function SurveyDetail() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<SurveyDetailVM | null>(null);
  const [images, setImages] = useState<DocumentVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId) return;
    const load = async () => {
      try {
        setLoading(true);
        const [surveyRes, docsRes] = await Promise.all([
          SurveyService.getSurveyById(surveyId),
          DocumentsService.getApiVDocuments("1", "Survey", surveyId).catch(() => null),
        ]);

        if (surveyRes?.success && surveyRes.data) {
          setSurvey(surveyRes.data);
        } else {
          toast.error("Survey not found.");
        }

        if (docsRes?.success && docsRes.data) {
          const surveyDocs = docsRes.data.filter(
            (d: DocumentVM) => d.category === "Survey" && (d.categoryId === surveyId || d.categoryID === surveyId)
          );
          setImages(surveyDocs);
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load survey details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [surveyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-neutral-500">Loading survey details...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <p className="text-neutral-500">Survey not found.</p>
          <Button variant="outline" onClick={() => navigate("/survey/supervisor")}>Go Back</Button>
        </div>
      </div>
    );
  }

  const fields = [
    { label: "Structure", value: survey.structureStatus, comments: survey.structureComments },
    { label: "Branding", value: survey.brandingStatus, comments: survey.brandingComments },
    { label: "Power Supply", value: survey.powerStatus },
    { label: "LED Panel", value: survey.ledStatus },
    { label: "Brightness", value: survey.brightnessStatus },
    { label: "Lighting Issue", value: survey.lightingIssueCategory, comments: survey.lightingComments },
    { label: "Safety Severity", value: survey.safetySeverity, comments: survey.safetyComments },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-neutral-800 dark:text-neutral-200 pb-12">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-6 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            {survey.mediaUnitName || "Survey Detail"}
          </h1>
          <p className="text-xs text-neutral-500 font-semibold text-primary">
            {survey.mediaTypeName || "Asset"}
          </p>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* Summary Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div>
            <p className="text-xs text-neutral-400 font-medium mb-1 flex items-center gap-1"><User className="h-3.5 w-3.5" /> Media Asset</p>
            <p className="font-bold text-base">{survey.mediaUnitName || "N/A"}</p>
            {survey.mediaTypeName && <p className="text-xs text-primary font-semibold">{survey.mediaTypeName}</p>}
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium mb-1 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Survey Date</p>
            <p className="font-semibold text-sm">{survey.surveyDate ? new Date(survey.surveyDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium mb-1 flex items-center gap-1"><Percent className="h-3.5 w-3.5" /> Compliance</p>
            <p className={`font-bold text-xl ${complianceColor(survey.compliancePercent)}`}>{survey.compliancePercent ?? 0}%</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium mb-1">Status</p>
            <Badge className={`text-xs border-none ${survey.status?.toLowerCase() === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
              {survey.status}
            </Badge>
          </div>
          <div className="col-span-2 md:col-span-4 pt-2 border-t border-border">
            <p className="text-xs text-neutral-400 font-medium mb-1">Inspector</p>
            <p className="text-sm">{survey.inspectorEmail}</p>
          </div>
          {survey.issueCount != null && (
            <div>
              <p className="text-xs text-neutral-400 font-medium mb-1 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Issues Found</p>
              <p className={`font-bold text-base ${survey.issueCount > 0 ? "text-red-600" : "text-emerald-500"}`}>{survey.issueCount}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-neutral-400 font-medium mb-1">Week #</p>
            <p className="font-semibold">{survey.weekNum ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium mb-1">Housekeeping Score</p>
            <p className="font-semibold">{survey.housekeepingScore ?? "—"} / 10</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium mb-1">Notify Ops?</p>
            <p className={`font-semibold ${survey.notifyOperations ? "text-red-600" : "text-neutral-500"}`}>{survey.notifyOperations ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* Inspection Checklist */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-bold text-base flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Inspection Checklist</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-neutral-400">
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fields.map((f) => (
                <tr key={f.label} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3 font-medium text-xs text-neutral-500">{f.label}</td>
                  <td className={`px-6 py-3 font-semibold ${statusColor(f.value)}`}>{f.value || "—"}</td>
                  <td className="px-6 py-3 text-xs text-neutral-500 italic">{f.comments || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remarks */}
        {survey.remarks && (
          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <p className="text-xs font-semibold text-neutral-400 mb-1">Remarks</p>
            <p className="text-sm">{survey.remarks}</p>
          </div>
        )}

        {/* Survey Photos */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-bold text-base flex items-center gap-2"><ImageIcon className="h-4 w-4 text-primary" /> Survey Photos {images.length > 0 && <span className="text-xs font-normal text-neutral-400">({images.length} photo{images.length !== 1 ? "s" : ""})</span>}</h2>
          </div>
          {images.length === 0 ? (
            <div className="px-6 py-10 text-center text-neutral-400 text-sm">No photos uploaded for this survey.</div>
          ) : (
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, i) => {
                const src = img.blobUrl ? img.blobUrl : (img.content ? `data:${img.contentType || "image/jpeg"};base64,${img.content}` : null);
                const label = img.name?.split("_").pop()?.replace(".jpg", "") ?? `Photo ${i + 1}`;
                return (
                  <div key={img.documentUrlID || img.documentId || i} className="space-y-1.5">
                    <div
                      className="aspect-video rounded-lg border border-border overflow-hidden bg-muted/30 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => src && setSelectedImage(src)}
                    >
                      {src ? (
                        <img src={src} alt={label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 text-center capitalize font-medium">{label} view</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Survey photo"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
