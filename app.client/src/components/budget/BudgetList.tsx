"use client";

import {
  MoreVertical,
  Pencil,
  Trash2,
  Briefcase,
  CheckCircle2,
  ArrowUpCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BudgetListVM } from "@/api/models/BudgetListVM";

interface BudgetListProps {
  items: BudgetListVM[];
  viewMode: "grid" | "list";
  onEdit: (budget: BudgetListVM) => void;
  onDelete: (id: string) => void;
  onSelect: (budget: BudgetListVM) => void;
}

export function BudgetList({ items, viewMode, onEdit, onDelete, onSelect }: BudgetListProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((b) => {
          const balance = (b.amount || 0) - (b.expenseTransactionTotalPaid || 0);
          return (
            <div
              key={b.budgetId}
              onClick={() => onSelect(b)}
              className="group relative overflow-hidden transition-all duration-500 ease-out border border-slate-200 dark:border-white/10 hover:border-primary/20 rounded-[2.5rem] bg-card/40 hover:bg-card/60 p-7 shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground group-hover:rotate-[10deg] transition-all duration-500 shadow-xl shadow-primary/20 border border-white/10">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-sm text-foreground tracking-tight leading-tight uppercase group-hover:text-primary/80 transition-colors truncate max-w-[140px]">
                        {b.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-[8px] font-black px-2 py-0 h-5 bg-card border-none uppercase tracking-tighter opacity-80 shadow-sm"
                        >
                          {b.expenseCategoryName || "GENERAL"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-2 backdrop-blur-xl"
                      >
                        <DropdownMenuItem
                          className="gap-3 font-black text-[10px] p-3 cursor-pointer rounded-xl uppercase tracking-widest"
                          onClick={() => onEdit(b)}
                        >
                          <Pencil className="h-4 w-4" /> Edit Allocation
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500 gap-3 font-black text-[10px] p-3 cursor-pointer rounded-xl uppercase tracking-widest"
                          onClick={() => onDelete(b.budgetId!)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px]  uppercase tracking-widest  mb-1">
                      Total Allocation
                    </p>
                    <p className="text-2xl font-black text-foreground tracking-tighter tabular-nums">
                      <span className="text-primary mr-1 text-sm font-black">$</span>
                      {b.amount?.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black  uppercase ">
                        Approved
                      </p>
                      <div className="flex items-center gap-1 font-bold text-[10px] tabular-nums text-emerald-500/80">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {b.expenseTransactionTotalApproved?.toLocaleString() || "0"}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[7px] font-black  uppercase ">
                        Appr. Not Paid
                      </p>
                      <div className="flex items-center gap-1 font-bold text-[10px] tabular-nums text-blue-500/80">
                        <Clock className="h-2.5 w-2.5" />
                        {b.expenseTransactionTotalApprovedNotPaid?.toLocaleString() || "0"}
                      </div>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[7px] font-black  uppercase ">
                        Paid
                      </p>
                      <div className="flex items-center justify-end gap-1 font-bold text-[10px] tabular-nums ">
                        <ArrowUpCircle className="h-2.5 w-2.5" />
                        {b.expenseTransactionTotalPaid?.toLocaleString() || "0"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[8px] font-black  uppercase tracking-widest opacity-40 mb-0.5">
                        Active Balance
                      </p>
                      <p
                        className={`text-sm font-black tabular-nums transition-colors ${balance < 0 ? "text-rose-500" : "text-primary"
                          }`}
                      >
                        ${balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black  uppercase tracking-widest opacity-40">
                        Modified
                      </p>
                      <p className="text-[9px] font-bold text-foreground/80">
                        {b.lastModifiedDate
                          ? new Date(b.lastModifiedDate).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="border border-slate-200 dark:border-white/10 rounded-[2rem] bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/10">
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-foreground/90 dark:text-white">
                Manage
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-foreground/90 dark:text-white">
                Name
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-foreground/90 dark:text-white">
                Description
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-right text-foreground/90 dark:text-white">
                Amount
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-right text-foreground/90 dark:text-white">
                Paid
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-right text-foreground/90 dark:text-white">
                Appr. Not Paid
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-right text-foreground/90 dark:text-white">
                Approved
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-right text-foreground/90 dark:text-white">
                Balance
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-foreground/90 dark:text-white">
                Budget Type
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-foreground/90 dark:text-white">
                Created By
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-foreground/90 dark:text-white">
                Created On
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-foreground/90 dark:text-white">
                Last Modify By
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4 h-auto text-foreground/90 dark:text-white">
                Last Modify On
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((b) => {
              const balance = (b.amount || 0) - (b.expenseTransactionTotalPaid || 0);
              return (
                <TableRow
                  key={b.budgetId}
                  className="transition-colors border-border/5 group cursor-pointer hover:bg-white/5"
                  onClick={() => onSelect(b)}
                >
                  <TableCell className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-xl border-emerald-500/20 cursor-pointer hover:bg-emerald-500 transition-all font-black"
                        onClick={() => onEdit(b)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-xl cursor-pointer bg-card/50 border-rose-500/20 text-rose-500 hover:bg-rose-500 transition-all font-black"
                        onClick={() => onDelete(b.budgetId!)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-xs font-semibold text-foreground group-hover:underline tracking-tight">
                      {b.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 max-w-[200px] truncate">
                    <span className="text-xs font-normal text-muted-foreground/70">
                      {b.description || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span className="text-xs font-medium text-foreground tabular-nums">
                      ${b.amount?.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span className="text-xs font-medium text-foreground tabular-nums">
                      ${b.expenseTransactionTotalPaid?.toLocaleString() || "0"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span className="text-xs font-medium text-foreground/80 tabular-nums">
                      ${b.expenseTransactionTotalApprovedNotPaid?.toLocaleString() || "0"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span className="text-xs font-medium text-foreground/80 tabular-nums">
                      ${b.expenseTransactionTotalApproved?.toLocaleString() || "0"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span
                      className={`text-xs font-medium tabular-nums ${balance < 0 ? "text-rose-400 font-semibold" : "text-foreground"
                        }`}
                    >
                      ${balance.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-medium px-2 py-0 h-5 bg-card border-none opacity-80 shadow-sm"
                    >
                      {b.expenseCategoryName || "GENERAL"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-[10px] font-bold text-foreground/80 group-hover:text-foreground transition-colors">
                      {b.createdBy || "System"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-[10px] font-bold text-foreground/60 tabular-nums">
                      {b.createdDate ? new Date(b.createdDate).toLocaleDateString() : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-[10px] font-bold text-foreground/80 group-hover:text-foreground transition-colors">
                      {b.lastModifiedBy || "System"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-[10px] font-bold text-foreground/60 tabular-nums">
                      {b.lastModifiedDate
                        ? new Date(b.lastModifiedDate).toLocaleDateString()
                        : "Never"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
