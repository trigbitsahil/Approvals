"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, PlusCircle, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Components
import { IncomeTransactionHeader } from "./IncomeTransactionHeader";
import { IncomeTransactionForm } from "./IncomeTransactionForm";
import { IncomeTransactionList } from "./IncomeTransactionList";
import { IncomeTransactionSummary } from "./IncomeTransactionSummary";
import { IncomeTransactionDetail } from "./IncomeTransactionDetail";

// Services
import { IncomeTransactionService } from "@/api/services/IncomeTransactionService";
import { IncomeService } from "@/api/services/IncomeService";
import { IncomeTypeService } from "@/api/services/IncomeTypeService";
import { BudgetService } from "@/api/services/BudgetService";
import { IncomeCategoryService } from "@/api/services/IncomeCategoryService";
import { CustomerService } from "@/api/services/CustomerService";
import { ApprovalService } from "@/api/services/ApprovalService";

// Models
import type { IncomeTransactionListVM } from "@/api/models/IncomeTransactionListVM";
import type { IncomeListVM } from "@/api/models/IncomeListVM";
import type { IncomeTypeListVM } from "@/api/models/IncomeTypeListVM";
import type { BudgetListVM } from "@/api/models/BudgetListVM";
import type { IncomeCategoryListVM } from "@/api/models/IncomeCategoryListVM";
import type { CustomerListVM } from "@/api/models/CustomerListVM";
import type { ApprovalListVM } from "@/api/models/ApprovalListVM";

export default function IncomeTransactionPage() {
  // --- Data States ---
  const [transactions, setTransactions] = useState<IncomeTransactionListVM[]>([]);
  const [incomes, setIncomes] = useState<IncomeListVM[]>([]);
  const [incomeTypes, setIncomeTypes] = useState<IncomeTypeListVM[]>([]);
  const [budgets, setBudgets] = useState<BudgetListVM[]>([]);
  const [categories, setCategories] = useState<IncomeCategoryListVM[]>([]);
  const [customers, setCustomers] = useState<CustomerListVM[]>([]);
  const [approvals, setApprovals] = useState<ApprovalListVM[]>([]);

  // --- UI States ---
  const [loading, setLoading] = useState(true);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<IncomeTransactionListVM | null>(null);
  const [viewingTransactionId, setViewingTransactionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Project Context ---
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  // --- Form State ---
  const [formData, setFormData] = useState({
    incomeTypeId: "",
    incomeId: "",
    budgetId: "",
    customerId: "",
    categoryID: "",
    name: "",
    description: "",
    dateOfIncome: new Date().toISOString().split("T")[0],
    incomeAmount: 0,
    isAdvance: false,
    isCleared: false,
    approvalId: "",
  });

  // --- Load Transactions ---
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await IncomeTransactionService.getApiVIncomeTransaction2(
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
        const [expRes, typeRes, budRes, catRes, custRes, appRes] = await Promise.all([
          IncomeService.getApiVIncome("1").catch(() => ({ success: false, data: [] })),
          IncomeTypeService.getApiVIncomeType("1").catch(() => ({ success: false, data: [] })),
          BudgetService.getApiVBudget("1", "Project", projectId || "").catch(() => ({
            success: false,
            data: [],
          })),
          IncomeCategoryService.getApiVIncomeCategory("1").catch(() => ({
            success: false,
            data: [],
          })),
          CustomerService.getApiVCustomer("1").catch(() => ({ success: false, data: [] })),
          ApprovalService.getApiVApproval("1", "Project", projectId || "").catch(() => ({
            success: false,
            data: [],
          })),
        ]);

        if (expRes.success && expRes.data) setIncomes(expRes.data);
        if (typeRes.success && typeRes.data) setIncomeTypes(typeRes.data);
        if (budRes.success && budRes.data) setBudgets(budRes.data);
        if (catRes.success && catRes.data) setCategories(catRes.data);
        if (custRes.success && custRes.data) setCustomers(custRes.data);
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

  const handleEdit = (t: IncomeTransactionListVM) => {
    setEditingTransaction(t);
    setFormData({
      incomeTypeId: t.incomeTypeId || "",
      incomeId: t.incomeId || "",
      budgetId: t.budgetId || "none",
      customerId: (t.customerId || (t as any).customerID || "").toString() || "none",
      categoryID: t.categoryID || "",
      name: t.name || "",
      description: t.description || "",
      dateOfIncome: t.dateOfIncome ? new Date(t.dateOfIncome).toISOString().split("T")[0] : "",
      incomeAmount: t.incomeAmount || 0,
      isAdvance: !!t.isAdvance,
      isCleared: !!t.isCleared,
      approvalId: t.approvalId || "none",
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.incomeAmount) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        incomeAmount: Number(formData.incomeAmount),
        category: "Project",
        categoryID: projectId,
        IsApproved: true,
        IncomeAmountApproved: Number(formData.incomeAmount),
      };

      if (!submissionData.budgetId || submissionData.budgetId === "none") delete (submissionData as any).budgetId;
      if (!submissionData.customerId || submissionData.customerId === "none") delete (submissionData as any).customerId;
      if (!submissionData.approvalId || submissionData.approvalId === "none") delete (submissionData as any).approvalId;

      let res;
      if (editingTransaction) {
        res = await IncomeTransactionService.putApiVIncomeTransaction("1", {
          ...submissionData,
          incomeTransactionID: editingTransaction.incomeTransactionID,
          IsApproved: true,
          IncomeAmountApproved: Number(formData.incomeAmount),
        } as any);
      } else {
        res = await IncomeTransactionService.postApiVIncomeTransaction(
          "1",
          submissionData as any
        );
      }

      if (res.success) {
        toast.success(editingTransaction ? "Transaction updated!" : "Transaction recorded!");
        setIsAdding(false);
        setEditingTransaction(null);
        setFormData({
          incomeTypeId: "",
          incomeId: "",
          budgetId: "",
          customerId: "",
          categoryID: "",
          name: "",
          description: "",
          dateOfIncome: new Date().toISOString().split("T")[0],
          incomeAmount: 0,
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
      const res = await IncomeTransactionService.deleteIncomeTransaction(id, "1");
      if ((res as any).success !== false) {
        toast.success("Transaction deleted");
        setTransactions((prev) => prev.filter((t) => t.incomeTransactionID !== id));
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
      t.incomeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (viewingTransactionId) {
    return (
      <div className="max-w-7xl mx-auto px-1 py-2">
        <IncomeTransactionDetail
          transactionId={viewingTransactionId}
          onBack={() => setViewingTransactionId(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-1 py-2 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <IncomeTransactionHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddTransaction={() => setIsAdding(true)}
      />

      {/* MODAL / FORM SECTION */}
      <IncomeTransactionForm
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
          incomeTypes,
          incomes,
          budgets,
          customers,
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
            Your income history will appear here.
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
          <IncomeTransactionList
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
        <IncomeTransactionSummary transactions={transactions} />
      )}
    </div>
  );
}
