'use client';

import React, { useEffect, useState } from "react";
import { VendorService } from "@/api/services/VendorService";
import { VendorCategoryService } from "@/api/services/VendorCategoryService";
import type { VendorListVM } from "@/api/models/VendorListVM";
import type { VendorCategoryListVM } from "@/api/models/VendorCategoryListVM";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, MoreVertical, Edit2, Trash2, Truck } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export function VendorList() {
  const [vendors, setVendors] = useState<VendorListVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [vendorId, setVendorId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<VendorCategoryListVM[]>([]);
  const [vendorCategoryId, setVendorCategoryId] = useState("");
  const [isVoided, setIsVoided] = useState(false);

  const { confirm } = useConfirmation();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await VendorService.getApiVVendor('1');
      if (res.success && res.data) {
        setVendors(res.data);
      }
    } catch (e) {
      toast.error("Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await VendorCategoryService.getAllVendorCategories();
      setCategories(res);
    } catch (e) {
      console.error("Failed to fetch vendor categories", e);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required.");
      return;
    }
    if (!vendorCategoryId) {
      toast.error("Vendor Category is required.");
      return;
    }

    try {
      const payload = {
        name,
        email: email || null,
        phone: phone || null,
        website: website || null,
        gstNumber: gstNumber || null,
        panNumber: panNumber || null,
        address: address || null,
        note: note || null,
        vendorCategoryId,
        isVoided,
      };

      if (isEditing) {
        await VendorService.updateVendor({ ...payload, vendorId });
        toast.success("Vendor updated successfully.");
      } else {
        await VendorService.createVendor(payload);
        toast.success("Vendor created successfully.");
      }
      setIsModalOpen(false);
      resetForm();
      fetchVendors();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} vendor.`);
    }
  };

  const resetForm = () => {
    setVendorId("");
    setName("");
    setEmail("");
    setPhone("");
    setWebsite("");
    setGstNumber("");
    setPanNumber("");
    setAddress("");
    setNote("");
    setVendorCategoryId("");
    setIsVoided(false);
    setIsEditing(false);
  };

  const handleEdit = (vendor: VendorListVM) => {
    setVendorId(vendor.vendorID || "");
    setName(vendor.name || "");
    setEmail(vendor.email || "");
    setPhone(vendor.phone || "");
    setWebsite(vendor.website || "");
    setGstNumber(vendor.gstNumber || "");
    setPanNumber(vendor.panNumber || "");
    setAddress(vendor.address || "");
    setNote(vendor.note || "");
    setVendorCategoryId(vendor.vendorCategoryId || "");
    setIsVoided(vendor.isVoided || false);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (vendorId: string) => {
    const isConfirmed = await confirm({
      title: "Delete Vendor",
      message: "Are you sure you want to delete this vendor? This action cannot be undone.",
    });

    if (isConfirmed) {
      try {
        await VendorService.deleteVendor(vendorId);
        toast.success("Vendor deleted successfully.");
        fetchVendors();
      } catch (error) {
        toast.error("Failed to delete vendor.");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            Vendors
          </h2>
          <p className="text-muted-foreground mt-1">Manage your vendors and suppliers.</p>
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
              <Plus className="mr-2 h-4 w-4" /> Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Vendor" : "Create Vendor"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Vendor Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vendor Category <span className="text-destructive">*</span></label>
                  <Select value={vendorCategoryId} onValueChange={setVendorCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.vendorCategoryId} value={c.vendorCategoryId || ""}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">GST Number</label>
                  <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="GSTIN" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">PAN Number</label>
                  <Input value={panNumber} onChange={(e) => setPanNumber(e.target.value)} placeholder="PAN" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" rows={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Note</label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Additional notes..." rows={2} />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <p className="text-xs text-muted-foreground">
                    {isVoided ? "Inactive/Voided" : "Active Vendor"}
                  </p>
                </div>
                <Switch checked={!isVoided} onCheckedChange={(checked) => setIsVoided(!checked)} />
              </div>
              <Button type="submit" className="w-full">{isEditing ? "Update Vendor" : "Create Vendor"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[200px]">Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tax Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-muted-foreground">Loading vendors...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No vendors found.
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => (
                <TableRow key={vendor.vendorID} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-foreground">{vendor.name}</span>
                      {vendor.address && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{vendor.address}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {categories.find(c => c.vendorCategoryId === vendor.vendorCategoryId)?.name || "None"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      {vendor.email && <span className="text-muted-foreground">{vendor.email}</span>}
                      {vendor.phone && <span className="text-muted-foreground">{vendor.phone}</span>}
                      {!vendor.email && !vendor.phone && <span className="text-muted-foreground italic">No contact info</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      {vendor.gstNumber && <span className="text-muted-foreground">Address: {vendor.address}</span>}
                      {vendor.panNumber && <span className="text-muted-foreground">Notes: {vendor.note}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${vendor.isVoided ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {vendor.isVoided ? "Voided" : "Active"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleEdit(vendor)} className="cursor-pointer">
                          <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => vendor.vendorID && handleDelete(vendor.vendorID)} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Vendor
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
