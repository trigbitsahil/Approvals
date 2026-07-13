"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { BillingItemService } from "@/api/services/BillingItemService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { BillingItemListVM } from "@/api/models/BillingItemListVM";
import { BillingItemFormDialog } from "./BillingItemFormDialog";

export const BillingItemList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<BillingItemListVM[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "update">("add");
  const [selectedItem, setSelectedItem] = useState<BillingItemListVM | null>(null);

  // Fetch all billing items
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await BillingItemService.billingItemGet("1");
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch (err) {
      toast.error("Failed to load billing items");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    (item.itemNum?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (item.billingDescription?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setMode("add");
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: BillingItemListVM) => {
    setMode("update");
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this billing item?")) return;
    try {
      const res = await BillingItemService.deleteBillingItem(id, "1");
      if (res.success) {
        toast.success("Billing item deleted successfully");
        fetchItems();
      }
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const handleSubmit = async (data: any) => {
    const { imageFile, ...restData } = data;
    try {
      let billingItemId = selectedItem?.billingItemId;
      if (mode === "add") {
        const res = await BillingItemService.billingItemPost("1", restData);
        billingItemId = res.data?.billingItemId;
        toast.success("Billing item created successfully");
      } else {
        await BillingItemService.billingItemPut("1", {
          ...restData,
          billingItemId: selectedItem?.billingItemId,
        });
        toast.success("Billing item updated successfully");
      }

      // If an image was uploaded, send it using the DocumentsService!
      if (imageFile && billingItemId) {
        // First delete any existing images under the "BillingItem Image" category to avoid multiple images accumulation
        try {
          const existingImages = await DocumentsService.getApiVDocuments("1", "BillingItem", billingItemId);
          if (existingImages.data && existingImages.data.length > 0) {
            await Promise.all(
              existingImages.data.map((doc) =>
                DocumentsService.deleteDocumentUrl(doc.documentUrlID!, "1")
              )
            );
          }
        } catch (e) {
          console.error("Failed to clean up existing images", e);
        }

        const docCmd = {
          name: imageFile.name,
          description: `Image for Billing Item`,
          content: imageFile.content,
          contentType: imageFile.contentType,
          documentFileName: imageFile.name,
          category: "BillingItem",
          categoryId: billingItemId,
          extension: `.${imageFile.name.split('.').pop()}`,
        } as any;

        await DocumentsService.postApiVDocuments("1", docCmd);
        toast.success("Item image uploaded successfully");
      }
      fetchItems();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.errors?.ItemNum?.[0] || "Operation failed");
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Billing Items Management</h1>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/80 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Billing Item
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Item Num</TableHead>
              <TableHead>Billing Description</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead>Primary Sales Group</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Taxable</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">Loading...</TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No billing items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.billingItemId}
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/BillingItem/${item.billingItemId}`)}
                >
                  <TableCell className="font-medium">{item.itemNum}</TableCell>
                  <TableCell>{item.billingDescription}</TableCell>
                  <TableCell>{item.unitOfMeasure}</TableCell>
                  <TableCell>{item.primarySalesGroup}</TableCell>
                  <TableCell>${item.saleUnitPrice?.toFixed(2) || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={item.isSalesTaxable ? "default" : "secondary"}>
                      {item.isSalesTaxable ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActiveRecord ? "default" : "destructive"}>
                      {item.isActiveRecord ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.billingItemId!);
                      }}
                      className="text-red-500 hover:text-red-600"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <BillingItemFormDialog
        mode={mode}
        open={dialogOpen}
        setOpen={setDialogOpen}
        initialData={selectedItem || undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default BillingItemList