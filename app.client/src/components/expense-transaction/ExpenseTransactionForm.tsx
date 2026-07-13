"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  PlusCircle,
  Tag,
  Briefcase,
  DollarSign,
  Store,
  Layers,
  Calendar,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ExpenseListVM } from "@/api/models/ExpenseListVM";
import type { ExpenseTypeListVM } from "@/api/models/ExpenseTypeListVM";
import type { BudgetListVM } from "@/api/models/BudgetListVM";
import type { ExpenseCategoryListVM } from "@/api/models/ExpenseCategoryListVM";
import type { VendorListVM } from "@/api/models/VendorListVM";
import type { ApprovalListVM } from "@/api/models/ApprovalListVM";
import { CheckCircle2 } from "lucide-react";

interface ExpenseTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  loadingFormData: boolean;
  formData: {
    expenseTypeId: string;
    expenseId: string;
    budgetId: string;
    vendorId: string;
    categoryID: string;
    name: string;
    description: string;
    dateOfExpense: string;
    expenseAmount: number;
    isAdvance: boolean;
    isCleared: boolean;
    approvalId: string;
  };
  isEdit?: boolean;
  onInputChange: (field: string, value: any) => void;
  dependencies: {
    expenseTypes: ExpenseTypeListVM[];
    expenses: ExpenseListVM[];
    budgets: BudgetListVM[];
    vendors: VendorListVM[];
    categories: ExpenseCategoryListVM[];
    approvals: ApprovalListVM[];
  };
}

export function ExpenseTransactionForm({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  loadingFormData,
  formData,
  isEdit = false,
  onInputChange,
  dependencies,
}: ExpenseTransactionFormProps) {
  const [expenseTypeSearch, setExpenseTypeSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");
  const [budgetSearch, setBudgetSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [approvalSearch, setApprovalSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setExpenseTypeSearch("");
      setExpenseSearch("");
      setBudgetSearch("");
      setVendorSearch("");
      setCategorySearch("");
      setApprovalSearch("");
    }
  }, [open]);

  const filteredExpenseTypes = dependencies.expenseTypes.filter((t) =>
    (t.name || "").toLowerCase().includes(expenseTypeSearch.toLowerCase())
  );
  const filteredExpenses = dependencies.expenses.filter((e) =>
    (e.name || "").toLowerCase().includes(expenseSearch.toLowerCase())
  );
  const filteredBudgets = dependencies.budgets.filter((b) =>
    (b.name || "").toLowerCase().includes(budgetSearch.toLowerCase())
  );
  const filteredVendors = dependencies.vendors.filter((v) =>
    (v.name || "").toLowerCase().includes(vendorSearch.toLowerCase())
  );
  const filteredCategories = dependencies.categories.filter((c) =>
    (c.name || "").toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredApprovals = dependencies.approvals.filter((a) =>
    (a.name || "").toLowerCase().includes(approvalSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] border-border/20 bg-card/95 rounded-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-3xl p-0 gap-0 max-h-[95vh] flex flex-col border border-white/10">
        <DialogHeader className="p-6 sm:p-8 bg-gradient-to-br from-primary/10 to-transparent border-b border-white/5 shrink-0">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-primary rounded-2xl">
              <PlusCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            {isEdit ? "Edit Expense Entry" : "New Expense Entry"}
          </DialogTitle>
          <DialogDescription className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
            Transaction details and categorization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Expense Type */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                  <Tag className="h-3 w-3 text-primary/60" /> Expense Type
                </label>
                 <Select
                  value={formData.expenseTypeId}
                  onValueChange={(v) => onInputChange("expenseTypeId", v)}
                >
                  <SelectTrigger className="bg-muted/20 border-border/40 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30">
                    <SelectValue
                      placeholder={loadingFormData ? "Loading types..." : "-- Select Type --"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-2xl border-border/20 backdrop-blur-2xl max-h-[300px]"
                    search={
                      <div className="p-2 border-b border-border/10">
                        <Input
                          placeholder="Search type..."
                          value={expenseTypeSearch}
                          onChange={(e) => setExpenseTypeSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="h-8 text-xs bg-muted/30 border-border/30 rounded-xl focus:ring-0 focus:border-border/60"
                        />
                      </div>
                    }
                  >
                    {filteredExpenseTypes.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground text-center">
                        No types found
                      </div>
                    ) : (
                      filteredExpenseTypes.map((t) => (
                        <SelectItem
                          key={t.expenseTypeID!}
                          value={t.expenseTypeID!}
                          className="rounded-xl focus:bg-primary/10"
                        >
                          {t.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Expense */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                  <Briefcase className="h-3 w-3 text-primary/60" /> Expense
                </label>
                <Select
                  value={formData.expenseId}
                  onValueChange={(v) => onInputChange("expenseId", v)}
                >
                  <SelectTrigger className="bg-muted/20 border-border/40 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30">
                    <SelectValue
                      placeholder={loadingFormData ? "Loading items..." : "-- Select Expense --"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-2xl border-border/20 backdrop-blur-2xl max-h-[300px]"
                    search={
                      <div className="p-2 border-b border-border/10">
                        <Input
                          placeholder="Search expense..."
                          value={expenseSearch}
                          onChange={(e) => setExpenseSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="h-8 text-xs bg-muted/30 border-border/30 rounded-xl focus:ring-0 focus:border-border/60"
                        />
                      </div>
                    }
                  >
                    {filteredExpenses.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground text-center">
                        No expenses found
                      </div>
                    ) : (
                      filteredExpenses.map((e) => (
                        <SelectItem
                          key={e.expenseID!}
                          value={e.expenseID!}
                          className="rounded-xl focus:bg-primary/10"
                        >
                          {e.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                  <DollarSign className="h-3 w-3 text-primary/60" /> Budget Source (Optional)
                </label>
                <Select
                  value={formData.budgetId}
                  onValueChange={(v) => onInputChange("budgetId", v)}
                >
                  <SelectTrigger className="bg-muted/20 border-border/40 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30">
                    <SelectValue
                      placeholder={loadingFormData ? "Loading budgets..." : "-- Optional --"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-2xl border-border/20 backdrop-blur-2xl max-h-[300px]"
                    search={
                      <div className="p-2 border-b border-border/10">
                        <Input
                          placeholder="Search budget..."
                          value={budgetSearch}
                          onChange={(e) => setBudgetSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="h-8 text-xs bg-muted/30 border-border/30 rounded-xl focus:ring-0 focus:border-border/60"
                        />
                      </div>
                    }
                  >
                    <SelectItem
                      value="none"
                      className="rounded-xl focus:bg-primary/10 italic text-muted-foreground"
                    >
                      No Budget
                    </SelectItem>
                    {filteredBudgets.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground text-center">
                        No budgets found
                      </div>
                    ) : (
                      filteredBudgets.map((b) => (
                        <SelectItem
                          key={b.budgetId!}
                          value={b.budgetId!}
                          className="rounded-xl focus:bg-primary/10"
                        >
                          {b.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Vendor */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                  <Store className="h-3 w-3 text-primary/60" /> Vendor / Recipient
                </label>
                <Select
                  value={formData.vendorId}
                  onValueChange={(v) => onInputChange("vendorId", v)}
                >
                  <SelectTrigger className="bg-muted/20 border-border/40 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30">
                    <SelectValue
                      placeholder={loadingFormData ? "Loading vendors..." : "-- Select Vendor --"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-2xl border-border/20 backdrop-blur-2xl max-h-[300px]"
                    search={
                      <div className="p-2 border-b border-border/10">
                        <Input
                          placeholder="Search vendor..."
                          value={vendorSearch}
                          onChange={(e) => setVendorSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="h-8 text-xs bg-muted/30 border-border/30 rounded-xl focus:ring-0 focus:border-border/60"
                        />
                      </div>
                    }
                  >
                    {filteredVendors.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground text-center">
                        No vendors found
                      </div>
                    ) : (
                      filteredVendors.map((v) => {
                        const vId = (v.vendorId || (v as any).vendorID || (v as any).id || "").toString();
                        return (
                          <SelectItem
                            key={vId}
                            value={vId}
                            className="rounded-xl focus:bg-primary/10"
                          >
                            {v.name}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Expense Category */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                  <Layers className="h-3 w-3 text-primary/60" /> Category
                </label>
                <Select
                  value={formData.categoryID}
                  onValueChange={(v) => onInputChange("categoryID", v)}
                >
                  <SelectTrigger className="bg-muted/20 border-border/40 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30">
                    <SelectValue
                      placeholder={loadingFormData ? "Loading categories..." : "-- Select Category --"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-2xl border-border/20 backdrop-blur-2xl max-h-[300px]"
                    search={
                      <div className="p-2 border-b border-border/10">
                        <Input
                          placeholder="Search category..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="h-8 text-xs bg-muted/30 border-border/30 rounded-xl focus:ring-0 focus:border-border/60"
                        />
                      </div>
                    }
                  >
                    {filteredCategories.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground text-center">
                        No categories found
                      </div>
                    ) : (
                      filteredCategories.map((c) => (
                        <SelectItem
                          key={c.expenseCategoryId!}
                          value={c.expenseCategoryId!}
                          className="rounded-xl focus:bg-primary/10"
                        >
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Approval Request */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                  <CheckCircle2 className="h-3 w-3 text-primary/60" /> Approval Request (Optional)
                </label>
                <Select
                  value={formData.approvalId}
                  onValueChange={(v) => onInputChange("approvalId", v)}
                >
                  <SelectTrigger className="bg-muted/20 border-border/40 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30">
                    <SelectValue
                      placeholder={loadingFormData ? "Loading approvals..." : "-- Optional --"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-2xl border-border/20 backdrop-blur-2xl max-h-[300px]"
                    search={
                      <div className="p-2 border-b border-border/10">
                        <Input
                          placeholder="Search approval..."
                          value={approvalSearch}
                          onChange={(e) => setApprovalSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="h-8 text-xs bg-muted/30 border-border/30 rounded-xl focus:ring-0 focus:border-border/60"
                        />
                      </div>
                    }
                  >
                    <SelectItem
                      value="none"
                      className="rounded-xl focus:bg-primary/10 italic text-muted-foreground"
                    >
                      No Approval Linked
                    </SelectItem>
                    {filteredApprovals.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground text-center">
                        No approvals found
                      </div>
                    ) : (
                      filteredApprovals.map((a) => (
                        <SelectItem
                          key={a.approvalID!}
                          value={a.approvalID!}
                          className="rounded-xl focus:bg-primary/10"
                        >
                          <div className="flex flex-col gap-0.5 animate-none">
                            <span className="font-bold">{a.name}</span>
                            <span className="text-[10px] opacity-50 uppercase tracking-tighter">
                              {a.approvalStatusName || "Status Unknown"}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Expense Amount */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                  <DollarSign className="h-3 w-3 text-primary/60" /> Total Amount{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm font-black">
                    $
                  </div>
                  <Input
                    type="number"
                    required
                    placeholder=""
                    className="pl-9 bg-muted/20 border-border/40 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30 font-black"
                    value={formData.expenseAmount}
                    onChange={(e) => onInputChange("expenseAmount", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Expense Name */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 ml-1">
                Transaction Name <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Server Maintenance Renewal"
                className="bg-muted/20 border-border/40 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30 font-bold"
                value={formData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
              />
            </div>

            {/* Purpose / Description */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 ml-1">
                Detailed Purpose
              </label>
              <textarea
                placeholder="Explain the context of this expense..."
                className="w-full bg-muted/20 border border-border/40 rounded-[1.5rem] px-5 py-4 text-sm resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all hover:bg-muted/30"
                value={formData.description}
                onChange={(e) => onInputChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
              {/* Date Of Expense */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                  <Calendar className="h-3 w-3 text-primary/60" /> Spending Date
                </label>
                <Input
                  type="date"
                  className="bg-muted/20 border-border/40 rounded-2xl h-12 text-sm block cursor-pointer transition-all hover:bg-muted/30"
                  value={formData.dateOfExpense}
                  onChange={(e) => onInputChange("dateOfExpense", e.target.value)}
                />
              </div>
            </div>

            {/* Is Cleared & Is Advance Group */}
            {isEdit && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                {/* Is Advance */}
                <div
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all h-12 ${formData.isAdvance
                    ? "bg-amber-500/5 border-amber-500/30"
                    : "bg-muted/10 border-border/10 opacity-70 hover:opacity-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="isAdvance"
                      checked={formData.isAdvance}
                      onCheckedChange={(checked) => onInputChange("isAdvance", !!checked)}
                      className="rounded-lg h-5 w-5"
                    />
                    <label
                      htmlFor="isAdvance"
                      className="text-xs font-black uppercase tracking-tighter cursor-pointer select-none"
                    >
                      Record as Advance
                    </label>
                  </div>
                  <Info
                    className={`h-4 w-4 ${formData.isAdvance ? "text-amber-500" : "text-muted-foreground/30"
                      }`}
                  />
                </div>

                {/* Is Cleared */}
                <div
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all h-12 ${formData.isCleared
                    ? "bg-emerald-500/5 border-emerald-500/30"
                    : "bg-muted/10 border-border/10 opacity-70 hover:opacity-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="isCleared"
                      checked={formData.isCleared}
                      onCheckedChange={(checked) => onInputChange("isCleared", !!checked)}
                      className="rounded-lg h-5 w-5"
                    />
                    <label
                      htmlFor="isCleared"
                      className="text-xs font-black uppercase tracking-tighter cursor-pointer select-none"
                    >
                      Mark as Cleared
                    </label>
                  </div>
                  <CheckCircle2
                    className={`h-4 w-4 ${formData.isCleared ? "text-emerald-500" : "text-muted-foreground/30"
                      }`}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-muted/10 border-t border-border/10 shrink-0">
            <div className="flex w-full items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-widest hover:bg-muted/30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl h-12 px-12 font-black text-[10px] uppercase tracking-widest bg-primary hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
