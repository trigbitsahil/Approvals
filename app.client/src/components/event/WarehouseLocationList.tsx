"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Warehouse, MapPin, Phone, Mail, User, Info, Hash, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, MoreVertical } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
import { WarehouseService } from "@/api/services/WarehouseService";
import { UserService } from "@/api/services/UserService";
import Cookies from "js-cookie";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateWarehouseCommand } from "@/api/models/CreateWarehouseCommand";
import type { UpdateWarehouseCommand } from "@/api/models/UpdateWarehouseCommand";

export interface Warehouse {
  id: string;
  warehouseCode?: string;
  warehouseName?: string;
  warehouseAddressLine1?: string;
  warehouseAddressLine2?: string;
  warehouseCity?: string;
  warehouseState?: string;
  warehouseZip?: string;
  warehouseCountry?: string;
  warehousePhone?: string;
  warehouseFax?: string;
  warehouseContact?: string;
  warehouseEmail?: string;
  warehouseNotes?: string;
}

const emptyForm: Omit<Warehouse, "id"> = {
  warehouseCode: "",
  warehouseName: "",
  warehouseAddressLine1: "",
  warehouseAddressLine2: "",
  warehouseCity: "",
  warehouseState: "",
  warehouseZip: "",
  warehouseCountry: "",
  warehousePhone: "",
  warehouseFax: "",
  warehouseContact: "",
  warehouseEmail: "",
  warehouseNotes: "",
};

const API_VERSION = "1";

const FIELD_LABELS: { key: keyof Omit<Warehouse, "id">; label: string }[] = [
  { key: "warehouseCode", label: "Warehouse Code" },
  { key: "warehouseName", label: "Warehouse Name" },
  { key: "warehouseAddressLine1", label: "Address Line 1" },
  { key: "warehouseAddressLine2", label: "Address Line 2" },
  { key: "warehouseCity", label: "City" },
  { key: "warehouseState", label: "State" },
  { key: "warehouseZip", label: "Zip" },
  { key: "warehouseCountry", label: "Country" },
  { key: "warehousePhone", label: "Phone" },
  { key: "warehouseFax", label: "Fax" },
  { key: "warehouseContact", label: "Contact" },
  { key: "warehouseEmail", label: "Email" },
  { key: "warehouseNotes", label: "Notes" },
];

export default function WarehouseLocationList() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [formData, setFormData] = useState<Partial<Warehouse>>(emptyForm);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [isWarehouseManager, setIsWarehouseManager] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [activeSortColumn, setActiveSortColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<0 | 1>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Resolve role once on mount
  useEffect(() => {
    const checkRole = async () => {
      try {
        const roleRes = await UserService.getMyRoles(API_VERSION);
        const roles = Array.isArray(roleRes.data) ? roleRes.data : [];
        setIsSuperAdmin((roles.includes("SuperAdmin") || roles.includes("WarehouseAdmin")));
        setIsWarehouseManager(roles.includes("WarehouseManager"));
      } catch {
        setIsSuperAdmin(false);
        setIsWarehouseManager(false);
      }
    };
    checkRole();
  }, []);

  const fetchWarehouses = useCallback(async () => {
    if (isSuperAdmin === null || isWarehouseManager === null) return;
    try {
      const res = await WarehouseService.warehouseGet(API_VERSION);
      const raw = Array.isArray(res.data) ? res.data : [];
      if (raw.length > 0) console.log("[Warehouse API] First item keys:", Object.keys(raw[0]), raw[0]);
      const normalized: Warehouse[] = raw.map((item: Record<string, any>) => ({
        id: String(item.id ?? item.Id ?? item.warehouseId ?? item.WarehouseId ?? item.ID ?? ""),
        warehouseCode: item.warehouseCode ?? item.WarehouseCode ?? "",
        warehouseName: item.warehouseName ?? item.WarehouseName ?? "",
        warehouseAddressLine1: item.warehouseAddressLine1 ?? item.WarehouseAddressLine1 ?? "",
        warehouseAddressLine2: item.warehouseAddressLine2 ?? item.WarehouseAddressLine2 ?? "",
        warehouseCity: item.warehouseCity ?? item.WarehouseCity ?? "",
        warehouseState: item.warehouseState ?? item.WarehouseState ?? "",
        warehouseZip: item.warehouseZip ?? item.WarehouseZip ?? "",
        warehouseCountry: item.warehouseCountry ?? item.WarehouseCountry ?? "",
        warehousePhone: item.warehousePhone ?? item.WarehousePhone ?? "",
        warehouseFax: item.warehouseFax ?? item.WarehouseFax ?? "",
        warehouseContact: item.warehouseContact ?? item.WarehouseContact ?? "",
        warehouseEmail: item.warehouseEmail ?? item.WarehouseEmail ?? "",
        warehouseNotes: item.warehouseNotes ?? item.WarehouseNotes ?? "",
      }));

      if (isSuperAdmin) {
        setWarehouses(normalized);
      } else if (isWarehouseManager) {
        const cookieWhId = Cookies.get("selectedWarehouseId");
        if (cookieWhId) {
          const allowedIds = cookieWhId.split(",");
          const filtered = normalized.filter(
            (w) => allowedIds.includes(String(w.id))
          );
          setWarehouses(filtered);
        } else {
          setWarehouses([]);
        }
      } else {
        setWarehouses([]);
      }
    } catch {
      toast.error("Failed to fetch warehouses");
    }
  }, [isSuperAdmin, isWarehouseManager]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  let filteredWarehouses = warehouses.filter((w) =>
    (w.warehouseName || "").toLowerCase().includes(search.toLowerCase()) ||
    (w.warehouseCode || "").toLowerCase().includes(search.toLowerCase()) ||
    (w.warehouseCity || "").toLowerCase().includes(search.toLowerCase()) ||
    (w.warehouseEmail || "").toLowerCase().includes(search.toLowerCase()) ||
    (w.warehouseContact || "").toLowerCase().includes(search.toLowerCase())
  );

  if (activeSortColumn) {
    filteredWarehouses.sort((a: any, b: any) => {
      let valA = a[activeSortColumn] || "";
      let valB = b[activeSortColumn] || "";
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 0 ? -1 : 1;
      if (valA > valB) return sortOrder === 0 ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredWarehouses.length / pageSize) || 1;
  const paginatedWarehouses = filteredWarehouses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (column: string) => {
    if (activeSortColumn === column) {
      setSortOrder(sortOrder === 0 ? 1 : 0);
    } else {
      setActiveSortColumn(column);
      setSortOrder(0);
    }
  };

  const getSortIcons = (column: string) => {
    const isActive = activeSortColumn === column;
    const isAsc = sortOrder === 0;

    return (
      <div className="flex flex-col items-center -space-y-1">
        <ChevronUp className={`h-3 w-3 transition-colors ${isActive && isAsc ? "text-primary font-bold" : "text-muted-foreground/40"}`} />
        <ChevronDown className={`h-3 w-3 transition-colors ${isActive && !isAsc ? "text-primary font-bold" : "text-muted-foreground/40"}`} />
      </div>
    );
  };

  const handleOpenDialog = (warehouse?: Warehouse, viewOnly = false) => {
    if (warehouse) {
      setFormData({ ...warehouse });
      setEditId(warehouse.id);
      setIsViewOnly(viewOnly);
    } else {
      setFormData({ ...emptyForm });
      setEditId(null);
      setIsViewOnly(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ ...emptyForm });
    setEditId(null);
    setIsViewOnly(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let filteredValue = value;

    const alphabeticFields = [
      "warehouseName",
      "warehouseCity",
      "warehouseState",
      "warehouseCountry",
      "warehouseContact",
    ];
    if (alphabeticFields.includes(name)) {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    const numericFields = ["warehouseCode", "warehouseZip", "warehousePhone", "warehouseFax"];
    if (numericFields.includes(name)) {
      filteredValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
  };

  const validateForm = () => {
    const fields = formData;

    if (!fields.warehouseCode) {
      toast.error("Warehouse Code is required (Numbers only)");
      return false;
    }

    if (!fields.warehouseName) {
      toast.error("Warehouse Name is required");
      return false;
    }

    if (!fields.warehouseAddressLine1) {
      toast.error("Address Line 1 is required");
      return false;
    }

    if (!fields.warehouseCity || !/^[a-zA-Z\s]+$/.test(fields.warehouseCity)) {
      toast.error("City is required (Letters only)");
      return false;
    }

    if (!fields.warehouseState || !/^[a-zA-Z\s]+$/.test(fields.warehouseState)) {
      toast.error("State is required (Letters only)");
      return false;
    }

    if (!fields.warehouseCountry || !/^[a-zA-Z\s]+$/.test(fields.warehouseCountry)) {
      toast.error("Country is required (Letters only)");
      return false;
    }

    if (!fields.warehouseEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.warehouseEmail)) {
      toast.error("Valid Email is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (editId) {
        const updatePayload: UpdateWarehouseCommand = {
          WarehouseId: editId,
          warehouseCode: formData.warehouseCode,
          warehouseName: formData.warehouseName,
          warehouseAddressLine1: formData.warehouseAddressLine1,
          warehouseAddressLine2: formData.warehouseAddressLine2,
          warehouseCity: formData.warehouseCity,
          warehouseState: formData.warehouseState,
          warehouseZip: formData.warehouseZip,
          warehouseCountry: formData.warehouseCountry,
          warehousePhone: formData.warehousePhone,
          warehouseFax: formData.warehouseFax,
          warehouseContact: formData.warehouseContact,
          warehouseEmail: formData.warehouseEmail,
          warehouseNotes: formData.warehouseNotes,
        };
        await WarehouseService.warehousePut(API_VERSION, updatePayload);
        toast.success("Warehouse updated");
      } else {
        const createPayload: CreateWarehouseCommand = {
          warehouseCode: formData.warehouseCode,
          warehouseName: formData.warehouseName,
          warehouseAddressLine1: formData.warehouseAddressLine1,
          warehouseAddressLine2: formData.warehouseAddressLine2,
          warehouseCity: formData.warehouseCity,
          warehouseState: formData.warehouseState,
          warehouseZip: formData.warehouseZip,
          warehouseCountry: formData.warehouseCountry,
          warehousePhone: formData.warehousePhone,
          warehouseFax: formData.warehouseFax,
          warehouseContact: formData.warehouseContact,
          warehouseEmail: formData.warehouseEmail,
          warehouseNotes: formData.warehouseNotes,
        };
        await WarehouseService.warehousePost(API_VERSION, createPayload);
        toast.success("Warehouse created");
      }
      fetchWarehouses();
      handleClose();
    } catch {
      toast.error("Failed to save warehouse");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await WarehouseService.deleteWarehouse(deleteId, API_VERSION);
      toast.success("Warehouse deleted");
      fetchWarehouses();
    } catch {
      toast.error("Failed to delete warehouse");
    } finally {
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4 p-3 md:space-y-6 md:p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Warehouse</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            View and manage all warehouse locations
          </p>
        </div>

        {/* Search and Add Button - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search warehouses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Button onClick={() => handleOpenDialog()} className="whitespace-nowrap h-9 w-full sm:w-auto text-sm">
            + Add Warehouse
          </Button>
        </div>
      </div>

      {/* Table View for Desktop, Card View for Mobile */}
      {isMobile ? (
        // Mobile Card View
        <div className="space-y-3">
          {paginatedWarehouses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No warehouse locations found.
            </div>
          ) : (
            paginatedWarehouses.map((warehouse, index) => (
              <div
                key={warehouse.id || index}
                className="border border-border rounded-lg p-4 space-y-3 bg-card hover:shadow-sm transition-shadow"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">#{(currentPage - 1) * pageSize + index + 1}</p>
                    <h3 className="font-semibold text-sm md:text-base">{warehouse.warehouseName}</h3>
                    <p className="text-xs text-muted-foreground">{warehouse.warehouseCode}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleOpenDialog(warehouse, true)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleOpenDialog(warehouse)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-600"
                      onClick={() => handleDelete(warehouse.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-2 border-t border-border pt-3">
                  {warehouse.warehouseAddressLine1 && (
                    <div className="text-xs">
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{warehouse.warehouseAddressLine1}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {warehouse.warehouseCity && (
                      <div className="text-xs">
                        <p className="text-muted-foreground">City</p>
                        <p className="font-medium">{warehouse.warehouseCity}</p>
                      </div>
                    )}
                    {warehouse.warehouseState && (
                      <div className="text-xs">
                        <p className="text-muted-foreground">State</p>
                        <p className="font-medium">{warehouse.warehouseState}</p>
                      </div>
                    )}
                    {warehouse.warehouseCountry && (
                      <div className="text-xs">
                        <p className="text-muted-foreground">Country</p>
                        <p className="font-medium">{warehouse.warehouseCountry}</p>
                      </div>
                    )}
                    {warehouse.warehousePhone && (
                      <div className="text-xs">
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{warehouse.warehousePhone}</p>
                      </div>
                    )}
                  </div>
                  {warehouse.warehouseEmail && (
                    <div className="text-xs">
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium truncate">{warehouse.warehouseEmail}</p>
                    </div>
                  )}
                  {warehouse.warehouseContact && (
                    <div className="text-xs">
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-medium">{warehouse.warehouseContact}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Desktop Table View
        <div className="border border-border rounded-lg shadow-md overflow-hidden overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted text-muted-foreground text-left">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">S.No</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("warehouseCode")}>
                  <div className="flex items-center gap-1">Code {getSortIcons("warehouseCode")}</div>
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[180px] cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("warehouseName")}>
                  <div className="flex items-center gap-1">Warehouse Name {getSortIcons("warehouseName")}</div>
                </th>
                <th className="px-4 py-3 font-medium min-w-[280px] cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("warehouseAddressLine1")}>
                  <div className="flex items-center gap-1">Address Line 1 {getSortIcons("warehouseAddressLine1")}</div>
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("warehouseCity")}>
                  <div className="flex items-center gap-1">City {getSortIcons("warehouseCity")}</div>
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("warehouseState")}>
                  <div className="flex items-center gap-1">State {getSortIcons("warehouseState")}</div>
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("warehouseCountry")}>
                  <div className="flex items-center gap-1">Country {getSortIcons("warehouseCountry")}</div>
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("warehousePhone")}>
                  <div className="flex items-center gap-1">Phone {getSortIcons("warehousePhone")}</div>
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("warehouseEmail")}>
                  <div className="flex items-center gap-1">Email {getSortIcons("warehouseEmail")}</div>
                </th>
                <th className="px-0 py-3 font-medium whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedWarehouses.map((warehouse, index) => (
                <tr
                  key={warehouse.id || index}
                  className="border-b border-border transition-colors hover:bg-muted/50 last:border-0"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{warehouse.warehouseCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{warehouse.warehouseName}</td>
                  <td className="px-4 py-3 max-w-[280px]">
                    <div title={warehouse.warehouseAddressLine1 || ""}>{warehouse.warehouseAddressLine1}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{warehouse.warehouseCity}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{warehouse.warehouseState}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{warehouse.warehouseCountry}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{warehouse.warehousePhone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{warehouse.warehouseEmail}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleOpenDialog(warehouse, true)}
                        title="Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleOpenDialog(warehouse)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
                        onClick={() => handleDelete(warehouse.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedWarehouses.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No warehouse locations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination - Responsive */}
      {paginatedWarehouses.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/50 pt-4 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => { setPageSize(parseInt(value)); setCurrentPage(1); }}
            >
              <SelectTrigger className="w-[70px] h-8 bg-transparent border-muted text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-xs md:text-sm text-muted-foreground order-2 sm:order-1">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              {isViewOnly
                ? "Warehouse Details"
                : editId
                  ? "Edit Warehouse"
                  : "Add Warehouse"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 md:space-y-6 py-4">
            {/* General Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Warehouse className="w-4 h-4 text-primary flex-shrink-0" />
                <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">General Info</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="flex items-center gap-1.5 text-xs text-muted-foreground"><Hash className="w-3 h-3" /> Warehouse Code</Label>
                  <Input name="warehouseCode" value={formData.warehouseCode} onChange={handleChange} readOnly={isViewOnly} placeholder="e.g. 101" className="text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1.5 text-xs text-muted-foreground"><User className="w-3 h-3" /> Warehouse Name</Label>
                  <Input name="warehouseName" value={formData.warehouseName} onChange={handleChange} readOnly={isViewOnly} placeholder="e.g. Main Hub" className="text-sm" />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Address Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Address Line 1</Label>
                  <Input name="warehouseAddressLine1" value={formData.warehouseAddressLine1} onChange={handleChange} readOnly={isViewOnly} placeholder="Street address..." className="text-sm" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Address Line 2</Label>
                  <Input name="warehouseAddressLine2" value={formData.warehouseAddressLine2} onChange={handleChange} readOnly={isViewOnly} placeholder="Suite, floor, etc. (optional)" className="text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <Input name="warehouseCity" value={formData.warehouseCity} onChange={handleChange} readOnly={isViewOnly} placeholder="City" className="text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">State</Label>
                  <Input name="warehouseState" value={formData.warehouseState} onChange={handleChange} readOnly={isViewOnly} placeholder="State" className="text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Zip</Label>
                  <Input name="warehouseZip" value={formData.warehouseZip} onChange={handleChange} readOnly={isViewOnly} placeholder="Zip code" className="text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Country</Label>
                  <Input name="warehouseCountry" value={formData.warehouseCountry} onChange={handleChange} readOnly={isViewOnly} placeholder="Country" className="text-sm" />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> Phone</Label>
                  <Input name="warehousePhone" value={formData.warehousePhone} onChange={handleChange} readOnly={isViewOnly} placeholder="Phone number" className="text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Fax</Label>
                  <Input name="warehouseFax" value={formData.warehouseFax} onChange={handleChange} readOnly={isViewOnly} placeholder="Fax number" className="text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1.5 text-xs text-muted-foreground"><User className="w-3 h-3" /> Contact Person</Label>
                  <Input name="warehouseContact" value={formData.warehouseContact} onChange={handleChange} readOnly={isViewOnly} placeholder="Full name" className="text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> Email</Label>
                  <Input name="warehouseEmail" value={formData.warehouseEmail} onChange={handleChange} readOnly={isViewOnly} placeholder="email@example.com" className="text-sm" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Info className="w-4 h-4 text-primary flex-shrink-0" />
                <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Additional Info</h3>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Notes (Optional)</Label>
                <Textarea
                  name="warehouseNotes"
                  value={formData.warehouseNotes}
                  onChange={handleChange}
                  readOnly={isViewOnly}
                  rows={3}
                  className="resize-none text-sm"
                  placeholder="Tell us more about this warehouse..."
                />
              </div>
            </div>
          </div>

          {!isViewOnly && (
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleClose} className="text-sm w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="text-sm w-full sm:w-auto">
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[90vw] max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs md:text-sm">
              This action cannot be undone. This will permanently delete the warehouse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setDeleteId(null)} className="text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}