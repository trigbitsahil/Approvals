"use client";

import {
  MoreVertical,
  Trash2,
  DollarSign,
  Calendar,
  Store,
  CheckCircle2,
  Edit2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IncomeTransactionListVM } from "@/api/models/IncomeTransactionListVM";

interface IncomeTransactionListProps {
  items: IncomeTransactionListVM[];
  viewMode: "grid" | "list";
  onDelete: (id: string) => void;
  onEditTransaction: (transaction: IncomeTransactionListVM) => void;
  onViewDetails: (id: string) => void;
}

export function IncomeTransactionList({
  items,
  viewMode,
  onDelete,
  onEditTransaction,
  onViewDetails,
}: IncomeTransactionListProps) {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {items.map((t) => (
        <div
          key={t.incomeTransactionID}
          onClick={() => onViewDetails(t.incomeTransactionID!)}
          className={`group relative overflow-hidden transition-all duration-500 ease-out border cursor-pointer ${
            viewMode === "grid"
              ? "bg-card/40 hover:bg-card/80 border-border/40 hover:border-primary/40 rounded-[2.5rem] p-7 shadow-sm hover:shadow-md"
              : "bg-card/40 hover:bg-card/80 border-border/30 rounded-[1.75rem] p-5 flex items-center gap-6 hover:shadow-md"
          }`}
        >
          {/* Background Accent */}
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div
            className={
              viewMode === "grid" ? "space-y-6" : "flex items-center gap-6 flex-1"
            }
          >
            {/* Visual Identity */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground group-hover:rotate-[10deg] transition-all duration-500 shadow-xl shadow-primary/20 border border-white/10">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-foreground tracking-tight leading-tight uppercase group-hover:text-primary transition-colors truncate">
                    {t.name || "UNSPECIFIED"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className="text-[8px] font-black px-2 py-0 h-5 bg-card border-none uppercase tracking-tighter opacity-80 shadow-sm"
                    >
                      {t.incomeTypeName || "GENERIC"}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-muted-foreground/50 font-bold text-[9px] uppercase tracking-tighter">
                      <Calendar className="h-2.5 w-2.5" />
                      {t.dateOfIncome
                        ? new Date(t.dateOfIncome).toLocaleDateString()
                        : "PENDING"}
                    </div>
                  </div>
                </div>
              </div>

              {viewMode === "grid" && (
                <div className="relative z-30" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0 rounded-2xl hover:bg-white/10 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl border-border/20 shadow-2xl p-2 backdrop-blur-xl"
                    >
                      <DropdownMenuItem
                        className="gap-3 font-black text-[10px] p-3 cursor-pointer rounded-xl uppercase tracking-widest"
                        onClick={() => onViewDetails(t.incomeTransactionID!)}
                      >
                        <Eye className="h-4 w-4" /> View Full Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-3 font-black text-[10px] p-3 cursor-pointer rounded-xl uppercase tracking-widest"
                        onClick={() => onEditTransaction && onEditTransaction(t)}
                      >
                        <Edit2 className="h-4 w-4" /> Edit Transaction
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500 gap-3 font-black text-[10px] p-3 cursor-pointer rounded-xl uppercase tracking-widest"
                        onClick={() => onDelete(t.incomeTransactionID!)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete Transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Quantitative Data */}
            {viewMode === "grid" ? (
              <>
                <div className="flex items-end justify-between py-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                      Value Transferred
                    </p>
                    <p className="text-2xl font-black text-foreground tracking-tighter tabular-nums flex items-center">
                      <span className="text-primary mr-1 text-sm font-black">$</span>
                      {t.incomeAmount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                      Allocation
                    </p>
                    <p className="text-xs font-black text-foreground/80 truncate max-w-[120px] tracking-tight">
                      {t.category || t.incomeName || "UNIDENTIFIED"}
                    </p>
                  </div>
                </div>

                {t.approvalName && (
                  <div className="flex items-center gap-2 mb-3 bg-primary/5 p-2 rounded-xl border border-primary/10">
                    <CheckCircle2 className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter truncate">
                      {t.approvalName}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-5 border-t border-border/20">
                  <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    <div className="p-1 rounded bg-muted/20">
                      <Store className="h-2.5 w-2.5 text-muted-foreground/60" />
                    </div>
                    <span className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">
                      {t.customerId ? t.customerName || "CERTIFIED CUSTOMER" : "DIRECT PAY"}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {t.isAdvance && (
                      <div className="text-[8px] h-5 flex items-center bg-amber-500 text-white rounded-full px-2 font-black uppercase tracking-tighter shadow-lg shadow-amber-500/20">
                        ADV
                      </div>
                    )}
                    {t.isCleared && (
                      <div className="text-[8px] h-5 flex items-center bg-emerald-500 text-white rounded-full px-2 font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20">
                        CLR
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-40 flex flex-col justify-center gap-0.5 border-l border-white/5 pl-6">
                  <p className="text-[8px] font-black text-muted-foreground uppercase opacity-40">
                    Amount
                  </p>
                  <p className="text-lg font-black text-foreground tracking-tighter tabular-nums">
                    ${t.incomeAmount?.toLocaleString()}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col justify-center flex-1 gap-0.5 border-l border-white/5 pl-6">
                  <p className="text-[8px] font-black text-muted-foreground uppercase opacity-40">
                    Allocation
                  </p>
                  <p className="text-xs font-black uppercase tracking-tighter text-foreground/70 truncate">
                    {t.category || t.incomeName || "GENERAL"}
                  </p>
                </div>
                {t.approvalName && (
                  <div className="hidden lg:flex flex-col justify-center flex-1 gap-0.5 border-l border-white/5 pl-6">
                    <p className="text-[8px] font-black text-primary uppercase opacity-60">
                      Approval Ref
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-primary/80 truncate">
                      {t.approvalName}
                    </p>
                  </div>
                )}
                 <div className="flex items-center gap-3 pr-2" onClick={(e) => e.stopPropagation()}>
                  {t.isAdvance && (
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-white/5 transition-colors">
                        <MoreVertical className="h-4 w-4 opacity-40" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl border-border/20 p-2 shadow-2xl"
                    >
                      <DropdownMenuItem
                        className="font-black text-[10px] p-3 cursor-pointer rounded-xl uppercase tracking-widest"
                        onClick={() => onViewDetails(t.incomeTransactionID!)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-black text-[10px] p-3 cursor-pointer rounded-xl uppercase tracking-widest"
                        onClick={() => onEditTransaction && onEditTransaction(t)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 font-black text-[10px] p-3 cursor-pointer rounded-xl uppercase tracking-widest"
                        onClick={() => onDelete(t.incomeTransactionID!)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
