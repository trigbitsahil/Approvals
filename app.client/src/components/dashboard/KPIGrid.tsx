import React from "react";
import { Link } from "react-router-dom";
import { DashboardMetrics } from "./DashboardProcessor";
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

interface KPIGridProps {
    metrics: DashboardMetrics;
    onCardClick?: (filterType: string) => void;
    activeFilter?: string | null;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ metrics, onCardClick, activeFilter }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard 
                title="Total Available Funds"
                value={`₹${metrics.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<FaRupeeSign className="h-6 w-6 text-primary" />}
                trend="Net Account Balances"
                trendColor="text-primary"
            />
             
            <KPICard 
                title="Total Credits (In)"
                value={`₹${metrics.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<ArrowUpRight className="h-6 w-6 text-emerald-500" />}
                trend="All incoming funds"
                trendColor="text-emerald-500"
            />
            <KPICard 
                title="Total Debits (Out)"
                value={`₹${metrics.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<ArrowDownRight className="h-6 w-6 text-rose-500" />}
                trend="All outgoing funds"
                trendColor="text-rose-500"
            />
            
            {/* Approval Sub-Stats */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div onClick={() => onCardClick?.('pendingApprovals')} className="block transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                    <MiniStat title="Approvals Pending" value={metrics.approvalStats.pending} icon={<Clock className="h-4 w-4" />} color="text-amber-500" bg="bg-amber-500/10" isActive={activeFilter === 'pendingApprovals'} />
                </div>
                <div onClick={() => onCardClick?.('approvedApprovals')} className="block transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                    <MiniStat title="Approvals Approved" value={metrics.approvalStats.approved} icon={<CheckCircle2 className="h-4 w-4" />} color="text-emerald-500" bg="bg-emerald-500/10" isActive={activeFilter === 'approvedApprovals'} />
                </div>
                <div onClick={() => onCardClick?.('rejectedApprovals')} className="block transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                    <MiniStat title="Approvals Rejected" value={metrics.approvalStats.rejected} icon={<XCircle className="h-4 w-4" />} color="text-rose-500" bg="bg-rose-500/10" isActive={activeFilter === 'rejectedApprovals'} />
                </div>
                <div onClick={() => onCardClick?.('completedTransactions')} className="block transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                    <MiniStat title="Transactions Completed" value={metrics.approvalStats.completed} icon={<CheckCircle2 className="h-4 w-4" />} color="text-blue-500" bg="bg-blue-500/10" isActive={activeFilter === 'completedTransactions'} />
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, trend, trendColor }: { title: string, value: string, icon: React.ReactNode, trend: string, trendColor: string }) => (
    <div className="relative group overflow-hidden bg-white dark:bg-card/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-6 transition-all hover:border-primary/30 shadow-sm hover:shadow-md">
        <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            {icon}
        </div>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-background/50 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-inner">
                {icon}
            </div>
        </div>
        <div>
            <h3 className="text-3xl font-black text-foreground tracking-tighter">{value}</h3>
            <p className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${trendColor}`}>
                {trend}
            </p>
        </div>
    </div>
);

const MiniStat = ({ title, value, icon, color, bg, isActive }: { title: string, value: number, icon: React.ReactNode, color: string, bg: string, isActive?: boolean }) => (
    <div className={`bg-white dark:bg-card/40 border ${isActive ? 'border-primary ring-1 ring-primary shadow-md' : 'border-slate-200/80 dark:border-white/5'} rounded-2xl p-4 shadow-sm dark:shadow-none flex items-center justify-between transition-all`}>
        <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
            <p className="text-xl font-black text-foreground">{value}</p>
        </div>
        <div className={`p-2 rounded-xl ${bg} ${color}`}>
            {icon}
        </div>
    </div>
);
