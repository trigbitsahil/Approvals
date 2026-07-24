import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendChartProps {
    trends: { date: string; credit: number; debit: number }[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ trends }) => {
    return (
        <div className="bg-white dark:bg-card/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-6 shadow-sm dark:shadow-none h-[400px] flex flex-col">
            <div className="mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Transaction Trends</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Daily Volume Analysis</p>
            </div>
            
            <div className="flex-1 min-h-0">
                {trends.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">No trend data available for this range</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.35} />
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
                                tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
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
                                formatter={(value: number) => [`₹${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`, '']}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}/>
                            <Area type="monotone" dataKey="credit" name="Credits (In)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCredit)" />
                            <Area type="monotone" dataKey="debit" name="Debits (Out)" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorDebit)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
