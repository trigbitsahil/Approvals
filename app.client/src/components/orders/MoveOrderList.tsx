"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Maximize2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { i18n } from "@lingui/core";

import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { OrderHeaderListVM } from "@/api/models/OrderHeaderListVM";
import { toast } from "sonner";

export const MoveOrderList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<OrderHeaderListVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSortColumn, setActiveSortColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<0 | 1>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res: any = await OrderHeaderService.orderHeaderGet("1", 7);
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch move orders:", error);
      toast.error(i18n.t("Failed to fetch move orders"));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  let filteredOrders = orders.filter(
    (order) =>
      (order.clientOrderNum || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.comments || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.userEmail || "").toLowerCase().includes(search.toLowerCase())
  );

  if (activeSortColumn) {
    filteredOrders.sort((a: any, b: any) => {
      let valA = a[activeSortColumn];
      let valB = b[activeSortColumn];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 0 ? -1 : 1;
      if (valA > valB) return sortOrder === 0 ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (column: string) => {
    if (activeSortColumn === column) {
      setSortOrder(sortOrder === 0 ? 1 : 0);
    } else {
      setActiveSortColumn(column);
      setSortOrder(0);
    }
  };

  const getSortIcons = (column: string) => {
    const isActive = activeSortColumn === column;
    const isAsc = sortOrder === 0;

    return (
      <div className="flex flex-col items-center -space-y-1">
        <ChevronUp className={`h-3 w-3 transition-colors ${isActive && isAsc ? "text-primary font-bold" : "text-muted-foreground/40"}`} />
        <ChevronDown className={`h-3 w-3 transition-colors ${isActive && !isAsc ? "text-primary font-bold" : "text-muted-foreground/40"}`} />
      </div>
    );
  };

  const SortableHead = ({ label, column, className }: { label: string; column: string; className?: string }) => (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 transition-colors select-none ${className || ''}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        <span className="font-bold text-foreground">{label}</span>
        {getSortIcons(column)}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">

          <Maximize2 className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
        </div>
        <Button onClick={() => navigate("/Order/MoveOrder/Create?type=7")} className="  font-bold">
          <Plus className="mr-2 h-4 w-4" /> {i18n.t("Create Order")}
        </Button>
      </div>

      <div className="flex justify-between items-center bg-muted/20 p-4 rounded-t-xl border border-b-0">
        <div>
          {/* Empty div to push search to the right if needed, or remove completely */}
        </div>
        <div className="relative w-72">
          <span className="absolute left-[-60px] top-2 text-sm text-muted-foreground">Search:</span>
          <Input
            className="h-9 "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-b-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b">
              <SortableHead column="clientOrderNum" label={i18n.t("Order")} className="border-r px-4 whitespace-nowrap" />
              <SortableHead column="comments" label={i18n.t("Comments")} className="border-r px-4 whitespace-nowrap" />
              <SortableHead column="userEmail" label={i18n.t("Recorded By")} className="border-r px-4 whitespace-nowrap" />
              <SortableHead column="orderDate" label={i18n.t("Order Date")} className="px-4 whitespace-nowrap" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground animate-pulse">
                  {i18n.t("Loading move orders...")}
                </TableCell>
              </TableRow>
            ) : paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                  {i18n.t("No move orders found.")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order.orderHeaderId} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-border/50">
                  <TableCell className="font-medium border-r px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        className="h-6 px-2 text-[10px] uppercase font-bold"
                        onClick={() => navigate(`/Order/${order.orderHeaderId}?from=${encodeURIComponent("/Order/move")}`)}
                      >
                        Details
                      </Button>
                      <span className="text-sm font-bold">{order.clientOrderNum}</span>
                    </div>
                  </TableCell>
                  <TableCell className="border-r px-4 text-sm whitespace-nowrap">{order.comments || "-"}</TableCell>
                  <TableCell className="border-r px-4 text-sm text-muted-foreground font-mono whitespace-nowrap">{order.userEmail || "-"}</TableCell>
                  <TableCell className="text-sm px-4 whitespace-nowrap">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => { setPageSize(parseInt(value)); setCurrentPage(1); }}
          >
            <SelectTrigger className="w-[70px] h-8 bg-transparent border-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
