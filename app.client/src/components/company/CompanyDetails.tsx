"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Hash,
  FileText,
} from "lucide-react";
import type { Company, Country, State } from "./types"; // Import types

interface CompanyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
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

export function CompanyDetailsDialog({
  open,
  onOpenChange,
  company,
}: CompanyDetailsDialogProps) {
  if (!company) return null;

  const getCountryName = (id: string) =>
    mockCountries.find((c) => c.id === id)?.name || id;
  const getStateName = (id: string) =>
    mockStates.find((s) => s.id === id)?.name || id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            Company Details
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Detailed information about {company.name}.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <div className="space-y-6 py-4">
          {/* Company IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Company Site ID
              </Label>
              <p className="text-base font-semibold">{company.companySiteId}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Company ID
              </Label>
              <p className="text-base font-semibold">{company.companyId}</p>
            </div>
          </div>
          <Separator />
          {/* Company Name & Description */}
          <div className="grid gap-1">
            <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Company Name
            </Label>
            <p className="text-base font-semibold">{company.name}</p>
          </div>
          {company.description && (
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Description
              </Label>
              <p className="text-base font-semibold">{company.description}</p>
            </div>
          )}
          <Separator />
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.email && (
              <div className="grid gap-1">
                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Email
                </Label>
                <p className="text-base font-semibold">{company.email}</p>
              </div>
            )}
            {company.phone && (
              <div className="grid gap-1">
                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Phone
                </Label>
                <p className="text-base font-semibold">{company.phone}</p>
              </div>
            )}
          </div>
          {company.website && (
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Website
              </Label>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-primary hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
          <Separator />
          {/* Address Information */}
          {company.addressLine1 && (
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Address Line 1
              </Label>
              <p className="text-base font-semibold">{company.addressLine1}</p>
            </div>
          )}
          <div className="grid gap-1">
            <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Address Line 2
            </Label>
            <p className="text-base font-semibold">{company.addressLine2}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                City
              </Label>
              <p className="text-base font-semibold">{company.city}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                State
              </Label>
              <p className="text-base font-semibold">
                {getStateName(company.stateId)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Country
              </Label>
              <p className="text-base font-semibold">
                {getCountryName(company.countryId)}
              </p>
            </div>
            {company.zipCode && (
              <div className="grid gap-1">
                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Zip Code
                </Label>
                <p className="text-base font-semibold">{company.zipCode}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
