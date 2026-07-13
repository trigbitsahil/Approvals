"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  RefreshCw,
  PlusCircle,
  MinusCircle
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { WarehouseTransactionService } from "@/api/services/WarehouseTransactionService";
import { WarehouseUserService } from "@/api/services/WarehouseUserService";
import { UserService } from "@/api/services/UserService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

// Constants for Inventory Adjustment
const IA_ORDER_TYPE_ID = "OdrType_2026_03_16fbcd893b-1a18-426d-9f06-d999630af7f6";

export const AdjustmentList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("2026-02-21");
  const [endDate, setEndDate] = useState("2026-03-23");
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Get logged-in user and roles
        const [userRes, roleRes] = await Promise.all([
          UserService.getLoggedInUser("1"),
          UserService.getMyRoles("1")
        ]);
        
        const roles = Array.isArray(roleRes.data) ? roleRes.data : [];
        const isSuperAdmin = (roles.includes("SuperAdmin") || roles.includes("WarehouseAdmin"));
        const userEmail = userRes.data?.email;

        let warehouseId: string | undefined = undefined;

        if (!isSuperAdmin) {
          // Get WarehouseId for non-admin users
          const whUsersRes = await WarehouseUserService.warehouseUserGet("1");
          const loggedUserWH = whUsersRes.data?.find((wu: any) => wu.userEmail === userEmail || wu.email === userEmail);
          warehouseId = loggedUserWH?.warehouseId;

          if (!warehouseId) {
            console.warn("No warehouse associated with your account.");
          }
        }

        // 3. Fetch Orders (Filtering by warehouse only if NOT SuperAdmin)
        const ordersRes = await OrderHeaderService.orderHeaderGet("1", undefined, warehouseId);

        if (ordersRes.data) {
          const iaOrders = ordersRes.data
            .filter((o: any) => o.orderTypeId === IA_ORDER_TYPE_ID)
            .map((o: any) => ({
              id: o.orderHeaderId,
              refNum: o.clientOrderNum || "-",
              comments: o.comments || o.discrepancyDetail || "-",
              client: o.shipFromName || o.billToName || "-",
              recordedBy: o.createdBy || "-",
              recordedAt: o.createdDate ? new Date(o.createdDate).toLocaleDateString() : "-",
            }));
          setAdjustments(iaOrders);
        }
      } catch (error) {
        console.error("Failed to fetch adjustments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTransactions = async (orderId: string) => {
    try {
      setLoadingTransactions(true);
      setIsModalOpen(true);
      setSelectedOrderId(orderId);
      const res = await WarehouseTransactionService.warehouseTransactionGet("1", orderId);
      if (res.data) {
        setTransactions(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Failed to load details");
    } finally {
      setLoadingTransactions(false);
    }
  };

  const filteredAdjustments = adjustments.filter(adj =>
    adj.refNum.toLowerCase().includes(search.toLowerCase()) ||
    adj.client.toLowerCase().includes(search.toLowerCase()) ||
    adj.recordedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-6 px-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Inventory Adjustments</h1>
          <p className="text-sm text-muted-foreground italic flex items-center gap-2">
            <LayoutList className="w-4 h-4" /> Manage and track all warehouse stock adjustments
          </p>
        </div>
        <Button
          onClick={() => navigate("/Inventory/Adjustments/Create")}
          className="bg-primary hover:opacity-90 text-primary-foreground font-bold h-10 px-6 rounded-lg shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create Adjustment
        </Button>
      </div>

      {/* FILTERS CARD */}
      <Card className="border-t-2 border-t-primary shadow-md bg-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-muted/30 focus:ring-primary rounded-xl dark:[color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-muted/30 focus:ring-primary rounded-xl dark:[color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 md:col-span-2">
              <Button variant="secondary" className="flex-1 font-bold px-6 h-10 rounded-xl group">
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" /> Refresh
              </Button>
              <Button variant="secondary" className="flex-1 font-bold px-6 h-10 rounded-xl text-primary border-primary/20 hover:bg-primary/5">
                View All Adjustments
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE SECTION */}
      <Card className="shadow-lg border-none ring-1 ring-border/50 bg-card">
        <CardHeader className="bg-muted/20 border-b pb-4 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <select className="bg-transparent border-none text-sm font-bold focus:ring-0 text-foreground">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-xs text-muted-foreground font-medium">records per page</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/50" />
              <Input
                placeholder="Search Adjustments..."
                className="pl-9 bg-muted/30 focus:ring-primary h-9 rounded-xl border-none w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider pl-6 border-r px-4">Adjustment</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4 whitespace-nowrap">Ref #</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4 whitespace-nowrap">Comments</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4 whitespace-nowrap">Recorded By</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider pr-6 text-right px-4 whitespace-nowrap">Recorded At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground italic animate-pulse">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Loading adjustments...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAdjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                      No adjustments found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdjustments.map((adj) => (
                    <TableRow key={adj.id} className="transition-colors border-b last:border-0 border-border/50">
                      <TableCell className="pl-6 border-r px-4">
                        <Button
                          size="sm"
                          onClick={() => fetchTransactions(adj.id)}
                          className="bg-primary hover:opacity-90 text-primary-foreground font-bold h-7 px-3 text-[10px] uppercase rounded shadow-sm"
                        >
                          Details
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium border-r px-4 whitespace-nowrap">{adj.refNum}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate border-r px-4">{adj.comments}</TableCell>
                      <TableCell className="text-sm border-r px-4 whitespace-nowrap">{adj.recordedBy}</TableCell>
                      <TableCell className="pr-6 text-right font-mono text-xs opacity-80 px-4 whitespace-nowrap">{adj.recordedAt}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden flex flex-col divide-y divide-border/50">
            {loading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3 text-muted-foreground italic animate-pulse">
                <RefreshCw className="w-6 h-6 animate-spin" />
                Loading adjustments...
              </div>
            ) : filteredAdjustments.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground italic text-sm">
                No adjustments found.
              </div>
            ) : (
              filteredAdjustments.map((adj) => (
                <div key={adj.id} className="p-5 flex flex-col gap-4 bg-card active:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ref Number</span>
                      <span className="font-bold text-sm tracking-tight">{adj.refNum}</span>
                    </div>
                    <Badge variant="outline" className="font-bold border-primary/20 bg-primary/10 text-primary h-6 text-[10px] uppercase">
                      {adj.client}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recorded By</span>
                      <span className="text-xs text-muted-foreground truncate">{adj.recordedBy}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</span>
                      <span className="text-xs font-mono opacity-80">{adj.recordedAt}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-t border-dashed border-border/50 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Comments</span>
                    <p className="text-xs text-muted-foreground italic line-clamp-2 leading-relaxed">
                      {adj.comments}
                    </p>
                  </div>

                  <Button
                    onClick={() => fetchTransactions(adj.id)}
                    className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold h-9 rounded-xl shadow-sm text-xs uppercase"
                  >
                    View Details
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center py-4 px-6 bg-muted/10 border-t rounded-b-xl">
            <span className="text-xs text-muted-foreground font-medium tracking-tight">
              Showing {filteredAdjustments.length > 0 ? 1 : 0} to {filteredAdjustments.length} of {filteredAdjustments.length} entries
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" disabled className="h-8 w-8 hover:bg-primary/10 text-primary">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Badge className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-lg cursor-pointer">1</Badge>
              <Button variant="ghost" size="icon" disabled className="h-8 w-8 hover:bg-primary/10 text-primary">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[92vw] md:w-full md:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-2xl ">
          <DialogHeader className=" px-6 py-4 rounded-t-2xl bg-primary/90">
            <DialogTitle className=" font-bold flex text-white items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Adjustment Details
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
              <div className="flex items-center gap-3 text-sm font-medium">
                <select className="border rounded-md px-2 h-9 bg-background focus:ring-1 focus:ring-primary outline-none text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-muted-foreground whitespace-nowrap">records per page</span>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm font-semibold shrink-0">Search:</span>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 h-9 rounded-xl border-muted bg-background w-full"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50 border-b">
                  <TableRow>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 py-3">Location</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 py-3">Barcode</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 py-3">Quantity</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 py-3 text-center">Type</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 py-3">Lot #</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 py-3">Serial #</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 py-3">Mfg on</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 py-3">Exp on</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingTransactions ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-48 text-center text-muted-foreground italic">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                          <span className="font-medium">Fetching transaction details...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground py-10">
                        No transactions found for this adjustment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t, i) => (
                      <TableRow key={i} className="hover:bg-muted/30 border-b last:border-0 transition-colors">
                        <TableCell className="font-medium px-4 py-3">{t.warehouseLocation || "-"}</TableCell>
                        <TableCell className="font-mono text-[11px] px-4 py-3">
                          <span className="bg-muted/50 px-2 py-0.5 rounded border border-border/50">{t.barcodeItemNum}</span>
                        </TableCell>
                        <TableCell className="font-bold px-4 py-3">{t.signedQty?.toFixed(4)}</TableCell>
                        <TableCell className="text-center px-4 py-3">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm",
                            (t.signedQty && t.signedQty > 0)
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          )}>
                            {(t.signedQty && t.signedQty > 0) ? (
                              <><PlusCircle className="w-3 h-3" /> Increase</>
                            ) : (
                              <><MinusCircle className="w-3 h-3" /> Decrease</>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm px-4 py-3">{t.lotNum || "-"}</TableCell>
                        <TableCell className="text-sm px-4 py-3">{t.serialNum || "-"}</TableCell>
                        <TableCell className="text-[11px] opacity-70 px-4 py-3">
                          {t.dateMfg ? new Date(t.dateMfg).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell className="text-[11px] opacity-70 px-4 py-3">
                          {t.dateExp ? new Date(t.dateExp).toLocaleDateString() : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 text-[11px] text-muted-foreground border-t border-dashed gap-4">
              <span className="order-2 sm:order-1">Showing {transactions.length > 0 ? 1 : 0} to {transactions.length} of {transactions.length} entries</span>
              <div className="flex items-center gap-1.5 order-1 sm:order-2 border rounded-md overflow-hidden p-0.5">
                <Button variant="ghost" size="sm" disabled className="h-7 text-[10px] uppercase font-bold tracking-tight px-3">Previous</Button>
                <div className="h-7 w-7 bg-primary text-white flex items-center justify-center rounded-md font-bold text-[10px]">1</div>
                <Button variant="outline" size="sm" disabled className="h-7 text-[10px] uppercase font-bold tracking-tight px-3">Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
