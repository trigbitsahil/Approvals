import { useEffect, useRef } from "react";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import type { DocumentFileViewItem, DocumentPageDetail } from "./types";

interface DocumentViewerProps {
  document: DocumentFileViewItem | null;
  currentPageIndex: number;
  onPageChange: (idx: number) => void;
}

interface PageImageProps {
  page: DocumentPageDetail;
  isActive: boolean;
  extension?: string | null;
}

function PageImage({ page, isActive }: PageImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const redraw = () => {
      const rect = img.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      if (!page.coordinates?.length) return;

      const ctx = canvas.getContext("2d");
      if (!ctx || !img.naturalWidth) return;

      const scaleX = rect.width / img.naturalWidth;
      const scaleY = rect.height / img.naturalHeight;

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      
      page.coordinates.forEach((coord) => {
        const x = coord.x1 * scaleX;
        const y = coord.y1 * scaleY;
        const w = (coord.x2 - coord.x1) * scaleX;
        const h = (coord.y2 - coord.y1) * scaleY;
        ctx.strokeRect(x, y, w, h);
      });
    };

    const observer = new ResizeObserver(() => {
      if (img.complete) {
        requestAnimationFrame(redraw);
      }
    });

    observer.observe(img);
    if (img.complete) redraw();
    else img.addEventListener("load", redraw);

    return () => {
      observer.disconnect();
      img.removeEventListener("load", redraw);
    };
  }, [page]);

  return (
    <div
      className="relative inline-block w-full mb-12"
      style={{ outline: isActive ? "2px solid hsl(var(--primary))" : "none" }}
    >
      {page.imageBlobUrl ? (
        <>
          <img
            ref={imgRef}
            src={page.imageBlobUrl}
            alt={`Page ${page.pageNum}`}
            className="w-full block shadow-lg rounded-xl"
            style={{ display: "block" }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
          />
        </>
      ) : (
        <div className="h-64 flex items-center justify-center bg-muted text-muted-foreground text-sm rounded-xl border-2 border-dashed">
          Page {page.pageNum} — content not available
        </div>
      )}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full px-3 py-1 shadow-lg uppercase tracking-wider">
        Page {page.pageNum}
      </div>
    </div>
  );
}

export function DocumentViewer({
  document,
  currentPageIndex,
  onPageChange,
}: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const pages = containerRef.current.querySelectorAll<HTMLDivElement>(
      "[data-page-index]"
    );
    if (pages[currentPageIndex]) {
      pages[currentPageIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Scroll thumbnail into view
    if (scrollRef.current) {
      const thumbs = scrollRef.current.querySelectorAll<HTMLDivElement>(".page-thumb");
      if (thumbs[currentPageIndex]) {
        thumbs[currentPageIndex].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentPageIndex]);

  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 bg-muted/5">
        <div className="p-6 rounded-full bg-muted/20 border border-border/50 animate-pulse">
          <FileText className="h-16 w-16 opacity-20" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-foreground/50">No document selected</p>
          <p className="text-xs">Pick a record from the list to view its contents</p>
        </div>
      </div>
    );
  }

  const pages = document.documentPageDetailList ?? [];

  if (pages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
        <div className="p-4 rounded-full bg-muted/10">
          <FileText className="h-8 w-8 opacity-20" />
        </div>
        <p className="text-sm font-medium">No pages available for this document.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Horizontal Page Navigator */}
      {pages.length > 1 && (
        <div className="shrink-0 border-b bg-muted/10 backdrop-blur-sm z-20">
          <div className="px-4 py-2 flex items-center justify-between border-b border-border/40">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Document Pages ({pages.length})
            </h3>
          </div>
          
          <div className="relative group/nav">
            <div 
              ref={scrollRef}
              className="flex items-center gap-3 overflow-x-auto p-4 scrollbar-none scroll-smooth h-32"
            >
              {pages.map((page, idx) => (
                <div
                  key={page.documentUrlTextId ?? idx}
                  onClick={() => onPageChange(idx)}
                  className={cn(
                    "page-thumb shrink-0 cursor-pointer relative rounded-lg overflow-hidden border-2 transition-all duration-300 w-20 aspect-[3/4] shadow-sm",
                    idx === currentPageIndex
                      ? "border-primary ring-4 ring-primary/10 scale-105 z-10 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-primary/40 hover:scale-105"
                  )}
                >
                  {page.imageBlobUrl ? (
                    <img
                      src={page.imageBlobUrl}
                      alt={`Page ${page.pageNum}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-[10px] font-bold text-muted-foreground">P{page.pageNum}</span>
                    </div>
                  )}
                  <div className={cn(
                    "absolute bottom-0 inset-x-0 text-center text-[9px] font-black py-0.5 backdrop-blur-sm",
                    idx === currentPageIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-black/40 text-white"
                  )}>
                    {page.pageNum}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Viewer */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-muted/20 p-8 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-2">
          {pages.map((page, idx) => (
            <div
              key={page.documentUrlTextId ?? idx}
              data-page-index={idx}
              onClick={() => onPageChange(idx)}
              className="cursor-pointer transition-transform duration-300"
            >
              <PageImage 
                page={page} 
                isActive={idx === currentPageIndex} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
