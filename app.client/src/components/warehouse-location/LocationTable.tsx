"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface WarehouseLocation {
    warehouseLocationId: string;
    warehouseId: string;
    locationCode: string;
    locationDescription: string;
    locationNotes: string;
}

interface LocationTableProps {
    locations: WarehouseLocation[];
    isLoading: boolean;
    onEdit: (location: WarehouseLocation) => void;
    onDelete: (id: string) => void;
}

export function LocationTable({ locations, isLoading, onEdit, onDelete }: LocationTableProps) {
    return (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-6 py-4 w-20">S.No</th>
                            <th className="px-6 py-4">Location Code</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Notes</th>
                            <th className="px-6 py-4 text-right w-28">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Loading locations...
                                </td>
                            </tr>
                        ) : locations.length > 0 ? (
                            locations.map((loc, index) => (
                                <tr key={loc.warehouseLocationId} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium">{index + 1}</td>

                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-foreground">{loc.locationCode}</div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {loc.locationDescription}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground italic">
                                        {loc.locationNotes || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => onEdit(loc)}
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                                onClick={() => onDelete(loc.warehouseLocationId)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-muted-foreground italic">
                                    No warehouse locations discovered yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
