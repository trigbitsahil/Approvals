import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DistributionChartsProps {
    bankDistribution: { name: string; value: number }[];
    typeDistribution: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#6366f1'];

export const DistributionCharts: React.FC<DistributionChartsProps> = ({ bankDistribution, typeDistribution }) => {
    return (
        <div className="bg-white dark:bg-card/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-6 shadow-sm dark:shadow-none h-[400px] flex flex-col">
            <div className="mb-2">
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Distributions</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Volume by Bank</p>
            </div>
            
            <div className="flex-1 min-h-0 relative">
                {bankDistribution.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">No data</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={bankDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {bankDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => `₹${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
                                contentStyle={{ 
                                    backgroundColor: 'rgba(0,0,0,0.8)', 
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontWeight: 800
                                }}
                                itemStyle={{ color: 'white' }}
                            />
                            <Legend 
                                layout="horizontal" 
                                verticalAlign="bottom" 
                                align="center"
                                wrapperStyle={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
