"use client";
import { CompanyFormDialog } from "./CompanyForm"; // This is the single dialog component
import { CompanyDetailsDialog } from "./CompanyDetails";
import type { Company, CompanyFormData } from "./types";

interface CompanyCrudDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onAddCompany: (newCompany: CompanyFormData) => Promise<void>; // Ensure onAddCompany is awaited
  onUpdateCompany: (updatedCompany: Company) => Promise<void>; // Ensure onUpdateCompany is awaited
  selectedCompany: Company | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: (open: boolean) => void;
}

export function CompanyCrudDialogs({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  onAddCompany,
  onUpdateCompany,
  selectedCompany,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDetailsDialogOpen,
  setIsDetailsDialogOpen,
}: CompanyCrudDialogsProps) {
  const handleSaveCompany = async (companyData: CompanyFormData) => {
    // Make this async
    if (selectedCompany) {
      // If selectedCompany exists, it's an update operation
      await onUpdateCompany({ ...selectedCompany, ...companyData }); // Await the update
    } else {
      // Otherwise, it's a new company creation operation
      await onAddCompany(companyData); // Await the add
    }
  };

  return (
    <>
      {/* This is the ONE CompanyFormDialog instance */}
      <CompanyFormDialog
        // The dialog opens if either isCreateDialogOpen OR isEditDialogOpen is true
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (isCreateDialogOpen) setIsCreateDialogOpen(open);
          if (isEditDialogOpen) setIsEditDialogOpen(open);
          // The parent (app/page.tsx) handles clearing selectedCompany when dialog closes
        }}
        // If selectedCompany is null, the form will be empty (for Add).
        // If selectedCompany has data, the form will be pre-filled (for Edit).
        company={selectedCompany}
        onSave={handleSaveCompany}
      />
      {/* The CompanyDetailsDialog is separate as it's for viewing, not editing */}
      <CompanyDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        company={selectedCompany}
      />
    </>
  );
}
