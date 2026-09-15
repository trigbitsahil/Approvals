"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ShieldCheck,
  MessageSquare,
  User,
  PlusCircle,
  Info,
  Search,
  FileText,
  BadgeCheck,
  RefreshCw,
  Loader2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApprovalService } from "@/api/services/ApprovalService";
import { ApprovalHistoryService } from "@/api/services/ApprovalHistoryService";
import type { ApprovalDetailVM } from "@/api/models/ApprovalDetailVM";
import type { ApprovalHistoryVM } from "@/api/models/ApprovalHistoryVM";

export default function ApprovalHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [approval, setApproval] = useState<ApprovalDetailVM | null>(null);
  const [historyItems, setHistoryItems] = useState<ApprovalHistoryVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHistoryData = async () => {
    if (!id) return;
    try {
      const [approvalRes, historyRes] = await Promise.all([
        ApprovalService.getApprovalById(id, "1"),
        ApprovalHistoryService.getApprovalHistory(id)
      ]);

      if (approvalRes.success && approvalRes.data) {
        setApproval(approvalRes.data);
      }

      if (historyRes.success && historyRes.data) {
        setHistoryItems(historyRes.data);
      }
    } catch (err) {
      console.error("Error fetching approval history:", err);
      toast.error("Failed to load approval history timeline.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchHistoryData();
  };

  const parseUtcDate = (dateStr: any) => {
    if (!dateStr) return new Date();
    const str = String(dateStr);
    if (!str.endsWith("Z") && !str.includes("+") && !str.includes("T")) {
      return new Date(str.replace(" ", "T") + "Z");
    }
    if (!str.endsWith("Z") && !str.includes("+")) {
      return new Date(str + "Z");
    }
    return new Date(str);
  };

  const getActionBadge = (action: string) => {
    const act = (action || "").toLowerCase();
    let icon = <PlusCircle className="h-4 w-4 text-primary" />;
    if (act.includes("approved")) icon = <CheckCircle2 className="h-4 w-4 text-primary" />;
    else if (act.includes("rejected")) icon = <XCircle className="h-4 w-4 text-primary" />;
    else if (act.includes("paid")) icon = <Truck className="h-4 w-4 text-primary" />;
    else if (act.includes("confirmed")) icon = <ShieldCheck className="h-4 w-4 text-primary" />;
    else if (act.includes("comment")) icon = <MessageSquare className="h-4 w-4 text-primary" />;

    return {
      label: action || "Created",
      bg: "bg-primary/15 border-primary/30 text-primary font-bold",
      icon,
      nodeBg: "bg-card border-primary text-primary dark:bg-primary/15 dark:border-primary dark:text-primary"
    };
  };

  const filteredHistory = historyItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.action && item.action.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.performedBy && item.performedBy.toLowerCase().includes(q)) ||
      (item.remarks && item.remarks.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading approval history timeline...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/approvals/${id}`)}
            className="rounded-xl hover:bg-accent h-10 w-10 shrink-0 border border-border/40"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <BadgeCheck className="h-6 w-6 text-primary shrink-0" />
              Approval Timeline History
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Complete audit history from creation to final confirmation process
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-wider h-9 px-3 border-border/40 hover:bg-primary/10 hover:text-primary"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate(`/approvals/${id}`)}
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-wider h-9 px-4 shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            Approval Details
          </Button>
        </div>
      </div>

      {/* Approval Context Card */}
      {approval && (
        <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                {approval.approvalType || "Approval Request"}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground uppercase tracking-tight">{approval.name || "Untitled Request"}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-wider bg-muted/30 border-border/40">
                Priority: {approval.priority || "Normal"}
              </Badge>
              <Badge className="px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {approval.approvalStatusName || "In Progress"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-border/30 text-xs">
            <div>
              <span className="text-muted-foreground block text-[9px] font-black uppercase tracking-widest">Requested By</span>
              <span className="font-bold text-foreground truncate block mt-0.5">{approval.requestedBy || "-"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[9px] font-black uppercase tracking-widest">Requested Date</span>
              <span className="font-bold text-foreground block mt-0.5">
                {approval.requestedDate ? format(parseUtcDate(approval.requestedDate), "MMM dd, yyyy HH:mm") : "-"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[9px] font-black uppercase tracking-widest">Total Steps</span>
              <span className="font-bold text-foreground block mt-0.5">{historyItems.length} Logged Events</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[9px] font-black uppercase tracking-widest">Latest Action</span>
              <span className="font-bold text-foreground block truncate mt-0.5">
                {historyItems.length > 0 ? historyItems[historyItems.length - 1].action : "-"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter / Search Control */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history by action, email, or remarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl h-10 text-xs border-border/40 bg-card font-medium focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="bg-card border border-border/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Chronological Audit History ({filteredHistory.length})
        </h3>

        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center space-y-2 bg-muted/10 rounded-2xl border border-dashed border-border/40">
            <Info className="h-8 w-8 text-muted-foreground/40 mx-auto mb-1" />
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">No history items found</p>
            <p className="text-[11px] text-muted-foreground/60">Try clearing your search query</p>
          </div>
        ) : (
          <div className="relative space-y-6">
            {/* Connecting Vertical Line - Pixel-Perfect Centered & Neutral */}
            <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-zinc-300 dark:bg-zinc-700/80" />

            {filteredHistory.map((item, index) => {
              const badgeInfo = getActionBadge(item.action);
              const eventDate = parseUtcDate(item.createdDate);
              const formattedDate = format(eventDate, "MMMM dd, yyyy 'at' hh:mm:ss a");
              const relativeTime = formatDistanceToNow(eventDate, { addSuffix: true });

              return (
                <div key={item.historyId || index} className="relative flex items-start gap-4 sm:gap-5 group">
                  {/* Single Uniform Timeline Node Icon - Neutral */}
                  <div
                    className="z-10 h-9 w-9 rounded-full bg-card border-2 border-border/80 text-muted-foreground flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 group-hover:border-border group-hover:text-foreground"
                  >
                    <Clock className="h-4 w-4" />
                  </div>

                  {/* Event Card Content */}
                  <div className="flex-1 bg-card border border-border/40 hover:border-primary/30 rounded-2xl p-4 sm:p-5 space-y-3 transition-all shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${badgeInfo.bg}`}
                        >
                          {item.action}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary/70" />
                          {formattedDate}
                        </span>
                        <span className="bg-muted/50 px-2 py-0.5 rounded-md font-bold uppercase text-[9px] text-foreground/80">
                          {relativeTime}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
                      {item.description}
                    </p>

                    {/* Actor Details */}
                    {(item.performedBy || item.performedByName) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/20">
                        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-black shrink-0">
                          {(item.performedBy || item.performedByName).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground text-xs">
                          {item.performedBy || item.performedByName}
                        </span>
                      </div>
                    )}

                    {/* Remarks box */}
                    {item.remarks && (
                      <div className="mt-2 p-3 bg-muted/20 border-l-2 border-l-primary/60 border-y border-r border-border/30 rounded-r-2xl text-xs text-muted-foreground italic space-y-1">
                        <span className="font-black text-foreground not-italic block text-[9px] uppercase tracking-widest">
                          Remarks / Notes:
                        </span>
                        <p className="leading-relaxed font-medium">"{item.remarks}"</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
