import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DistributorService } from "@/api/services/DistributorService";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import { UserService } from "@/api/services/UserService";
import type { DistributorListVM } from "@/api/models/DistributorListVM";
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
  Truck,
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

export default function DistributorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [distributor, setDistributor] = useState<DistributorListVM | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
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
      const [distRes, summaryRes, txRes, userRes] = await Promise.all([
        DistributorService.getDistributorById(id),
        DistributorService.getDistributorSummary(id).catch(() => null),
        BankTransactionService.getBankTransactionsByDistributorId(id, selectedStatus),
        UserService.getApiVUser('1').catch(() => null)
      ]);

      if (distRes?.success && distRes?.data) {
        setDistributor(distRes.data);
      } else {
        const allDistRes = await DistributorService.getApiVDistributor('1');
        const found = allDistRes?.data?.find(d => d.distributorId === id);
        if (found) setDistributor(found);
      }

      if (summaryRes?.data) {
        setSummary(summaryRes.data);
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

      if (userRes?.data) {
        setUsers(userRes.data);
      }
    } catch (error) {
      toast.error("Failed to load distributor details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (status: string) => {
    if (!id) return;
    try {
      const txRes = await BankTransactionService.getBankTransactionsByDistributorId(id, status);
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
      toast.error("Failed to load distributor transactions.");
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

        if (sortColumn === "toEntity") {
          aVal = a.toBankName || a.vendorName || "";
          bVal = b.toBankName || b.vendorName || "";
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

  const isUnlocked = !!sessionStorage.getItem('view_password');
  const divisor = isUnlocked ? 1 : 1000;

  const totalTransactionsCount = summary?.totalTransactionsCount ?? filteredTransactions.length;

  const totalReceivedAmount = summary?.totalReceivedAmount != null
    ? summary.totalReceivedAmount / divisor
    : filteredTransactions
        .filter(t => t.isPaidToDistributor || t.isConfirm)
        .reduce((sum, t) => sum + (t.deposit || t.amount || 0), 0);

  const totalSettledAmount = summary?.totalPaidAmount != null
    ? summary.totalPaidAmount / divisor
    : filteredTransactions
        .filter(t => t.isConfirm)
        .reduce((sum, t) => sum + (t.withdrawal || t.amount || 0), 0);

  const distributorRunningBalance = summary?.runningBalance != null
    ? summary.runningBalance / divisor
    : (totalReceivedAmount - totalSettledAmount);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading distributor ledger...</p>
        </div>
      </div>
    );
  }

  if (!distributor) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate("/distributors")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Distributors
        </Button>
        <div className="text-center py-12">
          <p className="text-lg font-medium text-foreground">Distributor not found</p>
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
            onClick={() => navigate("/distributors")}
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Distributors
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors" onClick={handleHeaderIconClick}>
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {distributor.name}
              </h1>
               
            </div>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
              distributor.isVoided
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            }`}
          >
            {distributor.isVoided ? "Inactive / Voided" : "Active Distributor"}
          </span>
        </div>
      </div>

      {/* Info & Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Info Card */}
        <Card className="lg:col-span-2 border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Distributor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{distributor.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{distributor.phone || "No phone provided"}</span>
              </div>
              {distributor.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={distributor.website.startsWith("http") ? distributor.website : `https://${distributor.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-primary hover:text-primary/80 truncate"
                  >
                    {distributor.website}
                  </a>
                </div>
              )}
              {distributor.address && (
                <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{distributor.address}</span>
                </div>
              )}
            </div>

            {(distributor.gstNumber || distributor.panNumber) && (
              <div className="pt-2 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
                {distributor.gstNumber && <div><span className="font-semibold text-foreground">GST:</span> {distributor.gstNumber}</div>}
                {distributor.panNumber && <div><span className="font-semibold text-foreground">PAN:</span> {distributor.panNumber}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Received Card */}
        <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Total Received
              <ArrowDownLeft className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-extrabold text-foreground">
              ₹{totalReceivedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-500 font-medium mt-1">Disbursed from Source Bank</p>
          </CardContent>
        </Card>

        {/* Total Settled Card */}
        <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Total Paid
              <ArrowUpRight className="h-4 w-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-extrabold text-foreground">
              ₹{totalSettledAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-red-500 font-medium mt-1">Paid to Bank / Vendor</p>
          </CardContent>
        </Card>

        {/* Running Balance Card */}
        <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Running Balance
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-extrabold text-foreground">
              ₹{distributorRunningBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-500 font-medium mt-1">Currently Held / Pending</p>
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
              Complete history of bank transactions for this distributor
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
                  <SelectItem value="paid">Paid</SelectItem>
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
                  <TableHead className="font-semibold text-foreground">
                    <Button variant="ghost" onClick={() => handleSort("transactionType")} className="font-semibold px-0 hover:bg-transparent text-foreground">
                      Type <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
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
                    <Button variant="ghost" onClick={() => handleSort("toEntity")} className="font-semibold px-0 hover:bg-transparent text-foreground">
                      To / Destination <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
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
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      No transactions found for this distributor.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((tx, index) => {
                    const destinationBankName = tx.toBankName || (tx.bankName && tx.bankName !== tx.fromBankName ? tx.bankName : null);
                    const toEntity = destinationBankName ? `Bank: ${destinationBankName}` : tx.vendorName ? `Vendor: ${tx.vendorName}` : "-";
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
                        <TableCell>
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-foreground">
                            {tx.transactionType || "General"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          ₹{(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-foreground">{tx.fromBankName || "-"}</TableCell>
                        <TableCell className="text-foreground">{toEntity}</TableCell>
                        <TableCell>
                          {tx.isConfirm ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              Paid to {destinationBankName || tx.vendorName || "Destination"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              <ArrowDownLeft className="h-3.5 w-3.5" />
                              Received from {tx.fromBankName || "Bank"}
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
              Transaction Timeline & History
            </DialogTitle>
          </DialogHeader>

          {selectedTxForTimeline && (
            <div className="space-y-5 sm:space-y-6 pt-1">
              <div className="p-3.5 sm:p-4 bg-muted/40 rounded-xl border border-border/60 flex items-center justify-between gap-3 shadow-xs">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground">Approval Request</p>
                  <p className="text-sm sm:text-base font-bold text-foreground truncate">{selectedTxForTimeline.approvalName || "Bank Transaction"}</p>
                </div>
                <div className="text-right shrink-0 flex items-center gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Total Disbursed</p>
                    <p className="text-sm sm:text-base font-extrabold text-foreground">
                      ₹{(selectedTxForTimeline.deposit || selectedTxForTimeline.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  {selectedTxForTimeline.isConfirm && (
                    <div className="border-l border-border/60 pl-3 sm:pl-4">
                      <p className="text-xs font-semibold text-muted-foreground">Actual Paid</p>
                      <p className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{(selectedTxForTimeline.withdrawal > 0 ? selectedTxForTimeline.withdrawal : selectedTxForTimeline.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-7 border-l-2 dark:border-gray-600 border-gray-300 ml-3 sm:ml-4">
                {/* Step 1: Received from Bank */}
                <div className="relative">
                  <div className="absolute -left-[37px] sm:-left-[45px] top-0.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-extrabold ring-4 ring-background shadow-xs">
                    1
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <h4 className="text-sm sm:text-base font-bold text-foreground">Received by Distributor</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shrink-0">
                        Disbursed
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                      Received from <span className="font-semibold text-foreground">{selectedTxForTimeline.fromBankName || "From Bank"}</span>:{" "}
                      <span className="font-bold text-foreground">₹{(selectedTxForTimeline.deposit || selectedTxForTimeline.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
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

                {/* Step 2: Settled to Destination */}
                <div className="relative">
                  <div className={`absolute -left-[37px] sm:-left-[45px] top-0.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full ${selectedTxForTimeline.isConfirm ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border"} flex items-center justify-center text-xs sm:text-sm font-extrabold ring-4 ring-background shadow-xs`}>
                    2
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <h4 className="text-sm sm:text-base font-bold text-foreground">Paid</h4>
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
                      Target Destination:{" "}
                      <span className="font-semibold text-foreground">
                        {selectedTxForTimeline.toBankName ? `To Bank: ${selectedTxForTimeline.toBankName}` : selectedTxForTimeline.vendorName ? `Vendor: ${selectedTxForTimeline.vendorName}` : "Destination Bank / Entity"}
                      </span>
                    </p>
                    <div className="mt-3 text-xs sm:text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 bg-card/60 p-3 rounded-xl border border-border/60 shadow-xs min-w-0">
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground">Status:</span>{" "}
                        {selectedTxForTimeline.isConfirm ? "Confirmed" : "Pending Confirmation"}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground">Confirmed Paid:</span>{" "}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {selectedTxForTimeline.isConfirm 
                            ? `₹${(selectedTxForTimeline.withdrawal > 0 ? selectedTxForTimeline.withdrawal : selectedTxForTimeline.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                            : "₹0.00"}
                        </span>
                        {selectedTxForTimeline.isConfirm && selectedTxForTimeline.withdrawal > 0 && selectedTxForTimeline.withdrawal < (selectedTxForTimeline.deposit || selectedTxForTimeline.amount) && (
                          <span className="text-[10px] text-muted-foreground block font-medium">
                            (out of ₹{(selectedTxForTimeline.deposit || selectedTxForTimeline.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })})
                          </span>
                        )}
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

