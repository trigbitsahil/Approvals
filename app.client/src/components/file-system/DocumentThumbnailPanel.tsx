import { useEffect, useRef } from "react";
import { FileText, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { DocumentFileViewItem } from "./types";
import { formatDisplayDate } from "./types";

interface DocumentThumbnailPanelProps {
  documents: DocumentFileViewItem[];
  selectedDocId: string | null;
  selectedPageIndex: number;
  onSelectDocument: (id: string) => void;
  onSelectPage: (pageIndex: number) => void;
  isLoading: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function DocumentThumbnailPanel({
  documents,
  selectedDocId,
  selectedPageIndex,
  onSelectDocument,
  onSelectPage,
  isLoading,
  isFetchingMore,
  onLoadMore,
  hasMore,
}: DocumentThumbnailPanelProps) {
  const selectedDoc = documents.find((d) => d.documentUrlID === selectedDocId);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading || isFetchingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isFetchingMore, onLoadMore]);

  return (
    <div className="h-full flex flex-col border-r bg-muted/20 overflow-hidden">
      {/* Document list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/50 scrollbar-thin scrollbar-thumb-border">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-lg bg-muted/50 animate-pulse border border-border/20"
              />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-muted/30">
              <FileText className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              No documents found
            </div>
            <p className="text-xs text-muted-foreground/60 max-w-[160px]">
              Try adjusting your filters or date range to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            {documents.map((doc) => {
              const thumbUrl =
                doc.documentPageDetailList?.[0]?.imageBlobUrl ?? null;
              const isSelected = doc.documentUrlID === selectedDocId;

              return (
                <div
                  key={doc.documentUrlID}
                  onClick={() => onSelectDocument(doc.documentUrlID ?? "")}
                  className={cn(
                    "group relative cursor-pointer p-3 flex gap-2 transition-all duration-200",
                    isSelected
                      ? "bg-primary/5 shadow-[inset_2px_0_0_0_hsl(var(--primary))]"
                      : "hover:bg-muted/40",
                    "flex-col sm:flex-col md:flex-col" // Default to col, but FileSystemPage can pass a class to override if needed
                  )}
                >
                  {/* Thumbnail Container */}
                  <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-muted flex items-center justify-center border border-border/40 group-hover:border-primary/30 transition-colors shadow-sm">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={doc.name ?? ""}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground/40 group-hover:text-primary/40 transition-colors">
                        {doc.extension?.toLowerCase() === ".pdf" ? (
                          <FileText className="h-8 w-8 stroke-[1.5]" />
                        ) : (
                          <ImageIcon className="h-8 w-8 stroke-[1.5]" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {doc.extension?.replace(".", "")}
                        </span>
                      </div>
                    )}

                    {/* Badge/Overlay if needed */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border/40 text-[9px] font-medium text-muted-foreground">
                      {doc.documentPageDetailList?.length || 0} pgs
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-0.5 space-y-0.5">
                    {doc.documentType && (
                      <div className="text-[10px] font-bold text-primary/80 uppercase tracking-tight truncate">
                        {doc.documentType}
                      </div>
                    )}
                    <div className="text-[11px] font-semibold text-foreground/90 truncate group-hover:text-primary transition-colors">
                      {doc.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 flex items-center gap-1.5">
                      <span>{formatDisplayDate(doc.documentDate)}</span>
                      <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
                      <span>{doc.extension?.toUpperCase().replace(".", "")}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Load More Trigger */}
            <div
              ref={observerTarget}
              className="p-6 flex justify-center items-center"
            >
              {isFetchingMore ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary/60" />
                  <span className="text-[10px] text-muted-foreground font-medium animate-pulse">
                    Loading more...
                  </span>
                </div>
              ) : hasMore ? (
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              ) : documents.length > 0 ? (
                <span className="text-[10px] text-muted-foreground/40 font-medium italic">
                  End of list
                </span>
              ) : null}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
