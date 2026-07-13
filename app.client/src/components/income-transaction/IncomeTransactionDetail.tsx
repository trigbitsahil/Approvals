"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Store,
  Briefcase,
  Layers,
  Info,
  Loader2,
  User,
  FileText,
  AlertCircle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IncomeTransactionService } from "@/api/services/IncomeTransactionService";
import type { IncomeTransactionDetailVM } from "@/api/models/IncomeTransactionDetailVM";
import { toast } from "sonner";

interface IncomeTransactionDetailProps {
  transactionId: string;
  onBack: () => void;
}

export function IncomeTransactionDetail({
  transactionId,
  onBack,
}: IncomeTransactionDetailProps) {
  const [detail, setDetail] = useState<IncomeTransactionDetailVM | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await IncomeTransactionService.getIncomeTransactionById(transactionId, "1");
      if (res.success) {
        setDetail(res.data || null);
      } else {
        toast.error(res.message || "Failed to load details");
      }
    } catch (err) {
      console.error("Failed to fetch transaction details:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Decrypting Transaction Data
        </p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 text-center">
        <AlertCircle className="h-16 w-16 text-rose-500 opacity-20" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Transaction Not Found</h2>
        <Button onClick={onBack} variant="outline" className="rounded-2xl px-8 uppercase font-black text-[10px] tracking-widest">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="group rounded-2xl gap-2 hover:bg-primary/10 hover:text-primary transition-all font-black uppercase text-[10px] tracking-widest w-fit"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
        <div className="flex items-center gap-3">

          {detail.isCleared ? (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase px-3 py-1">
              Cleared
            </Badge>
          ) : (
            <Badge className="bg-amber-500/10 text-amber-500 border-none font-black text-[9px] uppercase px-3 py-1">
              Pending
            </Badge>
          )}
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AMOUNT CARD */}
        <div className="relative group overflow-hidden bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-primary/20 shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="h-24 w-24" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Transaction Value
          </p>
          <div className="space-y-1">
            <p className="text-4xl font-black text-foreground tracking-tighter tabular-nums">
              <span className="text-primary mr-1 text-lg">$</span>
              {detail.incomeAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              Authorized Spending Limit
            </p>
          </div>
        </div>

        {/* CLASSIFICATION CARD */}
        <div className="relative group overflow-hidden bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-emerald-500/20 shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layers className="h-24 w-24" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Classification
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Type</p>
              <p className="text-sm font-black text-foreground uppercase tracking-tight">{detail.incomeTypeName || "General Income"}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Category</p>
              <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-none font-black text-[8px] uppercase px-2">
                {detail.category || "Uncategorized"}
              </Badge>
            </div>
          </div>
        </div>

        {/* ORIGIN CARD */}
        <div className="relative group overflow-hidden bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-amber-500/20 shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="h-24 w-24" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Temporal Data
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Spending Date</p>
              <p className="text-sm font-black text-foreground uppercase tracking-tight">
                {detail.dateOfIncome ? new Date(detail.dateOfIncome).toLocaleDateString(undefined, { dateStyle: 'long' }) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Recorded On</p>
              <p className="text-[10px] font-black text-muted-foreground/60 uppercase">
                {detail.createdDate ? new Date(detail.createdDate).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED INFORMATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN DETAILS */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/40 dark:bg-card/30 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-10 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase mb-2">
                {detail.name}
              </h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText className="h-3 w-3 text-primary/60" /> Detailed Purpose
              </p>
              <div className="bg-muted/10 rounded-[1.5rem] p-6 border border-white/5">
                <p className="text-sm leading-relaxed text-foreground/80 font-medium">
                  {detail.description || "No additional description provided for this transaction."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <Store className="h-3 w-3 text-primary/60" /> Customer Information
                </p>
                <div className="flex items-center gap-4 bg-muted/10 rounded-2xl p-4 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-foreground">{detail.customerId ? detail.customerName || "Certified Customer" : "Direct Pay"}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">ID: {detail.customerId || "Self-Managed"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <Briefcase className="h-3 w-3 text-primary/60" /> Project Allocation
                </p>
                <div className="flex items-center gap-4 bg-muted/10 rounded-2xl p-4 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-foreground">{detail.incomeName || "General Project Spending"}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Budget ID: {detail.budgetId || "Global Pool"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR STATS */}
        <div className="space-y-6">
          {/* AUDIT LOG */}
          <div className="bg-white/40 dark:bg-card/30 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 space-y-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Info className="h-3 w-3 text-primary/60" /> System Audit
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Created By</p>
                  <p className="text-[10px] font-black text-foreground uppercase">{detail.createdBy || "System"}</p>
                </div>
              </div>

              {detail.lastModifiedBy && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Last Modified By</p>
                    <p className="text-[10px] font-black text-foreground uppercase">{detail.lastModifiedBy}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-muted-foreground/50 uppercase">Advance Payment</span>
                  <Badge variant={detail.isAdvance ? "default" : "outline"} className="text-[8px] h-4">
                    {detail.isAdvance ? "YES" : "NO"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-muted-foreground/50 uppercase">Finance Approved</span>
                  <Badge variant={detail.isFinanceApproved ? "default" : "outline"} className={`text-[8px] h-4 ${detail.isFinanceApproved ? "bg-emerald-500" : ""}`}>
                    {detail.isFinanceApproved ? "YES" : "NO"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          {/* <div className="bg-primary rounded-[2.5rem] p-8 text-primary-foreground space-y-4 shadow-2xl shadow-primary/20">
            <h4 className="text-sm font-black uppercase tracking-tighter">Action Required?</h4>
            <p className="text-[10px] opacity-80 font-medium leading-relaxed">
              If this transaction requires adjustment or needs to be marked as void, please use the edit tools in the ledger list.
            </p>
            <Button 
              variant="secondary" 
              className="w-full rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest bg-white text-primary hover:bg-white/90"
              onClick={onBack}
            >
              Return to Ledger
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
