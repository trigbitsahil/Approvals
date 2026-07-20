'use client';

import React, { useEffect, useState } from "react";
import { BankService } from "@/api/services/BankService";
import { UserService } from "@/api/services/UserService";
import type { BankListVM } from "@/api/models/BankListVM";
import type { GetUserListQueryResponse } from "@/api/models/GetUserListQueryResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, MoreVertical, Edit2, Trash2, Building2, User } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { useSidebar } from "@/components/ui/sidebar";
import { useConfirmation } from "@/contexts/ConfirmationContext";

export function BankList() {
  const [banks, setBanks] = useState<BankListVM[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [bankId, setBankId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState<string>("none");
  const [isActive, setIsActive] = useState(true);

  const { isMobile } = useSidebar();
  const { confirm } = useConfirmation();

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const [banksRes, usersRes] = await Promise.all([
        BankService.getBanks(),
        UserService.getApiVUser('1').catch(() => null)
      ]);
      
      if ((banksRes as any).success) {
        setBanks((banksRes as any).data);
      }
      
      if (usersRes?.data) {
        setUsers(usersRes.data);
      }
    } catch (e) {
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) {
      toast.error("Name and Address are required.");
      return;
    }

    try {
      const payload = {
        name,
        type: type || null,
        description: description || null,
        address,
        userId: userId === "none" ? null : userId,
        isActive,
      };

      if (isEditing) {
        await BankService.updateBank({ ...payload, bankId });
        toast.success("Bank updated successfully.");
      } else {
        await BankService.createBank(payload);
        toast.success("Bank created successfully.");
      }
      setIsModalOpen(false);
      resetForm();
      fetchBanks();
    } catch (err: any) {
      toast.error(err?.body?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Bank",
      message: "Are you sure you want to delete this bank? This action cannot be undone.",
      confirmLabel: "Delete",
      variant: "destructive"
    });
    if (!isConfirmed) return;
    
    try {
      await BankService.deleteBank(id);
      toast.success("Bank deleted successfully.");
      fetchBanks();
    } catch (err: any) {
      toast.error(err?.body?.message || "Failed to delete bank.");
    }
  };

  const resetForm = () => {
    setBankId("");
    setName("");
    setType("");
    setDescription("");
    setAddress("");
    setIsActive(true);
    setIsEditing(false);
  };

  const handleEdit = (b: BankListVM) => {
    setBankId(b.bankId);
    setName(b.name);
    setType(b.type || "");
    setDescription(b.description || "");
    setAddress(b.address || "");
    setUserId(b.userId || "none");
    setIsActive(b.isActive ?? true);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Building2 className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Banks</h1>
          </div>
          <p className="text-sm text-muted-foreground">Manage your organization's bank accounts</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Bank
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Bank" : "Create New Bank"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Bank Name <span className="text-destructive">*</span>
                </label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  placeholder="Enter bank name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Input 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g., Checking, Savings"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Address <span className="text-destructive">*</span>
                </label>
                <Input 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required
                  placeholder="Enter bank address"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign User</label>
                <Select value={userId} onValueChange={setUserId}>
                    <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 opacity-50" />
                            <SelectValue placeholder="Select a user" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No user assigned</SelectItem>
                        {users.map((u) => (
                            <SelectItem key={u.id || u.userId} value={u.id || u.userId}>
                                {u.firstName} {u.lastName} ({u.email})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Switch 
                  checked={isActive} 
                  onCheckedChange={setIsActive}
                />
                <label className="text-sm font-medium cursor-pointer">
                  {isActive ? "Active" : "Inactive"}
                </label>
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6 h-10"
              >
                {isEditing ? "Update Bank" : "Create Bank"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Assigned User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Loading banks...
                </TableCell>
              </TableRow>
            ) : banks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No banks found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              banks.map((b) => (
                <TableRow key={b.bankId}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.type || "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.address || "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {b.userId ? (users.find(u => u.id === b.userId || u.userId === b.userId)?.firstName + " " + users.find(u => u.id === b.userId || u.userId === b.userId)?.lastName || b.userId) : "-"}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      b.isActive !== false 
                        ? "bg-green-500/10 text-green-700 dark:text-green-400" 
                        : "bg-gray-500/10 text-gray-700 dark:text-gray-400"
                    }`}>
                      {b.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer"
                          onClick={() => handleEdit(b)}
                        >
                          <Edit2 className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive cursor-pointer"
                          onClick={() => handleDelete(b.bankId)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
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

export default BankList;