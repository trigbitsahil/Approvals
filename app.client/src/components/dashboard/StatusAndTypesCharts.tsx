import React from "react";
import { DashboardMetrics } from "./DashboardProcessor";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { CheckCircle2, Clock, XCircle, ShieldCheck, Layers, FileSpreadsheet } from "lucide-react";

interface StatusAndTypesChartsProps {
  metrics: DashboardMetrics;
}

export const StatusAndTypesCharts: React.FC<StatusAndTypesChartsProps> = ({ metrics }) => {
  const { statusDistribution, approvalTypeDistribution, approvalStats } = metrics;

  const totalStatusCount = statusDistribution.reduce((acc, curr) => acc + curr.value, 0);

  const typeChartData = approvalTypeDistribution.map((item) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    fullName: item.name,
    count: item.value,
    amount: item.amount,
  }));

  const maxTypeAmount = Math.max(...approvalTypeDistribution.map((t) => t.amount), 1);

  return (
    <div className="space-y-6">
      {/* Top Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Approvals</p>
            <p className="text-2xl font-black text-amber-500 mt-1">{approvalStats.pending}</p>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">Awaiting Signoff</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Approved</p>
            <p className="text-2xl font-black text-emerald-500 mt-1">{approvalStats.approved}</p>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">Ready for Settlement</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rejected</p>
            <p className="text-2xl font-black text-rose-500 mt-1">{approvalStats.rejected}</p>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">Declined Approvals</p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
            <XCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Completed</p>
            <p className="text-2xl font-black text-blue-500 mt-1">{approvalStats.completed}</p>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">Fully Processed</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Approval Status Distribution
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">Proportion of approvals by execution stage</p>
            </div>
          </div>

          <div className="h-[280px] w-full flex items-center justify-center">
            {totalStatusCount > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [
                      `${value} Approvals (₹${(item.payload.amount || 0).toLocaleString()})`,
                      name,
                    ]}
                    contentStyle={{ borderRadius: "12px", background: "rgba(15, 23, 42, 0.9)", color: "#fff", border: "none" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">No status data available</div>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
            {statusDistribution.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{s.name}</p>
                  <p className="text-xs font-bold">{s.value} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Types Breakdown Bar Chart */}
        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Approval Type Breakdown
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">Financial volume by approval category</p>
            </div>
          </div>

          <div className="h-[280px] w-full">
            {typeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeChartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Amount"]}
                    labelFormatter={(label, items) => items[0]?.payload?.fullName || label}
                    contentStyle={{ borderRadius: "12px", background: "rgba(15, 23, 42, 0.9)", color: "#fff", border: "none" }}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-bold uppercase tracking-wider">
                No approval types recorded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approval Type Detailed Table / List */}
      <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Approval Categories Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvalTypeDistribution.map((t) => {
            const pct = Math.round((t.amount / (maxTypeAmount || 1)) * 100);
            return (
              <div key={t.name} className="p-4 bg-slate-50 dark:bg-background/40 rounded-xl border border-slate-100 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground truncate">{t.name}</span>
                  <span className="font-black text-sm text-indigo-500">₹{t.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.value} Approvals</span>
                  <span>{pct}% of max</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
