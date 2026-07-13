"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  Clock,
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Trash2,
  Edit2,
  Eye,
  FileText,
  ArrowRight,
  Loader2,
  BadgeCheck,
  ShieldCheck,
  AlertTriangle,
  Send,
  GripVertical,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Users,

  Tag,
  Calendar,
  Wallet,
  Building2,
  Folder,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectService } from "@/api/services/ProjectService";
import { UserService } from "@/api/services/UserService";
import { ApprovalService } from "@/api/services/ApprovalService";
import { ApprovalApproverService } from "@/api/services/ApprovalApproverService";
import { ApprovalStatusService } from "@/api/services/ApprovalStatusService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { ExpenseService } from "@/api/services/ExpenseService";
import { ExpenseTransactionService } from "@/api/services/ExpenseTransactionService";
import { ExpenseTypeService } from "@/api/services/ExpenseTypeService";
import { VendorService } from "@/api/services/VendorService";
import { BudgetService } from "@/api/services/BudgetService";
import { ContractService } from "@/api/services/ContractService";
import { ContractMediaUnitService } from "@/api/services/ContractMediaUnitService";
import type { ProjectListVM } from "@/api/models/ProjectListVM";
import type { UserListVM } from "@/api/models/UserListVM";
import type { ApprovalListVM } from "@/api/models/ApprovalListVM";
import type { ApprovalStatusListVM } from "@/api/models/ApprovalStatusListVM";
import type { ExpenseListVM } from "@/api/models/ExpenseListVM";
import type { ExpenseTypeDetailVM } from "@/api/models/ExpenseTypeDetailVM";
import type { VendorListVM } from "@/api/models/VendorListVM";
import type { BudgetListVM } from "@/api/models/BudgetListVM";
import type { ExpenseTransactionListForApprovalVM } from "@/api/models/ExpenseTransactionListForApprovalVM";
import type { ContractListVM } from "@/api/models/ContractListVM";
import type { ContractMediaUnitListVM } from "@/api/models/ContractMediaUnitListVM";
import { getFileExtension, getMimeType } from "@/utils/file-utils";


// ----- Types -----
type Priority = "High" | "Medium" | "Low";
type ApprovalStatus = "Pending" | "Approved" | "Rejected";

interface OrderedUser {
  email: string;
  userId: string;
  displayName: string;
  order: number;
}

// ----- Helpers -----
const getPriorityColor = (p: string) => {
  switch (p) {
    case "High": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "Medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "Low": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    default: return "text-muted-foreground bg-muted/20 border-border/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved": return <BadgeCheck className="h-4 w-4 text-emerald-500" />;
    case "Pending": return <Clock className="h-4 w-4 text-amber-500" />;
    case "Rejected": return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "Approved": return "text-emerald-500";
    case "Pending": return "text-amber-500";
    case "Rejected": return "text-rose-500";
    default: return "text-muted-foreground";
  }
};

const APPROVAL_FOR_OPTIONS = ["Project", "Expense"];
const PRIORITY_OPTIONS: Priority[] = ["High", "Medium", "Low"];

// ----- Sortable User Row -----
function SortableUserRow({
  user,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  dragHandleProps,
}: {
  user: OrderedUser;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  dragHandleProps: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
}) {
  return (
    <div
      {...dragHandleProps}
      className="flex items-center gap-3 p-3 bg-muted/20 border border-border/30 rounded-xl group hover:border-primary/30 hover:bg-primary/5 transition-all cursor-grab active:cursor-grabbing select-none"
    >
      <div className="flex items-center gap-2 text-muted-foreground/50 group-hover:text-primary/50 transition-colors">
        <GripVertical className="h-4 w-4" />
        <span className="text-[10px] font-black w-4 text-center">{index + 1}</span>
      </div>

      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary shrink-0">
        {(user.displayName || user.email)[0]?.toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground truncate">{user.displayName || user.email}</p>
        {user.displayName && <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={index === 0}
          onClick={onMoveUp}
          className="p-1 rounded-lg hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={onMoveDown}
          className="p-1 rounded-lg hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function ApprovalsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const projectId = searchParams.get("projectId") || localStorage.getItem("activeProjectId");

  // --- Data from APIs ---
  const [projects, setProjects] = useState<ProjectListVM[]>([]);
  const [users, setUsers] = useState<UserListVM[]>([]);
  const [approvalStatuses, setApprovalStatuses] = useState<ApprovalStatusListVM[]>([]);
  const [expenses, setExpenses] = useState<ExpenseListVM[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseTypeDetailVM[]>([]);
  const [vendors, setVendors] = useState<VendorListVM[]>([]);
  const [budgets, setBudgets] = useState<BudgetListVM[]>([]);
  const [contracts, setContracts] = useState<ContractListVM[]>([]);
  const [approvals, setApprovals] = useState<ApprovalListVM[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [loggedInDepartmentId, setLoggedInDepartmentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "finance">("general");
  const [expenseApprovals, setExpenseApprovals] = useState<ExpenseTransactionListForApprovalVM[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [isCreatingFinance, setIsCreatingFinance] = useState(false);
  const [targetBudgetApprovalId, setTargetBudgetApprovalId] = useState<string | null>(null);
  const [targetExpenseTransactionId, setTargetExpenseTransactionId] = useState<string | null>(null);

  // --- UI State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalListVM | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPaymentTransaction, setSelectedPaymentTransaction] = useState<ExpenseTransactionListForApprovalVM | null>(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [editingApproval, setEditingApproval] = useState<ApprovalListVM | null>(null);
  const [showAll, setShowAll] = useState(false);

  // --- List Filtering State ---
  const [listFilterCategory, setListFilterCategory] = useState<"Project" | "Expense">(projectId ? "Project" : "Project");
  const [listFilterId, setListFilterId] = useState<string>(projectId || "");

  // --- Form State ---
  const [approvalFor, setApprovalFor] = useState("Project");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>("");
  const [selectedContractId, setSelectedContractId] = useState<string>("");
  const [mediaUnits, setMediaUnits] = useState<ContractMediaUnitListVM[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string>("");
  const [loadingMediaUnits, setLoadingMediaUnits] = useState(false);
  const [approvalName, setApprovalName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [approvalType, setApprovalType] = useState("Other");
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [allApproverApprove, setAllApproverApprove] = useState(false);

  // --- OfficeNote extra fields ---
  const [officeNoteDate, setOfficeNoteDate] = useState("");
  const [officeNoteText, setOfficeNoteText] = useState("");
  const [officeNotePurpose, setOfficeNotePurpose] = useState("");

  // --- Expense extra fields ---
  const [expenseAmount, setExpenseAmount] = useState<string>("");
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedExpenseCategoryId, setSelectedExpenseCategoryId] = useState("");
  const [selectedExpenseTypeId, setSelectedExpenseTypeId] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [isAdvance, setIsAdvance] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  // --- User multi-select ---
  const [userSearch, setUserSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [orderedUsers, setOrderedUsers] = useState<OrderedUser[]>([]);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // --- File Upload ---
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Drag state for reorder ---
  const dragIndex = useRef<number | null>(null);

  // ===== Load approval list when filters change =====
  useEffect(() => {
    const loadApprovals = async () => {
      setLoadingApprovals(true);
      try {
        const approvalRes = await ApprovalService.getApiVApproval(
          "1",
          listFilterCategory,
          (listFilterId === "all" || !listFilterId) ? undefined : listFilterId
        );
        if (approvalRes.success && approvalRes.data) setApprovals(approvalRes.data);
      } catch (err) {
        console.error("Approvals fetch error:", err);
      } finally {
        setLoadingApprovals(false);
      }
    };
    loadApprovals();
  }, [listFilterCategory, listFilterId]);

  useEffect(() => {
    const loadExpenseApprovals = async () => {
      setLoadingExpenses(true);
      try {
        const res = await ExpenseTransactionService.getExpenseTransactionListForApproval("1");
        if (res.success && res.data) setExpenseApprovals(res.data);
      } catch (err) {
        console.error("Expense approvals fetch error:", err);
      } finally {
        setLoadingExpenses(false);
      }
    };
    if (activeTab === "finance") loadExpenseApprovals();
  }, [activeTab]);

  // ===== Load global reference data (Projects, Expenses, Users, Statuses) on Mount =====
  useEffect(() => {
    const loadGlobalData = async () => {
      setLoadingFormData(true);

      const safeFetch = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
        try {
          return await promise;
        } catch (err) {
          console.error("Failed fetching reference data item:", err);
          return fallback;
        }
      };

      try {
        const [projRes, userRes, statusRes, expRes, loggedInRes, expTypeRes, vendorRes, budgetRes, contractRes] = await Promise.all([
          safeFetch(ProjectService.projectGet("1"), { success: false, data: [] }),
          safeFetch(UserService.getApiVUser("1"), { success: false, data: [] }),
          safeFetch(ApprovalStatusService.getApiVApprovalStatus("1"), { success: false, data: [] }),
          safeFetch(ExpenseService.getApiVExpense("1"), { success: false, data: [] }),
          safeFetch(UserService.getLoggedInUser("1"), { success: false, data: null }),
          safeFetch(ExpenseTypeService.getApiVExpenseType("1"), { success: false, data: [] }),
          safeFetch(VendorService.getApiVVendor("1"), { success: false, data: [] }),
          safeFetch(BudgetService.getApiVBudget("1"), { success: false, data: [] }),
          safeFetch(ContractService.getApiVContract("1"), { success: false, data: [] })
        ]);
        if (projRes.success && projRes.data) setProjects(projRes.data);
        if (userRes.success && userRes.data) setUsers(userRes.data);
        if (statusRes.success && statusRes.data) setApprovalStatuses(statusRes.data);
        if (expRes.success && expRes.data) setExpenses(expRes.data);
        if (expTypeRes.success && expTypeRes.data) setExpenseTypes(expTypeRes.data as any);
        if (vendorRes.success && vendorRes.data) setVendors(vendorRes.data);
        if (budgetRes.success && budgetRes.data) setBudgets(budgetRes.data);
        if (contractRes.success && contractRes.data) setContracts(contractRes.data);
        if (loggedInRes.success && loggedInRes.data?.departmentId) {
          setLoggedInDepartmentId(loggedInRes.data.departmentId);
        }
      } catch (err) {
        console.error("Reference data fetch error:", err);
      } finally {
        setLoadingFormData(false);
      }
    };
    loadGlobalData();
  }, []);

  // Load media units whenever contract changes
  useEffect(() => {
    const loadMediaUnits = async () => {
      if (!selectedContractId) {
        setMediaUnits([]);
        return;
      }
      setLoadingMediaUnits(true);
      try {
        const res = await ContractMediaUnitService.getApiVContractMediaUnit("1", selectedContractId);
        if (res.success && res.data) {
          setMediaUnits(res.data);
        } else {
          setMediaUnits([]);
        }
      } catch (err) {
        console.error("Error loading media units:", err);
        setMediaUnits([]);
      } finally {
        setLoadingMediaUnits(false);
      }
    };
    if (approvalFor === "Contract") {
      loadMediaUnits();
    } else {
      setMediaUnits([]);
    }
  }, [selectedContractId, approvalFor]);

  // Pre-fill project dropdown once projects are loaded
  useEffect(() => {
    if (projectId && projects.length > 0) {
      // Ensure we only set it if it's not already set to something else
      if (!selectedProjectId || selectedProjectId === "") {
        setSelectedProjectId(projectId);
      }
    }
  }, [projectId, projects]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ===== User Selection =====
  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase();
    const alreadySelected = orderedUsers.some(ou => ou.userId === (u.userID || u.id));
    if (alreadySelected) return false;
    return (
      u.email?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.userName?.toLowerCase().includes(q)
    );
  });

  const addUser = (u: UserListVM) => {
    const newUser: OrderedUser = {
      userId: u.userID || u.id || "",
      email: u.email || "",
      displayName: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.userName || u.email || "",
      order: orderedUsers.length + 1,
    };
    setOrderedUsers(prev => [...prev, newUser]);
    setUserSearch("");
  };

  const removeUser = (userId: string) => {
    setOrderedUsers(prev =>
      prev.filter(u => u.userId !== userId).map((u, i) => ({ ...u, order: i + 1 }))
    );
  };

  const moveUser = (fromIndex: number, toIndex: number) => {
    setOrderedUsers(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr.map((u, i) => ({ ...u, order: i + 1 }));
    });
  };

  // ===== File Upload =====
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadFile(file);
  };

  const uploadDocument = async (approvalId: string, file: File) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const dataUrl = ev.target?.result as string;
          if (!dataUrl) return;
          const base64Content = dataUrl.split(",")[1];
          const ext = getFileExtension(file.name);

          const extension = ext.startsWith(".") ? ext : `.${ext}`;

          await DocumentsService.postApiVDocuments("1", {
            name: file.name,
            description: `Document for Approval`,
            url: dataUrl,
            content: base64Content,
            category: "Approval",
            categoryId: approvalId,
            extension: extension,
            contentType: file.type || getMimeType(file.name),
            documentFileName: file.name
          } as any);

        } catch (err) {
          console.error("Document upload error:", err);
        }
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  // ===== Reset Form =====
  const resetForm = () => {
    setApprovalFor("Project");
    setSelectedProjectId(projectId || "");
    setSelectedExpenseId("");
    setSelectedContractId("");
    setSelectedMediaId("");
    setMediaUnits([]);
    setApprovalName("");
    setDescription("");
    setPriority("Medium");
    setApprovalType("Other");
    setSelectedStatusId("");
    setAllApproverApprove(false);
    setOrderedUsers([]);
    setUserSearch("");
    setUploadFile(null);
    setEditingApproval(null);
    setOfficeNoteDate("");
    setOfficeNoteText("");
    setOfficeNotePurpose("");
    setExpenseAmount("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    setSelectedExpenseCategoryId("");
    setSelectedExpenseTypeId("");
    setSelectedVendorId("");
    setIsAdvance(false);
    setSelectedBudgetId("");
    setExpenseName("");
    setExpenseDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ===== Handle Edit =====
  const handleEdit = (approval: ApprovalListVM) => {
    setEditingApproval(approval);
    setApprovalName(approval.name || "");
    setDescription(approval.description || "");
    setPriority((approval.priority as Priority) || "Medium");
    setApprovalType(approval.approvalType || "Other");
    setAllApproverApprove(approval.allApproverApprove || false);
    setSelectedStatusId(approval.approvalStatusId || "");

    // Set category states (read-only in UI during edit)
    if (approval.category === "Contract") {
      setApprovalFor("Contract");
      setSelectedContractId(approval.categoryId || "");
      setSelectedMediaId(approval.mediaId || "");
    } else if (approval.category === "Expense") {
      setApprovalFor("Expense");
      setSelectedExpenseId(approval.categoryId || "");
    } else {
      setApprovalFor("Project");
      setSelectedProjectId(approval.categoryId || "");
    }

    setIsAdding(true);
  };

  // ===== Submit =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalName.trim()) {
      toast.error("Approval name is required");
      return;
    }


    setIsSubmitting(true);
    try {
      let finalApprovalId = editingApproval?.approvalID || "";

      if (editingApproval) {
        // UPDATE
        const updateRes = await ApprovalService.putApiVApproval("1", {
          approvalID: editingApproval.approvalID,
          name: approvalName,
          description,
          priority,
          allApproverApprove,
          approvalType: approvalType,
          approvalStatusId: selectedStatusId,
        });

        if (!updateRes.success) {
          toast.error(updateRes.message || "Failed to update approval");
          setIsSubmitting(false);
          return;
        }
      } else {
        // CREATE
        const basePayload: any = {
          name: approvalName,
          description,
          priority,
          allApproverApprove,
          category: approvalFor,
          categoryId: (approvalFor === "Project" ? selectedProjectId : (approvalFor === "Contract" ? selectedContractId : selectedExpenseId)) || undefined,
          mediaId: approvalFor === "Contract" ? selectedMediaId || undefined : undefined,
          approvalType: approvalType,
          approvalStatusId: "ApprvlStatus_2025_03_08950e9c8e-a353-4b03-928a-330221292e24",
          departmentId: loggedInDepartmentId || undefined,
        };

        // If OfficeNote type, embed the officeNote object
        if (approvalType === "OfficeNote") {
          basePayload.officeNote = {
            dateOfEvent: officeNoteDate || null,
            officeNoteText: officeNoteText || null,
            purpose: officeNotePurpose || null,
          };
        }

        // If Expense type, embed the expense object
        if (approvalType === "Expense") {
          basePayload.expense = {
            expenseAmount: parseFloat(expenseAmount) || 0,
            dateOfExpense: expenseDate || null,
            expenseId: selectedExpenseCategoryId || null,
            expenseTypeId: selectedExpenseTypeId || null,
            vendorId: selectedVendorId || null,
            name: expenseName || null,
            description: expenseDescription || null,
            isAdvance: isAdvance,
            budgetId: selectedBudgetId || null,
          };
        }

        const createRes = await ApprovalService.postApiVApproval("1", basePayload);

        if (!createRes.success || !createRes.data?.approvalID) {
          toast.error(createRes.message || "Failed to create approval");
          setIsSubmitting(false);
          return;
        }
        finalApprovalId = createRes.data.approvalID;
      }

      // 2. Create Approvers (in parallel) - ONLY FOR NEW APPROVALS in this implementation
      // (Updating approvers is typically more complex and might need its own flow)
      if (!editingApproval && orderedUsers.length > 0) {
        await Promise.all(
          orderedUsers.map(u =>
            ApprovalApproverService.postApiVApprovalApprover("1", {
              approvalID: finalApprovalId,
              approvalApproverEmail: u.email,
              approvalOrder: u.order,
              isMasterApprover: false,
            })
          )
        );
      }

      // 3. Upload Document if any
      if (uploadFile) {
        await uploadDocument(finalApprovalId, uploadFile);
      }

      // 3.5 Handle FinanceExpense specific logic: Update ExpenseTransaction
      if (approvalType === "FinanceExpense" && targetExpenseTransactionId) {
        try {
          const expRes = await ExpenseTransactionService.getExpenseTransactionById(targetExpenseTransactionId, "1");
          if (expRes.success && expRes.data) {
            await ExpenseTransactionService.putApiVExpenseTransaction("1", {
              ...expRes.data,
              isFinanceApprovalRequested: true,
              financeApprovalId: finalApprovalId
            } as any);
          }
        } catch (err) {
          console.error("Failed to link finance approval to expense transaction:", err);
        }
      }

      // 4. Refresh list
      const listRes = await ApprovalService.getApiVApproval("1", projectId ? "Project" : undefined, projectId || undefined);
      if (listRes.success && listRes.data) setApprovals(listRes.data);

      if (activeTab === "finance") {
        const expListRes = await ExpenseTransactionService.getExpenseTransactionListForApproval("1");
        if (expListRes.success && expListRes.data) setExpenseApprovals(expListRes.data);
      }

      toast.success(editingApproval ? "Approval updated successfully!" : "Approval request created successfully!");
      setIsAdding(false);
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenFinanceDialog = (budgetApprovalId: string, expenseTransactionId: string) => {
    setTargetBudgetApprovalId(budgetApprovalId);
    setTargetExpenseTransactionId(expenseTransactionId);
    setApprovalFor("Expense");
    setSelectedExpenseId(expenseTransactionId);
    setApprovalType("FinanceExpense");

    // Auto-fill from budget approval if needed, but for now just open the dialog
    setIsAdding(true);
  };

  const handleClearPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentTransaction) return;

    setIsSubmitting(true);
    try {
      const expRes = await ExpenseTransactionService.getExpenseTransactionById(selectedPaymentTransaction.expenseTransactionID!, "1");
      if (expRes.success && expRes.data) {
        await ExpenseTransactionService.putApiVExpenseTransaction("1", {
          ...expRes.data,
          isCleared: true,
          dateOfPayment: paymentDate,
        } as any);

        toast.success("Payment details updated and transaction cleared!");
        setIsPaymentDialogOpen(false);
        // Refresh list
        const expListRes = await ExpenseTransactionService.getExpenseTransactionListForApproval("1");
        if (expListRes.success && expListRes.data) setExpenseApprovals(expListRes.data);
      }
    } catch (err) {
      console.error("Payment update error:", err);
      toast.error("Failed to update payment details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== Delete =====
  const handleDelete = async (id: string) => {
    try {
      const res = await ApprovalService.deleteApproval(id, "1");
      if ((res as any).success !== false) {
        setApprovals(prev => prev.filter(a => a.approvalID !== id));
        toast.success("Approval deleted.");
      }
    } catch (err) {
      toast.error("Failed to delete approval.");
    }
  };

  const filteredApprovals = approvals.filter(a => {
    const matchesSearch = a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.approvalID?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (!showAll) {
      // Logic from Index.cshtml: 
      // FinanceApprovalStatusName != "Approved" && FinanceApprovalStatusName != "Rejected" && ApprovalStatusName != "Rejected"
      const isFinanceApproved = a.financeApprovalStatusName === "Approved";
      const isFinanceRejected = a.financeApprovalStatusName === "Rejected";
      const isRejected = a.approvalStatusName === "Rejected";
      const isApproved = a.approvalStatusName === "Approved";

      // If not showAll, we typically want "Pending" ones.
      // The C# code specifically excluded Approved/Rejected from Finance and Rejected from Budget.
      // Note: Approved from Budget might still need Finance approval, so it's kept unless finance approved.
      return !isFinanceApproved && !isFinanceRejected && !isRejected;
    }

    return true;
  });

  const filteredFinanceApprovals = expenseApprovals.filter(item => {
    const matchesSearch = !searchQuery ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.expenseTransactionID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (!showAll) {
      return item.financeApprovalStatusName !== "Approved" &&
        item.financeApprovalStatusName !== "Rejected" &&
        item.approvalStatusName !== "Rejected";
    }

    return true;
  });

  const activeFilterName = listFilterCategory === "Project"
    ? projects.find(p => p.projectId === listFilterId)?.name
    : expenses.find(e => e.expenseID === listFilterId)?.name;

  // ===== RENDER =====
  return (
    <div className="max-w-7xl mx-auto space-y-6 px-1 py-2 animate-in fade-in duration-700">

      {/* TABS */}
      <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-2xl w-fit border border-border/50">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "general" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
        >
          General Approvals
        </button>
        <button
          onClick={() => setActiveTab("finance")}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "finance" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Finance Approvals
        </button>
      </div>

      {activeTab === "general" ? (
        <>
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-black uppercase">
                  Approvals
                </h1>
                {activeFilterName && (
                  <div className="flex items-center gap-2 text-muted-foreground/60">
                    <span className="text-xl font-light">/</span>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-2 py-0 h-6 text-[10px] font-black uppercase">
                      {activeFilterName}
                    </Badge>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-xs">Authorize and track request workflows.</p>
            </div>

            {/* --- Filter Actions --- */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter approvals..."
                  className="pl-10 bg-muted/20 border-border/30 rounded-2xl h-11 text-sm focus:ring-primary/30 transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Project Filter Dropdown */}
              <div className="w-full sm:w-56">
                <Select
                  value={listFilterId}
                  onValueChange={(v) => {
                    setListFilterId(v);
                    setListFilterCategory("Project");
                  }}
                >
                  <SelectTrigger className="bg-muted/20 border-border/30 rounded-2xl h-11 text-sm font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Projects" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.projectId || ""} value={p.projectId || ""}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className={`flex-1 sm:flex-none gap-2 rounded-2xl h-11 px-4 text-sm font-bold transition-all border-border/50 ${showAll ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted/20 hover:bg-muted/30"}`}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      SHOWING ALL
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      SHOWING ACTIVE
                    </>
                  )}
                </Button>

                {/* <div className="flex items-center bg-muted/40 border border-border/50 rounded-2xl p-1 gap-2">
            <Select value={listFilterCategory} onValueChange={(v) => { setListFilterCategory(v as any); setListFilterId(""); }}>
              <SelectTrigger className="h-8 border-0 bg-transparent text-[10px] font-black uppercase tracking-widest min-w-[100px] focus:ring-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-4 w-[1px] bg-border/40" />

            <Select value={listFilterId} onValueChange={setListFilterId}>
              <SelectTrigger className="h-8 border-0 bg-transparent text-[10px] font-black uppercase tracking-widest min-w-[140px] focus:ring-0">
                <SelectValue placeholder={listFilterCategory === "Project" ? "Select Project" : "Select Expense"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                {listFilterCategory === "Project" ? (
                  projects.map(p => <SelectItem key={p.projectId!} value={p.projectId!}>{p.name}</SelectItem>)
                ) : (
                  expenses.map(e => <SelectItem key={e.expenseID!} value={e.expenseID!}>{e.name}</SelectItem>)
                )}
              </SelectContent>
            </Select>
          </div> */}

                <div className="flex items-center bg-muted/40 border border-border/50 rounded-2xl p-0.5 gap-0.5">
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-card shadow-sm scale-105" : "text-muted-foreground"}`}>
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-card shadow-sm scale-105" : "text-muted-foreground"}`}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total", value: approvals.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Pending", value: approvals.filter(a => a.approvalStatusName?.toLowerCase() === "pending").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Approved", value: approvals.filter(a => a.approvalStatusName?.toLowerCase() === "approved").length, icon: BadgeCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Rejected", value: approvals.filter(a => a.approvalStatusName?.toLowerCase() === "rejected").length, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
            ].map((s) => (
              <div key={s.label} className="group flex items-center gap-4 bg-card/40 border border-border/50 rounded-3xl p-5 backdrop-blur-md shadow-sm transition-all hover:bg-card/60">
                <div className={`p-3 rounded-2xl ${s.bg} ${s.color} transition-transform group-hover:scale-110`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{s.label}</p>
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CONTENT */}
          {loadingApprovals ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredApprovals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">No approvals yet</p>
              <p className="text-xs text-muted-foreground/60">Create your first approval request above.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredApprovals.map((approval) => {
                const statusIcon = getStatusIcon(approval.approvalStatusName || "");

                return (
                  <div
                    key={approval.approvalID}
                    className="group relative flex flex-col bg-card/40 border border-white/5 rounded-[2rem] p-5 hover:bg-card/60 transition-all duration-500 backdrop-blur-3xl shadow-xl overflow-hidden ring-1 ring-white/5 cursor-pointer"
                    onClick={() => navigate(`/approvals/${approval.approvalID}${projectId ? `?projectId=${projectId}` : ""}`)}
                  >
                    {/* Priority Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-80 ${approval.priority === "High" ? "bg-primary" :
                      approval.priority === "Medium" ? "bg-primary" :
                        approval.priority === "Low" ? "bg-primary" : "bg-primary/20"
                      }`} />

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${approval.priority === "High" ? "bg-rose-500" :
                          approval.priority === "Medium" ? "bg-amber-500" :
                            approval.priority === "Low" ? "bg-blue-500" : "bg-muted-foreground"
                          }`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                          {approval.priority || "Normal"} Priority
                        </span>
                      </div>
                      <div className={`flex items-center gap-1.5 py-1 px-3 rounded-full border shadow-inner backdrop-blur-md ${approval.approvalStatusName === "Approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                        approval.approvalStatusName === "Rejected" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                          "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        }`}>
                        {statusIcon}
                        <span className="text-[9px] font-black uppercase tracking-tight">{approval.approvalStatusName || "Pending"}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h3 className="text-lg font-black text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                        {approval.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground/70 leading-relaxed line-clamp-2 font-medium">
                        {approval.description || "No description provided for this approval request."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-primary/60" />
                        <span className="text-[12px] font-bold text-foreground/80 uppercase tracking-tight whitespace-nowrap">
                          {approval.approvalType || approval.category || "General"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary/60" />
                        <span className="text-[12px] font-bold text-foreground/80 uppercase tracking-tight whitespace-nowrap">
                          {approval.requestedDate ? new Date(approval.requestedDate).toLocaleDateString() : "No Date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-primary/60" />
                        <span className="text-[12px] font-bold text-foreground/80  tracking-tight whitespace-nowrap">
                          By {approval.requestedBy || approval.createdBy || "System"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="secondary"
                        className="flex-1 rounded-xl h-10 bg-primary/5 hover:bg-primary/10 border border-primary/10 text-primary gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:gap-3"
                        onClick={(e) => { e.stopPropagation(); navigate(`/approvals/${approval.approvalID}${projectId ? `?projectId=${projectId}` : ""}`); }}
                      >
                        View Details
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-white/10 bg-card/95 backdrop-blur-xl p-1 shadow-2xl">
                          <DropdownMenuItem className="gap-2 rounded-xl focus:bg-primary/10" onClick={(e) => { e.stopPropagation(); navigate(`/approvals/${approval.approvalID}${projectId ? `?projectId=${projectId}` : ""}`); }}>
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-xl focus:bg-primary/10" onClick={(e) => { e.stopPropagation(); handleEdit(approval); }}>
                            <Edit2 className="h-3.5 w-3.5" /> Edit Request
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 rounded-xl text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
                            onClick={(e) => { e.stopPropagation(); approval.approvalID && handleDelete(approval.approvalID); }}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card/60 border border-border/50 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/20 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                    <th className="px-6 py-5">ID</th>
                    <th className="px-6 py-5">Approval Name</th>
                    <th className="px-6 py-5">Type</th>
                    <th className="px-6 py-5">Priority</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovals.map((approval) => (
                    <tr
                      key={approval.approvalID}
                      className="group hover:bg-muted/30 transition-all border-b border-border/10 last:border-0 font-medium cursor-pointer"
                      onClick={() => navigate(`/approvals/${approval.approvalID}${projectId ? `?projectId=${projectId}` : ""}`)}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">#{approval.approvalID?.slice(-6)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{approval.name}</p>
                        <p className="text-[10px] text-muted-foreground">by {approval.requestedBy || approval.createdBy || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-foreground/80">{approval.approvalType || approval.category || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`rounded-xl px-2 py-0 h-5 text-[9px] font-black uppercase ${getPriorityColor(approval.priority || "")}`}>
                          {approval.priority || "—"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(approval.approvalStatusName || "")}
                          <span className="text-xs font-black uppercase tracking-tight text-foreground/80">{approval.approvalStatusName || "Pending"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 rounded-xl hover:bg-muted  transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-border/50 bg-card p-1">
                            <DropdownMenuItem className="gap-2 rounded-xl focus:bg-primary/10" onClick={(e) => { e.stopPropagation(); navigate(`/approvals/${approval.approvalID}${projectId ? `?projectId=${projectId}` : ""}`); }}>
                              <Eye className="h-3.5 w-3.5" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 rounded-xl focus:bg-primary/10" onClick={(e) => { e.stopPropagation(); handleEdit(approval); }}>
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 rounded-xl text-destructive focus:bg-destructive/10"
                              onClick={(e) => { e.stopPropagation(); approval.approvalID && handleDelete(approval.approvalID); }}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </>

      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-black uppercase">
                Finance Approvals
              </h1>
              <p className="text-muted-foreground text-xs">Manage payment authorizations for approved budgets.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter finance approvals..."
                  className="pl-10 bg-muted/20 border-border/30 rounded-2xl h-11 text-sm focus:ring-primary/30 transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loadingExpenses ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
              <p className="text-sm font-medium text-muted-foreground">Loading expense transactions...</p>
            </div>
          ) : (
            <div className="bg-card/40 border border-border/50 rounded-[2rem] overflow-hidden shadow-xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/10 bg-muted/30">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manage</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expense Details</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Budget Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Finance Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {filteredFinanceApprovals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest">
                          No finance approvals found.
                        </td>
                      </tr>
                    ) : (
                      filteredFinanceApprovals.map((item) => (
                        <tr key={item.expenseTransactionID} className="group hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/approvals/${item.approvalId}`)}
                                className="h-7 px-3 text-[9px] font-black uppercase rounded-lg border-primary/20 hover:bg-primary/10"
                              >
                                Budget Details
                              </Button>
                              {item.isFinanceApprovalRequested && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/approvals/${item.financeApprovalId}`)}
                                  className="h-7 px-3 text-[9px] font-black uppercase rounded-lg border-info/20 hover:bg-info/10 text-info"
                                >
                                  Payment Details
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-black text-foreground uppercase">{item.name || "Unnamed Transaction"}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-1.5 py-0 h-4 text-[8px] font-black">
                                {item.category}
                              </Badge>
                              <span className="text-[9px] text-muted-foreground font-bold">{item.requestedDate ? new Date(item.requestedDate).toLocaleDateString() : ""}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-black text-foreground">${item.expenseAmount?.toLocaleString()}</p>
                            {item.expenseAmountApproved && (
                              <p className="text-[9px] text-emerald-500 font-bold">Approved: ${item.expenseAmountApproved.toLocaleString()}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(item.approvalStatusName || "Pending")}
                              <span className={`text-[10px] font-black uppercase ${getStatusColor(item.approvalStatusName)} bg-transparent border-0 p-0`}>
                                {item.approvalStatusName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.isFinanceApprovalRequested ? (
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5">
                                  {getStatusIcon(item.financeApprovalStatusName || "Pending")}
                                  <span className={`text-[10px] font-black uppercase ${getStatusColor(item.financeApprovalStatusName)} bg-transparent border-0 p-0`}>
                                    {item.financeApprovalStatusName}
                                  </span>
                                </div>
                                {item.financeApprovalStatusName === "Approved" && !item.isCleared && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedPaymentTransaction(item);
                                      setIsPaymentDialogOpen(true);
                                    }}
                                    className="h-7 px-3 text-[9px] font-black uppercase rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                  >
                                    Update Payment
                                  </Button>
                                )}
                              </div>
                            ) : (
                              item.approvalStatusName === "Approved" ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenFinanceDialog(item.approvalId!, item.expenseTransactionID!)}
                                  className="h-8 px-4 text-[9px] font-black uppercase rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                >
                                  Create Approval
                                </Button>
                              ) : (
                                <span className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">Awaiting Budget</span>
                              )
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.isCleared ? (
                              <div className="flex flex-col items-center">
                                <BadgeCheck className="h-5 w-5 text-emerald-500" />
                                <span className="text-[8px] text-muted-foreground font-bold mt-0.5">
                                  {item.dateOfPayment ? new Date(item.dateOfPayment).toLocaleDateString() : "PAID"}
                                </span>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-muted flex items-center justify-center opacity-20">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted" />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE DIALOG */}
      <Dialog open={isAdding} onOpenChange={(open) => { setIsAdding(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <Button className="gap-2 rounded-2xl h-10 px-5 text-sm font-medium bg-primary shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px]">
            <Plus className="h-4 w-4" />
            New Approval
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[95vw] sm:max-w-[580px] border-border/50 bg-card rounded-[1.5rem] sm:rounded-3xl overflow-hidden backdrop-blur-xl p-0 gap-0 max-h-[92vh] flex flex-col">
          <DialogHeader className="p-5 sm:p-6 bg-muted/50 border-b border-border/10 shrink-0">
            <DialogTitle className="text-lg sm:text-xl font-black uppercase tracking-tight">
              {editingApproval ? "Edit Approval Details" : "Create Approval Request"}
            </DialogTitle>
            <DialogDescription className="text-[11px] sm:text-xs">
              {editingApproval ? "Update the details of your approval request." : "Submit a new approval request."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">

              {/* ── Category Rows ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Approval For</label>
                  <Select value={approvalFor} onValueChange={setApprovalFor} disabled={!!editingApproval}>
                    <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-11 text-sm">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50">
                      <SelectItem value="Project">Project</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      {approvalFor === "Expense" && <SelectItem value="Expense">Expense</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {approvalFor === "Project" ? "Select Project" : approvalFor === "Contract" ? "Select Contract" : "Select Expense"}
                  </label>
                  <Select
                    value={approvalFor === "Project" ? selectedProjectId : approvalFor === "Contract" ? selectedContractId : selectedExpenseId}
                    onValueChange={v => {
                      if (approvalFor === "Project") setSelectedProjectId(v);
                      else if (approvalFor === "Contract") setSelectedContractId(v);
                      else setSelectedExpenseId(v);
                    }}
                    disabled={!!editingApproval}
                  >
                    <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-11 text-sm focus:ring-primary/30">
                      <SelectValue placeholder={loadingFormData ? "Loading..." : (approvalFor === "Project" ? "Select Project" : approvalFor === "Contract" ? "Select Contract" : "Select Expense")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 shadow-2xl overflow-hidden">
                      {approvalFor === "Project" ? (
                        projects.length > 0 ? (
                          projects.map((p, idx) => (
                            <SelectItem
                              key={p.projectId || `proj-${idx}`}
                              value={p.projectId || `unknown-${idx}`}
                            >
                              {p.name || "Unnamed Project"}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-xs text-muted-foreground">No projects found</div>
                        )
                      ) : approvalFor === "Contract" ? (
                        contracts.length > 0 ? (
                          contracts.map((c, idx) => (
                            <SelectItem
                              key={c.contractID || `contract-${idx}`}
                              value={c.contractID || `unknown-${idx}`}
                            >
                              {c.name || "Unnamed Contract"}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-xs text-muted-foreground">No contracts found</div>
                        )
                      ) : (
                        expenses.length > 0 ? (
                          expenses.map((e, idx) => (
                            <SelectItem
                              key={e.expenseID || `exp-${idx}`}
                              value={e.expenseID || `unknown-${idx}`}
                            >
                              {e.name || "Unnamed Expense"}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-xs text-muted-foreground">No expenses found</div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Media Unit (Only active for Contract) ── */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Media Unit</label>
                <Select
                  value={selectedMediaId}
                  onValueChange={setSelectedMediaId}
                  disabled={approvalFor !== "Contract" || !!editingApproval}
                >
                  <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-11 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder={
                      approvalFor !== "Contract"
                        ? "(Select Contract first )"
                        : loadingMediaUnits
                          ? "Loading media..."
                          : "Select Media"
                    } />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 shadow-2xl overflow-hidden">
                    {mediaUnits.length > 0 ? (
                      mediaUnits.map((mu, idx) => (
                        <SelectItem
                          key={mu.contractMediaUnitID || `mu-${idx}`}
                          value={mu.contractMediaUnitID || `unknown-mu-${idx}`}
                        >
                          {mu.name ? `${mu.name}${mu.description ? `: ${mu.description}` : ""}` : "Unnamed Media Unit"}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-muted-foreground">No media units found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* ── Approval Name ── */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Approval Name <span className="text-destructive">*</span></label>
                <Input
                  required
                  placeholder="e.g. Office Renovation Budget"
                  className="bg-muted/30 border-border/50 rounded-xl h-11 text-sm"
                  value={approvalName}
                  onChange={e => setApprovalName(e.target.value)}
                />
              </div>

              {/* ── Description ── */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                <textarea
                  placeholder="Brief description of the approval request..."
                  className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              {/* ── Details Grid ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</label>
                  <Select value={priority} onValueChange={v => setPriority(v as Priority)}>
                    <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-11 text-sm">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50">
                      {PRIORITY_OPTIONS.map(p => (
                        <SelectItem key={p} value={p}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p === "High" ? "bg-rose-500" : p === "Medium" ? "bg-amber-500" : "bg-blue-500"}`} />
                            {p}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Approval Type</label>
                  <Select value={approvalType} onValueChange={setApprovalType}>
                    <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-11 text-sm">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50">
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                      <SelectItem value="OfficeNote">Office Note</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="FinanceExpense">Finance Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Expense Fields (conditional) ── */}
              {approvalType === "Expense" && (
                <div className="space-y-4 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
                    <Wallet className="h-3 w-3" />
                    Expense Transaction Details
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-muted/30 border border-border/50 rounded-xl pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                          value={expenseAmount}
                          onChange={e => setExpenseAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</label>
                      <input
                        type="date"
                        className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                        value={expenseDate}
                        onChange={e => setExpenseDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expense Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Flight to New York"
                      className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      value={expenseName}
                      onChange={e => setExpenseName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expense Description</label>
                    <textarea
                      placeholder="Details about this expense..."
                      className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2 text-sm resize-none min-h-[60px] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      value={expenseDescription}
                      onChange={e => setExpenseDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expense Type</label>
                      <Select value={selectedExpenseTypeId} onValueChange={setSelectedExpenseTypeId}>
                        <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-10 text-sm">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          {expenseTypes.map(t => (
                            <SelectItem key={t.expenseTypeID!} value={t.expenseTypeID!}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Budget (Optional)</label>
                      <Select value={selectedBudgetId} onValueChange={setSelectedBudgetId}>
                        <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-10 text-sm">
                          <SelectValue placeholder="Select Budget" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          {budgets.map(b => (
                            <SelectItem key={b.budgetId!} value={b.budgetId!}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</label>
                      <Select value={selectedExpenseCategoryId} onValueChange={setSelectedExpenseCategoryId}>
                        <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-10 text-sm">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          {expenses.map(e => (
                            <SelectItem key={e.expenseID!} value={e.expenseID!}>{e.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vendor</label>
                      <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                        <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-10 text-sm">
                          <SelectValue placeholder="Select Vendor" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          {vendors.map(v => (
                            <SelectItem key={v.vendorID!} value={v.vendorID!}>{v.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isAdvance"
                      checked={isAdvance}
                      onChange={e => setIsAdvance(e.target.checked)}
                      className="w-4 h-4 rounded border-border/50 text-emerald-500 focus:ring-emerald-500/30"
                    />
                    <label htmlFor="isAdvance" className="text-xs font-bold text-foreground cursor-pointer">Mark as Advance Payment</label>
                  </div>
                </div>
              )}

              {/* ── OfficeNote Fields (conditional) ── */}
              {approvalType === "OfficeNote" && (
                <div className="space-y-4 p-4 border border-primary/20 bg-primary/5 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <FileText className="h-3 w-3" />
                    Office Note Details
                  </p>
                  {/* ... Existing OfficeNote Fields ... */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date of Event</label>
                    <input
                      type="date"
                      className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      value={officeNoteDate}
                      onChange={e => setOfficeNoteDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Office Note Text</label>
                    <textarea
                      placeholder="Enter the office note content..."
                      className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                      value={officeNoteText}
                      onChange={e => setOfficeNoteText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Purpose</label>
                    <input
                      type="text"
                      placeholder="e.g. Internal communication, compliance..."
                      className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                      value={officeNotePurpose}
                      onChange={e => setOfficeNotePurpose(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ── Status (Full or partial?) ── */}
              {/* <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Approval Status <span className="text-destructive">*</span>
                    </label>
                    <Select value={selectedStatusId} onValueChange={setSelectedStatusId} disabled={loadingFormData}>
                      <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-11 text-sm">
                        <SelectValue placeholder={loadingFormData ? "Loading statuses..." : "-- Select Status --"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/50">
                        {loadingFormData ? (
                          <div className="p-3 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" /> Loading...
                          </div>
                        ) : approvalStatuses.length === 0 ? (
                          <div className="p-3 text-xs text-muted-foreground text-center">No statuses found</div>
                        ) : (
                          approvalStatuses.map(s => (
                            <SelectItem key={s.approvalStatusID!} value={s.approvalStatusID!}>
                              {s.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div> */}

              {/* ── Select Users (from API) ── */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3 w-3" />
                  Select Users
                </label>

                {/* Selected user tags */}
                {orderedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-muted/20 border border-border/30 rounded-xl min-h-[40px]">
                    {orderedUsers.map(u => (
                      <span
                        key={u.userId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg text-xs font-medium text-primary"
                      >
                        {u.displayName || u.email}
                        <button type="button" onClick={() => removeUser(u.userId)} className="hover:text-destructive transition-colors ml-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Searchable user dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <Input
                    placeholder={loadingFormData ? "Loading users..." : "Search users by name or email..."}
                    className="bg-muted/30 border-border/50 rounded-xl h-10 text-sm"
                    value={userSearch}
                    disabled={loadingFormData}
                    onChange={e => { setUserSearch(e.target.value); setShowUserDropdown(true); }}
                    onFocus={() => setShowUserDropdown(true)}
                  />
                  {showUserDropdown && !loadingFormData && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border/50 rounded-2xl shadow-lg z-50 max-h-48 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <div className="p-3 text-xs text-muted-foreground text-center">
                          {userSearch ? "No users found" : "All users added or no users available"}
                        </div>
                      ) : (
                        filteredUsers.map(u => (
                          <button
                            key={u.userID || u.id}
                            type="button"
                            onClick={() => { addUser(u); setShowUserDropdown(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 text-left transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                          >
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                              {(u.firstName || u.email || "?")[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">
                                {[u.firstName, u.lastName].filter(Boolean).join(" ") || u.userName}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  {loadingFormData && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* ── Approval Order (sortable) ── */}
              {orderedUsers.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Approval Order of Users
                    <span className="ml-1.5 text-muted-foreground/50 normal-case font-medium">(drag to reorder)</span>
                  </label>
                  <div className="space-y-1.5">
                    {orderedUsers.map((u, idx) => (
                      <SortableUserRow
                        key={u.userId}
                        user={u}
                        index={idx}
                        total={orderedUsers.length}
                        onMoveUp={() => idx > 0 && moveUser(idx, idx - 1)}
                        onMoveDown={() => idx < orderedUsers.length - 1 && moveUser(idx, idx + 1)}
                        onRemove={() => removeUser(u.userId)}
                        dragHandleProps={{
                          draggable: true,
                          onDragStart: (e) => {
                            dragIndex.current = idx;
                            e.dataTransfer.effectAllowed = "move";
                          },
                          onDragOver: (e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                          },
                          onDrop: (e) => {
                            e.preventDefault();
                            if (dragIndex.current !== null && dragIndex.current !== idx) {
                              moveUser(dragIndex.current, idx);
                            }
                            dragIndex.current = null;
                          },
                          onDragEnd: () => { dragIndex.current = null; },
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── All Approver Approve Toggle ── */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/20">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">All Approver Approve</p>
                  <p className="text-[10px] text-muted-foreground">Require all assigned users to approve?</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllApproverApprove(v => !v)}
                  className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${allApproverApprove ? "bg-primary" : "bg-muted-foreground/30"}`}
                >
                  <div className={`absolute top-1 transition-all w-4 h-4 rounded-full bg-white shadow ${allApproverApprove ? "right-1" : "left-1"}`} />
                </button>
              </div>

              {/* ── Upload Document ── */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Upload className="h-3 w-3" />
                  Upload Document
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex items-center gap-3 p-3 bg-muted/20 border-2 border-dashed border-border/40 hover:border-primary/40 hover:bg-primary/5 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {uploadFile ? (
                      <>
                        <p className="text-xs font-bold text-foreground truncate">{uploadFile.name}</p>
                        <p className="text-[10px] text-muted-foreground">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-foreground">Click to choose file</p>
                        <p className="text-[10px] text-muted-foreground">PDF, DOC, DOCX, PNG, JPG supported</p>
                      </>
                    )}
                  </div>
                  {uploadFile && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

            </div>

            {/* ── Footer ── */}
            <DialogFooter className="p-5 sm:p-6 bg-muted/30 border-t border-border/10 shrink-0 flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setIsAdding(false); resetForm(); }}
                className="w-full sm:w-auto rounded-xl h-11 px-6 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-xl h-11 px-8 gap-2 bg-primary order-1 sm:order-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isSubmitting ? "Creating..." : "Create Approval"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PAYMENT DIALOG */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[420px] border-border/50 bg-card rounded-3xl overflow-hidden backdrop-blur-xl p-0 gap-0">
          <DialogHeader className="p-6 bg-muted/50 border-b border-border/10">
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Update Payment
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record the payment details for this authorized expense.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleClearPayment} className="p-6 space-y-5">
            <div className="space-y-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</span>
                <span className="text-sm font-black text-foreground">${selectedPaymentTransaction?.expenseAmountApproved?.toLocaleString() || selectedPaymentTransaction?.expenseAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vendor</span>
                <span className="text-xs font-bold text-foreground truncate max-w-[150px]">{selectedPaymentTransaction?.name}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Date of Payment
              </label>
              <input
                type="date"
                required
                className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <BadgeCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <p className="text-[10px] font-bold text-emerald-600 leading-tight">
                This will mark the transaction as "Cleared" and remove it from the active finance approvals list.
              </p>
            </div>

            <DialogFooter className="pt-2 flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsPaymentDialogOpen(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
