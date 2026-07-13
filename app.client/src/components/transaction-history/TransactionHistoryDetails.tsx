"use client";

import { useState } from "react";
import { Search, ArrowLeft, Table as TableIcon, FileText } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { WarehouseTransactionService } from "../../api/services/WarehouseTransactionService";
import { WarehouseTransactionHistoryDetailVM } from "../../api/models/WarehouseTransactionHistoryDetailVM";
import { WarehouseTransactionHistoryByOrderVM } from "../../api/models/WarehouseTransactionHistoryByOrderVM";

import { useParams } from "react-router-dom";

export const TransactionHistoryDetails = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [details, setDetails] = useState<WarehouseTransactionHistoryDetailVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<WarehouseTransactionHistoryByOrderVM[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const fetchBarcodeDetails = useCallback(async () => {
    if (!barcode) return;
    setLoading(true);
    try {
      const response = await WarehouseTransactionService.getWarehouseTransactionHistoryDetail("1", barcode);
      if (response.data) {
        setDetails(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch barcode details:", error);
      toast.error("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  }, [barcode]);

  useEffect(() => {
    fetchBarcodeDetails();
  }, [fetchBarcodeDetails]);

  const handleOrderIdClick = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
    setLoadingModal(true);
    try {
      const response = await WarehouseTransactionService.getWarehouseTransactionHistoryByOrder("1", barcode, orderId);
      if (response.data) {
        setModalData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load order transaction details");
    } finally {
      setLoadingModal(false);
    }
  };

  const filteredDetails = details.filter((item) =>
    (item.orderNum || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.locationCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.docType || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <TableIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Transaction History Details</h1>
              <span className="text-2xl font-light text-muted-foreground">({barcode})</span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Detailed transaction log for this item</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="font-bold gap-2 shadow-sm border-primary/20 hover:bg-primary/5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Button>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 overflow-hidden">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <select
                className="bg-background border border-input h-9 rounded-md px-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
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
                placeholder="Search details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-input focus:ring-2 focus:ring-primary transition-all rounded-lg h-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 pl-6">Order Id</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 text-center">Document Type</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 text-center">Line#</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 text-center">Location</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 text-center">Transaction Qty</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 text-center">Running Balance</TableHead>
                  {/* <TableHead className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground py-2 pr-6 text-center">Client</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm">Loading details...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDetails.length > 0 ? (
                  filteredDetails.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/40 transition-colors border-b border-border/40 last:border-0 group">
                      <TableCell className="py-2 pl-6">
                        <Badge
                          className="bg-primary hover:bg-primary/70 text-white rounded-sm px-1.5 py-0 h-5 text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                          onClick={() => item.orderNum && handleOrderIdClick(item.orderNum)}
                        >
                          {item.orderNum || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-center text-sm font-medium">{item.docType || "-"}</TableCell>
                      <TableCell className="py-2 text-center text-sm">
                        {item.issueLineId || item.receiptLineId || "-"}
                      </TableCell>
                      <TableCell className="py-2 text-center text-sm">{item.locationCode || "-"}</TableCell>
                      <TableCell className="py-2 text-center text-sm font-mono text-foreground font-bold italic">
                        {item.signedQty?.toFixed(4) || "0.0000"}
                      </TableCell>
                      <TableCell className="py-2 text-center text-sm font-mono text-muted-foreground">
                        {item.runningBalance?.toFixed(4) || "0.0000"}
                      </TableCell>
                      {/* <TableCell className="py-2 pr-6 text-center text-sm">{item.warehouseCode || "-"}</TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium italic">No details found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-muted/10 border-t border-border/50 gap-4">
            <div className="text-xs font-medium text-muted-foreground">
              Showing <span className="text-foreground font-bold">1</span> to <span className="text-foreground font-bold">{filteredDetails.length}</span> of <span className="text-foreground font-bold">{filteredDetails.length}</span> entries
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled className="h-8 text-xs font-bold uppercase tracking-wider text-muted-foreground">Previous</Button>
              <Button variant="default" size="sm" className="h-8 w-8 p-0 text-xs font-bold bg-primary shadow-md">1</Button>
              <Button variant="ghost" size="sm" disabled className="h-8 text-xs font-bold uppercase tracking-wider text-muted-foreground">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[92vw] md:w-full md:max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary/90 px-6 py-4">
            <DialogTitle className="text-white flex items-center gap-2">
              Transaction Order History Details
              <span className="text-white/60 font-light text-sm">({barcode})</span>
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-2">
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
                <input
                  type="text"
                  className="border rounded-md h-9 px-3 w-full md:w-48 bg-background focus:ring-1 focus:ring-primary outline-none text-sm"
                  placeholder="Order details..."
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold text-xs uppercase border-r text-center">Location</TableHead>
                    <TableHead className="font-bold text-xs uppercase border-r text-center">Is Increase</TableHead>
                    <TableHead className="font-bold text-xs uppercase border-r text-center">Increase Qty</TableHead>
                    <TableHead className="font-bold text-xs uppercase border-r text-center">Decrease Qty</TableHead>
                    <TableHead className="font-bold text-xs uppercase border-r text-center">Running Balance</TableHead>
                    <TableHead className="font-bold text-xs uppercase border-r text-center">Lot#</TableHead>
                    <TableHead className="font-bold text-xs uppercase border-r text-center">Serial #</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-center">Transaction Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingModal ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-medium">
                        Loading transaction audit...
                      </TableCell>
                    </TableRow>
                  ) : modalData.length > 0 ? (
                    modalData.map((row, idx) => (
                      <TableRow key={idx} className="bg-background/50 hover:bg-muted/30">
                        <TableCell className="text-center text-sm border-r">{row.locationCode || "-"}</TableCell>
                        <TableCell className="text-center text-sm border-r">
                          {row.isIncrease ? (
                            <Badge variant="outline" className="border-green-500/50  bg-green-600 text-[10px] h-4 font-bold scale-90">Yes</Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500/50  bg-red-600 text-[10px] h-4 font-bold scale-90">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-sm border-r font-mono font-semibold">{row.increaseQty?.toFixed(4) || "0.0000"}</TableCell>
                        <TableCell className="text-center text-sm border-r font-mono font-semibold">{row.decreaseQty?.toFixed(4) || "0.0000"}</TableCell>
                        <TableCell className="text-center text-sm border-r font-mono">{row.runningBalance?.toFixed(4) || "0.0000"}</TableCell>
                        <TableCell className="text-center text-sm border-r font-mono text-xs">{row.lotNum || "-"}</TableCell>
                        <TableCell className="text-center text-sm border-r font-mono text-xs">{row.serialNum || "-"}</TableCell>
                        <TableCell className="text-center text-sm font-mono text-xs">
                          {row.transactionDate ? new Date(row.transactionDate).toLocaleDateString() : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-medium italic">
                        No additional transaction details found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
              <span className="text-xs text-muted-foreground order-2 sm:order-1">Showing 1 to 1 of 1 entries</span>
              <div className="flex items-center border rounded-md overflow-hidden order-1 sm:order-2">
                <Button variant="ghost" size="sm" className="h-8 rounded-none px-3 text-[10px] uppercase font-bold border-r">Previous</Button>
                <Button variant="secondary" size="sm" className="h-8 rounded-none w-8 p-0 text-xs bg-primary/10 text-primary font-bold">1</Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-none px-3 text-[10px] uppercase font-bold text-muted-foreground">Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
