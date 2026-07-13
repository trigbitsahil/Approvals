"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { UserService } from "@/api/services/UserService";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, User, Fingerprint, CalendarDays } from "lucide-react";

interface UserActivityDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

interface UserActivityVM {
  activityID?: string | null;
  userID?: string | null;
  activityType?: string | null;
  description?: string | null;
  timestamp?: string;
}

export const UserActivityDialog = ({
  open,
  onClose,
  userId,
}: UserActivityDialogProps) => {
  const [activity, setActivity] = useState<UserActivityVM[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await UserService.getUserActivity("1", userId);
        if (res.data) {
          const transformed: UserActivityVM[] = res.data.map((item: any) => ({
            activityID: item.userActivityLogId,
            userID: item.userId,
            activityType: item.actionName,
            description: item.actionName,
            timestamp: item.createdDate,
          }));
          setActivity(transformed);
        }
      } catch (err) {
        toast.error("Failed to load user activity history");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchActivity();
  }, [userId, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl border-muted shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold ">Activity Log</DialogTitle>
              <DialogDescription className="text-xs font-medium uppercase tracking-wider opacity-60">Monitoring user interactions and system events</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-8 pt-2 overflow-hidden">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-muted/40 rounded-full mb-4">
                <Clock className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-sm font-bold text-foreground">No records found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">This user hasn't generated any system activity logs yet.</p>
            </div>
          ) : (
            <ScrollArea className="h-[50vh] pr-4 w-full overflow-x-auto">
              <div className="space-y-4 relative min-w-[320px] pb-4 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-muted">
                {activity.map((item, index) => (
                  <div key={index} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 h-7 w-7 rounded-full bg-background border-[2px] border-primary/60 flex items-center justify-center shadow-md z-10">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>

                    <Card className="border-muted hover:border-primary/40 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group bg-card/40">
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <Badge variant="secondary" className="bg-primary/10  hover:bg-primary/20 text-xs font-bold uppercase transition-colors px-2.5 py-1 whitespace-nowrap">
                            {item.activityType || "System Event"}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground shrink-0">
                            <CalendarDays className="h-3 w-3 text-muted-foreground/60" />
                            {new Date(item.timestamp || "").toLocaleDateString()}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center gap-2.5 text-sm">
                            <Fingerprint className="h-4 w-4 text-primary/80" />
                            <span className="text-muted-foreground font-bold whitespace-nowrap">Log ID:</span>
                            <span className="font-mono text-sm text-foreground font-medium transition-colors break-all">
                              {item.activityID?.toString() || "No-ID"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 text-sm">
                            <User className="h-4 w-4 text-primary/80" />
                            <span className="text-muted-foreground font-bold whitespace-nowrap">Recorded Time:</span>
                            <span className="font-bold text-foreground text-base tracking-tight">
                              {new Date(item.timestamp || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
