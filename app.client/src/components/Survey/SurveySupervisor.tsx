import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Filter, 
  FileDown, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  CheckSquare, 
  Calendar,
  Users,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SurveyService, SurveyListVM } from "@/api/services/SurveyService";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import exportFromJSON from "export-from-json";

export default function SurveySupervisor() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<SurveyListVM[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterWeek, setFilterWeek] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
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

  // Fallback mock surveys if DB is empty to demonstrate UI fully
  const mockRecentSurveys = [
    { id: "SRV-001", type: "LED Billboard", date: "May 27, 2026", inspector: "inspector_ops@outdoors.com", compliance: "95%", status: "Approved" },
    { id: "SRV-002", type: "Hoarding", date: "May 26, 2026", inspector: "inspector_ops@outdoors.com", compliance: "78%", status: "Needs Action" },
    { id: "SRV-003", type: "Digital Screen", date: "May 24, 2026", inspector: "admin_inspect@outdoors.com", compliance: "42%", status: "Critical" },
    { id: "SRV-004", type: "Pole Kiosk", date: "May 23, 2026", inspector: "inspector_ops@outdoors.com", compliance: "98%", status: "Approved" },
    { id: "SRV-005", type: "Transit Media", date: "May 22, 2026", inspector: "admin_inspect@outdoors.com", compliance: "83%", status: "Approved" }
  ];

  const getExportRows = () => {
    if (surveys.length > 0) {
      return surveys.map((srv) => ({
        "Survey ID": srv.surveyId ?? "-",
        "Media Asset": srv.mediaTypeId ?? "-",
        "Inspection Date": srv.surveyDate ? new Date(srv.surveyDate).toLocaleDateString() : "-",
        "Auditor": srv.inspectorEmail ?? "-",
        "Compliance Score": srv.compliancePercent != null ? `${srv.compliancePercent}%` : "-",
        "Status": srv.status ?? "-",
      }));
    }
    return mockRecentSurveys.map((srv) => ({
      "Survey ID": srv.id,
      "Media Asset": srv.type,
      "Inspection Date": srv.date,
      "Auditor": srv.inspector,
      "Compliance Score": srv.compliance,
      "Status": srv.status,
    }));
  };

  const handleExport = (format: "pdf" | "excel") => {
    const rows = getExportRows();
    const reportDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    if (format === "pdf") {
      const doc = new jsPDF({ orientation: "landscape" });

      // Header
      doc.setFontSize(16);
      doc.setTextColor(30, 30, 30);
      doc.text("Weekly Compliance Report — Supervisor Portal", 14, 16);
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated on: ${reportDate}`, 14, 23);

      // Summary row
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(`Total Assets: ${metrics.totalAssets}   |   Completed: ${metrics.completed}   |   Avg Compliance: ${metrics.avgCompliance}%   |   Pending: ${metrics.pending}   |   Critical: ${metrics.critical}`, 14, 31);

      // Table
      autoTable(doc, {
        startY: 36,
        head: [["Survey ID", "Media Asset", "Inspection Date", "Auditor", "Compliance Score", "Status"]],
        body: rows.map((r) => Object.values(r)),
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold", fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        styles: { cellPadding: 3, overflow: "linebreak" },
        columnStyles: { 0: { cellWidth: 36 }, 3: { cellWidth: 55 } },
      });

      // Compliance trend table
      const trendY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.text("Weekly Compliance Trend", 14, trendY);
      autoTable(doc, {
        startY: trendY + 4,
        head: [["Week", "Compliance Score"]],
        body: complianceTrendData.map((d) => [d.name, `${d.score}%`]),
        headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        styles: { cellPadding: 3 },
      });

      doc.save(`Weekly_Compliance_Report_${reportDate.replace(/ /g, "_")}.pdf`);
      toast.success("PDF downloaded successfully!");

    } else {
      // Excel export via export-from-json
      exportFromJSON({
        data: rows,
        fileName: `Weekly_Compliance_Report_${reportDate.replace(/ /g, "_")}`,
        exportType: exportFromJSON.types.xls,
      });
      toast.success("Excel file downloaded successfully!");
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  // ── Computed metrics from actual survey data ──────────────────────────────
  const metrics = useMemo(() => {
    if (surveys.length === 0) return { totalAssets: 6, completed: 4, avgCompliance: "80.2", pending: 2, critical: 1 };
    const active = surveys.filter((s) => !s.isVoided);
    const totalAssets = new Set(active.map((s) => s.mediaTypeId)).size;
    const completed = active.filter((s) => s.status?.toLowerCase() === "completed").length;
    const pending = active.filter((s) => s.status?.toLowerCase() !== "completed").length;
    const critical = active.filter((s) => s.structureStatus?.toLowerCase() === "critical" || s.safetySeverity?.toLowerCase() === "high").length;
    const scores = active.map((s) => s.compliancePercent ?? 0);
    const avgCompliance = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "0.0";
    return { totalAssets, completed, pending, critical, avgCompliance };
  }, [surveys]);

  // ── Weekly Compliance Trend (group by weekNumber) ────────────────────────
  const complianceTrendData = useMemo(() => {
    if (surveys.length === 0) return [
      { name: "Week 1", score: 92 }, { name: "Week 2", score: 88 },
      { name: "Week 3", score: 80 }, { name: "Week 4", score: 85 },
    ];
    const weekMap: Record<number, number[]> = {};
    surveys.filter((s) => !s.isVoided).forEach((s) => {
      const w = s.weekNumber ?? 0;
      if (!weekMap[w]) weekMap[w] = [];
      weekMap[w].push(s.compliancePercent ?? 0);
    });
    return Object.keys(weekMap).sort((a, b) => Number(a) - Number(b)).map((w) => ({
      name: `Week ${w}`,
      score: parseFloat((weekMap[Number(w)].reduce((a, b) => a + b, 0) / weekMap[Number(w)].length).toFixed(1)),
    }));
  }, [surveys]);

  // ── Issues by Category (structure / lighting / safety) ───────────────────
  const issuesByCategoryData = useMemo(() => {
    if (surveys.length === 0) return [
      { name: "Structure", count: 3 }, { name: "Lighting", count: 2 }, { name: "Safety", count: 1 },
    ];
    const active = surveys.filter((s) => !s.isVoided);
    const structure = active.filter((s) => s.structureStatus && s.structureStatus.toLowerCase() !== "good" && s.structureStatus.toLowerCase() !== "ok").length;
    const lighting = active.filter((s) => s.lightingIssueCategory && s.lightingIssueCategory.toLowerCase() !== "n/a" && s.lightingIssueCategory.toLowerCase() !== "none").length;
    const safety = active.filter((s) => s.safetySeverity && s.safetySeverity.toLowerCase() !== "none" && s.safetySeverity.toLowerCase() !== "low").length;
    return [
      { name: "Structure", count: structure },
      { name: "Lighting", count: lighting },
      { name: "Safety", count: safety },
    ];
  }, [surveys]);

  // ── Media Type Performance (group by mediaTypeId) ────────────────────────
  const mediaTypeData = useMemo(() => {
    if (surveys.length === 0) return [
      { name: "Hoarding", value: 35 }, { name: "LED", value: 40 }, { name: "Kiosk", value: 25 },
    ];
    const mediaMap: Record<string, number> = {};
    surveys.filter((s) => !s.isVoided).forEach((s) => {
      const key = s.mediaTypeId ?? "Unknown";
      mediaMap[key] = (mediaMap[key] ?? 0) + 1;
    });
    return Object.entries(mediaMap).map(([name, value]) => ({ name, value }));
  }, [surveys]);

  const filteredSurveys = surveys.filter(srv => {
    let match = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      match = match && (
        srv.surveyId?.toLowerCase().includes(q) ||
        srv.mediaTypeId?.toLowerCase().includes(q) ||
        srv.inspectorEmail?.toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") {
      // In real app, you'd map "led" to specific MED IDs or have a type field
      // Here we do a generic check or let it pass if no direct mapping exists
      if (filterType === "led" && !srv.mediaTypeId?.includes("002")) match = false;
      if (filterType === "hoarding" && !srv.mediaTypeId?.includes("001")) match = false;
      if (filterType === "digital" && !srv.mediaTypeId?.includes("003")) match = false;
    }
    if (filterWeek !== "all") {
      const wNumber = parseInt(filterWeek.replace("w", ""));
      if (srv.weekNumber !== wNumber) match = false;
    }
    return match;
  });

  const filteredMockSurveys = mockRecentSurveys.filter(srv => {
    let match = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      match = match && (
        srv.id.toLowerCase().includes(q) ||
        srv.type.toLowerCase().includes(q) ||
        srv.inspector.toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") {
      const t = srv.type.toLowerCase();
      if (filterType === "led" && !t.includes("led")) match = false;
      if (filterType === "hoarding" && !t.includes("hoarding")) match = false;
      if (filterType === "digital" && !t.includes("digital")) match = false;
    }
    if (filterWeek !== "all") {
      // Mock data dates are string, not easily mapped to week without complex parsing
      // For demo, we'll just skip strict week filtering on mock data
    }
    return match;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12 text-neutral-800 dark:text-neutral-200">
      
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/survey")} className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Supervisor Portal</h1>
            <p className="text-xs text-neutral-500">Weekly Outdoor Asset Audits & Scoring</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleExport("pdf")}>
            <FileDown className="h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleExport("excel")}>
            <FileDown className="h-4 w-4" /> Export Excel
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Core Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 rounded-lg"><Layers className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Total Media Types</span>
              <span className="text-xl font-bold">{metrics.totalAssets} Assets</span>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-lg"><CheckSquare className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Completed Surveys</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.completed} Completed</span>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg"><TrendingUp className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Weekly Compliance</span>
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{metrics.avgCompliance}% Score</span>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-lg"><Calendar className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Pending Inspections</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{metrics.pending} Pending</span>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg"><AlertTriangle className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Critical Issues</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">{metrics.critical} Warning{metrics.critical !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </section>

        {/* Analytics Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Weekly Compliance Trend</h2>
            <div className="h-64 w-full bg-muted/30 rounded-lg border border-border p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Issues by Category</h2>
            <div className="h-64 w-full bg-muted/30 rounded-lg border border-border p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issuesByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Media Type Performance</h2>
            <div className="h-64 w-full bg-muted/30 rounded-lg border border-border p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mediaTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mediaTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '11px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Filter Toolbar controls */}
        <section className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
              <Input 
                className="pl-9 h-9 text-xs rounded-lg" 
                placeholder="Search inspections..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 h-9 text-xs rounded-lg">
                <SelectValue placeholder="Media Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="led">LED Billboard</SelectItem>
                <SelectItem value="hoarding">Hoarding</SelectItem>
                <SelectItem value="digital">Digital Screen</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterWeek} onValueChange={setFilterWeek}>
              <SelectTrigger className="w-40 h-9 text-xs rounded-lg">
                <SelectValue placeholder="Select Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weeks</SelectItem>
                <SelectItem value="w1">Week 1 (May 01 - 07)</SelectItem>
                <SelectItem value="w2">Week 2 (May 08 - 14)</SelectItem>
                <SelectItem value="w3">Week 3 (May 15 - 21)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-neutral-500" onClick={fetchSurveys}>
            Refresh Feed
          </Button>
        </section>

        {/* Recent Survey table */}
        <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-bold text-base">Weekly Audit History</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-neutral-400">
                  <th className="px-6 py-3">Survey ID</th>
                  <th className="px-6 py-3">Media Asset</th>
                  <th className="px-6 py-3">Inspection Date</th>
                  <th className="px-6 py-3">Auditor</th>
                  <th className="px-6 py-3">Compliance Score</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                
                {/* Dynamically render recent surveys from API if loaded */}
                {surveys.length > 0 ? (
                  filteredSurveys.length > 0 ? (
                    filteredSurveys.map((srv) => (
                      <tr 
                        key={srv.surveyId} 
                        onClick={() => navigate(`/survey/detail/${srv.surveyId}`)}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs">{srv.surveyId.substring(0, 12)}...</td>
                        <td className="px-6 py-4 font-semibold">{srv.mediaTypeId}</td>
                        <td className="px-6 py-4">{srv.surveyDate ? new Date(srv.surveyDate).toLocaleDateString() : "-"}</td>
                        <td className="px-6 py-4 text-xs">{srv.inspectorEmail}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${srv.compliancePercent && srv.compliancePercent > 75 ? "text-emerald-500" : "text-amber-500"}`}>
                            {srv.compliancePercent}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none">
                            {srv.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-neutral-400 text-sm">
                        No surveys found matching your filters.
                      </td>
                    </tr>
                  )
                ) : (
                  filteredMockSurveys.length > 0 ? (
                    filteredMockSurveys.map((srv) => (
                      <tr 
                        key={srv.id} 
                        onClick={() => toast.info("This is a demo survey. Actual surveys will open details.")}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs">{srv.id}</td>
                        <td className="px-6 py-4 font-semibold">{srv.type}</td>
                        <td className="px-6 py-4">{srv.date}</td>
                        <td className="px-6 py-4 text-xs">{srv.inspector}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${srv.status === "Approved" ? "text-emerald-500" : srv.status === "Needs Action" ? "text-amber-500" : "text-red-500"}`}>
                            {srv.compliance}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`border-none ${
                            srv.status === "Approved" 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                              : srv.status === "Needs Action"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" 
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}>
                            {srv.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-neutral-400 text-sm">
                        No surveys found matching your filters.
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

    </div>
  );
}
