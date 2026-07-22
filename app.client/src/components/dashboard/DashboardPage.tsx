import React, { useEffect, useState } from "react";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import { ApprovalService } from "@/api/services/ApprovalService";
import { VendorService } from "@/api/services/VendorService";
import { DashboardProcessor, DashboardMetrics } from "./DashboardProcessor";
import { BankTransactionListVM } from "@/api/models/BankTransactionListVM";
import { ApprovalListVM } from "@/api/models/ApprovalListVM";
import { VendorListVM } from "@/api/models/VendorListVM";
import { LayoutDashboard, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardFilters } from "./DashboardFilters";
import { KPIGrid } from "./KPIGrid";
import { TrendChart } from "./TrendChart";
import { BalanceTrendChart } from "./BalanceTrendChart";
import { DistributionCharts } from "./DistributionCharts";
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
    
    // Raw Data State
    const [transactions, setTransactions] = useState<BankTransactionListVM[]>([]);
    const [approvals, setApprovals] = useState<ApprovalListVM[]>([]);
    const [vendors, setVendors] = useState<VendorListVM[]>([]);

    const [searchClickCount, setSearchClickCount] = useState(0);
    const searchClickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [transactionsRes, approvalsRes, vendorsRes] = await Promise.all([
                    BankTransactionService.getAllBankTransactions(),
                    ApprovalService.getApiVApproval('1', '-', '-'),
                    VendorService.getApiVVendor('1')
                ]);

                const txData = transactionsRes?.data || [];
                const approvalData = approvalsRes?.data || [];
                const vendorData = vendorsRes?.data || [];

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
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        // Re-calculate metrics whenever filters, raw data, or activeFilter change
        if (transactions.length > 0 || approvals.length > 0) {
            const newMetrics = DashboardProcessor.processData(
                transactions, 
                approvals, 
                dateRange, 
                selectedBankId, 
                selectedApprovalType,
                selectedVendorId,
                activeFilter
            );
            setMetrics(newMetrics);
        }
    }, [transactions, approvals, dateRange, selectedBankId, selectedApprovalType, selectedVendorId, activeFilter]);

    let displayTable = null;
    if (metrics) {
        if (activeFilter === 'pendingApprovals') {
            const filteredApprovals = metrics.filteredApprovals.filter(a => a.approvalStatusName === 'Pending');
            displayTable = <DashboardApprovalsTable approvals={filteredApprovals} title="Pending Approvals" />;
        } else if (activeFilter === 'approvedApprovals') {
            const filteredApprovals = metrics.filteredApprovals.filter(a => a.approvalStatusName === 'Approved');
            displayTable = <DashboardApprovalsTable approvals={filteredApprovals} title="Approved Approvals" />;
        } else if (activeFilter === 'rejectedApprovals') {
            const filteredApprovals = metrics.filteredApprovals.filter(a => a.approvalStatusName === 'Rejected');
            displayTable = <DashboardApprovalsTable approvals={filteredApprovals} title="Rejected Approvals" />;
        } else if (activeFilter === 'completedTransactions') {
            displayTable = <RecentTransactionsTable transactions={metrics.recentTransactions} />;
        } else {
            displayTable = <RecentTransactionsTable transactions={metrics.recentTransactions} />;
        }
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Overview Dashboard
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <LayoutDashboard 
                            className="h-4 w-4 text-muted-foreground transition-colors"
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
                            Financial Command Center
                        </p>
                    </div>
                </div>
                <div className="w-full flex justify-end">
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
                        Aggregating Data...
                    </p>
                </div>
            ) : metrics ? (
                <>
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

                    <div className="w-full">
                        {displayTable}
                    </div>
                </>
            ) : null}

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

export default DashboardPage;
