"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpCircle,
  AlertCircle,
  Loader2,
  Layers,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { BudgetService } from "@/api/services/BudgetService";
import type { BudgetListVM } from "@/api/models/BudgetListVM";
import type { BudgetDetailVM } from "@/api/models/BudgetDetailVM";
import type { ExpenseTransactionListVM } from "@/api/models/ExpenseTransactionListVM";
import { toast } from "sonner";

interface BudgetDetailDashboardProps {
  budget: BudgetListVM;
  projectId: string;
  onBack: () => void;
}

export function BudgetDetailDashboard({ budget, projectId, onBack }: BudgetDetailDashboardProps) {
  const [details, setDetails] = useState<BudgetDetailVM | null>(null);
  const [transactions, setTransactions] = useState<ExpenseTransactionListVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [detailRes, transRes] = await Promise.all([
        BudgetService.getBudgetById(budget.budgetId!, "1"),
        BudgetService.getBudgetTransactionList("1", budget.budgetId!)
      ]);

      if (detailRes.success) setDetails(detailRes.data || null);
      if (transRes.success && transRes.data) {
        setTransactions(transRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch budget details:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [budget.budgetId]);

  const filteredTransactions = transactions.filter(t =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.expenseName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Assembling Dashboard...
        </p>
      </div>
    );
  }

  const balance = (details?.amount || 0) - (details?.expenseTransactionTotalPaid || 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER NAVIGATION */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="group rounded-2xl gap-2 hover:bg-primary/10 hover:text-primary transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to List
        </Button>
      </div>

      {/* TOP ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* INFO CARD */}
        <div className="relative group overflow-hidden bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-primary/20 shadow-lg hover:shadow-2xl dark:shadow-none hover:dark:shadow-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Briefcase className="h-24 w-24" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Budget Info
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Budget Name</p>
              <p className="text-lg font-black text-foreground tracking-tight uppercase truncate">{details?.name}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Expense Category</p>
              <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-none font-black text-[9px] uppercase px-3">
                {details?.expenseCategoryName || "General"}
              </Badge>
            </div>
          </div>
        </div>

        {/* FINANCIALS CARD */}
        <div className="relative group md:col-span-1 overflow-hidden bg-slate-50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-emerald-500/20 shadow-lg hover:shadow-2xl dark:shadow-none hover:dark:shadow-emerald-500/5">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="h-24 w-24" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Finance Overview
          </p>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="col-span-2 pb-2 border-b border-slate-200/50 dark:border-white/5">
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Total Allocation</p>
              <p className="text-3xl font-black text-foreground tracking-tighter tabular-nums">
                <span className="text-emerald-500 mr-1 text-sm">$</span>
                {details?.amount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-muted-foreground/50 uppercase">Approved</p>
              <p className="text-sm font-black text-emerald-500 tabular-nums">
                ${details?.expenseTransactionTotalApproved?.toLocaleString() || "0"}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-muted-foreground/50 uppercase">Paid Out</p>
              <p className="text-sm font-black text-amber-500 tabular-nums">
                ${details?.expenseTransactionTotalPaid?.toLocaleString() || "0"}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-muted-foreground/50 uppercase">Approved Not Paid</p>
              <p className="text-sm font-black text-blue-500 tabular-nums">
                ${details?.expenseTransactionTotalApprovedNotPaid?.toLocaleString() || "0"}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-muted-foreground/50 uppercase">Current Balance</p>
              <p className={`text-sm font-black tabular-nums ${balance < 0 ? "text-rose-500" : "text-emerald-400"}`}>
                ${balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ADDITIONAL INFO CARD */}
        <div className="relative group overflow-hidden bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-amber-500/20 shadow-lg hover:shadow-2xl dark:shadow-none hover:dark:shadow-amber-500/5">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="h-24 w-24" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Activity Log
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-200/50 dark:border-white/5">
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Created By</p>
              <p className="text-[10px] font-black text-foreground uppercase">{details?.createdBy || "System"}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200/50 dark:border-white/5">
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Created On</p>
              <p className="text-[10px] font-black text-foreground">{details?.createdDate ? new Date(details.createdDate).toLocaleDateString() : "N/A"}</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Status</p>
              <Badge className={details?.isVoided ? "bg-rose-500/10 text-rose-500 border-none px-3" : "bg-emerald-500/10 text-emerald-500 border-none px-3"}>
                <span className="text-[8px] font-black uppercase">{details?.isVoided ? "Voided" : "Active"}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* BUDGET TRANSACTIONS SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight uppercase">Budget Transactions</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Verified Expense Ledger</p>
            </div>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-2xl bg-white/60 dark:bg-card/40 border border-slate-200 dark:border-white/10 focus:ring-primary/20 transition-all font-bold text-xs "
            />
          </div>
        </div>

        <div className="border border-slate-200 dark:border-white/10 rounded-[2rem] bg-white/40 dark:bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                  <TableHead className="font-black text-[10px] uppercase tracking-widest px-8 py-5 h-auto text-foreground/90">Transaction Name</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest px-8 py-5 h-auto text-right text-foreground/90">Amount</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest px-8 py-5 h-auto text-center text-foreground/90">Type</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest px-8 py-5 h-auto text-foreground/90">Created By</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest px-8 py-5 h-auto text-foreground/90">Date</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest px-8 py-5 h-auto text-center text-foreground/90">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <TableRow key={t.expenseTransactionID} className="transition-colors border-slate-50 dark:border-white/5 group hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <TableCell className="px-8 py-5">
                        <div className="min-w-0">
                          <p className="font-black text-xs text-primary tracking-tight uppercase group-hover:underline cursor-default">
                            {t.name}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1 opacity-60 truncate max-w-[200px]">
                            {t.expenseName || "No Category"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right font-black text-xs tabular-nums">
                        ${t.expenseAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-8 py-5 text-center">
                        <Badge variant="outline" className={`rounded-full border-none font-black text-[8px] uppercase px-3 ${t.isAdvance ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`}>
                          {t.isAdvance ? "Advance" : "Direct"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-[10px] font-bold text-foreground/80 uppercase tracking-tighter">
                          {t.createdBy || "System"}
                        </p>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-[10px] font-bold text-foreground/60 tabular-nums">
                        {t.createdDate ? new Date(t.createdDate).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="px-8 py-5 text-center">
                        {t.isCleared ? (
                          <div className="inline-flex items-center gap-1.5 text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase">Cleared</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-amber-500">
                            <Clock className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase">Pending</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30 gap-2">
                        <AlertCircle className="h-8 w-8" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No entries found for this budget</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
