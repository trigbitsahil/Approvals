'use client';

import React, { useEffect, useState } from "react";
import { VendorCategoryService } from "@/api/services/VendorCategoryService";
import type { VendorCategoryListVM } from "@/api/models/VendorCategoryListVM";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreVertical, Edit2, Trash2, Tags } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useConfirmation } from "@/contexts/ConfirmationContext";

export function VendorCategoryList() {
  const [categories, setCategories] = useState<VendorCategoryListVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [vendorCategoryId, setVendorCategoryId] = useState("");
  const [name, setName] = useState("");

  const { confirm } = useConfirmation();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await VendorCategoryService.getAllVendorCategories();
      setCategories(res);
    } catch (e) {
      toast.error("Failed to fetch vendor categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required.");
      return;
    }

    try {
      const payload = {
        name,
      };

      if (isEditing) {
        await VendorCategoryService.updateVendorCategory({ ...payload, vendorCategoryId });
        toast.success("Vendor category updated successfully.");
      } else {
        await VendorCategoryService.createVendorCategory(payload);
        toast.success("Vendor category created successfully.");
      }
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} vendor category.`);
    }
  };

  const resetForm = () => {
    setVendorCategoryId("");
    setName("");
    setIsEditing(false);
  };

  const handleEdit = (category: VendorCategoryListVM) => {
    setVendorCategoryId(category.vendorCategoryId || "");
    setName(category.name || "");
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    const isConfirmed = await confirm({
      title: "Delete Vendor Category",
      message: "Are you sure you want to delete this category? This action cannot be undone.",
    });

    if (isConfirmed) {
      try {
        await VendorCategoryService.deleteVendorCategory(categoryId);
        toast.success("Vendor category deleted successfully.");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete vendor category.");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Tags className="h-6 w-6 text-primary" />
            Vendor Categories
          </h2>
          <p className="text-muted-foreground mt-1">Manage categories for grouping your vendors.</p>
        </div>

        <Dialog 
          open={isModalOpen} 
          onOpenChange={(open) => {
            if (!open) resetForm();
            setIsModalOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Category" : "Create Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name <span className="text-destructive">*</span></label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter category name" />
              </div>
              <Button type="submit" className="w-full">{isEditing ? "Update Category" : "Create Category"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center h-24">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-muted-foreground">Loading categories...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Tags className="h-8 w-8 mb-2 opacity-50" />
                    <p>No vendor categories found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.vendorCategoryId} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleEdit(category)} className="cursor-pointer">
                          <Edit2 className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(category.vendorCategoryId!)}
                          className="text-red-700 cursor-pointer focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
