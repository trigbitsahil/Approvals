import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DebtorService } from "@/api/services/DebtorService";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import type { DebtorListVM } from "@/api/models/DebtorListVM";
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
import { DatePickerInput } from "@/components/ui/date-picker-input";
import {
  ArrowLeft,
  UserCheck,
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
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function DebtorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [debtor, setDebtor] = useState<DebtorListVM | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTxForTimeline, setSelectedTxForTimeline] = useState<any | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Sorting & Pagination state
  const [sortColumn, setSortColumn] = useState<string>("createdDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      const [debtorRes, txRes] = await Promise.all([
        DebtorService.getDebtorById(id),
        BankTransactionService.getBankTransactionsByDebtorId(id, selectedStatus)
      ]);

      if (debtorRes?.success && debtorRes?.data) {
        setDebtor(debtorRes.data);
      } else {
        const allDebtorsRes = await DebtorService.getApiVDebtor('1');
        const found = allDebtorsRes?.data?.find(d => d.debtorId === id);
        if (found) setDebtor(found);
      }

      if (txRes?.data) {
        const txData = txRes.data;
        const isUnlocked = !!sessionStorage.getItem('view_password');
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
      toast.error("Failed to load debtor details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (status: string) => {
    if (!id) return;
    try {
      const txRes = await BankTransactionService.getBankTransactionsByDebtorId(id, status);
      if (txRes?.data) {
        const txData = txRes.data;
        const isUnlocked = !!sessionStorage.getItem('view_password');
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
      toast.error("Failed to load debtor transactions.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      fetchTransactions(selectedStatus);
    }
  }, [selectedStatus]);

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
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        if (sortColumn === "toBankName") {
          aVal = a.toBankName || a.bankName || a.fromBankName || "";
          bVal = b.toBankName || b.bankName || b.fromBankName || "";
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
  }, [startDate, endDate, selectedStatus, pageSize]);

  const totalTransactionsCount = filteredTransactions.length;

  const totalReceivedAmount = filteredTransactions
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalSettledAmount = filteredTransactions
    .filter(t => t.isConfirm)
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const toRecoverAmount = filteredTransactions
    .filter(t => !t.isConfirm)
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading debtor ledger...</p>
        </div>
      </div>
    );
  }

  if (!debtor) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate("/debtors")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Debtors
        </Button>
        <div className="text-center py-12">
          <p className="text-lg font-medium text-foreground">Debtor not found</p>
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
            onClick={() => navigate("/debtors")}
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Debtors
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors" onClick={handleHeaderIconClick}>
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {debtor.name}
              </h1>
              
            </div>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
              debtor.isVoided
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            }`}
          >
            {debtor.isVoided ? "Inactive / Voided" : "Active Debtor"}
          </span>
        </div>
      </div>

      {/* Info & Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Info Card */}
        <Card className="lg:col-span-2 border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Debtor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{debtor.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{debtor.phone || "No phone provided"}</span>
              </div>
              {debtor.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={debtor.website.startsWith("http") ? debtor.website : `https://${debtor.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-primary hover:text-primary/80 truncate"
                  >
                    {debtor.website}
                  </a>
                </div>
              )}
              {debtor.address && (
                <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{debtor.address}</span>
                </div>
              )}
            </div>

            {(debtor.gstNumber || debtor.panNumber) && (
              <div className="pt-2 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
                {debtor.gstNumber && <div><span className="font-semibold text-foreground">GST:</span> {debtor.gstNumber}</div>}
                {debtor.panNumber && <div><span className="font-semibold text-foreground">PAN:</span> {debtor.panNumber}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Invoiced Card */}
        <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Total Invoiced / Received
              <ArrowDownLeft className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-extrabold text-foreground">
              ₹{totalReceivedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-500 font-medium mt-1">Receipt Requested from Debtor</p>
          </CardContent>
        </Card>

        {/* To Receive Card */}
        <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              To Receive
              <Clock className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-extrabold text-foreground">
              ₹{toRecoverAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-500 font-medium mt-1">Currently Pending</p>
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
              Complete history of bank transactions for this debtor
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Status Filter Pill */}
            <div className="flex items-center gap-1.5 bg-muted/20 p-1 px-2.5 rounded-xl border border-border/50 shadow-xs w-full sm:w-[170px]">
              <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-7 flex-1 w-full border-none bg-transparent shadow-none text-xs font-medium focus:ring-0 focus:ring-offset-0 px-1 justify-between text-foreground">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent align="start" className="rounded-xl border-border/60 bg-popover text-popover-foreground shadow-md">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
            <Table className="min-w-[900px]">
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
                    <Button variant="ghost" onClick={() => handleSort("toBankName")} className="font-semibold px-0 hover:bg-transparent text-foreground">
                      Bank <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
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
                  <TableHead className="font-semibold text-foreground text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No transactions found for this debtor.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((tx, index) => {
                    const bankDisplayName = tx.toBankName || tx.bankName || tx.fromBankName || "-";
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
                        <TableCell className="text-foreground">{bankDisplayName}</TableCell>
                        <TableCell>
                          {tx.isConfirm ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              Settled to {bankDisplayName}
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
               Debtor Receipt Timeline
            </DialogTitle>
          </DialogHeader>

          {selectedTxForTimeline && (
            <div className="space-y-5 sm:space-y-6 pt-1">
              <div className="p-3.5 sm:p-4 bg-muted/40 rounded-xl border border-border/60 flex items-center justify-between gap-3 shadow-xs">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground">Approval Request</p>
                  <p className="text-sm sm:text-base font-bold text-foreground truncate">{selectedTxForTimeline.approvalName || "Debtor Transaction"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-muted-foreground">Amount</p>
                  <p className="text-sm sm:text-base font-extrabold text-foreground">₹{(selectedTxForTimeline.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-7 border-l-2 dark:border-gray-600 border-gray-300 ml-3 sm:ml-4">
                {/* Single Direct Step: Money Received from Debtor into Bank */}
                <div className="relative">
                  <div className={`absolute -left-[37px] sm:-left-[45px] top-0.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full ${selectedTxForTimeline.isConfirm ? "bg-primary text-white" : "bg-primary text-primary-foreground"} flex items-center justify-center text-xs sm:text-sm font-extrabold ring-4 ring-background shadow-xs`}>
                    1
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <h4 className="text-sm sm:text-base font-bold text-foreground">
                        {selectedTxForTimeline.isConfirm ? "Payment Received & Confirmed" : "Payment Received (Pending Confirmation)"}
                      </h4>
                      {selectedTxForTimeline.isConfirm ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0">
                          Confirmed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 shrink-0">
                          Pending Bank Confirmation
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                      Received from Debtor <span className="font-semibold text-foreground">{debtor.name}</span> into bank <span className="font-semibold text-foreground">{selectedTxForTimeline.toBankName || selectedTxForTimeline.bankName || "Destination Bank"}</span>
                    </p>
                    <div className="mt-3 text-xs sm:text-sm text-muted-foreground space-y-2 bg-card/60 p-3 rounded-xl border border-border/60 shadow-xs min-w-0">
                      {selectedTxForTimeline.isConfirm && (
                        <>
                          <div className="pt-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="font-medium text-muted-foreground">Received Date:</span>
                            <span className="font-semibold text-foreground">
                              {selectedTxForTimeline.lastModifiedDate ? format(new Date(selectedTxForTimeline.lastModifiedDate), "MMM dd, yyyy HH:mm") : (selectedTxForTimeline.createdDate ? format(new Date(selectedTxForTimeline.createdDate), "MMM dd, yyyy HH:mm") : "-")}
                            </span>
                          </div>
                          {selectedTxForTimeline.lastModifiedBy && (
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 break-all">
                              <span className="font-medium text-muted-foreground shrink-0">Confirmed By:</span>
                              <span className="font-semibold text-foreground">{selectedTxForTimeline.lastModifiedBy}</span>
                            </div>
                          )}
                          {selectedTxForTimeline.remarks && (
                            <div className="border-t border-border/40 pt-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 break-words">
                              <span className="font-medium text-muted-foreground shrink-0">Remarks:</span>
                              <span className="font-semibold text-foreground italic sm:text-right">"{selectedTxForTimeline.remarks}"</span>
                            </div>
                          )}
                        </>
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
