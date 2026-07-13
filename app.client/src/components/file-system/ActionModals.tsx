import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, RefreshCw, PenLine, ExternalLink } from "lucide-react";
import { OpenAPI } from "@/api/core/OpenAPI";

// ── Shared helper to get bearer token ────────────────────────────────────────
async function getBearerToken(): Promise<string> {
  if (typeof OpenAPI.TOKEN === "function") {
    return (await OpenAPI.TOKEN({} as any)) ?? "";
  }
  return OpenAPI.TOKEN ?? "";
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface DraftVM {
  letterId: string;
  subject?: string;
  draftType?: string;
  status?: string;
  createdDate?: string;
  updatedDate?: string;
}

interface ApprovalVM {
  approvalId: string;
  title?: string;
  approvalType?: string;
  status?: string;
  createdDate?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DraftsModal
// ═══════════════════════════════════════════════════════════════════════════════
interface DraftsModalProps {
  open: boolean;
  onClose: () => void;
  category: string;
  categoryId: string;
}

export function DraftsModal({
  open,
  onClose,
  category,
  categoryId,
}: DraftsModalProps) {
  const [drafts, setDrafts] = useState<DraftVM[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDrafts = useCallback(async () => {
    if (!category || !categoryId) return;
    setIsLoading(true);
    try {
      const token = await getBearerToken();
      const res = await fetch(
        `${OpenAPI.BASE}/api/v1/Drafts?category=${encodeURIComponent(category)}&categoryId=${encodeURIComponent(categoryId)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const json = await res.json();
        const list: DraftVM[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];
        setDrafts(list);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [category, categoryId]);

  useEffect(() => {
    if (open) loadDrafts();
  }, [open, loadDrafts]);

  const handleEditDraft = (letterId: string) => {
    // Open the edit draft in a new tab (matches the MVC UpdateDraft action)
    window.open(
      `${OpenAPI.BASE}/DocumentUrl/UpdateDraft?draftId=${letterId}&isFileView=true`,
      "_blank"
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Drafts
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1"
            onClick={loadDrafts}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Separator />

        <div className="max-h-96 overflow-y-auto space-y-2 py-2">
          {isLoading && (
            <p className="text-xs text-muted-foreground text-center py-6">
              Loading drafts…
            </p>
          )}
          {!isLoading && drafts.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6 italic">
              No drafts found for this {category}.
            </p>
          )}
          {drafts.map((draft) => (
            <div
              key={draft.letterId}
              className="rounded-md border bg-muted/30 p-3 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {draft.subject ?? "Untitled Draft"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  {draft.draftType && (
                    <Badge variant="outline" className="text-xs py-0">
                      {draft.draftType}
                    </Badge>
                  )}
                  {draft.status && (
                    <Badge
                      variant={
                        draft.status.toLowerCase() === "pending"
                          ? "secondary"
                          : "default"
                      }
                      className="text-xs py-0"
                    >
                      {draft.status}
                    </Badge>
                  )}
                  {draft.createdDate && (
                    <span>
                      {new Date(draft.createdDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 shrink-0 text-xs"
                onClick={() => handleEditDraft(draft.letterId)}
              >
                <PenLine className="h-3 w-3" />
                Edit
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ApprovalsModal
// ═══════════════════════════════════════════════════════════════════════════════
interface ApprovalsModalProps {
  open: boolean;
  onClose: () => void;
  category: string;
  categoryId: string;
}

export function ApprovalsModal({
  open,
  onClose,
  category,
  categoryId,
}: ApprovalsModalProps) {
  const [approvals, setApprovals] = useState<ApprovalVM[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadApprovals = useCallback(async () => {
    if (!category || !categoryId) return;
    setIsLoading(true);
    try {
      const token = await getBearerToken();
      const res = await fetch(
        `${OpenAPI.BASE}/api/v1/Approvals?category=${encodeURIComponent(category)}&categoryId=${encodeURIComponent(categoryId)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const json = await res.json();
        const list: ApprovalVM[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];
        setApprovals(list);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [category, categoryId]);

  useEffect(() => {
    if (open) loadApprovals();
  }, [open, loadApprovals]);

  const handleOpenApproval = (approvalId: string) => {
    // matches the MVC pending-btn: /Approval/ApprovalDetail/{approvalId}
    window.open(
      `${OpenAPI.BASE}/Approval/ApprovalDetail/${approvalId}?categoryId=${categoryId}&category=${category}`,
      "_blank"
    );
  };

  const statusVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Approvals
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1"
            onClick={loadApprovals}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Separator />

        <div className="max-h-96 overflow-y-auto space-y-2 py-2">
          {isLoading && (
            <p className="text-xs text-muted-foreground text-center py-6">
              Loading approvals…
            </p>
          )}
          {!isLoading && approvals.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6 italic">
              No approvals found for this {category}.
            </p>
          )}
          {approvals.map((approval) => (
            <div
              key={approval.approvalId}
              className="rounded-md border bg-muted/30 p-3 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {approval.title ?? "Approval Request"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  {approval.approvalType && (
                    <Badge variant="outline" className="text-xs py-0">
                      {approval.approvalType}
                    </Badge>
                  )}
                  {approval.status && (
                    <Badge
                      variant={statusVariant(approval.status)}
                      className="text-xs py-0"
                    >
                      {approval.status}
                    </Badge>
                  )}
                  {approval.createdDate && (
                    <span>
                      {new Date(approval.createdDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 shrink-0 text-xs"
                onClick={() => handleOpenApproval(approval.approvalId)}
              >
                <ExternalLink className="h-3 w-3" />
                View
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NewDraftModal — loads the draft letter form in an iframe
// ═══════════════════════════════════════════════════════════════════════════════
interface NewDraftModalProps {
  open: boolean;
  onClose: () => void;
  category: string;
  categoryId: string;
}

export function NewDraftModal({
  open,
  onClose,
  category,
  categoryId,
}: NewDraftModalProps) {
  const draftUrl = `${OpenAPI.BASE}/DocumentUrl/DraftLetterPartial?category=${encodeURIComponent(category)}&categoryId=${encodeURIComponent(categoryId)}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenLine className="h-4 w-4" />
            New Draft Letter
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden rounded-md border">
          <iframe
            src={draftUrl}
            className="w-full h-full"
            title="New Draft Letter"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
