"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Trans } from "@lingui/react";
import { toast } from "sonner";
import InventoryValidationSchema from "./validationSchema";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryItemListVM as InventoryItem } from "../../api/models/InventoryItemListVM";
import { CompanyListVM } from "../../api/models/CompanyListVM";

type InventoryFormValues = InventoryItem & { hasClientOption: boolean };

export const InventoryFormDialog = ({
  mode = "add",
  onSubmit,
  open,
  setOpen,
  initialData,
  companies = [],
  inventoryTypes = [],
}: {
  mode?: "add" | "update";
  onSubmit: (item: any) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: InventoryItem;
  companies?: CompanyListVM[];
  inventoryTypes?: any[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<InventoryFormValues>({
    resolver: yupResolver(InventoryValidationSchema) as any,
    defaultValues: (initialData ? { ...initialData, hasClientOption: !!initialData.productClientId } : {
      ownerBarcodeItemNum: "",
      productClientId: "",
      hasClientOption: false,
      productDescription: "",
      productNotes: "",
      productUom: "",
      productGrossWeightKg: undefined,
      productPackage: "",
      lastPricePaid: undefined,
      isSnRequired: false,
      isDateMfgRequired: false,
      isDateExpRequired: false,
      inventoryItemTypeId: "",
    }) as any,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setImageBase64("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result?.toString().split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  };


  useEffect(() => {
    if (initialData) {
      reset({ ...initialData, hasClientOption: !!initialData.productClientId });
    } else {
      reset({
        ownerBarcodeItemNum: "",
        productClientId: "",
        hasClientOption: false,
        productDescription: "",
        productNotes: "",
        productUom: "",
        productGrossWeightKg: undefined,
        productPackage: "",
        lastPricePaid: undefined,
        isLotRequired: false,
        isSnRequired: false,
        isDateMfgRequired: false,
        isDateExpRequired: false,
        inventoryItemTypeId: "",
      } as any);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, imageFile, imageBase64 });
    setOpen(false);
    reset();
    setImageFile(null);
    setImageBase64("");
  };

  // Reset local state when dialog closes or initialData changes
  useEffect(() => {
    if (!open) {
      setImageFile(null);
      setImageBase64("");
    }
  }, [open]);

  const textFieldList = [
    { name: "ownerBarcodeItemNum", label: "Barcode/Item Num" },
    { name: "productDescription", label: "Description" },
    { name: "productNotes", label: "Notes" },
    { name: "productUom", label: "UOM" },
    { name: "productGrossWeightKg", label: "Gross Weight (Kg)", type: "number" },
    { name: "productPackage", label: "Package" },
    { name: "lastPricePaid", label: "Last Price Paid", type: "number" },
  ];

  const checkboxFieldList = [
    { name: "isLotRequired", label: "Lot Required" },
    { name: "isSnRequired", label: "SN Required" },
    { name: "isDateMfgRequired", label: "Date Mfg Required" },
    { name: "isDateExpRequired", label: "Date Exp Required" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[92vw] sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Create Inventory Item" : "Update Inventory Item"}
            </DialogTitle>
            <DialogDescription>
              Fill in the inventory details below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Client Option Toggle */}
            {/* <div className="mb-4">
              <Label className="block mb-1">Client Option (Yes/No)</Label>
              <Select
                value={watch("hasClientOption") ? "yes" : "no"}
                onValueChange={(value) => {
                  const hasClient = value === "yes";
                  setValue("hasClientOption", hasClient);
                  if (!hasClient) {
                    setValue("productClientId", "");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Client Selection (Conditional) */}
            {/* {watch("hasClientOption") && (
              <div className="mb-4">
                <Label htmlFor="productClientId" className="block mb-1">
                  Product Client
                </Label>
                <Select
                  value={watch("productClientId") || ""}
                  onValueChange={(value) => setValue("productClientId", value)}
                >
                  <SelectTrigger id="productClientId">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.companyID} value={company.companyID!}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productClientId && (
                  <p className="text-red-500 text-sm mt-1">{errors.productClientId.message}</p>
                )}
              </div>
            )} */}
            {textFieldList.map((field) => (
              <div key={field.name} className="mb-4">
                <Label htmlFor={field.name} className="block mb-1">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type={field.type || "text"}
                  {...register(field.name as any, {
                    valueAsNumber: field.type === "number",
                    onChange: (e) => {
                      const { name, value } = e.target;
                      if (name === "productDescription") {
                        e.target.value = value.replace(/[^a-zA-Z0-9\s]/g, "");
                      }
                      // For number fields, valueAsNumber will handle the conversion.
                      // This regex check is still useful for immediate UI feedback.
                      if (field.type === "number") {
                        if (value && !/^\d*\.?\d*$/.test(value)) {
                          e.target.value = value.slice(0, -1);
                        }
                      }
                    }
                  })}
                />
                {errors[field.name as keyof typeof errors] && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any)[field.name]?.message}
                  </p>
                )}
              </div>
            ))}

            {/* Inventory Type Selection */}
            <div className="mb-4">
              <Label htmlFor="inventoryItemTypeId" className="block mb-1">
                Inventory Type
              </Label>
              <Select
                value={watch("inventoryItemTypeId") || ""}
                onValueChange={(value) => setValue("inventoryItemTypeId", value)}
              >
                <SelectTrigger id="inventoryItemTypeId">
                  <SelectValue placeholder="Select Inventory Type" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryTypes?.map((type) => (
                    <SelectItem key={type.inventoryItemTypeId} value={type.inventoryItemTypeId!}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.inventoryItemTypeId && (
                <p className="text-red-500 text-sm mt-1">{(errors as any).inventoryItemTypeId.message}</p>
              )}
            </div>
          </div>

          {/* Determine if checkboxes should be editable:
               - In "add" mode: always editable
               - In "update" mode: only editable if isInTransaction is true */}
          {(() => {
            const checkboxesDisabled = mode === "update" && !initialData?.isInTransaction;
            return (
              <>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {checkboxFieldList.map((field) => (
                    <div key={field.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.name}
                        checked={watch(field.name as any)}
                        disabled={checkboxesDisabled}
                        onCheckedChange={(checked) => {
                          if (!checkboxesDisabled) {
                            setValue(field.name as any, !!checked);
                          }
                        }}
                        className={checkboxesDisabled ? "opacity-50 cursor-not-allowed" : ""}
                      />
                      <Label
                        htmlFor={field.name}
                        className={checkboxesDisabled ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>

              </>
            );
          })()}

          <div className="mt-6 border-t pt-4">
            <Label className="block mb-2 font-semibold">Product Image (Optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
              className="mt-1"
            />
            {(imageBase64 || initialData?.imageUrl) && (
              <div className="mt-4 p-2 border rounded-md inline-block">
                <img
                  src={imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : initialData!.imageUrl!}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {mode === "add" ? "Submit" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
