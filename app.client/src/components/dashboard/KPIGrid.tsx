import React from "react";
import { DashboardMetrics } from "./DashboardProcessor";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, Users, Building2, Truck, Wallet } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

interface KPIGridProps {
    metrics: DashboardMetrics;
    onCardClick?: (filterType: string) => void;
    activeFilter?: string | null;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ metrics, onCardClick, activeFilter }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <KPICard 
                    title="Total Available Funds"
                    value={`₹${metrics.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<Wallet className="h-6 w-6 text-primary" />}
                    trend="Net Account Balances"
                    trendColor="text-primary"
                />
                 
                <KPICard 
                    title="Debtor Receipts (In)"
                    value={`₹${(metrics.debtorReceiptsTotal || metrics.totalCredit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<Users className="h-6 w-6 text-emerald-500" />}
                    trend="Incoming from Debtors"
                    trendColor="text-emerald-500"
                />

                <KPICard 
                    title="Vendor Payments (Out)"
                    value={`₹${(metrics.vendorPaymentsTotal || metrics.totalDebit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<Building2 className="h-6 w-6 text-rose-500" />}
                    trend="Outgoing to Vendors"
                    trendColor="text-rose-500"
                />

                <KPICard 
                    title="Distributor Disbursements"
                    value={`₹${metrics.distributorDisbursementsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<Truck className="h-6 w-6 text-blue-500" />}
                    trend="Distributor Allocation"
                    trendColor="text-blue-500"
                />
            </div>

            {/* Approval Sub-Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div onClick={() => onCardClick?.('pendingApprovals')} className="block transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                    <MiniStat title="Approvals Pending" value={metrics.approvalStats.pending} icon={<Clock className="h-4 w-4" />} color="text-amber-500" bg="bg-amber-500/10" isActive={activeFilter === 'pendingApprovals'} />
                </div>
                <div onClick={() => onCardClick?.('approvedApprovals')} className="block transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                    <MiniStat title="Approvals Approved" value={metrics.approvalStats.approved} icon={<CheckCircle2 className="h-4 w-4" />} color="text-emerald-500" bg="bg-emerald-500/10" isActive={activeFilter === 'approvedApprovals'} />
                </div>
                <div onClick={() => onCardClick?.('rejectedApprovals')} className="block transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                    <MiniStat title="Approvals Rejected" value={metrics.approvalStats.rejected} icon={<XCircle className="h-4 w-4" />} color="text-rose-500" bg="bg-rose-500/10" isActive={activeFilter === 'rejectedApprovals'} />
                </div>
                <div onClick={() => onCardClick?.('completedTransactions')} className="block transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                    <MiniStat title="Transactions Completed" value={metrics.approvalStats.completed} icon={<CheckCircle2 className="h-4 w-4" />} color="text-blue-500" bg="bg-blue-500/10" isActive={activeFilter === 'completedTransactions'} />
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, trend, trendColor }: { title: string, value: string, icon: React.ReactNode, trend: string, trendColor: string }) => (
    <div className="relative group overflow-hidden bg-white dark:bg-card/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-[1.5rem] p-5 transition-all hover:border-primary/30 shadow-sm hover:shadow-md">
        <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            {icon}
        </div>
        <div className="flex justify-between items-start mb-3">
            <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-background/50 rounded-xl border border-slate-200/60 dark:border-white/5 shadow-inner">
                {icon}
            </div>
        </div>
        <div>
            <h3 className="text-2xl lg:text-3xl font-black text-foreground tracking-tighter truncate">{value}</h3>
            <p className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${trendColor}`}>
                {trend}
            </p>
        </div>
    </div>
);

const MiniStat = ({ title, value, icon, color, bg, isActive }: { title: string, value: number, icon: React.ReactNode, color: string, bg: string, isActive?: boolean }) => (
    <div className={`bg-white dark:bg-card/40 border ${isActive ? 'border-primary ring-1 ring-primary shadow-md' : 'border-slate-200/80 dark:border-white/5'} rounded-xl p-3.5 shadow-sm dark:shadow-none flex items-center justify-between transition-all`}>
        <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
            <p className="text-lg md:text-xl font-black text-foreground">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${bg} ${color}`}>
            {icon}
        </div>
    </div>
);
