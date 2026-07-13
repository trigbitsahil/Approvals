"use client";

import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { OrderHeaderListVM } from "@/api/models/OrderHeaderListVM";
import { OrderLineService } from "@/api/services/OrderLineService";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { OrderUserService } from "@/api/services/OrderUserService";
import { UserService } from "@/api/services/UserService";
import { OrderFormDialog } from "@/components/orders/OrderFormDialog";
import {
  ArrowLeft,
  CheckCircle,
  Edit,
  PackageCheck,
  Plus,
  Printer,
  XCircle,
  Check,
  Search,
  History,
} from "lucide-react";
import { WarehouseTransactionService } from "@/api/services/WarehouseTransactionService";
import { WarehouseLocationService } from "@/api/services/WarehouseLocationService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerInput } from "@/components/ui/date-picker-input";

interface OrderDetailsProps {
  order: OrderHeaderListVM | any;
  /** The route to navigate back to when the Back button is clicked */
  backRoute?: string;
}

export const OrderDetails = ({ order: initialOrder, backRoute = "/orders" }: OrderDetailsProps) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(initialOrder);
  const [lines, setLines] = useState<any[]>([]);
  const [loadingLines, setLoadingLines] = useState(true);
  const { id } = useParams();

  // Helper to determine numeric type (1-7) based on backRoute or order flags
  const getNumericType = () => {
    const routeToType: Record<string, number> = {
      "/Order/alloutbound": 1,
      "/Order/allinbound": 2,
      "/Order/openoutbound": 3,
      "/Order/openinbound": 4,
      "/Order/myopenoutbound": 5,
      "/Order/myopeninbound": 6,
      "/Order/move": 7,
    };

    if (backRoute && routeToType[backRoute]) {
      return routeToType[backRoute];
    }

    if (order?.moving) return 7;
    if (order?.receiving) return 2;
    return 1; // Default to Outbound
  };

  const numericType = getNumericType();
  const isInbound = [2, 4, 6].includes(numericType);
  const [isPickingMode, setIsPickingMode] = useState(order?.picking || false);
  const [pickedLines, setPickedLines] = useState<Set<string>>(new Set());
  const [transactions, setTransactions] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [isLoadingTrans, setIsLoadingTrans] = useState(false);
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<any>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [openAssign, setOpenAssign] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [lineLevelTransactions, setLineLevelTransactions] = useState<any[]>([]);

  const [isEditLineModalOpen, setIsEditLineModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lineToDelete, setLineToDelete] = useState<string | null>(null);
  const [editingLine, setEditingLine] = useState<any>(null);
  const [editLineForm, setEditLineForm] = useState({
    barcodeItemNum: '',
    lineDescription: '',
    orderIncQty: 0,
    unitOfMeasure: ''
  });

  const [isShippedPopoverOpen, setIsShippedPopoverOpen] = useState(false);
  const [shippingDate, setShippingDate] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [woLocation, setWoLocation] = useState("");
  const [woLotNum, setWoLotNum] = useState("");

  const handleMarkAsShipped = async () => {
    const isWorkOrderCheck = (order?.orderType || "").toLowerCase().includes("work order") ||
      (order?.orderType || "").toLowerCase() === "wo" ||
      order?.orderTypeId === "OdrType_2026_03_16e7cfe08a-444a-4a51-9ac9-b9965361afe7";

    if (!isWorkOrderCheck && !shippingDate) {
      toast.error("Date is required");
      return;
    }
    if (isWorkOrderCheck && !woLocation) {
      toast.error("Location is required");
      return;
    }

    try {
      await OrderHeaderService.orderHeaderPut("1", {
        ...order,
        isShippedOrReceived: true,
        dateShipped: isWorkOrderCheck ? new Date().toISOString() : shippingDate + "T00:00:00.000Z",
        trackingNumber: trackingNo || null,
        location: isWorkOrderCheck ? woLocation : undefined,
        lotNumber: isWorkOrderCheck ? woLotNum : undefined,
      });
      toast.success(isWorkOrderCheck ? "Finished good placed" : isInbound ? "Order marked as received" : "Order marked as shipped");
      setIsShippedPopoverOpen(false);
      refreshData();
    } catch (e) {
      toast.error("Failed to update order status");
    }
  };

  const handleMarkAsClosed = async () => {
    try {
      await OrderHeaderService.orderHeaderPut("1", {
        ...order,
        isClosed: true,
      });
      toast.success("Order marked as closed");
      refreshData();
    } catch (e) {
      toast.error("Failed to mark as closed");
    }
  };

  const handleAssignUser = async () => {
    if (!selectedAssignee || !order?.orderHeaderId) return;
    const selectedUser = allUsers.find(u => u.email === selectedAssignee);
    try {
      // 1. Update Order Header Status
      await OrderHeaderService.orderHeaderPut("1", {
        ...order,
        isAssigned: true,
        assignedTo: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : selectedAssignee,
        assignedToId: selectedUser?.userID || null
      });

      // 2. Create Assignment Record
      await OrderUserService.orderUserPost("1", {
        UserEmail: selectedAssignee,
        OrderHeaderId: order.orderHeaderId
      });
      toast.success("Order assigned successfully");
      refreshData();
    } catch (error) {
      toast.error("Failed to assign order");
    }
  };

  const handleUnassignUser = async () => {
    if (!order?.orderHeaderId) return;
    try {
      // 1. Update Order Header Status
      await OrderHeaderService.orderHeaderPut("1", {
        ...order,
        isAssigned: false,
        assignedTo: null,
        assignedToId: null
      });

      // 2. Delete Assignment Record using orderHeaderId
      await OrderUserService.deleteOrderUser(order.orderHeaderId, "1");
      toast.success("Order unassigned successfully");
      refreshData();
    } catch (error) {
      toast.error("Failed to unassign order");
    }
  };

  const handleReversePicking = async (lineId: string | number) => {
    try {
      await WarehouseTransactionService.deleteWarehouseTransactionByLine("1", String(lineId));
      toast.success("Picking reversed successfully");
      refreshData();
    } catch (error) {
      console.error("Failed to reverse picking", error);
      toast.error("Failed to reverse picking");
    }
  };

  const handleEditLineClick = (line: any) => {
    setEditingLine(line);
    setEditLineForm({
      barcodeItemNum: line.barcodeItemNum || '',
      lineDescription: line.lineDescription || '',
      orderIncQty: isInbound ? (line.orderIncQty || 0) : Math.abs(line.orderDecQty || 0),
      unitOfMeasure: line.unitOfMeasure || ''
    });
    setIsEditLineModalOpen(true);
  };

  const handleSaveLine = async () => {
    if (!editingLine) return;
    try {
      const qty = Number(editLineForm.orderIncQty) || 0;
      await OrderLineService.orderLinePut("1", {
        ...editingLine,
        barcodeItemNum: editLineForm.barcodeItemNum,
        lineDescription: editLineForm.lineDescription,
        orderIncQty: isInbound ? qty : 0,
        orderDecQty: !isInbound ? qty : 0,
        unitOfMeasure: editLineForm.unitOfMeasure
      });
      toast.success("Line item updated successfully");
      setIsEditLineModalOpen(false);
      refreshData();
    } catch (error) {
      toast.error("Failed to update line item");
    }
  };

  const handleDeleteLineClick = (lineId: string) => {
    setLineToDelete(lineId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteLine = async () => {
    if (!lineToDelete) return;
    try {
      await OrderLineService.deleteOrderLine(lineToDelete, "1");
      toast.success("Line item deleted successfully");
      refreshData();
    } catch (error) {
      toast.error("Failed to delete line item");
    } finally {
      setIsDeleteDialogOpen(false);
      setLineToDelete(null);
    }
  };

  const handleTogglePicking = async (start: boolean) => {
    if (!order?.orderHeaderId) return;

    console.log("Toggle picking started:", start);
    // Optimistic update
    setIsPickingMode(start);

    try {
      if (start) {
        // 1. Fetch logged in user info
        console.log("Fetching logged in user...");
        const userRes = await UserService.getLoggedInUser("1");
        const userEmail = userRes.data?.email || userRes.data?.userName;
        console.log("User email/name found:", userEmail);

        if (userEmail) {
          // 2. Post to OrderUser service for assignment
          console.log("Calling OrderUserPost...");
          await OrderUserService.orderUserPost("1", {
            UserEmail: userEmail,
            OrderHeaderId: order.orderHeaderId
          });
          console.log("OrderUserPost successful");
        } else {
          console.warn("No user email or name found, skipping assignment");
        }
      }

      // 3. Update Picking Status in Order Header
      console.log("Updating order header picking status...");
      await OrderHeaderService.orderHeaderPut("1", {
        ...order,
        picking: start,
        itemsPicking: start
      });
      console.log("Order header update successful");

      toast.success(start ? "Picking started" : "Picking canceled", {
        description: start ? "Order status updated to picking." : "Order status updated to idle."
      });

      // Refresh data instead of reloading the whole page
      refreshData();

    } catch (error) {
      console.error("Failed to update picking status", error);
      // Revert on failure
      setIsPickingMode(!start);
      toast.error("Failed to update picking status", {
        description: "Please try again later."
      });
    }
  };

  const refreshData = async () => {
    if (!order?.orderHeaderId) return;
    setLoadingLines(true);
    setIsLoadingTrans(true);

    try {
      const orderRes: any = await OrderHeaderService.getOrderHeaderById(order.orderHeaderId, "1");
      if (orderRes) {
        setOrder(orderRes.data || orderRes);
      }
    } catch (e) {
      console.error("Failed to fetch fresh order header summary", e);
    }

    try {
      // 1. Fetch Order Lines
      const linesRes: any = await OrderLineService.getOrderLinesByOrder("1", order.orderHeaderId);
      let filteredLines: any[] = [];
      if (linesRes?.data && Array.isArray(linesRes.data)) {
        filteredLines = linesRes.data;
        setLines(filteredLines);
      }

      // 2. Fetch Transactions and determine processed status for each line in parallel
      const processedLinesSet = new Set<string>();

      await Promise.all(filteredLines.map(async (line: any) => {
        try {
          const transRes: any = await WarehouseTransactionService.getWarehouseTransactionListByLine("1", String(line.orderLineId));
          const lineTransactions = transRes?.data || [];

          let pickedQty = 0;
          lineTransactions.forEach((t: any) => {
            // Use qtyPickRec if available, otherwise fallback to signedQty (absolute), increaseQty, or decreaseQty
            pickedQty += Math.abs(t.qtyPickRec ?? t.signedQty ?? t.increaseQty ?? t.decreaseQty ?? 0);
          });

          const expectedQty = isInbound ? Number(line.orderIncQty || 0) : Math.abs(Number(line.orderDecQty || 0));
          if (lineTransactions.length > 0 && expectedQty > 0 && pickedQty >= expectedQty) {
            processedLinesSet.add(String(line.orderLineId));
          }
        } catch (error) {
          console.error(`Failed to fetch transactions for line ${line.orderLineId}`, error);
        }
      }));
      setPickedLines(processedLinesSet);

      // 4. Fetch Locations to map IDs to Codes in modal
      const locsRes: any = await WarehouseLocationService.warehouseLocationGet("1");
      if (locsRes?.data && Array.isArray(locsRes.data)) {
        setLocations(locsRes.data);
      }
      // 5. Fetch User Roles
      const rolesRes: any = await UserService.getMyRoles("1");
      if (rolesRes?.data && Array.isArray(rolesRes.data)) {
        setCurrentUserRoles(rolesRes.data);

        // 6. Fetch all users for assignment
        setIsLoadingUsers(true);
        const usersRes: any = await UserService.getApiVUser("1");
        if (usersRes?.data && Array.isArray(usersRes.data)) {
          setAllUsers(usersRes.data);
        }
        setIsLoadingUsers(false);
      }

      // 7. Fetch Order Assignments to find current one
      const assignRes: any = await OrderUserService.orderUserGet("1");
      if (assignRes?.data && Array.isArray(assignRes.data)) {
        const assignment = assignRes.data.find(
          (a: any) => String(a.orderHeaderId) === String(order.orderHeaderId)
        );
        if (assignment) {
          setCurrentAssignment(assignment);
        } else {
          setCurrentAssignment(null);
        }
      } else {
        setCurrentAssignment(null);
      }
    } catch (error) {
      console.error("Failed to refresh data", error);
    } finally {
      setLoadingLines(false);
      setIsLoadingTrans(false);
    }
  };

  const fetchLineTransactions = async (lineId: string, barcode: string) => {
    setIsLoadingTrans(true);
    try {
      const res: any = await WarehouseTransactionService.getWarehouseTransactionListByLine("1", lineId);
      if (res?.data && Array.isArray(res.data)) {
        setLineLevelTransactions(res.data);
      } else {
        setLineLevelTransactions([]);
      }
      setSelectedBarcode(barcode);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch line transactions", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setIsLoadingTrans(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [order?.orderHeaderId]);

  if (!order) {
    return (
      <div className="flex justify-center items-center h-full p-8 text-gray-500">
        No order data available.
      </div>
    );
  }

  // Determine status badge
  const isClosed = order.isClosed;
  const isShipped = order.isShippedOrReceived;
  const statusLabel = isClosed
    ? "Completed"
    : isShipped
      ? "Shipped"
      : "Not yet shipped";

  const isWorkOrder = (order.orderType || "").toLowerCase().includes("work order") ||
    (order.orderType || "").toLowerCase() === "wo" ||
    order.orderTypeId === "OdrType_2026_03_16e7cfe08a-444a-4a51-9ac9-b9965361afe7";

  const allPicked = lines.length > 0 && pickedLines.size === lines.length;
  const showMarkAsShipped = (allPicked || order.isPickedOrReceived) && !order.isShippedOrReceived && !order.isClosed;
  const showMarkAsClosed = order.isShippedOrReceived && !order.isClosed;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-2 px-2 sm:px-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5">
        <div className="flex items-center gap-3">
          <Badge
            variant={order.isVoided ? "destructive" : "secondary"}
            className="flex items-center justify-center p-1 px-3 text-xs rounded-full border-none shadow-sm"
          >
            {order.isVoided ? <XCircle className="w-3.5 h-3.5 mr-1" /> : <div className="w-2 h-2 rounded-2 bg-red-500 mr-2" />}
            {order.isVoided ? "Voided" : "Active"}
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            {order.orderType} <span className="text-muted-foreground ml-2 font-normal"> {order.clientOrderNum}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {order.isClosed ? null : showMarkAsClosed ? (
            <Button
              size="sm"
              className="text-white shadow-sm transition-all  font-bold"
              onClick={handleMarkAsClosed}
            >
              <CheckCircle className="w-4 h-4 mr-1.5" /> Mark As Closed
            </Button>
          ) : showMarkAsShipped ? (
            <Popover open={isShippedPopoverOpen} onOpenChange={setIsShippedPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  className="text-white shadow-sm transition-all font-bold"
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" /> {isWorkOrder ? "Place Finished Good" : isInbound ? "Mark As Received" : "Mark As Shipped"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 shadow-xl border-border/80 rounded-xl" align="center" side="bottom" sideOffset={8}>
                <div className="flex flex-col gap-4">
                  {isWorkOrder ? (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="woLocation" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Location</Label>
                        <Input
                          id="woLocation"
                          placeholder="Enter location"
                          className="h-8 text-xs font-semibold bg-muted/30 border-muted"
                          value={woLocation}
                          onChange={(e) => setWoLocation(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="woLotNum" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Lot Number</Label>
                        <Input
                          id="woLotNum"
                          placeholder="Enter lot number"
                          className="h-8 text-xs font-semibold bg-muted/30 border-muted"
                          value={woLotNum}
                          onChange={(e) => setWoLotNum(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="trackingNo" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Tracking No.</Label>
                        <Input
                          id="trackingNo"
                          placeholder="Enter tracking number"
                          className="h-8 text-xs font-semibold bg-muted/30 border-muted"
                          value={trackingNo}
                          onChange={(e) => setTrackingNo(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="shippingDate" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{isInbound ? "Receiving Date" : "Shipping Date"}</Label>
                        <DatePickerInput
                          value={shippingDate}
                          onChange={setShippingDate}
                          className="h-8 text-xs font-semibold bg-muted/30 border-muted"
                          placeholder="Select Date"
                        />
                      </div>
                      {!isInbound && (
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="trackingNo" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Tracking No.</Label>
                          <Input
                            id="trackingNo"
                            placeholder="Enter tracking number"
                            className="h-8 text-xs font-semibold bg-muted/30 border-muted"
                            value={trackingNo}
                            onChange={(e) => setTrackingNo(e.target.value)}
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex items-center gap-2 pt-3 border-t mt-1">
                    <Button size="sm" className="text-white font-bold h-8 flex-1" onClick={handleMarkAsShipped}>Update</Button>
                    <Button size="sm" variant="outline" className="h-8 flex-1 font-bold bg-muted hover:bg-muted/80" onClick={() => setIsShippedPopoverOpen(false)}>Close</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : !isPickingMode ? (
            <Button
              size="sm"
              className=" text-white shadow-sm transition-all"
              onClick={() => handleTogglePicking(true)}
            >
              <CheckCircle className="w-4 h-4 mr-1.5" /> {isInbound ? "Start Receiving" : "Start Picking"}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              className="shadow-sm transition-all"
              onClick={() => handleTogglePicking(false)}
            >
              <XCircle className="w-4 h-4 mr-1.5" /> {isInbound ? "Cancel Receiving" : "Cancel Picking"}
            </Button>
          )}
          {!order.isClosed && (
            <Button
              size="sm"
              variant="outline"
              className="border-primary border-1   shadow-sm transition-all"
              onClick={() => navigate(`/orderform?id=${order.orderHeaderId}&type=${numericType}`)}
            >
              <Edit className="w-4 h-4 mr-1.5" /> Edit Order
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"

            className="border-primary border-1   shadow-sm transition-all"
            onClick={() => {
              if (numericType === 7) {
                navigate("/Order/MoveOrder/Create?type=7");
              } else {
                navigate("/orderform");
              }
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create New
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="shadow-sm transition-all"
            onClick={() => navigate(backRoute)}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
        </div>
      </div>

      {/* Overwritten Alert */}
      {order.isOverwritten && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-bold">Note:</span> This order has been overwritten.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LINE ITEMS SECTION */}
      <Card className="border-t-2 border-t-primary shadow-xl border-x-0 border-b-0 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              Line Items
            </CardTitle>
            {isClosed ? (
              <Badge className=" hover:bg-olive text-white shadow-md border-none px-3 py-1 text-[11px] font-bold uppercase tracking-wider shrink-0 ml-2">
                Completed
              </Badge>
            ) : order.isPickedOrReceived ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary/90 text-xs font-bold uppercase tracking-wider">
                  {order.orderTypeId === "OdrType_2026_03_16e7cfe08a-444a-4a51-9ac9-b9965361afe7" ? (isInbound ? "Receiving in process" : "Picking in process") : (isInbound ? "Order Received but yet to complete" : "Order Picked but yet to complete")}
                </span>
              </div>
            ) : isPickingMode ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">{isInbound ? "Receiving in process" : "Picking in process"}</span>
                </div>

              </div>
            ) : (
              <Badge variant="outline" className="text-muted-foreground font-medium px-2 py-0 border-dashed">
                {isInbound ? "Not yet received" : "Not yet picked"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b">
                <TableRow>
                  {(currentUserRoles.includes("WarehouseAdmin") || currentUserRoles.includes("WarehouseManager")) && !isClosed && (
                    <TableHead className="w-[100px] font-bold uppercase text-[11px] tracking-wider pl-6 border-r px-4">Manage</TableHead>
                  )}
                  <TableHead className="w-[80px] font-bold uppercase text-[11px] tracking-wider pl-4 border-r px-4">Action</TableHead>
                  <TableHead className="w-[100px] font-bold uppercase text-[11px] tracking-wider pl-6 border-r px-4">Line#</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Barcode</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Uom</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4 text-center">Order Qty</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Description</TableHead>
                  {(isPickingMode || pickedLines.size > 0 || order.isPickedOrReceived) && (
                    <TableHead className="font-bold uppercase text-[11px] tracking-wider pr-6 text-center px-4">
                      {isInbound ? "Receive Status" : "Pick Status"}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingLines ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin" />
                        <span>Loading line items...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : lines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground bg-muted/10">
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  lines.map((line, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/30 transition-colors border-b">
                      {(currentUserRoles.includes("WarehouseAdmin") || currentUserRoles.includes("WarehouseManager")) && !isClosed && (
                        <TableCell className="pl-6 border-r px-4">
                          <div className="flex items-center gap-1.5">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/orderform?id=${order.orderHeaderId}&type=${numericType}`)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}

                      <TableCell className="pl-4 border-r px-2 py-2">
                        {!line.inTransaction && !isClosed && (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7  bg-muted text-[11px] font-bold px-2"
                              onClick={() => handleEditLineClick(line)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-red-500 hover:text-red-600 hover:bg-red-50 bg-muted text-[11px] font-bold px-2"
                              onClick={() => handleDeleteLineClick(line.orderLineId)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground pl-6 border-r px-4">{idx + 1}</TableCell>
                      <TableCell className="border-r px-4">
                        <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded ring-1 ring-border/50 border border-border/50">
                          {line.barcodeItemNum}
                        </span>
                      </TableCell>
                      <TableCell className="border-r px-4 text-sm opacity-70 italic">{line.unitOfMeasure || "-"}</TableCell>
                      <TableCell className="font-bold border-r px-4 text-center">
                        {parseFloat(isInbound ? (line.orderIncQty || 0) : (line.orderDecQty || 0)).toFixed(4)}
                      </TableCell>
                      <TableCell className="border-r px-4 text-sm max-w-[300px] truncate">
                        {line.lineDescription || "-"}
                      </TableCell>
                      {(isPickingMode || pickedLines.size > 0 || order.isPickedOrReceived) && (
                        <TableCell className="pr-6">
                          <div className="flex items-center justify-end gap-2">
                            {pickedLines.has(String(line.orderLineId)) ? (
                              <>
                                <Button
                                  size="sm"
                                  className=" text-white flex items-center gap-1.5 h-8 px-3 text-[10px] uppercase font-bold whitespace-nowrap border-none"
                                  onClick={() => fetchLineTransactions(String(line.orderLineId), line.barcodeItemNum)}
                                >
                                  <Check className="w-3.5 h-3.5" /> {isInbound ? "Received" : "Picked"}
                                </Button>
                                {!order.isClosed && !order.isShippedOrReceived && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8   bg-muted text-[11px] font-bold px-3 whitespace-nowrap"
                                      onClick={() => navigate(`/Order/${order.orderHeaderId}/Pick/${line.orderLineId}?from=${encodeURIComponent(backRoute)}`)}
                                    >
                                      {isInbound ? "Edit Receiving" : "Edit Picking"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8  bg-muted  text-[11px] font-bold px-3 whitespace-nowrap"
                                      onClick={() => handleReversePicking(line.orderLineId)}
                                    >
                                      {isInbound ? "Reverse Receiving" : "Reverse Picking"}
                                    </Button>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="h-8   text-white text-[11px] font-bold px-4"
                                  onClick={() => navigate(`/Order/${order.orderHeaderId}/Pick/${line.orderLineId}?from=${encodeURIComponent(backRoute)}`)}
                                >
                                  {isInbound ? "Receive" : "Pick"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8  text-[11px] font-bold px-3 flex items-center gap-1.5"
                                  onClick={() => fetchLineTransactions(String(line.orderLineId), line.barcodeItemNum)}
                                >
                                  <Search className="w-3 h-3" /> {isInbound ? "View Received" : "View Picked"}
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center text-[12px] text-muted-foreground py-3 px-6 bg-muted/20">
            <span>Showing {lines.length > 0 ? 1 : 0} to {lines.length} of {lines.length} entries</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled className="h-7 text-[11px] uppercase font-bold tracking-wider">Previous</Button>
              <Button variant="ghost" size="sm" disabled className="h-7 text-[11px] uppercase font-bold tracking-wider">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GRID FOR DETAILS AND MORE INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ORDER DETAILS SECTION */}
        <Card className="border-t-2 border-t-primary shadow-xl border-x-0 border-b-0 relative overflow-hidden h-full">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Order Details</CardTitle>
            <Badge className=" bg-primary text-white shadow-md border-none px-3 py-1 text-[11px] font-bold uppercase tracking-wider shrink-0 ml-2">
              <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
              {statusLabel}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info Table */}
              <div className="space-y-4">
                {[
                  { label: "Client Doc #:", value: order.documentClientId, extra: "(0 item)" },
                  { label: "Client:", value: order.documentClientId || "apiclient@wms.com" },
                  { label: "Order Date:", value: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-" },
                  { label: "PO #:", value: order.poNum || "-" },
                  { label: "Due Date:", value: order.customerDueDate ? new Date(order.customerDueDate).toLocaleDateString() : "-" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col border-b border-muted/30 pb-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">{item.label}</span>
                    <span className="text-sm font-semibold">
                      {item.value || "-"} {item.extra && <span className="text-muted-foreground/50 text-[10px] font-normal ml-1">{item.extra}</span>}
                    </span>
                  </div>
                ))}
              </div>

              {/* Address Card */}
              <div className="flex flex-col h-full">
                <div className="bg-muted/30 p-5 rounded-2xl border border-border flex flex-col h-full ring-1 ring-border/50 shadow-inner">
                  <div className="text-sm font-bold mb-2 flex items-center justify-between">
                    <span>{order.shipToName || "Recipient Name"}</span>
                    <Badge variant="outline" className="text-[10px] border-muted-foreground/20">{order.documentClientId}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {order.shipToAddress1 && <div className="mb-0.5">{order.shipToAddress1}</div>}
                    {order.shipToAddress2 && <div className="mb-0.5">{order.shipToAddress2}</div>}
                    <div className="mb-0.5">
                      {[order.shipToCity, order.shipToState, order.shipToZip].filter(Boolean).join(", ")}
                    </div>
                    <div className="font-bold text-muted-foreground/60 text-xs mt-1 uppercase tracking-wider">{order.shipToCountry || "N/A"}</div>
                  </div>
                  {!isWorkOrder && (
                    <div className="mt-auto pt-6 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Shipping Charges:</span>
                        <span className="text-sm font-bold text-primary">
                          ${order.shippingAndHandlingCharge ? order.shippingAndHandlingCharge.toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-background hover:bg-accent border-muted shadow-sm mt-2 transition-all">
                        <Printer className="w-3.5 h-3.5 mr-2" /> Packing Slip
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MORE INFO SECTION */}
        <Card className="border-t-2 border-t-slate-800 shadow-xl border-x-0 border-b-0 h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">More Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Freight Info - Hidden for Work Orders */}
              {!isWorkOrder && (
                <div className="space-y-4">
                  {[
                    { label: "Freight Acc#:", value: order.freightAcctNumber },
                    { label: "Freight Quote#:", value: order.freightQuoteNum },
                    { label: "Freight Quote Amount:", value: order.freightQuotedAmount ? `$${order.freightQuotedAmount.toFixed(2)}` : "$0.00", isAmount: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col border-b border-muted/30 pb-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">{item.label}</span>
                      <span className={`text-sm font-semibold ${item.isAmount ? "text-primary" : ""}`}>
                        {item.value || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Assignment Info */}
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col border-b border-muted/30 pb-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    {currentAssignment ? "Assigned To:" : "Assign To:"}
                  </span>
                  <div className="flex flex-col gap-2 mt-1">
                    {currentAssignment ? (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold break-all">{currentAssignment.userEmail || order.createdBy || "Unassigned"}</span>
                        {order.orderTypeId !== "7" && (
                          <Button
                            className="flex items-center gap-2 cursor-pointer px-3 py-1.5   text-white rounded-md text-sm font-medium transition-colors w-fit"
                            onClick={handleUnassignUser}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 7.58 7.58 4 12 4C13.84 4 15.54 4.63 16.9 5.68L5.68 16.9C4.63 15.54 4 13.84 4 12ZM12 20C10.16 20 8.46 19.37 7.1 18.32L18.32 7.1C19.37 8.46 20 10.16 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor" />
                            </svg>
                            Unassign
                          </Button>
                        )}
                      </div>
                    ) : (
                      order.orderTypeId !== "7" ? (
                        <div className="flex flex-col gap-3">
                          <Popover open={openAssign} onOpenChange={setOpenAssign}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openAssign}
                                className="h-8 w-full justify-between text-xs font-normal"
                                disabled={isLoadingUsers}
                              >
                                {selectedAssignee
                                  ? selectedAssignee
                                  : "-- Select One --"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0" align="start">
                              <Command className="[&_[cmdk-list]]:max-h-[300px]">
                                <CommandInput placeholder="Search user..." className="h-8 text-xs" />
                                <CommandList>
                                  <CommandEmpty className="py-2 text-xs">No user found.</CommandEmpty>
                                  <CommandGroup>
                                    {allUsers.map((u) => (
                                      <CommandItem
                                        key={u.userID}
                                        value={u.email}
                                        onSelect={(currentValue) => {
                                          setSelectedAssignee(currentValue === selectedAssignee ? "" : currentValue)
                                          setOpenAssign(false)
                                        }}
                                        className="text-xs"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-3 w-3 text-primary",
                                            selectedAssignee === u.email ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {u.email}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              className="h-9 px-6 text-[11px] uppercase font-bold"
                              onClick={handleAssignUser}
                              disabled={!selectedAssignee}
                            >
                              Assign
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">Unassigned</span>
                      )
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Comments:</span>
                  <div className="text-sm text-muted-foreground bg-muted p-4 rounded-xl border border-border italic min-h-[80px]">
                    {order.comments || "No additional comments provided for this order."}
                  </div>
                  {(currentUserRoles.includes("WarehouseAdmin") || currentUserRoles.includes("WarehouseManager")) && !isPickingMode && !order.isPickedOrReceived && (
                    <div className="mt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider "
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this order?")) {
                            OrderHeaderService.deleteOrderHeader(order.orderHeaderId, "1")
                              .then(() => {
                                toast.success("Order deleted");
                                navigate(backRoute);
                              })
                              .catch(() => toast.error("Failed to delete order"));
                          }
                        }}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1.5" /> Delete Order
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <History className="w-5 h-5 text-primary" />
              Transaction Details - {selectedBarcode}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select className="border rounded px-2 py-1 bg-background">
                  <option>10</option>
                </select>
                <span>records per page</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Search:</span>
                <input type="text" className="border rounded px-3 py-1 bg-background" />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider border-r px-4 whitespace-nowrap">Location</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider border-r px-4 whitespace-nowrap">Barcode</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider border-r px-4 whitespace-nowrap">Qty</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider border-r px-4 whitespace-nowrap">Lot#</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider border-r px-4 whitespace-nowrap">Serial #</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider border-r px-4 whitespace-nowrap">Date Mfg</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider px-4 whitespace-nowrap">Date Exp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingTrans ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground animate-pulse">
                        Loading transaction history...
                      </TableCell>
                    </TableRow>
                  ) : lineLevelTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No transactions found for this item.
                      </TableCell>
                    </TableRow>
                  ) : (
                    lineLevelTransactions.map((t, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium border-r px-4 whitespace-nowrap">{t.warehouseLocation || "N/A"}</TableCell>
                        <TableCell className="font-mono text-xs border-r px-4 whitespace-nowrap">{t.barcodeItemNum}</TableCell>
                        <TableCell className="font-bold border-r px-4 text-center whitespace-nowrap">{Math.abs(t.qtyPickRec || t.signedQty || 0).toFixed(4)}</TableCell>
                        <TableCell className="border-r px-4 whitespace-nowrap">{t.lotNum || "-"}</TableCell>
                        <TableCell className="border-r px-4 whitespace-nowrap">{t.serialNum || "-"}</TableCell>
                        <TableCell className="border-r px-4 whitespace-nowrap font-mono text-[11px] opacity-80">{t.dateMfg ? new Date(t.dateMfg).toLocaleDateString() : "-"}</TableCell>
                        <TableCell className="px-4 whitespace-nowrap font-mono text-[11px] opacity-80">{t.dateExp ? new Date(t.dateExp).toLocaleDateString() : "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
              <span>Showing 1 to {lineLevelTransactions.length} of {lineLevelTransactions.length} entries</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">1</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Line Item Modal */}
      <Dialog open={isEditLineModalOpen} onOpenChange={setIsEditLineModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold  p-4 -mt-6 -mx-6 rounded-t-lg flex justify-between items-center">
              Edit Item
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Item #</label>
              <input
                type="text"
                className="border rounded px-3 py-2 bg-background w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={editLineForm.barcodeItemNum}
                onChange={(e) => setEditLineForm({ ...editLineForm, barcodeItemNum: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Description</label>
              <textarea
                className="border rounded px-3 py-2 bg-background w-full min-h-[80px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={editLineForm.lineDescription}
                onChange={(e) => setEditLineForm({ ...editLineForm, lineDescription: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Quantity</label>
                <input
                  type="number"
                  step="0.0001"
                  className="border rounded px-3 py-2 bg-background w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={editLineForm.orderIncQty}
                  onChange={(e) => setEditLineForm({ ...editLineForm, orderIncQty: Number(e.target.value) })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Units</label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 bg-background w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={editLineForm.unitOfMeasure}
                  onChange={(e) => setEditLineForm({ ...editLineForm, unitOfMeasure: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => setIsEditLineModalOpen(false)}>Close</Button>
            <Button onClick={handleSaveLine}>Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this line item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoadingTrans}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="text-red-500 bg-muted hover:text-red-600 hover:bg-red-50" onClick={confirmDeleteLine}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
