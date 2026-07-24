import React from "react";
import { ApprovalListVM } from "@/api/models/ApprovalListVM";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface DashboardApprovalsTableProps {
    approvals: ApprovalListVM[];
    title: string;
}

export const DashboardApprovalsTable: React.FC<DashboardApprovalsTableProps> = ({ approvals, title }) => {
    return (
        <div className="bg-white dark:bg-card/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm dark:shadow-none">
            <div className="p-6 border-b border-slate-200 dark:border-white/10">
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">{title}</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Filtered Approvals</p>
            </div>
            
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4">Date</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4">Name</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4">Category</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4">Status</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">No approvals found</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            approvals.map((a) => (
                                <TableRow key={a.approvalID} className="transition-colors border-slate-50 dark:border-white/5 group hover:bg-slate-50/50 dark:hover:bg-white/5">
                                    <TableCell className="px-6 py-4 text-[10px] font-bold text-foreground/60 tabular-nums">
                                        {a.createdDate ? format(parseISO(a.createdDate), "dd MMM yyyy, HH:mm") : "N/A"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-xs font-medium text-foreground">
                                        {a.name || "N/A"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                                        {a.category || "N/A"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge variant="outline" className={`rounded-full border-none font-black text-[8px] uppercase px-3 ${a.approvalStatusName === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : a.approvalStatusName === 'Rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {a.approvalStatusName || "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-xs font-black tabular-nums">
                                        {a.transactionAmount ? `₹${a.transactionAmount.toLocaleString()}` : "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
