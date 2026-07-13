"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Trash2,
  Plus,
  RotateCcw,
  Save,
  Package,
  MapPin,
  Barcode,
  SquareStack,
  Info,
  History,
  Layout,
  Warehouse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Scanner from "@/components/barcode/Scanner";
import { InventoryItemService } from "@/api/services/InventoryItemService";
import { WarehouseLocationService } from "@/api/services/WarehouseLocationService";
import { WarehouseTransactionService } from "@/api/services/WarehouseTransactionService";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { WarehouseUserService } from "@/api/services/WarehouseUserService";
import { UserService } from "@/api/services/UserService";
import { WarehouseService } from "@/api/services/WarehouseService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";

const API_VERSION = "1";

// Constants for Inventory Adjustment
const IA_ORDER_TYPE_ID = "OdrType_2026_03_16fbcd893b-1a18-426d-9f06-d999630af7f6";

export const AdjustmentForm = () => {
  const navigate = useNavigate();

  // Header State
  const [refNum, setRefNum] = useState("");
  const [comments, setComments] = useState("");

  // Line Item Form State
  const [type, setType] = useState("Increase");
  const [location, setLocation] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [lotNum, setLotNum] = useState("");
  const [serialNum, setSerialNum] = useState("");
  const [dateMfg, setDateMfg] = useState("");
  const [dateExp, setDateExp] = useState("");

  // Tracking Created Order
  const [createdOrderHeaderId, setCreatedOrderHeaderId] = useState<string | null>(null);
  const [currentWarehouseId, setCurrentWarehouseId] = useState<string | null>(null);
  const [isHeaderSubmitted, setIsHeaderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SuperAdmin Data
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");

  const checkAdminRole = useCallback(async () => {
    try {
      const roleRes = await UserService.getMyRoles(API_VERSION);
      const roles = Array.isArray(roleRes.data) ? roleRes.data : [];
      const isAdmin = (roles.includes("SuperAdmin") || roles.includes("WarehouseAdmin"));
      setIsSuperAdmin(isAdmin);

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
      }
    } catch (error) {
      console.error("Failed to check admin role or fetch warehouses:", error);
    }
  }, []);

  useEffect(() => {
    checkAdminRole();
  }, [checkAdminRole]);

  // Line Items List
  const [lineItems, setLineItems] = useState<any[]>([]);

  // Dynamic Fields State
  const [requiredFields, setRequiredFields] = useState({
    isLotRequired: false,
    isSnRequired: false,
    isDateMfgRequired: false,
    isDateExpRequired: false,
  });
  const [loadingItem, setLoadingItem] = useState(false);

  const handleBarcodeBlur = async (code: string) => {
    if (!code || type !== "Increase") {
      setRequiredFields({
        isLotRequired: false,
        isSnRequired: false,
        isDateMfgRequired: false,
        isDateExpRequired: false,
      });
      return;
    }

    try {
      setLoadingItem(true);
      const response = await InventoryItemService.inventoryItemGet("1");
      // Match barcode with ownerBarcodeItemNum
      const matchedItem = response.data?.find((item: any) => item.ownerBarcodeItemNum === code);

      if (matchedItem) {
        setRequiredFields({
          isLotRequired: !!matchedItem.isLotRequired,
          isSnRequired: !!matchedItem.isSnRequired,
          isDateMfgRequired: !!matchedItem.isDateMfgRequired,
          isDateExpRequired: !!matchedItem.isDateExpRequired,
        });
      } else {
        setRequiredFields({
          isLotRequired: false,
          isSnRequired: false,
          isDateMfgRequired: false,
          isDateExpRequired: false,
        });
        toast.error("Invalid barcode", { description: `The barcode "${code}" does not exist in inventory.` });
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast.error("Failed to fetch item requirements");
    } finally {
      setLoadingItem(false);
    }
  };

  const handleAddLine = async () => {
    if (!isHeaderSubmitted || !createdOrderHeaderId) {
      toast.error("Header required", { description: "Please submit the adjustment header first." });
      return;
    }

    if (!location || !barcode || !quantity) {
      toast.error("Missing fields", { description: "Please provide location, barcode, and quantity." });
      return;
    }

    // Location Validation & Fetching Location ID
    let locationId = "";
    try {
      setLoadingItem(true);
      const locRes = await WarehouseLocationService.getWarehouseLocationByCode("1", location);
      if (!locRes.success || !locRes.data) {
        toast.error("Invalid Location", {
          description: `The location code "${location}" does not exist in the system.`
        });
        setLoadingItem(false);
        return;
      }
      locationId = locRes.data.warehouseLocationId || "";
    } catch (error) {
      console.error("Location validation failed:", error);
      toast.error("Validation Error", { description: "Failed to verify location code." });
      setLoadingItem(false);
      return;
    } finally {
      setLoadingItem(false);
    }

    // Dynamic fields validation for Increase
    if (type === "Increase") {
      const missingFields = [];
      if (requiredFields.isLotRequired && !lotNum) missingFields.push("Lot Number");
      if (requiredFields.isSnRequired && !serialNum) missingFields.push("Serial Number");
      if (requiredFields.isDateMfgRequired && !dateMfg) missingFields.push("Date Mfg");
      if (requiredFields.isDateExpRequired && !dateExp) missingFields.push("Date Exp");

      if (missingFields.length > 0) {
        toast.error("Required fields missing", {
          description: `Please fill: ${missingFields.join(", ")}`
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      // Fetch Logged in user for email
      const userRes = await UserService.getLoggedInUser("1");
      const userEmail = userRes.data?.email || "";

      const isIncrease = type === "Increase";
      const qtyNum = parseFloat(quantity);

      // Call Warehouse Transaction API
      await WarehouseTransactionService.warehouseTransactionPost("1", {
        orderLineId: "0",
        orderTypeId: IA_ORDER_TYPE_ID,
        warehouseId: currentWarehouseId,
        orderHeaderId: createdOrderHeaderId,
        barcodeItemNum: barcode,
        warehouseLocationId: locationId,
        warehouseLocationCode: location,
        qtyPickRec: qtyNum,
        // increaseQty: isIncrease ? qtyNum : 0,
        decreaseQty: !isIncrease ? qtyNum : 0,
        increaseQty: qtyNum,
        signedQty: isIncrease ? qtyNum : -qtyNum,
        isIncrease: isIncrease,
        lotNum: lotNum || null,
        serialNum: serialNum || null,
        dateMfg: dateMfg || null,
        dateExp: dateExp || null,
        userEmail: userEmail,
        transactionDate: new Date().toISOString(),
        recordedAt: new Date().toISOString(),
      });

      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        location,
        barcode,
        quantity,
        lotNum,
        serialNum,
        dateMfg,
        dateExp,
      };

      setLineItems([newItem, ...lineItems]);
      toast.success("Line item added", { description: `${type} of ${quantity} for ${barcode}` });

      // Reset line form
      setBarcode("");
      setQuantity("1");
      setLotNum("");
      setSerialNum("");
      setDateMfg("");
      setDateExp("");
      setRequiredFields({
        isLotRequired: false,
        isSnRequired: false,
        isDateMfgRequired: false,
        isDateExpRequired: false,
      });
    } catch (error) {
      console.error("Failed to add adjustment line:", error);
      toast.error("Submission Error", { description: "Failed to post warehouse transaction." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveLine = (id: string) => {
    // Note: In a real scenario we might need to delete the transaction from DB too
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleSubmitHeader = async () => {
    if (!refNum) {
      toast.error("Reference Number Required");
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. Get Logged in user
      const userRes = await UserService.getLoggedInUser("1");
      const userEmail = userRes.data?.email || "";

      // 2. Determine WarehouseId
      let warehouseId = "";
      if (isSuperAdmin) {
        if (!selectedWarehouseId) {
          toast.error("Please select a warehouse");
          return;
        }
        warehouseId = selectedWarehouseId;
      } else {
        // Get WarehouseId from WarehouseUserService for this user
        const whUsersRes = await WarehouseUserService.warehouseUserGet("1");
        const loggedUserWH = whUsersRes.data?.find((wu: any) => wu.userEmail === userEmail || wu.email === userEmail);
        warehouseId = loggedUserWH?.warehouseId;
      }

      if (!warehouseId) {
        toast.error("Warehouse Error", { description: "No warehouse associated with your account." });
        return;
      }

      // 3. Create Order Header
      const headerRes = await OrderHeaderService.orderHeaderPost("1", {
        orderTypeId: IA_ORDER_TYPE_ID,
        warehouseId: warehouseId,
        documentClientId: "-",
        discrepancyDetail: comments || "-",
        clientOrderNum: refNum,
        orderDate: new Date().toISOString(),
        adjusting: true,
      });

      if (headerRes.success && headerRes.data?.orderHeaderId) {
        setCreatedOrderHeaderId(headerRes.data.orderHeaderId);
        setCurrentWarehouseId(warehouseId);
        setIsHeaderSubmitted(true);
        toast.success("Header submitted successfully");
      } else {
        toast.error("Creation Failed", { description: headerRes.message || "Failed to create adjustment header." });
      }
    } catch (error) {
      console.error("Header submission failed:", error);
      toast.error("Submission Error", { description: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-6 px-4">
      {/* HEADER NAV */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">

          </div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Adjustment</h1>
        </div>
        <Button
          variant="default"
          size="sm"
          className="-ml-2 h-8 text-xs font-bold uppercase tracking-wider group hover:bg-transparent"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" /> Back To List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* STEP 1: ADD HEADER */}
          <Card className="border-t-2 border-t-primary shadow-xl border-x-0 border-b-0 ring-1 ring-border/50 bg-card">
            <CardHeader className="pb-3 border-b bg-muted/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                Add Header
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-x-8 gap-y-6">
                {isSuperAdmin && (
                  <div className="space-y-2 lg:col-span-1">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Warehouse className="w-3 h-3" /> Select Warehouse
                    </Label>
                    <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId} disabled={isHeaderSubmitted}>
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
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Ref #</Label>
                  <Input
                    placeholder="Reference Number"
                    value={refNum}
                    onChange={(e) => setRefNum(e.target.value)}
                    className="bg-muted/30 border-muted focus:ring-primary rounded-xl"
                  />
                </div>
                <div className="space-y-2 lg:col-span-1">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Comments</Label>
                  <Input
                    placeholder="Enter observations..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="bg-muted/30 border-muted focus:ring-primary rounded-xl"
                  />
                </div>
                <div className="pb-1">
                  <Button
                    onClick={handleSubmitHeader}
                    disabled={isSubmitting || isHeaderSubmitted}
                    className="w-full sm:w-auto bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-xl px-8 h-10 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : isHeaderSubmitted ? "Submitted" : "Submit"}
                  </Button>
                </div>
              </div>
              {/* {isHeaderSubmitted && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <Badge className="bg-green-500">ID: {createdOrderHeaderId}</Badge>
                  <span className="text-xs font-medium text-green-600 italic">Adjustment header created. You can now add line items below.</span>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* STEP 2: ADD LINE ITEM */}
          <Card className={`border-t-2 border-t-secondary shadow-xl border-x-0 border-b-0 ring-1 ring-border/50 bg-card transition-opacity ${!isHeaderSubmitted ? 'opacity-50 pointer-events-none' : ''}`}>
            <CardHeader className="pb-3 border-b bg-muted/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Line Item {!isHeaderSubmitted && <span className="text-xs font-normal text-muted-foreground ml-2">(Submit header first)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-[11px] font-bold uppercase tracking-widest ">Adjustment Type</Label>
                <RadioGroup
                  defaultValue="Increase"
                  value={type}
                  onValueChange={setType}
                  className="flex flex-wrap gap-6 p-4 bg-muted/20 rounded-2xl border-dashed border-2 border-muted"
                >
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <RadioGroupItem value="Increase" id="increase" className="" />
                    <Label htmlFor="increase" className="cursor-pointer font-bold  flex items-center gap-2 ">
                      <Badge className="  ">Increase</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <RadioGroupItem value="Decrease" id="decrease" />
                    <Label htmlFor="decrease" className="cursor-pointer font-bold focus-visible:ring-primary">
                      <Badge className="  ">Decrease</Badge>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 pt-4">
                <div className="space-y-2 lg:col-span-1">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Barcode</Label>
                  <div className="relative">
                    <Input
                      placeholder="Item Barcode"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      onBlur={(e) => handleBarcodeBlur(e.target.value)}
                      className="bg-muted/30 border-muted focus:ring-primary rounded-xl pl-10 font-bold"
                    />
                    <Barcode className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
                  </div>
                </div>

                <div className="space-y-2 lg:col-span-1">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Location</Label>
                  <div className="relative">
                    <Input
                      placeholder="Select Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-muted/30 border-muted focus:ring-primary rounded-xl pl-10"
                    />
                    <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
                  </div>
                </div>

                <div className="space-y-2 lg:col-span-1">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Quantity</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="bg-muted/30 border-muted focus:ring-primary rounded-xl pl-10 font-bold"
                    />
                    <SquareStack className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
                  </div>
                </div>

                {(type === "Increase" || type === "Decrease") && requiredFields.isLotRequired && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Lot Number
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Required"
                        value={lotNum}
                        onChange={(e) => setLotNum(e.target.value)}
                        className="bg-muted/30 border-muted focus:ring-primary rounded-xl pl-10"
                      />
                      <Info className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
                    </div>
                  </div>
                )}


                {type === "Increase" && requiredFields.isSnRequired && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Serial Number</Label>
                    <div className="relative">
                      <Input
                        placeholder="Required"
                        value={serialNum}
                        onChange={(e) => setSerialNum(e.target.value)}
                        className="bg-muted/30 border-muted focus:ring-primary rounded-xl pl-10"
                      />
                      <Info className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
                    </div>
                  </div>
                )}

                {type === "Increase" && requiredFields.isDateMfgRequired && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Date Mfg</Label>
                    <Input
                      type="date"
                      value={dateMfg}
                      onChange={(e) => setDateMfg(e.target.value)}
                      className="bg-muted/30 border-muted focus:ring-primary rounded-xl dark:[color-scheme:dark]"
                    />
                  </div>
                )}

                {type === "Increase" && requiredFields.isDateExpRequired && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Date Exp</Label>
                    <Input
                      type="date"
                      value={dateExp}
                      onChange={(e) => setDateExp(e.target.value)}
                      className="bg-muted/30 border-muted focus:ring-primary rounded-xl dark:[color-scheme:dark]"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={handleAddLine}
                  disabled={isSubmitting || !isHeaderSubmitted}
                  size="lg"
                  className="flex-1 bg-primary hover:opacity-90 text-primary-foreground shadow-lg font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : (
                    <>
                      <Plus className="w-5 h-5 mr-2" /> Add Line
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setLocation("");
                    setBarcode("");
                    setQuantity("1");
                    setLotNum("");
                    setSerialNum("");
                  }}
                  variant="outline"
                  className="px-8 border-muted hover:bg-muted text-muted-foreground font-bold rounded-xl h-11"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* SCANNER INTEGRATION */}
          <Card className="border-t-2 border-t-primary shadow-xl border-x-0 border-b-0 overflow-hidden ring-1 ring-border/50 bg-card">
            <CardHeader className="pb-3 border-b  ">
              <CardTitle className="text-sm font-bold uppercase tracking-widest  flex items-center gap-3">
                <Barcode className="w-4 h-4 animate-pulse" /> Scanner (Location & Barcode)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="p-4 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                <p className="text-[10px] text-center uppercase font-bold text-muted-foreground mb-4">
                  Identify items by scanning or manual entry
                </p>
                <Scanner
                  onScan={(code) => {
                    if (code.startsWith("L-") || code.length < 5) {
                      setLocation(code);
                      toast.info(`Location detected: ${code}`);
                    } else {
                      setBarcode(code);
                      toast.info(`Barcode detected: ${code}`);
                      handleBarcodeBlur(code);
                    }
                  }}
                  onBlur={(code) => {
                    if (!code) return;
                    if (code.startsWith("L-") || code.length < 5) {
                      setLocation(code);
                    } else {
                      setBarcode(code);
                      handleBarcodeBlur(code);
                    }
                  }}
                />
              </div>

            </CardContent>
          </Card>

          {/* QUICK INFO */}
          <Card className="border-t-2 border-t-muted shadow-lg border-x-0 border-b-0 bg-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Lines</CardTitle>
              <Badge className="bg-primary text-primary-foreground font-mono">{lineItems.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Increase: {lineItems.filter(l => l.type === "Increase").length}</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Decrease: {lineItems.filter(l => l.type === "Decrease").length}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* STEP 3: LINE ITEM DETAILS TABLE */}
      <Card className="shadow-2xl border-none ring-1 ring-border shadow-primary/5 bg-card">
        <CardHeader className="pb-4 border-b bg-muted/10">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            Line Item Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30 border-b border-border/50">
                <TableRow>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider pl-6">Location</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider">Barcode</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider">Type</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider">Quantity</TableHead>
                  {lineItems.some(item => item.lotNum) && <TableHead className="font-bold uppercase text-[11px] tracking-wider">Lot#</TableHead>}
                  {lineItems.some(item => item.serialNum) && <TableHead className="font-bold uppercase text-[11px] tracking-wider">SN</TableHead>}
                  {lineItems.some(item => item.dateMfg) && <TableHead className="font-bold uppercase text-[11px] tracking-wider">Mfg Date</TableHead>}
                  {lineItems.some(item => item.dateExp) && <TableHead className="font-bold uppercase text-[11px] tracking-wider">Exp Date</TableHead>}
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider text-right pr-6">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground group">
                      <div className="flex flex-col items-center gap-3 opacity-40 group-hover:opacity-70 transition-opacity">
                        <Package className="w-10 h-10" />
                        <p className="font-medium">No line items added yet. Use the form above to start.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  lineItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/20 transition-all border-b border-border/50 group">
                      <TableCell className="pl-6 pt-5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <Badge variant="outline" className="bg-muted/50 font-mono text-xs">{item.location}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <div className="flex items-center gap-2">
                          <Barcode className="w-3.5 h-3.5 opacity-60" />
                          <span className="font-mono font-bold tracking-tighter text-sm">{item.barcode}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pt-5">
                        <Badge
                          className={item.type === "Increase" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200" : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-200"}
                        >
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="pt-5">
                        <span className="text-lg font-bold">{item.quantity}</span>
                      </TableCell>
                      {lineItems.some(i => i.lotNum) && (
                        <TableCell className="pt-5">
                          <span className="text-sm font-medium text-muted-foreground">{item.lotNum || "-"}</span>
                        </TableCell>
                      )}
                      {lineItems.some(i => i.serialNum) && (
                        <TableCell className="pt-5">
                          <span className="text-sm font-medium text-muted-foreground">{item.serialNum || "-"}</span>
                        </TableCell>
                      )}
                      {lineItems.some(i => i.dateMfg) && (
                        <TableCell className="pt-5">
                          <span className="text-xs opacity-70">{item.dateMfg || "-"}</span>
                        </TableCell>
                      )}
                      {lineItems.some(i => i.dateExp) && (
                        <TableCell className="pt-5">
                          <span className="text-xs opacity-70">{item.dateExp || "-"}</span>
                        </TableCell>
                      )}
                      <TableCell className="pr-6 text-right pt-5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                          onClick={() => handleRemoveLine(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center text-[10px] text-muted-foreground py-3 px-6 bg-muted/5 border-t border-border/50">
            <span className="uppercase font-bold tracking-widest opacity-60">Showing {lineItems.length} entries</span>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};
