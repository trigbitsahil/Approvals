"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WarehouseTransactionService } from "@/api/services/WarehouseTransactionService";
import { ArrowLeft, Maximize2, Package, History, User } from "lucide-react";
import { i18n } from "@lingui/core";
import { toast } from "sonner";

interface MoveOrderDetailsProps {
  order: any;
  backRoute: string;
}

export const MoveOrderDetails = ({ order, backRoute }: MoveOrderDetailsProps) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!order?.orderHeaderId) return;
      setLoading(true);
      try {
        const res: any = await WarehouseTransactionService.warehouseTransactionGet("1", order.orderHeaderId);
        if (res.success && res.data) {
          const orderTrans = res.data.filter(
            (t: any) => String(t.orderHeaderId) === String(order.orderHeaderId)
          );
          setTransactions(orderTrans);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [order?.orderHeaderId]);

  const fromTransactions = transactions.filter((t: any) => !t.isIncrease && (t.signedQty < 0 || t.decreaseQty > 0 || !t.increaseQty));
  const toTransactions = transactions.filter((t: any) => t.isIncrease || t.signedQty > 0 || t.increaseQty > 0);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Move Order <span className="text-primary ml-1">#{order.clientOrderNum}</span>
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 font-bold uppercase tracking-wider text-[10px]">
              Moving
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <History className="w-4 h-4" />
              {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
            </div>
            <div className="flex items-center gap-1.5">
              {/* <User className="w-4 h-4" /> */}
              {order.userEmail}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="shadow-sm border-primary/20 hover:bg-primary/5 transition-all font-bold"
            onClick={() => navigate(backRoute)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 gap-10">

        {/* Moved From Table */}
        <Card className=" shadow-2xl border-t-primary  border-t-2 overflow-hidden rounded-2xl ring-1 ring-border/50">
          <CardHeader className=" from-slate-50 to-white dark:from-slate-900 dark:to-background border-b px-6 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 uppercase tracking-tight">
              <div className="w-2 h-6 bg-red-400 rounded-full" />
              Moved From :
            </CardTitle>
            <Maximize2 className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-foreground px-6 py-4 border-r">Origin Location</TableHead>
                  <TableHead className="font-bold text-foreground px-6 py-4 border-r">Lot#</TableHead>
                  <TableHead className="font-bold text-foreground px-6 py-4 border-r">Barcode</TableHead>
                  <TableHead className="font-bold text-foreground px-6 py-4 text-center">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Loading source data...</TableCell>
                  </TableRow>
                ) : fromTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No source transactions found.</TableCell>
                  </TableRow>
                ) : (
                  fromTransactions.map((t, idx) => (
                    <TableRow key={idx} className="hover:bg-red-500/[0.02] transition-colors border-b last:border-0">
                      <TableCell className="px-6 py-4 border-r font-medium text-slate-700 dark:text-slate-300">
                        {t.warehouseLocation || "LOC-A-101"}
                      </TableCell>
                      <TableCell className="px-6 py-4 border-r font-mono text-sm">{t.lotNum || "-"}</TableCell>
                      <TableCell className="px-6 py-4 border-r">
                        <Badge variant="outline" className="font-mono bg-muted/20">{t.barcodeItemNum || "-"}</Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center font-bold text-red-500">
                        -{Math.abs(t.qtyPickRec || t.signedQty || 0).toFixed(4)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Moved To Table */}
        <Card className=" shadow-2xl  border-t-primary  border-t-2   overflow-hidden rounded-2xl ring-1 ring-border/50">
          <CardHeader className=" from-slate-50  to-white dark:from-slate-900 dark:to-background border-b px-6 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 uppercase tracking-tight">
              <div className="w-2 h-6 bg-green-400 rounded-full" />
              Moved To :
            </CardTitle>
            <Maximize2 className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-foreground px-6 py-4 border-r">To Location</TableHead>
                  <TableHead className="font-bold text-foreground px-6 py-4 border-r">Lot#</TableHead>
                  <TableHead className="font-bold text-foreground px-6 py-4 border-r">Barcode</TableHead>
                  <TableHead className="font-bold text-foreground px-6 py-4 text-center">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Loading destination data...</TableCell>
                  </TableRow>
                ) : toTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No destination transactions found.</TableCell>
                  </TableRow>
                ) : (
                  toTransactions.map((t, idx) => (
                    <TableRow key={idx} className="hover:bg-green-500/[0.02] transition-colors border-b last:border-0">
                      <TableCell className="px-6 py-4 border-r font-medium text-slate-700 dark:text-slate-300">
                        {t.warehouseLocation || "LOC-B-202"}
                      </TableCell>
                      <TableCell className="px-6 py-4 border-r font-mono text-sm">{t.lotNum || "-"}</TableCell>
                      <TableCell className="px-6 py-4 border-r">
                        <Badge variant="outline" className="font-mono bg-muted/20">{t.barcodeItemNum || "-"}</Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center font-bold text-green-600">
                        +{Math.abs(t.qtyPickRec || t.signedQty || 0).toFixed(4)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
