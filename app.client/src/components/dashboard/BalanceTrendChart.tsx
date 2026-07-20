import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BalanceTrendChartProps {
    trends: { date: string; [bankName: string]: any }[];
    bankNames: string[];
}

// A sleek color palette for up to 10 banks
const COLORS = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", 
    "#14b8a6", "#f43f5e", "#6366f1", "#84cc16", "#06b6d4"
];

export const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({ trends, bankNames }) => {
    return (
        <div className="bg-card/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-sm h-[320px] flex flex-col mt-6">
            <div className="mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Balance Trends</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Historical Account Balances</p>
            </div>
            
            <div className="flex-1 min-h-0">
                {trends.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">No balance data available for this range</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor", opacity: 0.5 }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                                tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor", opacity: 0.5 }}
                                dx={-10}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(0,0,0,0.8)', 
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                                }}
                                itemStyle={{ fontSize: '12px', fontWeight: 800 }}
                                labelStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                                formatter={(value: number) => [`$${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`, '']}
                            />
                            <Legend 
                                iconType="circle" 
                                wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}
                            />
                            {bankNames.map((name, index) => (
                                <Line 
                                    key={name} 
                                    type="monotone" 
                                    dataKey={name} 
                                    name={name} 
                                    stroke={COLORS[index % COLORS.length]} 
                                    strokeWidth={3} 
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    connectNulls={true}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
