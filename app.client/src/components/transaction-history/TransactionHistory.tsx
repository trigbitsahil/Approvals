"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, History as HistoryIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { WarehouseTransactionService } from "../../api/services/WarehouseTransactionService";
import { UserService } from "../../api/services/UserService";
import { WarehouseTransactionHistoryVM } from "../../api/models/WarehouseTransactionHistoryVM";


export const TransactionHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [transactions, setTransactions] = useState<WarehouseTransactionHistoryVM[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Get logged in user email
      const userRes = await UserService.getLoggedInUser("1");
      const userEmail = userRes.data?.email;

      // 2. Fetch history
      const response = await WarehouseTransactionService.getWarehouseTransactionHistory("1", userEmail || undefined);
      if (response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch transaction history:", error);
      toast.error("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredData = transactions.filter((item) =>
    (item.barcode || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <HistoryIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Transaction History</h1>
            <p className="text-sm text-muted-foreground mt-0.5">View and export item transaction summaries</p>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 overflow-hidden">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <select
                className="bg-background border border-input h-9 rounded-md px-3 text-sm font-medium focus:ring-2  outline-none transition-all"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">records per page</span>
            </div>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground transition-colors" />
              <Input
                placeholder="Search by barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-input focus:ring-2 transition-all rounded-lg h-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 pl-6">Item Barcode</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 text-right pr-6">Total Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm">Loading transactions...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/40 transition-colors border-b border-border/40 last:border-0 group">
                      <TableCell className="py-2 pl-6 font-medium">
                        <Badge
                          variant="secondary"
                          className="bg-primary/90 hover:bg-primary border-none px-2.5 py-0.5 text-white text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                          onClick={() => item.barcode && navigate(`/Order/transaction-history/${item.barcode}`)}
                        >
                          {item.barcode || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 font-bold text-sm text-foreground/80 font-mono tracking-tight text-right pr-6">
                        {item.quantity?.toFixed(4) || "0.0000"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Search className="w-8 h-8 opacity-20" />
                        <p className="italic text-sm">No transactions found matching your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* FOOTER / PAGINATION */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-5 bg-muted/10 border-t border-border/50 gap-4">
            <div className="text-xs font-medium text-muted-foreground tracking-tight">
              Showing <span className="text-foreground font-bold">1</span> to <span className="text-foreground font-bold">{filteredData.length}</span> of <span className="text-foreground font-bold">{filteredData.length}</span> entries
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs font-bold gap-1 rounded-lg">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>
              <Button variant="default" size="sm" className="h-8 w-8 p-0 text-xs font-bold   shadow-md rounded-lg">
                1
              </Button>
              <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs font-bold gap-1 rounded-lg">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
