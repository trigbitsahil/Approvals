"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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
  Truck,
  BadgeIndianRupee,
  Folder,
  Building2
} from "lucide-react";

import { FilePreviewDialog } from "@/components/FilePreview";
import ConfirmationModal from "@/components/ConfirmationModal";
import ConfirmTransactionModal from "@/components/approvals/ConfirmTransactionModal";
import ApprovalAuditTimelineWidget from "@/components/approvals/ApprovalAuditTimelineWidget";
import { getFileExtension, getMimeType } from "@/utils/file-utils";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ApprovalService } from "@/api/services/ApprovalService";
import { ApprovalApproverService } from "@/api/services/ApprovalApproverService";
import { ApprovalCommentService } from "@/api/services/ApprovalCommentService";
import { ExpenseTransactionService } from "@/api/services/ExpenseTransactionService";
import { UserService } from "@/api/services/UserService";
import { ApprovalStatusService } from "@/api/services/ApprovalStatusService";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { ProjectService } from "@/api/services/ProjectService";
import { ContractService } from "@/api/services/ContractService";
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
import type { PendingBankTransactionVM } from "@/api/models/PendingBankTransactionVM";
import type { ProjectVM } from "@/api/models/ProjectVM";
import type { ContractListVM } from "@/api/models/ContractListVM";

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
    case "Approved": return <BadgeCheck className="h-4 w-4 text-emerald-500" />;
    case "Rejected": return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    case "Pending": return <Clock className="h-4 w-4 text-amber-500" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [approval, setApproval] = useState<ApprovalDetailVM | null>(null);
  const [approvers, setApprovers] = useState<ApprovalApproverListVM[]>([]);
  const [documents, setDocuments] = useState<DocumentUrlListVM[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentUrlListVM | null>(null);

  // --- External Projects & Contracts ---
  const [projects, setProjects] = useState<ProjectVM[]>([]);
  const [contracts, setContracts] = useState<ContractListVM[]>([]);

  // --- Comment states ---
  const [comments, setComments] = useState<ApprovalCommentListVM[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isRefreshingComments, setIsRefreshingComments] = useState(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [pendingTx, setPendingTx] = useState<PendingBankTransactionVM | null>(null);
  const [distributorTx, setDistributorTx] = useState<any | null>(null);
  const [isPayingDistributor, setIsPayingDistributor] = useState(false);
  const [isConfirmingTx, setIsConfirmingTx] = useState(false);
  const [isReceivingFromDistributor, setIsReceivingFromDistributor] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const distributorLeftover = useMemo(() => {
    if (!distributorTx) return 0;
    const dep = distributorTx.deposit ?? 0;
    const wth = distributorTx.withdrawal ?? 0;
    const ref = (distributorTx as any).refundAmount ?? 0;
    return Math.max(0, dep - wth - ref);
  }, [distributorTx]);

  const isAuthorizedConfirmUser = useMemo(() => {
    if (!loggedInUserEmail) return false;
    const emailLower = loggedInUserEmail.trim().toLowerCase();
    const allowedEmails = [
      "sanny.panesar@gmail.com",
      "shahid.hakim@gmail.com",
      "sumaiya.shaikh@wallop.in"
    ];
    return allowedEmails.includes(emailLower);
  }, [loggedInUserEmail]);

  const assignedProject = useMemo(() => {
    if (!approval) return null;
    const pId = (approval as any).projectId || approval.categoryId;
    const pName = (approval as any).projectName || (approval.category === "Project" ? approval.contractName : null);
    return projects.find(p => {
      const matchId = pId && p.projectId && p.projectId.toLowerCase() === String(pId).toLowerCase();
      const matchName = pName && p.name && p.name.toLowerCase() === String(pName).toLowerCase();
      return matchId || matchName;
    }) || null;
  }, [approval, projects]);

  const assignedContract = useMemo(() => {
    if (!approval) return null;
    const cId = (approval as any).contractId;
    const cName = (approval as any).linkedContractName || approval.contractName;
    return contracts.find(c => {
      const targetId = c.contractId || c.contractID;
      const matchId = cId && targetId && String(targetId).toLowerCase() === String(cId).toLowerCase();
      const matchName = cName && c.name && c.name.toLowerCase() === String(cName).toLowerCase();
      return matchId || matchName;
    }) || null;
  }, [approval, contracts]);

  // --- Approve dialog state ---
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [approvingApprover, setApprovingApprover] = useState<ApprovalApproverListVM | null>(null);
  const [approveRemarks, setApproveRemarks] = useState("");
  const [newApprovedAmount, setNewApprovedAmount] = useState<string>("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejectMode, setIsRejectMode] = useState(false);

  const fetchDistributorTx = async (distId?: string) => {
    const targetDistId = distId || approval?.distributorId || pendingTx?.distributorId;
    if (!targetDistId || !id) return;
    try {
      const res = await BankTransactionService.getBankTransactionsByDistributorId(targetDistId);
      if (res.success && res.data) {
        const found = (res.data as any[]).find(t => t.approvalId === id);
        setDistributorTx(found || null);
      }
    } catch (err) {
      console.error("Error fetching distributor tx:", err);
    }
  };

  const fetchPendingTx = async () => {
    if (!id) return;
    try {
      const pTxRes = await BankTransactionService.getPendingBankTransactions();
      if (pTxRes.success && pTxRes.data) {
        const found = (pTxRes.data as PendingBankTransactionVM[]).find(t => t.approvalId === id);
        setPendingTx(found || null);
        if (found?.distributorId) {
          await fetchDistributorTx(found.distributorId);
        }
      }
    } catch (err) {
      console.error("Error fetching pending tx:", err);
    }
  };


  const fetchDocuments = async () => {
    if (!id) return;
    try {
      const docRes = await DocumentsService.getApiVDocuments("1", "Approval", id);
      if (docRes.success && docRes.data) {
        setDocuments(docRes.data);
      }
    } catch (err) {
      console.error("Error fetching approval documents:", err);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      
      try {
        const approvalRes = await ApprovalService.getApprovalById(id, "1");
        if (approvalRes.success && approvalRes.data) {
          setApproval(approvalRes.data);
          if (approvalRes.data.distributorId) {
            await fetchDistributorTx(approvalRes.data.distributorId);
          }
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

      try {
        const userRes = await UserService.getLoggedInUser("1");
        if (userRes.success && userRes.data) {
          setLoggedInUserEmail(userRes.data.email || null);
          setLoggedInUserId(userRes.data.id || null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }

      await fetchPendingTx();
      await fetchDocuments();

      try {
        const projRes = await ProjectService.getProjects("1");
        const pResAny = projRes as any;
        if (Array.isArray(pResAny)) {
          setProjects(pResAny);
        } else if (pResAny?.success && pResAny?.data) {
          setProjects(pResAny.data);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }

      try {
        const contractRes = await ContractService.getApiVContract("1");
        const cResAny = contractRes as any;
        if (Array.isArray(cResAny)) {
          setContracts(cResAny);
        } else if (cResAny?.success && cResAny?.data) {
          setContracts(cResAny.data);
        }
      } catch (err) {
        console.error("Error fetching contracts:", err);
      }

      try {
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

  const handlePayDistributor = async () => {
    if (!pendingTx?.transactionId) return;
    setIsPayingDistributor(true);
    try {
      const res = await BankTransactionService.payDistributor(pendingTx.transactionId);
      if (res.success) {
        toast.success(res.message || "Paid to distributor successfully.");
        await fetchPendingTx();
      } else {
        toast.error(res.message || "Failed to mark paid to distributor.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred.");
    } finally {
      setIsPayingDistributor(false);
    }
  };

  const handleConfirmTransaction = async () => {
    if (!pendingTx?.transactionId) return;
    setIsConfirmingTx(true);
    try {
      const res = await BankTransactionService.confirmTransaction(pendingTx.transactionId);
      if (res.success) {
        toast.success(res.message || "Transaction confirmed successfully.");
        await fetchPendingTx();
      } else {
        toast.error(res.message || "Failed to confirm transaction.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred.");
    } finally {
      setIsConfirmingTx(false);
    }
  };

  const handleReceiveFromDistributor = async () => {
    const targetTxId = distributorTx?.transactionId || pendingTx?.transactionId;
    const targetDistId = approval?.distributorId || distributorTx?.distributorId || pendingTx?.distributorId;
    if (!targetTxId) return;
    setIsReceivingFromDistributor(true);
    try {
      const res = await BankTransactionService.receiveFromDistributor(targetTxId, distributorLeftover);
      if (res.success) {
        toast.success(res.message || "Received from distributor successfully.");
        setDistributorTx((prev: any) => prev ? { ...prev, refundAmount: (prev.refundAmount || 0) + distributorLeftover } : null);
        await fetchPendingTx();
        if (targetDistId) {
          await fetchDistributorTx(targetDistId);
        }
        setHistoryRefreshKey((prev) => prev + 1);
      } else {
        toast.error(res.message || "Failed to receive from distributor.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred.");
    } finally {
      setIsReceivingFromDistributor(false);
    }
  };


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

  const openApproveDialog = (approver: ApprovalApproverListVM, reject: boolean) => {
    setApprovingApprover(approver);
    setIsRejectMode(reject);
    setApproveRemarks("");
    setNewApprovedAmount("");
    setIsApproveDialogOpen(true);
  };

  const handleApproveSubmit = async () => {
    if (!approvingApprover || !approval) return;

    setIsApproving(true);
    try {
      const updatePayload: any = {
        ...approvingApprover,
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

      if (!isRejectMode && (approval.approvalType === "Expense" || approval.approvalType === "FinanceExpense") && approval.approvalTypeId) {
        const newAmount = newApprovedAmount !== "" ? parseFloat(newApprovedAmount) : null;

        const expRes = await ExpenseTransactionService.getExpenseTransactionById(
          approval.approvalTypeId,
          "1"
        );

        if (expRes.success && expRes.data) {
          const oldAmount = (expRes.data as any).expenseAmountApproved ?? (expRes.data as any).expenseAmount ?? 0;

          if (newAmount !== null && oldAmount !== newAmount) {
            const updateExp: any = {
              ...expRes.data,
              expenseAmountApproved: newAmount
            };

            const expUpdateRes = await ExpenseTransactionService.putApiVExpenseTransaction("1", updateExp);

            if (expUpdateRes.success) {
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

      const statusRes = await ApprovalStatusService.getApiVApprovalStatus("1");
      if (statusRes.success && statusRes.data) {
        if (isRejectMode) {
          const rejectedStatus = statusRes.data.find(s => s.name === "Rejected");
          if (rejectedStatus?.approvalStatusID) {
            await ApprovalService.putApiVApproval("1", {
              ...approval,
              approvalStatusId: rejectedStatus.approvalStatusID
            } as any);
          }
        } else if (!approval.allApproverApprove) {
          const approvedStatus = statusRes.data.find(s => s.name === "Approved");
          if (approvedStatus?.approvalStatusID) {
            await ApprovalService.putApiVApproval("1", {
              ...approval,
              approvalStatusId: approvedStatus.approvalStatusID
            } as any);
          }
        }
      }

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
    <div className="w-full space-y-6">

        {/* UNIFIED HEADER & METADATA CARD SECTION */}
        <div className="bg-card border border-border/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/approvals`)}
                className="-ml-2.5 h-7 text-muted-foreground hover:text-foreground text-xs gap-1.5 p-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Back to List</span>
              </Button>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground uppercase tracking-tight leading-tight">
                {approval.name || approval.reference || "No Name"}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {approval.requestedDate ? new Date(approval.requestedDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "No Date"}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Requested by <span className="text-foreground font-bold">{approval.requestedBy || approval.createdBy || "System"}</span>
                </span>
              </div>
            </div>

            {/* Badges & Actions Aligned Right */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:justify-end shrink-0 self-start md:self-center">
              <Badge variant="outline" className={`rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${getPriorityColor(approval.priority)}`}>
                {approval.priority || "Medium"} Priority
              </Badge>
              <div className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full border shadow-sm ${getStatusColor(approval.approvalStatusName)}`}>
                {getStatusIcon(approval.approvalStatusName)}
                <span className="text-[11px] font-black uppercase tracking-wider">{approval.approvalStatusName || "Pending"}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/30" />

          {/* Subcards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {(() => {
              const baseType = approval.approvalType || "General";
              let typeValue = baseType;
              if (approval.fromBankName && approval.toBankName) {
                typeValue = `${baseType} (${approval.fromBankName} → ${approval.toBankName})`;
              } else if (approval.toBankName) {
                typeValue = `${baseType} (${approval.toBankName})`;
              } else if (approval.fromBankName) {
                typeValue = `${baseType} (${approval.fromBankName})`;
              }

              const formattedAmount = approval.transactionAmount != null
                ? `₹${Number(approval.transactionAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                : "N/A";

              const infoItems = [
                { label: "Category", value: approval.category || "General", icon: ShieldCheck },
                { label: "Type", value: typeValue, icon: BadgeCheck },
                { label: "Amount", value: formattedAmount, icon: BadgeIndianRupee },
                { label: "Requirement", value: approval.allApproverApprove ? "All must approve" : "Any one can approve", icon: Info },
              ];

              if (approval.debtorName) {
                infoItems.push({ label: "Debtor", value: approval.debtorName, icon: User });
              }
              if (approval.distributorName) {
                infoItems.push({ label: "Distributor", value: approval.distributorName, icon: Truck });
              }
              if (approval.vendorName) {
                infoItems.push({ 
                  label: "Vendor", 
                  value: approval.vendorCategoryName ? `${approval.vendorName} (${approval.vendorCategoryName})` : approval.vendorName, 
                  icon: User 
                });
              }
              if (assignedContract || approval.linkedContractName || approval.contractName || (approval as any).contractId) {
                const cVal = assignedContract?.name || approval.linkedContractName || approval.contractName || (approval as any).contractId;
                infoItems.push({ label: "Contract", value: cVal, icon: FileText });
              }
              if (assignedProject || (approval as any).projectName || (approval as any).projectId) {
                const pVal = assignedProject?.name || (approval as any).projectName || (approval as any).projectId;
                infoItems.push({ label: "Project", value: pVal, icon: Folder });
              }

              return infoItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-muted/50 dark:bg-muted/40 border border-border/80 dark:border-border/60 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:border-primary/50 transition-all"
                >
                  <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary shrink-0">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{item.label}</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground break-words leading-snug mt-0.5" title={item.value}>{item.value}</p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* MAIN CONTENT TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT COLUMN: Request Description & Comments */}
          <div className="lg:col-span-2 space-y-6">

            {/* REQUEST DESCRIPTION */}
            <div className="bg-card border border-border/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Request Description
              </h3>
              <div className="text-sm font-medium leading-relaxed text-foreground break-words">
                {approval.description || approval.details || "No description provided for this approval request."}
              </div>
            </div>

            {/* ASSIGNED PROJECT & CONTRACT DETAILS CARD */}
            {(assignedProject || assignedContract || (approval as any).projectId || (approval as any).contractId || (approval as any).projectName || approval.linkedContractName || approval.contractName) && (
              <div className="bg-card border border-border/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Assigned Project & Contract Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Details */}
                  {(assignedProject || (approval as any).projectId || (approval as any).projectName) && (
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <Folder className="h-4 w-4" />
                        <span>Project Details</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-foreground text-sm">
                          {assignedProject?.name || (approval as any).projectName || (approval as any).projectId}
                        </p>
                        {assignedProject?.description && (
                          <p className="text-muted-foreground">{assignedProject.description}</p>
                        )}
                        {assignedProject?.statusName && (
                          <div className="pt-1">
                            <Badge variant="outline" className="text-[10px] font-semibold bg-primary/10 border-primary/20 text-primary">
                              {assignedProject.statusName}
                            </Badge>
                          </div>
                        )}
                        {assignedProject?.startDate && (
                          <p className="text-[11px] text-muted-foreground pt-1">
                            Start: {new Date(assignedProject.startDate).toLocaleDateString("en-IN")}
                            {assignedProject.endDate ? ` • End: ${new Date(assignedProject.endDate).toLocaleDateString("en-IN")}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contract Details */}
                  {(assignedContract || (approval as any).contractId || (approval as any).linkedContractName || (approval as any).contractName) && (
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <FileText className="h-4 w-4" />
                        <span>Contract Details</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-foreground text-sm">
                          {assignedContract?.name || approval.linkedContractName || approval.contractName || (approval as any).contractId}
                        </p>
                        {assignedContract?.contractNo && (
                          <p className="text-muted-foreground">Contract No: <span className="font-medium text-foreground">{assignedContract.contractNo}</span></p>
                        )}
                        {assignedContract?.govtBodyName && (
                          <p className="text-muted-foreground">Govt Body: <span className="font-medium text-foreground">{assignedContract.govtBodyName}</span></p>
                        )}
                        {assignedContract?.cityName && (
                          <p className="text-muted-foreground">City: <span className="font-medium text-foreground">{assignedContract.cityName}</span></p>
                        )}
                        {assignedContract?.contractStartDate && (
                          <p className="text-[11px] text-muted-foreground pt-1">
                            Start: {new Date(assignedContract.contractStartDate).toLocaleDateString("en-IN")}
                            {assignedContract.contractEndDate ? ` • End: ${new Date(assignedContract.contractEndDate).toLocaleDateString("en-IN")}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AUDIT HISTORY TIMELINE WIDGET */}
            <ApprovalAuditTimelineWidget approvalId={id || ""} refreshKey={historyRefreshKey} />

            {/* COMMENTS & AUDIT TRAIL */}
            <div className="bg-card border border-border/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Request Context & Audit Trail
                </h3>
                {isRefreshingComments && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/40" />}
              </div>

              {/* Comment List */}
              <div className="space-y-4 mb-6">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center opacity-40 bg-muted/10 rounded-2xl border border-dashed border-border/40">
                    <MessageSquare className="h-7 w-7 mb-1.5" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No comments registered</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                    {comments.map((comment) => (
                      <div key={comment.approvalCommentId} className="flex gap-3 bg-muted/20 border border-border/30 rounded-2xl p-4 transition-all hover:border-border/50">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          {/* Primary: Comment Text */}
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm sm:text-base font-bold text-foreground leading-snug break-words">
                              {comment.commentText}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 shrink-0 -mr-1 -mt-1"
                              onClick={() => comment.approvalCommentId && handleDeleteComment(comment.approvalCommentId)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          {/* Secondary: Email & Timestamp */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium pt-1 border-t border-border/20">
                            <span className="font-semibold text-foreground/80">
                              {comment.createdBy || "System User"}
                            </span>
                            <span className="text-border">•</span>
                            <span>
                              {comment.createdDate ? new Date(comment.createdDate).toLocaleString("en-IN", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Audit Entry"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Comment Input Below */}
              <div className="pt-4 border-t border-border/30 space-y-3">
                <div className="group relative">
                  <textarea
                    placeholder="Enter comment or clarification..."
                    className="w-full bg-muted/20 border border-border/40 rounded-2xl p-4 text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => handleAddComment()}
                      disabled={isAddingComment || !newCommentText.trim()}
                      className="rounded-xl h-9 px-4 gap-2 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
                    >
                      {isAddingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" />}
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Approval Timeline */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-border/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Approval Timeline
                </h3>
                
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Progress</span>
                    <span className="text-foreground">{respondedCount} / {approvers.length} Responses</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 rounded-full bg-muted/30" />
                </div>

                <div className="flex items-center gap-2.5 p-3 border border-primary/10 rounded-xl text-[11px] font-bold bg-primary/5 text-foreground">
                  <Info className="h-4 w-4 shrink-0 text-primary" />
                  {approval.allApproverApprove ? "This request requires ALL approvers to approve." : "Any one of the approvers can approve this request."}
                </div>

                {/* TIMELINE */}
                <div className="pt-2 relative">
                  <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border/60" />

                  <div className="space-y-6">
                    {(() => {
                      const anyoneHasResponded = approvers.some(a => a.isResponded);
                      return approvers.map((approver, idx) => {
                        const status = approver.isResponded ? (approver.isApproved ? "Approved" : "Rejected") : "Pending";
                        const isCurrent = !approver.isResponded && (idx === 0 || approvers[idx - 1]?.isResponded);

                        return (
                          <div key={approver.approvalApproverID} className="flex gap-3 relative">
                            <div className={`z-10 h-9 w-9 rounded-full flex items-center justify-center border-2 border-card transition-all shadow-sm shrink-0
                            ${status === "Approved" ? "bg-emerald-500 text-white" :
                                status === "Rejected" ? "bg-rose-500 text-white" :
                                  isCurrent ? "bg-amber-500 text-white animate-pulse" : "bg-muted text-muted-foreground/40"}
                          `}>
                              {status === "Approved" ? <CheckCircle2 className="h-4 w-4" /> :
                                status === "Rejected" ? <XCircle className="h-4 w-4" /> :
                                  <div className="text-xs font-bold">{approver.approvalOrder || idx + 1}</div>}
                            </div>

                            <div className="flex-1 min-w-0 pt-0.5">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <p className="text-xs sm:text-sm font-bold text-foreground truncate">{approver.approvalApproverEmail?.split('@')[0]}</p>
                                <Badge variant="outline" className={`text-[10px] font-black uppercase px-2 h-5 rounded-md shrink-0 ${status === "Approved" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : status === "Rejected" ? "text-rose-500 bg-rose-500/10 border-rose-500/20" : "text-amber-500 bg-amber-500/10 border-amber-500/20"}`}>
                                  {status}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate">{approver.approvalApproverEmail}</p>
                              {approver.remarks && (
                                <p className="mt-1 text-[11px] text-muted-foreground italic">
                                  Remarks: "{approver.remarks}"
                                </p>
                              )}
                              {approver.respondedDate && (
                                <p className="mt-1 text-[10px] text-muted-foreground/70">
                                  Responded on {new Date(approver.respondedDate).toLocaleString()}
                                </p>
                              )}
                              {!approver.isResponded &&
                                loggedInUserEmail === approver.approvalApproverEmail &&
                                isCurrent &&
                                (approval.allApproverApprove || !anyoneHasResponded) && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openApproveDialog(approver, false)}
                                      className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-black uppercase tracking-wider hover:bg-emerald-500/20 transition-all"
                                    >
                                      <ThumbsUp className="h-3.5 w-3.5" />
                                      Approve
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openApproveDialog(approver, true)}
                                      className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-black uppercase tracking-wider hover:bg-rose-500/20 transition-all"
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

                {/* Bank Transaction Settlement & Processing Action Section */}
                {(pendingTx || distributorTx) && (
                  <div className="pt-4 border-t border-border/40 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-primary" /> Bank Settlement Processing
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        {pendingTx?.derivedStatus === "Completed" || pendingTx?.isConfirm || distributorTx?.isConfirm ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-xs font-bold">
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                              <span>Transaction Completed</span>
                            </div>
                            {distributorLeftover > 0 && (distributorTx?.isConfirm || pendingTx?.isConfirm) && isAuthorizedConfirmUser && (
                              <Button
                                onClick={handleReceiveFromDistributor}
                                disabled={isReceivingFromDistributor}
                                className="w-full rounded-xl h-10 px-4 gap-2 font-black uppercase text-xs bg-primary text-white shadow-md transition-all hover:scale-105 active:scale-95"
                              >
                                {isReceivingFromDistributor ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Truck className="h-4 w-4" />
                                )}
                                Receive from Distributor (₹{distributorLeftover.toLocaleString("en-IN", { minimumFractionDigits: 2 })})
                              </Button>
                            )}
                          </div>
                        ) : (!pendingTx?.isConfirm && (pendingTx?.isPaidToDistributor || pendingTx?.approvalType === "Receipt") && isAuthorizedConfirmUser) ? (
                          <Button
                            onClick={() => setIsConfirmModalOpen(true)}
                            disabled={isConfirmingTx}
                            className="w-full rounded-xl h-10 px-4 gap-2 font-black uppercase text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all hover:scale-105 active:scale-95"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Confirm Transaction
                          </Button>
                        ) : !pendingTx?.isPaidToDistributor && pendingTx?.approvalType !== "Receipt" ? (
                          loggedInUserId && loggedInUserId === pendingTx?.assignedBankUserId ? (
                            <Button
                              onClick={handlePayDistributor}
                              disabled={isPayingDistributor}
                              className="w-full rounded-xl h-10 px-4 gap-2 font-black uppercase text-xs text-white shadow-md transition-all hover:scale-105 active:scale-95"
                            >
                              {isPayingDistributor ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Truck className="h-4 w-4" />
                              )}
                              Paid to Distributor
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border/30 rounded-xl text-muted-foreground text-xs font-medium">
                              <Clock className="h-4 w-4 shrink-0" />
                              <span>Awaiting Bank Confirmation</span>
                            </div>
                          )
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 text-xs font-bold">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>Awaiting Confirmation</span>
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const targetId = pendingTx?.transactionId || distributorTx?.transactionId || pendingTx?.approvalId || id;
                          if (targetId) {
                            navigate(`/bank-transactions?tab=pending&txId=${targetId}`);
                          } else {
                            navigate('/bank-transactions?tab=pending');
                          }
                        }}
                        title="View Bank Transactions"
                        className="h-10 w-10 shrink-0 rounded-xl border-border/40 hover:bg-accent hover:text-accent-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ATTACHED DOCUMENTS & SETTLEMENT PROOFS */}
            <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-border/40 shadow-sm relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-primary" />
                  Attached Documents at time of confirmation
                </h3>
                <Badge variant="outline" className="rounded-xl px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  {documents.length} {documents.length === 1 ? 'file' : 'files'}
                </Badge>
              </div>

              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center bg-muted/10 rounded-2xl border border-dashed border-border/40">
                  <Paperclip className="h-6 w-6 text-muted-foreground/40 mb-2" />
                  <p className="text-xs font-bold text-muted-foreground">No attached documents</p>
                
                </div>
              ) : (
                <div className="space-y-2.5">
                  {documents.map((doc, idx) => (
                    <div
                      key={doc.documentID || idx}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setIsPreviewOpen(true);
                      }}
                      className="group flex items-center justify-between p-3 bg-muted/20 border border-border/40 hover:border-primary/40 hover:bg-primary/5 rounded-2xl cursor-pointer transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-primary/10 border border-primary/20 rounded-xl text-primary shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {doc.name || "Attached Document"}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium mt-0.5">
                            {doc.extension && (
                              <span className="uppercase font-bold text-primary/80 bg-primary/10 px-1.5 py-0.2 rounded-md">
                                {doc.extension.replace(".", "")}
                              </span>
                            )}
                            {doc.createdDate && (
                              <span>{new Date(doc.createdDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-xl shrink-0 opacity-70 group-hover:opacity-100 group-hover:bg-primary/10 group-hover:text-primary transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(doc);
                          setIsPreviewOpen(true);
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <FilePreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          document={selectedDoc}
        />

        <ConfirmTransactionModal
          open={isConfirmModalOpen}
          onOpenChange={setIsConfirmModalOpen}
          pendingTx={pendingTx}
          approvalId={id || ""}
          approvalType={approval?.approvalType}
          onSuccess={async () => {
            await fetchPendingTx();
            const distId = approval?.distributorId || pendingTx?.distributorId;
            if (distId) {
              await fetchDistributorTx(distId);
            }
            await fetchDocuments();
            setHistoryRefreshKey((prev) => prev + 1);
          }}
        />

        {/* Approve / Reject Modal Dialog */}
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
                className={`w-full sm:w-auto rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px] text-white
                  ${isRejectMode ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}
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
  );
}
