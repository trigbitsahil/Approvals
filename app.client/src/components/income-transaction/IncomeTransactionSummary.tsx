"use client";

import { Info } from "lucide-react";
import type { IncomeTransactionListVM } from "@/api/models/IncomeTransactionListVM";

interface IncomeTransactionSummaryProps {
  transactions: IncomeTransactionListVM[];
}

export function IncomeTransactionSummary({
  transactions,
}: IncomeTransactionSummaryProps) {
  const totalVolume = transactions.reduce(
    (acc, t) => acc + (t.incomeAmount || 0),
    0
  );

  return (
    <div className="pt-10 flex flex-col sm:flex-row border-t border-border/30 justify-between items-start sm:items-center gap-8 transition-opacity">
      <div className="flex gap-10">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Total Ledger Volume
          </p>
          <p className="text-sm font-black text-foreground tabular-nums">
            ${totalVolume.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Entry Count
          </p>
          <p className="text-sm font-black text-foreground tabular-nums">
            {transactions.length} RECS
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 w-full sm:w-auto justify-end">
        <Info className="h-3 w-3 text-muted-foreground" />
        <p className="text-[9px] font-bold text-muted-foreground italic uppercase">
          End of secure transaction log
        </p>
      </div>
    </div>
  );
}
