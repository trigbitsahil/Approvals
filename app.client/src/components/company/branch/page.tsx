"use client";
import { useState, useEffect } from "react";
import { MapPin, Plus, AlertCircle, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BranchListingTable } from "@/components/company/branch/BranchListing";
import { BranchCrudDialogs } from "@/components/company/branch/BranchCrud";
import type { Branch, BranchFormData } from "@/components/company/branch/types";
import { CompanySiteService } from "@/api/services/CompanySiteService";
import { CompanyService } from "@/api/services/CompanyService";
import { useNavigate, useParams } from "react-router-dom";

type BranchManagementPageProps = {};

export default function BranchManagementPage() {
  const navigate = useNavigate();
  const params = useParams();
  const companyId = params?.companyId as string;

  const [branches, setBranches] = useState<Branch[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [branchToDeleteId, setBranchToDeleteId] = useState<string | null>(null);

  if (!companyId) {
    return <div>Company ID not found</div>;
  }

  // Load company details
  const loadCompanyDetails = async () => {
    try {
      const response = await CompanyService.getCompanyById(companyId, "1.0");
      if (response.data) {
        setCompanyName(response.data.name || "Unknown Company");
      }
    } catch (e) {
      console.error("Failed to load company details:", e);
      setError("Failed to load company details.");
    }
  };

  // Load branches from API (filtered by companyId)
  const loadBranches = async () => {
    try {
      setIsLoading(true);
      const response = await CompanySiteService.getApiVCompanySite("1.0");
      // Filter branches by companyId
      const filteredBranches = (response.data || []).filter(
        (branch: Branch) => branch.companyId === companyId
      );
      setBranches(filteredBranches);
      setError("");
    } catch (e) {
      console.error("Failed to load branches:", e);
      setError("Failed to load branch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadCompanyDetails();
    loadBranches();
  }, [companyId]);

  const handleAddBranch = async (newBranchData: BranchFormData) => {
    try {
      setIsLoading(true);
      const response = await CompanySiteService.postApiVCompanySite("1.0", {
        companySiteId: newBranchData.companySiteId,
        companyId: companyId, // Ensure it's linked to the parent company
        name: newBranchData.name,
        description: newBranchData.description,
        email: newBranchData.email,
        phone: newBranchData.phone,
        website: newBranchData.website,
        addressLine1: newBranchData.addressLine1,
        addressLine2: newBranchData.addressLine2,
        city: newBranchData.city,
        stateId: newBranchData.stateId,
        countryId: newBranchData.countryId,
        zipCode: newBranchData.zipCode,
      });
      if (response.data) {
        await loadBranches();
        setError("");
      }
    } catch (e) {
      console.error("Failed to add branch:", e);
      setError("Failed to add branch. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBranch = async (updatedBranch: Branch) => {
    try {
      setIsLoading(true);
      const response = await CompanySiteService.putApiVCompanySite("1.0", {
        companySiteId: updatedBranch.companySiteId,
        companyId: updatedBranch.companyId,
        name: updatedBranch.name,
        description: updatedBranch.description,
        email: updatedBranch.email,
        phone: updatedBranch.phone,
        website: updatedBranch.website,
        addressLine1: updatedBranch.addressLine1,
        addressLine2: updatedBranch.addressLine2,
        city: updatedBranch.city,
        stateId: updatedBranch.stateId,
        countryId: updatedBranch.countryId,
        zipCode: updatedBranch.zipCode,
      });
      if (response.data) {
        await loadBranches();
        setError("");
        setSelectedBranch(null);
      }
    } catch (e) {
      console.error("Failed to update branch:", e);
      setError("Failed to update branch. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBranch = (branchId: string) => {
    setBranchToDeleteId(branchId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!branchToDeleteId) return;
    try {
      setIsLoading(true);
      const response = await CompanySiteService.deleteCompanySite(
        branchToDeleteId,
        "1.0"
      );
      if (response.data) {
        await loadBranches();
        setError("");
        setBranchToDeleteId(null);
        setIsConfirmDeleteDialogOpen(false);
      }
    } catch (e) {
      console.error("Failed to delete branch:", e);
      setError("Failed to delete branch. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsEditDialogOpen(true);
  };

  const openDetailsDialog = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-9xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="p-4 bg-primary/10 rounded-2xl shadow-md">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                Company Site Management
              </h1>
              <p className="text-muted-foreground text-md mt-1">
                Manage sites for {companyName}
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setSelectedBranch(null);
              setIsCreateDialogOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-xl transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Company Site
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-8 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg shadow-sm"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Branch Listing Table */}
        <BranchListingTable
          branches={branches}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={handleDeleteBranch}
          onDetails={openDetailsDialog}
          companyName={companyName}
        />

        {/* Branch CRUD Dialogs */}
        <BranchCrudDialogs
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          onAddBranch={handleAddBranch}
          onUpdateBranch={handleUpdateBranch}
          selectedBranch={selectedBranch}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isDetailsDialogOpen={isDetailsDialogOpen}
          setIsDetailsDialogOpen={setIsDetailsDialogOpen}
          companyId={companyId}
          companyName={companyName}
        />

        {/* Delete Confirmation AlertDialog */}
        <AlertDialog
          open={isConfirmDeleteDialogOpen}
          onOpenChange={setIsConfirmDeleteDialogOpen}
        >
          <AlertDialogContent className="rounded-xl shadow-2xl">
            <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                branch and remove its data from our records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-center gap-3 pt-4">
              <AlertDialogCancel className="bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
