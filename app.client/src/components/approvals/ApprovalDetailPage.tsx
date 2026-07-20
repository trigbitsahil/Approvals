"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  User,
  ShieldCheck,
  AlertTriangle,
  BadgeCheck,
  Download,
  ExternalLink,
  Users,
  Info,
  ChevronRight,
  Loader2,
  Paperclip,
  CheckCircle2,
  XCircle,
  FileIcon,
  Trash2,
  Plus,
  Mail,
  ThumbsUp,
  ThumbsDown,
  DollarSign,
  MessageSquare,
  BadgeIndianRupee
} from "lucide-react";

import { FilePreviewDialog } from "@/components/FilePreview";
import ConfirmationModal from "@/components/ConfirmationModal";
import { getFileExtension, getMimeType } from "@/utils/file-utils";
import { useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ApprovalService } from "@/api/services/ApprovalService";
import { ApprovalApproverService } from "@/api/services/ApprovalApproverService";
import { ApprovalCommentService } from "@/api/services/ApprovalCommentService";
import { ExpenseTransactionService } from "@/api/services/ExpenseTransactionService";
// import { DocumentsService } from "@/api/services/DocumentsService";
import { UserService } from "@/api/services/UserService";
import { ApprovalStatusService } from "@/api/services/ApprovalStatusService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ApprovalDetailVM } from "@/api/models/ApprovalDetailVM";
import type { ApprovalApproverListVM } from "@/api/models/ApprovalApproverListVM";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import type { ApprovalCommentListVM } from "@/api/models/ApprovalCommentListVM";

// ----- Helpers -----
const getPriorityColor = (p: string | null | undefined) => {
  switch (p) {
    case "High": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "Medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "Low": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    default: return "text-muted-foreground bg-muted/20 border-border/20";
  }
};

const getStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "Approved": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "Rejected": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "Pending": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    default: return "text-muted-foreground bg-muted/20 border-border/20";
  }
};

const getStatusIcon = (status: string | null | undefined) => {
  switch (status) {
    case "Approved": return <BadgeCheck className="h-5 w-5 text-emerald-500" />;
    case "Rejected": return <AlertTriangle className="h-5 w-5 text-rose-500" />;
    case "Pending": return <Clock className="h-5 w-5 text-amber-500" />;
    default: return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [approval, setApproval] = useState<ApprovalDetailVM | null>(null);
  const [approvers, setApprovers] = useState<ApprovalApproverListVM[]>([]);
  const [documents, setDocuments] = useState<DocumentUrlListVM[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentUrlListVM | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);

  // --- Comment states ---
  const [comments, setComments] = useState<ApprovalCommentListVM[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isRefreshingComments, setIsRefreshingComments] = useState(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);

  // --- Approve dialog state ---
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [approvingApprover, setApprovingApprover] = useState<ApprovalApproverListVM | null>(null);
  const [approveRemarks, setApproveRemarks] = useState("");
  const [newApprovedAmount, setNewApprovedAmount] = useState<string>("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejectMode, setIsRejectMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      
      try {
        const approvalRes = await ApprovalService.getApprovalById(id, "1");
        if (approvalRes.success && approvalRes.data) {
          setApproval(approvalRes.data);
        }
      } catch (err) {
        console.error("Error fetching approval:", err);
        toast.error("Failed to load approval details.");
      }

      try {
        const approverRes = await ApprovalApproverService.getApiVApprovalApprover("1", id);
        if (approverRes.success && approverRes.data) {
          setApprovers(approverRes.data.sort((a, b) => (a.approvalOrder || 0) - (b.approvalOrder || 0)));
        }
      } catch (err) {
        console.error("Error fetching approvers:", err);
      }

      // try {
      //   const docRes = await DocumentsService.getApiVDocuments("1", "Approval", id);
      //   if (docRes.success && docRes.data) {
      //     setDocuments(docRes.data);
      //   }
      // } catch (err) {
      //   console.error("Error fetching documents:", err);
      // }

      try {
        const userRes = await UserService.getLoggedInUser("1");
        if (userRes.success && userRes.data) {
          setLoggedInUserEmail(userRes.data.email || null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }

      try {
        // Fetch comments
        const commentRes = await ApprovalCommentService.getApiVApprovalComment("1", id);
        if (commentRes.success && commentRes.data) {
          setComments(commentRes.data.sort((a, b) => new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime()));
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } 
      
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const refreshComments = async () => {
    if (!id) return;
    setIsRefreshingComments(true);
    try {
      const res = await ApprovalCommentService.getApiVApprovalComment("1", id);
      if (res.success && res.data) {
        setComments(res.data.sort((a, b) => new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime()));
      }
    } catch (error) {
      console.error("Error refreshing comments:", error);
    } finally {
      setIsRefreshingComments(false);
    }
  };

  const handleDeleteDocument = (doc: any) => {
    setDocToDelete(doc);
    setIsConfirmOpen(true);
  };

  // const confirmDeleteDocument = async () => {
  //   if (!docToDelete) return;

  //   const docId = docToDelete.documentUrlID || docToDelete.documentID;
  //   if (!docId) {
  //     toast.error("Invalid document ID.");
  //     setIsConfirmOpen(false);
  //     return;
  //   }

  //   try {
  //     await DocumentsService.deleteDocumentUrl(docId, "1");
  //     setDocuments(prev => prev.filter(d => {
  //       const dId = (d as any).documentUrlID || d.documentID;
  //       return dId !== docId;
  //     }));
  //     toast.success("Document deleted.");
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     toast.error("Failed to delete document.");
  //   } finally {
  //     setIsConfirmOpen(false);
  //     setDocToDelete(null);
  //   }
  // };

  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file || !id) return;

  //   setIsUploading(true);
  //   try {
  //     const base64 = await new Promise<string>((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result?.toString() || "");
  //       reader.onerror = reject;
  //     });
  //     const base64Content = base64.split(",")[1];
  //     const ext = getFileExtension(file.name);
  //     const extension = ext.startsWith(".") ? ext : `.${ext}`;

  //     const res = await DocumentsService.postApiVDocuments("1", {
  //       name: file.name,
  //       description: `Approval Attachment`,
  //       content: base64Content,
  //       category: "Approval",
  //       categoryId: id,
  //       extension: extension,
  //       contentType: file.type || getMimeType(file.name),
  //       documentFileName: file.name
  //     } as any);

  //     if (res.success) {
  //       toast.success("File uploaded successfully.");
  //       // Refresh documents
  //       const docRes = await DocumentsService.getApiVDocuments("1", "Approval", id);
  //       if (docRes.success && docRes.data) {
  //         setDocuments(docRes.data);
  //       }
  //     } else {
  //       toast.error(res.message || "Failed to upload file.");
  //     }
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     toast.error("An error occurred during upload.");
  //   } finally {
  //     setIsUploading(false);
  //     if (fileInputRef.current) fileInputRef.current.value = "";
  //   }
  // };

  const handleViewDocument = (doc: DocumentUrlListVM) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleFollowUp = async () => {
    if (!id) return;
    setIsSendingFollowUp(true);
    try {
      const res = await ApprovalApproverService.sendFollowUpEmail("1", id);
      if ((res as any)?.success === false) {
        toast.error((res as any)?.message || "Failed to send follow-up email.");
      } else {
        toast.success("Follow-up email sent successfully!");
      }
    } catch (error) {
      console.error("Follow-up error:", error);
      toast.error("Failed to send follow-up email.");
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  const openApproveDialog = (approver: ApprovalApproverListVM, isReject: boolean = false) => {
    setApprovingApprover(approver);
    setApproveRemarks("");
    setNewApprovedAmount("");
    setIsRejectMode(isReject);
    setIsApproveDialogOpen(true);
  };

  const handleApproveSubmit = async () => {
    if (!approvingApprover?.approvalApproverID || !approval) return;
    setIsApproving(true);
    try {
      // Step 1: Mark approver as approved (PascalCase fallback for backend binding)
      const updatePayload: any = {
        ...approvingApprover,
        approvalID: approvingApprover.approvalId || approval.approvalID, 
        approvalId: approvingApprover.approvalId || approval.approvalID, 
        isResponded: true,
        isApproved: !isRejectMode,
        remarks: approveRemarks || "",
        respondedDate: new Date().toISOString(),
      };

      const updateRes = await ApprovalApproverService.putApiVApprovalApprover("1", updatePayload);

      if (!updateRes.success) {
        toast.error(updateRes.message || "Failed to update approver.");
        return;
      }

      // Step 2: Handle Expense Transaction logic (only for approval path)
      if (!isRejectMode && (approval.approvalType === "Expense" || approval.approvalType === "FinanceExpense") && approval.approvalTypeId) {
        const newAmount = newApprovedAmount !== "" ? parseFloat(newApprovedAmount) : null;

        // Fetch transaction to get old vs new context
        const expRes = await ExpenseTransactionService.getExpenseTransactionById(
          approval.approvalTypeId,
          "1"
        );

        if (expRes.success && expRes.data) {
          const oldAmount = (expRes.data as any).expenseAmountApproved ?? (expRes.data as any).expenseAmount ?? 0;

          // Screenshot check: if (oldAmountApproved != newAmountApproved)
          if (newAmount !== null && oldAmount !== newAmount) {

            // Update Expense Transaction
            const updateExp: any = {
              ...expRes.data,
              expenseAmountApproved: newAmount
            };

            const expUpdateRes = await ExpenseTransactionService.putApiVExpenseTransaction("1", updateExp);

            if (expUpdateRes.success) {
              // Creating Audit Comment (Mirroring Screenshot)
              const commentText = `${approvingApprover.approvalApproverEmail} changed Approved Amount from ${oldAmount} to ${newAmount}`;
              await ApprovalCommentService.postApiVApprovalComment("1", {
                approvalId: approval.approvalID,
                commentText: commentText
              });

              toast.success(`Approved! Amount adjusted from ${oldAmount} to ${newAmount}.`);
            } else {
              toast.success("Approved, but failed to update expense amount.");
            }
          } else {
            toast.success("Approved successfully!");
          }
        } else {
          toast.success("Approved successfully!");
        }
      }

      toast.success(isRejectMode ? "Rejected successfully!" : "Approved successfully!");

      // Step 3: Handle global status update
      const statusRes = await ApprovalStatusService.getApiVApprovalStatus("1");
      if (statusRes.success && statusRes.data) {
        if (isRejectMode) {
          // If anyone rejects, the whole thing is Rejected
          const rejectedStatus = statusRes.data.find(s => s.name === "Rejected");
          if (rejectedStatus?.approvalStatusID) {
            await ApprovalService.putApiVApproval("1", {
              ...approval,
              approvalStatusId: rejectedStatus.approvalStatusID
            } as any);
          }
        } else if (!approval.allApproverApprove) {
          // If "Any" mode and approved, the whole thing is Approved
          const approvedStatus = statusRes.data.find(s => s.name === "Approved");
          if (approvedStatus?.approvalStatusID) {
            await ApprovalService.putApiVApproval("1", {
              ...approval,
              approvalStatusId: approvedStatus.approvalStatusID
            } as any);
          }
        }
      }

      // Refresh data
      const [newApprovalRes, newApproverRes] = await Promise.all([
        ApprovalService.getApprovalById(id!, "1"),
        ApprovalApproverService.getApiVApprovalApprover("1", id!),
      ]);

      if (newApprovalRes.success && newApprovalRes.data) {
        setApproval(newApprovalRes.data);
      }
      if (newApproverRes.success && newApproverRes.data) {
        setApprovers(newApproverRes.data.sort((a, b) => (a.approvalOrder || 0) - (b.approvalOrder || 0)));
      }

      setIsApproveDialogOpen(false);
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("An error occurred during approval.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleAddComment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!id || !newCommentText.trim()) return;

    setIsAddingComment(true);
    try {
      // Mirroring Screenshot: public async Task<IActionResult> AddComment(string approvalId, string comment)
      const res = await ApprovalCommentService.postApiVApprovalComment("1", {
        approvalId: id,
        commentText: newCommentText.trim()
      });

      if (res.success) {
        toast.success("Comment added successfully");
        setNewCommentText("");
        refreshComments();
      } else {
        toast.error(res.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Add comment error:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!commentId) return;

    try {
      // Mirroring Screenshot: public async Task<IActionResult> DeleteComment(string approvalCommentId)
      const res = await ApprovalCommentService.deleteApprovalComment(commentId, "1");

      if ((res as any).success) {
        toast.success("Comment deleted");
        refreshComments();
      } else {
        toast.error((res as any).message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Delete comment error:", error);
      toast.error("Failed to delete comment");
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Approval Details...</p>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
          <Info className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-foreground mb-2">Approval Not Found</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">The approval request you're looking for doesn't exist or you don't have access.</p>
        </div>
        <Button onClick={() => navigate(`/approvals`)} variant="outline" className="rounded-2xl gap-2 font-black uppercase text-xs">
          <ArrowLeft className="h-4 w-4" /> Go Back to Approvals
        </Button>
      </div>
    );
  }

  const respondedCount = approvers.filter(a => a.isResponded).length;
  const progressPercent = approvers.length > 0 ? (respondedCount / approvers.length) * 100 : 0;

  return (
    <div className="relative min-h-screen">
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%]  blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%]  blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/approvals`)}
              className="group -ml-3 p-2 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Back to List</span>
            </Button>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge variant="outline" className={`rounded-xl px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-tighter ${getPriorityColor(approval.priority)}`}>
                  {approval.priority || "Medium"} Priority
                </Badge>
                <div className={`flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-4 rounded-full border shadow-sm backdrop-blur-md ${getStatusColor(approval.approvalStatusName)}`}>
                  {getStatusIcon(approval.approvalStatusName)}
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight">{approval.approvalStatusName || "Pending"}</span>
                </div>
              </div>
            <motion.div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-2xl font-black text-foreground uppercase tracking-tight leading-none mt-2">
                {approval.name || approval.reference || "No Name"}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 sm:mt-6 text-muted-foreground">
                <span className="bg-muted/50 px-2 py-0.5 rounded-md whitespace-nowrap">ID: {approval.approvalID?.slice(-8).toUpperCase()}</span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap text-sm"><Calendar className="h-3.5 w-3.5" /> {approval.requestedDate ? new Date(approval.requestedDate).toLocaleDateString() : "No Date"}</span>
                <span className="text-border hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5 text-sm"><User className="h-3.5 w-3.5" /> Requested by <span className="text-foreground font-bold">{approval.requestedBy || approval.createdBy || "System"}</span></span>
              </div>
            </motion.div>  </div>
          </div>

          {/* FOLLOW-UP BUTTON */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              id="btn-send-follow-up"
              onClick={handleFollowUp}
              disabled={isSendingFollowUp}
              className="flex-1 md:flex-none rounded-2xl h-11 px-6 gap-2 font-black uppercase text-xs shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90"
            >
              {isSendingFollowUp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {isSendingFollowUp ? "Follow-Up" : "Follow-Up"}
            </Button>
          </div>
        </div>

        <Separator className="opacity-10" />

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN: Details & Description */}
          <div className="lg:col-span-2 space-y-8">

            {/* DESCRIPTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-card/60 border border-border/40 rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 backdrop-blur-3xl shadow-2xl transition-all hover:border-primary/30 ring-1 ring-white/5"
            >
              <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="h-12 w-12" />
              </div>
              <h3 className="text-[12px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Request Description
              </h3>
              <div className="text-sm font-medium leading-relaxed mt-1 break-words">
                {approval.description || approval.details || "No description provided for this approval request."}
              </div>
            </motion.div>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Category", value: approval.category || "General", icon: ShieldCheck },
                { label: "Type", value: approval.approvalType || "Other", icon: BadgeCheck },
                { label: "Amount", value: approval.transactionAmount != null ? (sessionStorage.getItem('view_password') ? approval.transactionAmount : approval.transactionAmount / 1000) : "General", icon: BadgeIndianRupee},
                { label: "Requirement", value: approval.allApproverApprove ? "All must approve" : "Any one can approve", icon: Info },
                ...(approval.vendorName ? [{ label: "Vendor", value: approval.vendorName, icon: User }] : [])
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (idx + 1) }}
                  className="flex items-center gap-3 md:gap-4 bg-card/40 border border-border/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:bg-card/60 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg group ring-1 ring-white/5"
                >
                  <div className="p-2.5 sm:p-3 bg-primary/10 border border-primary/20 rounded-xl sm:rounded-2xl text-primary shadow-inner group-hover:scale-110 transition-transform shrink-0">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{item.label}</p>
                    <p className="text-sm font-black text-foreground mt-0.5">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

             

            {/* COMMENTS & AUDIT TRAIL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card/60 border border-border/40 rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 backdrop-blur-3xl shadow-2xl ring-1 ring-white/5"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Request Context & Audit Trail
                </h3>
                {isRefreshingComments && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/40" />}
              </div>

              {/* Add Comment Input */}
              <div className="mb-8 space-y-4">
                <div className="group relative">
                  <textarea
                    placeholder="Enter comment or clarification..."
                    className="w-full bg-muted/20 border border-border/40 rounded-3xl p-5 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none shadow-inner"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <div className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3">
                    <Button
                      onClick={() => handleAddComment()}
                      disabled={isAddingComment || !newCommentText.trim()}
                      className="rounded-2xl h-9 sm:h-10 px-4 sm:px-6 gap-2 font-black uppercase text-[9px] sm:text-[10px] tracking-widest shadow-lg shadow-primary/20 bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {isAddingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" />}
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comment List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                    <MessageSquare className="h-10 w-10 mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No comments registered</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Vertical line connector */}
                    <div className="absolute left-[23px] top-4 bottom-4 w-px bg-border/20 hidden sm:block" />

                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.approvalCommentId} className="group relative flex flex-col sm:flex-row gap-4">
                          <div className="z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-[1.2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-lg border border-primary/10 transition-transform group-hover:rotate-[10deg] shrink-0">
                            <User className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0 bg-white/5 border border-border/20 rounded-3xl p-4 sm:p-5 transition-all group-hover:border-primary/20 group-hover:bg-white/10 shadow-xl">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-foreground truncate uppercase tracking-tight">
                                  {comment.createdBy || "System User"}
                                </p>
                                <p className="text-[9px] text-muted-foreground font-medium uppercase mt-0.5 truncate">
                                  {comment.createdDate ? new Date(comment.createdDate).toLocaleString() : "Audit Entry"}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl transition-all text-red-500 hover:text-red-400 cursor-pointer shrink-0"
                                onClick={() => comment.approvalCommentId && handleDeleteComment(comment.approvalCommentId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                              {comment.commentText}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Pipeline / Approvers */}
          <div className="space-y-8">

            {/* TRACKING CARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card/80 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 border border-border/40 shadow-2xl relative overflow-hidden ring-1 ring-white/5"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 blur-[50px] rounded-full translate-y-1/2 -translate-x-1/2" />

              <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-6 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Approval Timeline
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Progress</span>
                    <span className="text-foreground">{respondedCount} / {approvers.length} Responses</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 rounded-full bg-muted/30" />
                </div>

                <div className="flex items-center gap-3 p-3  border border-primary/10 rounded-2xl text-[11px] font-bold  ">
                  <Info className="h-4 w-4 shrink-0" />
                  {approval.allApproverApprove ? "This request requires ALL approvers to approve." : "Any one of the approvers can approve this request."}
                </div>

                {/* TIMELINE */}
                <div className="pt-4 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border/90" />

                  <div className="space-y-8">
                    {(() => {
                      const anyoneHasResponded = approvers.some(a => a.isResponded);
                      return approvers.map((approver, idx) => {
                        const status = approver.isResponded ? (approver.isApproved ? "Approved" : "Rejected") : "Pending";
                        const isCurrent = !approver.isResponded && (idx === 0 || approvers[idx - 1]?.isResponded);

                        return (
                          <div key={approver.approvalApproverID} className="flex gap-4 relative">
                            <div className={`z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center border-4 border-card transition-all duration-500 shadow-sm shrink-0
                            ${status === "Approved" ? "bg-emerald-500 text-white" :
                                status === "Rejected" ? "bg-rose-500 text-white" :
                                  isCurrent ? "bg-amber-500 text-white animate-pulse" : "bg-muted text-muted-foreground/30"}
                          `}>
                              {status === "Approved" ? <CheckCircle2 className="h-5 w-5" /> :
                                status === "Rejected" ? <XCircle className="h-5 w-5" /> :
                                  <div className="text-xs sm:text-sm font-black">{approver.approvalOrder || idx + 1}</div>}
                            </div>

                            <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-1">
                                <p className="text-sm sm:text-base font-black text-foreground truncate break-all">{approver.approvalApproverEmail?.split('@')[0]}</p>
                                <Badge variant="outline" className={`text-xs font-black uppercase px-2 h-6 rounded-lg w-fit shrink-0 ${status === "Approved" ? "text-emerald-500" : status === "Rejected" ? "text-rose-500" : "text-amber-500"}`}>
                                  {status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground/80 truncate font-medium">{approver.approvalApproverEmail}</p>
                              {approver.remarks && (
                                <p className=" mt-1.5 text-[11px] sm:text-xs   ">
                                  Remarks: <span className="font-medium">"{approver.remarks}"</span>
                                </p>
                              )}
                              {approver.respondedDate && (
                                <p className="mt-1.5 text-[11px] sm:text-xs ">
                                  Responded on {new Date(approver.respondedDate).toLocaleString()}
                                </p>
                              )}
                              {/* Actions — visibility based on sequence and completion */}
                              {!approver.isResponded &&
                                loggedInUserEmail === approver.approvalApproverEmail &&
                                isCurrent &&
                                (approval.allApproverApprove || !anyoneHasResponded) && (
                                  <div className="mt-4 flex flex-col flex-col sm:flex-row items-stretch sm:items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => openApproveDialog(approver, false)}
                                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all active:scale-95 shadow-sm"
                                    >
                                      <ThumbsUp className="h-3.5 w-3.5" />
                                      Approve
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openApproveDialog(approver, true)}
                                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all active:scale-95 shadow-sm"
                                    >
                                      <ThumbsDown className="h-3.5 w-3.5" />
                                      Reject
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>


          </div>
        </div>

        <FilePreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          document={selectedDoc}
        />

        {/* <ConfirmationModal
          open={isConfirmOpen}
          onCancel={() => {
            setIsConfirmOpen(false);
            setDocToDelete(null);
          }}
          onConfirm={confirmDeleteDocument}
          message="Delete Attachment?"
          description={`Are you sure you want to delete "${docToDelete?.name}"? This action cannot be undone.`}
          yesLabel="Delete"
          noLabel="Cancel"
        /> */}

        {/* ── Approve Dialog ── */}
        <Dialog open={isApproveDialogOpen} onOpenChange={(open) => { if (!open) setIsApproveDialogOpen(false); }}>
          <DialogContent className="w-[95vw] sm:max-w-[440px] rounded-3xl border-border/50 bg-card p-0 gap-0 overflow-hidden shadow-2xl">
            <DialogHeader className={`p-6 pb-4 border-b border-border/10 ${isRejectMode ? 'bg-rose-500/5' : 'bg-emerald-500/5'}`}>
              <DialogTitle className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                {isRejectMode ? (
                  <ThumbsDown className="h-4 w-4 text-rose-500" />
                ) : (
                  <ThumbsUp className="h-4 w-4 text-emerald-500" />
                )}
                {isRejectMode ? 'Reject Request' : 'Approve Request'}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1 font-medium italic">
                {approvingApprover?.approvalApproverEmail}
              </p>
            </DialogHeader>

            <div className="p-6 space-y-4">
              {/* Remarks */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3" /> Remarks
                </label>
                <textarea
                  placeholder={isRejectMode ? "Add reason for rejection..." : "Add your remarks (optional)..."}
                  className={`w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm resize-none min-h-[80px] focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground/60
                    ${isRejectMode ? 'focus:ring-rose-500/30 focus:border-rose-500/50' : 'focus:ring-emerald-500/30 focus:border-emerald-500/50'}`}
                  value={approveRemarks}
                  onChange={e => setApproveRemarks(e.target.value)}
                />
              </div>

              {/* New Approved Amount — only if Expense type */}
              {(approval?.approvalType === "Expense" || approval?.approvalType === "FinanceExpense") && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3 w-3" /> New Approved Amount
                    <span className="text-muted-foreground/50 normal-case font-medium">(leave blank to keep existing)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 5000.00"
                    className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all placeholder:text-muted-foreground/60"
                    value={newApprovedAmount}
                    onChange={e => setNewApprovedAmount(e.target.value)}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="p-6 pt-0 flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsApproveDialogOpen(false)}
                className="w-full sm:w-auto rounded-xl h-11 font-black uppercase tracking-widest text-[10px]"
                disabled={isApproving}
              >
                Cancel
              </Button>
              <Button
                type="button"

                disabled={isApproving}
                className={`w-full sm:w-auto rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px]  text-white
                  ${isRejectMode ? 'bg-red-400 hover:bg-red-500 ' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}
                onClick={handleApproveSubmit}
              >
                {isApproving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  isRejectMode ? 'Reject Now' : 'Approve Now'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

  );
}
