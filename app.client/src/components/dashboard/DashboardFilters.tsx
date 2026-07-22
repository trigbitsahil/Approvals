import React, { useEffect, useState } from "react";
import { BankService } from "@/api/services/BankService";
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from "date-fns";
import { Calendar as CalendarIcon, Building2, FileCheck, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/utils/cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardFiltersProps {
    dateRange: { start: Date | null; end: Date | null };
    setDateRange: (range: { start: Date | null; end: Date | null }) => void;
    selectedBankId: string;
    setSelectedBankId: (id: string) => void;
    selectedApprovalType: string;
    setSelectedApprovalType: (type: string) => void;
    selectedVendorId: string;
    setSelectedVendorId: (id: string) => void;
    activeFilter: string | null;
    setActiveFilter: (filter: string | null) => void;
    bankNames: string[];
    vendors: any[];
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
    dateRange,
    setDateRange,
    selectedBankId,
    setSelectedBankId,
    selectedApprovalType,
    setSelectedApprovalType,
    selectedVendorId,
    setSelectedVendorId,
    activeFilter,
    setActiveFilter,
    bankNames,
    vendors
}) => {
    const [banks, setBanks] = useState<any[]>([]);
    const [activePreset, setActivePreset] = useState<string>("week"); // Defaults to week based on DashboardProcessor

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const res = await BankService.getBanks();
                if (Array.isArray(res)) {
                    setBanks(res);
                } else if ((res as any).data) {
                    setBanks((res as any).data);
                }
            } catch (e) {
                console.error("Failed to fetch banks", e);
            }
        };
        fetchBanks();
    }, []);

    const setPreset = (preset: string) => {
        setActivePreset(preset);
        const today = new Date();
        if (preset === "week") {
            setDateRange({ start: subDays(today, 7), end: today });
        } else if (preset === "month") {
            setDateRange({ start: startOfMonth(today), end: endOfMonth(today) });
        } else if (preset === "year") {
            setDateRange({ start: startOfYear(today), end: today });
        } else if (preset === "all") {
            setDateRange({ start: null, end: null });
        }
    };

    const clearFilters = () => {
        setPreset('week');
        setSelectedBankId('all');
        setSelectedApprovalType('all');
        setSelectedVendorId('all');
        setActiveFilter(null);
    };

    return (
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap sm:overflow-x-auto pb-1 sm:hide-scrollbar">
            <div className="flex items-center gap-2 bg-card/50 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl shadow-sm backdrop-blur-md shrink-0">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "h-8 text-xs font-bold uppercase tracking-wider rounded-xl justify-start text-left font-normal",
                                !dateRange.start && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.start ? (
                                dateRange.end ? (
                                    <>
                                        {format(dateRange.start, "LLL dd, y")} -{" "}
                                        {format(dateRange.end, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.start, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-white/10" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange.start || new Date()}
                            selected={{ from: dateRange.start || undefined, to: dateRange.end || undefined }}
                            onSelect={(range) => {
                                setActivePreset('custom');
                                setDateRange({ start: range?.from || null, end: range?.to || null });
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto sm:shrink-0">
                <Select value={selectedApprovalType} onValueChange={setSelectedApprovalType}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 bg-card/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-primary/20 font-bold overflow-hidden">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest min-w-0 w-full">
                            <FileCheck className="h-4 w-4 opacity-50 shrink-0" />
                            <div className="truncate flex-1 text-left">
                                <SelectValue placeholder="All Types" />
                            </div>
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 backdrop-blur-2xl">
                        <SelectItem value="all" className="rounded-xl font-bold text-xs">All Types</SelectItem>
                        <SelectItem value="Transfer" className="rounded-xl font-bold text-xs">Transfer</SelectItem>
                        <SelectItem value="Convert" className="rounded-xl font-bold text-xs">Convert</SelectItem>
                        <SelectItem value="Finalize" className="rounded-xl font-bold text-xs">Finalize</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto sm:shrink-0">
                <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 bg-card/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-primary/20 font-bold overflow-hidden">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest min-w-0 w-full">
                            <Building2 className="h-4 w-4 opacity-50 shrink-0" />
                            <div className="truncate flex-1 text-left">
                                <SelectValue placeholder="All Banks" />
                            </div>
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 backdrop-blur-2xl">
                        <SelectItem value="all" className="rounded-xl font-bold text-xs">All Banks</SelectItem>
                        {banks.map((b) => (
                            <SelectItem key={b.bankId} value={b.bankId || ""} className="rounded-xl font-bold text-xs">
                                {b.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto sm:shrink-0">
                <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                    <SelectTrigger className="w-full sm:w-[200px] h-11 bg-card/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-primary/20 font-bold overflow-hidden">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest min-w-0 w-full">
                            <Building2 className="h-4 w-4 opacity-50 shrink-0" />
                            <div className="truncate flex-1 text-left">
                                <SelectValue placeholder="All Vendors" />
                            </div>
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 backdrop-blur-2xl">
                        <SelectItem value="all" className="rounded-xl font-bold text-xs">All Vendors</SelectItem>
                        {vendors?.map((v: any) => (
                            <SelectItem key={v.vendorID || v.id || Math.random().toString()} value={v.vendorID || v.id || ""} className="rounded-xl font-bold text-xs">
                                {v.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto ml-auto sm:shrink-0">
                 <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full sm:w-auto text-xs font-black uppercase tracking-wider rounded-xl h-11 text-rose-500 hover:bg-rose-500/10 hover:text-rose-500">
                     <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                 </Button>
            </div>
        </div>
    );
};
