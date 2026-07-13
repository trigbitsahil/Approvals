"use client";

import { Loader2, PlusCircle, Pencil, DollarSign, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { BudgetListVM } from "@/api/models/BudgetListVM";
import type { ExpenseCategoryListVM } from "@/api/models/ExpenseCategoryListVM";

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBudget: BudgetListVM | null;
  categories: ExpenseCategoryListVM[];
  loadingCategories: boolean;
  isSubmitting: boolean;
  formData: {
    name: string;
    description: string;
    amount: number;
    expenseCategoryId: string;
  };
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BudgetForm({
  open,
  onOpenChange,
  editingBudget,
  categories,
  loadingCategories,
  isSubmitting,
  formData,
  onInputChange,
  onSubmit,
}: BudgetFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] border border-slate-200 dark:border-white/10 bg-card/95 rounded-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-3xl p-0 gap-0 max-h-[95vh] flex flex-col">
        <DialogHeader className="p-6 sm:p-8     border-b border-white/5 shrink-0">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-primary rounded-2xl">
              {editingBudget ? (
                <Pencil className="h-6 w-6 text-primary-foreground" />
              ) : (
                <PlusCircle className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            {editingBudget ? "Update Allocation" : "New Capital Definition"}
          </DialogTitle>
          <DialogDescription className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
            Configure budget limits and categorization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2.5">
                <label className="text-[12px] font-black uppercase tracking-tighter   ml-1">
                  Budget Internal Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Q2 Server Infrestructure"
                  className="bg-muted/20 dark:border-white/10 rounded-2xl h-12 text-sm   transition-all hover:bg-muted/30 font-bold"
                  value={formData.name}
                  onChange={(e) => onInputChange("name", e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <label className="text-[12px] font-black uppercase tracking-tighter   ml-1">
                  Allocation Description
                </label>
                <textarea
                  placeholder="Purpose and constraints of this budget..."
                  className="w-full bg-muted/20 border border-slate-200 dark:border-white/10 rounded-[1.5rem] px-5 py-4 text-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all hover:bg-muted/30"
                  value={formData.description}
                  onChange={(e) => onInputChange("description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Amount */}
                <div className="space-y-2.5">
                  <label className="text-[12px] font-black uppercase tracking-tighter   flex items-center gap-1.5 ml-1">
                    <DollarSign className="h-3 w-3 text-primary/60" /> Budget Amount{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm font-black">
                      $
                    </div>
                    <Input
                      type="number"
                      required
                      placeholder="0.00"
                      className="pl-9 bg-muted/20 border border-slate-200 dark:border-white/10 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30 font-black"
                      value={formData.amount}
                      onChange={(e) => onInputChange("amount", Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2.5">
                  <label className="text-[12px] font-black uppercase tracking-tighter   flex items-center gap-1.5 ml-1">
                    <Layers className="h-3 w-3 text-primary/60" /> Expense Type{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formData.expenseCategoryId}
                    onValueChange={(v) => onInputChange("expenseCategoryId", v)}
                  >
                    <SelectTrigger className="bg-muted/20 border border-slate-200 dark:border-white/10 rounded-2xl h-12 text-sm focus:ring-primary/20 transition-all hover:bg-muted/30">
                      <SelectValue placeholder={loadingCategories ? "Loading..." : "-- Select --"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/20 backdrop-blur-2xl">
                      {categories.map((c) => (
                        <SelectItem
                          key={c.expenseCategoryId!}
                          value={c.expenseCategoryId!}
                          className="rounded-xl focus:bg-primary/10"
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transaction Totals (Aggregate Fields) */}
              {/* <div className="pt-4 border-t border-white/5 space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 opacity-50">
                  Transaction Performance Stats
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-tight text-emerald-500/80 ml-1">
                      Total Approved
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="bg-emerald-500/5 border-emerald-500/10 rounded-xl h-10 text-xs font-bold"
                      value={formData.expenseTransactionTotalApproved}
                      onChange={(e) => onInputChange("expenseTransactionTotalApproved", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-tight text-blue-500/80 ml-1">
                      Approved Not Paid
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="bg-blue-500/5 border-blue-500/10 rounded-xl h-10 text-xs font-bold"
                      value={formData.expenseTransactionTotalApprovedNotPaid}
                      onChange={(e) => onInputChange("expenseTransactionTotalApprovedNotPaid", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-tight text-amber-500/80 ml-1">
                      Total Paid
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="bg-amber-500/5 border-amber-500/10 rounded-xl h-10 text-xs font-bold"
                      value={formData.expenseTransactionTotalPaid}
                      onChange={(e) => onInputChange("expenseTransactionTotalPaid", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-muted/10 border-t border-border/10 shrink-0">
            <div className="flex flex-col-reverse sm:flex-row w-full items-stretch sm:items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-widest hover:bg-muted/30 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl h-12 px-12 font-black text-[10px] uppercase tracking-widest bg-primary hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingBudget ? (
                  "Update Record"
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
