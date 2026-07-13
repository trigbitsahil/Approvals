"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BillingItemService } from "@/api/services/BillingItemService";
import type { GetBillingItemDetailQueryResponse } from "@/api/models/GetBillingItemDetailQueryResponse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Receipt, Briefcase, DollarSign, Percent, FileText, Upload, Download, Loader2, Eye, File as FileIcon, Trash2, Scale, Maximize2, Package } from "lucide-react";
import { toast } from "sonner";
import { FilePreviewDialog } from "@/components/FilePreview";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import { DocumentsService } from "@/api/services/DocumentsService";
import { Input } from "@/components/ui/input";
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

const API_VERSION = "1";

export default function BillingItemDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const itemId = params.id as string;

  const [item, setItem] = useState<GetBillingItemDetailQueryResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentUrlListVM | null>(null);

  // Documents state
  const [documents, setDocuments] = useState<DocumentUrlListVM[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!itemId) return;
    try {
      const [billingDocs, imageDocs] = await Promise.all([
        DocumentsService.getApiVDocuments(API_VERSION, "Billing", itemId),
        DocumentsService.getApiVDocuments(API_VERSION, "BillingItem", itemId)
      ]);

      const combined = [
        ...(billingDocs.data || []),
        ...(imageDocs.data || [])
      ];

      const sorted = combined.sort((a: any, b: any) => {
        return new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime();
      });

      setDocuments(sorted);
    } catch (err) {
      console.error("Failed to load documents", err);
    }
  }, [itemId]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemId) return;

      setLoading(true);
      try {
        const response = await BillingItemService.getBillingItemById(itemId, API_VERSION);

        if (response?.data) {
          setItem(response.data);
        } else {
          setError("Billing item not found.");
        }
      } catch (err) {
        console.error("Failed to fetch billing item details", err);
        setError("Failed to load billing item details. Please try again.");
        toast.error("Failed to load billing item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
    fetchDocuments();
  }, [itemId, fetchDocuments]);

  const imageUrl = useMemo(() => {
    const imgDoc = [...documents].reverse().find(doc => doc.category === "BillingItem");
    return imgDoc ? (imgDoc.blobUrl || imgDoc.url || "") : "";
  }, [documents]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !itemId) return;

    setUploadingDoc(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      const commaIndex = result.indexOf(',');
      if (commaIndex === -1) return setUploadingDoc(false);

      const base64Content = result.substring(commaIndex + 1);

      try {
        const docCmd = {
          name: file.name,
          description: `Document for Billing Item`,
          content: base64Content,
          contentType: file.type || 'application/octet-stream',
          documentFileName: file.name,
          category: "Billing",
          categoryId: itemId,
          extension: `.${file.name.split('.').pop()}`,
        } as any;

        await DocumentsService.postApiVDocuments(API_VERSION, docCmd);
        toast.success("Document uploaded successfully");
        fetchDocuments();
      } catch (err) {
        toast.error("Failed to upload document");
        console.error(err);
      } finally {
        setUploadingDoc(false);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setUploadingDoc(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentClick = (doc: DocumentUrlListVM) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleDeleteClick = (docId: string) => {
    setDeletingDocId(docId);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingDocId) return;

    setIsDeleting(true);
    try {
      await DocumentsService.deleteDocumentUrl(deletingDocId, API_VERSION);
      toast.success("Document deleted successfully");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setDeletingDocId(null);
    }
  };

  const handleImageClick = () => {
    if (imageUrl) {
      setPreviewDoc({
        name: displayItem.billingDescription || "Billing Item Image",
        url: imageUrl,
        blobUrl: imageUrl,
        description: `Full view of ${displayItem.billingDescription}`
      });
      setIsPreviewOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading billing item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Billing Items
        </Button>
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900 mb-4">
              <Receipt className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">Billing Item Not Found</h3>
            <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-md">
              {error || "The billing item you are looking for does not exist or has been removed."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayItem = item as any;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-muted/60">
        <div className="space-y-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="-ml-3 h-8 text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {displayItem.billingDescription || "Unnamed Billing Item"}
              </h1>
              {displayItem.isVoided && (
                <Badge variant="destructive" className="uppercase text-[10px] tracking-wider font-semibold shadow-sm">Voided</Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-xl border border-muted/50 shadow-sm">
                <Receipt className="h-4 w-4 text-primary/70" />
                <span className="font-mono font-bold text-foreground/80">
                  {displayItem.itemNum || "No Item Number"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground opacity-60 leading-none mb-0.5">Created</span>
                <span className="text-xs font-semibold">
                  {displayItem.createdDate ? new Date(displayItem.createdDate).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image & Status */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="overflow-hidden shadow-sm border-muted">
            <div
              className={`aspect-square bg-muted/30 relative flex items-center justify-center p-6 border-b border-muted ${imageUrl ? 'group cursor-pointer' : ''}`}
              onClick={handleImageClick}
            >
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={displayItem.billingDescription || "Product Image"}
                    className="w-full h-full object-contain rounded-sm drop-shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/80 dark:bg-black/60 p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground opacity-60">
                  <Package className="h-16 w-16 mb-4 stroke-1" />
                  <span className="text-sm font-medium tracking-wide">NO IMAGE PROVIDED</span>
                </div>
              )}
            </div>
            <CardContent className="p-5 flex flex-wrap gap-2">
              <Badge variant={displayItem.isSalesTaxable ? "default" : "secondary"} className={!displayItem.isSalesTaxable ? "opacity-60" : ""}>
                Sales Taxable
              </Badge>
              <Badge variant={displayItem.isActiveRecord ? "default" : "secondary"} className={!displayItem.isActiveRecord ? "opacity-60" : ""}>
                Active Record
              </Badge>
              {/* <Badge variant={displayItem.isVoided ? "default" : "secondary"} className={!displayItem.isVoided ? "opacity-60" : ""}>
                Voided
              </Badge> */}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details & Information */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm border-muted">
            <CardHeader className="bg-muted/30 border-b border-muted py-4">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary/80" />
                Billing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b border-muted/50">
                <div className="p-5 flex items-start gap-4 hover:bg-muted/10 transition-colors">
                  <div className="bg-pink-500/10 p-2.5 rounded-lg text-pink-600 dark:text-pink-400">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider text-[11px]">UOM (Unit of Measure)</h4>
                    <p className="font-semibold text-lg">{displayItem.unitOfMeasure || "-"}</p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-muted/10 transition-colors">
                  <div className="bg-amber-500/10 p-2.5 rounded-lg text-amber-600 dark:text-amber-500">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider text-[11px]">Primary Sales Group</h4>
                    <p className="font-semibold text-lg">{displayItem.primarySalesGroup || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                <div className="p-5 flex items-start gap-4 hover:bg-muted/10 transition-colors">
                  <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider text-[11px]">Unit Price</h4>
                    <p className="font-semibold text-lg">
                      ${displayItem.saleUnitPrice !== undefined && displayItem.saleUnitPrice !== null ? displayItem.saleUnitPrice.toFixed(2) : "0.00"}
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-muted/10 transition-colors">
                  <div className="bg-indigo-500/10 p-2.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Percent className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider text-[11px]">Taxable Status</h4>
                    <p className="font-semibold text-lg">{displayItem.isSalesTaxable ? "Taxable" : "Non-Taxable"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="bg-muted/30 border-b border-muted py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-lg flex items-center">
                <FileIcon className="mr-2 h-5 w-5 text-primary/80" />
                Documents
              </CardTitle>
              <div className="relative w-full sm:w-auto">
                <Input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  onChange={handleFileUpload}
                  disabled={uploadingDoc}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.csv"
                />
                <Button size="sm" variant="outline" disabled={uploadingDoc} className="pointer-events-none w-full sm:w-auto">
                  {uploadingDoc ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploadingDoc ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {(() => {
                const billingDocs = documents.filter(doc => doc.category === "Billing");
                return billingDocs.length > 0 ? (
                  <div className="grid gap-3">
                    {billingDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded text-primary">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {doc.createdDate ? new Date(doc.createdDate).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleDocumentClick(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => window.open(doc.blobUrl || doc.url || "", "_blank")}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteClick((doc as any).documentUrlID || "")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground/60 flex flex-col items-center">
                    <FileIcon className="h-10 w-10 mb-2 opacity-50 stroke-1" />
                    <p className="text-sm font-medium">No documents uploaded.</p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="bg-muted/30 border-b border-muted py-4">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary/80" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {displayItem.notes ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 bg-muted/20 p-4 rounded-md border border-muted/50">
                  {displayItem.notes}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground/60 flex flex-col items-center">
                  <Receipt className="h-10 w-10 mb-2 opacity-50 stroke-1" />
                  <p className="text-sm font-medium">No notes provided for this item.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <FilePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        document={previewDoc}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document from the billing item record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 focus:ring-red-600"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
