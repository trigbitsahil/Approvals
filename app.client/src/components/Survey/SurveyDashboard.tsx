import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  FileText,
  User,
  Smartphone,
  Play,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import pptxgen from "pptxgenjs";
import { SurveyService, SurveyListVM } from "@/api/services/SurveyService";
import { DocumentsService } from "@/api/services/DocumentsService";

interface MediaAsset {
  id: string;
  type: string;
  distance: string;
  lastSurvey: string;
  status: "completed" | "pending" | "overdue";
  location: string;
}

export default function SurveyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [online, setOnline] = useState(navigator.onLine);
  const [surveys, setSurveys] = useState<SurveyListVM[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [weekFilter, setWeekFilter] = useState<string>("all");

  const uniqueWeeks = React.useMemo(() => {
    const weeks = surveys
      .map(s => s.weekNum)
      .filter((w): w is string => !!w);
    return Array.from(new Set(weeks)).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  }, [surveys]);

  const filteredSurveys = React.useMemo(() => {
    let result = surveys;

    // Filter by Status
    if (statusFilter !== "all") {
      if (statusFilter === "completed") {
        result = result.filter(s => s.status?.toLowerCase() === "completed");
      } else if (statusFilter === "pending") {
        result = result.filter(s => s.status?.toLowerCase() === "pending");
      } else if (statusFilter === "inprogress") {
        result = result.filter(s => ["inprogress", "in progress", "in-progress"].includes(s.status?.toLowerCase() || ""));
      }
    }

    // Filter by Week
    if (weekFilter !== "all") {
      result = result.filter(s => s.weekNum === weekFilter);
    }

    return result;
  }, [surveys, statusFilter, weekFilter]);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    loadRecentSurveys();
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadRecentSurveys = async () => {
    try {
      setLoading(true);
      const res = await SurveyService.getSurveys();
      if (res?.success && res.data) {
        setSurveys(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPPT = async () => {
    try {
      toast.loading("Generating PowerPoint presentation...", { id: "ppt-export" });
      const pptx = new pptxgen();
      pptx.layout = "LAYOUT_16x9";

      // 1. Cover Slide
      let cover = pptx.addSlide();
      cover.background = { fill: "F8FAFC" };
      cover.addText("Weekly Media Survey Audit Report", { x: 0.8, y: 1.8, w: 8.5, h: 1, fontSize: 32, bold: true, color: "2563EB" });
      cover.addText(`Selected Week: ${weekFilter === "all" ? "All Weeks" : "Week " + weekFilter}`, { x: 0.8, y: 2.8, w: 8.5, h: 0.5, fontSize: 20, color: "1E293B" });
      cover.addText(`Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, { x: 0.8, y: 3.5, w: 8.5, h: 0.5, fontSize: 14, color: "64748B" });

      // 2. Overview Slide (including Pending and In Progress)
      let overview = pptx.addSlide();
      overview.background = { fill: "FFFFFF" };
      overview.addText("Week Summary & Asset Statuses", { x: 0.5, y: 0.4, w: 9, h: 0.5, fontSize: 22, bold: true, color: "1E293B" });

      const weekSurveys = weekFilter === "all" ? surveys : surveys.filter(s => s.weekNum === weekFilter);

      const completedCount = weekSurveys.filter(s => s.status?.toLowerCase() === "completed").length;
      const pendingCount = weekSurveys.filter(s => s.status?.toLowerCase() === "pending").length;
      const inProgressCount = weekSurveys.filter(s => ["inprogress", "in progress", "in-progress"].includes(s.status?.toLowerCase() || "")).length;

      overview.addText(`Completed: ${completedCount}  |  Pending: ${pendingCount}  |  In Progress: ${inProgressCount}`, { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 14, bold: true, color: "2563EB" });

      const tableRows = [
        [
          { text: "Asset / Media Unit", options: { bold: true, fill: "F1F5F9", color: "1E293B" } },
          { text: "Media Type", options: { bold: true, fill: "F1F5F9", color: "1E293B" } },
          { text: "Weekly Status", options: { bold: true, fill: "F1F5F9", color: "1E293B" } }
        ]
      ];

      weekSurveys.forEach(s => {
        let statusLabel = s.status || "Pending";
        tableRows.push([
          { text: s.mediaUnitName || s.mediaTypeId || "N/A", options: {} },
          { text: s.mediaTypeName || "N/A", options: {} },
          { text: statusLabel, options: { color: statusLabel.toLowerCase() === "completed" ? "10B981" : statusLabel.toLowerCase() === "pending" ? "F59E0B" : "3B82F6" } }
        ]);
      });

      overview.addTable(tableRows, { x: 0.5, y: 1.4, w: 9, h: 3.8, colWidths: [4.5, 3.0, 1.5], fontSize: 11 });

      // 3. Completed Surveys Detailed Slides
      const completedSurveys = weekSurveys.filter(s => s.status?.toLowerCase() === "completed");

      for (let i = 0; i < completedSurveys.length; i++) {
        const item = completedSurveys[i];
        const [detailRes, docsRes] = await Promise.all([
          SurveyService.getSurveyById(item.surveyId).catch(() => null),
          DocumentsService.getApiVDocuments("1", "Survey", item.surveyId).catch(() => null)
        ]);

        if (detailRes?.success && detailRes.data) {
          const detail = detailRes.data;

          let slide = pptx.addSlide();
          slide.background = { fill: "F8FAFC" };

          slide.addText(`${detail.mediaUnitName || "Media Audit"} - Inspection Details`, { x: 0.5, y: 0.4, w: 9, h: 0.5, fontSize: 20, bold: true, color: "1E293B" });
          slide.addText(`Type: ${detail.mediaTypeName || "N/A"}  |  Compliance: ${detail.compliancePercent ?? 0}%  |  Score: ${detail.housekeepingScore ?? 0}/5`, { x: 0.5, y: 0.9, w: 9, h: 0.3, fontSize: 11, color: "64748B" });

          const detailsText = 
            `Structure Condition: ${detail.structureStatus || "N/A"} (${detail.structureComments || "No comment"})\n` +
            `Branding Status: ${detail.brandingStatus || "N/A"} (${detail.brandingComments || "No comment"})\n` +
            `Power Supply: ${detail.powerStatus || "N/A"}\n` +
            `LED Panel Status: ${detail.ledStatus || "N/A"}\n` +
            `Brightness Level: ${detail.brightnessStatus || "N/A"}\n` +
            `Safety Severity: ${detail.safetySeverity || "N/A"} (${detail.safetyComments || "No comment"})\n` +
            `Inspector: ${detail.inspectorEmail || "N/A"}`;

          slide.addText(detailsText, { x: 0.5, y: 1.4, w: 4.5, h: 3.6, fontSize: 12, color: "334155", bullet: true });

          if (docsRes?.success && docsRes.data && docsRes.data.length > 0) {
            let images = docsRes.data.filter(
              (d: any) => d.category?.toLowerCase() === "survey" && 
                (String(d.categoryId || "") === String(item.surveyId) || String(d.categoryID || "") === String(item.surveyId))
            );

            // Fallback: If strict filters yield nothing, grab any JPG/PNG images returned for this survey
            if (images.length === 0) {
              images = docsRes.data.filter(
                (d: any) => d.extension?.toLowerCase() === ".jpg" || 
                  d.extension?.toLowerCase() === ".jpeg" || 
                  d.extension?.toLowerCase() === ".png"
              );
            }

            const numImages = Math.min(images.length, 4);
            for (let imgIdx = 0; imgIdx < numImages; imgIdx++) {
              const img = images[imgIdx];
              let imageSourceOption: any = null;
              
              const imgUrl = img.blobUrl || img.url;
              if (img.content) {
                const mime = img.contentType || "image/jpeg";
                imageSourceOption = { data: `${mime};base64,${img.content}` };
              } else if (imgUrl) {
                imageSourceOption = { path: imgUrl };
              }
              
              if (imageSourceOption) {
                const label = img.name?.split("_").pop()?.replace(".jpg", "") ?? `Photo ${imgIdx + 1}`;
                
                // Determine 2x2 grid position
                const row = Math.floor(imgIdx / 2);
                const col = imgIdx % 2;
                
                const imgX = 5.2 + col * 2.3;
                const imgY = 1.3 + row * 1.8;
                const imgW = 2.1;
                const imgH = 1.4;
                
                slide.addImage({
                  ...imageSourceOption,
                  x: imgX,
                  y: imgY,
                  w: imgW,
                  h: imgH
                });
                slide.addText(`${label} view`, { x: imgX, y: imgY + imgH, w: imgW, h: 0.25, fontSize: 8, align: "center", color: "64748B" });
              }
            }
          } else {
            slide.addText("No inspection photos available.", { x: 5.3, y: 2.5, w: 3.5, h: 1, fontSize: 13, color: "94A3B8" });
          }
        }
      }

      const fileName = `Weekly_Audit_Report_Week_${weekFilter}.pptx`;
      await pptx.writeFile({ fileName });
      toast.success("PowerPoint Audit presentation downloaded successfully!", { id: "ppt-export" });
    } catch (error: any) {
      console.error("PPT Export failed:", error);
      toast.error("Failed to export PPT report: " + error.message, { id: "ppt-export" });
    }
  };

  // Mock initial media assets for field inspection demonstration
  const mockAssets: MediaAsset[] = [
    { id: "MED-001", type: "Hoarding", distance: "0.2 km", lastSurvey: "7 days ago", status: "completed", location: "Sector 17 Plaza" },
    { id: "MED-002", type: "LED Billboard", distance: "1.5 km", lastSurvey: "12 days ago", status: "pending", location: "Highway Flyover" },
    { id: "MED-003", type: "Digital Screen", distance: "2.1 km", lastSurvey: "15 days ago", status: "overdue", location: "Mall Atrium A" },
    { id: "MED-004", type: "Pole Kiosk", distance: "3.0 km", lastSurvey: "3 days ago", status: "completed", location: "Metro Station Exit" },
    { id: "MED-005", type: "Transit Media", distance: "4.2 km", lastSurvey: "10 days ago", status: "pending", location: "Main Bus Terminal" },
    { id: "MED-006", type: "Wall Wrap", distance: "5.8 km", lastSurvey: "20 days ago", status: "overdue", location: "Commercial Hub Wall" },
  ];

  const handleSync = () => {
    toast.success("Offline data sync completed successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 text-neutral-800 dark:text-neutral-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Weekly Media Survey</h1>
          <p className="text-xs text-neutral-500">Field Inspector Portal</p>
        </div>
        <div className="flex items-center gap-3">
          {online ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 gap-1">
              <Wifi className="h-3.5 w-3.5" /> Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <WifiOff className="h-3.5 w-3.5" /> Offline Mode
            </Badge>
          )}
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 max-w-lg mx-auto w-full space-y-6">
        {/* Key Metrics Dashboard */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setStatusFilter("all")}
            className={`bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-between cursor-pointer transition-all ${
              statusFilter === "all" ? "ring-2 ring-primary border-primary bg-primary/5" : "border-border hover:border-neutral-350"
            }`}
          >
            <span className="text-xs text-neutral-500 block">Assigned</span>
            <span className="text-xl font-bold">{surveys.length}</span>
          </div>
          <div
            onClick={() => setStatusFilter("completed")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              statusFilter === "completed" 
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20" 
                : "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:border-emerald-300"
            }`}
          >
            <span className={`text-xs block ${statusFilter === "completed" ? "text-white/80" : "text-emerald-600 dark:text-emerald-400"}`}>Completed</span>
            <span className={`text-xl font-bold ${statusFilter === "completed" ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`}>
              {surveys.filter((s) => s.status?.toLowerCase() === "completed").length}
            </span>
          </div>
          <div
            onClick={() => setStatusFilter("pending")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              statusFilter === "pending" 
                ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20" 
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 hover:border-amber-300"
            }`}
          >
            <span className={`text-xs block ${statusFilter === "pending" ? "text-white/80" : "text-amber-600 dark:text-amber-400"}`}>Pending</span>
            <span className={`text-xl font-bold ${statusFilter === "pending" ? "text-white" : "text-amber-600 dark:text-amber-400"}`}>
              {surveys.filter((s) => s.status?.toLowerCase() === "pending").length}
            </span>
          </div>
          <div
            onClick={() => setStatusFilter("inprogress")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              statusFilter === "inprogress" 
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" 
                : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 hover:border-blue-300"
            }`}
          >
            <span className={`text-xs block ${statusFilter === "inprogress" ? "text-white/80" : "text-blue-600 dark:text-blue-400"}`}>In Progress</span>
            <span className={`text-xl font-bold ${statusFilter === "inprogress" ? "text-white" : "text-blue-600 dark:text-blue-400"}`}>
              {surveys.filter((s) => ["inprogress", "in progress", "in-progress"].includes(s.status?.toLowerCase() || "")).length}
            </span>
          </div>
        </section>
 

 
        {/* Assigned Assets Feed */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Assigned Weekly Surveys</h2>
            <Button variant="link" size="sm" className="text-xs" onClick={() => navigate("/survey/supervisor")}>
              Supervisor Board
            </Button>
          </div>
 
          {/* Week Filter Dropdown */}
          {uniqueWeeks.length > 0 && (
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500">Filter by Week:</span>
                <select
                  value={weekFilter}
                  onChange={(e) => setWeekFilter(e.target.value)}
                  className="rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-3 py-1.5 font-semibold outline-none cursor-pointer text-neutral-800 dark:text-neutral-200 focus:border-primary/55"
                >
                  <option value="all">All Weeks</option>
                  {uniqueWeeks.map((week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleExportPPT}
                className="text-xs px-3.5 py-1.5 h-auto rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5"
              >
                Export PPT
              </Button>
            </div>
          )}

          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-neutral-500 text-center py-4">Loading surveys...</p>
            ) : surveys.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No surveys assigned to your teams.</p>
            ) : filteredSurveys.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">
                No surveys found matching status: "{statusFilter}" and week: "{weekFilter}".
              </p>
            ) : (
              filteredSurveys.map((survey) => {
                const statusLower = survey.status?.toLowerCase() || "";
                return (
                  <div
                    key={survey.surveyId}
                    onClick={() => {
                      if (statusLower === "completed") {
                        navigate(`/survey/detail/${survey.surveyId}`);
                      } else {
                        navigate(`/survey/wizard/${survey.surveyId}`);
                      }
                    }}
                    className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary/40 transition-colors duration-150"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0 pr-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                          {survey.mediaUnitName || "Unknown Media Unit"}
                        </span>
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-none">
                          {survey.mediaTypeName || "Unknown Type"}
                        </Badge>
                      </div>
                      <h3 className="text-xs text-neutral-500 font-medium">Week: {survey.weekNum || "N/A"}</h3>
                    </div>
 
                    <div className="flex items-center gap-2">
                      {statusLower === "completed" && (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none font-bold px-2.5 py-1 text-[11px] shadow-sm">
                          Completed
                        </Badge>
                      )}
                      {(statusLower === "inprogress" || statusLower === "in progress" || statusLower === "in-progress") && (
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none font-bold px-2.5 py-1 text-[11px] shadow-sm">
                          In Progress
                        </Badge>
                      )}
                      {statusLower === "pending" && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none font-bold px-2.5 py-1 text-[11px] shadow-sm">
                          Pending
                        </Badge>
                      )}
                      {!["completed", "inprogress", "in progress", "in-progress", "pending"].includes(statusLower) && (
                        <Badge className="bg-neutral-600 hover:bg-neutral-700 text-white border-none font-bold px-2.5 py-1 text-[11px] shadow-sm">
                          {survey.status}
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Bottom Sticky Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 py-2.5 px-6 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-primary font-medium" : "text-neutral-400"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Home</span>
        </button>
        <button
          onClick={() => { setActiveTab("media"); navigate("/survey/media/MED-002"); }}
          className={`flex flex-col items-center gap-1 ${activeTab === "media" ? "text-primary font-medium" : "text-neutral-400"}`}
        >
          <MapPin className="h-5 w-5" />
          <span className="text-[10px]">Media</span>
        </button>
        <button
          onClick={() => { setActiveTab("reports"); navigate("/survey/supervisor"); }}
          className={`flex flex-col items-center gap-1 ${activeTab === "reports" ? "text-primary font-medium" : "text-neutral-400"}`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-[10px]">Reports</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-1 ${activeTab === "profile" ? "text-primary font-medium" : "text-neutral-400"}`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
