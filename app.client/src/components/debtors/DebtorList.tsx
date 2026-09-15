import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DebtorService } from "@/api/services/DebtorService";
import type { DebtorListVM } from "@/api/models/DebtorListVM";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, MoreVertical, Edit2, Trash2, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
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

export function DebtorList() {
  const navigate = useNavigate();
  const [debtors, setDebtors] = useState<DebtorListVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [debtorId, setDebtorId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isVoided, setIsVoided] = useState(false);

  const { confirm } = useConfirmation();

  const fetchDebtors = async () => {
    try {
      setLoading(true);
      const res = await DebtorService.getApiVDebtor('1');
      if (res.success && res.data) {
        setDebtors(res.data);
      }
    } catch (e) {
      toast.error("Failed to fetch debtors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtors();
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
        email: email || null,
        phone: phone || null,
        website: website || null,
        gstNumber: gstNumber || null,
        panNumber: panNumber || null,
        address: address || null,
        note: note || null,
        isVoided,
      };

      if (isEditing) {
        await DebtorService.updateDebtor({ ...payload, debtorId });
        toast.success("Debtor updated successfully.");
      } else {
        await DebtorService.createDebtor(payload);
        toast.success("Debtor created successfully.");
      }
      setIsModalOpen(false);
      resetForm();
      fetchDebtors();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} debtor.`);
    }
  };

  const resetForm = () => {
    setDebtorId("");
    setName("");
    setEmail("");
    setPhone("");
    setWebsite("");
    setGstNumber("");
    setPanNumber("");
    setAddress("");
    setNote("");
    setIsVoided(false);
    setIsEditing(false);
  };

  const handleEdit = (debtor: DebtorListVM) => {
    setDebtorId(debtor.debtorId || "");
    setName(debtor.name || "");
    setEmail(debtor.email || "");
    setPhone(debtor.phone || "");
    setWebsite(debtor.website || "");
    setGstNumber(debtor.gstNumber || "");
    setPanNumber(debtor.panNumber || "");
    setAddress(debtor.address || "");
    setNote(debtor.note || "");
    setIsVoided(debtor.isVoided || false);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (debtorId: string) => {
    const isConfirmed = await confirm({
      title: "Delete Debtor",
      message: "Are you sure you want to delete this debtor? This action cannot be undone.",
    });

    if (isConfirmed) {
      try {
        await DebtorService.deleteDebtor(debtorId);
        toast.success("Debtor deleted successfully.");
        fetchDebtors();
      } catch (error) {
        toast.error("Failed to delete debtor.");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Debtors
          </h2>
          <p className="text-muted-foreground mt-1">Manage your debtors and clients.</p>
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
              <Plus className="mr-2 h-4 w-4" /> Add Debtor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Debtor" : "Create Debtor"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Debtor Name" />
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
                    {isVoided ? "Inactive/Voided" : "Active Debtor"}
                  </p>
                </div>
                <Switch checked={!isVoided} onCheckedChange={(checked) => setIsVoided(!checked)} />
              </div>
              <Button type="submit" className="w-full">{isEditing ? "Update Debtor" : "Create Debtor"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">Debtor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-muted-foreground">Loading debtors...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : debtors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No debtors found.
                </TableCell>
              </TableRow>
            ) : (
              debtors.map((debtor) => (
                <TableRow 
                  key={debtor.debtorId} 
                  className="group hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => {
                    if (debtor.debtorId) {
                      navigate(`/debtors/${debtor.debtorId}`);
                    }
                  }}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-foreground font-semibold hover:underline">{debtor.name}</span>
                      {debtor.address && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{debtor.address}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      {debtor.email ? (
                        <span className="text-muted-foreground">{debtor.email}</span>
                      ) : (
                        <span className="text-muted-foreground italic">No contact info</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      {debtor.phone ? (
                        <span className="text-muted-foreground">{debtor.phone}</span>
                      ) : (
                        <span className="text-muted-foreground italic">No phone info</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${debtor.isVoided ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {debtor.isVoided ? "Voided" : "Active"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleEdit(debtor)} className="cursor-pointer">
                          <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => debtor.debtorId && handleDelete(debtor.debtorId)} className="cursor-pointer text-red-500 focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Debtor
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
