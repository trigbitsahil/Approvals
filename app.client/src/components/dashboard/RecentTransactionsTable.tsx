import React, { useState, useMemo } from "react";
import { BankTransactionListVM } from "@/api/models/BankTransactionListVM";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface RecentTransactionsTableProps {
    transactions: BankTransactionListVM[];
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({ transactions }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof BankTransactionListVM | 'date'; direction: 'asc' | 'desc' | null }>({
        key: 'date',
        direction: 'desc'
    });

    const handleSort = (key: keyof BankTransactionListVM | 'date') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />;
    };

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];

        // Search
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            result = result.filter(t => 
                (t.bankName || "").toLowerCase().includes(lowercasedTerm) ||
                (t.transactionType || "").toLowerCase().includes(lowercasedTerm)
            );
        }

        // Sort
        if (sortConfig.key && sortConfig.direction) {
            result.sort((a: any, b: any) => {
                let aVal = sortConfig.key === 'date' ? new Date(a.createdDate || 0).getTime() : a[sortConfig.key];
                let bVal = sortConfig.key === 'date' ? new Date(b.createdDate || 0).getTime() : b[sortConfig.key];
                
                if (aVal == null) aVal = "";
                if (bVal == null) bVal = "";

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [transactions, searchTerm, sortConfig]);

    return (
        <div className="bg-white dark:bg-card/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm dark:shadow-none">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Recent Transactions</h2>

                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input 
                        placeholder="Search bank or type..." 
                        className="pl-9 h-9 text-xs bg-black/5 dark:bg-white/5 border-transparent focus-visible:ring-primary/20 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-slate-300 dark:border-white/5">
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-6 py-4 cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('date')}>
                                <div className="flex items-center">Date {getSortIcon('date')}</div>
                            </TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-6 py-4 cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('bankName')}>
                                <div className="flex items-center">Bank {getSortIcon('bankName')}</div>
                            </TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-6 py-4 cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('transactionType')}>
                                <div className="flex items-center">Type {getSortIcon('transactionType')}</div>
                            </TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-6 py-4 text-right cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('deposit')}>
                                <div className="flex items-center justify-end">Credit {getSortIcon('deposit')}</div>
                            </TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-6 py-4 text-right cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('withdrawal')}>
                                <div className="flex items-center justify-end">Debit {getSortIcon('withdrawal')}</div>
                            </TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider px-6 py-4 text-right cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('runningBalance')}>
                                <div className="flex items-center justify-end">Balance {getSortIcon('runningBalance')}</div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <p className="text-sm font-medium text-muted-foreground">No transactions found</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedTransactions.map((t, index) => (
                                <TableRow key={`${t.transactionId}-${t.bankName || index}-${t.transactionType || index}`} className="transition-colors border-b border-slate-300 dark:border-white/5 group hover:bg-slate-50/50 dark:hover:bg-white/5">
                                    
                                    <TableCell className="px-6 py-4 text-sm font-medium text-muted-foreground tabular-nums">
                                        {t.createdDate ? format(parseISO(t.createdDate), "dd MMM yyyy, HH:mm") : "N/A"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm font-medium text-foreground">
                                        {t.bankName || "N/A"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge variant="outline" className={`rounded-full border-none font-semibold text-[10px] uppercase px-3 py-1 ${t.transactionType === 'Credit' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : t.transactionType === 'Debit' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-primary/10 text-primary'}`}>
                                            {t.transactionType || "Unknown"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right text-xs font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                                        {(t.deposit && t.deposit > 0) ? `₹${t.deposit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "-"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right text-xs font-black tabular-nums text-rose-600 dark:text-rose-400">
                                        {(t.withdrawal && t.withdrawal > 0) ? `₹${t.withdrawal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "-"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right text-xs font-black tabular-nums text-slate-700 dark:text-slate-300">
                                        ₹{t.runningBalance?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
