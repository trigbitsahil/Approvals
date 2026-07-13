"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Briefcase, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Components
import { BudgetHeader } from "./BudgetHeader";
import { BudgetForm } from "./BudgetForm";
import { BudgetList } from "./BudgetList";
import { BudgetSummary } from "./BudgetSummary";
import { BudgetDetailDashboard } from "./BudgetDetailDashboard";

// Services
import { BudgetService } from "@/api/services/BudgetService";
import { ExpenseCategoryService } from "@/api/services/ExpenseCategoryService";

// Models
import type { BudgetListVM } from "@/api/models/BudgetListVM";
import type { ExpenseCategoryListVM } from "@/api/models/ExpenseCategoryListVM";

export default function BudgetPage() {
  // --- Data States ---
  const [budgets, setBudgets] = useState<BudgetListVM[]>([]);
  const [categories, setCategories] = useState<ExpenseCategoryListVM[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<BudgetListVM | null>(null);

  // --- UI States ---
  const [loading, setLoading] = useState(true);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetListVM | null>(null);

  // --- Project Context ---
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: 0,
    expenseCategoryId: "",
    expenseTransactionTotalApproved: 0,
    expenseTransactionTotalApprovedNotPaid: 0,
    expenseTransactionTotalPaid: 0,
  });

  // --- Load Budgets ---
  const loadBudgets = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await BudgetService.getApiVBudget("1", "Project", projectId);
      if (res.success && res.data) {
        setBudgets(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [projectId]);

  // Handle selected budget being out of sync if budgets list updates
  useEffect(() => {
    if (selectedBudget) {
      const current = budgets.find(b => b.budgetId === selectedBudget.budgetId);
      if (current) setSelectedBudget(current);
    }
  }, [budgets]);

  // --- Load Form Dependencies ---
  useEffect(() => {
    if (!isModalOpen) return;

    const loadData = async () => {
      setLoadingFormData(true);
      try {
        const catRes = await ExpenseCategoryService.getApiVExpenseCategory("1");
        if (catRes.success && catRes.data) setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingFormData(false);
      }
    };

    loadData();
  }, [isModalOpen]);

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        name: editingBudget.name || "",
        description: editingBudget.description || "",
        amount: editingBudget.amount || 0,
        expenseCategoryId: editingBudget.expenseCategoryId || "",
        expenseTransactionTotalApproved: editingBudget.expenseTransactionTotalApproved || 0,
        expenseTransactionTotalApprovedNotPaid: editingBudget.expenseTransactionTotalApprovedNotPaid || 0,
        expenseTransactionTotalPaid: editingBudget.expenseTransactionTotalPaid || 0,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        amount: 0,
        expenseCategoryId: "",
        expenseTransactionTotalApproved: 0,
        expenseTransactionTotalApprovedNotPaid: 0,
        expenseTransactionTotalPaid: 0,
      });
    }
  }, [editingBudget, isModalOpen]);

  // --- Handlers ---
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.expenseCategoryId || !projectId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBudget) {
        const res = await BudgetService.putApiVBudget("1", {
          budgetId: editingBudget.budgetId,
          ...formData,
          category: "Project",
          categoryID: projectId,
        });
        if (res.success) {
          toast.success("Budget updated successfully!");
          setIsModalOpen(false);
          loadBudgets();
        } else {
          toast.error(res.message || "Failed to update budget");
        }
      } else {
        const res = await BudgetService.postApiVBudget("1", {
          ...formData,
          category: "Project",
          categoryId: projectId,
        });
        if (res.success) {
          toast.success("Budget created successfully!");
          setIsModalOpen(false);
          loadBudgets();
        } else {
          toast.error(res.message || "Failed to create budget");
        }
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
      const res = await BudgetService.deleteBudget(id, "1");
      if ((res as any).success !== false) {
        toast.success("Budget purged from ledger");
        setBudgets((prev) => prev.filter((b) => b.budgetId !== id));
        if (selectedBudget?.budgetId === id) setSelectedBudget(null);
      } else {
        toast.error("Unauthorized to delete record");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete record");
    }
  };

  // --- Filtering ---
  const filteredBudgets = budgets.filter(
    (b) =>
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-1 py-2 animate-in fade-in duration-700">
      {selectedBudget ? (
        <BudgetDetailDashboard 
          budget={selectedBudget} 
          projectId={projectId || ""}
          onBack={() => setSelectedBudget(null)} 
        />
      ) : (
        <>
          {/* HEADER SECTION */}
          <BudgetHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onDefineBudget={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
          />

          {/* MODAL / FORM SECTION */}
          <BudgetForm
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) setEditingBudget(null);
            }}
            editingBudget={editingBudget}
            categories={categories}
            loadingCategories={loadingFormData}
            isSubmitting={isSubmitting}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />

          {/* MAIN CONTENT SECTION */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Loading...
              </p>
            </div>
          ) : filteredBudgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-border/30 rounded-[3rem] bg-card/5 backdrop-blur-sm animate-in zoom-in duration-700">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center mb-6 shadow-2xl">
                <Briefcase className="h-12 w-12 text-muted-foreground/20" />
              </div>
              <p className="text-xl font-black text-foreground/40 tracking-tighter uppercase">
                No Active Budgets
              </p>
              <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase opacity-40 mb-8 mt-2">
                Initialize capital for this project to start tracking.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="rounded-[1.25rem] border-primary/30 hover:bg-primary/10 text-primary h-12 px-8 font-black uppercase text-[10px] tracking-widest transition-all"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Initial Allocation
              </Button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <BudgetList
                items={filteredBudgets}
                viewMode={viewMode}
                onEdit={(b) => {
                  setEditingBudget(b);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
                onSelect={(b) => setSelectedBudget(b)}
              />
            </div>
          )}

          {/* FOOTER SUMMARY */}
          {!loading && budgets.length > 0 && <BudgetSummary budgets={budgets} />}
        </>
      )}
    </div>
  );
}
