import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import { BankService } from "@/api/services/BankService";
import type { BankTransactionListVM } from "@/api/models/BankTransactionListVM";
import type { BankListVM } from "@/api/models/BankListVM";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Filter, X, TrendingUp, TrendingDown, Calendar, Building2, ChevronRight, ChevronLeft, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortColumn = 'bankName' | 'transactionType' | 'deposit' | 'withdrawal' | 'runningBalance' | 'createdDate';
type SortDirection = 'asc' | 'desc';

export const BankTransactionList = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<BankTransactionListVM[]>([]);
    const [banksList, setBanksList] = useState<BankListVM[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [filterBankId, setFilterBankId] = useState<string>("all");
    const [filterStartDate, setFilterStartDate] = useState<string>("");
    const [filterEndDate, setFilterEndDate] = useState<string>("");
    const [activeTypeFilter, setActiveTypeFilter] = useState<"all" | "deposit" | "withdrawal">("all");

    // Pagination & Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: SortColumn; direction: SortDirection } | null>({ key: 'createdDate', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [searchClickCount, setSearchClickCount] = useState(0);
    const searchClickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [password, setPassword] = useState("");
    const isUnlocked = !!sessionStorage.getItem('view_password');
    const formatAmount = (amt: number) => isUnlocked ? amt : amt / 1000;

    const fetchTransactions = useCallback(async (bankId: string) => {
        setLoading(true);
        try {
            const response = bankId === "all" 
                ? await BankTransactionService.getAllBankTransactions()
                : await BankTransactionService.getBankTransactionsByBankId(bankId);
            
            if (response.success) {
                setTransactions(response.data);
            }
        } catch (error) {
            console.error("Error fetching bank transactions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await BankService.getBanks();
                const resAny = response as any;
                if (resAny.success) {
                    setBanksList(resAny.data);
                }
            } catch (error) {
                console.error("Error fetching banks:", error);
            }
        };

        fetchBanks();
        fetchTransactions(filterBankId);
    }, [fetchTransactions]);

    const handleBankFilterChange = (val: string) => {
        setFilterBankId(val);
        fetchTransactions(val);
        setCurrentPage(1); // Reset page on filter change
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            if (activeTypeFilter === "deposit" && (!tx.deposit || tx.deposit <= 0)) return false;
            if (activeTypeFilter === "withdrawal" && (!tx.withdrawal || tx.withdrawal <= 0)) return false;

            if (tx.createdDate) {
                const txDate = new Date(tx.createdDate).getTime();
                
                if (filterStartDate) {
                    const start = new Date(filterStartDate).getTime();
                    if (txDate < start) return false;
                }

                if (filterEndDate) {
                    const end = new Date(filterEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (txDate > end.getTime()) return false;
                }
            }

            return true;
        });
    }, [transactions, filterStartDate, filterEndDate, activeTypeFilter]);

    const sortedTransactions = useMemo(() => {
        let sortableItems = [...filteredTransactions];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key] as any;
                let bValue = b[sortConfig.key] as any;
                
                if (sortConfig.key === 'createdDate') {
                    aValue = aValue ? new Date(aValue).getTime() : 0;
                    bValue = bValue ? new Date(bValue).getTime() : 0;
                }
                
                // Fallback to empty string for safety on text fields
                if (aValue === null || aValue === undefined) aValue = "";
                if (bValue === null || bValue === undefined) bValue = "";

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredTransactions, sortConfig]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedTransactions.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedTransactions, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage);

    const requestSort = (key: SortColumn) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName: SortColumn) => {
        if (!sortConfig || sortConfig.key !== columnName) {
            return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />;
        }
        return sortConfig.direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
    };

    const clearFilters = () => {
        setFilterStartDate("");
        setFilterEndDate("");
        if (filterBankId !== "all") {
            setFilterBankId("all");
            fetchTransactions("all");
        }
        setCurrentPage(1);
    };

    const hasActiveFilters = filterBankId !== "all" || filterStartDate || filterEndDate;
    const totalDeposits = filteredTransactions.reduce((sum, tx) => sum + tx.deposit, 0);
    const totalWithdrawals = filteredTransactions.reduce((sum, tx) => sum + tx.withdrawal, 0);

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-muted rounded-lg">
                        <Building2 className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Bank Transactions</h1>
                        <p className="text-sm text-muted-foreground mt-1">Track and manage all your bank account transactions</p>
                    </div>
                </div>
            </div>

            <Card className="shadow-lg border-border">
                {/* Filters Section */}
                <div className="border-b border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter 
                            className="h-4 w-4 text-muted-foreground  transition-colors " 
                            onClick={() => {
                                const currentlyUnlocked = !!sessionStorage.getItem('view_password');
                                if (currentlyUnlocked) {
                                    sessionStorage.removeItem('view_password');
                                    window.location.reload();
                                } else {
                                    setSearchClickCount(prev => {
                                        const newCount = prev + 1;
                                        if (newCount >= 4) {
                                            setPassword("");
                                            setIsUnlockOpen(true);
                                            return 0;
                                        }
                                        return newCount;
                                    });
                                    if (searchClickTimeoutRef.current) {
                                        clearTimeout(searchClickTimeoutRef.current);
                                    }
                                    searchClickTimeoutRef.current = setTimeout(() => {
                                        setSearchClickCount(0);
                                    }, 2000);
                                }
                            }}
                        />
                        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                        {hasActiveFilters && (
                            <span className="ml-auto text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">
                                Active
                            </span>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap items-end gap-3 md:gap-4">
                        <div className="flex flex-col gap-2 flex-1 min-w-[130px]">
                            <label className="text-xs font-semibold text-foreground">Bank Account</label>
                            <Select value={filterBankId} onValueChange={handleBankFilterChange}>
                                <SelectTrigger className="h-9 bg-muted border-border text-foreground">
                                    <SelectValue placeholder="All Banks" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Banks</SelectItem>
                                    {banksList.map(bank => (
                                        <SelectItem key={bank.bankId} value={bank.bankId!}>{bank.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2 flex-1 min-w-[130px]">
                            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                                Start Date
                            </label>
                            <DatePickerInput 
                                value={filterStartDate} 
                                onChange={(val) => { setFilterStartDate(val); setCurrentPage(1); }}
                                className="h-9 bg-muted border-border text-foreground"
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1 min-w-[130px]">
                            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                                End Date
                            </label>
                            <DatePickerInput 
                                value={filterEndDate} 
                                onChange={(val) => { setFilterEndDate(val); setCurrentPage(1); }}
                                className="h-9 bg-muted border-border text-foreground"
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-none w-full sm:w-auto">
                            <Button 
                                variant="outline" 
                                className="h-9 border-border text-foreground hover:bg-muted gap-2 whitespace-nowrap w-full"
                                onClick={clearFilters}
                                disabled={!hasActiveFilters}
                            >
                                <X className="h-3.5 w-3.5" /> Clear
                            </Button>
                        </div>
                    </div>
                </div>

                {filteredTransactions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-6 border-b border-border bg-muted/20">
                        <div 
                            className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${activeTypeFilter === "deposit" ? "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-card border-border"}`}
                            onClick={() => setActiveTypeFilter(prev => prev === "deposit" ? "all" : "deposit")}
                        >
                            <div className="p-3 bg-green-100/50 dark:bg-green-500/10 rounded-xl">
                                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Deposits</p>
                                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-0.5">₹{formatAmount(totalDeposits).toFixed(2)}</p>
                            </div>
                        </div>
                        <div 
                            className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${activeTypeFilter === "withdrawal" ? "bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-card border-border"}`}
                            onClick={() => setActiveTypeFilter(prev => prev === "withdrawal" ? "all" : "withdrawal")}
                        >
                            <div className="p-3 bg-red-100/50 dark:bg-red-500/10 rounded-xl">
                                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Withdrawals</p>
                                <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-0.5">₹{formatAmount(totalWithdrawals).toFixed(2)}</p>
                            </div>
                        </div>
                        <div 
                            className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${activeTypeFilter === "all" ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-card border-border"}`}
                            onClick={() => setActiveTypeFilter("all")}
                        >
                            <div className="p-3 bg-blue-100/50 dark:bg-blue-500/10 rounded-xl">
                                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Records</p>
                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{filteredTransactions.length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <CardContent className="p-0 flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <Table className="min-w-[800px]">
                            <TableHeader className="bg-muted/30 border-b border-border">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="font-semibold text-foreground cursor-pointer hover:bg-muted/50" onClick={() => requestSort('bankName')}>
                                        <div className="flex items-center gap-1">Bank Name {getSortIcon('bankName')}</div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground cursor-pointer hover:bg-muted/50" onClick={() => requestSort('transactionType')}>
                                        <div className="flex items-center gap-1">Type {getSortIcon('transactionType')}</div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground cursor-pointer hover:bg-muted/50" onClick={() => requestSort('deposit')}>
                                        <div className="flex items-center justify-end gap-1">Deposit {getSortIcon('deposit')}</div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground cursor-pointer hover:bg-muted/50" onClick={() => requestSort('withdrawal')}>
                                        <div className="flex items-center justify-end gap-1">Withdrawal {getSortIcon('withdrawal')}</div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground cursor-pointer hover:bg-muted/50" onClick={() => requestSort('runningBalance')}>
                                        <div className="flex items-center justify-end gap-1">Running Balance {getSortIcon('runningBalance')}</div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground cursor-pointer hover:bg-muted/50" onClick={() => requestSort('createdDate')}>
                                        <div className="flex items-center gap-1">Date {getSortIcon('createdDate')}</div>
                                    </TableHead>
                                    <TableHead className="w-8"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                                                <p className="text-sm text-muted-foreground">Loading transactions...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedTransactions.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Building2 className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-foreground">No transactions found</p>
                                                <p className="text-xs text-muted-foreground">Try adjusting your filters or check back later</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedTransactions.map((tx, index) => (
                                        <TableRow 
                                            key={`${tx.transactionId}-${index}`}
                                            className="hover:bg-muted/40 transition-colors border-border cursor-pointer group"
                                            onClick={() => {
                                                if (tx.approvalId) {
                                                    navigate(`/approvals/${tx.approvalId}`);
                                                }
                                            }}
                                        >
                                            <TableCell className="font-medium text-foreground">{tx.bankName || "Unknown Bank"}</TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                                                    tx.transactionType === 'Credit' 
                                                        ? 'bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                                                        : 'bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                }`}>
                                                    {tx.transactionType === 'Credit' ? (
                                                        <TrendingUp className="h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" />
                                                    )}
                                                    {tx.transactionType}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                    {tx.deposit > 0 ? `+₹${formatAmount(tx.deposit).toFixed(2)}` : "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-semibold text-red-600 dark:text-red-400">
                                                    {tx.withdrawal > 0 ? `-₹${formatAmount(tx.withdrawal).toFixed(2)}` : "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-foreground">
                                                ₹{formatAmount(tx.runningBalance).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                {tx.createdDate ? format(new Date(tx.createdDate), "MMM dd, yyyy") : "-"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="h-4 w-4" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border bg-card/50">
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Rows per page:</span>
                            <Select 
                                value={rowsPerPage.toString()} 
                                onValueChange={(val) => { 
                                    setRowsPerPage(Number(val)); 
                                    setCurrentPage(1); 
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px] bg-background border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-sm font-medium text-muted-foreground">
                                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-1">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 border-border hover:bg-muted" 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                    disabled={currentPage === 1 || totalPages === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 border-border hover:bg-muted" 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isUnlockOpen} onOpenChange={setIsUnlockOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Unlock View</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                        <Input 
                            type="password"
                            placeholder="Enter secure password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (password) {
                                        sessionStorage.setItem('view_password', password);
                                        setIsUnlockOpen(false);
                                        window.location.reload();
                                    }
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUnlockOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            if (password) {
                                sessionStorage.setItem('view_password', password);
                                setIsUnlockOpen(false);
                                window.location.reload();
                            }
                        }}>Unlock</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};