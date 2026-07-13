"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserService } from "@/api/services/UserService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CalendarDays,
  Activity,
  Fingerprint,
  Clock,
  ShieldCheck,
  Edit2,
  Trash2,
  UserCheck,
  Building2,
  Hash
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserFormDialog } from "@/components/user/UserFormDialog";
import { DocumentsService } from "@/api/services/DocumentsService";

const API_VERSION = "1";

export default function UserDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await UserService.getUserById(userId, API_VERSION);
        if (response?.data) {
          setUser(response.data);
        }
      } catch (err) {
        toast.error("Failed to load user details");
        navigate("/user");
      } finally {
        setLoading(false);
      }
    };

    const fetchActivity = async () => {
      if (!userId) return;
      setActivityLoading(true);
      try {
        const res = await UserService.getUserActivity(API_VERSION, userId);
        if (res.data) {
          setActivity(res.data);
        }
      } catch (err) {
        console.error("Failed to load activity", err);
      } finally {
        setActivityLoading(false);
      }
    };

    const fetchProfileImage = async () => {
      if (!userId) return;
      try {
        const response = await DocumentsService.getApiVDocuments(API_VERSION, "User", userId);
        if (response?.data && response.data.length > 0) {
          const latestDoc = response.data[response.data.length - 1];
          setProfileImageUrl(latestDoc.url || (latestDoc as any).blobUrl);
        } else {
          setProfileImageUrl(null);
        }
      } catch (err) {
        console.error("Failed to load profile image", err);
      }
    };

    fetchUserDetails();
    fetchActivity();
    fetchProfileImage();
  }, [userId, navigate]);

  const onUpdateSuccess = () => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const response = await UserService.getUserById(userId, API_VERSION);
        if (response?.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("Failed to refresh user details", err);
      }
    };
    const fetchProfileImage = async () => {
      if (!userId) return;
      try {
        const response = await DocumentsService.getApiVDocuments(API_VERSION, "User", userId);
        if (response?.data && response.data.length > 0) {
          const latestDoc = response.data[response.data.length - 1];
          setProfileImageUrl(latestDoc.url || (latestDoc as any).blobUrl);
        } else {
          setProfileImageUrl(null);
        }
      } catch (err) {
        console.error("Failed to load profile image", err);
      }
    };
    fetchUserDetails();
    fetchProfileImage();
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Skeleton className="h-[500px] lg:col-span-4 rounded-3xl" />
            <Skeleton className="h-[600px] lg:col-span-8 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const fullName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.userName || user.email || "System User";

  const initials = (user.firstName && user.lastName
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : user.email?.charAt(0) || "U").toUpperCase();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header section - Simplified */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-muted/60 relative overflow-hidden group">
        <div className="space-y-6 flex-1 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/user")}
            className="-ml-3 h-9 text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50 rounded-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-sm md:text-2xl font-black tracking-tight text-foreground  pb-1">
                {fullName}
              </h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant={user.isActive !== false ? "default" : "secondary"}
                  className={`text-[10px] uppercase font-bold py-1 px-3 rounded-full tracking-widest shadow-sm border ${user.isActive !== false
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "opacity-60 grayscale border-muted"
                    }`}
                >
                  {user.isActive !== false ? "Active Session" : "Inactive"}
                </Badge>
                {user.isVoided && (
                  <Badge variant="destructive" className="uppercase text-[9px] tracking-tighter px-2">Voided</Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full border border-muted">
                <Fingerprint className="h-3.5 w-3.5 text-primary/70" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-muted-foreground uppercase opacity-80">{user.userID || user.id}</span>
              </div>

            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10 md:mb-1">
          <Button
            variant="outline"
            onClick={() => setEditOpen(true)}
            className="rounded-xl border-muted-foreground/20 h-10 gap-2 font-bold italic text-sm"
          >
            <Edit2 className="h-4 w-4" /> Edit Profile
          </Button>

          {/* <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-red-500/60 hover:text-red-500 hover:bg-red-500/5">
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal Card & Metadata (Grid Span 4) */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="overflow-hidden border-muted shadow-sm rounded-[2.5rem]">
            <div className="aspect-[5/4] relative flex items-center justify-center p-12 bg-muted/5">
              <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-black shadow-lg ring-[10px] ring-background overflow-hidden relative">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  initials
                )}
              </div>



              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
            </div>

            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="p-3  border border-primary/10 rounded-2xl text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Primary Email</p>
                    <p className="text-sm font-bold text-foreground break-all tracking-tight">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="p-3  border border-primary/10 rounded-2xl text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Contact Number</p>
                    <p className="text-sm font-bold text-foreground tracking-tight">{user.phoneNumber || "Not registered"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="p-3  border border-primary/10 rounded-2xl text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ">Member Since</p>
                    <p className="text-sm font-bold text-foreground tracking-tight">
                      {new Date(user.createdDate || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-muted/40" />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-muted/20 border border-muted/30">
                  <Building2 className="h-4 w-4 text-primary/60 mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground leading-none mb-1">Department</p>
                  <p className="text-xs font-bold text-foreground truncate">{user.departmentId || "No Dept"}</p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Experience & Audit Trail (Grid Span 8) */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="shadow-sm border-muted rounded-[2.5rem] bg-card overflow-hidden flex flex-col h-[750px]">
            <CardHeader className="bg-muted/20 border-b border-muted/50 py-5 px-6 md:py-7 md:px-10 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-2.5 bg-primary/10 text-primary rounded-xl shadow-inner border border-primary/20">
                  <Activity className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl font-black">Audit Trail Log</CardTitle>
                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest md:tracking-[0.2em] mt-0.5 md:mt-1">Live monitoring of system events</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <Badge variant="outline" className="rounded-lg border-muted-foreground/20 font-bold opacity-60">Real-time Data</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 md:p-10 grow overflow-hidden relative">
              {activityLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-28 w-full rounded-3xl" />
                  <Skeleton className="h-28 w-full rounded-3xl" />
                  <Skeleton className="h-28 w-full rounded-3xl" />
                </div>
              ) : activity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 grayscale opacity-40">
                  <div className="p-6 bg-muted/20 rounded-full mb-6 border border-muted/50">
                    <Clock className="h-16 w-16 text-muted-foreground/40 stroke-1" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] text-muted-foreground">Historical Void</h3>
                  <p className="text-sm font-medium mt-1 max-w-[250px] mx-auto text-muted-foreground/80">This operative hasn't generated any system interaction logs for the current audit period.</p>
                </div>
              ) : (
                <ScrollArea className="h-full pr-2 md:pr-8">
                  <div className="space-y-12 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted/90">
                    {activity.map((item, index) => (
                      <div key={index} className="relative pl-10 md:pl-14 group/trail">
                        <div className="absolute left-0 top-2 h-8 w-8 rounded-full bg-background border-[2px] border-primary/40 group-hover/trail:border-primary flex items-center justify-center shadow-lg ring-4 ring-primary/5 transition-all duration-300 z-10">
                          <Clock className="h-4 w-4 text-primary group-hover/trail:scale-110 transition-transform" />
                        </div>

                        <div className="p-4 md:p-6 bg-muted/20 border border-muted/60 rounded-[2rem] transition-all duration-300 hover:scale-[1.01] hover:border-primary/40 hover:bg-muted/30 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden backdrop-blur-sm">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border border-primary/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl">
                              {item.actionName || "System Interaction"}
                            </Badge>
                            <div className="flex items-center gap-2 md:gap-3 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/40" />
                              <span className="whitespace-nowrap">{new Date(item.createdDate || "").toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-background/40 rounded-2xl border border-muted/30 shadow-sm overflow-hidden">
                              <Fingerprint className="h-4 w-4 text-primary/60 shrink-0" />
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter shrink-0">Log Id:</span>
                                <span className="font-mono text-[11px] text-foreground font-medium break-all select-all min-w-0">
                                  {item.userActivityLogId?.toString() || "UNDEF_ID"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-background/40 rounded-2xl border border-muted/30 shadow-sm">
                              <User className="h-4 w-4 text-primary/60 shrink-0" />
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Recorded Time:</span>
                                <span className="font-black text-foreground text-sm tracking-tight italic">
                                  {new Date(item.createdDate || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <UserFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        onSuccess={onUpdateSuccess}
      />
    </div>
  );
}
