"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Warehouse {
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

export const WarehouseLocationPage = () => {
  const [data, setData] = useState<Warehouse[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Warehouse>>({});

  const handleOpen = (item?: Warehouse) => {
    if (item) {
      setFormData(item);
      setEditId(item.id);
    } else {
      setFormData({});
      setEditId(null);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({});
    setEditId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [

      "warehouseCode",
      "warehouseName",
      "warehouseCity",
      "warehouseState",
      "warehouseCountry",
      "warehousePhone",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof Warehouse]) {
        toast.error(`${field} is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...formData } : item,
        ),
      );
      toast.success("Warehouse updated");
    } else {
      const newItem: Warehouse = {
        id: crypto.randomUUID(),
        ...formData,
      };

      setData((prev) => [...prev, newItem]);
      toast.success("Warehouse created");
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Warehouse deleted");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Warehouse Locations</h2>
          <p className="text-sm text-muted-foreground">
            Manage warehouse locations
          </p>
        </div>

        <Button onClick={() => handleOpen()}>+ Add Warehouse</Button>
      </div>

      {/* Table */}

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2">S.No</th>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Warehouse Name</th>
              <th className="px-4 py-2">Address Line 1</th>
              <th className="px-4 py-2">Address Line 2</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Zip</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Fax</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className="border-t  transition-colors"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item.warehouseCode}</td>
                <td className="px-4 py-3">{item.warehouseName}</td>
                <td className="px-4 py-3">{item.warehouseAddressLine1}</td>
                <td className="px-4 py-3">{item.warehouseAddressLine2}</td>
                <td className="px-4 py-3">{item.warehouseCity}</td>
                <td className="px-4 py-3">{item.warehouseState}</td>
                <td className="px-4 py-3">{item.warehouseZip}</td>
                <td className="px-4 py-3">{item.warehouseCountry}</td>
                <td className="px-4 py-3">{item.warehousePhone}</td>
                <td className="px-4 py-3">{item.warehouseFax}</td>
                <td className="px-4 py-3">{item.warehouseContact}</td>
                <td className="px-4 py-3">{item.warehouseEmail}</td>
                <td className="px-4 py-3">{item.warehouseNotes}</td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleOpen(item)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-600"
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={15}
                  className="text-center py-6 text-muted-foreground"
                >
                  No warehouse locations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Warehouse" : "Add Warehouse"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys({
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
            }).map((field) => (
              <div key={field}>
                <Label className="capitalize">
                  {field.replace(/warehouse/g, "").replace(/([A-Z])/g, " $1")}
                </Label>

                <Input
                  name={field}
                  value={(formData as any)[field] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehouseLocationPage;
