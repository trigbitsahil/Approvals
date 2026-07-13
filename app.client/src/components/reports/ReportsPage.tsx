import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart3,
  Wallet,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Check,
  Search,
  RotateCcw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ContractService } from "@/api/services/ContractService";
import { ContractMediaUnitService } from "@/api/services/ContractMediaUnitService";
import { ExpenseTransactionService } from "@/api/services/ExpenseTransactionService";
import { ExpenseService } from "@/api/services/ExpenseService";
import { ExpenseTypeService } from "@/api/services/ExpenseTypeService";
import { VendorService } from "@/api/services/VendorService";
import type { ContractListVM } from "@/api/models/ContractListVM";
import type { ContractMediaUnitListVM } from "@/api/models/ContractMediaUnitListVM";
import type { ExpenseTransactionSearchVM } from "@/api/models/ExpenseTransactionSearchVM";
import type { ExpenseListVM } from "@/api/models/ExpenseListVM";
import type { ExpenseTypeListVM } from "@/api/models/ExpenseTypeListVM";
import type { VendorListVM } from "@/api/models/VendorListVM";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import exportFromJSON from "export-from-json";
import { FileDown } from "lucide-react";

const API_VERSION = "1";

export default function ReportsPage() {
  const [contracts, setContracts] = useState<ContractListVM[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string>("");
  const [mediaUnits, setMediaUnits] = useState<ContractMediaUnitListVM[]>([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<ExpenseTransactionSearchVM[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // New filters
  const [expenses, setExpenses] = useState<ExpenseListVM[]>([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>("all");
  const [expenseTypes, setExpenseTypes] = useState<ExpenseTypeListVM[]>([]);
  const [selectedExpenseTypeId, setSelectedExpenseTypeId] = useState<string>("all");
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [vendors, setVendors] = useState<VendorListVM[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("all");
  const [loadingVendors, setLoadingVendors] = useState(false);

  // List search and pagination
  const [listSearchQuery, setListSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch Contracts and Expense Types on mount
  useEffect(() => {
    const initFilters = async () => {
      setLoadingContracts(true);
      setLoadingVendors(true);
      try {
        const [contractsRes, typesRes, vendorsRes] = await Promise.all([
          ContractService.getApiVContract(API_VERSION),
          ExpenseTypeService.getApiVExpenseType(API_VERSION),
          VendorService.getApiVVendor(API_VERSION)
        ]);

        if (contractsRes.success && contractsRes.data) {
          setContracts(contractsRes.data);
        }
        if (typesRes.success && typesRes.data) {
          setExpenseTypes(typesRes.data);
        }
        if (vendorsRes.success && vendorsRes.data) {
          setVendors(vendorsRes.data);
        }
      } catch (error) {
        console.error("Failed to initialize filters:", error);
        toast.error("Failed to load initial filters");
      } finally {
        setLoadingContracts(false);
        setLoadingVendors(false);
      }
    };
    initFilters();
  }, []);

  // Fetch Expenses when Expense Type changes
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoadingExpenses(true);
      try {
        const typeId = selectedExpenseTypeId === "all" ? undefined : selectedExpenseTypeId;
        const res = await ExpenseService.getApiVExpense(API_VERSION, typeId);
        if (res.success && res.data) {
          setExpenses(res.data);
        } else {
          setExpenses([]);
        }
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        setExpenses([]);
      } finally {
        setLoadingExpenses(false);
      }
    };

    // Reset expense selection when type changes
    setSelectedExpenseId("all");
    fetchExpenses();
  }, [selectedExpenseTypeId]);

  // Fetch Media Units when Contract changes
  useEffect(() => {
    const fetchMediaUnits = async () => {
      if (!selectedContractId) {
        setMediaUnits([]);
        setSelectedMediaIds([]);
        return;
      }
      setLoadingMedia(true);
      try {
        const res = await ContractMediaUnitService.getApiVContractMediaUnit(API_VERSION, selectedContractId);
        if (res.success && res.data) {
          setMediaUnits(res.data);
          setSelectedMediaIds([]); // Reset media selection when contract changes
        }
      } catch (error) {
        console.error("Failed to fetch media units:", error);
        toast.error("Failed to load media units");
      } finally {
        setLoadingMedia(false);
      }
    };
    fetchMediaUnits();
  }, [selectedContractId]);



  // Fetch Transactions when Media selection changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (selectedMediaIds.length === 0) {
        setTransactions([]);
        return;
      }
      setLoadingData(true);
      try {
        const mediaIdParam = selectedMediaIds.join(",");
        const expId = selectedExpenseId === "all" ? undefined : selectedExpenseId;
        const expTypeId = selectedExpenseTypeId === "all" ? undefined : selectedExpenseTypeId;
        const vendId = selectedVendorId === "all" ? undefined : selectedVendorId;

        const res = await ExpenseTransactionService.getExpenseTransactionSearch(
          API_VERSION,
          mediaIdParam,
          expId,
          expTypeId,
          vendId
        );
        if (res.success && res.data) {
          setTransactions(res.data);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast.error("Failed to load report data");
      } finally {
        setLoadingData(false);
        setCurrentPage(1); // Reset to first page on new data fetch
      }
    };
    fetchTransactions();
  }, [selectedMediaIds, selectedExpenseId, selectedExpenseTypeId, selectedVendorId]);

  // Filter and Paginate transactions
  const filteredTransactions = useMemo(() => {
    if (!listSearchQuery) return transactions;

    const query = listSearchQuery.toLowerCase();
    return transactions.filter(t =>
      t.name?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.expenseName?.toLowerCase().includes(query) ||
      t.expenseTypeName?.toLowerCase().includes(query) ||
      t.mediaName?.toLowerCase().includes(query) ||
      t.vendorName?.toLowerCase().includes(query)
    );
  }, [transactions, listSearchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Calculations for summary cards
  const stats = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + (t.expenseAmountApproved || 0), 0);
    const paid = transactions
      .filter((t) => t.isCleared === true)
      .reduce((sum, t) => sum + (t.expenseAmountApproved || 0), 0);
    const unpaid = transactions
      .filter((t) => t.isCleared === false)
      .reduce((sum, t) => sum + (t.expenseAmountApproved || 0), 0);

    return { total, paid, unpaid };
  }, [transactions]);

  const toggleMedia = (id: string) => {
    setSelectedMediaIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const generateReport = () => {
    if (transactions.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const selectedContract = contracts.find((c) => c.contractID === selectedContractId)?.name;
    const selectedMediaNames = selectedMediaIds.length > 0
      ? mediaUnits.filter(m => selectedMediaIds.includes(m.contractMediaUnitID!)).map(m => m.name).join(", ")
      : null;
    const selectedVendor = selectedVendorId === "all" ? null : vendors.find(v => (v.vendorId || (v as any).vendorID) === selectedVendorId)?.name;
    const selectedType = selectedExpenseTypeId === "all" ? null : expenseTypes.find(t => t.expenseTypeID === selectedExpenseTypeId)?.name;
    const selectedExpense = selectedExpenseId === "all" ? null : expenses.find(e => e.expenseID === selectedExpenseId)?.name;

    const createRow = (date: string = "", name: string = "", description: string = "", expense: string = "", type: string = "", media: string = "", vendor: string = "", amount: string | number = "", status: string = "") => ({
      Date: date,
      Name: name,
      Description: description,
      Expense: expense,
      "Expense Type": type,
      "Media Unit": media,
      Vendor: vendor,
      Amount: amount,
      Status: status
    });

    const summaryRows = [
      createRow("REPORT SUMMARY"),
      ...(selectedContract ? [createRow("Contract:", selectedContract)] : []),
      ...(selectedMediaNames ? [createRow("Media Units:", selectedMediaNames)] : []),
      ...(selectedVendor ? [createRow("Vendor:", selectedVendor)] : []),
      ...(selectedType ? [createRow("Expense Type:", selectedType)] : []),
      ...(selectedExpense ? [createRow("Expense Name:", selectedExpense)] : []),
      createRow("Generated On:", new Date().toLocaleString()),
      createRow(""),
    ];

    const dataToExport = [
      ...summaryRows,
      createRow("FINANCIAL SUMMARY"),
      createRow("Total Expense Amount:", `Rs. ${stats.total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
      createRow("Approved Not Paid:", `Rs. ${stats.unpaid.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
      createRow("Approved and Paid:", `Rs. ${stats.paid.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
      createRow(""),
      createRow("TRANSACTION DETAILS"),
      ...transactions.map((t) => createRow(
        t.dateOfExpense ? new Date(t.dateOfExpense).toLocaleDateString() : "N/A",
        t.name || "N/A",
        t.description || "",
        t.expenseName || "N/A",
        t.expenseTypeName || "N/A",
        t.mediaName || "N/A",
        t.vendorName || "N/A",
        t.expenseAmountApproved || 0,
        t.isCleared ? "Cleared" : "Pending"
      ))
    ];

    const fileName = `Expense_Report_${new Date().toISOString().split("T")[0]}`;
    const exportType = exportFromJSON.types.xls;

    exportFromJSON({
      data: dataToExport,
      fileName,
      exportType,
    });

    toast.success("Report generated successfully");
  };

  const removeMedia = (id: string) => {
    setSelectedMediaIds((prev) => prev.filter((i) => i !== id));
  };

  const clearFilters = () => {
    setSelectedContractId("");
    setSelectedMediaIds([]);
    setSelectedExpenseId("all");
    setSelectedExpenseTypeId("all");
    setSelectedVendorId("all");
    toast.success("Filters cleared");
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze expense transactions by contract and media units.
          </p>
        </div>
        <Button
          onClick={generateReport}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center gap-2"
          disabled={loadingData || transactions.length === 0}
        >
          <FileDown className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-card p-4 sm:p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            Filters
          </h2>
          {(selectedContractId || selectedMediaIds.length > 0 || selectedExpenseId !== "all" || selectedExpenseTypeId !== "all" || selectedVendorId !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="  hover:bg-destructive/10"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Contract
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={loadingContracts}
                >
                  <span className="truncate flex-1 text-left">
                    {selectedContractId
                      ? contracts.find((c) => c.contractID === selectedContractId)?.name
                      : "Choose a contract"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search contract..." />
                  <CommandList>
                    <CommandEmpty>No contract found.</CommandEmpty>
                    <CommandGroup>
                      {contracts.map((contract) => (
                        <CommandItem
                          key={contract.contractID}
                          value={contract.name || ""}
                          onSelect={() => {
                            setSelectedContractId(contract.contractID!);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedContractId === contract.contractID ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {contract.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Media (Multi-select)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-auto min-h-[40px] py-2 px-3"
                  disabled={!selectedContractId || loadingMedia}
                >
                  <div className="flex flex-wrap gap-1 items-center flex-1 overflow-hidden mr-2">
                    {selectedMediaIds.length > 0 ? (
                      selectedMediaIds.map((id) => {
                        const media = mediaUnits.find((m) => m.contractMediaUnitID === id);
                        return (
                          <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1 max-w-[180px] sm:max-w-[300px]">
                            <span className="truncate flex-1">{media?.name || id}</span>
                            <span
                              role="button"
                              className="rounded-full hover:bg-muted-foreground/20 p-0.5 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMedia(id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </span>
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">
                        {loadingMedia ? "Loading media..." : "Select media units"}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search media..." />
                  <CommandList>
                    <CommandEmpty>No media found.</CommandEmpty>
                    <CommandGroup>
                      {mediaUnits.map((media) => (
                        <CommandItem
                          key={media.contractMediaUnitID}
                          value={media.name || ""}
                          onSelect={() => toggleMedia(media.contractMediaUnitID!)}
                          className="cursor-pointer flex items-center gap-3 py-2"
                        >
                          <Checkbox
                            checked={selectedMediaIds.includes(media.contractMediaUnitID!)}
                            onCheckedChange={() => toggleMedia(media.contractMediaUnitID!)}
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0"
                          />
                          <span className="flex-1 text-sm leading-snug">
                            {media.name}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Vendor Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Select Vendor (Optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={loadingVendors}
                >
                  <span className="truncate flex-1 text-left">
                    {selectedVendorId === "all"
                      ? "All Vendors"
                      : vendors.find((v) => (v.vendorId || (v as any).vendorID) === selectedVendorId)?.name || "All Vendors"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search vendor..." />
                  <CommandList>
                    <CommandEmpty>No vendor found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => setSelectedVendorId("all")}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedVendorId === "all" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        All Vendors
                      </CommandItem>
                      {vendors.map((vendor) => {
                        const vId = vendor.vendorId || (vendor as any).vendorID;
                        return (
                          <CommandItem
                            key={vId || vendor.name}
                            value={`${vendor.name} ${vId}`}
                            onSelect={() => {
                              if (vId) {
                                setSelectedVendorId(vId);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedVendorId === vId ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {vendor.name}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Expense Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Select Expense Type (Optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  <span className="truncate flex-1 text-left">
                    {selectedExpenseTypeId === "all"
                      ? "All Expense Types"
                      : expenseTypes.find((t) => t.expenseTypeID === selectedExpenseTypeId)?.name || "All Expense Types"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search expense type..." />
                  <CommandList>
                    <CommandEmpty>No type found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => setSelectedExpenseTypeId("all")}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedExpenseTypeId === "all" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        All Expense Types
                      </CommandItem>
                      {expenseTypes.map((type) => (
                        <CommandItem
                          key={type.expenseTypeID}
                          value={type.name || ""}
                          onSelect={() => {
                            setSelectedExpenseTypeId(type.expenseTypeID!);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedExpenseTypeId === type.expenseTypeID ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {type.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Expense Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Select Expense (Optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={loadingExpenses}
                >
                  <span className="truncate flex-1 text-left">
                    {loadingExpenses ? (
                      "Loading expenses..."
                    ) : (
                      selectedExpenseId === "all"
                        ? "All Expenses"
                        : expenses.find((e) => e.expenseID === selectedExpenseId)?.name || "All Expenses"
                    )}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search expense..." />
                  <CommandList>
                    <CommandEmpty>No expense found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => setSelectedExpenseId("all")}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedExpenseId === "all" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        All Expenses
                      </CommandItem>
                      {expenses.map((exp) => (
                        <CommandItem
                          key={exp.expenseID}
                          value={`${exp.name} ${exp.expenseID}`}
                          onSelect={() => {
                            if (exp.expenseID) {
                              setSelectedExpenseId(exp.expenseID);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedExpenseId === exp.expenseID ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {exp.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense Amount</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Total approved across selected media</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Approved Not Paid</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ₹{stats.unpaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Pending payment (Not Cleared)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Approved and Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{stats.paid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Successfully cleared transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 bg-muted/30 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
            {loadingData && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in list..."
              value={listSearchQuery}
              onChange={(e) => {
                setListSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Expense Type</TableHead>
                <TableHead>Media Unit</TableHead>
                {/* <TableHead>Category</TableHead> */}
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((t) => (
                  <TableRow key={t.expenseTransactionID} className="hover:bg-muted/20">
                    <TableCell className="font-medium">
                      {t.dateOfExpense ? new Date(t.dateOfExpense).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{t.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{t.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary/90">{t.expenseTypeName || "N/A"}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{t.expenseName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={t.mediaName || ""}>
                        {t.mediaName || "N/A"}
                      </div>
                    </TableCell>
                    {/* <TableCell>{t.category || "N/A"}</TableCell> */}
                    <TableCell className="text-right font-semibold">
                      ₹{t.expenseAmountApproved?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          "w-20 justify-center",
                          t.isCleared
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        )}
                      >
                        {t.isCleared ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {loadingData ? "Fetching data..." : listSearchQuery ? "No matching transactions found." : "No transactions found. Select filters to view report."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {(filteredTransactions.length > 0 || transactions.length > 0) && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-muted/20 gap-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
              </span> of{" "}
              <span className="font-medium">{filteredTransactions.length}</span> results
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Rows:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(val) => {
                      setItemsPerPage(parseInt(val));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 50, 100].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Page:</span>
                  <Select
                    value={currentPage.toString()}
                    onValueChange={(val) => setCurrentPage(parseInt(val))}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={currentPage.toString()} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <SelectItem key={p} value={p.toString()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, i, arr) => (
                      <React.Fragment key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && <span className="text-muted-foreground px-1">...</span>}
                        <Button
                          variant={currentPage === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(p)}
                          className={cn("h-8 w-8 p-0", currentPage === p ? "bg-primary text-primary-foreground" : "")}
                        >
                          {p}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
