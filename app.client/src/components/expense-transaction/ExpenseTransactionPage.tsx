"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, PlusCircle, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Components
import { ExpenseTransactionHeader } from "./ExpenseTransactionHeader";
import { ExpenseTransactionForm } from "./ExpenseTransactionForm";
import { ExpenseTransactionList } from "./ExpenseTransactionList";
import { ExpenseTransactionSummary } from "./ExpenseTransactionSummary";
import { ExpenseTransactionDetail } from "./ExpenseTransactionDetail";

// Services
import { ExpenseTransactionService } from "@/api/services/ExpenseTransactionService";
import { ExpenseService } from "@/api/services/ExpenseService";
import { ExpenseTypeService } from "@/api/services/ExpenseTypeService";
import { BudgetService } from "@/api/services/BudgetService";
import { ExpenseCategoryService } from "@/api/services/ExpenseCategoryService";
import { VendorService } from "@/api/services/VendorService";
import { ApprovalService } from "@/api/services/ApprovalService";

// Models
import type { ExpenseTransactionListVM } from "@/api/models/ExpenseTransactionListVM";
import type { ExpenseListVM } from "@/api/models/ExpenseListVM";
import type { ExpenseTypeListVM } from "@/api/models/ExpenseTypeListVM";
import type { BudgetListVM } from "@/api/models/BudgetListVM";
import type { ExpenseCategoryListVM } from "@/api/models/ExpenseCategoryListVM";
import type { VendorListVM } from "@/api/models/VendorListVM";
import type { ApprovalListVM } from "@/api/models/ApprovalListVM";

export default function ExpenseTransactionPage() {
  // --- Data States ---
  const [transactions, setTransactions] = useState<ExpenseTransactionListVM[]>([]);
  const [expenses, setExpenses] = useState<ExpenseListVM[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseTypeListVM[]>([]);
  const [budgets, setBudgets] = useState<BudgetListVM[]>([]);
  const [categories, setCategories] = useState<ExpenseCategoryListVM[]>([]);
  const [vendors, setVendors] = useState<VendorListVM[]>([]);
  const [approvals, setApprovals] = useState<ApprovalListVM[]>([]);

  // --- UI States ---
  const [loading, setLoading] = useState(true);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ExpenseTransactionListVM | null>(null);
  const [viewingTransactionId, setViewingTransactionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Project Context ---
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  // --- Form State ---
  const [formData, setFormData] = useState({
    expenseTypeId: "",
    expenseId: "",
    budgetId: "",
    vendorId: "",
    categoryID: "",
    name: "",
    description: "",
    dateOfExpense: new Date().toISOString().split("T")[0],
    expenseAmount: 0,
    isAdvance: false,
    isCleared: false,
    approvalId: "",
  });

  // --- Load Transactions ---
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await ExpenseTransactionService.getApiVExpenseTransaction2(
        "1",
        projectId ? "Project" : undefined,
        projectId || undefined
      );
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [projectId]);

  // --- Load Form Dependencies ---
  useEffect(() => {
    if (!isAdding) return;

    const loadData = async () => {
      setLoadingFormData(true);
      try {
        const [expRes, typeRes, budRes, catRes, venRes, appRes] = await Promise.all([
          ExpenseService.getApiVExpense("1").catch(() => ({ success: false, data: [] })),
          ExpenseTypeService.getApiVExpenseType("1").catch(() => ({ success: false, data: [] })),
          BudgetService.getApiVBudget("1", "Project", projectId || "").catch(() => ({
            success: false,
            data: [],
          })),
          ExpenseCategoryService.getApiVExpenseCategory("1").catch(() => ({
            success: false,
            data: [],
          })),
          VendorService.getApiVVendor("1").catch(() => ({ success: false, data: [] })),
          ApprovalService.getApiVApproval("1", "Project", projectId || "").catch(() => ({
            success: false,
            data: [],
          })),
        ]);

        if (expRes.success && expRes.data) setExpenses(expRes.data);
        if (typeRes.success && typeRes.data) setExpenseTypes(typeRes.data);
        if (budRes.success && budRes.data) setBudgets(budRes.data);
        if (catRes.success && catRes.data) setCategories(catRes.data);
        const venData = (venRes as any).data || (Array.isArray(venRes) ? venRes : []);
        setVendors(venData);
        if (appRes.success && appRes.data) setApprovals(appRes.data);
      } catch (err) {
        console.error("Failed to fetch form data:", err);
        toast.error("Failed to load dropdown options");
      } finally {
        setLoadingFormData(false);
      }
    };

    loadData();
  }, [isAdding, projectId]);

  // --- Handlers ---
  const handleInputChange = (field: string, value: any) => {
    const finalValue = value === "none" ? "" : value;
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleEdit = (t: ExpenseTransactionListVM) => {
    setEditingTransaction(t);
    setFormData({
      expenseTypeId: t.expenseTypeId || "",
      expenseId: t.expenseId || "",
      budgetId: t.budgetId || "none",
      vendorId: (t.vendorId || (t as any).vendorID || "").toString() || "none",
      categoryID: t.categoryID || "",
      name: t.name || "",
      description: t.description || "",
      dateOfExpense: t.dateOfExpense ? new Date(t.dateOfExpense).toISOString().split("T")[0] : "",
      expenseAmount: t.expenseAmount || 0,
      isAdvance: !!t.isAdvance,
      isCleared: !!t.isCleared,
      approvalId: t.approvalId || "none",
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.expenseAmount) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        expenseAmount: Number(formData.expenseAmount),
        category: "Project",
        categoryID: projectId,
        IsApproved: true,
        ExpenseAmountApproved: Number(formData.expenseAmount),
      };

      if (!submissionData.budgetId || submissionData.budgetId === "none") delete (submissionData as any).budgetId;
      if (!submissionData.vendorId || submissionData.vendorId === "none") delete (submissionData as any).vendorId;
      if (!submissionData.approvalId || submissionData.approvalId === "none") delete (submissionData as any).approvalId;

      let res;
      if (editingTransaction) {
        res = await ExpenseTransactionService.putApiVExpenseTransaction("1", {
          ...submissionData,
          expenseTransactionID: editingTransaction.expenseTransactionID,
          IsApproved: true,
          ExpenseAmountApproved: Number(formData.expenseAmount),
        } as any);
      } else {
        res = await ExpenseTransactionService.postApiVExpenseTransaction(
          "1",
          submissionData as any
        );
      }

      if (res.success) {
        toast.success(editingTransaction ? "Transaction updated!" : "Transaction recorded!");
        setIsAdding(false);
        setEditingTransaction(null);
        setFormData({
          expenseTypeId: "",
          expenseId: "",
          budgetId: "",
          vendorId: "",
          categoryID: "",
          name: "",
          description: "",
          dateOfExpense: new Date().toISOString().split("T")[0],
          expenseAmount: 0,
          isAdvance: false,
          isCleared: false,
          approvalId: "",
        });
        loadTransactions();
      } else {
        toast.error(res.message || "Failed to record transaction");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | null | undefined) => {
    if (!id) return;
    try {
      const res = await ExpenseTransactionService.deleteExpenseTransaction(id, "1");
      if ((res as any).success !== false) {
        toast.success("Transaction deleted");
        setTransactions((prev) => prev.filter((t) => t.expenseTransactionID !== id));
      } else {
        toast.error("Failed to delete record");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong");
    }
  };

  // --- Filtering ---
  const filteredTransactions = transactions.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.expenseName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (viewingTransactionId) {
    return (
      <div className="max-w-7xl mx-auto px-1 py-2">
        <ExpenseTransactionDetail
          transactionId={viewingTransactionId}
          onBack={() => setViewingTransactionId(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-1 py-2 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <ExpenseTransactionHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddTransaction={() => setIsAdding(true)}
      />

      {/* MODAL / FORM SECTION */}
      <ExpenseTransactionForm
        open={isAdding}
        onOpenChange={(open) => {
          setIsAdding(open);
          if (!open) setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        loadingFormData={loadingFormData}
        formData={formData}
        isEdit={!!editingTransaction}
        onInputChange={handleInputChange}
        dependencies={{
          expenseTypes,
          expenses,
          budgets,
          vendors,
          categories,
          approvals,
        }}
      />

      {/* MAIN CONTENT SECTION */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Decoding Transaction Logs
          </p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-border/30 rounded-[3rem] bg-card/5 backdrop-blur-sm animate-in zoom-in duration-700">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center mb-6 shadow-2xl">
            <Layers className="h-12 w-12 text-muted-foreground/20" />
          </div>
          <p className="text-xl font-black text-foreground/40 tracking-tighter uppercase">
            No Ledger Entries
          </p>
          <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase opacity-40 mb-8 mt-2">
            Your expense history will appear here.
          </p>
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="rounded-[1.25rem] border-primary/30 hover:bg-primary/10 text-primary h-12 px-8 font-black uppercase text-[10px] tracking-widest transition-all"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Initial Record
          </Button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ExpenseTransactionList
            items={filteredTransactions}
            viewMode={viewMode}
            onDelete={handleDelete}
            onEditTransaction={handleEdit}
            onViewDetails={(id) => setViewingTransactionId(id)}
          />
        </div>
      )}

      {/* FOOTER STATS SLICE */}
      {!loading && transactions.length > 0 && (
        <ExpenseTransactionSummary transactions={transactions} />
      )}
    </div>
  );
}
