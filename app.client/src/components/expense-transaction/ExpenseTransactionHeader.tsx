"use client";

import { Search, LayoutGrid, List, PlusCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpenseTransactionHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  onAddTransaction: () => void;
}

export function ExpenseTransactionHeader({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onAddTransaction,
}: ExpenseTransactionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text uppercase">
            Expense Transaction
          </h1>
        </div>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">
          Manage operational capital flows.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
        <div className="relative flex-1 md:w-64 group order-2 sm:order-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 group-focus-within:text-primary transition-colors pointer-events-none z-10" />
          <Input
            placeholder="Search history..."
            className="pl-9 h-11 bg-card/30 border-border/40 focus:border-primary/50 rounded-2xl transition-all shadow-sm backdrop-blur-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2.5 order-1 sm:order-2">
          <div className="flex items-center bg-card/30 border border-border/30 rounded-2xl p-1 gap-1 shadow-sm backdrop-blur-md h-11">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all h-8 w-8 flex items-center justify-center ${viewMode === "grid"
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "text-muted-foreground hover:bg-muted/50"
                }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all h-8 w-8 flex items-center justify-center ${viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "text-muted-foreground hover:bg-muted/50"
                }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={onAddTransaction}
            className="flex-1 sm:flex-none gap-2 rounded-2xl h-11 px-6 text-xs font-black uppercase tracking-wider bg-primary shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-primary/30 active:scale-95 group whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Add Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}
