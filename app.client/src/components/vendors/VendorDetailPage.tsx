import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VendorService } from "@/api/services/VendorService";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import { UserService } from "@/api/services/UserService";
import type { VendorListVM } from "@/api/models/VendorListVM";
import type { BankTransactionListVM } from "@/api/models/BankTransactionListVM";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { OpenAPI } from "@/api/core/OpenAPI";
import { getAccessToken } from "@/utils/authToken";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Store,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  Loader2,
  Filter,
  X,
  ExternalLink,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Truck,
  Building2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { toast } from "sonner";

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState<VendorListVM | null>(null);
  const [transactions, setTransactions] = useState<BankTransactionListVM[]>([]);
  const [summary, setSummary] = useState<{ totalPaidAmount?: number; pendingAmount?: number } | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTxForTimeline, setSelectedTxForTimeline] = useState<BankTransactionListVM | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Sorting & Pagination state
  const [sortColumn, setSortColumn] = useState<string>("createdDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const resolveUserDisplayName = (val: string | null | undefined) => {
    if (!val) return "Assigned User";
    const matched = users.find(u =>
      u.id === val ||
      u.userId === val ||
      u.userID === val ||
      (u.email && u.email.toLowerCase() === val.toLowerCase())
    );
    if (matched) {
      return matched.email || [matched.firstName, matched.lastName].filter(Boolean).join(" ") || matched.userName || val;
    }
    return val;
  };

  const [searchClickCount, setSearchClickCount] = useState(0);
  const searchClickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleHeaderIconClick = () => {
    setSearchClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 4) {
        const currentlyUnlocked = !!sessionStorage.getItem('view_password');
        if (currentlyUnlocked) {
          sessionStorage.removeItem('view_password');
          window.location.reload();
        } else {
          setPassword("");
          setIsUnlockOpen(true);
        }
        return 0;
      }
      return newCount;
    });
    if (searchClickTimeoutRef.current) {
      clearTimeout(searchClickTimeoutRef.current);
    }
    searchClickTimeoutRef.current = setTimeout(() => {
      setSearchClickCount(0);
    }, 2000);
  };

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [vendorRes, txRes, summaryRes, userRes] = await Promise.all([
        VendorService.getVendorById(id),
        BankTransactionService.getBankTransactionsByVendorId(id),
        VendorService.getVendorSummary(id).catch(() => null),
        UserService.getApiVUser('1').catch(() => null)
      ]);

      if (userRes?.data && Array.isArray(userRes.data)) {
        setUsers(userRes.data);
      }

      const isUnlocked = !!sessionStorage.getItem('view_password');

      if (summaryRes?.data) {
        const sData = { ...summaryRes.data };
        if (!isUnlocked) {
          if (sData.totalPaidAmount != null) sData.totalPaidAmount = sData.totalPaidAmount / 1000;
          if (sData.pendingAmount != null) sData.pendingAmount = sData.pendingAmount / 1000;
        }
        setSummary(sData);
      }

      if (vendorRes?.success && vendorRes?.data) {
        setVendor(vendorRes.data);
      } else {
        const allVendorsRes = await VendorService.getApiVVendor('1');
        const found = allVendorsRes?.data?.find(v => v.vendorId === id);
        if (found) setVendor(found);
      }

      if (txRes?.data) {
        const txData = txRes.data;
        if (!isUnlocked) {
          txData.forEach((tx: any) => {
            if (tx.amount != null) tx.amount = tx.amount / 1000;
            if (tx.deposit != null) tx.deposit = tx.deposit / 1000;
            if (tx.withdrawal != null) tx.withdrawal = tx.withdrawal / 1000;
            if (tx.runningBalance != null) tx.runningBalance = tx.runningBalance / 1000;
          });
        }
        setTransactions(txData);
      }
    } catch (error) {
      toast.error("Failed to load vendor details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const filteredTransactions = transactions.filter((tx) => {
    if (!tx.createdDate) return true;
    const txDate = new Date(tx.createdDate).getTime();
    if (startDate && txDate < new Date(startDate).getTime()) return false;
    if (endDate && txDate > new Date(endDate).setHours(23, 59, 59, 999)) return false;
    return true;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...filteredTransactions];
    if (sortColumn) {
      result.sort((a, b) => {
        let aVal = (a as any)[sortColumn];
        let bVal = (b as any)[sortColumn];

        if (sortColumn === "fromBankName") {
          aVal = a.fromBankName || a.bankName || a.toBankName || "";
          bVal = b.fromBankName || b.bankName || b.toBankName || "";
        }

        if (aVal == null) aVal = "";
        if (bVal == null) bVal = "";

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [filteredTransactions, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / pageSize) || 1;

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedTransactions.slice(start, start + pageSize);
  }, [filteredAndSortedTransactions, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, pageSize]);

  const totalPaidAmount = summary?.totalPaidAmount !== undefined && !startDate && !endDate
    ? summary.totalPaidAmount
    : filteredTransactions.filter(t => t.isConfirm).reduce((sum, t) => sum + (t.amount || 0), 0);

  const pendingVendorBalance = summary?.pendingAmount !== undefined && !startDate && !endDate
    ? summary.pendingAmount
    : filteredTransactions.filter(t => !t.isConfirm).reduce((sum, t) => sum + (t.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading vendor ledger...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate("/vendors")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors
        </Button>
        <div className="text-center py-12">
          <p className="text-lg font-medium text-foreground">Vendor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/vendors")}
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors" onClick={handleHeaderIconClick}>
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {vendor.name}
              </h1>
               
            </div>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
              vendor.isVoided
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            }`}
          >
            {vendor.isVoided ? "Inactive / Voided" : "Active Vendor"}
          </span>
        </div>
      </div>

      {/* Info & Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Info Card */}
        <Card className="lg:col-span-2 border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Vendor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{vendor.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{vendor.phone || "No phone provided"}</span>
              </div>
              {vendor.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-primary hover:text-primary/80 truncate"
                  >
                    {vendor.website}
                  </a>
                </div>
              )}
              {vendor.address && (
                <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{vendor.address}</span>
                </div>
              )}
            </div>

            {(vendor.gstNumber || vendor.panNumber) && (
              <div className="pt-2 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
                {vendor.gstNumber && <div><span className="font-semibold text-foreground">GST:</span> {vendor.gstNumber}</div>}
                {vendor.panNumber && <div><span className="font-semibold text-foreground">PAN:</span> {vendor.panNumber}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Paid Card */}
        <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Total Paid to Vendor
              <ArrowDownLeft className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-extrabold text-foreground">
              ₹{totalPaidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-500 font-medium mt-1">Confirmed Payments</p>
          </CardContent>
        </Card>


        {/* Pending Balance Card */}
        <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              To Pay
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-extrabold text-foreground">
              ₹{pendingVendorBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-500 font-medium mt-1">Awaiting Bank Confirmation</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Ledger Section */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Transaction Ledger
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Detailed breakdown of bank, distributor, and vendor payment flows
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Date Range Filter Pill */}
            <div className="flex items-center gap-1.5 bg-muted/20 p-1 px-2.5 rounded-xl border border-border/50 shadow-xs">
              <DatePickerInput
                value={startDate}
                onChange={setStartDate}
                placeholder="Start Date"
                className="h-7 border-none bg-transparent shadow-none text-xs font-medium px-1 w-[120px] sm:w-[130px]"
              />
              <span className="text-xs font-bold text-muted-foreground/60 px-0.5 shrink-0 select-none">–</span>
              <DatePickerInput
                value={endDate}
                onChange={setEndDate}
                placeholder="End Date"
                className="h-7 border-none bg-transparent shadow-none text-xs font-medium px-1 w-[120px] sm:w-[130px]"
              />
              {(startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg shrink-0 ml-1"
                  title="Clear Date Filter"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30 border-b border-border">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="w-[65px] font-semibold text-foreground">S No.</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <Button variant="ghost" onClick={() => handleSort("approvalName")} className="font-semibold px-0 hover:bg-transparent text-foreground">
                      Approval <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    <Button variant="ghost" onClick={() => handleSort("amount")} className="font-semibold px-0 hover:bg-transparent text-foreground justify-end w-full">
                      Amount <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <Button variant="ghost" onClick={() => handleSort("fromBankName")} className="font-semibold px-0 hover:bg-transparent text-foreground">
                      From Bank <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <Button variant="ghost" onClick={() => handleSort("distributorName")} className="font-semibold px-0 hover:bg-transparent text-foreground">
                      Distributor <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <Button variant="ghost" onClick={() => handleSort("isConfirm")} className="font-semibold px-0 hover:bg-transparent text-foreground">
                      Status <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <Button variant="ghost" onClick={() => handleSort("createdDate")} className="font-semibold px-0 hover:bg-transparent text-foreground">
                      Date <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No transactions found for this vendor.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((tx, index) => {
                    const bankDisplayName = tx.fromBankName || tx.bankName || tx.toBankName || "Source Bank";
                    const distributorName = tx.distributorName;
                    const serialNumber = (currentPage - 1) * pageSize + index + 1;
                    const isUnlocked = !!sessionStorage.getItem('view_password');
                    const displayApprovalName = isUnlocked
                      ? (tx.approvalName || tx.approvalReference || tx.transactionId || "-")
                      : (tx.approvalReference || "-");

                    return (
                      <TableRow
                        key={tx.transactionId}
                        onClick={() => {
                          if (tx.approvalId) navigate(`/approvals/${tx.approvalId}`);
                        }}
                        className={`transition-colors border-border ${tx.approvalId ? "cursor-pointer hover:bg-muted/60" : "hover:bg-muted/40"}`}
                      >
                        <TableCell className="font-medium text-muted-foreground text-xs">{serialNumber}</TableCell>
                        <TableCell className="font-medium text-foreground max-w-[200px] truncate" title={displayApprovalName}>
                          {displayApprovalName}
                        </TableCell>
                        
                        <TableCell className="text-right font-bold text-foreground">
                          ₹{(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                            {bankDisplayName}
                          </span>
                        </TableCell>
                        <TableCell>
                          {distributorName ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2.5 py-0.5 rounded-full">
                              <Truck className="h-3 w-3 shrink-0" />
                              {distributorName}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Direct Bank Payment</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {tx.isConfirm ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              Paid
                            </span>
                          ) : tx.isPaidToDistributor ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              <Clock className="h-3.5 w-3.5" />
                              Paid to {distributorName || "Distributor"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                              <Clock className="h-3.5 w-3.5" />
                              Pending Confirmation
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                          {tx.createdDate ? format(new Date(tx.createdDate), "MMM dd, yyyy") : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="link"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTxForTimeline(tx);
                                setIsTimelineOpen(true);
                              }}
                              className="h-8 px-2.5 text-xs gap-1 border-border cursor-pointer"
                            >
                              <History className="h-3.5 w-3.5 text-primary" />
                              View History
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredAndSortedTransactions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-border bg-muted/20 gap-3 text-xs">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span>Show</span>
                <Select value={String(pageSize)} onValueChange={(val) => setPageSize(Number(val))}>
                  <SelectTrigger className="h-7 w-[65px] border border-border/60 bg-background text-foreground text-xs focus:ring-0 focus:ring-offset-0 px-2 justify-between rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top" align="center" className="rounded-xl border-border/60 bg-popover text-popover-foreground shadow-md min-w-[65px]">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>entries</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                <span className="text-muted-foreground">
                  Page {currentPage} of {totalPages} ({filteredAndSortedTransactions.length} items)
                </span>
                <div className="flex items-center space-x-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-7 w-7 p-0 rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 p-0 rounded-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History & Timeline Modal */}
      <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-xl w-full p-4 sm:p-7 rounded-2xl gap-4 sm:gap-5 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg sm:text-xl font-bold text-foreground">
              <History className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
              Vendor Payment Timeline & Breakdown
            </DialogTitle>
          </DialogHeader>

          {selectedTxForTimeline && (
            <div className="space-y-5 sm:space-y-6 pt-1">
              <div className="p-3.5 sm:p-4 bg-muted/40 rounded-xl border border-border/60 flex items-center justify-between gap-3 shadow-xs">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground">Approval Request</p>
                  <p className="text-sm sm:text-base font-bold text-foreground truncate">{selectedTxForTimeline.approvalName || "Vendor Payment"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-muted-foreground">Amount</p>
                  <p className="text-sm sm:text-base font-extrabold text-foreground">₹{(selectedTxForTimeline.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-7 border-l-2 dark:border-gray-600 border-gray-300 ml-3 sm:ml-4">
                {/* Step 1: Disbursed from Source Bank */}
                <div className="relative">
                  <div className="absolute -left-[37px] sm:-left-[45px] top-0.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-extrabold ring-4 ring-background shadow-xs">
                    1
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <h4 className="text-sm sm:text-base font-bold text-foreground">Disbursed from Source Bank</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shrink-0">
                        Disbursed
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                      From Bank: <span className="font-semibold text-foreground">{selectedTxForTimeline.fromBankName || selectedTxForTimeline.bankName || "Source Bank"}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 break-words">
                      Distributor Intermediary:{" "}
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {selectedTxForTimeline.distributorName || "None (Direct Payment)"}
                      </span>
                    </p>
                    <div className="mt-3 text-xs sm:text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 bg-card/60 p-3 rounded-xl border border-border/60 shadow-xs min-w-0">
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground">Date:</span>{" "}
                        {selectedTxForTimeline.paidToDistributorDate
                          ? format(new Date(selectedTxForTimeline.paidToDistributorDate), "MMM dd, yyyy HH:mm")
                          : (selectedTxForTimeline.createdDate ? format(new Date(selectedTxForTimeline.createdDate), "MMM dd, yyyy HH:mm") : "-")}
                      </div>
                      <div className="min-w-0 break-all">
                        <span className="font-semibold text-foreground">By:</span>{" "}
                        {resolveUserDisplayName(selectedTxForTimeline.paidToDistributorBy || selectedTxForTimeline.fromBankUserEmail || selectedTxForTimeline.createdBy)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Paid & Confirmed to Vendor */}
                <div className="relative">
                  <div className={`absolute -left-[37px] sm:-left-[45px] top-0.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full ${selectedTxForTimeline.isConfirm ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border"} flex items-center justify-center text-xs sm:text-sm font-extrabold ring-4 ring-background shadow-xs`}>
                    2
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <h4 className="text-sm sm:text-base font-bold text-foreground">Paid to Vendor</h4>
                      {selectedTxForTimeline.isConfirm ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0">
                          Completed & Confirmed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 shrink-0">
                          Awaiting Confirmation
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                      Recipient Vendor: <span className="font-semibold text-foreground">{vendor.name}</span>
                    </p>
                    <div className="mt-3 text-xs sm:text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 bg-card/60 p-3 rounded-xl border border-border/60 shadow-xs min-w-0">
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground">Status:</span>{" "}
                        {selectedTxForTimeline.isConfirm ? "Confirmed Settlement" : "Pending Confirmation"}
                      </div>
                      {selectedTxForTimeline.isConfirm && selectedTxForTimeline.lastModifiedDate && (
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground">Date:</span>{" "}
                          {format(new Date(selectedTxForTimeline.lastModifiedDate), "MMM dd, yyyy HH:mm")}
                        </div>
                      )}
                      {selectedTxForTimeline.isConfirm && selectedTxForTimeline.lastModifiedBy && (
                        <div className="min-w-0 break-all">
                          <span className="font-semibold text-foreground">By:</span>{" "}
                          {resolveUserDisplayName(selectedTxForTimeline.lastModifiedBy)}
                        </div>
                      )}
                      {selectedTxForTimeline.remarks && (
                        <div className="col-span-1 sm:col-span-2 w-full pt-2 border-t border-border/40 mt-1 break-words">
                          <span className="font-semibold text-foreground">Remarks:</span>{" "}
                          <span className="italic text-foreground font-medium">"{selectedTxForTimeline.remarks}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Password Unlock Modal */}
      <Dialog open={isUnlockOpen} onOpenChange={setIsUnlockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unlock Full View</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input 
              type="password"
              placeholder="Enter secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && password) {
                  try {
                    const res = await fetch(`${OpenAPI.BASE}/api/v1/Account/ValidateViewPassword`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAccessToken()}` },
                      body: JSON.stringify({ password })
                    });
                    if (await res.json()) {
                      sessionStorage.setItem('view_password', btoa(password));
                      setIsUnlockOpen(false);
                      window.location.reload();
                    } else toast.error("Invalid password!");
                  } catch { toast.error("Validation failed"); }
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnlockOpen(false)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (password) {
                try {
                  const res = await fetch(`${OpenAPI.BASE}/api/v1/Account/ValidateViewPassword`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAccessToken()}` },
                    body: JSON.stringify({ password })
                  });
                  if (await res.json()) {
                    sessionStorage.setItem('view_password', btoa(password));
                    setIsUnlockOpen(false);
                    window.location.reload();
                  } else toast.error("Invalid password!");
                } catch { toast.error("Validation failed"); }
              }
            }}>Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
