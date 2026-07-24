"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ContractService } from "@/api/services/ContractService";
import { ContractFormDialog } from "./ContractFormDialog";
import ConfirmationModal from "@/components/ConfirmationModal";
import { toast } from "sonner";
import { Search, MoreHorizontal, Edit3, Trash2, Plus, ArrowUpDown, ChevronLeft, ChevronRight, FileSignature } from "lucide-react";
import { format } from "date-fns";

const API_VERSION = "1";

export function ContractsList() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);

  // Delete Confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>("createdDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await ContractService.getApiVContract(API_VERSION);
      if (Array.isArray(response)) {
        setContracts(response);
      } else if (response && (response as any).data) {
        setContracts((response as any).data);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleAddContract = () => {
    setSelectedContract(null);
    setIsDialogOpen(true);
  };

  const handleEditContract = (contract: any) => {
    setSelectedContract(contract);
    setIsDialogOpen(true);
  };

  const confirmDelete = (contractId: string) => {
    setContractToDelete(contractId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteContract = async () => {
    if (!contractToDelete) return;
    
    try {
      await ContractService.deleteContract(contractToDelete, API_VERSION);
      toast.success("Contract deleted successfully");
      fetchContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast.error("Failed to delete contract");
    } finally {
      setDeleteConfirmOpen(false);
      setContractToDelete(null);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter, sort, and paginate
  const filteredAndSortedContracts = useMemo(() => {
    // 1. Filter
    let result = contracts.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.number && c.number.toLowerCase().includes(q)) ||
        (c.contractId && c.contractId.toLowerCase().includes(q))
      );
    });

    // 2. Sort
    result = result.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [contracts, searchQuery, sortColumn, sortDirection]);

  // 3. Paginate
  const totalPages = Math.ceil(filteredAndSortedContracts.length / pageSize) || 1;
  const paginatedContracts = filteredAndSortedContracts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-8 pt-4 sm:pt-6 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileSignature className="h-8 w-8 text-primary" /> Contracts
            </h2>
            <p className="text-muted-foreground mt-2">
              Manage your company contracts.
            </p>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <Button onClick={handleAddContract} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Add Contract
            </Button>
          </div>
        </div>

              <Card className="border-none shadow-md overflow-hidden p-0 gap-0">
          <CardHeader className="p-4 sm:p-6 border-b bg-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Contract List</CardTitle>
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                  {filteredAndSortedContracts.length} Total
                </span>
              </div>
              <div className="relative group w-full sm:w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full h-10 rounded-xl border-muted-foreground/20 bg-muted/30 focus-visible:ring-primary focus-visible:bg-background transition-all"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table className="w-full min-w-[600px]">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[120px] font-semibold">
                      <Button variant="ghost" onClick={() => handleSort("number")} className="font-semibold px-0 hover:bg-transparent">
                        Number <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button variant="ghost" onClick={() => handleSort("name")} className="font-semibold px-0 hover:bg-transparent">
                        Name <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button variant="ghost" onClick={() => handleSort("createdBy")} className="font-semibold px-0 hover:bg-transparent">
                        Created By <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button variant="ghost" onClick={() => handleSort("createdDate")} className="font-semibold px-0 hover:bg-transparent">
                        Created Date <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex justify-center items-center text-muted-foreground">
                          <span className="animate-spin mr-2">⏳</span> Loading...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No contracts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedContracts.map((contract) => (
                      <TableRow key={contract.contractId} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium text-foreground">
                          {contract.number || "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {contract.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contract.createdBy || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contract.createdDate ? format(new Date(contract.createdDate), 'MMM dd, yyyy') : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuItem onClick={() => handleEditContract(contract)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => confirmDelete(contract.contractId)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            {!loading && filteredAndSortedContracts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t bg-muted/20 gap-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground w-full sm:w-auto justify-center sm:justify-start">
                  <span>Show</span>
                  <select 
                    className="border rounded px-2 py-1 bg-background"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                  <div className="text-sm text-muted-foreground mr-4">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ContractFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchContracts}
        contractToEdit={selectedContract}
      />

      <ConfirmationModal
        open={deleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteContract}
        message="Delete Contract"
        description="Are you sure you want to delete this contract? This action cannot be undone."
        yesLabel="Delete"
        noLabel="Cancel"
        yesVariant="destructive"
      />
    </div>
  );
}
