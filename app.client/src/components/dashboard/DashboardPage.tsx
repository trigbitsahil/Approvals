import React, { useEffect, useState } from "react";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import { ApprovalService } from "@/api/services/ApprovalService";
import { VendorService } from "@/api/services/VendorService";
import { DebtorService } from "@/api/services/DebtorService";
import { DistributorService } from "@/api/services/DistributorService";
import { DashboardProcessor, DashboardMetrics } from "./DashboardProcessor";
import { BankTransactionListVM } from "@/api/models/BankTransactionListVM";
import { ApprovalListVM } from "@/api/models/ApprovalListVM";
import { VendorListVM } from "@/api/models/VendorListVM";
import { DebtorListVM } from "@/api/models/DebtorListVM";
import { DistributorListVM } from "@/api/models/DistributorListVM";
import { LayoutDashboard, Loader2, BarChart3, Users, PieChart as PieChartIcon, ReceiptText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardFilters } from "./DashboardFilters";
import { KPIGrid } from "./KPIGrid";
import { TrendChart } from "./TrendChart";
import { BalanceTrendChart } from "./BalanceTrendChart";
import { DistributionCharts } from "./DistributionCharts";
import { EntitiesBreakdown } from "./EntitiesBreakdown";
import { StatusAndTypesCharts } from "./StatusAndTypesCharts";
import { RecentTransactionsTable } from "./RecentTransactionsTable";
import { DashboardApprovalsTable } from "./DashboardApprovalsTable";
import { toast } from "sonner";
import { OpenAPI } from "@/api/core/OpenAPI";
import { getAccessToken } from "@/utils/authToken";

export const DashboardPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>(DashboardProcessor.getDefaultDateRange());
    const [selectedBankId, setSelectedBankId] = useState<string>("all");
    const [selectedApprovalType, setSelectedApprovalType] = useState<string>("all");
    const [selectedVendorId, setSelectedVendorId] = useState<string>("all");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("overview");
    
    // Raw Data State
    const [transactions, setTransactions] = useState<BankTransactionListVM[]>([]);
    const [approvals, setApprovals] = useState<ApprovalListVM[]>([]);
    const [vendors, setVendors] = useState<VendorListVM[]>([]);
    const [debtors, setDebtors] = useState<DebtorListVM[]>([]);
    const [distributors, setDistributors] = useState<DistributorListVM[]>([]);

    const [searchClickCount, setSearchClickCount] = useState(0);
    const searchClickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [transactionsRes, approvalsRes, vendorsRes, debtorsRes, distributorsRes] = await Promise.all([
                    BankTransactionService.getAllBankTransactions(),
                    ApprovalService.getApiVApproval('1', '-', '-'),
                    VendorService.getApiVVendor('1'),
                    DebtorService.getApiVDebtor('1'),
                    DistributorService.getApiVDistributor('1')
                ]);

                const txData = transactionsRes?.data || [];
                const approvalData = approvalsRes?.data || [];
                const vendorData = vendorsRes?.data || [];
                const debtorData = debtorsRes?.data || [];
                const distributorData = distributorsRes?.data || [];

                const isUnlocked = !!sessionStorage.getItem('view_password');
                if (!isUnlocked) {
                    txData.forEach((tx: any) => {
                        tx.amount = tx.amount / 1000;
                        tx.deposit = tx.deposit / 1000;
                        tx.withdrawal = tx.withdrawal / 1000;
                        tx.runningBalance = tx.runningBalance / 1000;
                    });
                    approvalData.forEach((ap: any) => {
                        if (ap.transactionAmount != null) {
                            ap.transactionAmount = ap.transactionAmount / 1000;
                        }
                    });
                }

                setTransactions(txData);
                setApprovals(approvalData);
                setVendors(vendorData);
                setDebtors(debtorData);
                setDistributors(distributorData);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        // Re-calculate metrics whenever filters or raw data change
        if (transactions.length > 0 || approvals.length > 0 || debtors.length > 0 || distributors.length > 0 || vendors.length > 0) {
            const newMetrics = DashboardProcessor.processData(
                transactions, 
                approvals, 
                dateRange, 
                selectedBankId, 
                selectedApprovalType,
                selectedVendorId,
                activeFilter,
                debtors,
                distributors,
                vendors
            );
            setMetrics(newMetrics);
        }
    }, [transactions, approvals, dateRange, selectedBankId, selectedApprovalType, selectedVendorId, activeFilter, debtors, distributors, vendors]);

    let displayTable = null;
    if (metrics) {
        if (activeFilter === 'pendingApprovals') {
            const filteredApprovals = metrics.filteredApprovals.filter(a => (a.approvalStatusName || '').toLowerCase() === 'pending');
            displayTable = <DashboardApprovalsTable approvals={filteredApprovals} title="Pending Approvals" />;
        } else if (activeFilter === 'approvedApprovals') {
            const filteredApprovals = metrics.filteredApprovals.filter(a => (a.approvalStatusName || '').toLowerCase() === 'approved');
            displayTable = <DashboardApprovalsTable approvals={filteredApprovals} title="Approved Approvals" />;
        } else if (activeFilter === 'rejectedApprovals') {
            const filteredApprovals = metrics.filteredApprovals.filter(a => (a.approvalStatusName || '').toLowerCase() === 'rejected');
            displayTable = <DashboardApprovalsTable approvals={filteredApprovals} title="Rejected Approvals" />;
        } else if (activeFilter === 'completedTransactions') {
            displayTable = <RecentTransactionsTable transactions={metrics.recentTransactions} />;
        } else {
            displayTable = <RecentTransactionsTable transactions={metrics.recentTransactions} />;
        }
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            {/* Header & Global Filters */}
            <div className="flex flex-col gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-indigo-500 bg-clip-text text-transparent">
                        Financial Command Center
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <LayoutDashboard 
                            className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
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
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-70">
                            Multi-Dimensional Analytics & Ledger Center
                        </p>
                    </div>
                </div>

                <div className="w-full">
                    <DashboardFilters 
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        selectedBankId={selectedBankId}
                        setSelectedBankId={setSelectedBankId}
                        selectedApprovalType={selectedApprovalType}
                        setSelectedApprovalType={setSelectedApprovalType}
                        selectedVendorId={selectedVendorId}
                        setSelectedVendorId={setSelectedVendorId}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        bankNames={metrics?.bankNames || []}
                        vendors={vendors}
                   />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        Aggregating Financial Command Center Data...
                    </p>
                </div>
            ) : metrics ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                    {/* Responsive Navigation Tabs List */}
                    <div className="overflow-x-auto pb-1 scrollbar-none">
                        <TabsList className="bg-slate-100 dark:bg-card/80 p-1.5 rounded-2xl h-auto inline-flex min-w-full sm:min-w-0 border border-slate-200/80 dark:border-white/10">
                            <TabsTrigger 
                                value="overview"
                                className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white shadow-sm"
                            >
                                <BarChart3 className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger 
                                value="entities"
                                className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white shadow-sm"
                            >
                                <Users className="h-4 w-4" />
                                Entities Breakdown
                            </TabsTrigger>
                            <TabsTrigger 
                                value="status-types"
                                className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white shadow-sm"
                            >
                                <PieChartIcon className="h-4 w-4" />
                                Status & Types
                            </TabsTrigger>
                            <TabsTrigger 
                                value="ledger"
                                className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white shadow-sm"
                            >
                                <ReceiptText className="h-4 w-4" />
                                Ledger History
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TAB 1: OVERVIEW */}
                    <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-300">
                        <KPIGrid metrics={metrics} activeFilter={activeFilter} onCardClick={(filter) => setActiveFilter(filter === activeFilter ? null : filter)} />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 flex flex-col">
                                <TrendChart trends={metrics.transactionTrends} />
                            </div>
                            <div className="lg:col-span-1">
                                <DistributionCharts 
                                    bankDistribution={metrics.transactionsByBank}
                                    typeDistribution={metrics.typeDistribution}
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <BalanceTrendChart trends={metrics.balanceTrends} bankNames={metrics.bankNames} />
                        </div>
                    </TabsContent>

                    {/* TAB 2: ENTITIES BREAKDOWN */}
                    <TabsContent value="entities" className="animate-in fade-in duration-300">
                        <EntitiesBreakdown metrics={metrics} />
                    </TabsContent>

                    {/* TAB 3: STATUS & TYPES */}
                    <TabsContent value="status-types" className="animate-in fade-in duration-300">
                        <StatusAndTypesCharts metrics={metrics} />
                    </TabsContent>

                    {/* TAB 4: LEDGER HISTORY */}
                    <TabsContent value="ledger" className="space-y-6 animate-in fade-in duration-300">
                        <div className="w-full">
                            {displayTable}
                        </div>
                    </TabsContent>
                </Tabs>
            ) : null}

            {/* View Password Unlock Modal */}
            <Dialog open={isUnlockOpen} onOpenChange={setIsUnlockOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Unlock Full View</DialogTitle>
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

export default DashboardPage;
