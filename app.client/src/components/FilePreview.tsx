"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getFileIcon, getMimeType } from "@/utils/file-utils";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import React, { useEffect, useCallback, useState } from "react";
import { Download, AlertCircle } from "lucide-react";
import { CustomOpenAPIConfig } from "@/api/custom/OpenAPIConfig";

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentUrlListVM | null;
  category?: string;
  categoryId?: string;
}

const PdfViewer = ({ url }: { url: string }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground font-medium">No PDF URL provided</p>
      </div>
    );
  }

  // Using unpkg for the worker matching the pdfjs-dist version in package.json
  const workerUrl = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  return (
    <div className="w-full h-[70vh] relative group flex items-center justify-center bg-slate-900/50 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="w-full h-full overflow-hidden">
        <Worker workerUrl={workerUrl}>
          <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    </div>
  );
};

export function FilePreviewDialog({
  open,
  onOpenChange,
  document,
  category = "Project",
  categoryId,
}: FilePreviewDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState<any[]>([]);
  // Determine mime type: prefer explicit detection from name, but if name
  // doesn't contain an extension (or is generic), try to infer from the URL
  // or blobUrl (checking for common image extensions or data URIs).
  let mimeType = getMimeType(document?.name ?? "");
  const fileUrl = document?.url || document?.blobUrl || "";

  // If the name-based detection returned generic/octet-stream, try to infer
  // from the URL or data URI. This fixes cases where images are served via
  // blob URLs or URLs without filename extensions (inventory image case).
  if ((mimeType === "application/octet-stream" || !mimeType) && fileUrl) {
    const lower = fileUrl.toLowerCase();
    if (lower.startsWith("data:image/")) {
      // data URI like data:image/png;base64,...
      const match = lower.match(/^data:(image\/[a-z0-9.+-]+);/);
      if (match) mimeType = match[1];
    } else if (lower.includes(".png") || lower.includes(".jpg") || lower.includes(".jpeg") || lower.includes(".gif") || lower.includes(".webp")) {
      if (lower.includes(".png")) mimeType = "image/png";
      else if (lower.includes(".jpg") || lower.includes(".jpeg")) mimeType = "image/jpeg";
      else if (lower.includes(".gif")) mimeType = "image/gif";
      else if (lower.includes(".webp")) mimeType = "image/webp";
    } else if (lower.startsWith("blob:")) {
      // For blob: URLs we don't have the extension, but they are often images
      // when used for previews. Optimistically treat blob: as image if the
      // document metadata or name hints at image.
      const nameLower = (document?.name || "").toLowerCase();
      if (nameLower.includes(".png") || nameLower.includes(".jpg") || nameLower.includes(".jpeg") || nameLower.includes(".gif") || nameLower.includes("image") || nameLower.includes(".webp")) {
        // prefer jpeg as a safe default for images without explicit type
        mimeType = nameLower.includes("png") ? "image/png" : nameLower.includes("webp") ? "image/webp" : "image/jpeg";
      }
    }
  }
  const Icon = getFileIcon(document?.name ?? "");
  // fileUrl already defined above

  const downloadFile = useCallback(() => {
    if (fileUrl && document?.name) {
      const link = window.document.createElement("a");
      link.href = fileUrl;
      link.download = document.name;
      link.click();
    }
  }, [fileUrl, document?.name]);

  useEffect(() => {
    if (open && document) {
      setIsLoading(false);
      setPages([]);
    }
  }, [open, document]);

  if (!document) return null;

  const renderPreviewContent = () => {
    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Icon className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium">No preview available.</p>
          <p className="text-sm">The file URL is missing or invalid.</p>
        </div>
      );
    }

    /** ---------- Image ---------- */
    if (mimeType.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          alt={document.name ?? "File preview"}
          className="max-w-full max-h-[70vh] object-contain mx-auto shadow-md rounded-lg"
          onLoad={() => setIsLoading(false)}
        />
      );
    }

    /** ---------- PDF ---------- */
    if (mimeType === "application/pdf") {
      return <PdfViewer url={fileUrl} />;
    }

    /** ---------- Unsupported file ---------- */
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-amber-500/20">
          <AlertCircle className="h-12 w-12" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-foreground uppercase tracking-tight">Preview not available</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
            This file type cannot be previewed directly. You can download it to view locally.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={downloadFile}
            variant="outline"
            className="rounded-2xl h-12 px-8 gap-2 font-black uppercase text-xs border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-600 transition-all"
          >
            <Download className="h-4 w-4" />
            Download File
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary" />
            {document.name ?? "File Preview"}
          </DialogTitle>
          <DialogDescription>
            {document.description ?? "No description available."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 w-full">
          {renderPreviewContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
