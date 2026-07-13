import { useEffect, useState } from "react";
import {
  Star,
  Tag as TagIcon,
  FileText,
  Calendar,
  Info,
  Link2,
  PenLine,
  ListChecks,
  CheckSquare,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DocumentsService } from "@/api/services/DocumentsService";
import { TagService } from "@/api/services/TagService";
import type { TagListVM } from "@/api/models/TagListVM";
import type { TagIntermediateVM } from "@/api/models/TagIntermediateVM";
import type { DocumentFileViewItem, DocumentPageDetail } from "./types";
import { formatDisplayDate } from "./types";

interface FileDetailsSidebarProps {
  document: DocumentFileViewItem | null;
  currentPage: DocumentPageDetail | null;
  category: string;
  categoryId: string;
  onStarToggled: (docUrlTextId: string, isStared: boolean) => void;
  onGenerateLink: () => void;
  onNewDraft: () => void;
  onDrafts: () => void;
  onApprovals: () => void;
  onTagsUpdated?: () => void;
}

export function FileDetailsSidebar({
  document,
  currentPage,
  category,
  categoryId,
  onStarToggled,
  onGenerateLink,
  onNewDraft,
  onDrafts,
  onApprovals,
  onTagsUpdated,
}: FileDetailsSidebarProps) {
  const [isStarring, setIsStarring] = useState(false);
  const [availableTags, setAvailableTags] = useState<TagListVM[]>([]);
  const [assignedTags, setAssignedTags] = useState<TagIntermediateVM[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedTagToAdd, setSelectedTagToAdd] = useState<string>("");

  const fetchTags = async () => {
    setIsLoadingTags(true);
    try {
      const response = await TagService.getTagList("1");
      if (response.success && response.data) {
        setAvailableTags(response.data);
      }
    } catch (error) {
      console.error("Error fetching available tags:", error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const fetchAssignedTags = async () => {
    if (!document?.documentUrlID) return;
    try {
      const response = await TagService.getTagIntermediateList("1", "documenturl", document.documentUrlID);
      if (response.success && response.data) {
        setAssignedTags(response.data);
      }
    } catch (error) {
      console.error("Error fetching assigned tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchAssignedTags();
  }, [document?.documentUrlID, category, categoryId]);

  const handleAddTag = async () => {
    if (!selectedTagToAdd || !document?.documentUrlID) return;

    // Check if already assigned
    if (assignedTags.some(t => t.tagId === selectedTagToAdd)) {
      toast.error("Tag already assigned");
      return;
    }

    setIsAssigning(true);
    try {
      const response = await TagService.postTagIntermediate("1", {
        tagId: selectedTagToAdd,
        category: "documenturl",
        categoryId: document.documentUrlID,
      });

      if (response.success) {
        toast.success("Tag assigned successfully");
        setSelectedTagToAdd("");
        fetchAssignedTags();
        onTagsUpdated?.();
      } else {
        toast.error(response.message || "Failed to assign tag");
      }
    } catch (error) {
      console.error("Error assigning tag:", error);
      toast.error("An error occurred while assigning the tag");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveTag = async (tagIntermediateId: string) => {
    try {
      const response = await TagService.deleteTagIntermediate(tagIntermediateId, "1");
      if (response.success) {
        toast.success("Tag removed");
        fetchAssignedTags();
        onTagsUpdated?.();
      } else {
        toast.error(response.message || "Failed to remove tag");
      }
    } catch (error) {
      console.error("Error removing tag:", error);
      toast.error("An error occurred while removing the tag");
    }
  };

  const handleStarToggle = async () => {
    if (!currentPage?.documentUrlTextId) return;
    const newStarred = !currentPage.isStared;
    setIsStarring(true);
    try {
      await DocumentsService.updateDocumentPage("1", {
        documentUrlTextID: currentPage.documentUrlTextId,
        isStared: newStarred,
      });
      onStarToggled(currentPage.documentUrlTextId, newStarred);
      toast.success(newStarred ? "Page starred" : "Star removed");
    } catch {
      toast.error("Failed to update star");
    } finally {
      setIsStarring(false);
    }
  };

  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center text-muted-foreground gap-2 border-l">
        <Info className="h-8 w-8 opacity-30" />
        <p className="text-sm">Select a document to view details</p>
      </div>
    );
  }

  const tags = document.tags ?? [];

  return (
    <div className="h-full overflow-y-auto border-l p-4 space-y-4 text-sm">
      {/* Document name */}
      <div>
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <span className="font-semibold leading-snug break-all">
            {document.name}
          </span>
        </div>
        {document.description && (
          <p className="mt-1 text-xs text-muted-foreground pl-6">
            {document.description}
          </p>
        )}
      </div>

      <Separator />

      {/* Metadata */}
      <div className="space-y-2 text-xs">
        {document.documentType && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium">{document.documentType}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Date
          </span>
          <span>{formatDisplayDate(document.documentDate)}</span>
        </div>
        {document.extension && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Extension</span>
            <span className="uppercase">{document.extension}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pages</span>
          <span>{document.documentPageDetailList?.length ?? 0}</span>
        </div>
      </div>

      <Separator />

      {/* Current page + Star */}
      {currentPage && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Current page: <strong>{currentPage.pageNum}</strong>
            </span>
            <Button
              size="sm"
              variant={currentPage.isStared ? "default" : "outline"}
              className="h-7 gap-1 text-xs"
              onClick={handleStarToggle}
              disabled={isStarring}
            >
              <Star
                className={`h-3 w-3 ${currentPage.isStared ? "fill-current text-amber-400" : ""
                  }`}
              />
              {currentPage.isStared ? "Starred" : "Star page"}
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            <TagIcon className="h-3 w-3" /> Tags
          </div>
        </div>

        {/* Tag Selection Dropdown */}
        <div className="flex gap-2">
          <Select
            value={selectedTagToAdd}
            onValueChange={setSelectedTagToAdd}
            disabled={isLoadingTags || isAssigning}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={isLoadingTags ? "Loading..." : "Select tag"} />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map((tag) => (
                <SelectItem key={tag.tagId} value={tag.tagId || ""}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 shrink-0"
            onClick={handleAddTag}
            disabled={!selectedTagToAdd || isAssigning}
          >
            {isAssigning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        {assignedTags.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No tags assigned
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {assignedTags.map((t) => (
              <Badge
                key={t.tagIntermediateId}
                variant="secondary"
                className="text-xs flex items-center gap-1 group"
              >
                {t.tagName || t.name || availableTags.find(at => at.tagId === t.tagId)?.name || "Tag"}
                <button
                  onClick={() => t.tagIntermediateId && handleRemoveTag(t.tagIntermediateId)}
                  className="hover:text-destructive transition-colors"
                >
                  <Plus className="h-3 w-3 rotate-45" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* <Separator />
313: 
314:       {/* ── Actions ─────────────────────────────────────────────────────── */}
      {/* <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Actions
        </p>

        {/* Generate Link */}
        {/* <Button
          id="generateLinkBtn"
          size="sm"
          variant="secondary"
          className="w-full justify-start gap-2 h-8 text-xs font-medium"
          onClick={onGenerateLink}
        >
          <Link2 className="h-3.5 w-3.5 shrink-0" />
          Generate Link
        </Button> */}

        {/* New Draft */}
        {/* <Button
          id="draftNewLetterBtn"
          size="sm"
          variant="secondary"
          className="w-full justify-start gap-2 h-8 text-xs font-medium"
          onClick={onNewDraft}
        >
          <PenLine className="h-3.5 w-3.5 shrink-0" />
          New Draft
        </Button> */}

        {/* Drafts */}
        {/* <Button
          id="draftsBtn"
          size="sm"
          variant="secondary"
          className="w-full justify-start gap-2 h-8 text-xs font-medium"
          onClick={onDrafts}
        >
          <ListChecks className="h-3.5 w-3.5 shrink-0" />
          Drafts
        </Button> */}

        {/* Approvals */}
        {/* <Button
          id="approvalsBtn"
          size="sm"
          variant="secondary"
          className="w-full justify-start gap-2 h-8 text-xs font-medium"
          onClick={onApprovals}
        >
          <CheckSquare className="h-3.5 w-3.5 shrink-0" />
          Approvals
        </Button> */}
      {/* </div> */}
    </div>
  );
}
