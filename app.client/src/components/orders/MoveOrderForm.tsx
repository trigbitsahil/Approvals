"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  RotateCcw,
  Trash2,
  PackageSearch,
  FileText,
  MapPin,
  ArrowLeft,
  Barcode,
  History
} from "lucide-react";
import Scanner from "@/components/barcode/Scanner";
import { InventoryItemService } from "@/api/services/InventoryItemService";
import { WarehouseUserService } from "@/api/services/WarehouseUserService";
import { UserService } from "@/api/services/UserService";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { OrderTypeService } from "@/api/services/OrderTypeService";
import { WarehouseLocationService } from "@/api/services/WarehouseLocationService";
import { WarehouseTransactionService } from "@/api/services/WarehouseTransactionService";
import { OrderLineService } from "@/api/services/OrderLineService";
import { WarehouseService } from "@/api/services/WarehouseService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Warehouse } from "lucide-react";
import Cookies from "js-cookie";

const API_VERSION = "1";

export const MoveOrderForm = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState("");
  const [orderHeaderId, setOrderHeaderId] = useState<string | null>(null);
  const [moveOrderTypeId, setMoveOrderTypeId] = useState<string | null>(null);
  const [isCreatingHeader, setIsCreatingHeader] = useState(false);

  // Line Item states
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("1.0000");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const [lineItems, setLineItems] = useState<any[]>([]);
  const [isValidatingBarcode, setIsValidatingBarcode] = useState(false);
  const [isValidatingLocation, setIsValidatingLocation] = useState(false);
  const [fromLocationValid, setFromLocationValid] = useState<boolean | null>(null);

  // Dynamic Fields State
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const [lotNum, setLotNum] = useState("");
  const [serialNum, setSerialNum] = useState("");
  const [showLotNum, setShowLotNum] = useState(false);
  const [showSerialNum, setShowSerialNum] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderSubmitted, setIsHeaderSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // SuperAdmin Data
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");

  useEffect(() => {
    const fetchContext = async () => {
      try {
        // 1. Check Role
        const roleRes = await UserService.getMyRoles(API_VERSION);
        const roles = Array.isArray(roleRes.data) ? roleRes.data : [];
        const isAdmin = (roles.includes("SuperAdmin") || roles.includes("WarehouseAdmin"));
        setIsSuperAdmin(isAdmin);

        // 2. Fetch User Email
        const userRes = await UserService.getLoggedInUser(API_VERSION);
        const email = userRes.data?.email || "";
        setUserEmail(email);

        // 3. Fetch Move Order Type ID
        const orderTypesRes = await OrderTypeService.orderTypeGet(API_VERSION);
        const moveType = orderTypesRes.data?.find((t: any) =>
          t.name?.toLowerCase().includes("move") ||
          t.name?.toLowerCase() === "transfer order outbound"
        );
        const actualMoveType = orderTypesRes.data?.find((t: any) => t.name === "Move Order") || moveType;
        setMoveOrderTypeId(actualMoveType?.orderTypeId || null);

        // 4. Handle Warehouse Context
        if (isAdmin) {
          const whRes = await WarehouseService.warehouseGet(API_VERSION);
          const rawWhs = Array.isArray(whRes.data) ? whRes.data : [];
          const normalizedWhs = rawWhs.map((w: any) => {
            const id = String(w.warehouseId ?? w.WarehouseId ?? w.id ?? w.Id ?? "");
            const code = String(w.warehouseCode ?? w.Code ?? w.code ?? "");
            const name = String(w.warehouseName ?? w.Name ?? w.name ?? code ?? "Unknown Warehouse");
            return { id, name, code };
          });
          setWarehouses(normalizedWhs);
        } else {
          const cookieWhId = Cookies.get("selectedWarehouseId");
          let whId = cookieWhId || null;
          if (!whId) {
            const whUsersRes = await WarehouseUserService.warehouseUserGet(API_VERSION);
            const loggedUserWH = whUsersRes.data?.find((wu: any) => (wu.userEmail || wu.email) === email);
            whId = loggedUserWH?.warehouseUserId || loggedUserWH?.warehouseId || null;
          }
          setWarehouseId(whId);
        }

      } catch (e) {
        console.error("Failed to fetch form context", e);
      }
    };
    fetchContext();
  }, []);

  /** Validates a barcode via API; fills barcode field on success, shows error toast on failure */
  const validateBarcode = async (code: string) => {
    if (!code.trim() || isValidatingBarcode) return;
    setIsValidatingBarcode(true);
    try {
      const response = await InventoryItemService.getInventoryItemByCode(API_VERSION, code.trim());
      if (response?.data?.ownerBarcodeItemNum) {
        setBarcode(response.data.ownerBarcodeItemNum);
        setShowLotNum(response.data.isLotRequired === true);
        setShowSerialNum(response.data.isSnRequired === true);
        setLotNum("");
        setSerialNum("");
        setFromLocationValid(null);
        // toast.success(`Barcode "${response.data.ownerBarcodeItemNum}" is valid ✓`);
      } else {
        toast.error(`Barcode "${code}" not found. Please enter a valid barcode.`);
      }
    } catch {
      toast.error(`Invalid barcode`);
    } finally {
      setIsValidatingBarcode(false);
    }
  };

  /** Checks if the current barcode exists at the given from-location and lot using count API */
  const validateFromLocation = async (location: string, lot: string) => {
    if (!location.trim()) return;
    if (!barcode.trim()) {
      toast.error("Please enter a barcode first before validating the location.");
      return;
    }
    if (isValidatingLocation) return;
    setIsValidatingLocation(true);
    try {
      // Use the correct warehouseId based on role
      const effectiveWarehouseId = isSuperAdmin ? selectedWarehouseId : warehouseId;
      
      if (!effectiveWarehouseId) {
        toast.error("Warehouse ID not found. Please select a warehouse in the header.");
        return;
      }

      // Fetch inventory count using the correct warehouseId
      const response = await InventoryItemService.getInventoryItemCountInfo(
        API_VERSION,
        barcode.trim(),
        location.trim(),
        lot.trim() || undefined,
        effectiveWarehouseId
      );
      const count = Number(response?.data?.count ?? 0);
      if (count > 0) {
        setFromLocationValid(true);
        toast.success(`Barcode found at "${location}" (qty: ${count}) ✓`);
      } else {
        setFromLocationValid(false);
        toast.error(`Barcode "${barcode}" not found at location "${location}".`);
      }
    } catch {
      setFromLocationValid(false);
      toast.error(`Could not verify location "${location}". Please check and try again.`);
    } finally {
      setIsValidatingLocation(false);
    }
  };

  /** Called when camera scans or search button clicked — validate immediately */
  const handleScan = (code: string) => {
    validateBarcode(code);
  };

  const handleAddLine = async () => {
    if (!barcode || !fromLocation || !toLocation || !quantity) {
      toast.error("Please fill all required fields");
      return;
    }
    if (showLotNum && !lotNum) {
      toast.error("Please enter a Lot Number");
      return;
    }
    if (showSerialNum && !serialNum) {
      toast.error("Please enter a Serial Number");
      return;
    }
    if (fromLocationValid === false) {
      toast.error(`Barcode "${barcode}" not found at location "${fromLocation}". Cannot add line item.`);
      return;
    }

    try {
      setIsSubmitting(true);

      // Validate Locations and get IDs ahead of time
      const fromLocRes = await WarehouseLocationService.getWarehouseLocationByCode(API_VERSION, fromLocation);
      if (!fromLocRes.success || !fromLocRes.data) {
        toast.error(`Source location "${fromLocation}" not found.`);
        return;
      }
      const fromLocId = fromLocRes.data.warehouseLocationId;

      const toLocRes = await WarehouseLocationService.getWarehouseLocationByCode(API_VERSION, toLocation);
      if (!toLocRes.success || !toLocRes.data) {
        toast.error(`Destination location "${toLocation}" not found.`);
        return;
      }
      const toLocId = toLocRes.data.warehouseLocationId;

      const effectiveWarehouseId = isSuperAdmin ? selectedWarehouseId : warehouseId;

      // New: Check Available Inventory Count
      const countRes = await InventoryItemService.getInventoryItemCountInfo(
        API_VERSION,
        barcode.trim(),
        fromLocation.trim(),
        lotNum.trim() || undefined,
        effectiveWarehouseId || ""
      );

      const availableCount = Number(countRes?.data?.count ?? 0);
      const reqQty = Number(quantity);

      if (reqQty > availableCount) {
        toast.error("Insufficient Inventory", {
          description: `Cannot move ${reqQty}. Available count at this location is ${availableCount.toFixed(4)}.`
        });
        return;
      }

      const newItem = {
        barcode: barcode,
        from: fromLocation,
        fromLocId: fromLocId,
        to: toLocation,
        toLocId: toLocId,
        quantity: quantity,
        lotNum: showLotNum ? lotNum : null,
        serialNum: showSerialNum ? serialNum : null,
      };

      setLineItems([newItem, ...lineItems]);
      handleReset();
      toast.success("Line item added to list");
    } catch (e) {
      console.error("Failed to validate locations:", e);
      toast.error("Failed to validate locations. Please check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBarcode("");
    setQuantity("1.0000");
    setFromLocation("");
    setToLocation("");
    setLotNum("");
    setSerialNum("");
    setShowLotNum(false);
    setShowSerialNum(false);
    setFromLocationValid(null);
  };

  const handleSubmit = async () => {
    if (lineItems.length === 0) {
      toast.error("Add at least one line item before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Determine WarehouseId
      let finalWarehouseId = warehouseId;
      if (isSuperAdmin) {
        if (!selectedWarehouseId) {
          toast.error("Please select a warehouse");
          setIsSubmitting(false);
          return;
        }
        finalWarehouseId = selectedWarehouseId;
      }

      const headerPayload = {
        orderTypeId: moveOrderTypeId,
        warehouseId: finalWarehouseId,
        documentClientId: "-",
        discrepancyDetail: comments || "-",
        comments: comments || null,
        orderDate: new Date().toISOString(),
        moving: true
      };

      console.log("Creating Move Order Header:", headerPayload);
      const headerRes: any = await OrderHeaderService.orderHeaderPost(API_VERSION, headerPayload);
      const newOrderHeaderId = headerRes?.data?.orderHeaderId || headerRes?.orderHeaderId;

      if (!newOrderHeaderId) {
        throw new Error("Failed to create Order Header");
      }

      // 2. Post all Line Items and Transactions
      for (const item of lineItems) {
        const qtyNum = Number(item.quantity);

        // A. Post Order Line
        const lineRes = await OrderLineService.orderLinePost(API_VERSION, {
          orderHeaderId: newOrderHeaderId,
          barcodeItemNum: item.barcode,
          lineDescription: `Move from ${item.from} to ${item.to}`,
          orderIncQty: qtyNum,
          unitOfMeasure: "EA",
        });
        const orderLineId = lineRes?.data?.orderLineId || "0";

        // B. Post dual Warehouse Transactions
        const commonTx = {
          orderLineId: orderLineId,
          orderTypeId: moveOrderTypeId,
          warehouseId: isSuperAdmin ? selectedWarehouseId : warehouseId,
          orderHeaderId: newOrderHeaderId,
          barcodeItemNum: item.barcode,
          qtyPickRec: qtyNum,
          lotNum: item.lotNum,
          serialNum: item.serialNum,
          userEmail: userEmail,
          transactionDate: new Date().toISOString(),
          recordedAt: new Date().toISOString(),
        };

        // Tx From (Decrease)
        await WarehouseTransactionService.warehouseTransactionPost(API_VERSION, {
          ...commonTx,
          warehouseLocationId: item.fromLocId,
          warehouseLocationCode: item.from,
          isIncrease: false,
          decreaseQty: qtyNum,
          increaseQty: 0,
          signedQty: -qtyNum,
        });

        // Tx To (Increase)
        await WarehouseTransactionService.warehouseTransactionPost(API_VERSION, {
          ...commonTx,
          warehouseLocationId: item.toLocId,
          warehouseLocationCode: item.to,
          isIncrease: true,
          decreaseQty: 0,
          increaseQty: qtyNum,
          signedQty: qtyNum,
        });
      }

      toast.success("Move Order submitted successfully ✓");
      navigate("/Order/Move");
    } catch (error: any) {
      console.error("Submission failed:", error);
      toast.error(error?.body?.message || "Final submission failed. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-6 px-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Create Move Order</h1>

        </div>
        <Button
          variant="default"
          size="sm"
          className="h-8 text-xs font-bold uppercase transition-all shadow-md px-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Move Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ADD HEADER SECTION - Order 1 always */}
        <Card className="border-t-2 border-t-primary shadow-sm overflow-hidden lg:col-span-2 order-1 h-fit">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Add Header
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className={`grid grid-cols-1 ${isSuperAdmin ? 'md:grid-cols-2' : ''} items-end gap-6`}>
              {isSuperAdmin && (
                <div className="space-y-2 lg:col-span-1">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Warehouse className="w-3 h-3" /> Select Warehouse
                  </Label>
                  <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId} disabled={isSubmitting}>
                    <SelectTrigger className="bg-muted/30 border-muted focus:ring-primary rounded-xl h-10">
                      <SelectValue placeholder="Search warehouse..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id} className="cursor-pointer">
                          <div className="flex flex-col">
                            <span className="font-bold">{w.name}</span>
                            <span className="text-[10px] opacity-60 font-mono">{w.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Comments (if any)</Label>
                <Input
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter additional notes..."
                  className="bg-muted/30 "
                />
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting || lineItems.length === 0} className="font-bold h-10 px-8 transition-all shadow-md">
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SCANNER SECTION - Order 2 on mobile, spans 2 rows on desktop on the right */}
        <Card className="border-t-2 border-t-primary shadow-md overflow-hidden lg:col-start-3 lg:row-span-2 order-2 h-fit">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Barcode className="w-4 h-4 text-primary" /> Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Scanner onScan={handleScan} onBlur={validateBarcode} />
          </CardContent>
        </Card>

        {/* ADD LINE ITEM SECTION - Order 3 on mobile, below Header on desktop */}
        <Card className="border-t-2 border-t-primary shadow-sm overflow-hidden lg:col-span-2 order-3">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <PackageSearch className="w-4 h-4 text-primary" /> Add Line Item
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-6">
              <div className="sm:col-span-6 space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest">Barcode</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter or scan barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="bg-muted/30  pl-10 h-11 font-mono"
                  />
                  <Barcode className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground/50" />
                </div>
              </div>



              <div className="sm:col-span-6 space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest">Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-muted/30  h-11 font-bold"
                />
              </div>

              <div className={`space-y-2 ${(!showLotNum && !showSerialNum) ? "sm:col-span-6" : (showLotNum && showSerialNum ? "sm:col-span-4" : "sm:col-span-6")}`}>
                <Label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                  From Location
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Source Location"
                    value={fromLocation}
                    onChange={(e) => {
                      setFromLocation(e.target.value);
                      setFromLocationValid(null);
                    }}
                    onBlur={() => validateFromLocation(fromLocation, lotNum)}
                    className={`bg-muted/30 pl-10 h-11 ${fromLocationValid === false ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground/50" />
                </div>
              </div>

              {showLotNum && (
                <div className={`space-y-2 ${showSerialNum ? "sm:col-span-4" : "sm:col-span-6"}`}>
                  <Label className="text-[11px] font-bold uppercase tracking-widest">Lot #</Label>
                  <Input
                    placeholder="Enter Lot #"
                    value={lotNum}
                    onChange={(e) => {
                      setLotNum(e.target.value);
                      setFromLocationValid(null);
                    }}
                    onBlur={() => validateFromLocation(fromLocation, lotNum)}
                    className="bg-muted/30 h-11"
                  />
                </div>
              )}

              {showSerialNum && (
                <div className={`space-y-2 ${showLotNum ? "sm:col-span-4" : "sm:col-span-6"}`}>
                  <Label className="text-[11px] font-bold uppercase tracking-widest">Serial Number</Label>
                  <Input
                    placeholder="Enter Serial #"
                    value={serialNum}
                    onChange={(e) => setSerialNum(e.target.value)}
                    className="bg-muted/30 h-11"
                  />
                </div>
              )}

              <div className={`space-y-2 ${(!showLotNum && !showSerialNum) ? "sm:col-span-6" : "sm:col-span-6"}`}>
                <Label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                  To Location
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Destination Location"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="bg-muted/30  pl-10 h-11"
                  />
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground/50" />
                </div>
              </div>
            </div>

            <div className={`flex gap-3`}>
              <Button size="lg" className="flex-1 font-bold transition-all" onClick={handleAddLine} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
              <Button size="lg" variant="outline" className="px-8 border-muted hover:bg-muted font-bold" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LINE ITEM DETAILS TABLE */}
      <Card className="shadow-lg border-border border-t-2 border-t-slate-800 overflow-hidden">
        <CardHeader className="pb-3 bg-muted/30 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            Line Item Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b">
                <TableRow>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider pl-6">Barcode</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider">From</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider">To</TableHead>
                  {lineItems.some(i => i.lotNum) && (
                    <TableHead className="font-bold uppercase text-[11px] tracking-wider">Lot #</TableHead>
                  )}
                  {lineItems.some(i => i.serialNum) && (
                    <TableHead className="font-bold uppercase text-[11px] tracking-wider">Serial #</TableHead>
                  )}
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider">Quantity</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider pr-6 text-right">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-muted-foreground italic">
                      No matching records found
                    </TableCell>
                  </TableRow>
                ) : (
                  lineItems.map((item, i) => (
                    <TableRow key={i} className="hover:bg-muted/20 transition-colors border-b last:border-0 font-medium text-sm">
                      <TableCell className="pl-6">{item.barcode}</TableCell>
                      <TableCell>{item.from}</TableCell>
                      <TableCell>{item.to}</TableCell>
                      {lineItems.some(i => i.lotNum) && (
                        <TableCell>{item.lotNum || "-"}</TableCell>
                      )}
                      {lineItems.some(i => i.serialNum) && (
                        <TableCell>{item.serialNum || "-"}</TableCell>
                      )}
                      <TableCell className="font-bold">{item.quantity}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-4 text-[10px] font-bold uppercase bg-red-500 hover:bg-red-600 shadow-sm"
                          onClick={() => setLineItems(lineItems.filter((_, idx) => idx !== i))}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center text-[11px] text-muted-foreground py-4 px-6 bg-muted/20 border-t">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-tighter">Total Items:</span>
                <span className="text-foreground font-bold">{lineItems.length}</span>
              </div>
              <span>Showing {lineItems.length > 0 ? 1 : 0} to {lineItems.length} of {lineItems.length} entries</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled className="h-7 text-[10px] uppercase font-bold tracking-wider">Previous</Button>
              <Button variant="outline" size="sm" disabled className="h-7 w-7 p-0 text-[10px] font-bold">1</Button>
              <Button variant="ghost" size="sm" disabled className="h-7 text-[10px] uppercase font-bold tracking-wider">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
