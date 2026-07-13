"use client";
import { BranchFormDialog } from "./BranchForm";
import { BranchDetailsDialog } from "./BranchDetail";
import type { Branch, BranchFormData } from "./types";

interface BranchCrudDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onAddBranch: (newBranch: BranchFormData) => Promise<void>;
  onUpdateBranch: (updatedBranch: Branch) => Promise<void>;
  selectedBranch: Branch | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: (open: boolean) => void;
  companyId: string;
  companyName: string;
}

export function BranchCrudDialogs({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  onAddBranch,
  onUpdateBranch,
  selectedBranch,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDetailsDialogOpen,
  setIsDetailsDialogOpen,
  companyId,
  companyName,
}: BranchCrudDialogsProps) {
  const handleSaveBranch = async (branchData: BranchFormData) => {
    if (selectedBranch) {
      await onUpdateBranch({ ...selectedBranch, ...branchData });
    } else {
      await onAddBranch(branchData);
    }
  };

  return (
    <>
      <BranchFormDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (isCreateDialogOpen) setIsCreateDialogOpen(open);
          if (isEditDialogOpen) setIsEditDialogOpen(open);
        }}
        branch={selectedBranch}
        onSave={handleSaveBranch}
        companyId={companyId}
        companyName={companyName}
      />

      <BranchDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        branch={selectedBranch}
        companyName={companyName}
      />
    </>
  );
}
