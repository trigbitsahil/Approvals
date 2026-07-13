"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IncomeService } from "@/api/services/IncomeService";
import { IncomeCategoryService } from "@/api/services/IncomeCategoryService";
import { IncomeTypeService } from "@/api/services/IncomeTypeService";
import type { IncomeListVM } from "@/api/models/IncomeListVM";
import type { IncomeCategoryListVM } from "@/api/models/IncomeCategoryListVM";
import type { IncomeTypeListVM } from "@/api/models/IncomeTypeListVM";

export const IncomeManagement = () => {
  const [activeTab, setActiveTab] = useState("incomes");

  // State for Lists
  const [incomes, setIncomes] = useState<IncomeListVM[]>([]);
  const [categories, setCategories] = useState<IncomeCategoryListVM[]>([]);
  const [types, setTypes] = useState<IncomeTypeListVM[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Loading States
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"income" | "category" | "type">("income");
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTypeId, setFormTypeId] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");

  // Fetch Lists
  const fetchIncomes = async () => {
    try {
      const res = await IncomeService.getApiVIncome("1", undefined);
      if (res.success && res.data) {
        setIncomes(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load incomes");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await IncomeCategoryService.getApiVIncomeCategory("1");
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load income categories");
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await IncomeTypeService.getApiVIncomeType("1");
      if (res.success && res.data) {
        setTypes(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load income types");
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchIncomes(), fetchCategories(), fetchTypes()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filter lists based on search
  const filteredIncomes = incomes.filter(
    (item) =>
      (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.incomeTypeName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter((item) =>
    (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const filteredTypes = types.filter(
    (item) =>
      (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.incomeCategoryName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // Handlers for Add / Edit
  const openAddDialog = (type: "income" | "category" | "type") => {
    setDialogType(type);
    setDialogMode("add");
    setSelectedItem(null);
    setFormName("");
    setFormDescription("");
    setFormTypeId("");
    setFormCategoryId("");
    setDialogOpen(true);
  };

  const openEditDialog = (type: "income" | "category" | "type", item: any) => {
    setDialogType(type);
    setDialogMode("edit");
    setSelectedItem(item);
    setFormName(item.name || "");
    setFormDescription(item.description || "");
    setFormTypeId(item.incomeTypeId || item.incomeTypeID || "");
    setFormCategoryId(item.incomeCategoryId || "");
    setDialogOpen(true);
  };

  const handleDelete = async (type: "income" | "category" | "type", id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      if (type === "income") {
        const res = await IncomeService.deleteIncome(id, "1");
        if (res.success) toast.success("Income deleted successfully");
        fetchIncomes();
      } else if (type === "category") {
        const res = await IncomeCategoryService.deleteIncomeCategory(id, "1");
        if (res.success) toast.success("Category deleted successfully");
        fetchCategories();
      } else if (type === "type") {
        const res = await IncomeTypeService.deleteIncomeType(id, "1");
        if (res.success) toast.success("Income type deleted successfully");
        fetchTypes();
      }
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      if (dialogType === "income") {
        if (!formTypeId) {
          toast.error("Income Type is required");
          return;
        }
        if (dialogMode === "add") {
          await IncomeService.postApiVIncome("1", {
            name: formName.trim(),
            description: formDescription.trim() || undefined,
            incomeTypeId: formTypeId,
          });
          toast.success("Income created successfully");
        } else {
          await IncomeService.putApiVIncome("1", {
            incomeID: selectedItem.incomeId || selectedItem.incomeID,
            name: formName.trim(),
            description: formDescription.trim() || undefined,
            incomeTypeId: formTypeId,
          });
          toast.success("Income updated successfully");
        }
        fetchIncomes();
      } else if (dialogType === "category") {
        if (dialogMode === "add") {
          await IncomeCategoryService.postApiVIncomeCategory("1", {
            name: formName.trim(),
          });
          toast.success("Category created successfully");
        } else {
          await IncomeCategoryService.putApiVIncomeCategory("1", {
            incomeCategoryId: selectedItem.incomeCategoryId,
            name: formName.trim(),
            isVoided: selectedItem.isVoided,
          });
          toast.success("Category updated successfully");
        }
        fetchCategories();
      } else if (dialogType === "type") {
        if (!formCategoryId) {
          toast.error("Income Category is required");
          return;
        }
        if (dialogMode === "add") {
          await IncomeTypeService.postApiVIncomeType("1", {
            name: formName.trim(),
            incomeCategoryId: formCategoryId,
          });
          toast.success("Income type created successfully");
        } else {
          await IncomeTypeService.putApiVIncomeType("1", {
            incomeTypeID: selectedItem.incomeTypeId || selectedItem.incomeTypeID,
            name: formName.trim(),
            incomeCategoryId: formCategoryId,
          });
          toast.success("Income type updated successfully");
        }
        fetchTypes();
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.response?.data?.Message || "Failed to save record");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Income Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage incomes, income categories, and income types.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "incomes" && (
            <Button onClick={() => openAddDialog("income")} className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Income
            </Button>
          )}
          {activeTab === "categories" && (
            <Button onClick={() => openAddDialog("category")} className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          )}
          {activeTab === "types" && (
            <Button onClick={() => openAddDialog("type")} className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Type
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchQuery(""); }} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md bg-muted">
          <TabsTrigger value="incomes">Incomes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="incomes" className="mt-4">
              <div className="border rounded-md bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncomes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          No incomes found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIncomes.map((item) => (
                        <TableRow key={item.incomeId || item.incomeID}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.incomeTypeName || "—"}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.description || "—"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog("income", item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete("income", (item.incomeId || item.incomeID)!)}
                                className="text-destructive hover:text-destructive"
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
            </TabsContent>

            <TabsContent value="categories" className="mt-4">
              <div className="border rounded-md bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                          No categories found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategories.map((item) => (
                        <TableRow key={item.incomeCategoryId}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog("category", item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete("category", item.incomeCategoryId!)}
                                className="text-destructive hover:text-destructive"
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
            </TabsContent>

            <TabsContent value="types" className="mt-4">
              <div className="border rounded-md bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          No types found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTypes.map((item) => (
                        <TableRow key={item.incomeTypeId || item.incomeTypeID}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.incomeCategoryName || "—"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog("type", item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete("type", (item.incomeTypeId || item.incomeTypeID)!)}
                                className="text-destructive hover:text-destructive"
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
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[92vw] sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Create " : "Update "}
              {dialogType === "income" && "Income"}
              {dialogType === "category" && "Income Category"}
              {dialogType === "type" && "Income Type"}
            </DialogTitle>
            <DialogDescription>
              Provide the details below to save the record.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>

            {dialogType === "income" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="typeId">Income Type <span className="text-destructive">*</span></Label>
                  <Select value={formTypeId} onValueChange={setFormTypeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t.incomeTypeId} value={t.incomeTypeId!}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
              </>
            )}

            {dialogType === "type" && (
              <div className="space-y-2">
                <Label htmlFor="categoryId">Income Category <span className="text-destructive">*</span></Label>
                <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.incomeCategoryId} value={c.incomeCategoryId!}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
