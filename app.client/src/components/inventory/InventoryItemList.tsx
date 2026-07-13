"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Info, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryItemService } from "@/api/services/InventoryItemService";
import { WarehouseUserService } from "@/api/services/WarehouseUserService";
import { WarehouseService } from "@/api/services/WarehouseService";
import { UserService } from "@/api/services/UserService";
import type { InventoryItemInTransactionListVM } from "@/api/models/InventoryItemInTransactionListVM";
import type { InventoryItemInfoByCodeVM } from "@/api/models/InventoryItemInfoByCodeVM";

export const InventoryItemList = () => {
  const [search, setSearch] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState<InventoryItemInTransactionListVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalSortConfig, setModalSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // superadmin state
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [allWarehouses, setAllWarehouses] = useState<any[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [defaultWarehouseId, setDefaultWarehouseId] = useState<string>("");

  // Check role on mount
  useEffect(() => {
    const checkRole = async () => {
      try {
        const rolesRes = await UserService.getMyRoles("1");
        const rawRoles: any = rolesRes?.data;
        const roles: string[] = Array.isArray(rawRoles)
          ? rawRoles
          : Array.isArray(rawRoles?.roles)
            ? rawRoles.roles
            : [];
        const isAdmin = roles.some(
          (r: string) => r.toLowerCase() === "superadmin" || r.toLowerCase() === "warehouseadmin"
        );
        setIsSuperAdmin(isAdmin);

        if (isAdmin) {
          const whRes = await WarehouseService.warehouseGet("1");
          const wList: any[] = whRes?.data ?? [];
          setAllWarehouses(wList);
          if (wList.length > 0) {
            setSelectedWarehouseId(wList[0].id ?? wList[0].warehouseId ?? "");
          }
        }
      } catch (err) {
        console.error("Failed to check user roles:", err);
      }
    };
    checkRole();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const res = await InventoryItemService.getInventoryItemInTransactionList("1");
        if (res.success && res.data) {
          setItems(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      (item.ownerBarcodeItemNum || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.productDescription || "").toLowerCase().includes(search.toLowerCase())
  );

  const fetchProductDetails = async (barcode: string, warehouseId: string) => {
    setIsDetailsLoading(true);
    setProductDetails([]);
    try {
      const res = await InventoryItemService.getInventoryItemInfo("1", barcode.trim(), warehouseId);
      if (res.success && res.data) {
        setProductDetails(Array.isArray(res.data) ? res.data : [res.data]);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleBarcodeClick = async (barcode: string) => {
    setSelectedBarcode(barcode.trim());
    setIsDialogOpen(true);
    setProductDetails([]);
    setIsDetailsLoading(true);

    try {
      if (isSuperAdmin) {
        // Superadmin: use the currently selected warehouse (or first warehouse)
        const whId = selectedWarehouseId;
        if (!whId) {
          console.error("No warehouse selected.");
          setIsDetailsLoading(false);
          return;
        }
        await fetchProductDetails(barcode, whId);
      } else {
        // Normal user: resolve warehouse from their account
        const userRes = await UserService.getLoggedInUser("1");
        const userEmail = userRes.data?.email || "";

        const whUsersRes = await WarehouseUserService.warehouseUserGet("1");
        const loggedUserWH = whUsersRes.data?.find(
          (wu: any) => wu.userEmail === userEmail || wu.email === userEmail
        );
        const warehouseId = loggedUserWH?.warehouseId;

        if (!warehouseId) {
          console.error("No warehouse associated with your account.");
          setIsDetailsLoading(false);
          return;
        }
        setDefaultWarehouseId(warehouseId);
        await fetchProductDetails(barcode, warehouseId);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      setIsDetailsLoading(false);
    }
  };

  const handleWarehouseChange = async (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId);
    if (selectedBarcode) {
      await fetchProductDetails(selectedBarcode, warehouseId);
    }
  };

  const handleModalSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (modalSortConfig && modalSortConfig.key === key && modalSortConfig.direction === "asc") {
      direction = "desc";
    }
    setModalSortConfig({ key, direction });
  };

  const processedProductDetails = useMemo(() => {
    let result = [...productDetails];

    // Filter
    if (modalSearchTerm) {
      const lowerSearch = modalSearchTerm.toLowerCase();
      result = result.filter(
        (pi) =>
          (pi.ownerBarcodeItemNum?.toLowerCase() || "").includes(lowerSearch) ||
          (pi.locationCode?.toLowerCase() || "").includes(lowerSearch) ||
          (pi.lotNum?.toLowerCase() || "").includes(lowerSearch)
      );
    }

    // Sort
    if (modalSortConfig) {
      const { key, direction } = modalSortConfig;
      result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [productDetails, modalSearchTerm, modalSortConfig]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          Items In Transaction <Info className="w-5 h-5 text-muted-foreground" />
        </h1>

      </div>

      {/* SEARCH AND PAGINATION CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20 p-4 rounded-t-xl border border-b-0">
        <div className="flex items-center gap-2 text-sm">
          <select className="bg-background border rounded px-2 py-1 outline-none">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span className="text-muted-foreground">records per page</span>
        </div>
        <div className="flex items-center gap-2 w-full md:w-72">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Search:</span>
          <div className="relative w-full">
            <Input
              className="h-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-b-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="font-bold border-r px-4 text-foreground">Barcode</TableHead>
              <TableHead className="font-bold border-r px-4 text-foreground">Description</TableHead>
              <TableHead className="font-bold border-r px-4 text-foreground">Product UOM</TableHead>
              <TableHead className="font-bold border-r px-4 text-foreground">Gross Weight(Kg)</TableHead>
              <TableHead className="font-bold border-r px-4 text-foreground">Package</TableHead>
              <TableHead className="font-bold border-r px-4 text-foreground">Last Price Paid</TableHead>
              <TableHead className="font-bold px-4 text-foreground">Product Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30 transition-colors border-b last:border-0">
                  <TableCell className="border-r px-4">
                    <Badge
                      className=" bg-primary text-white cursor-pointer flex items-center gap-1.5 py-1 px-2.5 rounded-md font-mono text-xs shadow-sm transition-all active:scale-95"
                      onClick={() => handleBarcodeClick(item.ownerBarcodeItemNum || "")}
                    >
                      <Search className="w-3 h-3" /> {item.ownerBarcodeItemNum}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-r px-4 text-sm">{item.productDescription}</TableCell>
                  <TableCell className="border-r px-4 text-sm">{item.productUom}</TableCell>
                  <TableCell className="border-r px-4 text-sm">{item.productGrossWeightKg}</TableCell>
                  <TableCell className="border-r px-4 text-sm">{item.productPackage}</TableCell>
                  <TableCell className="border-r px-4 text-sm">{item.lastPricePaid}</TableCell>
                  <TableCell className="px-4 text-sm">{item.productNotes}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-[13px] text-muted-foreground py-2 px-1">
        <span>Showing 1 to {filteredItems.length} of {filteredItems.length} entries</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled className="h-8 text-xs font-bold font-mono">Previous</Button>
          <Button variant="default" size="sm" className="h-8 w-8 p-0 bg-primary font-bold">1</Button>
          <Button variant="ghost" size="sm" disabled className="h-8 text-xs font-bold font-mono">Next</Button>
        </div>
      </div>

      {/* PRODUCT DETAILS DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary/90 text-white px-6 py-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-bold">Product Items</DialogTitle>

          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/20 p-3 rounded-md border text-sm">
              <div className="flex items-center gap-3 flex-wrap font-medium">
                <div className="flex items-center gap-2">
                  <select className="bg-background border rounded px-2 py-1 outline-none">
                    <option>10</option>
                  </select>
                  <span className="text-muted-foreground whitespace-nowrap">records per page</span>
                </div>
                {isSuperAdmin && (
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:block w-px h-5 bg-border mx-1" />
                    <Warehouse className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground whitespace-nowrap">Warehouse:</span>
                    <select
                      className="border rounded-md px-2 h-9 bg-background focus:ring-1 focus:ring-primary outline-none text-sm min-w-[140px]"
                      value={selectedWarehouseId}
                      onChange={(e) => handleWarehouseChange(e.target.value)}
                    >
                      {allWarehouses.map((wh: any) => {
                        const whId = wh.id ?? wh.warehouseId ?? "";
                        const whName = wh.name ?? wh.warehouseName ?? whId;
                        return (
                          <option key={whId} value={whId}>
                            {whName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-muted-foreground font-semibold shrink-0">Search:</span>
                <Input
                  className="h-8 w-full md:w-48"
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-md overflow-hidden ">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold border-r text-foreground h-10 cursor-pointer" onClick={() => handleModalSort("ownerBarcodeItemNum")}>ItemCode <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10 cursor-pointer" onClick={() => handleModalSort("locationCode")}>Location <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10 cursor-pointer" onClick={() => handleModalSort("lotNum")}>Lot# <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10 cursor-pointer" onClick={() => handleModalSort("quantity")}>Quantity <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10 cursor-pointer" onClick={() => handleModalSort("dateMfg")}>Date Mfg <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold border-r text-foreground h-10 cursor-pointer" onClick={() => handleModalSort("dateExp")}>Date Exp <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold text-foreground h-10">Warehouse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isDetailsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic">
                        Loading details...
                      </TableCell>
                    </TableRow>
                  ) : processedProductDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic">
                        No details found for this barcode
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedProductDetails.map((detail, i) => (
                      <TableRow key={i} className="hover:bg-muted/30">
                        <TableCell className="border-r font-medium">{detail.ownerBarcodeItemNum}</TableCell>
                        <TableCell className="border-r">{detail.locationCode}</TableCell>
                        <TableCell className="border-r font-mono text-xs">{detail.lotNum}</TableCell>
                        <TableCell className="border-r font-bold">{detail.quantity}</TableCell>
                        <TableCell className="border-r text-xs">{detail.dateMfg}</TableCell>
                        <TableCell className="border-r text-xs">{detail.dateExp}</TableCell>
                        <TableCell className="text-sm">{detail.warehouse}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center text-[12px] text-muted-foreground">
              <span>Showing 1 to {processedProductDetails.length} of {productDetails.length} entries</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled className="h-7 px-2 text-[10px] font-bold">Previous</Button>
                <Button size="sm" className="h-7 w-7 p-0  text-white font-bold text-[10px]">1</Button>
                <Button variant="ghost" size="sm" disabled className="h-7 px-2 text-[10px] font-bold">Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
