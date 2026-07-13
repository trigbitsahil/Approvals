"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, ArrowUpRight, ArrowDownRight, Search, FileSpreadsheet, Scale } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Services
import { IncomeTransactionService } from "@/api/services/IncomeTransactionService";
import { ExpenseTransactionService } from "@/api/services/ExpenseTransactionService";

interface LedgerEntry {
  id: string;
  date: string;
  name: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  typeName?: string;
}

export default function LedgerPage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const loadLedger = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        IncomeTransactionService.getApiVIncomeTransaction2("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
        ExpenseTransactionService.getApiVExpenseTransaction2("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
      ]);

      const formattedIncome: LedgerEntry[] = (incomeRes.data || []).map((t: any) => ({
        id: t.incomeTransactionID || t.incomeTransactionId || "",
        date: t.dateOfIncome || t.createdDate,
        name: t.name || "",
        description: t.description || "",
        amount: Number(t.incomeAmount || 0),
        type: "income",
        typeName: t.incomeTypeName || "Income",
      }));

      const formattedExpense: LedgerEntry[] = (expenseRes.data || []).map((t: any) => ({
        id: t.expenseTransactionID || t.expenseTransactionId || "",
        date: t.dateOfExpense || t.createdDate,
        name: t.name || "",
        description: t.description || "",
        amount: Number(t.expenseAmount || 0),
        type: "expense",
        typeName: t.expenseTypeName || "Expense",
      }));

      // Sort oldest first to calculate running balance
      const sortedAsc = [...formattedIncome, ...formattedExpense].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      let balance = 0;
      const combinedWithBalance = sortedAsc.map((e) => {
        balance += e.type === "income" ? e.amount : -e.amount;
        return { ...e, runningBalance: balance };
      });

      // Sort newest first for rendering
      const combined = combinedWithBalance.reverse();

      setEntries(combined);
    } catch (err) {
      console.error("Failed to load ledger data:", err);
      toast.error("Failed to load project ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, [projectId]);

  // --- Statistics Calculations ---
  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const filteredEntries = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.typeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          Balancing Ledger Books...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            PROJECT LEDGER
          </h1>
          <p className="text-sm text-muted-foreground">
            A combined record of all income and expenses for this project.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search ledger entries..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Revenue (Income)
            </CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-500">
              ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Expenses
            </CardTitle>
            <div className="bg-rose-500/10 p-2 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-rose-500">
              ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 shadow-sm ${netBalance >= 0 ? "border-l-primary" : "border-l-amber-500"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Net Balance
            </CardTitle>
            <div className={`p-2 rounded-full ${netBalance >= 0 ? "bg-primary/10" : "bg-amber-500/10"}`}>
              <Scale className={`h-4 w-4 ${netBalance >= 0 ? "text-primary" : "text-amber-500"}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-black ${netBalance >= 0 ? "text-primary" : "text-amber-500"}`}>
              ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] font-bold">DATE</TableHead>
                <TableHead className="font-bold">NAME</TableHead>
                <TableHead className="w-[150px] font-bold">TYPE</TableHead>
                <TableHead className="font-bold">DESCRIPTION</TableHead>
                <TableHead className="text-right w-[150px] font-bold">AMOUNT</TableHead>
                <TableHead className="text-right w-[180px] font-bold">RUNNING BALANCE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No transactions found in this project.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((e) => (
                  <TableRow key={e.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-xs">
                      {new Date(e.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold">{e.name}</TableCell>
                    <TableCell>
                      <Badge variant={e.type === "income" ? "default" : "secondary"} className="uppercase text-[9px] font-bold">
                        {e.type}
                      </Badge>
                      {e.typeName && (
                        <span className="text-[10px] text-muted-foreground ml-2 block sm:inline">
                          ({e.typeName})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{e.description || "-"}</TableCell>
                    <TableCell className={`text-right font-black ${e.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                      {e.type === "income" ? "+" : "-"}${e.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-black ${(e as any).runningBalance >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      ${(e as any).runningBalance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
