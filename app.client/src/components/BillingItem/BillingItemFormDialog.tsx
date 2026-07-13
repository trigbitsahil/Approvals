"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
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
import * as yup from "yup";

const BillingItemValidationSchema = yup.object().shape({
    itemNum: yup.string().required("Item Num is required"),
    billingDescription: yup.string().required("Billing Description is required"),
    unitOfMeasure: yup.string().required("Unit of Measure is required"),
    // primarySalesGroup: yup.string().required("Primary Sales Group is required"),
    notes: yup.string().nullable(),
    saleUnitPrice: yup.number().nullable().min(0, "Price must be positive"),
    isSalesTaxable: yup.boolean().default(false),
    isActiveRecord: yup.boolean().default(true),
    isVoided: yup.boolean().default(false),
});

type BillingFormValues = {
    itemNum: string;
    billingDescription: string;
    notes?: string;
    unitOfMeasure: string;
    primarySalesGroup: string;
    saleUnitPrice?: number;
    isSalesTaxable: boolean;
    isActiveRecord: boolean;
    isVoided: boolean;
    imageFile?: {
        name: string;
        contentType: string;
        content: string;
    };
};

export const BillingItemFormDialog = ({
    mode = "add",
    onSubmit,
    open,
    setOpen,
    initialData,
}: {
    mode?: "add" | "update";
    onSubmit: (item: BillingFormValues) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<BillingFormValues>({
        resolver: yupResolver(BillingItemValidationSchema) as any,
        defaultValues: {
            itemNum: "",
            billingDescription: "",
            notes: "",
            unitOfMeasure: "",
            primarySalesGroup: "",
            saleUnitPrice: undefined,
            isSalesTaxable: false,
            isActiveRecord: true,
            isVoided: false,
            imageFile: undefined,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                itemNum: initialData.itemNum || "",
                billingDescription: initialData.billingDescription || "",
                notes: initialData.notes || "",
                unitOfMeasure: initialData.unitOfMeasure || "",
                primarySalesGroup: "-",
                saleUnitPrice: initialData.saleUnitPrice,
                isSalesTaxable: initialData.isSalesTaxable ?? false,
                isActiveRecord: initialData.isActiveRecord ?? true,
                isVoided: initialData.isVoided ?? false,
                imageFile: undefined,
            });
        } else {
            reset({
                itemNum: "",
                billingDescription: "",
                notes: "",
                unitOfMeasure: "",
                primarySalesGroup: "",
                saleUnitPrice: undefined,
                isSalesTaxable: false,
                isActiveRecord: true,
                isVoided: false,
                imageFile: undefined,
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: BillingFormValues) => {
        // Clean data before sending
        const cleanData = {
            itemNum: data.itemNum.trim(),
            billingDescription: data.billingDescription.trim(),
            notes: data.notes?.trim() || null,
            unitOfMeasure: data.unitOfMeasure.trim(),
            primarySalesGroup: "-",
            saleUnitPrice: data.saleUnitPrice || null,
            isSalesTaxable: data.isSalesTaxable,
            isActiveRecord: data.isActiveRecord,
            isVoided: data.isVoided,
            imageFile: data.imageFile,
        };

        onSubmit(cleanData);
        setOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[92vw] sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Create Billing Item" : "Update Billing Item"}
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the billing item details below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="itemNum">
                                Item Num <span className="text-red-500">*</span>
                            </Label>
                            <Input id="itemNum" {...register("itemNum")} className="mt-1" />
                            {errors.itemNum && <p className="text-red-500 text-sm mt-1">{errors.itemNum.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="billingDescription">
                                Billing Description <span className="text-red-500">*</span>
                            </Label>
                            <Input id="billingDescription" {...register("billingDescription")} className="mt-1" />
                            {errors.billingDescription && <p className="text-red-500 text-sm mt-1">{errors.billingDescription.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" {...register("notes")} className="mt-1" />
                        </div>

                        <div>
                            <Label htmlFor="unitOfMeasure">
                                Unit of Measure <span className="text-red-500">*</span>
                            </Label>
                            <Input id="unitOfMeasure" {...register("unitOfMeasure")} className="mt-1" />
                            {errors.unitOfMeasure && <p className="text-red-500 text-sm mt-1">{errors.unitOfMeasure.message}</p>}
                        </div>

                        {/* <div>
                            <Label htmlFor="primarySalesGroup">
                                Primary Sales Group <span className="text-red-500">*</span>
                            </Label>
                            <Input id="primarySalesGroup" {...register("primarySalesGroup")} className="mt-1" />
                            {errors.primarySalesGroup && <p className="text-red-500 text-sm mt-1">{errors.primarySalesGroup.message}</p>}
                        </div> */}

                        <div>
                            <Label htmlFor="saleUnitPrice">Sale Unit Price</Label>
                            <Input
                                id="saleUnitPrice"
                                type="number"
                                step="0.01"
                                {...register("saleUnitPrice", { valueAsNumber: true })}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="imageFile">Item Image (Optional)</Label>
                            <Input
                                id="imageFile"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            const base64 = reader.result as string;
                                            setValue("imageFile", {
                                                name: file.name,
                                                contentType: file.type || "image/jpeg",
                                                content: base64.substring(base64.indexOf(",") + 1),
                                            });
                                        };
                                        reader.readAsDataURL(file);
                                    } else {
                                        setValue("imageFile", undefined);
                                    }
                                }}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isSalesTaxable"
                                checked={watch("isSalesTaxable")}
                                onCheckedChange={(checked) => setValue("isSalesTaxable", !!checked)}
                            />
                            <Label htmlFor="isSalesTaxable">Sales Taxable</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActiveRecord"
                                checked={watch("isActiveRecord")}
                                onCheckedChange={(checked) => setValue("isActiveRecord", !!checked)}
                            />
                            <Label htmlFor="isActiveRecord">Active Record</Label>
                        </div>

                        {/* <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isVoided"
                                checked={watch("isVoided")}
                                onCheckedChange={(checked) => setValue("isVoided", !!checked)}
                            />
                            <Label htmlFor="isVoided">Voided</Label>
                        </div> */}
                    </div>

                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="bg-primary hover:bg-primary/80 text-white">
                            {mode === "add" ? "Create" : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};