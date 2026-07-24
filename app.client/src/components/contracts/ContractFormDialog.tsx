"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContractService } from "@/api/services/ContractService";
import type { CreateContractCommand } from "@/api/models/CreateContractCommand";
import type { UpdateContractCommand } from "@/api/models/UpdateContractCommand";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContractFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  contractToEdit: any | null; // using any temporarily to accommodate the VM
}

const API_VERSION = "1";

export function ContractFormDialog({
  open,
  onOpenChange,
  onSuccess,
  contractToEdit,
}: ContractFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
  });

  const isEditing = !!contractToEdit;

  useEffect(() => {
    if (open && contractToEdit) {
      setFormData({
        name: contractToEdit.name || "",
        number: contractToEdit.number || "",
      });
    } else if (open && !contractToEdit) {
      setFormData({
        name: "",
        number: "",
      });
    }
  }, [open, contractToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Contract Name is required");
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        const command: UpdateContractCommand = {
          contractId: contractToEdit.contractId,
          name: formData.name,
          number: formData.number,
        };
        const res = await ContractService.putApiVContract(API_VERSION, command);
        if (res.success) {
          toast.success("Contract updated successfully");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(res.message || "Failed to update contract");
        }
      } else {
        const command: CreateContractCommand = {
          name: formData.name,
          number: formData.number,
        };
        const res = await ContractService.postApiVContract(API_VERSION, command);
        if (res.success) {
          toast.success("Contract created successfully");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(res.message || "Failed to create contract");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(isEditing ? "Error updating contract" : "Error creating contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Contract" : "Create Contract"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the contract below."
              : "Enter the details for the new contract."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contract Name"
                className="col-span-3"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Number
              </Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="e.g. C-12345"
                className="col-span-3"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Contract"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
