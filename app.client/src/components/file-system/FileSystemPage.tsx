import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "sonner";
import { DocumentsService } from "@/api/services/DocumentsService";
import { FileSystemHeader } from "./FileSystemHeader";
import { DocumentThumbnailPanel } from "./DocumentThumbnailPanel";
import { DocumentViewer } from "./DocumentViewer";
import { FileDetailsSidebar } from "./FileDetailsSidebar";
import { GenerateLinkModal } from "./GenerateLinkModal";
import { DraftsModal, ApprovalsModal, NewDraftModal } from "./ActionModals";
import type { DocumentFileViewItem, FileSystemFilters, TagVM } from "./types";
import { defaultFilters } from "./types";
import { TagService } from "@/api/services/TagService";
import { cn } from "@/utils/cn";
import { FileText } from "lucide-react";

export default function FileSystemPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const documentId = searchParams.get("documentId") ?? null;

  const [documents, setDocuments] = useState<DocumentFileViewItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // ── Mobile Detection ──
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [filters, setFilters] = useState<FileSystemFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FileSystemFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [hasMore, setHasMore] = useState(true);

  // ── Modal visibility state ────────────────────────────────────────────────
  const [showGenerateLink, setShowGenerateLink] = useState(false);
  const [showNewDraft, setShowNewDraft] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [showApprovals, setShowApprovals] = useState(false);

  const [availableTags, setAvailableTags] = useState<TagVM[]>([]);

  const fetchAllTags = useCallback(async () => {
    try {
      const response = await TagService.getTagList("1");
      if (response.success && response.data) {
        // Map TagListVM to TagVM
        const tags = response.data.map((t) => ({
          tagId: t.tagId,
          name: t.name,
        }));
        console.log("All tags fetched:", tags);
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error("Error fetching all tags:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllTags();
  }, [fetchAllTags]);

  const selectedDoc =
    documents.find((d) => d.documentUrlID === selectedDocId) ?? null;

  const currentPage =
    selectedDoc?.documentPageDetailList?.[currentPageIndex] ?? null;

  // ── Client-side filtering ────────────────────────────────────────────────
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (!doc.documentDate) return true;
      const docDate = new Date(doc.documentDate);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      docDate.setHours(0, 0, 0, 0);
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(0, 0, 0, 0);

      if (start && docDate < start) return false;
      if (end && docDate > end) return false;

      if (filters.isStared) {
        const hasStarredPage = doc.documentPageDetailList?.some(
          (p) => p.isStared
        );
        if (!doc.isStared && !hasStarredPage) return false;
      }

      return true;
    });
  }, [documents, filters.startDate, filters.endDate, filters.isStared]);

  // ── Fetch documents from the API ─────────────────────────────────────────
  const fetchDocuments = useCallback(async () => {
    if (!category || !categoryId) return;

    const isInitial = pagination.pageNumber === 1;

    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const response = await DocumentsService.getDocumentFileViewList2("1", {
        category,
        categoryID: categoryId,
        searchText: appliedFilters.searchText,
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
        isStared: appliedFilters.isStared,
        documentType: appliedFilters.documentType,
        tags: appliedFilters.tags.length > 0 ? appliedFilters.tags : null,
        pagenum: pagination.pageNumber,
        pagesize: pagination.pageSize,
      });

      const rawData = response.data ?? [];
      const data = rawData.map((item: any) => ({
        documentUrlID:
          item.documentUrlID || item.documentID || item.documentId || item.id,
        name: item.name || item.documentFileName,
        description: item.description,
        extension: item.extension,
        documentDate: item.documentDate || item.createdDate,
        isStared: item.isStared,
        tags: item.tags || [],
        documentPageDetailList: (item.documentPageDetailList ?? []).map(
          (page: any) => ({
            documentUrlTextId: page.documentUrlTextId,
            imageBlobUrl: page.imageBlobUrl,
            pageNum: page.pageNum,
            isStared: page.isStared,
            coordinates: page.coordinates,
          })
        ),
      })) as DocumentFileViewItem[];

      if (isInitial) {
        setDocuments(data);
      } else {
        setDocuments((prev) => [...prev, ...data]);
      }

      const receivedMore = data.length > 0 && data.length === pagination.pageSize;
      setHasMore(receivedMore);
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast.error(err?.message ?? "Failed to load documents");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [category, categoryId, appliedFilters, pagination]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const loadMore = useCallback(() => {
    if (!isLoading && !isFetchingMore && hasMore) {
      setPagination((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
    }
  }, [isLoading, isFetchingMore, hasMore]);

  // Reset pagination and apply filters when button is clicked
  const handleApplyFilter = useCallback(() => {
    setAppliedFilters(filters);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  }, [filters]);

  const handleClearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  }, []);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  }, [category, categoryId]);

  // Handle document selection after load / URL change
  useEffect(() => {
    if (filteredDocuments.length === 0) return;

    const targetId =
      documentId && documentId !== "undefined" ? documentId : null;
    const found = targetId
      ? filteredDocuments.find(
        (d) =>
          d.documentUrlID?.toLowerCase() === targetId.toLowerCase()
      )
      : null;

    if (found) {
      setSelectedDocId(found.documentUrlID ?? null);
    } else if (!selectedDocId) {
      setSelectedDocId(filteredDocuments[0].documentUrlID ?? null);
    }
  }, [filteredDocuments, documentId, selectedDocId]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectDocument = (id: string) => {
    setSelectedDocId(id);
    setCurrentPageIndex(0);
  };

  const handleStarToggled = (docUrlTextId: string, isStared: boolean) => {
    setDocuments((prev) =>
      prev.map((doc) => ({
        ...doc,
        documentPageDetailList: doc.documentPageDetailList?.map((page) =>
          page.documentUrlTextId === docUrlTextId
            ? { ...page, isStared }
            : page
        ),
      }))
    );
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      {/* ── Filter / Header bar ── */}
      <FileSystemHeader
        className={isMobile ? "px-2" : ""}
        category={category}
        categoryId={categoryId}
        filters={filters}
        availableTags={availableTags}
        onFilterChange={setFilters}
        onApplyFilter={handleApplyFilter}
        onClearFilters={handleClearFilters}
        isLoading={isLoading}
        documentCount={filteredDocuments.length}
      />

      {/* ── 3-panel layout ── */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <div className="h-full flex flex-col overflow-y-auto">
            {/* Mobile Thumbnails - Horizontal scroll */}
            <div className="h-44 shrink-0 border-b bg-card">
              <div className="h-full overflow-x-auto overflow-y-hidden flex items-center px-2 gap-3 scrollbar-hide">
                {filteredDocuments.map((doc) => {
                  const thumbUrl = doc.documentPageDetailList?.[0]?.imageBlobUrl ?? null;
                  const isSelected = doc.documentUrlID === selectedDocId;
                  return (
                    <div
                      key={doc.documentUrlID}
                      onClick={() => handleSelectDocument(doc.documentUrlID ?? "")}
                      className={cn(
                        "flex-none w-28 aspect-[3/4] rounded-lg border-2 transition-all cursor-pointer relative overflow-hidden",
                        isSelected ? "border-primary shadow-md scale-95" : "border-border/40 opacity-70 hover:opacity-100"
                      )}
                    >
                      {thumbUrl ? (
                        <img src={thumbUrl} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <FileText className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-[8px] text-white truncate text-center">
                        {doc.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Viewer */}
            <div className="flex-1 min-h-[400px]">
              <DocumentViewer
                document={selectedDoc}
                currentPageIndex={currentPageIndex}
                onPageChange={setCurrentPageIndex}
              />
            </div>

            {/* Mobile Sidebar - At the bottom */}
            <div className="border-t bg-muted/5">
              <FileDetailsSidebar
                document={selectedDoc}
                currentPage={currentPage}
                category={category}
                categoryId={categoryId}
                onStarToggled={handleStarToggled}
                onGenerateLink={() => setShowGenerateLink(true)}
                onNewDraft={() => setShowNewDraft(true)}
                onDrafts={() => setShowDrafts(true)}
                onApprovals={() => setShowApprovals(true)}
              />
            </div>
          </div>
        ) : (
          <PanelGroup direction="horizontal" className="h-full">
            {/* LEFT — thumbnails */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <DocumentThumbnailPanel
                documents={filteredDocuments}
                selectedDocId={selectedDocId}
                selectedPageIndex={currentPageIndex}
                onSelectDocument={handleSelectDocument}
                onSelectPage={setCurrentPageIndex}
                isLoading={isLoading}
                isFetchingMore={isFetchingMore}
                onLoadMore={loadMore}
                hasMore={hasMore}
              />
            </Panel>

            <PanelResizeHandle className="w-px bg-border/50 hover:bg-primary/40 transition-colors cursor-col-resize" />

            {/* CENTER — viewer */}
            <Panel defaultSize={55} minSize={30}>
              <DocumentViewer
                document={selectedDoc}
                currentPageIndex={currentPageIndex}
                onPageChange={setCurrentPageIndex}
              />
            </Panel>

            <PanelResizeHandle className="w-px bg-border/50 hover:bg-primary/40 transition-colors cursor-col-resize" />

            {/* RIGHT — details + actions */}
            <Panel defaultSize={25} minSize={18} maxSize={36}>
              <FileDetailsSidebar
                document={selectedDoc}
                currentPage={currentPage}
                category={category}
                categoryId={categoryId}
                onStarToggled={handleStarToggled}
                onGenerateLink={() => setShowGenerateLink(true)}
                onNewDraft={() => setShowNewDraft(true)}
                onDrafts={() => setShowDrafts(true)}
                onApprovals={() => setShowApprovals(true)}
              />
            </Panel>
          </PanelGroup>
        )}
      </div>

      {/* ── Modals ── */}
      <GenerateLinkModal
        open={showGenerateLink}
        onClose={() => setShowGenerateLink(false)}
        category={category}
        categoryId={categoryId}
      />
      <NewDraftModal
        open={showNewDraft}
        onClose={() => setShowNewDraft(false)}
        category={category}
        categoryId={categoryId}
      />
      <DraftsModal
        open={showDrafts}
        onClose={() => setShowDrafts(false)}
        category={category}
        categoryId={categoryId}
      />
      <ApprovalsModal
        open={showApprovals}
        onClose={() => setShowApprovals(false)}
        category={category}
        categoryId={categoryId}
      />
    </div>
  );
}
