import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import { BankService } from "@/api/services/BankService";
import { UserService } from "@/api/services/UserService";
import type { BankTransactionListVM } from "@/api/models/BankTransactionListVM";
import type { BankListVM } from "@/api/models/BankListVM";
import type { CombinedBankTransactionVM } from "@/api/models/CombinedBankTransactionVM";
import type { PendingBankTransactionVM } from "@/api/models/PendingBankTransactionVM";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Filter, X, TrendingUp, TrendingDown, Calendar, Building2, ChevronRight, ChevronLeft, ArrowUpDown, ArrowUp, ArrowDown, ArrowRightLeft, CheckCircle2, Clock, Loader2, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { OpenAPI } from "@/api/core/OpenAPI";
import { getAccessToken } from "@/utils/authToken";
import { useDataTable } from "@/hooks/useDataTable";
import { SortableHead, DataTablePagination } from "@/components/common";

export const BankTransactionList = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<BankTransactionListVM[]>([]);
    const [combinedTransactions, setCombinedTransactions] = useState<CombinedBankTransactionVM[]>([]);
    const [banksList, setBanksList] = useState<BankListVM[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCombined, setLoadingCombined] = useState(true);

    // Pending Transactions State
    const [pendingTransactions, setPendingTransactions] = useState<PendingBankTransactionVM[]>([]);
    const [loadingPending, setLoadingPending] = useState(true);
    const [pendingApprovalTypeFilter, setPendingApprovalTypeFilter] = useState<string>("all");
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string } | null>(null);

    const getTypeBadgeClass = (type?: string) => {
        if (!type) return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700";
        const lower = type.toLowerCase();
        if (lower.includes("expense")) {
            return "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30";
        }
        if (lower.includes("receipt")) {
            return "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30";
        }
        if (lower.includes("refund")) {
            return "bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-500/30";
        }
        if (lower.includes("bank") || lower.includes("transfer")) {
            return "bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-500/30";
        }
        if (lower.includes("convert") || lower.includes("finalize")) {
            return "bg-purple-500/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/30";
        }
        if (lower.includes("initial")) {
            return "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30";
        }
        if (lower.includes("officenote") || lower.includes("note")) {
            return "bg-orange-500/15 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border border-orange-500/30";
        }
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700";
    };

    useEffect(() => {
        UserService.getLoggedInUser("1")
            .then((res) => {
                if (res.success && res.data) {
                    setCurrentUser({
                        id: res.data.id,
                        email: res.data.email,
                    });
                }
            })
            .catch((err) => console.error("Failed to load logged-in user details:", err));
    }, []);

    const fetchPendingTransactions = useCallback(async (typeFilter?: string) => {
        setLoadingPending(true);
        try {
            const response = await BankTransactionService.getPendingBankTransactions(typeFilter !== undefined ? typeFilter : pendingApprovalTypeFilter);
            if (response.success) {
                setPendingTransactions(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching pending bank transactions:", error);
        } finally {
            setLoadingPending(false);
        }
    }, [pendingApprovalTypeFilter]);

    useEffect(() => {
        fetchPendingTransactions(pendingApprovalTypeFilter);
    }, [pendingApprovalTypeFilter]);

    const handlePayDistributor = async (transactionId: string) => {
        setActionLoadingId(transactionId);
        try {
            const res = await BankTransactionService.payDistributor(transactionId);
            if (res.success) {
                toast.success(res.message || "Paid to distributor successfully.");
                fetchPendingTransactions();
                fetchCombinedTransactions();
                if (filterBankId) fetchTransactions(filterBankId);
            } else {
                toast.error(res.message || "Failed to mark paid to distributor.");
            }
        } catch (err: any) {
            toast.error(err?.message || "An error occurred.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleConfirmTransaction = async (transactionId: string) => {
        setActionLoadingId(transactionId);
        try {
            const res = await BankTransactionService.confirmTransaction(transactionId);
            if (res.success) {
                toast.success(res.message || "Transaction confirmed successfully.");
                fetchPendingTransactions();
                fetchCombinedTransactions();
                if (filterBankId) fetchTransactions(filterBankId);
            } else {
                toast.error(res.message || "Failed to confirm transaction.");
            }
        } catch (err: any) {
            toast.error(err?.message || "An error occurred.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const isAuthorizedConfirmUser = useMemo(() => {
        if (!currentUser?.email) return false;
        const emailLower = currentUser.email.trim().toLowerCase();
        const allowedEmails = [
            "sanny.panesar@gmail.com",
            "shahid.hakim@gmail.com",
            "sumaiya.shaikh@wallop.in",
            "shahid.hakim@wallop.in",
            
        ];
        return allowedEmails.includes(emailLower);
    }, [currentUser]);


    // Filters State - Bank Tab
    const [filterBankId, setFilterBankId] = useState<string>("all");
    const [bankFilterStartDate, setBankFilterStartDate] = useState<string>("");
    const [bankFilterEndDate, setBankFilterEndDate] = useState<string>("");
    const [activeTypeFilter, setActiveTypeFilter] = useState<"all" | "deposit" | "withdrawal">("all");

    // Filters State - All Tab
    const [allFilterStartDate, setAllFilterStartDate] = useState<string>("");
    const [allFilterEndDate, setAllFilterEndDate] = useState<string>("");
    const [allTypeFilter, setAllTypeFilter] = useState<string>("all");

    const [searchClickCount, setSearchClickCount] = useState(0);
    const searchClickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [searchParams] = useSearchParams();
    const queryTab = searchParams.get("tab");
    const queryTxId = searchParams.get("txId");
    const queryApprovalId = searchParams.get("approvalId");

    const [activeTab, setActiveTab] = useState<string>(queryTab || "bank");
    const [highlightedId, setHighlightedId] = useState<string | null>(queryTxId || queryApprovalId || null);

    useEffect(() => {
        if (queryTab) {
            setActiveTab(queryTab);
        }
        if (queryTxId || queryApprovalId) {
            setHighlightedId(queryTxId || queryApprovalId);
        }
    }, [queryTab, queryTxId, queryApprovalId]);

    useEffect(() => {
        if (highlightedId) {
            const timer = setTimeout(() => {
                setHighlightedId(null);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [highlightedId]);

    const isUnlocked = !!sessionStorage.getItem('view_password');
    const formatAmount = (amt: number) => isUnlocked ? amt : amt / 1000;
    const getDisplayApprovalName = (name?: string, reference?: string, approvalId?: string) => {
        if (isUnlocked) {
            return name || reference || "-";
        }
        return reference || "-";
    };

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
                    if (resAny.data.length > 0) {
                        setFilterBankId(resAny.data[0].bankId);
                        fetchTransactions(resAny.data[0].bankId);
                    }
                }
            } catch (error) {
                console.error("Error fetching banks:", error);
            }
        };

        fetchBanks();
    }, [fetchTransactions]);

    const fetchCombinedTransactions = useCallback(async (typeFilter?: string) => {
        setLoadingCombined(true);
        try {
            const response = await BankTransactionService.getCombinedBankTransactions(typeFilter !== undefined ? typeFilter : allTypeFilter);
            if (response.success) {
                setCombinedTransactions(response.data);
            }
        } catch (error) {
            console.error("Error fetching combined bank transactions:", error);
        } finally {
            setLoadingCombined(false);
        }
    }, [allTypeFilter]);

    useEffect(() => {
        fetchCombinedTransactions(allTypeFilter);
    }, [allTypeFilter]);

    const dateFilteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            if (tx.createdDate) {
                const txDate = new Date(tx.createdDate).getTime();
                
                if (bankFilterStartDate) {
                    const start = new Date(bankFilterStartDate).getTime();
                    if (txDate < start) return false;
                }

                if (bankFilterEndDate) {
                    const end = new Date(bankFilterEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (txDate > end.getTime()) return false;
                }
            }

            return true;
        });
    }, [transactions, bankFilterStartDate, bankFilterEndDate]);

    const filteredTransactions = useMemo(() => {
        return dateFilteredTransactions.filter((tx) => {
            if (activeTypeFilter === "deposit" && (!tx.deposit || tx.deposit <= 0)) return false;
            if (activeTypeFilter === "withdrawal" && (!tx.withdrawal || tx.withdrawal <= 0)) return false;
            return true;
        });
    }, [dateFilteredTransactions, activeTypeFilter]);

    const filteredCombinedTransactions = useMemo(() => {
        return combinedTransactions.filter((tx) => {
            if (allTypeFilter !== "all") {
                if (!tx.approvalType || tx.approvalType.toLowerCase() !== allTypeFilter.toLowerCase()) {
                    return false;
                }
            }

            if (tx.completedOn) {
                const txDate = new Date(tx.completedOn).getTime();
                
                if (allFilterStartDate) {
                    const start = new Date(allFilterStartDate).getTime();
                    if (txDate < start) return false;
                }

                if (allFilterEndDate) {
                    const end = new Date(allFilterEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (txDate > end.getTime()) return false;
                }
            }

            return true;
        });
    }, [combinedTransactions, allFilterStartDate, allFilterEndDate, allTypeFilter]);

    const filteredPendingTransactions = useMemo(() => {
        return pendingTransactions.filter((tx) => {
            if (tx.createdDate) {
                const txDate = new Date(tx.createdDate).getTime();
                
                if (allFilterStartDate) {
                    const start = new Date(allFilterStartDate).getTime();
                    if (txDate < start) return false;
                }

                if (allFilterEndDate) {
                    const end = new Date(allFilterEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (txDate > end.getTime()) return false;
                }
            }
            return true;
        });
    }, [pendingTransactions, allFilterStartDate, allFilterEndDate]);

    // Data Table Hooks for Bank, Pending, and All Tabs
    const bankTable = useDataTable({
        data: filteredTransactions,
        initialSortField: "createdDate",
        initialSortOrder: "desc",
        initialPageSize: 10,
        customValueGetters: {
            approvalName: (tx) => getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId),
            bankName: (tx) => tx.bankName || "Unknown Bank",
            transactionType: (tx) => tx.transactionType || "",
            deposit: (tx) => tx.deposit || 0,
            withdrawal: (tx) => tx.withdrawal || 0,
            runningBalance: (tx) => tx.runningBalance || 0,
            createdDate: (tx) => tx.createdDate ? new Date(tx.createdDate).getTime() : 0,
        },
    });

    const pendingTable = useDataTable({
        data: filteredPendingTransactions,
        initialSortField: "createdDate",
        initialSortOrder: "desc",
        initialPageSize: 10,
        customValueGetters: {
            approvalName: (tx) => getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId),
            approvalType: (tx) => tx.approvalType || "Approval",
            amount: (tx) => tx.amount || 0,
            fromBankName: (tx) => tx.fromBankName || tx.toBankName || "",
            distributorName: (tx) => tx.distributorName || "",
            transactionStatus: (tx) => (tx.isPaidToDistributor || tx.derivedStatus === "Paid to Distributor" || tx.isConfirm || tx.derivedStatus === "Completed")
                ? "Paid to Distributor"
                : "Approved",
            currentStatus: (tx) => (tx.isConfirm || tx.derivedStatus === "Completed")
                ? "Completed"
                : (tx.isPaidToDistributor || tx.approvalType === "Receipt" || tx.derivedStatus === "Paid to Distributor")
                ? "Pending Confirmation"
                : "Pending Paid to Distributor",
            status: (tx) => tx.derivedStatus || (tx.isConfirm ? "Completed" : tx.isPaidToDistributor ? "Paid to Distributor" : "Pending"),
            createdDate: (tx) => tx.createdDate ? new Date(tx.createdDate).getTime() : 0,
        },
    });

    const allTable = useDataTable({
        data: filteredCombinedTransactions,
        initialSortField: "completedOn",
        initialSortOrder: "desc",
        initialPageSize: 10,
        customValueGetters: {
            approvalName: (tx) => getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId),
            approvalType: (tx) => tx.approvalType || "",
            amount: (tx) => tx.amount || 0,
            fromBankName: (tx) => tx.fromBankName || "",
            toBankName: (tx) => tx.toBankName || "",
            runningBalanceBank1: (tx) => tx.runningBalanceBank1 ?? -Infinity,
            runningBalanceBank2: (tx) => tx.runningBalanceBank2 ?? -Infinity,
            completedOn: (tx) => tx.completedOn ? new Date(tx.completedOn).getTime() : 0,
        },
    });

    const handleBankFilterChange = (val: string) => {
        setFilterBankId(val);
        fetchTransactions(val);
        bankTable.setPage(1);
    };

    const clearFilters = () => {
        if (activeTab === "bank") {
            setBankFilterStartDate("");
            setBankFilterEndDate("");
            bankTable.setPage(1);
        } else if (activeTab === "pending") {
            setPendingApprovalTypeFilter("all");
            pendingTable.setPage(1);
        } else {
            setAllFilterStartDate("");
            setAllFilterEndDate("");
            setAllTypeFilter("all");
            allTable.setPage(1);
        }
    };

    const hasActiveFilters = activeTab === "bank" 
        ? bankFilterStartDate || bankFilterEndDate 
        : activeTab === "pending"
        ? pendingApprovalTypeFilter !== "all"
        : allFilterStartDate || allFilterEndDate || allTypeFilter !== "all";
    const totalDeposits = dateFilteredTransactions.reduce((sum, tx) => sum + (tx.deposit || 0), 0);
    const totalWithdrawals = dateFilteredTransactions.reduce((sum, tx) => sum + (tx.withdrawal || 0), 0);
    const selectedBank = banksList.find(b => b.bankId === filterBankId);
    const currentRunningBalance = filterBankId !== "all"
        ? (transactions.length > 0 ? (transactions[0].runningBalance || 0) : (selectedBank?.runningBalance || 0))
        : banksList.reduce((sum, b) => sum + (b.runningBalance || 0), 0);

    return (
        <div className="w-full space-y-3">
            {/* Header Section */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-muted rounded-lg">
                        <Building2 className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Bank Transactions</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Track and manage all your bank account transactions</p>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-2.5 bg-transparent p-0 space-x-2 border-b-0 h-auto">
                    <TabsTrigger 
                        value="bank" 
                        className="data-[state=active]:bg-muted data-[state=active]:border-border border border-transparent rounded-full px-3.5 py-1.5 text-xs font-semibold"
                    >
                        By Bank Account
                    </TabsTrigger>
                    <TabsTrigger 
                        value="pending" 
                        className="data-[state=active]:bg-muted data-[state=active]:border-border border border-transparent rounded-full px-3.5 py-1.5 text-xs font-semibold"
                    >
                        Pending Transactions
                    </TabsTrigger>
                    <TabsTrigger 
                        value="all" 
                        className="data-[state=active]:bg-muted data-[state=active]:border-border border border-transparent rounded-full px-3.5 py-1.5 text-xs font-semibold"
                    >
                        All Transactions
                    </TabsTrigger>
                </TabsList>

                
                <Card className="shadow-lg border-border">
                {/* Summary Cards Section (placed above Filters) */}
                {activeTab === "bank" && dateFilteredTransactions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-5 border-b border-border bg-muted/20">
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
                        <div className="flex items-center gap-4 p-4 rounded-xl border shadow-sm bg-card border-border">
                            <div className="p-3 bg-blue-100/90 dark:bg-blue-500/10 rounded-xl">
                                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Running Balance</p>
                                <p className="text-xl font-bold text-blue-500 dark:text-blue-500 mt-0.5">₹{formatAmount(currentRunningBalance).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters Section (below cards) */}
                <div className="border-b border-border bg-card px-4 py-2.5">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter 
                            className="h-4 w-4 text-muted-foreground  transition-colors " 
                            onClick={() => {
                                    setSearchClickCount(prev => {
                                        const newCount = prev + 1;
                                        if (newCount >= 4) {
                                            const currentlyUnlocked = !!sessionStorage.getItem('view_password');
                                            if (currentlyUnlocked) {
                                                sessionStorage.removeItem('view_password');
                                                window.location.reload();
                                            } else {
                                                setPassword("");
                                                setIsUnlockOpen(true);
                                            }
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
                        {activeTab === "bank" && (
                            <div className="flex flex-col gap-2 flex-1 min-w-[130px]">
                                <label className="text-xs font-semibold text-foreground">Bank Account</label>
                                <Select value={filterBankId} onValueChange={handleBankFilterChange}>
                                    <SelectTrigger className="h-9 bg-muted border-border text-foreground">
                                        <SelectValue placeholder="Select a Bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {banksList.map(bank => (
                                            <SelectItem key={bank.bankId} value={bank.bankId!}>{bank.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {activeTab === "pending" && (
                            <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
                                <label className="text-xs font-semibold text-foreground">Approval Type</label>
                                <Select value={pendingApprovalTypeFilter} onValueChange={(val) => setPendingApprovalTypeFilter(val)}>
                                    <SelectTrigger className="h-9 bg-muted border-border text-foreground">
                                        <SelectValue placeholder="All Approval Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Approval Types</SelectItem>
                                        <SelectItem value="Expense">Expense</SelectItem>
                                        <SelectItem value="Receipt">Receipt</SelectItem>
                                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="Convert">Convert</SelectItem>
                                        <SelectItem value="Finalize">Finalize</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {activeTab === "all" && (
                            <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
                                <label className="text-xs font-semibold text-foreground">Approval Type</label>
                                <Select value={allTypeFilter} onValueChange={(val) => setAllTypeFilter(val)}>
                                    <SelectTrigger className="h-9 bg-muted border-border text-foreground">
                                        <SelectValue placeholder="All Approval Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Approval Types</SelectItem>
                                        <SelectItem value="Expense">Expense</SelectItem>
                                        <SelectItem value="Receipt">Receipt</SelectItem>
                                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="Convert">Convert</SelectItem>
                                        <SelectItem value="Finalize">Finalize</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 flex-1 min-w-[130px]">
                            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                                Start Date
                            </label>
                            <DatePickerInput 
                                value={activeTab === "bank" ? bankFilterStartDate : allFilterStartDate} 
                                onChange={(val) => { 
                                    if (activeTab === "bank") {
                                        setBankFilterStartDate(val); 
                                        bankTable.setPage(1);
                                    } else {
                                        setAllFilterStartDate(val); 
                                        allTable.setPage(1);
                                    }
                                }}
                                className="h-9 bg-muted border-border text-foreground"
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1 min-w-[130px]">
                            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                                End Date
                            </label>
                            <DatePickerInput 
                                value={activeTab === "bank" ? bankFilterEndDate : allFilterEndDate} 
                                onChange={(val) => { 
                                    if (activeTab === "bank") {
                                        setBankFilterEndDate(val); 
                                        bankTable.setPage(1);
                                    } else {
                                        setAllFilterEndDate(val); 
                                        allTable.setPage(1);
                                    }
                                }}
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

                {/* Table Section */}
                <TabsContent value="bank" className="mt-0 border-none outline-none">
                <CardContent className="p-0 flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <Table className="min-w-[800px]">
                            <TableHeader className="bg-muted/30 border-b border-border">
                                <TableRow className="hover:bg-transparent border-border">
                                    <SortableHead field="approvalName" currentField={bankTable.sortField} currentOrder={bankTable.sortOrder} onSort={bankTable.handleSort}>
                                        Name
                                    </SortableHead>
                                    <SortableHead field="bankName" currentField={bankTable.sortField} currentOrder={bankTable.sortOrder} onSort={bankTable.handleSort}>
                                        Bank Name
                                    </SortableHead>
                                    <SortableHead field="transactionType" currentField={bankTable.sortField} currentOrder={bankTable.sortOrder} onSort={bankTable.handleSort}>
                                        Type
                                    </SortableHead>
                                    <SortableHead field="deposit" align="right" currentField={bankTable.sortField} currentOrder={bankTable.sortOrder} onSort={bankTable.handleSort}>
                                        Deposit
                                    </SortableHead>
                                    <SortableHead field="withdrawal" align="right" currentField={bankTable.sortField} currentOrder={bankTable.sortOrder} onSort={bankTable.handleSort}>
                                        Withdrawal
                                    </SortableHead>
                                    <SortableHead field="runningBalance" align="right" currentField={bankTable.sortField} currentOrder={bankTable.sortOrder} onSort={bankTable.handleSort}>
                                        Running Balance
                                    </SortableHead>
                                    <SortableHead field="createdDate" currentField={bankTable.sortField} currentOrder={bankTable.sortOrder} onSort={bankTable.handleSort}>
                                        Date
                                    </SortableHead>
                                    <TableHead className="w-8"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                                                <p className="text-sm text-muted-foreground">Loading transactions...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : bankTable.paginatedData.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Building2 className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-foreground">No transactions found</p>
                                                <p className="text-xs text-muted-foreground">Try adjusting your filters or check back later</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bankTable.paginatedData.map((tx, index) => (
                                        <TableRow 
                                            key={`${tx.transactionId}-${index}`}
                                            className="hover:bg-muted/40 transition-colors border-border cursor-pointer group"
                                            onClick={() => {
                                                if (tx.approvalId) {
                                                    navigate(`/approvals/${tx.approvalId}`);
                                                }
                                            }}
                                        >
                                             <TableCell className="font-medium text-foreground max-w-[220px] truncate" title={getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId)}>
                                                 {getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId)}
                                             </TableCell>
                                            <TableCell className="font-medium text-foreground">{tx.bankName || "Unknown Bank"}</TableCell>
                                            <TableCell>
                                                <span className={`w-fit px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 ${
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
                    <DataTablePagination
                        currentPage={bankTable.currentPage}
                        totalPages={bankTable.totalPages}
                        pageSize={bankTable.pageSize}
                        totalItems={bankTable.totalItems}
                        startIndex={bankTable.startIndex}
                        endIndex={bankTable.endIndex}
                        onPageChange={bankTable.setPage}
                        onPageSizeChange={bankTable.setPageSize}
                    />
                </CardContent>
                </TabsContent>

            <TabsContent value="pending" className="mt-0 border-none outline-none">
                <CardContent className="p-0 flex flex-col">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[1050px]">
                            <TableHeader className="bg-muted/30 border-b border-border">
                                <TableRow className="hover:bg-transparent border-border">
                                    <SortableHead field="approvalName" currentField={pendingTable.sortField} currentOrder={pendingTable.sortOrder} onSort={pendingTable.handleSort}>
                                        Approval Name
                                    </SortableHead>
                                    <SortableHead field="approvalType" currentField={pendingTable.sortField} currentOrder={pendingTable.sortOrder} onSort={pendingTable.handleSort}>
                                        Type
                                    </SortableHead>
                                    <SortableHead field="amount" align="right" currentField={pendingTable.sortField} currentOrder={pendingTable.sortOrder} onSort={pendingTable.handleSort}>
                                        Amount
                                    </SortableHead>
                                    <SortableHead field="fromBankName" currentField={pendingTable.sortField} currentOrder={pendingTable.sortOrder} onSort={pendingTable.handleSort}>
                                        Bank
                                    </SortableHead>
                                    <SortableHead field="distributorName" currentField={pendingTable.sortField} currentOrder={pendingTable.sortOrder} onSort={pendingTable.handleSort}>
                                        Distributor
                                    </SortableHead>
                                    <SortableHead field="transactionStatus" currentField={pendingTable.sortField} currentOrder={pendingTable.sortOrder} onSort={pendingTable.handleSort}>
                                        Transaction Status
                                    </SortableHead>
                                    <SortableHead field="currentStatus" currentField={pendingTable.sortField} currentOrder={pendingTable.sortOrder} onSort={pendingTable.handleSort}>
                                        Current Status
                                    </SortableHead>
                                    <SortableHead field="createdDate" currentField={pendingTable.sortField} currentOrder={pendingTable.sortOrder} onSort={pendingTable.handleSort}>
                                        Created Date
                                    </SortableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingPending ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">Loading pending transactions...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : pendingTable.paginatedData.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Clock className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-foreground">No pending transactions</p>
                                                <p className="text-xs text-muted-foreground">All approval transactions are fully completed</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingTable.paginatedData.map((tx) => {
                                        const isPayableByMe = !tx.isPaidToDistributor && tx.approvalType !== "Receipt" && currentUser?.id && currentUser.id === tx.assignedBankUserId;
                                        const isConfirmableByMe = !tx.isConfirm && (tx.isPaidToDistributor || tx.approvalType === "Receipt") && isAuthorizedConfirmUser;
                                        const isHighlighted = highlightedId ? (tx.transactionId === highlightedId || tx.approvalId === highlightedId) : false;

                                        return (
                                            <TableRow 
                                                key={tx.transactionId}
                                                ref={(el) => {
                                                    if (el && isHighlighted) {
                                                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                                                    }
                                                }}
                                                className={`hover:bg-muted/40 transition-all duration-300 border-border cursor-pointer ${
                                                    isHighlighted 
                                                        ? "bg-primary/25 dark:bg-primary/30" 
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    if (tx.approvalId) {
                                                        navigate(`/approvals/${tx.approvalId}`);
                                                    }
                                                }}
                                            >
                                                 <TableCell className="font-medium text-foreground max-w-[220px] truncate" title={getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId)}>
                                                     {getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId)}
                                                 </TableCell>
                                                <TableCell>
                                                    <span className={`w-fit px-2.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 ${getTypeBadgeClass(tx.approvalType)}`}>
                                                        {tx.approvalType || "Approval"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-foreground">
                                                    ₹{formatAmount(tx.amount).toFixed(2)}
                                                </TableCell>
                                                <TableCell>{tx.fromBankName || tx.toBankName || "-"}</TableCell>
                                                <TableCell className="font-medium">{tx.distributorName || "-"}</TableCell>
                                                <TableCell>
                                                    {tx.derivedStatus === "Paid to Distributor" || tx.isPaidToDistributor || tx.derivedStatus === "Completed" || tx.isConfirm ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>Paid to Distributor</span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (tx.distributorId) {
                                                                        navigate(`/distributors/${tx.distributorId}`);
                                                                    } else {
                                                                        navigate('/distributors');
                                                                    }
                                                                }}
                                                                className="ml-0.5 p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800/60 rounded transition-all text-blue-700 dark:text-blue-300 hover:scale-110"
                                                                title="Redirect to Distributor Details"
                                                            >
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </button>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                           Approval Approved
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {tx.derivedStatus === "Completed" || tx.isConfirm ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Completed
                                                        </span>
                                                    ) : (tx.isPaidToDistributor || tx.approvalType === "Receipt" || tx.derivedStatus === "Paid to Distributor") ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Pending Final Confirmation
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Pending Paid to Distributor
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                    {tx.createdDate ? format(new Date(tx.createdDate), "MMM dd, yyyy") : "-"}
                                                </TableCell>
                                                 
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DataTablePagination
                        currentPage={pendingTable.currentPage}
                        totalPages={pendingTable.totalPages}
                        pageSize={pendingTable.pageSize}
                        totalItems={pendingTable.totalItems}
                        startIndex={pendingTable.startIndex}
                        endIndex={pendingTable.endIndex}
                        onPageChange={pendingTable.setPage}
                        onPageSizeChange={pendingTable.setPageSize}
                    />
                </CardContent>
            </TabsContent>

            <TabsContent value="all" className="mt-0 border-none outline-none">
                    <CardContent className="p-0 flex flex-col">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[800px]">
                                <TableHeader className="bg-muted/30 border-b border-border">
                                    <TableRow className="hover:bg-transparent border-border">
                                        <SortableHead field="approvalName" currentField={allTable.sortField} currentOrder={allTable.sortOrder} onSort={allTable.handleSort}>
                                            Approval Name
                                        </SortableHead>
                                        <SortableHead field="approvalType" currentField={allTable.sortField} currentOrder={allTable.sortOrder} onSort={allTable.handleSort}>
                                            Type
                                        </SortableHead>
                                        <SortableHead field="amount" align="right" currentField={allTable.sortField} currentOrder={allTable.sortOrder} onSort={allTable.handleSort}>
                                            Amount
                                        </SortableHead>
                                        <SortableHead field="fromBankName" currentField={allTable.sortField} currentOrder={allTable.sortOrder} onSort={allTable.handleSort}>
                                            From Bank
                                        </SortableHead>
                                        <SortableHead field="toBankName" currentField={allTable.sortField} currentOrder={allTable.sortOrder} onSort={allTable.handleSort}>
                                            To Bank
                                        </SortableHead>
                                        <SortableHead field="runningBalanceBank1" align="right" currentField={allTable.sortField} currentOrder={allTable.sortOrder} onSort={allTable.handleSort}>
                                            Running Bal (From)
                                        </SortableHead>
                                        <SortableHead field="runningBalanceBank2" align="right" currentField={allTable.sortField} currentOrder={allTable.sortOrder} onSort={allTable.handleSort}>
                                            Running Bal (To)
                                        </SortableHead>
                                        <SortableHead field="completedOn" currentField={allTable.sortField} currentOrder={allTable.sortOrder} onSort={allTable.handleSort}>
                                            Completed On
                                        </SortableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingCombined ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                Loading all transactions...
                                            </TableCell>
                                        </TableRow>
                                    ) : allTable.paginatedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                No transactions found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        allTable.paginatedData.map((tx, idx) => (
                                            <TableRow key={idx} className="hover:bg-muted/50">
                                                 <TableCell className="font-medium text-foreground max-w-[220px] truncate" title={getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId)}>
                                                     {getDisplayApprovalName(tx.approvalName, tx.approvalReference, tx.approvalId)}
                                                 </TableCell>
                                                <TableCell>
                                                    {(() => {
                                                        const displayType = tx.approvalType || ((tx.fromBankName && tx.fromBankName !== '-') && (tx.toBankName && tx.toBankName !== '-')
                                                            ? (tx.toBankName.startsWith('Vendor:') ? 'Withdrawal' : (tx.fromBankName.startsWith('Debtor:') ? 'Deposit' : 'Bank Transfer')) 
                                                            : ((tx.toBankName && tx.toBankName !== '-') ? 'Deposit' : 'Withdrawal'));
                                                        
                                                        return (
                                                            <span className={`w-fit px-2.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 ${getTypeBadgeClass(displayType)}`}>
                                                                {displayType}
                                                            </span>
                                                        );
                                                    })()}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">₹{formatAmount(tx.amount).toFixed(2)}</TableCell>
                                                <TableCell>{tx.fromBankName || "-"}</TableCell>
                                                <TableCell>{tx.toBankName || "-"}</TableCell>
                                                <TableCell className="text-right">{tx.runningBalanceBank1 != null ? `₹${formatAmount(tx.runningBalanceBank1).toFixed(2)}` : "-"}</TableCell>
                                                <TableCell className="text-right">{tx.runningBalanceBank2 != null ? `₹${formatAmount(tx.runningBalanceBank2).toFixed(2)}` : "-"}</TableCell>
                                                <TableCell className="whitespace-nowrap">{tx.completedOn ? format(new Date(tx.completedOn), "MMM dd, yyyy") : "-"}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <DataTablePagination
                            currentPage={allTable.currentPage}
                            totalPages={allTable.totalPages}
                            pageSize={allTable.pageSize}
                            totalItems={allTable.totalItems}
                            startIndex={allTable.startIndex}
                            endIndex={allTable.endIndex}
                            onPageChange={allTable.setPage}
                            onPageSizeChange={allTable.setPageSize}
                        />
                    </CardContent>
            </TabsContent>
            </Card>
            </Tabs>

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
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter' && password) {
                                    try {
                                        const res = await fetch(`${OpenAPI.BASE}/api/v1/Account/ValidateViewPassword`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAccessToken()}` },
                                            body: JSON.stringify({ password })
                                        });
                                        if (await res.json()) {
                                            sessionStorage.setItem('view_password', btoa(password));
                                            setIsUnlockOpen(false);
                                            window.location.reload();
                                        } else toast.error("Invalid password!");
                                    } catch { toast.error("Validation failed"); }
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUnlockOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={async () => {
                            if (password) {
                                try {
                                    const res = await fetch(`${OpenAPI.BASE}/api/v1/Account/ValidateViewPassword`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAccessToken()}` },
                                        body: JSON.stringify({ password })
                                    });
                                    if (await res.json()) {
                                        sessionStorage.setItem('view_password', btoa(password));
                                        setIsUnlockOpen(false);
                                        window.location.reload();
                                    } else toast.error("Invalid password!");
                                } catch { toast.error("Validation failed"); }
                            }
                        }}>Unlock</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};