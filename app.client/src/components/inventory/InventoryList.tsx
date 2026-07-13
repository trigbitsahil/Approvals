"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Plus, Search, Trash2, Edit, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryFormDialog } from "./InventoryFormDialog";
import { InventoryItemService } from "../../api/services/InventoryItemService";
import { InventoryItemListVM as InventoryItem } from "../../api/models/InventoryItemListVM";
import { CreateInventoryItemCommand } from "../../api/models/CreateInventoryItemCommand";
import { UpdateInventoryItemCommand } from "../../api/models/UpdateInventoryItemCommand";
import { DocumentsService } from "../../api/services/DocumentsService";
import { getFileExtension, getMimeType } from "@/utils/file-utils";
import { CreateDocumentUrlCommand } from "../../api/models/CreateDocumentUrlCommand";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserService } from "../../api/services/UserService";
import { WarehouseUserService } from "../../api/services/WarehouseUserService";
import { WarehouseService } from "../../api/services/WarehouseService";
import { InventoryItemInfoByCodeVM } from "../../api/models/InventoryItemInfoByCodeVM";
import { InventoryItemTypeService } from "../../api/services/InventoryItemTypeService";
import { useConfirmation } from "@/contexts/ConfirmationContext";

const API_VERSION = "1";

export const InventoryList = () => {
  const { confirm } = useConfirmation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | undefined>(
    undefined,
  );

  // Product Items Modal States
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productItems, setProductItems] = useState<InventoryItemInfoByCodeVM[]>([]);
  const [loadingProductItems, setLoadingProductItems] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalSortConfig, setModalSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [inventoryTypes, setInventoryTypes] = useState<any[]>([]);

  // Superadmin warehouse state
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [allWarehouses, setAllWarehouses] = useState<any[]>([]);
  const [adminSelectedWarehouseId, setAdminSelectedWarehouseId] = useState<string>("");
  const hiddenSvgRef = useRef<SVGSVGElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserContext = async () => {
      try {
        // Check role
        const rolesRes = await UserService.getMyRoles(API_VERSION);
        const rawData: any = rolesRes?.data;
        const roles: string[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.roles)
            ? rawData.roles
            : [];
        const isAdmin = roles.some((r: string) => r.toLowerCase() === "superadmin" || r.toLowerCase() === "warehouseadmin");
        setIsSuperAdmin(isAdmin);

        if (isAdmin) {
          // Superadmin: fetch all warehouses
          const whRes = await WarehouseService.warehouseGet(API_VERSION);
          const wList: any[] = whRes?.data ?? [];
          setAllWarehouses(wList);
          if (wList.length > 0) {
            setAdminSelectedWarehouseId(wList[0].id ?? wList[0].warehouseId ?? "");
          }
        } else {
          // Normal user: resolve warehouse from their account
          const userRes = await UserService.getLoggedInUser(API_VERSION);
          const userEmail = userRes.data?.email;
          const whUsersRes = await WarehouseUserService.warehouseUserGet(API_VERSION);
          const loggedUserWH = whUsersRes.data?.find(
            (wu: any) => wu.userEmail === userEmail || wu.email === userEmail
          );
          setWarehouseId(loggedUserWH?.warehouseId || null);
        }
      } catch (e) {
        console.error("Failed to fetch user warehouse context", e);
      }
    };
    fetchUserContext();
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, typesRes] = await Promise.all([
        InventoryItemService.inventoryItemGet(API_VERSION),
        InventoryItemTypeService.inventoryItemTypeGet(API_VERSION),
      ]);

      setInventoryTypes(typesRes.data || (Array.isArray(typesRes) ? typesRes : []));

      // Handle items data
      let itemData = itemsRes.data || (Array.isArray(itemsRes) ? itemsRes : []);
      // Filter out "ghost" rows
      itemData = itemData.filter(
        (item: InventoryItem) =>
          item.ownerBarcodeItemNum && item.ownerBarcodeItemNum.trim() !== "",
      );

      setItems(itemData);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.error("Error connecting to inventory/company services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter(
    (item) =>
      (item.productDescription?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (item.ownerBarcodeItemNum?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ),
  );

  const handleSubmit = async (formData: any) => {
    // Explicitly destructure only the fields we want to send to the API
    const {
      ownerBarcodeItemNum,
      productClientId,
      productDescription,
      productNotes,
      productUom,
      productGrossWeightKg,
      productPackage,
      lastPricePaid,
      isLotRequired,
      isSnRequired,
      isDateMfgRequired,
      isDateExpRequired,
      isVoided,
      imageFile,
      imageBase64,
      inventoryItemTypeId
    } = formData;

    const sanitizedData = {
      ownerBarcodeItemNum: ownerBarcodeItemNum || null,
      productClientId: productClientId || null,
      productDescription: productDescription || null,
      productNotes: productNotes || null,
      productUom: productUom || null,
      productGrossWeightKg: Number(productGrossWeightKg) || 0,
      productPackage: productPackage || null,
      lastPricePaid: Number(lastPricePaid) || 0,
      isLotRequired: !!isLotRequired,
      isSnRequired: !!isSnRequired,
      isDateMfgRequired: !!isDateMfgRequired,
      isDateExpRequired: !!isDateExpRequired,
      isVoided: !!isVoided,
      imageUrl: editItem?.imageUrl || null,
      inventoryItemTypeId: inventoryItemTypeId || null,
    };

    console.log("Submitting inventory data:", sanitizedData);

    try {
      let isSuccess = false;
      let currentItemId = editItem?.inventoryItemId;

      if (editItem) {
        const updatePayload: UpdateInventoryItemCommand = {
          inventoryItemId: editItem.inventoryItemId,
          ...sanitizedData,
        };
        const response = await InventoryItemService.inventoryItemPut(
          API_VERSION,
          updatePayload,
        );
        if (response.success || (response as any).data || (response as any)) {
          isSuccess = true;
          toast.success("Item updated successfully");
        } else {
          console.error("Update failed response:", response);
          toast.error(response.message || "Update failed");
        }
      } else {
        const createPayload: CreateInventoryItemCommand = {
          ...sanitizedData,
        };
        const response = await InventoryItemService.inventoryItemPost(
          API_VERSION,
          createPayload,
        );
        // Treat presence of data or success flag as success
        if (
          (response as any).success ||
          (response as any).data ||
          (response as any).inventoryItemId
        ) {
          isSuccess = true;
          currentItemId = (response as any).data?.inventoryItemId || (response as any).inventoryItemId;
          toast.success("Item added successfully");
        } else {
          console.error("Creation failed response:", response);
          toast.error((response as any).message || "Creation failed");
        }
      }

      if (isSuccess) {
        // Handle Image Upload
        let uploadedUrl = null;
        if (imageFile && imageBase64 && currentItemId) {
          try {
            const ext = getFileExtension(imageFile.name);
            const extension = ext.startsWith(".") ? ext : `.${ext}`;
            const docCmd = {
              name: imageFile.name,
              description: `Image for ${productDescription || ownerBarcodeItemNum}`,
              content: imageBase64,
              category: "inventory",
              categoryId: currentItemId,
              extension: extension,
              contentType: imageFile.type || getMimeType(imageFile.name),
              documentFileName: imageFile.name,
            } as any;
            const docRes = await DocumentsService.postApiVDocuments(API_VERSION, docCmd);
            uploadedUrl = (docRes as any).data?.url || (docRes as any).data?.blobUrl;
            toast.success("Image uploaded successfully");

            if (uploadedUrl) {
              const urlUpdatePayload: UpdateInventoryItemCommand = {
                inventoryItemId: currentItemId,
                ...sanitizedData,
                imageUrl: uploadedUrl,
              };
              await InventoryItemService.inventoryItemPut(API_VERSION, urlUpdatePayload);
            }
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
            toast.error("Image upload failed");
          }
        }

        // Handle Barcode Document Generation for new items or Update if ownerBarcodeItemNum changed
        if (currentItemId && ownerBarcodeItemNum && (!editItem || ownerBarcodeItemNum !== editItem.ownerBarcodeItemNum)) {
          try {
            const barcodeDocs = await DocumentsService.getApiVDocuments(API_VERSION, "Inventory Item Barcode", currentItemId);
            const existingDoc = barcodeDocs.data?.[0];

            const { default: JsBarcode } = await import("jsbarcode");
            const barcodeValue = ownerBarcodeItemNum;

            JsBarcode(hiddenSvgRef.current, barcodeValue, {
              format: "CODE128",
              width: 3,
              height: 100,
              displayValue: true,
              fontSize: 20,
              margin: 10,
              background: "#ffffff"
            });

            const svgElement = hiddenSvgRef.current;
            if (svgElement) {
              const svgString = new XMLSerializer().serializeToString(svgElement);
              const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
              const url = URL.createObjectURL(svgBlob);

              const img = new Image();
              await new Promise((resolve) => {
                img.onload = resolve;
                img.src = url;
              });

              const canvas = window.document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const base64Content = canvas.toDataURL("image/png").split(",")[1];

                // Delete ONLY the barcode documents for this item
                if (barcodeDocs.data && barcodeDocs.data.length > 0) {
                  for (const doc of barcodeDocs.data) {
                    const docId = (doc as any).documentUrlID || doc.documentID;
                    if (docId) {
                      await DocumentsService.deleteDocumentUrl(docId, API_VERSION);
                    }
                  }
                }

                const docCmd = {
                  name: `barcode-${barcodeValue}.png`,
                  documentFileName: `barcode-${barcodeValue}.png`,
                  description: `Generated Barcode for ${barcodeValue}`,
                  content: base64Content,
                  category: "Inventory Item Barcode",
                  categoryId: currentItemId,
                  categoryID: currentItemId,
                  extension: ".png",
                  contentType: "image/png"
                } as any;

                await DocumentsService.postApiVDocuments(API_VERSION, docCmd);
                toast.success("Barcode generated and uploaded successfully");
              }
              URL.revokeObjectURL(url);
            }
          } catch (barcodeUpdateError) {
            console.error("Barcode document update failed:", barcodeUpdateError);
          }
        }

        fetchItems();
      }
    } catch (error: any) {
      console.error("Full Submit Error:", error);
      const errorBody = error.body || (error.result && error.result.body);
      const errorStatus = error.status || (error.result && error.result.status);
      console.error("Error details - Status:", errorStatus, "Body:", errorBody);

      const errorMessage =
        errorBody?.message ||
        errorBody?.title ||
        error.message ||
        "An error occurred during submission";
      toast.error(errorMessage);
    }
  };

  const handleEditClick = async (item: InventoryItem) => {
    try {
      const response = await InventoryItemService.getInventoryItemById(
        item.inventoryItemId!,
        API_VERSION,
      );
      // Merge the detail data (which includes isInTransaction) into the item
      const detailData = response?.data ? { ...item, ...response.data } : item;
      setEditItem(detailData as InventoryItem);
    } catch {
      // Fallback: use the list item as-is
      setEditItem(item);
    } finally {
      setIsDialogOpen(true);
    }
  };

  const fetchProductItems = async (code: string, whId: string | null | undefined) => {
    setLoadingProductItems(true);
    setProductItems([]);
    try {
      const res = await InventoryItemService.getInventoryItemInfo(API_VERSION, code, whId || undefined);
      if (res.data) {
        setProductItems(res.data);
      } else {
        setProductItems([]);
      }
    } catch (error) {
      toast.error("Failed to fetch product items details");
      setProductItems([]);
    } finally {
      setLoadingProductItems(false);
    }
  };

  const handleBarcodeClick = async (code: string | null | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!code) return;

    setIsProductModalOpen(true);
    setSelectedBarcode(code);

    const whId = isSuperAdmin ? adminSelectedWarehouseId : warehouseId;
    await fetchProductItems(code, whId);
  };

  const handleWarehouseChange = async (newWarehouseId: string) => {
    setAdminSelectedWarehouseId(newWarehouseId);
    if (selectedBarcode) {
      await fetchProductItems(selectedBarcode, newWarehouseId);
    }
  };

  const handleModalSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (modalSortConfig && modalSortConfig.key === key && modalSortConfig.direction === "asc") {
      direction = "desc";
    }
    setModalSortConfig({ key, direction });
  };

  const processedProductItems = useMemo(() => {
    let result = [...productItems];

    // Filter
    if (modalSearchTerm) {
      const lowerSearch = modalSearchTerm.toLowerCase();
      result = result.filter(
        (pi) =>
          (pi.ownerBarcodeItemNum?.toLowerCase() || "").includes(lowerSearch) ||
          (pi.locationCode?.toLowerCase() || "").includes(lowerSearch) ||
          (pi.lotNum?.toLowerCase() || "").includes(lowerSearch),
      );
    }

    // Sort
    if (modalSortConfig) {
      const { key, direction } = modalSortConfig;
      result.sort((a: any, b: any) => {
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
  }, [productItems, modalSearchTerm, modalSortConfig]);


  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Item",
      message: "Are you sure you want to delete this inventory item? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "destructive"
    });

    if (isConfirmed) {
      try {
        await InventoryItemService.deleteInventoryItem(id, API_VERSION);
        toast.success("Item deleted");
        fetchItems();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button
          onClick={() => {
            setEditItem(undefined);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead className="text-right">Weight (Kg)</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading inventory...
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.inventoryItemId}
                  onClick={() => navigate(`/InventoryItem/${item.inventoryItemId}`)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productDescription || "Item thumbnail"}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center border">
                        <span className="text-xs text-muted-foreground font-medium text-center leading-tight">No<br />Image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <span
                      className="text-primary  hover:underline cursor-pointer"
                      onClick={(e) => handleBarcodeClick(item.ownerBarcodeItemNum, e)}
                    >
                      {item.ownerBarcodeItemNum}
                    </span>
                  </TableCell>
                  <TableCell>
                    {inventoryTypes.find(t => t.inventoryItemTypeId === item.inventoryItemTypeId)?.name || item.inventoryItemTypeName || "-"}
                  </TableCell>
                  <TableCell>{item.productDescription}</TableCell>
                  <TableCell>{item.productUom}</TableCell>
                  <TableCell className="text-right">
                    {item.productGrossWeightKg}
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.lastPricePaid}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8    hover:bg-amber-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8  text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.inventoryItemId!);
                        }}
                        title="Delete"
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

      <InventoryFormDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        mode={editItem ? "update" : "add"}
        initialData={editItem}
        onSubmit={handleSubmit}
        inventoryTypes={inventoryTypes}
      // companies={companies}
      />

      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="w-[92vw] md:w-full md:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-2xl">
          <DialogHeader className="px-6 py-4 rounded-t-2xl bg-primary/90 text-white">
            <DialogTitle className="font-normal text-xl">
              Product Items
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
              <div className="flex items-center gap-3 flex-wrap text-sm font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <select className="border rounded-md px-2 h-9 bg-background focus:ring-1 focus:ring-primary outline-none">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
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
                      value={adminSelectedWarehouseId}
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
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm font-semibold shrink-0 text-foreground">Search:</span>
                <Input
                  placeholder="Search..."
                  className="h-9 rounded-md border-muted bg-background w-full md:w-48 text-sm"
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-sm overflow-hidden dark:border-zinc-800">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-zinc-900">
                  <TableRow>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-3 cursor-pointer" onClick={() => handleModalSort("ownerBarcodeItemNum")}>ItemCode <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-3 cursor-pointer" onClick={() => handleModalSort("locationCode")}>Location <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-3 cursor-pointer" onClick={() => handleModalSort("lotNum")}>Lot# <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-3 cursor-pointer" onClick={() => handleModalSort("quantity")}>Quantity <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-3 cursor-pointer" onClick={() => handleModalSort("dateMfg")}>Date Mfg <span>&#9650;&#9660;</span></TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300 py-3 cursor-pointer" onClick={() => handleModalSort("dateExp")}>Date Exp <span>&#9650;</span></TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingProductItems ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        Loading product items...
                      </TableCell>
                    </TableRow>
                  ) : processedProductItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        No items found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedProductItems.map((pi: InventoryItemInfoByCodeVM, i: number) => (
                      <TableRow key={i} className="border-b last:border-0 dark:border-zinc-800">
                        <TableCell className="py-3">{pi.ownerBarcodeItemNum || "-"}</TableCell>
                        <TableCell className="py-3">{pi.locationCode || "-"}</TableCell>
                        <TableCell className="py-3">{pi.lotNum || "-"}</TableCell>
                        <TableCell className="py-3">{pi.quantity?.toFixed(4) || "0.0000"}</TableCell>
                        <TableCell className="py-3">{pi.dateMfg ? new Date(pi.dateMfg).toLocaleDateString() : "-"}</TableCell>
                        <TableCell className="py-3">{pi.dateExp ? new Date(pi.dateExp).toLocaleDateString() : "-"}</TableCell>

                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-sm pt-4 gap-4 border-t border-dashed">
              <span className="text-muted-foreground order-2 sm:order-1">
                Showing {processedProductItems.length > 0 ? 1 : 0} to {processedProductItems.length} of {productItems.length} entries
              </span>
              <div className="flex items-center border rounded-md overflow-hidden order-1 sm:order-2">
                <Button variant="ghost" size="sm" disabled className="h-8 rounded-none px-3 text-[10px] uppercase font-bold border-r">Previous</Button>
                <div className="h-8 w-8 bg-primary text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <Button variant="ghost" size="sm" disabled className="h-8 rounded-none px-3 text-[10px] uppercase font-bold text-muted-foreground">Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden SVG for barcode generation */}
      <svg ref={hiddenSvgRef} className="hidden" />
    </div>
  );
};

