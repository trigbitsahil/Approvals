"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ShieldCheck,
  MessageSquare,
  PlusCircle,
  Search,
  RefreshCw,
  Loader2,
  Calendar,
  History
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApprovalHistoryService } from "@/api/services/ApprovalHistoryService";
import type { ApprovalHistoryVM } from "@/api/models/ApprovalHistoryVM";

interface ApprovalAuditTimelineWidgetProps {
  approvalId: string;
  refreshKey?: number;
}

export default function ApprovalAuditTimelineWidget({
  approvalId,
  refreshKey
}: ApprovalAuditTimelineWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState<ApprovalHistoryVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHistoryData = async () => {
    if (!approvalId) return;
    try {
      const historyRes = await ApprovalHistoryService.getApprovalHistory(approvalId);
      if (historyRes.success && historyRes.data) {
        setHistoryItems(historyRes.data);
      }
    } catch (err) {
      console.error("Error fetching approval history widget data:", err);
      toast.error("Failed to load audit history.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [approvalId, refreshKey]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchHistoryData();
  };

  const parseDbDate = (dateStr: any): Date => {
    if (!dateStr) return new Date();
    if (dateStr instanceof Date) return dateStr;
    const str = String(dateStr).trim();
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, y, m, d, h, min, s] = match;
      return new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min), Number(s));
    }
    return new Date(str);
  };

  const getActionBadge = (action: string) => {
    const act = (action || "").toLowerCase();
    let icon = <PlusCircle className="h-4 w-4" />;
    if (act.includes("approved")) icon = <CheckCircle2 className="h-4 w-4" />;
    else if (act.includes("rejected")) icon = <XCircle className="h-4 w-4" />;
    else if (act.includes("paid")) icon = <Truck className="h-4 w-4" />;
    else if (act.includes("confirmed")) icon = <ShieldCheck className="h-4 w-4" />;
    else if (act.includes("comment")) icon = <MessageSquare className="h-4 w-4" />;

    return {
      label: action || "Created",
      bg: " border-primary/30 text-primary font-bold",
      nodeStyle: "bg-card border-primary text-primary dark:bg-primary/15 dark:border-primary dark:text-primary",
      icon,
    };
  };

  const filteredHistory = useMemo(() => {
    return [...historyItems]
      .sort((a, b) => {
        const timeA = a.createdDate ? parseDbDate(a.createdDate).getTime() : 0;
        const timeB = b.createdDate ? parseDbDate(b.createdDate).getTime() : 0;
        return timeB - timeA;
      })
      .filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          (item.action && item.action.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.performedBy && item.performedBy.toLowerCase().includes(q)) ||
          (item.performedByName && item.performedByName.toLowerCase().includes(q)) ||
          (item.remarks && item.remarks.toLowerCase().includes(q))
        );
      });
  }, [historyItems, searchQuery]);

  return (
    <div className="bg-card border border-border/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-xl text-primary shrink-0">
            <History className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                Approval Audit Timeline
              </h3>
              <Badge variant="outline" className="rounded-full text-[10px] font-bold px-2 py-0.5 border-border/50">
                {historyItems.length} Events
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Chronological log of approvals, remarks, and confirmation events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 px-2.5 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {historyItems.length > 2 && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search audit timeline by action, user, or remarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-xs bg-muted/20 border-border/40 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>
      )}

      {/* Timeline Scrollable Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-xs font-medium">Loading audit history timeline...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/40">
          <Clock className="h-7 w-7 text-muted-foreground/40 mb-1.5" />
          <p className="text-xs font-bold text-foreground">No Audit History Registered</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Timeline events will appear as actions occur.</p>
        </div>
      ) : (
        <div className="max-h-[380px] overflow-y-auto pr-1.5 space-y-4 custom-scrollbar pt-1">
          {filteredHistory.map((item, index) => {
            const badgeInfo = getActionBadge(item.action);
            const eventDate = parseDbDate(item.createdDate);
            const formattedDate = format(eventDate, "MMM dd, yyyy 'at' hh:mm:ss a");
            const relativeTime = formatDistanceToNow(eventDate, { addSuffix: true });
            const isLast = index === filteredHistory.length - 1;

            return (
              <div key={item.historyId || index} className="relative flex items-start gap-3.5 group">
                {/* Continuous Connecting Line Segment to Next Item */}
                {!isLast && (
                  <div className="absolute left-[15px] top-4 -bottom-4 w-[2px] bg-neutral-300 dark:bg-neutral-600 pointer-events-none" />
                )}

                {/* Node Icon */}
                <div className={`z-10 h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${badgeInfo.nodeStyle}`}>
                  {badgeInfo.icon}
                </div>

                {/* Event Card Content */}
                <div className="flex-1 bg-muted/50 dark:bg-muted/40 border border-border/80 dark:border-border/60 hover:border-primary/50 rounded-2xl p-3.5 space-y-2 transition-all shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${badgeInfo.bg}`}
                    >
                      {item.action}
                    </Badge>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary/70" />
                        {formattedDate}
                      </span>
                     
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                    {item.description}
                  </p>

                  {/* Actor Details */}
                  {(item.performedBy || item.performedByName) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/20">
                      <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[9px] font-bold shrink-0">
                        {(item.performedBy || item.performedByName).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-foreground text-xs">
                        {item.performedBy || item.performedByName}
                      </span>
                    </div>
                  )}

                  {/* Remarks Box */}
                  {item.remarks && (
                    <div className="mt-2 p-2.5 bg-card/80 border-l-2 border-l-primary border border-border/40 rounded-r-xl text-xs space-y-1">
                      <span className="font-bold text-foreground block text-[9px] uppercase tracking-wider text-muted-foreground">
                        Remarks / Notes:
                      </span>
                      <p className="text-foreground font-medium italic whitespace-pre-wrap leading-relaxed">
                        "{item.remarks}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
