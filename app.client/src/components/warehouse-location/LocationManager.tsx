"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, MapPin } from "lucide-react";
import { WarehouseLocationService } from "@/api/services/WarehouseLocationService";
import { WarehouseService } from "@/api/services/WarehouseService";
import { UserService } from "@/api/services/UserService";
import { WarehouseUserService } from "@/api/services/WarehouseUserService";
import Cookies from "js-cookie";
import { LocationTable, WarehouseLocation } from "./LocationTable";
import { LocationForm } from "./LocationForm";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_VERSION = "1";

export function LocationManager() {
    const [locations, setLocations] = useState<WarehouseLocation[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState<WarehouseLocation | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userWarehouseId, setUserWarehouseId] = useState<string | null>(Cookies.get("selectedWarehouseId") || null);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);

    const checkAdminRole = useCallback(async () => {
        try {
            const roleRes = await UserService.getMyRoles(API_VERSION);
            const roles = Array.isArray(roleRes.data) ? roleRes.data : [];
            setIsSuperAdmin((roles.includes("SuperAdmin") || roles.includes("WarehouseAdmin")));
        } catch (error) {
            console.error("Failed to check admin role:", error);
        }
    }, []);

    const fetchUserWarehouse = useCallback(async () => {
        try {
            const userRes = await UserService.getLoggedInUser(API_VERSION);
            const userEmail = userRes.data?.email || userRes.data?.userName;

            if (userEmail) {
                const whUserRes = await WarehouseUserService.warehouseUserGet(API_VERSION);
                const whUsers = Array.isArray(whUserRes.data) ? whUserRes.data : [];
                const match = whUsers.find((wu: any) => wu.userEmail === userEmail);
                if (match && match.warehouseId) {
                    const wid = String(match.warehouseId);
                    setUserWarehouseId(wid);
                    Cookies.set("selectedWarehouseId", wid, { expires: 7 });
                }
            }
        } catch (error) {
            console.error("Failed to fetch user warehouse:", error);
        }
    }, []);

    const fetchData = useCallback(async () => {
        if (isSuperAdmin === null) return; // wait until role is resolved
        setIsLoading(true);
        try {
            const [locRes, whRes] = await Promise.all([
                WarehouseLocationService.warehouseLocationGet(API_VERSION),
                WarehouseService.warehouseGet(API_VERSION)
            ]);

            const rawWhs = Array.isArray(whRes.data) ? whRes.data : [];
            const normalizedWhs = rawWhs.map((w: any) => {
                const id = String(w.warehouseId ?? w.WarehouseId ?? w.id ?? w.Id ?? "");
                const code = String(w.warehouseCode ?? w.Code ?? w.code ?? "");
                const name = String(w.warehouseName ?? w.Name ?? w.name ?? code ?? "Unknown Warehouse");
                return { id, name, code };
            });

            const rawLocs = Array.isArray(locRes.data) ? locRes.data : [];
            const allLocs: WarehouseLocation[] = rawLocs.map((item: any) => ({
                warehouseLocationId: String(item.warehouseLocationId ?? ""),
                warehouseId: String(item.warehouseId ?? ""),
                locationCode: item.locationCode ?? "",
                locationDescription: item.locationDescription ?? "",
                locationNotes: item.locationNotes ?? "",
            }));

            if (isSuperAdmin) {
                // SuperAdmin sees all locations and all warehouses
                setLocations(allLocs);
                setWarehouses(normalizedWhs);
            } else {
                // Regular user: filter to only their assigned warehouse from cookie
                const cookieWhId = Cookies.get("selectedWarehouseId");
                const filteredLocs = cookieWhId
                    ? allLocs.filter((loc) => String(loc.warehouseId) === String(cookieWhId))
                    : allLocs;
                const filteredWhs = cookieWhId
                    ? normalizedWhs.filter((w) => String(w.id) === String(cookieWhId))
                    : normalizedWhs;
                setLocations(filteredLocs);
                setWarehouses(filteredWhs.length > 0 ? filteredWhs : normalizedWhs);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    }, [isSuperAdmin]);

    useEffect(() => {
        checkAdminRole();
    }, [checkAdminRole]);

    useEffect(() => {
        if (isSuperAdmin === null) return;
        fetchData();
        if (!isSuperAdmin && !userWarehouseId) {
            fetchUserWarehouse();
        }
    }, [fetchData, fetchUserWarehouse, isSuperAdmin, userWarehouseId]);

    const handleCreate = () => {
        setEditData(null);
        setIsFormOpen(true);
    };

    const handleEdit = (location: WarehouseLocation) => {
        setEditData(location);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await WarehouseLocationService.deleteWarehouseLocation(deleteId, API_VERSION);
            toast.success("Warehouse location deleted");
            fetchData();
        } catch (error) {
            console.error("Failed to delete warehouse location:", error);
            toast.error("Failed to delete warehouse location");
        } finally {
            setDeleteId(null);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleSubmit = async (data: {
        warehouseLocationId?: string;
        warehouseId: string;
        locationCode: string;
        locationDescription: string;
        locationNotes: string;
    }) => {
        const finalWarehouseId = isSuperAdmin ? data.warehouseId : (Cookies.get("selectedWarehouseId") || warehouses[0]?.id || "");
        try {
            if (data.warehouseLocationId) {
                await WarehouseLocationService.warehouseLocationPut(API_VERSION, {
                    warehouseLocationId: data.warehouseLocationId,
                    warehouseId: finalWarehouseId,
                    locationCode: data.locationCode,
                    locationDescription: data.locationDescription,
                    locationNotes: data.locationNotes,
                });
                toast.success("Warehouse location updated");
            } else {
                await WarehouseLocationService.warehouseLocationPost(API_VERSION, {
                    warehouseId: finalWarehouseId,
                    locationCode: data.locationCode,
                    locationDescription: data.locationDescription,
                    locationNotes: data.locationNotes,
                });
                toast.success("Warehouse location created");
            }
            fetchData();
        } catch (error) {
            console.error("Failed to save warehouse location:", error);
            const apiError = error as any;
            if (apiError.status === 400) {
                toast.error("Invalid data provided. Please check the fields.");
            } else {
                toast.error("Failed to save warehouse location");
            }
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-primary" />
                        Warehouse Locations
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your physical warehouse spots and zones
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Location
                </Button>
            </div>

            <LocationTable
                locations={locations}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <LocationForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                editData={editData}
                warehouses={warehouses}
                isSuperAdmin={isSuperAdmin === true}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the warehouse location.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
