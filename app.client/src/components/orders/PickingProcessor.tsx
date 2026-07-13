"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Barcode,
  History,
  Info,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import Scanner from "@/components/barcode/Scanner";
import { WarehouseLocationService } from "@/api/services/WarehouseLocationService";
import { WarehouseTransactionService } from "@/api/services/WarehouseTransactionService";
import { UserService } from "@/api/services/UserService";
import { WarehouseUserService } from "@/api/services/WarehouseUserService";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { InventoryItemService } from "@/api/services/InventoryItemService";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { cn } from "@/utils/cn";
import Cookies from "js-cookie";

interface PickingProcessorProps {
  order: any;
  lineItem: any;
  from?: string;
}

export const PickingProcessor = ({ order, lineItem, from }: PickingProcessorProps) => {
  const navigate = useNavigate();
  const { id, lineId } = useParams();
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [location, setLocation] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [picks, setPicks] = useState<any[]>([]);
  const [lineTransactions, setLineTransactions] = useState<any[]>([]);
  const [loadingLines, setLoadingLines] = useState(false);

  // Product Items modal state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [isProductDetailsLoading, setIsProductDetailsLoading] = useState(false);
  const [selectedProductBarcode, setSelectedProductBarcode] = useState<string | null>(null);

  // Dynamic field flags
  const [isLotRequired, setIsLotRequired] = useState(false);
  const [isSnRequired, setIsSnRequired] = useState(false);
  const [isDateMfgRequired, setIsDateMfgRequired] = useState(false);
  const [isDateExpRequired, setIsDateExpRequired] = useState(false);

  // Dynamic field values
  const [serialNumber, setSerialNumber] = useState("");
  const [mfgDate, setMfgDate] = useState<string | undefined>(undefined);
  const [expDate, setExpDate] = useState<string | undefined>(undefined);

  const isInbound =
    from?.toLowerCase().includes("inbound") ||
    order?.receiving === true;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!lineItem?.orderLineId) return;
      setLoadingLines(true);
      try {
        const res: any = await WarehouseTransactionService.getWarehouseTransactionListByLine("1", lineItem.orderLineId);
        if (res?.data && Array.isArray(res.data)) {
          setLineTransactions(res.data);
        } else {
          setLineTransactions([]);
        }
      } catch (error) {
        console.error("Failed to fetch transactions for line", error);
        setLineTransactions([]);
      } finally {
        setLoadingLines(false);
      }
    };

    fetchTransactions();
  }, [lineItem?.orderLineId]);

  const handleBarcodeLookup = async (code: string) => {
    if (!code) return;
    try {
      const res: any = await InventoryItemService.getInventoryItemByCode("1", code);
      if (res && res.data) {
        toast.success("Item found and populated");
        setScannedBarcode(code);

        // Update requirement flags from API
        setIsLotRequired(res.data.isLotRequired === true);
        setIsSnRequired(res.data.isSnRequired === true);
        setIsDateMfgRequired(res.data.isDateMfgRequired === true);
        setIsDateExpRequired(res.data.isDateExpRequired === true);
      }
    } catch (error: any) {
      setScannedBarcode("");
      setIsLotRequired(false);
      setIsSnRequired(false);
      setIsDateMfgRequired(false);
      setIsDateExpRequired(false);
      if (error?.status === 404) {
        toast.error("Barcode not found");
      } else {
        console.error("Failed to fetch item by barcode", error);
      }
    }
  };

  const handleScan = (code: string) => {
    handleBarcodeLookup(code);
  };

  /** Open Product Items modal (same logic as InventoryItemList) */
  const handleBarcodeInfoClick = async (barcode: string) => {
    const trimmed = barcode.trim();
    if (!trimmed) return;
    setSelectedProductBarcode(trimmed);
    setIsProductDialogOpen(true);
    setProductDetails([]);
    setIsProductDetailsLoading(true);

    try {
      const userRes = await UserService.getLoggedInUser("1");
      const userEmail = userRes.data?.email || "";

      const whUsersRes = await WarehouseUserService.warehouseUserGet("1");
      const loggedUserWH = whUsersRes.data?.find(
        (wu: any) => wu.userEmail === userEmail || wu.email === userEmail
      );
      const warehouseId = loggedUserWH?.warehouseId;

      if (!warehouseId) {
        console.error("No warehouse associated with your account.");
        return;
      }

      const res = await InventoryItemService.getInventoryItemInfo("1", trimmed, warehouseId);
      if (res.success && res.data) {
        const dataArr = Array.isArray(res.data) ? res.data : [res.data];
        setProductDetails(dataArr);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setIsProductDetailsLoading(false);
    }
  };

  const handleRemoveTransaction = async (transactionId: string) => {
    if (!transactionId || transactionId.startsWith("local-")) {
      // Remove local-only optimistic entry without API call
      setLineTransactions(prev => prev.filter(t => t.warehouseTransactionId !== transactionId));
      return;
    }
    try {
      await WarehouseTransactionService.deleteWarehouseTransaction(transactionId, "1", order.orderHeaderId);
      setLineTransactions(prev => prev.filter(t => t.warehouseTransactionId !== transactionId));
      toast.success("Transaction removed successfully.");
    } catch (error) {
      console.error("Failed to delete transaction", error);
      toast.error("Failed to remove transaction", { description: "Please try again." });
    }
  };

  const handleAddPick = async () => {
    if (!location || !scannedBarcode || !quantity) {
      toast.error("Missing fields", { description: "Please enter location, barcode, and quantity." });
      return;
    }

    // Validate: total picked + new qty must not exceed order qty
    const rawQty = isInbound ? lineItem.orderIncQty : Math.abs(lineItem.orderDecQty || 0);
    const orderQty = parseFloat(rawQty || 0);
    const alreadyPicked = lineTransactions.reduce((acc, t) => acc + Math.abs(t.qtyPickRec ?? t.increaseQty ?? t.decreaseQty ?? t.signedQty ?? 0), 0);
    const newQty = parseFloat(quantity);

    if (alreadyPicked + newQty > orderQty) {
      const remaining = orderQty - alreadyPicked;
      toast.error("Quantity Exceeded", {
        description: `Cannot pick ${newQty} units. Already picked: ${alreadyPicked}, Order qty: ${orderQty}. Remaining: ${remaining > 0 ? remaining : 0}.`,
        duration: 5000,
      });
      return;
    }

    if (isInbound) {
      const missingFields = [];
      if (isLotRequired && !lotNumber) missingFields.push("Lot Number");
      if (isSnRequired && !serialNumber) missingFields.push("Serial Number");
      if (isDateMfgRequired && !mfgDate) missingFields.push("Mfg Date");
      if (isDateExpRequired && !expDate) missingFields.push("Exp Date");

      if (missingFields.length > 0) {
        toast.error("Missing required fields", {
          description: `Please fill in: ${missingFields.join(", ")}`
        });
        return;
      }
    } else {
      // New: Check Available Inventory Count for Outbound/Move
      try {
        const cookieWhId = Cookies.get("selectedWarehouseId");
        const effectiveWhId = cookieWhId;
        const countRes = await InventoryItemService.getInventoryItemCountInfo(
          "1",
          scannedBarcode.trim(),
          location.trim(),
          lotNumber.trim() || undefined,
          effectiveWhId || ""
        );

        const availableCount = Number(countRes?.data?.count ?? 0);
        const reqQty = Number(quantity);

        if (reqQty > availableCount) {
          toast.error("Insufficient Inventory", {
            description: `Cannot pick ${reqQty}. Available count at this location (${location}) is ${availableCount.toFixed(4)}.`
          });
          return;
        }
      } catch (e) {
        console.error("Failed to check inventory count:", e);
        // Optionally decide if failure stops the process. For now, we continue or fail.
        toast.error("Inventory Check Failed", { description: "Could not verify stock levels." });
        return;
      }
    }

    try {
      // 1. Get Logged In User Email
      const userRes = await UserService.getLoggedInUser("1");
      const userEmail = userRes.data?.email;

      if (!userEmail) {
        toast.error("User Error", { description: "Failed to fetch logged-in user email." });
        return;
      }

      // 2. Resolve Warehouse Location Detail
      // Use the warehouseId from cookies as requested
      const cookieWhId = Cookies.get("selectedWarehouseId");
      const effectiveWhId = cookieWhId || order.warehouseId;

      // First, get all locations to find the one associated with this warehouse
      const locationsRes = await WarehouseLocationService.warehouseLocationGet("1");

      const warehouseLocations = locationsRes.data?.filter(
        (loc: any) => loc.warehouseId === effectiveWhId
      ) || [];

      console.log("PickingProcessor: Validating Location", {
        userInput: location,
        effectiveWhId: effectiveWhId,
        availableLocationsCount: warehouseLocations.length,
        firstFewLocs: warehouseLocations.slice(0, 3)
      });

      // We match the user's input 'location' against the locationCode or description
      const normalizedInput = location.trim().toLowerCase();
      const matchedLoc = warehouseLocations.find(
        (loc: any) =>
          loc.locationCode?.trim().toLowerCase() === normalizedInput ||
          loc.locationDescription?.trim().toLowerCase() === normalizedInput
      );

      if (!matchedLoc) {
        console.warn("PickingProcessor: Location Match Failed", {
          normalizedInput,
          availableCodes: warehouseLocations.map(l => l.locationCode)
        });
        toast.error("Invalid Location", { description: "The provided location was not found for this warehouse." });
        return;
      }

      // Now, as specifically requested, we call getWarehouseLocationByCode using the code from the API
      const locDetailRes = await WarehouseLocationService.getWarehouseLocationByCode("1", matchedLoc.locationCode);
      const warehouseLocationId = locDetailRes.data?.warehouseLocationId;

      if (!warehouseLocationId) {
        toast.error("Location ID Error", { description: "Failed to resolve warehouse location ID." });
        return;
      }

      // 3. Call Warehouse Transaction Service
      await WarehouseTransactionService.warehouseTransactionPost("1", {
        warehouseId: effectiveWhId,
        barcodeItemNum: scannedBarcode,
        warehouseLocationId: warehouseLocationId,
        warehouseLocationCode: matchedLoc.locationCode,
        orderTypeId: order.orderTypeId,
        orderHeaderId: order.orderHeaderId,
        orderLineId: lineItem.orderLineId,
        qtyPickRec: parseFloat(quantity),
        increaseQty: isInbound ? parseFloat(quantity) : 0,
        decreaseQty: isInbound ? 0 : parseFloat(quantity),
        signedQty: isInbound ? parseFloat(quantity) : -parseFloat(quantity),
        isIncrease: isInbound,
        lotNum: lotNumber,
        serialNum: serialNumber,
        dateMfg: mfgDate,
        dateExp: expDate,
        transactionDate: new Date().toISOString(),
        recordedAt: new Date().toISOString(),
        userEmail: userEmail,
        userModifiedEmail: userEmail
      });



      const newPick = {
        pickId: Math.floor(Math.random() * 10000),
        location: matchedLoc.locationCode,
        barcode: scannedBarcode,
        quantity,
        lotNumber,
        time: new Date().toLocaleTimeString(),
      };

      const updatedPicks = [newPick, ...picks];
      setPicks(updatedPicks);

      // Also update local lineTransactions to show the new pick immediately
      setLineTransactions(prev => [
        {
          warehouseTransactionId: `local-${Date.now()}`,
          barcodeItemNum: lineItem.barcodeItemNum,
          lineId: lineItem.orderLineId,
          qtyPickRec: parseFloat(quantity),
          decreaseQty: parseFloat(quantity),
          warehouseLocation: matchedLoc.locationCode,
          lotNum: lotNumber,
          serialNum: serialNumber,
          dateMfg: mfgDate,
          dateExp: expDate,
          transactionDate: new Date().toISOString(),
        },
        ...prev
      ]);

      toast.success("Item picked successfully!", {
        description: `Added ${quantity} units to location ${matchedLoc.locationCode}`,
        duration: 3000,
      });

      // Reset form
      setScannedBarcode("");
      setQuantity("1");
      setLotNumber("");
      setSerialNumber("");
      setMfgDate(undefined);
      setExpDate(undefined);
      setIsLotRequired(false);
      setIsSnRequired(false);
      setIsDateMfgRequired(false);
      setIsDateExpRequired(false);
    } catch (error) {
      console.error("Failed to add pick", error);
      toast.error("Failed to add pick", {
        description: "An error occurred while communicating with the server."
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-6 px-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Line Item Order Details</h1>

          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 h-8 text-xs font-bold uppercase tracking-wider bg-muted hover:bg-transparent"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Order
            </Button>
          </div>
        </div>
        <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-950/20 px-3 py-1 font-bold">
          {isInbound ? "Receiving" : "Picking"} in Progress
        </Badge>
      </div>

      {/* LINE ITEM SUMMARY CARD */}
      <Card className="border-t-2 border-t-primary shadow-lg border-x-0 border-b-0">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" /> {isInbound ? "In" : "Out"} Order Line Item Detail
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Barcode:</span>
              <Badge
                className="w-fit text-white font-mono px-3 cursor-pointer hover:opacity-80 transition-opacity active:scale-95"
                onClick={() => handleBarcodeInfoClick(lineItem.barcodeItemNum)}
              >
                <Search className="w-3 h-3 mr-1" />
                {lineItem.barcodeItemNum}
              </Badge>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Order Qty:</span>
              <span className="text-lg font-bold">{parseFloat((isInbound ? lineItem.orderIncQty : Math.abs(lineItem.orderDecQty || 0)) || 0).toFixed(4)}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{isInbound ? "Received" : "Picked"} Qty:</span>
              <span className="text-lg font-bold ">
                {lineTransactions.reduce((acc, t) => acc + Math.abs(t.qtyPickRec ?? t.increaseQty ?? t.decreaseQty ?? t.signedQty ?? 0), 0).toFixed(4)}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Description:</span>
              <span className="text-sm font-medium italic text-muted-foreground">{lineItem.lineDescription || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PICKING INTERACTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SCANNER COMPONENT */}
        <Card className="lg:col-span-1 lg:order-2 border-t-2 border-t-primary shadow-lg border-x-0 border-b-0 overflow-hidden">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Barcode className="w-4 h-4 text-primary" /> Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Scanner onScan={handleScan} onBlur={handleScan} />
          </CardContent>
        </Card>

        {/* ADD PICK FORM */}
        <Card className="lg:col-span-2 lg:order-1 border-t-2 border-t-primary shadow-lg border-x-0 border-b-0 ring-1 ring-border/50">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PackageCheck className="w-5 h-5  text-primary" />
              Add Line Item
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest">Location</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter or scan location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-muted/30 border-muted focus:ring-blue-500 transition-all rounded-xl pl-10"
                  />
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest">Barcode</Label>
                <div className="relative">
                  <Input
                    placeholder="Barcode will appear here"
                    value={scannedBarcode}
                    onChange={(e) => setScannedBarcode(e.target.value)}
                    onBlur={() => handleBarcodeLookup(scannedBarcode)}
                    className="bg-muted focus:ring-blue-500 transition-all font-mono font-bold rounded-xl pl-10"
                  />
                  <Barcode className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest">Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-muted/30 border-muted focus:ring-blue-500 font-bold transition-all rounded-xl"
                />
              </div>

              {/* DYNAMIC FIELDS FOR INBOUND */}
              {isInbound && (
                <>
                  {isLotRequired && (
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest">Lot Number</Label>
                      <Input
                        placeholder="Lot #"
                        value={lotNumber}
                        onChange={(e) => setLotNumber(e.target.value)}
                        className="bg-muted/30 border-muted focus:ring-blue-500 transition-all rounded-xl"
                      />
                    </div>
                  )}
                  {isSnRequired && (
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest">Serial Number</Label>
                      <Input
                        placeholder="Serial #"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="bg-muted/30 border-muted focus:ring-blue-500 transition-all rounded-xl"
                      />
                    </div>
                  )}
                  {isDateMfgRequired && (
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest">Date Mfg</Label>
                      <DatePickerInput
                        value={mfgDate}
                        onChange={(val) => setMfgDate(val)}
                        placeholder="Mfg Date"
                      />
                    </div>
                  )}
                  {isDateExpRequired && (
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest">Date Exp</Label>
                      <DatePickerInput
                        value={expDate}
                        onChange={(val) => setExpDate(val)}
                        placeholder="Exp Date"
                      />
                    </div>
                  )}
                </>
              )}

              {/* SHARED FIELDS (e.g. Lot for Outbound) */}
              {!isInbound && (
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest">Lot Number</Label>
                  <Input
                    placeholder="Optional Lot #"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="bg-muted/30 border-muted focus:ring-blue-500 transition-all rounded-xl"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button size="lg" className="flex-1   shadow-md font-bold transition-all text-white" onClick={handleAddPick}>
                <Plus className="w-4 h-4 mr-2" /> Add Pick
              </Button>
              <Button size="lg" variant="outline" className="px-6 border-muted hover:bg-muted transition-all" onClick={() => {
                setScannedBarcode("");
                setLocation("");
                setLotNumber("");
                setQuantity("1");
                setSerialNumber("");
                setMfgDate(undefined);
                setExpDate(undefined);
                setIsLotRequired(false);
                setIsSnRequired(false);
                setIsDateMfgRequired(false);
                setIsDateExpRequired(false);
              }}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WAREHOUSE TRANSACTIONS TABLE */}
      <Card className="shadow-lg border-border">
        <CardHeader className="pb-3 bg-muted/10 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            Transaction History for This Line
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30 border-b">
                <TableRow>
                  <TableHead className="w-[60px] font-bold uppercase text-[11px] tracking-wider pl-6 border-r px-4">#</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Barcode</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Location</TableHead>
                  {isInbound ? (
                    <>
                      {isLotRequired && <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Lot #</TableHead>}
                      {isSnRequired && <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Serial #</TableHead>}
                      {isDateMfgRequired && <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Mfg Date</TableHead>}
                      {isDateExpRequired && <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Exp Date</TableHead>}
                    </>
                  ) : (
                    <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Lot #</TableHead>
                  )}
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4 text-center">Qty {isInbound ? "Recv" : "Pick"}</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider border-r px-4">Date</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider px-4 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingLines ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground animate-pulse">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : lineTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No transactions found for this line item.
                    </TableCell>
                  </TableRow>
                ) : (
                  lineTransactions.map((t, i) => (
                    <TableRow key={t.warehouseTransactionId || i} className="hover:bg-muted/20 transition-colors border-b">
                      <TableCell className="font-semibold text-foreground pl-6 border-r px-4">{i + 1}</TableCell>
                      <TableCell className="border-r px-4">
                        <Badge variant="outline" className="bg-muted/50 font-mono text-xs">
                          {t.barcodeItemNum || lineItem.barcodeItemNum}
                        </Badge>
                      </TableCell>
                      <TableCell className="border-r px-4 text-sm">{t.warehouseLocation || "—"}</TableCell>
                      {isInbound ? (
                        <>
                          {isLotRequired && <TableCell className="border-r px-4 text-sm italic opacity-70">{t.lotNum || "—"}</TableCell>}
                          {isSnRequired && <TableCell className="border-r px-4 text-sm italic opacity-70">{t.serialNum || "—"}</TableCell>}
                          {isDateMfgRequired && <TableCell className="border-r px-4 text-sm italic opacity-70">{t.dateMfg ? new Date(t.dateMfg).toLocaleDateString() : "—"}</TableCell>}
                          {isDateExpRequired && <TableCell className="border-r px-4 text-sm italic opacity-70">{t.dateExp ? new Date(t.dateExp).toLocaleDateString() : "—"}</TableCell>}
                        </>
                      ) : (
                        <TableCell className="border-r px-4 text-sm italic opacity-70">{t.lotNum || "—"}</TableCell>
                      )}
                      <TableCell className="border-r px-4 text-center">
                        <Badge className=" text-white font-bold">
                          {parseFloat(t.qtyPickRec || t.decreaseQty || 0).toFixed(0)}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 px-4 text-xs text-muted-foreground border-r">
                        {t.transactionDate ? new Date(t.transactionDate).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="px-4 text-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveTransaction(t.warehouseTransactionId)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center text-[12px] text-muted-foreground py-3 px-6 bg-muted/10 border-t">
            <span>Showing {lineTransactions.length > 0 ? 1 : 0} to {lineTransactions.length} of {lineTransactions.length} entries</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled className="h-7 text-[11px] uppercase font-bold tracking-wider">Previous</Button>
              <Button variant="ghost" size="sm" disabled className="h-7 text-[11px] uppercase font-bold tracking-wider">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* PRODUCT ITEMS DIALOG (same as InventoryItemList) */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary/90 text-white px-6 py-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-bold">Product Items</DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center bg-muted/20 p-3 rounded-md border text-sm">
              <div className="flex items-center gap-2">
                <select className="bg-background border rounded px-2 py-1 outline-none">
                  <option>10</option>
                </select>
                <span className="text-muted-foreground">records per page</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Search:</span>
                <Input className="h-8 w-48" />
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold border-r text-foreground h-10">ItemCode</TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10">Location</TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10">Lot#</TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10">Quantity</TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10">Date Mfg</TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10">Date Exp</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isProductDetailsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic">
                        Loading details...
                      </TableCell>
                    </TableRow>
                  ) : productDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic">
                        No details found for this barcode
                      </TableCell>
                    </TableRow>
                  ) : (
                    productDetails.map((detail, i) => (
                      <TableRow key={i} className="hover:bg-muted/30">
                        <TableCell className="border-r font-medium">{detail.ownerBarcodeItemNum}</TableCell>
                        <TableCell className="border-r">{detail.locationCode}</TableCell>
                        <TableCell className="border-r font-mono text-xs">{detail.lotNum}</TableCell>
                        <TableCell className="border-r font-bold">{detail.quantity}</TableCell>
                        <TableCell className="border-r text-xs">{detail.dateMfg}</TableCell>
                        <TableCell className="border-r text-xs">{detail.dateExp}</TableCell>

                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center text-[12px] text-muted-foreground">
              <span>Showing 1 to {productDetails.length} of {productDetails.length} entries</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled className="h-7 px-2 text-[10px] font-bold">Previous</Button>
                <Button size="sm" className="h-7 w-7 p-0 text-white font-bold text-[10px]">1</Button>
                <Button variant="ghost" size="sm" disabled className="h-7 px-2 text-[10px] font-bold">Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
