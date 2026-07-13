"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Hash,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { LocationCombobox } from "../Location";
import { companySchema } from "../Validation";
import type { Branch, BranchFormData, Country, State } from "./types";

interface BranchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: Branch | null;
  onSave: (data: BranchFormData) => Promise<void>;
  companyId: string; // The parent company ID
  companyName: string; // The parent company name for display
}

const mockCountries: Country[] = [
  { id: "US", name: "United States" },
  { id: "CA", name: "Canada" },
  { id: "GB", name: "United Kingdom" },
  { id: "AU", name: "Australia" },
  { id: "DE", name: "Germany" },
];

const mockStates: State[] = [
  { id: "NY", name: "New York", countryId: "US" },
  { id: "CA", name: "California", countryId: "US" },
  { id: "TX", name: "Texas", countryId: "US" },
  { id: "ON", name: "Ontario", countryId: "CA" },
  { id: "QC", name: "Quebec", countryId: "CA" },
  { id: "ENG", name: "England", countryId: "GB" },
  { id: "NSW", name: "New South Wales", countryId: "AU" },
  { id: "BY", name: "Bavaria", countryId: "DE" },
];

export function BranchFormDialog({
  open,
  onOpenChange,
  branch,
  onSave,
  companyId,
  companyName,
}: BranchFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BranchFormData>({
    resolver: yupResolver(companySchema),
    mode: "onChange",
  });

  const selectedCountryId = watch("countryId");
  const filteredStates = mockStates.filter(
    (state) => state.countryId === selectedCountryId
  );

  useEffect(() => {
    if (branch) {
      reset(branch);
    } else {
      reset({
        companySiteId: "",
        companyId: companyId, // Pre-fill with parent company ID
        name: "",
        description: "",
        email: "",
        phone: "",
        website: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateId: "",
        countryId: "",
        zipCode: "",
      });
    }
  }, [branch, reset, companyId]);

  const onSubmit = async (data: BranchFormData) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      onOpenChange(false);

      // Send WhatsApp message if phone and name are provided
      if (data.phone && data.name) {
        const payload = {
          phone: data.phone,
          name: data.name,
          email: data.email,
          siteId: data.companySiteId,
          address: data.addressLine1,
        };
        try {
          const response = await fetch(
            "http://localhost:3001/api/send-whatsapp",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
          const result = await response.json();
          console.log("WhatsApp API Response:", result);
        } catch (error) {
          console.error("Error sending WhatsApp message:", error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            {branch ? "Edit Site" : "Add Company Site"}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {branch
              ? "Update the details for this Site."
              : `Add a new Site for ${companyName}.`}
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label
                htmlFor="companySiteId"
                className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Company Site ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companySiteId"
                placeholder="Enter company site ID..."
                {...register("companySiteId")}
                className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              {errors.companySiteId && (
                <p className="text-red-500 text-sm">
                  {errors.companySiteId.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="companyId"
                className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Company ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyId"
                placeholder="Company ID..."
                {...register("companyId")}
                disabled={true} // Always disabled for branches
                className="h-11 rounded-lg border border-input bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label
              htmlFor="name"
              className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter company name..."
              {...register("name")}
              className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label
              htmlFor="description"
              className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter  description..."
              {...register("description")}
              className="min-h-[80px] rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label
                htmlFor="email"
                className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email..."
                {...register("email")}
                className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="Enter phone number..."
                {...register("phone")}
                className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label
              htmlFor="website"
              className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Website <span className="text-red-500">*</span>
            </Label>
            <Input
              id="website"
              placeholder="Enter website URL..."
              {...register("website")}
              className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.website && (
              <p className="text-red-500 text-sm">{errors.website.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label
              htmlFor="addressLine1"
              className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Address Line 1
            </Label>
            <Input
              id="addressLine1"
              placeholder="Enter address line 1..."
              {...register("addressLine1")}
              className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm">
                {errors.addressLine1.message}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <Label
              htmlFor="addressLine2"
              className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Address Line 2 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addressLine2"
              placeholder="Enter address line 2..."
              {...register("addressLine2")}
              className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            {errors.addressLine2 && (
              <p className="text-red-500 text-sm">
                {errors.addressLine2.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label
                htmlFor="city"
                className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Enter city..."
                {...register("city")}
                className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="countryId"
                className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Country <span className="text-red-500">*</span>
              </Label>
              <LocationCombobox
                value={watch("countryId")}
                onChange={(val) => {
                  setValue("countryId", val, { shouldValidate: true });
                  setValue("stateId", "");
                }}
                items={mockCountries}
                placeholder="Select country..."
                searchPlaceholder="Search countries..."
                icon={Globe}
              />
              {errors.countryId && (
                <p className="text-red-500 text-sm">
                  {errors.countryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label
                htmlFor="stateId"
                className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                State <span className="text-red-500">*</span>
              </Label>
              <LocationCombobox
                value={watch("stateId")}
                onChange={(val) =>
                  setValue("stateId", val, { shouldValidate: true })
                }
                items={filteredStates}
                placeholder="Select state..."
                searchPlaceholder="Search states..."
                icon={MapPin}
              />
              {errors.stateId && (
                <p className="text-red-500 text-sm">{errors.stateId.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label
                htmlFor="zipCode"
                className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Zip Code
              </Label>
              <Input
                id="zipCode"
                placeholder="Enter zip code..."
                {...register("zipCode")}
                className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              size="lg"
              className="bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200"
            >
              {isSubmitting
                ? branch
                  ? "Updating..."
                  : "Adding..."
                : branch
                  ? "Update Branch"
                  : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
