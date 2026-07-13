"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Upload,
  Trash2,
  ExternalLink,
  FileImage,
  Loader2,
  Download,
  LayoutGrid,
  List,
  FolderOpen,
  File,
  FileVideo,
  FileCode,
  FileSpreadsheet,
  CloudUpload,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocumentsService } from "@/api/services/DocumentsService";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import { getFileExtension, getMimeType } from "@/utils/file-utils";
import { FilePreviewDialog } from "@/components/FilePreview";
import { Badge } from "@/components/ui/badge";
import { useConfirmation } from "@/contexts/ConfirmationContext";

type ViewMode = "grid" | "list";

export default function DocumentsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirm } = useConfirmation();
  const projectId =
    searchParams.get("projectId") || localStorage.getItem("activeProjectId");

  const [documents, setDocuments] = useState<DocumentUrlListVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentUrlListVM | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    if (!projectId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const res = await DocumentsService.getApiVDocuments("1", "Project", projectId);
      if (res.success && res.data) setDocuments(res.data);
      else toast.error(res.message || "Failed to fetch documents");
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("An error occurred while loading documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, [projectId]);

  const uploadFile = async (file: File) => {
    if (!file || !projectId) return;
    setIsUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || "");
        reader.onerror = reject;
      });
      const base64Content = base64.split(",")[1];
      const ext = getFileExtension(file.name);
      const extension = ext.startsWith(".") ? ext : `.${ext}`;
      const res = await DocumentsService.postApiVDocuments("1", {
        name: file.name,
        description: `Project document: ${file.name}`,
        content: base64Content,
        category: "Project",
        categoryId: projectId,
        extension,
        contentType: file.type || getMimeType(file.name),
        documentFileName: file.name,
        documentDate: new Date().toISOString(),
      } as any);
      if (res.success) { toast.success("Document uploaded"); fetchDocuments(); }
      else toast.error(res.message || "Failed to upload document");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDelete = async (docId: string) => {
    const isConfirmed = await confirm({
      title: "Delete Document",
      message: "Are you sure you want to delete this document? This action cannot be undone.",
      confirmLabel: "Delete",
      variant: "destructive",
    });
    if (!isConfirmed) return;
    try {
      const res = await DocumentsService.deleteDocumentUrl(docId, "1");
      if ((res as any).success) {
        toast.success("Document deleted");
        setDocuments((prev) => prev.filter((d) => (d as any).documentUrlID !== docId));
      } else toast.error("Failed to delete document");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("An error occurred while deleting");
    }
  };

  const getDocIcon = (ext: string, size = 20) => {
    const e = ext.toLowerCase().replace(".", "");
    const cls = `h-[${size}px] w-[${size}px]`;
    const primaryColor = "hsl(var(--primary))";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(e))
      return <FileImage className={cls} style={{ color: "white" }} />;
    if (e === "pdf")
      return <FileText className={cls} style={{ color: primaryColor }} />;
    if (["mp4", "mov", "avi", "mkv"].includes(e))
      return <FileVideo className={cls} style={{ color: primaryColor }} />;
    if (["xlsx", "xls", "csv"].includes(e))
      return <FileSpreadsheet className={cls} style={{ color: primaryColor }} />;
    if (["js", "ts", "tsx", "jsx", "html", "css", "json"].includes(e))
      return <FileCode className={cls} style={{ color: primaryColor }} />;
    return <File className={cls} style={{ color: primaryColor }} />;
  };

  const getDocIconBg = (ext: string) => {
    return "bg-primary";
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "pdf", label: "PDF" },
    { key: "image", label: "Images" },
    { key: "other", label: "Other" },
  ];

  const filteredDocs = documents.filter((doc) => {
    const nameMatch = doc.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const ext = (doc.extension || "").toLowerCase().replace(".", "");
    if (activeFilter === "pdf") return nameMatch && ext === "pdf";
    if (activeFilter === "image") return nameMatch && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
    if (activeFilter === "other") return nameMatch && !["pdf", "jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
    return nameMatch;
  });

  const stats = [
    { label: "Total Files", value: documents.length },
    { label: "PDFs", value: documents.filter((d) => (d.extension || "").toLowerCase().includes("pdf")).length },
    { label: "Images", value: documents.filter((d) => ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes((d.extension || "").toLowerCase().replace(".", ""))).length },
  ];

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-muted-foreground">
        <div className="p-6 rounded-full bg-muted/30 mb-5">
          <FolderOpen size={48} className="opacity-40" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-1">No Project Selected</h2>
        <p className="text-sm">Please select a project to view its documents.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-1 py-2">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Documents</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Manage and organize files for this project.</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8 h-9 text-sm bg-muted/40 border-border/60 focus:border-primary/50 rounded-xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-muted/40 border border-border/50 rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* File View */}
          <Button
            onClick={() => navigate(`/file-system?category=Project&categoryId=${projectId}`)}
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl h-9 px-4 text-sm font-medium border-border/60 hover:bg-muted transition-all"
          >
            <Layers className="h-3.5 w-3.5 text-primary" />
            File View
          </Button>

          {/* Upload */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            size="sm"
            className="gap-1.5 rounded-xl h-9 px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
          >
            {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 bg-card/60 border border-border/50 rounded-2xl px-4 py-3 backdrop-blur-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
              <p className="text-lg font-bold text-foreground leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${activeFilter === f.key
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted/70 hover:text-foreground"
              }`}
          >
            {f.label}
          </button>
        ))}
        {filteredDocs.length > 0 && (
          <span className="ml-auto text-[11px] text-muted-foreground">
            {filteredDocs.length} file{filteredDocs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── CONTENT ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading documents…</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        /* ── DROP ZONE / EMPTY STATE ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDraggingOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/50 bg-muted/10 hover:border-primary/40 hover:bg-muted/20"
            }`}
        >
          <div className={`p-4 rounded-full mb-3 transition-all ${isDraggingOver ? "bg-primary/10" : "bg-muted/30"}`}>
            <CloudUpload className={`h-8 w-8 transition-all ${isDraggingOver ? "text-primary scale-110" : "text-muted-foreground/50"}`} />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            {isDraggingOver ? "Drop to upload" : "No documents yet"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isDraggingOver ? "Release to upload your file" : "Drag & drop or click to upload"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ── GRID VIEW ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 rounded-2xl transition-all ${isDraggingOver ? "ring-2 ring-primary/40 bg-primary/5" : ""
            }`}
        >
          {filteredDocs.map((doc) => (
            <div
              key={(doc as any).documentUrlID || doc.documentID}
              onClick={() => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
              className="group relative flex flex-col p-4 bg-card/80 border border-border/100 rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              {/* Top row: icon + actions */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${getDocIconBg(doc.extension || "")} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  {getDocIcon(doc.extension || "", 18)}
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/file-system?category=Project&categoryId=${projectId}&documentId=${doc.documentID}`)}
                    title="File View"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Layers className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
                    title="Preview"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => { const url = doc.url || doc.blobUrl; if (url) window.open(url, "_blank"); }}
                    title="Download"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete((doc as any).documentUrlID as string)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Name + badge */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate leading-snug mb-1.5" title={doc.name}>
                  {doc.name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="px-2 py-0 text-[9px] uppercase font-bold tracking-wide rounded-md border-none bg-muted/60"
                  >
                    {(doc.extension || "FILE").replace(".", "")}
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {/* Drop zone card */}
          {isDraggingOver && (
            <div className="flex flex-col items-center justify-center h-full min-h-[120px] rounded-2xl border-2 border-dashed border-primary/60 bg-primary/5">
              <CloudUpload className="h-6 w-6 text-primary mb-1" />
              <p className="text-xs text-primary font-medium">Drop here</p>
            </div>
          )}
        </div>
      ) : (
        /* ── LIST VIEW ── */
        <div className="bg-card/60 border border-border/100 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-2.5 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground border-b border-border/40 bg-muted/20">
            <span className="w-8" />
            <span>Name</span>
            <span className="text-right w-16">Type</span>
            <span className="text-right w-20">Actions</span>
          </div>

          {filteredDocs.map((doc, idx) => (
            <div
              key={(doc as any).documentUrlID || doc.documentID}
              onClick={() => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
              className={`group grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-3.5 cursor-pointer hover:bg-muted/30 transition-all ${idx < filteredDocs.length - 1 ? "border-b border-border/30" : ""
                }`}
            >
              <div className={`w-8 h-8 rounded-lg ${getDocIconBg(doc.extension || "")} flex items-center justify-center shrink-0`}>
                {getDocIcon(doc.extension || "", 14)}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate" title={doc.name}>{doc.name}</p>

              </div>

              <Badge
                variant="secondary"
                className="px-2 py-0 text-[12px] text-primary uppercase font-bold tracking-wide rounded-md border-none bg-muted/60 w-16 text-center justify-center"
              >
                {(doc.extension || "FILE").replace(".", "")}
              </Badge>

              <div className="flex items-center gap-0.5  transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => navigate(`/file-system?category=Project&categoryId=${projectId}&documentId=${doc.documentID}`)}
                  title="File View"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <Layers className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => { setSelectedDoc(doc); setIsPreviewOpen(true); }}
                  title="Preview"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => { const url = doc.url || doc.blobUrl; if (url) window.open(url, "_blank"); }}
                  title="Download"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete((doc as any).documentUrlID as string)}
                  title="Delete"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FILE PREVIEW DIALOG */}
      <FilePreviewDialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          setIsPreviewOpen(open);
          if (!open) setSelectedDoc(null);
        }}
        document={selectedDoc}
        categoryId={projectId}
      />
    </div>
  );
}
