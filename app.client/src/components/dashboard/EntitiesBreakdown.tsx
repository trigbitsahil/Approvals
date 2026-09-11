import React, { useState } from "react";
import { DashboardMetrics, EntityStatItem } from "./DashboardProcessor";
import { Users, Truck, Building2, TrendingUp, IndianRupee, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface EntitiesBreakdownProps {
  metrics: DashboardMetrics;
}

export const EntitiesBreakdown: React.FC<EntitiesBreakdownProps> = ({ metrics }) => {
  const [selectedEntity, setSelectedEntity] = useState<"debtors" | "distributors" | "vendors">("debtors");

  const { debtors, distributors, vendors } = metrics.entityStats;

  const currentData = 
    selectedEntity === "debtors" ? debtors :
    selectedEntity === "distributors" ? distributors : vendors;

  const titleMap = {
    debtors: { label: "Debtors Receipts", icon: <Users className="h-5 w-5 text-emerald-500" />, color: "#10b981", bg: "bg-emerald-500/10" },
    distributors: { label: "Distributors Disbursements", icon: <Truck className="h-5 w-5 text-blue-500" />, color: "#3b82f6", bg: "bg-blue-500/10" },
    vendors: { label: "Vendors Payments", icon: <Building2 className="h-5 w-5 text-rose-500" />, color: "#f43f5e", bg: "bg-rose-500/10" },
  };

  const chartData = currentData.items.slice(0, 8).map((item) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    fullName: item.name,
    amount: item.amount,
    count: item.count,
  }));

  const maxAmount = Math.max(...currentData.items.map((i) => i.amount), 1);

  return (
    <div className="space-y-6">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-card/60 p-2 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <button
          onClick={() => setSelectedEntity("debtors")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            selectedEntity === "debtors"
              ? "bg-emerald-500 text-white shadow-md"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-card"
          }`}
        >
          <Users className="h-4 w-4" />
          Debtors ({debtors.count})
        </button>

        <button
          onClick={() => setSelectedEntity("distributors")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            selectedEntity === "distributors"
              ? "bg-blue-500 text-white shadow-md"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-card"
          }`}
        >
          <Truck className="h-4 w-4" />
          Distributors ({distributors.count})
        </button>

        <button
          onClick={() => setSelectedEntity("vendors")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            selectedEntity === "vendors"
              ? "bg-rose-500 text-white shadow-md"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-card"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Vendors ({vendors.count})
        </button>
      </div>

      {/* Summary KPI Cards Grid for Entities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Debtors Receipts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black tracking-tighter">₹{debtors.totalAmount.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">{debtors.count} Registered Debtors</p>
        </div>

        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Distributor Allocation</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black tracking-tighter">₹{distributors.totalAmount.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">{distributors.count} Registered Distributors</p>
        </div>

        <div className="bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Vendor Settlements</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black tracking-tighter">₹{vendors.totalAmount.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">{vendors.count} Registered Vendors</p>
        </div>
      </div>

      {/* Main Chart + List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                {titleMap[selectedEntity].icon}
                Top {titleMap[selectedEntity].label} Volume
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">Highest transaction amounts in selected period</p>
            </div>
          </div>

          <div className="h-[320px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Total Amount"]}
                    labelFormatter={(label, items) => items[0]?.payload?.fullName || label}
                    contentStyle={{ borderRadius: "12px", background: "rgba(15, 23, 42, 0.9)", color: "#fff", border: "none" }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={titleMap[selectedEntity].color} opacity={1 - index * 0.08} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-xs font-bold uppercase tracking-wider">
                No active records found for this category
              </div>
            )}
          </div>
        </div>

        {/* Detailed Entity List */}
        <div className="lg:col-span-1 bg-white dark:bg-card/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4">
              {selectedEntity.toUpperCase()} BREAKDOWN
            </h3>

            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
              {currentData.items.length > 0 ? (
                currentData.items.map((item, idx) => {
                  const pct = Math.round((item.amount / (maxAmount || 1)) * 100);
                  return (
                    <div key={item.id || idx} className="p-3 bg-slate-50 dark:bg-background/40 rounded-xl border border-slate-100 dark:border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground truncate max-w-[160px]">{item.name}</span>
                        <span className="font-black text-foreground">₹{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{item.count} Transactions</span>
                        {item.email && <span className="truncate max-w-[120px]">{item.email}</span>}
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: titleMap[selectedEntity].color }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground font-semibold py-8 text-center">No entity items available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
