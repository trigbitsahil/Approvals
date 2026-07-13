"use client";

import { History } from "lucide-react";
import type { BudgetListVM } from "@/api/models/BudgetListVM";

interface BudgetSummaryProps {
  budgets: BudgetListVM[];
}

export function BudgetSummary({ budgets }: BudgetSummaryProps) {
  const totalAmount = budgets.reduce((acc, b) => acc + (b.amount || 0), 0);
  const totalPaid = budgets.reduce((acc, b) => acc + (b.expenseTransactionTotalPaid || 0), 0);

  return (
    <div className="pt-10 flex flex-col sm:flex-row border-t border-border/30 justify-between items-start sm:items-center gap-8 transition-opacity">
      <div className="grid grid-cols-2 sm:flex sm:gap-10 gap-6 w-full sm:w-auto">
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Cumulative Capital
          </p>
          <p className="text-sm font-black text-foreground tabular-nums">
            ${totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Total Paid Out
          </p>
          <p className="text-sm font-black text-foreground tabular-nums text-amber-500/80">
            ${totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Allocation Clusters
          </p>
          <p className="text-sm font-black text-foreground tabular-nums">
            {budgets.length} NODES
          </p>
        </div>
      </div>

    </div>
  );
}
