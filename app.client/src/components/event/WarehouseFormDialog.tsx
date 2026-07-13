"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Trans } from "@lingui/react";
import { toast } from "sonner";
import WarehouseValidationSchema from "./warehouseSchema";
import { i18n } from "@lingui/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Warehouse } from "./WarehouseLocationTable";

export const WarehouseFormDialog = ({
  mode = "add",
  onSubmit,
  open,
  setOpen,
  initialData,
}: {
  mode?: "add" | "update";
  onSubmit: (warehouse: Warehouse) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: Warehouse;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(WarehouseValidationSchema),
    defaultValues: initialData || {

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
    },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else reset();
  }, [initialData, reset]);

  const handleFormSubmit = (data: any) => {
    const payload =
      mode === "add"
        ? { id: Date.now().toString(), ...data }
        : { ...initialData, ...data };
    onSubmit(payload);
    toast.success(`Warehouse ${mode === "add" ? "added" : "updated"} successfully!`);
    reset();
    setOpen(false);
  };

  const fields = [
    { name: "warehouseCode", label: i18n.t({ id: "ui.Warehouse Code", message: "Warehouse Code" }) },
    { name: "warehouseName", label: i18n.t({ id: "ui.Warehouse Name", message: "Warehouse Name" }) },
    { name: "warehouseAddressLine1", label: i18n.t({ id: "ui.Address Line 1", message: "Address Line 1" }) },
    { name: "warehouseAddressLine2", label: i18n.t({ id: "ui.Address Line 2", message: "Address Line 2" }) },
    { name: "warehouseCity", label: i18n.t({ id: "ui.City", message: "City" }) },
    { name: "warehouseState", label: i18n.t({ id: "ui.State", message: "State" }) },
    { name: "warehouseZip", label: i18n.t({ id: "ui.Zip", message: "Zip" }) },
    { name: "warehouseCountry", label: i18n.t({ id: "ui.Country", message: "Country" }) },
    { name: "warehousePhone", label: i18n.t({ id: "ui.Phone", message: "Phone" }) },
    { name: "warehouseFax", label: i18n.t({ id: "ui.Fax", message: "Fax" }) },
    { name: "warehouseContact", label: i18n.t({ id: "ui.Contact", message: "Contact" }) },
    { name: "warehouseEmail", label: i18n.t({ id: "ui.Email", message: "Email" }) },
    { name: "warehouseNotes", label: i18n.t({ id: "ui.Notes", message: "Notes" }) },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add"
                ? i18n.t({ id: "ui.Create Warehouse", message: "Create Warehouse" })
                : i18n.t({
                  id: "ui.Update Warehouse",
                  message: "Update Warehouse",
                })}
            </DialogTitle>
            <DialogDescription>
              {i18n.t({
                id: "ui.Fill in the details below",
                message: "Fill in the details below",
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className="mb-4">
                <Label htmlFor={field.name} className="block mb-1">
                  <Trans id={field.label} />
                </Label>
                <Input
                  id={field.name}
                  type="text"
                  {...register(field.name as any, {
                    onChange: (e) => {
                      const { name, value } = e.target;
                      const alphabeticFields = [
                        "warehouseName",
                        "warehouseCity",
                        "warehouseState",
                        "warehouseCountry",
                        "warehouseContact",
                      ];
                      const numericFields = [
                        "warehouseCode",
                        "warehouseZip",
                        "warehousePhone",
                        "warehouseFax",
                      ];

                      if (alphabeticFields.includes(name)) {
                        e.target.value = value.replace(/[^a-zA-Z\s]/g, "");
                      } else if (numericFields.includes(name)) {
                        e.target.value = value.replace(/[^0-9]/g, "");
                      }
                    },
                  })}
                />
                {errors[field.name as keyof typeof errors] && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any)[field.name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {i18n.t({ id: "ui.Cancel", message: "Cancel" })}
              </Button>
            </DialogClose>
            <Button type="submit">
              {mode === "add"
                ? i18n.t({ id: "ui.Submit", message: "Submit" })
                : i18n.t({ id: "ui.Update", message: "Update" })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
