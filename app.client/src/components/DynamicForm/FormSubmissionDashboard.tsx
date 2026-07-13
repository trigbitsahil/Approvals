"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FormSubmissionService } from "@/api/services/FormSubmissionService";
import { FormDataService } from "@/api/services/FormDataService";
import type { FormSubmissionListVM } from "@/api/models/FormSubmissionListVM";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Eye,
  FileJson,
  Calendar,
  MoreVertical,
  Download,
  ImagePlus,
  Images,
  FileText as FileTextIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion } from "framer-motion";
import exportFromJSON from "export-from-json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdPermMedia as MdMediaIcon } from "react-icons/md";
import { getFileExtension, getMimeType } from "@/utils/file-utils";
import { DocumentsService } from "@/api/services/DocumentsService";

interface MediaFile {
  name: string;
  type: string;
  size: number;
  data: string; // base64 data URL
}

interface MediaItem {
  type: "poster" | "slideshow" | "pdf";
  files: MediaFile[];
  urls?: string[];
}

export default function FormSubmissionDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<FormSubmissionListVM[]>([]);
  const [formMetadata, setFormMetadata] = useState<Record<string, { name: string; emailFieldId?: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Media Management States
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formFieldsMap, setFormFieldsMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await FormSubmissionService.getApiVFormSubmission("1");
        if (response.success && response.data) {
          setSubmissions(response.data);

          const uniqueFormIds = Array.from(new Set(response.data.map(s => s.formDataId).filter(Boolean)));
          const metadata: Record<string, { name: string; emailFieldId?: string }> = {};
          const fieldsMap: Record<string, any[]> = {};

          await Promise.all(uniqueFormIds.map(async (id) => {
            if (!id) return;
            try {
              const formResp = await FormDataService.getFormDataById(id, "1");
              if (formResp.success && formResp.data) {
                let emailFieldId = undefined;
                let fields: any[] = [];
                if (formResp.data.templateRow) {
                  try {
                    const parsed = JSON.parse(formResp.data.templateRow);
                    fields = parsed.fields || [];
                    const emailField = fields.find((f: any) =>
                      f.type === "email" ||
                      f.label?.toLowerCase().includes("email")
                    );
                    emailFieldId = emailField?.id;
                  } catch (e) {
                    console.error("Error parsing templateRow for ID:", id, e);
                  }
                }
                metadata[id] = {
                  name: formResp.data.formLinkName || "Untitled Form",
                  emailFieldId
                };
                fieldsMap[id] = fields;
              }
            } catch (e) {
              console.warn("Failed to fetch form metadata for ID:", id);
            }
          }));

          setFormMetadata(metadata);
          setFormFieldsMap(fieldsMap);
        } else {
          setError(response.message || "Failed to load submissions");
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Error loading submissions from the server.");
        toast.error("Failed to fetch form submissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleExportAllData = async () => {
    if (submissions.length === 0) {
      toast.info("No submissions to export");
      return;
    }

    try {


      // 1. Collect all unique field labels to use as columns
      const allFields = new Set<string>();
      submissions.forEach(sub => {
        if (sub.formDataId && formFieldsMap[sub.formDataId]) {
          formFieldsMap[sub.formDataId].forEach(f => {
            if (f.label && f.type !== "recaptcha" && f.type !== "image") {
              allFields.add(f.label);
            }
          });
        }
      });

      const fieldLabels = Array.from(allFields);

      // 2. Map each submission to a row
      const exportData = submissions.map(sub => {
        let submittedBy = sub.createdBy || "Anonymous";

        // Try to get email from metadata if available
        if (sub.formDataId && sub.jsonData) {
          const meta = formMetadata[sub.formDataId];
          if (meta?.emailFieldId) {
            try {
              const data = JSON.parse(sub.jsonData);
              const email = data[meta.emailFieldId];
              if (email) submittedBy = email;
            } catch (e) { }
          }
        }

        const row: Record<string, any> = {
          "Form Name": sub.formDataId ? (formMetadata[sub.formDataId]?.name || "N/A") : "N/A",
          "Submitted By": submittedBy,
          "Date": sub.createdDate ? format(new Date(sub.createdDate), "yyyy-MM-dd HH:mm") : "N/A",
        };

        // Initialize all fields with empty string
        fieldLabels.forEach(label => {
          row[label] = "";
        });

        // Fill in values if present
        if (sub.jsonData && sub.formDataId) {
          try {
            const values = JSON.parse(sub.jsonData);
            const fields = formFieldsMap[sub.formDataId] || [];

            Object.entries(values).forEach(([fieldId, val]) => {
              const field = fields.find(f => f.id === fieldId);
              if (field && field.label && field.type !== "image") {
                row[field.label] = val !== undefined && val !== null ? `${String(val)} ` : "";
              }
            });
          } catch (e) {
            console.error("Error parsing jsonData for export", e);
          }
        }

        return row;
      });

      exportFromJSON({
        data: exportData,
        fileName: `All_Submissions_${format(new Date(), "yyyy-MM-dd")}`,
        exportType: exportFromJSON.types.csv,
      });

      toast.dismiss();
      toast.success("Data exported successfully!");
    } catch (e) {
      console.error("Global export error:", e);
      toast.dismiss();
      toast.error("Failed to export all data");
    }
  };

  const fetchFormMedia = async (formId: string) => {
    try {
      const response = await DocumentsService.getApiVDocuments("1", "FormData", formId);
      if (response.success && response.data && response.data.length > 0) {
        const docs = response.data;
        const hasPdf = docs.some(d => d.extension?.toLowerCase().includes("pdf"));
        const type = (docs.length > 1) ? "slideshow" : (hasPdf ? "pdf" : "poster");

        return {
          type: type as any,
          files: docs.map(d => ({
            name: d.name || "File",
            type: d.extension?.toLowerCase() === "pdf" ? "application/pdf" : "image/jpeg",
            size: 0,
            data: d.url || d.blobUrl || ""
          })),
          urls: docs.map(d => d.url || d.blobUrl || "").filter(url => !!url)
        };
      }
      return null;
    } catch (e) {
      console.error("Error fetching media:", e);
      return null;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "poster" | "slideshow" | "pdf"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: MediaFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      newFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        data: data,
      });
    }

    setCurrentMedia({
      type,
      files: type === "slideshow" ? [...(currentMedia?.files || []), ...newFiles] : newFiles,
    });
  };

  const handleSaveMedia = async (formId: string, media: MediaItem) => {
    setIsUploading(true);
    try {
      // 1. First, delete existing documents for this form to "update"
      try {
        const existingDocs = await DocumentsService.getApiVDocuments("1", "FormData", formId);
        if (existingDocs.success && existingDocs.data) {
          await Promise.all(existingDocs.data.map(doc =>
            DocumentsService.deleteApiVDocuments(doc.id!, "1")
          ));
        }
      } catch (e) { console.warn("Error clearing old media", e); }

      // 2. Upload new files
      const uploadedUrls: string[] = [];
      const uploadedFiles: any[] = [];

      for (const fileItem of media.files) {
        if (!(fileItem instanceof File) && (fileItem as any).data?.startsWith("http")) {
          uploadedUrls.push((fileItem as any).data);
          uploadedFiles.push(fileItem as any);
          continue;
        }

        const base64Data = fileItem.data;
        const ext = getFileExtension(fileItem.name);
        const extension = ext.startsWith(".") ? ext : `.${ext}`;

        const uploadResponse = await DocumentsService.postApiVDocuments("1", {
          name: fileItem.name,
          description: `Media for Form ${formId}`,
          category: "FormData",
          categoryId: formId,
          extension: extension,
          // @ts-ignore
          content: base64Data.split(",")[1],
          contentType: fileItem.type || getMimeType(fileItem.name),
          documentFileName: fileItem.name,
        });

        if (uploadResponse.success && uploadResponse.data?.url) {
          const remoteUrl = uploadResponse.data.url;
          uploadedUrls.push(remoteUrl);
          uploadedFiles.push({
            name: fileItem.name,
            type: fileItem.type,
            size: fileItem.size,
            data: remoteUrl,
          });
        }
      }

      const formResponse = await FormDataService.getFormDataById(formId, "1");
      if (formResponse.success && formResponse.data) {
        const form = formResponse.data;
        let templateData: any = {};
        if (form.templateRow) {
          try { templateData = JSON.parse(form.templateRow); } catch (e) { }
        }

        templateData.media = {
          type: media.type,
          files: uploadedFiles,
          urls: uploadedUrls
        };

        await FormDataService.putApiVFormData("1", {
          ...form,
          templateRow: JSON.stringify(templateData)
        });
      }

      toast.success("Media updated successfully!");
      setMediaDialogOpen(false);
      setCurrentMedia(null);
    } catch (error) {
      console.error("Error saving media:", error);
      toast.error("Failed to save media");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportData = async (sub: FormSubmissionListVM) => {
    try {
      toast.loading("Preparing submission data...");

      let fieldMapping: Record<string, string> = {};
      let fieldTypeMapping: Record<string, string> = {};

      if (sub.formDataId) {
        try {
          const formResponse = await FormDataService.getFormDataById(sub.formDataId, "1");
          if (formResponse.success && formResponse.data?.templateRow) {
            const parsedTemplate = JSON.parse(formResponse.data.templateRow);
            const fields = parsedTemplate.fields || [];
            fields.forEach((field: any) => {
              if (field.id && field.label) {
                fieldMapping[field.id] = field.label;
              }
              if (field.id && field.type) {
                fieldTypeMapping[field.id] = field.type;
              }
            });
          }
        } catch (err) {
          console.error("Error fetching form template for labels:", err);
        }
      }

      let values: Record<string, any> = {};
      if (sub.jsonData) {
        values = JSON.parse(sub.jsonData);
      }

      const transposedData: any[] = [];
      const metadata = [
        { label: "Submission ID", value: sub.formSubmissionId || "N/A" },
        { label: "Submitted By", value: sub.createdBy || "Anonymous" },
        { label: "Date", value: sub.createdDate ? format(new Date(sub.createdDate), "MMM dd, yyyy HH:mm") : "N/A" }
      ];

      metadata.forEach(meta => {
        transposedData.push({
          "Field Name": meta.label,
          "Entry": `${String(meta.value)} `
        });
      });

      Object.entries(values).forEach(([key, val]) => {
        const type = fieldTypeMapping[key] || "text";
        const label = fieldMapping[key] || key;

        if (key === "recaptcha" || type === "recaptcha" || label.toLowerCase().includes("recaptcha")) {
          return;
        }

        transposedData.push({
          "Field Name": label,
          "Entry": val !== undefined && val !== null ? `${String(val)} ` : ""
        });
      });

      const fileName = `Submission_${sub.formDataId || "data"}_${sub.formSubmissionId?.substring(0, 8)}`;

      exportFromJSON({
        data: transposedData,
        fileName: fileName,
        exportType: exportFromJSON.types.csv,
      });

      toast.dismiss();
      toast.success("Submission data exported successfully!");
    } catch (e) {
      console.error("Export error:", e);
      toast.dismiss();
      toast.error("Failed to export submission data");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-destructive font-semibold text-lg">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileJson className="h-7 w-7 text-primary" />
              Form Submissions
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all dynamic form submissions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Button
              onClick={handleExportAllData}
              variant="outline"
              className="w-full md:w-auto shadow-md border-primary/20 hover:bg-primary/5 text-primary"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold text-sm border border-primary/20">
              Total: {submissions.length}
            </div>
          </div>
        </div>


        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileJson className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-xl font-medium text-muted-foreground">No submissions found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Submissions will appear here once filled out</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[150px]">Submission ID</TableHead>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.formSubmissionId} className="group transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium text-muted-foreground">
                        {sub.formSubmissionId?.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-semibold">
                        {sub.formDataId ? (formMetadata[sub.formDataId]?.name || "Loading...") : "N/A"}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {(() => {
                          const meta = formMetadata[sub.formDataId || ""];
                          if (meta?.emailFieldId && sub.jsonData) {
                            try {
                              const data = JSON.parse(sub.jsonData);
                              const submittedEmail = data[meta.emailFieldId];
                              if (submittedEmail) return submittedEmail;
                            } catch (e) { }
                          }
                          return sub.createdBy || "Anonymous";
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {sub.createdDate ? format(new Date(sub.createdDate), "MMM dd, yyyy HH:mm") : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => navigate(`/form-preview/${sub.formDataId}`, { state: { submissionData: sub.jsonData } })}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview Submission
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                if (sub.formDataId) {
                                  setCurrentFormId(sub.formDataId);
                                  setMediaDialogOpen(true);
                                  const latestMedia = await fetchFormMedia(sub.formDataId);
                                  setCurrentMedia(latestMedia);
                                }
                              }}
                            >
                              <MdMediaIcon className="mr-2 h-4 w-4" />
                              Manage Media
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-green-600 focus:text-green-600"
                              onClick={() => handleExportData(sub)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </motion.div>

      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentMedia ? "Edit Media" : "Add Media"}
            </DialogTitle>
            <DialogDescription>
              {currentMedia
                ? "Update the media files for your form"
                : "Upload media files for your form"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={currentMedia?.type || "poster"} onValueChange={(v) => setCurrentMedia(prev => prev ? { ...prev, type: v as any } : { type: v as any, files: [] })}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="poster">
                <ImagePlus className="mr-2 h-4 w-4" />
                Poster
              </TabsTrigger>
              <TabsTrigger value="slideshow">
                <Images className="mr-2 h-4 w-4" />
                Slideshow
              </TabsTrigger>
              <TabsTrigger value="pdf">
                <FileTextIcon className="mr-2 h-4 w-4" />
                PDF
              </TabsTrigger>
            </TabsList>
            <TabsContent value="poster">
              <div className="space-y-4 py-4">
                <Label>Upload a single image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "poster")}
                  multiple={false}
                />
                {currentMedia?.type === "poster" &&
                  currentMedia.files.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {currentMedia.files[0].name}
                    </div>
                  )}
              </div>
            </TabsContent>
            <TabsContent value="slideshow">
              <div className="space-y-4 py-4">
                <Label>Upload multiple images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "slideshow")}
                  multiple
                />
                {currentMedia?.type === "slideshow" &&
                  currentMedia.files.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Selected {currentMedia.files.length} images
                    </div>
                  )}
              </div>
            </TabsContent>
            <TabsContent value="pdf">
              <div className="space-y-4 py-4">
                <Label>Upload a PDF file</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "pdf")}
                  multiple={false}
                />
                {currentMedia?.type === "pdf" &&
                  currentMedia.files.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {currentMedia.files[0].name}
                    </div>
                  )}
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setMediaDialogOpen(false);
                setCurrentMedia(null);
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (currentMedia && currentFormId) {
                  handleSaveMedia(currentFormId, currentMedia);
                }
              }}
              disabled={
                !currentMedia || currentMedia.files.length === 0 || isUploading
              }
            >
              {isUploading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
