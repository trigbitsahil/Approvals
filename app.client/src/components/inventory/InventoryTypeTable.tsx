"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    DialogFooter,
} from "@/components/ui/dialog";
import { InventoryItemTypeService } from "@/api/services/InventoryItemTypeService";
import { useConfirmation } from "@/contexts/ConfirmationContext";

const API_VERSION = "1";

export const InventoryTypeTable = () => {
    const { confirm } = useConfirmation();
    const [types, setTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editType, setEditType] = useState<any | null>(null);
    const [typeName, setTypeName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchTypes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await InventoryItemTypeService.inventoryItemTypeGet(API_VERSION);
            setTypes(response.data || (Array.isArray(response) ? response : []));
        } catch (error) {
            console.error("Error fetching inventory types:", error);
            toast.error("Failed to load inventory types");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    const filteredTypes = types.filter((t) =>
        (t.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const handleOpenDialog = (type?: any) => {
        if (type) {
            setEditType(type);
            setTypeName(type.name || "");
        } else {
            setEditType(null);
            setTypeName("");
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!typeName.trim()) {
            toast.error("Name is required");
            return;
        }

        setSubmitting(true);
        try {
            if (editType) {
                await InventoryItemTypeService.inventoryItemTypePut(API_VERSION, {
                    inventoryItemTypeId: editType.inventoryItemTypeId,
                    name: typeName,
                });
                toast.success("Inventory type updated successfully");
            } else {
                await InventoryItemTypeService.inventoryItemTypePost(API_VERSION, {
                    name: typeName,
                });
                toast.success("Inventory type created successfully");
            }
            setIsDialogOpen(false);
            fetchTypes();
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to save inventory type");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirm({
            title: "Delete Inventory Type",
            message: "Are you sure you want to delete this inventory type? This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            variant: "destructive"
        });

        if (!isConfirmed) return;

        try {
            await InventoryItemTypeService.deleteInventoryItemType(id, API_VERSION);
            toast.success("Inventory type deleted successfully");
            fetchTypes();
        } catch (error) {
            toast.error("Failed to delete inventory type");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Inventory Types</h2>
                    <p className="text-muted-foreground text-sm">Manage your inventory categorization types.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Type
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search types..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50 border-b">
                        <TableRow>
                            <TableHead className="w-20 pl-6">S.No</TableHead>
                            <TableHead>Type Name</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground text-sm italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin" />
                                        <span>Loading types...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredTypes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground text-sm italic">
                                    No inventory types found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTypes.map((type, index) => (
                                <TableRow key={type.inventoryItemTypeId} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="pl-6 font-medium text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{type.name}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                                                onClick={() => handleOpenDialog(type)}
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-red-500 transition-colors"
                                                onClick={() => handleDelete(type.inventoryItemTypeId)}
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editType ? "Edit Inventory Type" : "Add Inventory Type"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Inventory Type Name</label>
                            <Input
                                placeholder="Enter type name..."
                                value={typeName}
                                onChange={(e) => setTypeName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving..." : editType ? "Save Changes" : "Create Type"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
