"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WarehouseLocation } from "./LocationTable";

interface LocationFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        warehouseLocationId?: string;
        warehouseId: string;
        locationCode: string;
        locationDescription: string;
        locationNotes: string;
    }) => Promise<void>;
    editData: WarehouseLocation | null;
    warehouses: any[];
    isSuperAdmin?: boolean;
}

export function LocationForm({ open, onClose, onSubmit, editData, warehouses, isSuperAdmin }: LocationFormProps) {
    const [warehouseId, setWarehouseId] = useState("");
    const [locationCode, setLocationCode] = useState("");
    const [locationDescription, setLocationDescription] = useState("");
    const [locationNotes, setLocationNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
            setWarehouseId(editData.warehouseId || "");
            setLocationCode(editData.locationCode || "");
            setLocationDescription(editData.locationDescription || "");
            setLocationNotes(editData.locationNotes || "");
        } else {
            setWarehouseId("");
            setLocationCode("");
            setLocationDescription("");
            setLocationNotes("");
        }
    }, [editData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!locationCode.trim() || !locationDescription.trim()) return;
        if (isSuperAdmin && !warehouseId) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                warehouseLocationId: editData?.warehouseLocationId,
                warehouseId,
                locationCode,
                locationDescription,
                locationNotes,
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {editData ? "Update Warehouse Location" : "Create New Location"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {isSuperAdmin && (
                        <div className="space-y-2">
                            <Label htmlFor="warehouse">Select Warehouse</Label>
                            <Select value={warehouseId} onValueChange={setWarehouseId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a warehouse" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map((w) => (
                                        <SelectItem key={w.id} value={w.id}>
                                            {w.name} ({w.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="code">Location Code</Label>
                        <Input
                            id="code"
                            placeholder="e.g. A-101"
                            value={locationCode}
                            onChange={(e) => setLocationCode(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="e.g. Shelf A, Level 1"
                            value={locationDescription}
                            onChange={(e) => setLocationDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Additional details..."
                            value={locationNotes}
                            onChange={(e) => setLocationNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !locationCode.trim() || 
                                !locationDescription.trim() || 
                                isSubmitting || 
                                (isSuperAdmin && !warehouseId)
                            }
                        >
                            {editData ? "Save Changes" : "Create Location"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
