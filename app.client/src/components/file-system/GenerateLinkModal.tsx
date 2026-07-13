import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Copy,
  Link2,
  Trash2,
  RefreshCw,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { OpenAPI } from "@/api/core/OpenAPI";

interface ShareLinkVM {
  shareLinkId: string;
  shareableLink?: string;
  expiryDate?: string;
  createdDate?: string;
  isExpired?: boolean;
}

interface GenerateLinkModalProps {
  open: boolean;
  onClose: () => void;
  category: string;
  categoryId: string;
}

export function GenerateLinkModal({
  open,
  onClose,
  category,
  categoryId,
}: GenerateLinkModalProps) {
  const [validForDays, setValidForDays] = useState(7);
  const [links, setLinks] = useState<ShareLinkVM[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);

  // Build full shareable URL (same pattern as the C# controller)
  const buildShareUrl = (shareLinkId: string) => {
    const base = window.location.origin;
    return `${base}/DocumentUrl/ViewSharedDocument?shareLinkId=${shareLinkId}&category=${category}&categoryId=${categoryId}`;
  };

  // ── Load existing share links ──────────────────────────────────────────────
  const loadShareLinks = useCallback(async () => {
    if (!category || !categoryId) return;
    setIsLoadingLinks(true);
    try {
      const res = await fetch(
        `${OpenAPI.BASE}/api/v1/ShareLinks?category=${encodeURIComponent(category)}&categoryId=${encodeURIComponent(categoryId)}`,
        {
          headers: {
            Authorization: `Bearer ${
              typeof OpenAPI.TOKEN === "function"
                ? await OpenAPI.TOKEN({} as any)
                : OpenAPI.TOKEN ?? ""
            }`,
          },
        }
      );
      if (res.ok) {
        const json = await res.json();
        // Support both { data: [] } and [] shapes
        const rawList: any[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];
        setLinks(rawList);
      }
    } catch {
      // silently fail — links just won't show
    } finally {
      setIsLoadingLinks(false);
    }
  }, [category, categoryId]);

  useEffect(() => {
    if (open) loadShareLinks();
  }, [open, loadShareLinks]);

  // ── Generate a new link ────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!category || !categoryId) {
      toast.error("Category and Category ID are required.");
      return;
    }
    if (!validForDays || validForDays <= 0) {
      toast.error("Please enter a valid number of days.");
      return;
    }
    setIsGenerating(true);
    try {
      const token =
        typeof OpenAPI.TOKEN === "function"
          ? await OpenAPI.TOKEN({} as any)
          : OpenAPI.TOKEN ?? "";

      const res = await fetch(`${OpenAPI.BASE}/api/v1/ShareLinks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          categoryId,
          days: validForDays,
        }),
      });
      const json = await res.json();
      if (json?.success !== false) {
        toast.success("Shareable link generated!");
        await loadShareLinks();
      } else {
        toast.error(json?.message ?? "Failed to generate link.");
      }
    } catch {
      toast.error("An error occurred while generating the link.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Copy link to clipboard ─────────────────────────────────────────────────
  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  // ── Delete a link ──────────────────────────────────────────────────────────
  const handleDelete = async (shareLinkId: string) => {
    if (!confirm("Are you sure you want to delete this share link?")) return;
    try {
      const token =
        typeof OpenAPI.TOKEN === "function"
          ? await OpenAPI.TOKEN({} as any)
          : OpenAPI.TOKEN ?? "";

      const res = await fetch(
        `${OpenAPI.BASE}/api/v1/ShareLinks/${shareLinkId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (json?.success !== false) {
        toast.success("Share link deleted.");
        setLinks((prev) => prev.filter((l) => l.shareLinkId !== shareLinkId));
      } else {
        toast.error("Failed to delete share link.");
      }
    } catch {
      toast.error("An error occurred while deleting the share link.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Shareable Links
          </DialogTitle>
        </DialogHeader>

        {/* ── Generate new link row ── */}
        <div className="flex flex-wrap items-end gap-3 py-2">
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Valid For (Days)</Label>
            <Input
              type="number"
              min={1}
              value={validForDays}
              onChange={(e) => setValidForDays(Number(e.target.value))}
              className="h-8 w-28 text-sm"
            />
          </div>
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            {isGenerating ? "Generating…" : "Generate New Link"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1"
            onClick={loadShareLinks}
            disabled={isLoadingLinks}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoadingLinks ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Separator />

        {/* ── Links list ── */}
        <div className="max-h-72 overflow-y-auto space-y-2 py-2">
          {isLoadingLinks && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Loading links…
            </p>
          )}
          {!isLoadingLinks && links.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4 italic">
              No shareable links yet. Generate one above.
            </p>
          )}
          {links.map((link) => {
            const url = link.shareableLink ?? buildShareUrl(link.shareLinkId);
            const expired = link.isExpired ?? false;
            return (
              <div
                key={link.shareLinkId}
                className="rounded-md border bg-muted/30 p-3 space-y-2"
              >
                {/* URL row */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono flex-1 truncate">
                    {url}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0"
                    title="Copy link"
                    onClick={() => handleCopy(url)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <a href={url} target="_blank" rel="noreferrer">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 shrink-0"
                      title="Open link"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0 text-destructive hover:text-destructive"
                    title="Delete link"
                    onClick={() => handleDelete(link.shareLinkId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {link.createdDate && (
                    <span>
                      Created:{" "}
                      {new Date(link.createdDate).toLocaleDateString()}
                    </span>
                  )}
                  {link.expiryDate && (
                    <span>
                      Expires:{" "}
                      {new Date(link.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                  {expired && (
                    <Badge variant="destructive" className="text-xs py-0">
                      Expired
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
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
