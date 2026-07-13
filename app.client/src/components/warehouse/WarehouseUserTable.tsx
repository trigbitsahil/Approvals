"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Search, Trash2, Edit, User } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WarehouseUserService } from "@/api/services/WarehouseUserService";
import { UserService } from "@/api/services/UserService";
import { WarehouseService } from "@/api/services/WarehouseService";
import { useConfirmation } from "@/contexts/ConfirmationContext";
import Cookies from "js-cookie";

const API_VERSION = "1";

export const WarehouseUserTable = () => {
    const { confirm } = useConfirmation();
    const [warehouseUsers, setWarehouseUsers] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        UserEmail: "",
        WarehouseId: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [userSearch, setUserSearch] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [whUsersRes, usersRes, whsRes] = await Promise.all([
                WarehouseUserService.warehouseUserGet(API_VERSION),
                UserService.getApiVUser(API_VERSION),
                WarehouseService.warehouseGet(API_VERSION)
            ]);

            setWarehouseUsers(whUsersRes.data || []);
            setUsers(usersRes.data || []);
            setWarehouses(whsRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load warehouse users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenDialog = (whUser?: any) => {
        setUserSearch("");
        if (whUser) {
            setEditMode(true);
            setSelectedId(whUser.warehouseUserId || whUser.WarehouseUserId);
            setFormData({
                UserEmail: whUser.userEmail || whUser.UserEmail || "",
                WarehouseId: whUser.warehouseId || whUser.WarehouseId || ""
            });
        } else {
            setEditMode(false);
            setSelectedId(null);
            setFormData({
                UserEmail: "",
                WarehouseId: ""
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.UserEmail || !formData.WarehouseId) {
            toast.error("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        try {
            if (editMode && selectedId) {
                await WarehouseUserService.warehouseUserPut(API_VERSION, {
                    WarehouseUserId: selectedId,
                    UserEmail: formData.UserEmail,
                    WarehouseId: formData.WarehouseId
                });
                toast.success("Warehouse user updated");
            } else {
                await WarehouseUserService.warehouseUserPost(API_VERSION, {
                    UserEmail: formData.UserEmail,
                    WarehouseId: formData.WarehouseId
                });
                toast.success("Warehouse user created");
            }

            // If the assigned/edited user is the currently logged-in user, append the warehouse ID to the cookie
            try {
                const meRes = await UserService.getLoggedInUser(API_VERSION);
                const myEmail = meRes.data?.email;
                if (myEmail && myEmail === formData.UserEmail) {
                    const existingCookie = Cookies.get("selectedWarehouseId");
                    let idArray = existingCookie ? existingCookie.split(",") : [];
                    if (!idArray.includes(String(formData.WarehouseId))) {
                        idArray.push(String(formData.WarehouseId));
                        Cookies.set("selectedWarehouseId", idArray.join(","), { expires: 365 });
                    }
                }
            } catch (e) {
                console.error("Failed to update selectedWarehouseId cookie:", e);
            }

            setIsDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to save warehouse user");
        } finally {
            setSubmitting(false);
        }
    };



    const filteredData = warehouseUsers.filter(item =>
        (item.userEmail?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.warehouseName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Warehouse Users</h2>
                    <p className="text-muted-foreground text-sm">Manage user access to warehouses.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Assign User
                </Button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users or warehouses..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="pl-6">S.No</TableHead>
                            <TableHead>User Email</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                                    Loading warehouse users...
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item, index) => (
                                <TableRow key={item.warehouseUserId}>
                                    <TableCell className="pl-6">{index + 1}</TableCell>
                                    <TableCell className="font-medium text-foreground">{item.userEmail}</TableCell>
                                    <TableCell>{item.warehouseName || item.warehouseId}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:text-primary"
                                                onClick={() => handleOpenDialog(item)}
                                            >
                                                <Edit className="h-4 w-4" />
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
                        <DialogTitle>{editMode ? "Edit Assignment" : "Assign User to Warehouse"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">User Email</label>
                            <Select
                                value={formData.UserEmail || undefined}
                                onValueChange={(val) => setFormData({ ...formData, UserEmail: val })}
                                disabled={editMode}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(u => (
                                        <SelectItem key={u.email} value={u.email}>{u.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Warehouse</label>
                            <Select
                                value={formData.WarehouseId || undefined}
                                onValueChange={(val) => setFormData({ ...formData, WarehouseId: val })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a warehouse" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.length === 0 ? (
                                        <SelectItem value="none" disabled>No warehouses available</SelectItem>
                                    ) : (
                                        warehouses.map(w => {
                                            const id = w.warehouseId || w.WarehouseId || w.id;
                                            const name = w.warehouseName || w.name || w.warehouseCode || id;
                                            return (
                                                <SelectItem key={id} value={id}>
                                                    {name}
                                                </SelectItem>
                                            );
                                        })
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving..." : editMode ? "Update" : "Assign"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
