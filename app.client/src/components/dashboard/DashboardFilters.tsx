import React, { useEffect, useState } from "react";
import { BankService } from "@/api/services/BankService";
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from "date-fns";
import { Calendar as CalendarIcon, Building2, FileCheck, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/utils/cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VendorCategoryService } from "@/api/services/VendorCategoryService";

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
    const [vendorCategories, setVendorCategories] = useState<any[]>([]);
    const [activePreset, setActivePreset] = useState<string>("");

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
        const fetchCategories = async () => {
            try {
                const res = await VendorCategoryService.getAllVendorCategories();
                setVendorCategories(res);
            } catch (e) {
                console.error("Failed to fetch vendor categories", e);
            }
        };
        fetchBanks();
        fetchCategories();
    }, []);

    const setPreset = (preset: string) => {
        setActivePreset(preset);
        const today = new Date();
        if (preset === "today") {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            setDateRange({ start, end });
        } else if (preset === "7days" || preset === "week") {
            const end = new Date();
            const start = subDays(end, 7);
            start.setHours(0, 0, 0, 0);
            setDateRange({ start, end });
        } else if (preset === "15days") {
            const end = new Date();
            const start = subDays(end, 15);
            start.setHours(0, 0, 0, 0);
            setDateRange({ start, end });
        } else if (preset === "month") {
            setDateRange({ start: startOfMonth(today), end: endOfMonth(today) });
        } else if (preset === "year") {
            setDateRange({ start: startOfYear(today), end: today });
        } else if (preset === "all") {
            setDateRange({ start: null, end: null });
        }
    };

    const clearFilters = () => {
        setActivePreset('');
        setSelectedBankId('all');
        setSelectedApprovalType('all');
        setSelectedVendorId('all');
        setActiveFilter(null);
    };

    const isFiltered = activePreset !== '' || selectedBankId !== 'all' || selectedApprovalType !== 'all' || selectedVendorId !== 'all' || activeFilter !== null || dateRange.start !== null;

    return (
        <div className="w-full flex flex-col gap-3 bg-slate-100/60 dark:bg-card/30 p-3 rounded-2xl border border-slate-200/60 dark:border-white/5">
            {/* ROW 1: Date Range Preset, Custom Date Range, Approval Types */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {/* Date Range Presets Dropdown */}
                <div className="w-full">
                    <Select value={activePreset} onValueChange={setPreset}>
                        <SelectTrigger className="w-full h-10 bg-white dark:bg-card/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm rounded-xl focus:ring-primary/20 font-bold">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-wider min-w-0 w-full text-foreground">
                                <CalendarIcon className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                <div className="truncate flex-1 text-left">
                                    <SelectValue placeholder="Select Range" />
                                </div>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-card shadow-lg">
                            <SelectItem value="today" className="rounded-lg font-bold text-xs">Today</SelectItem>
                            <SelectItem value="7days" className="rounded-lg font-bold text-xs">Last 7 Days</SelectItem>
                            <SelectItem value="15days" className="rounded-lg font-bold text-xs">Last 15 Days</SelectItem>
                            <SelectItem value="month" className="rounded-lg font-bold text-xs">This Month</SelectItem>
                            <SelectItem value="year" className="rounded-lg font-bold text-xs">This Year</SelectItem>
                            <SelectItem value="all" className="rounded-lg font-bold text-xs">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Custom Date Range Picker */}
                <div className="w-full">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full h-10 text-xs font-bold uppercase tracking-wider rounded-xl justify-start text-left bg-white dark:bg-card/80 border-slate-200/80 dark:border-white/10 shadow-sm px-3",
                                    !dateRange.start && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-50 shrink-0" />
                                <span className="truncate">
                                    {dateRange.start ? (
                                        dateRange.end ? (
                                            <>
                                                {format(dateRange.start, "MMM dd, y")} -{" "}
                                                {format(dateRange.end, "MMM dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.start, "MMM dd, y")
                                        )
                                    ) : (
                                        <span>Custom Date</span>
                                    )}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-card shadow-xl" align="start">
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

                {/* Approval Types Dropdown */}
                <div className="w-full">
                    <Select value={selectedApprovalType} onValueChange={setSelectedApprovalType}>
                        <SelectTrigger className="w-full h-10 bg-white dark:bg-card/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm rounded-xl focus:ring-primary/20 font-bold">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-wider min-w-0 w-full text-foreground">
                                <FileCheck className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                <div className="truncate flex-1 text-left">
                                    <SelectValue placeholder="All Types" />
                                </div>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-card shadow-lg">
                            <SelectItem value="all" className="rounded-lg font-bold text-xs">All Types</SelectItem>
                            <SelectItem value="Bank Transfer" className="rounded-lg font-bold text-xs">Bank Transfer</SelectItem>
                            <SelectItem value="Convert" className="rounded-lg font-bold text-xs">Convert</SelectItem>
                            <SelectItem value="Finalize" className="rounded-lg font-bold text-xs">Finalize</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* ROW 2: Banks, Vendors, Clear Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full items-center">
                {/* Banks Dropdown */}
                <div className="w-full">
                    <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                        <SelectTrigger className="w-full h-10 bg-white dark:bg-card/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm rounded-xl focus:ring-primary/20 font-bold">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-wider min-w-0 w-full text-foreground">
                                <Building2 className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                <div className="truncate flex-1 text-left">
                                    <SelectValue placeholder="All Banks" />
                                </div>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-card shadow-lg">
                            <SelectItem value="all" className="rounded-lg font-bold text-xs">All Banks</SelectItem>
                            {banks.map((b) => (
                                <SelectItem key={b.bankId} value={b.bankId || ""} className="rounded-lg font-bold text-xs">
                                    {b.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Vendors Dropdown */}
                <div className="w-full">
                    <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                        <SelectTrigger className="w-full h-10 bg-white dark:bg-card/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm rounded-xl focus:ring-primary/20 font-bold">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-wider min-w-0 w-full text-foreground">
                                <Building2 className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                <div className="truncate flex-1 text-left">
                                    <SelectValue placeholder="All Vendors" />
                                </div>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-card shadow-lg">
                            <SelectItem value="all" className="rounded-lg font-bold text-xs">All Vendors</SelectItem>
                            {vendors?.map((v: any) => {
                                const categoryName = vendorCategories.find(c => c.vendorCategoryId === v.vendorCategoryId)?.name;
                                const displayName = categoryName ? `${v.name} (${categoryName})` : v.name;
                                return (
                                    <SelectItem key={v.vendorID || v.id || Math.random().toString()} value={v.vendorID || v.id || ""} className="rounded-lg font-bold text-xs">
                                        {displayName}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Filters Action Button */}
                <div className="w-full flex justify-end">
                    {isFiltered && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearFilters} 
                            className="h-10 px-3 text-xs font-black uppercase tracking-wider rounded-xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors w-full sm:w-auto"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
