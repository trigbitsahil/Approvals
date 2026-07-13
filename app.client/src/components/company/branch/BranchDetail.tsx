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
import { MapPin, Mail, Phone, Globe, Hash, FileText } from "lucide-react";
import type { Branch, Country, State } from "./types";

interface BranchDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
  companyName: string;
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

export function BranchDetailsDialog({
  open,
  onOpenChange,
  branch,
  companyName,
}: BranchDetailsDialogProps) {
  if (!branch) return null;

  const getCountryName = (id: string) =>
    mockCountries.find((c) => c.id === id)?.name || id;
  const getStateName = (id: string) =>
    mockStates.find((s) => s.id === id)?.name || id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            Branch Details
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Detailed information about {branch.name} branch of {companyName}.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <div className="space-y-6 py-4">
          {/* Branch IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Branch Site ID
              </Label>
              <p className="text-base font-semibold">{branch.companySiteId}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Company ID
              </Label>
              <p className="text-base font-semibold">{branch.companyId}</p>
            </div>
          </div>
          <Separator />

          {/* Branch Name & Description */}
          <div className="grid gap-1">
            <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Branch Name
            </Label>
            <p className="text-base font-semibold">{branch.name}</p>
          </div>
          {branch.description && (
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Description
              </Label>
              <p className="text-base font-semibold">{branch.description}</p>
            </div>
          )}
          <Separator />

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branch.email && (
              <div className="grid gap-1">
                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Email
                </Label>
                <p className="text-base font-semibold">{branch.email}</p>
              </div>
            )}
            {branch.phone && (
              <div className="grid gap-1">
                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Phone
                </Label>
                <p className="text-base font-semibold">{branch.phone}</p>
              </div>
            )}
          </div>
          {branch.website && (
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Website
              </Label>
              <a
                href={branch.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-primary hover:underline"
              >
                {branch.website}
              </a>
            </div>
          )}
          <Separator />

          {/* Address Information */}
          {branch.addressLine1 && (
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Address Line 1
              </Label>
              <p className="text-base font-semibold">{branch.addressLine1}</p>
            </div>
          )}
          <div className="grid gap-1">
            <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Address Line 2
            </Label>
            <p className="text-base font-semibold">{branch.addressLine2}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                City
              </Label>
              <p className="text-base font-semibold">{branch.city}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                State
              </Label>
              <p className="text-base font-semibold">
                {getStateName(branch.stateId || "")}
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
                {getCountryName(branch.countryId || "")}
              </p>
            </div>
            {branch.zipCode && (
              <div className="grid gap-1">
                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Zip Code
                </Label>
                <p className="text-base font-semibold">{branch.zipCode}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
