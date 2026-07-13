"use client";

import React, { useState, useEffect } from "react";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { OrderTypeService } from "@/api/services/OrderTypeService";
import { OrderHeaderListVM } from "@/api/models/OrderHeaderListVM";
import { OrderTypeListVM } from "@/api/models/OrderTypeListVM";
import { WarehouseService } from "@/api/services/WarehouseService";
import { UserService } from "@/api/services/UserService";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderLineService } from "@/api/services/OrderLineService";
import { WarehouseTransactionService } from "@/api/services/WarehouseTransactionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Check, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { i18n } from "@lingui/core";
import { useNavigate } from "react-router-dom";

interface OrderListProps {
  /** API filter type: 1-7. If undefined, fetches all. */
  type?: number;
  /** Display title shown above the table */
  title?: string;
}

export const OrderList = ({ type, title }: OrderListProps) => {
  const [orders, setOrders] = useState<OrderHeaderListVM[]>([]);
  const [orderTypes, setOrderTypes] = useState<OrderTypeListVM[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});
  const [calculatingStatus, setCalculatingStatus] = useState<Record<string, boolean>>({});
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null); // null = not yet resolved

  const navigate = useNavigate();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderHeaderListVM | null>(
    null,
  );

  const [activeSortColumn, setActiveSortColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<0 | 1>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Resolve SuperAdmin role once on mount
  useEffect(() => {
    const checkRole = async () => {
      try {
        const roleRes = await UserService.getMyRoles("1");
        const roles = Array.isArray(roleRes.data) ? roleRes.data : [];
        setIsSuperAdmin((roles.includes("SuperAdmin") || roles.includes("WarehouseAdmin")));
      } catch {
        setIsSuperAdmin(false); // fallback: treat as regular user
      }
    };
    checkRole();
  }, []);

  // Types for which non-admin users get warehouse-filtered results
  const WAREHOUSE_FILTERED_TYPES = [1, 2, 3, 4, 7];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Determine warehouseId to pass: only for non-admin on filtered types
      let warehouseIdParam: string | undefined = undefined;
      if (
        isSuperAdmin === false &&
        type !== undefined &&
        WAREHOUSE_FILTERED_TYPES.includes(type)
      ) {
        const cookieWhId = Cookies.get("selectedWarehouseId");
        if (cookieWhId) warehouseIdParam = cookieWhId;
      }

      const [ordersRes, typesRes, warehousesRes] = await Promise.all([
        OrderHeaderService.orderHeaderGet("1", type, warehouseIdParam),
        OrderTypeService.orderTypeGet("1"),
        WarehouseService.warehouseGet("1"),
      ]);

      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data);
      }

      if (typesRes.success && typesRes.data) {
        setOrderTypes(typesRes.data);
      }

      if (warehousesRes.success && warehousesRes.data) {
        setWarehouses(warehousesRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders or types:", error);
      toast.error(i18n.t("Failed to fetch data"));
    } finally {
      setLoading(false);
    }
  };

  // Wait until role is resolved before fetching orders
  useEffect(() => {
    if (isSuperAdmin === null) return; // still loading role
    fetchOrders();
  }, [type, isSuperAdmin]);

  const checkOrderCompletion = async (order: OrderHeaderListVM) => {
    if (!order.orderHeaderId || completionStatus[order.orderHeaderId] !== undefined || calculatingStatus[order.orderHeaderId]) return;

    setCalculatingStatus(prev => ({ ...prev, [order.orderHeaderId!]: true }));
    try {
      // 1. Fetch lines for the order
      const linesRes = await OrderLineService.getOrderLinesByOrder("1", order.orderHeaderId);
      const lines = linesRes?.data || [];
      if (lines.length === 0) {
        setCompletionStatus(prev => ({ ...prev, [order.orderHeaderId!]: false }));
        return;
      }

      // 2. Fetch all transactions for the order (global fetch is fine for outbound)
      const transRes = await WarehouseTransactionService.warehouseTransactionGet("1", order.orderHeaderId);
      let transactions = transRes?.data || [];

      // If inbound and global fetch returned nothing, try per-line fetching (required for some inbound orders)
      const numericTypeForOrder = [2, 4, 6].includes(type || 1) ? type : (order.receiving ? 2 : 1);
      const isOrderInbound = [2, 4, 6].includes(numericTypeForOrder || 1);

      if (isOrderInbound && transactions.length === 0) {
        // Fetch all line transactions in parallel
        const allTransResponses = await Promise.all(lines.map((line: any) =>
          WarehouseTransactionService.getWarehouseTransactionListByLine("1", line.orderLineId)
        ));
        transactions = allTransResponses.flatMap((res: any) => res.data || []);
      }

      // 3. Determine if all lines are completed
      const isAllCompleted = lines.every((line: any) => {
        const lineTransactions = transactions.filter((t: any) =>
          String(t.issueLineId ?? t.lineId ?? t.orderLineId ?? t.receiptLineId ?? t.lineid ?? "") === String(line.orderLineId)
        );

        let pickedQty = 0;
        lineTransactions.forEach((t: any) => {
          pickedQty += Math.abs(t.qtyPickRec ?? t.signedQty ?? t.increaseQty ?? t.decreaseQty ?? 0);
        });

        return lineTransactions.length > 0 && pickedQty >= Number(line.orderIncQty || 0);
      });

      setCompletionStatus(prev => ({ ...prev, [order.orderHeaderId!]: isAllCompleted }));
    } catch (error) {
      console.error(`Failed to calculate status for order ${order.orderHeaderId}`, error);
    } finally {
      setCalculatingStatus(prev => ({ ...prev, [order.orderHeaderId!]: false }));
    }
  };

  useEffect(() => {
    if (orders.length > 0) {

      orders.forEach(order => {
        if (order.picking || order.receiving) {
          checkOrderCompletion(order);
        }
      });
    }
  }, [orders]);

  // Build the "from" route so the detail page's Back button returns here
  const typeToRoute: Record<number, string> = {
    1: "/Order/alloutbound",
    2: "/Order/allinbound",
    3: "/Order/openoutbound",
    4: "/Order/openinbound",
    5: "/Order/myopenoutbound",
    6: "/Order/myopeninbound",
    7: "/Order/move",
  };
  const fromRoute = type !== undefined ? (typeToRoute[type] ?? "/orders") : "/orders";

  const handleCreate = () => {
    if (type === 7) {
      navigate("/Order/MoveOrder/Create?type=7");
      return;
    }
    const typeParam = type !== undefined ? `?type=${type}` : "";
    navigate(`/orderform${typeParam}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm(i18n.t("Are you sure you want to delete this order?"))) {
      try {
        const response = await OrderHeaderService.deleteOrderHeader(id, "1");
        if (response.success) {
          toast.success(i18n.t("Order deleted successfully"));
          fetchOrders();
        } else {
          toast.error(response.message || i18n.t("Failed to delete order"));
        }
      } catch (error) {
        toast.error(i18n.t("An error occurred while deleting the order"));
      }
    }
  };

  let filteredOrders = orders.filter((order) => {
    const s = search.toLowerCase();
    return (
      (order.clientOrderNum?.toLowerCase() ?? "").includes(s) ||
      (order.shipToName?.toLowerCase() ?? "").includes(s)
    );
  });

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
        {label}
        {getSortIcons(column)}
      </div>
    </TableHead>
  );

  const isInbound = type === 4 || type === 6;
  const isAllInbound = type === 2;
  const isAllOutbound = type === 1;


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={i18n.t("Search orders...")}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> {i18n.t("Add Order")}
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-muted/30 w-fit px-4 py-1.5 rounded-full border border-border/50 shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider   opacity-70">
          {i18n.t("Total Orders")}
        </span>
        <span className="   px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border border-primary/20">
          {orders.length}
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead column="orderHeaderId" label={i18n.t("Order")} className="w-[80px] border-r px-4" />
              {isAllOutbound || isAllInbound ? (
                <>
                  <SortableHead column="warehouseId" label={i18n.t("Warehouse Code")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="orderType" label={i18n.t("Doc Type")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="clientOrderNum" label={i18n.t("Client Doc#")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="billToName" label={i18n.t("BillTo Name")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="shipToName" label={i18n.t("ShipTo Name")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="shipToAddress1" label={i18n.t("ShipTo Address")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="shipMethod" label={i18n.t("Ship Method")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column={isAllInbound ? "receiptDeadline" : "shipmentDeadline"} label={isAllInbound ? i18n.t("Receipt Deadline") : i18n.t("Shipment Deadline")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column={isAllInbound ? "dateReceived" : "dateShipped"} label={isAllInbound ? i18n.t("Date Received") : i18n.t("Shipped Date")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="orderDate" label={i18n.t("Order Date")} className="border-r px-4 whitespace-nowrap" />
                </>
              ) : (
                <>
                  <SortableHead column="shipToName" label={i18n.t("Ship To")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="isShippedOrReceived" label={isInbound ? i18n.t("Received?") : i18n.t("Shipped?")} className="border-r px-4 whitespace-nowrap text-center" />
                  <SortableHead column="diff" label={i18n.t("Diff?")} className="border-r px-4 whitespace-nowrap text-center" />
                  <SortableHead column="orderType" label={i18n.t("Type")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column="clientOrderNum" label={i18n.t("Client Doc#")} className="border-r px-4 whitespace-nowrap" />
                  {isInbound ? (
                    <>
                      <SortableHead column="receiptFromName" label={i18n.t("Receipt From")} className="border-r px-4 whitespace-nowrap" />
                      <SortableHead column="receiptDeadline" label={i18n.t("Receipt Deadline")} className="border-r px-4 whitespace-nowrap" />
                    </>
                  ) : (
                    <>
                      <SortableHead column="customerDueDate" label={i18n.t("Cust. Due Date")} className="border-r px-4 whitespace-nowrap" />
                      <SortableHead column="shipmentDeadline" label={i18n.t("Shipment Deadline")} className="border-r px-4 whitespace-nowrap" />
                    </>
                  )}
                  <SortableHead column="userEmail" label={i18n.t("Assigned To")} className="border-r px-4 whitespace-nowrap" />
                  <SortableHead column={isInbound ? "receiving" : "picking"} label={isInbound ? i18n.t("Receiving?") : i18n.t("Picking?")} className="border-r px-4 whitespace-nowrap" />
                </>
              )}
              <TableHead className="text-right px-4 whitespace-nowrap">{i18n.t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isAllOutbound || isAllInbound ? 12 : 11} className="h-24 text-center">
                  {i18n.t("Loading...")}
                </TableCell>
              </TableRow>
            ) : paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAllOutbound || isAllInbound ? 12 : 11} className="h-24 text-center">
                  {i18n.t("No orders found.")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow
                  key={order.orderHeaderId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/Order/${order.orderHeaderId}?from=${encodeURIComponent(fromRoute)}`)}
                >
                  <TableCell className="font-medium border-r px-4">
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold ring-1 ring-primary/30">
                      {order.orderHeaderId?.split('_').pop()?.slice(0, 3)}
                    </span>
                  </TableCell>

                  {isAllOutbound || isAllInbound ? (
                    <>
                      <TableCell className="border-r px-4 whitespace-nowrap">
                        {warehouses.find(w => w.warehouseId === order.warehouseId)?.warehouseCode || order.warehouseId || "Wcode11"}
                      </TableCell>
                      <TableCell className="border-r px-4 whitespace-nowrap uppercase font-bold text-xs opacity-70">
                        {order.orderType || (isAllInbound ? "PO" : "SO")}
                      </TableCell>
                      <TableCell className="border-r px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{order.clientOrderNum}</span>
                          <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] text-white font-bold ${order.isClosed ? "bg-slate-500" : "bg-primary"}`}>
                            {order.isClosed ? i18n.t("Closed") : i18n.t("Open")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="border-r px-4 whitespace-nowrap">{order.billToName || ""}</TableCell>
                      <TableCell className="border-r px-4 whitespace-nowrap">{order.shipToName || ""}</TableCell>
                      <TableCell className="border-r px-4 max-w-[200px] truncate">{order.shipToAddress1 || ""}</TableCell>
                      <TableCell className="border-r px-4 whitespace-nowrap">{order.shipMethod || ""}</TableCell>
                      <TableCell className="border-r px-4 whitespace-nowrap">
                        {isAllInbound ? (
                          order.receiptDeadline
                            ? new Date(order.receiptDeadline).toLocaleDateString()
                            : "1/1/2000"
                        ) : (
                          order.shipmentDeadline
                            ? new Date(order.shipmentDeadline).toLocaleDateString()
                            : ""
                        )}
                      </TableCell>
                      <TableCell className="border-r px-4 whitespace-nowrap">
                        {isAllInbound ? (
                          order.dateReceived && order.dateReceived !== "0001-01-01T00:00:00" && order.dateReceived !== "0001-01-02T14:30:00"
                            ? new Date(order.dateReceived).toLocaleDateString()
                            : "1/1/2000"
                        ) : (
                          order.dateShipped && order.dateShipped !== "0001-01-01T00:00:00" && order.dateShipped !== "0001-01-02T14:30:00"
                            ? new Date(order.dateShipped).toLocaleDateString()
                            : "1/1/2000"
                        )}
                      </TableCell>
                      <TableCell className="border-r px-4 whitespace-nowrap font-mono text-[11px] opacity-80">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : ""}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="border-r px-4 whitespace-nowrap">{order.shipToName}</TableCell>

                      <TableCell className="border-r px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.isShippedOrReceived ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {order.isShippedOrReceived ? "Y" : "N"}
                        </span>
                      </TableCell>

                      <TableCell className="border-r px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.diff === "0" || !order.diff ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {order.diff === "0" || !order.diff ? "N" : "Y"}
                        </span>
                      </TableCell>

                      <TableCell className="border-r px-4 whitespace-nowrap uppercase text-[10px] font-bold opacity-70">
                        {order.orderType || i18n.t(isInbound ? "PO" : "SO")}
                      </TableCell>

                      <TableCell className="border-r px-4 whitespace-nowrap font-medium text-blue-600 hover:underline">
                        {order.clientOrderNum}
                      </TableCell>

                      {isInbound ? (
                        <>
                          <TableCell className="border-r px-4 whitespace-nowrap text-sm">{order.receiptFromName || ""}</TableCell>
                          <TableCell className="border-r px-4 whitespace-nowrap font-mono text-[11px] opacity-80">
                            {order.receiptDeadline
                              ? new Date(order.receiptDeadline).toLocaleDateString()
                              : ""}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="border-r px-4 whitespace-nowrap font-mono text-[11px] opacity-80">
                            {order.customerDueDate
                              ? new Date(order.customerDueDate).toLocaleDateString()
                              : ""}
                          </TableCell>
                          <TableCell className="border-r px-4 whitespace-nowrap font-mono text-[11px] opacity-80">
                            {order.shipmentDeadline
                              ? new Date(order.shipmentDeadline).toLocaleDateString()
                              : ""}
                          </TableCell>
                        </>
                      )}

                      <TableCell className="border-r px-4 whitespace-nowrap text-13px] text-muted-foreground ">
                        {order.userEmail}
                      </TableCell>

                      <TableCell className="border-r px-4 text-center">
                        {calculatingStatus[order.orderHeaderId!] ? (
                          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">Checking...</span>
                        ) : completionStatus[order.orderHeaderId!] || order.isPickedOrReceived ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center justify-center gap-1">
                            <Check className="h-3 w-3" /> {isInbound ? "Received" : "Picked"}
                          </span>
                        ) : (isInbound ? order.receiving : order.picking) ? (
                          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">InProcess</span>
                        ) : (
                          <span className="text-muted-foreground text-[10px] font-bold">Not Started</span>
                        )}
                      </TableCell>
                    </>
                  )}

                  <TableCell className="text-right px-4">
                    <div className="flex items-center justify-end gap-1">

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title={i18n.t("Edit")}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orderform?id=${order.orderHeaderId}${type !== undefined ? `&type=${type}` : ""}`);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-destructive hover:bg-destructive/10"
                        title={i18n.t("Delete")}
                        onClick={(e) => {
                          e.stopPropagation();
                          order.orderHeaderId && handleDelete(order.orderHeaderId);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-4 px-2">
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
