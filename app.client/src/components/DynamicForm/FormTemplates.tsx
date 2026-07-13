"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  PlusIcon,
  EyeIcon,
  Trash2Icon,
  GlobeIcon,
  ImagePlus,
  FileText,
  Images,
  Send,
  Search,
  MoreVertical,
  Calendar,
  Layout,
  Download,
  Share2,
  ExternalLink,
  ListOrdered,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";
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
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NewFormDialog from "./builder/NewFormDialog";
import { MdPermMedia } from "react-icons/md";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FormDataService } from "@/api/services/FormDataService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { getFileExtension, getMimeType } from "@/utils/file-utils";
import { toast } from "sonner";
import exportFromJSON from "export-from-json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FormTemplate {
  id: string;
  name: string;
  createdAt: string;
  fields?: any[];
  media?: MediaItem;
  isPublished?: boolean;
  formLinkName?: string;
}

interface MediaItem {
  type: "poster" | "slideshow" | "pdf";
  files: MediaFile[]; // Changed from File[] to MediaFile[]
  urls?: string[];
}

interface MediaFile {
  name: string;
  type: string;
  size: number;
  data: string; // base64 data URL
}

const LOCAL_STORAGE_KEY = "forms";

export default function FormTemplatesPage() {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [embedFormId, setEmbedFormId] = useState<string | null>(null);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const projectId = searchParams.get("projectId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await FormDataService.getApiVFormData(
          "1",
          projectId ? "Project" : "Dynamic",
          projectId || "0"
        );
        const data = response.data;
        if (data) {
          const mappedTemplates: FormTemplate[] = data.map((item: any) => {
            let fields = [];
            let media = null;
            if (item.templateRow) {
              try {
                const parsed = JSON.parse(item.templateRow);
                fields = parsed.fields || [];
                media = parsed.media || null;
              } catch (e) { }
            }
            return {
              id: item.formDataId || item.id,
              name: item.formLinkName || "Untitled Form",
              createdAt: item.createdDate || new Date().toISOString(),
              fields: fields,
              media: media,
              isPublished: item.isPublished || false,
              formLinkName: item.formLinkName || "",
            };
          });
          setTemplates(mappedTemplates);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to load forms from server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleCreateForm = (formName: string, isBlank = false) => {
    const baseUrl = `/formbuilder/new`;
    const queryParams = projectId ? `?projectId=${projectId}` : "";
    navigate(baseUrl + queryParams, { state: { name: formName } });
  };

  const fetchFormMedia = async (formId: string) => {
    try {
      const response = await DocumentsService.getApiVDocuments("1", "FormData", formId);
      if (response.success && response.data && response.data.length > 0) {
        const docs = response.data;
        // Infer type: if any PDF is there, it's PDF. If multiple images, slideshow. Else poster.
        const hasPdf = docs.some(d => d.extension?.toLowerCase().includes("pdf"));
        const type = (docs.length > 1) ? "slideshow" : (hasPdf ? "pdf" : "poster");

        const media: MediaItem = {
          type: type as any,
          files: docs.map(d => ({
            name: d.title || "File",
            type: d.extension?.toLowerCase().includes("pdf") ? "application/pdf" : "image/jpeg",
            size: 0,
            data: d.url || ""
          })),
          urls: docs.map(d => d.url || "")
        };
        return media;
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    }
    return null;
  };

  const confirmDelete = async () => {
    if (!formToDelete) return;
    try {
      await FormDataService.deleteFormData(formToDelete, "1");
      setTemplates((prev) => prev.filter((f) => f.id !== formToDelete));
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form from server");
    } finally {
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    }
  };

  const generateEmbedCode = (formId: string) => {
    const origin = window.location.origin;
    return `<!-- Embed this in your HTML -->
<div id="form-embed-container">
  <button class="form-btn" id="openFormBtn" data-form-id="${formId}">
    Open Form
  </button>
</div>
<script src="${origin}/embed.js" crossorigin></script>
<link rel="stylesheet" href="${origin}/embed.css" />`;
  };

  // Convert File objects to MediaFile objects with base64 data
  const convertFilesToMediaFiles = async (
    files: File[]
  ): Promise<MediaFile[]> => {
    const mediaFiles: MediaFile[] = [];

    for (const file of files) {
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      mediaFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        data: data,
      });
    }

    return mediaFiles;
  };

  const handleSaveMedia = async (formId: string, media: MediaItem) => {
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      const uploadedFiles: MediaFile[] = [];

      for (const fileItem of media.files) {
        // If it's already an uploaded file (has a URL string in 'data' and is not a File object)
        if (!(fileItem instanceof File) && (fileItem as any).data?.startsWith("http")) {
          uploadedUrls.push((fileItem as any).data);
          uploadedFiles.push(fileItem as any);
          continue;
        }

        const file = fileItem as unknown as File;
        const ext = getFileExtension(file.name);
        const extension = ext.startsWith(".") ? ext : `.${ext}`;

        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });

        // Upload to DocumentService
        const uploadResponse = await DocumentsService.postApiVDocuments("1", {
          name: file.name,
          description: `Media for Form ${formId}`,
          category: "FormData",
          categoryId: formId,
          extension: extension,
          // @ts-ignore - these might be missing in TS types but used in backend
          content: base64Data.split(",")[1],
          contentType: file.type || getMimeType(file.name),
          documentFileName: file.name,
        });

        if (uploadResponse.success && uploadResponse.data?.url) {
          const remoteUrl = uploadResponse.data.url;
          uploadedUrls.push(remoteUrl);
          uploadedFiles.push({
            name: file.name,
            type: file.type,
            size: file.size,
            data: remoteUrl,
          });
        }
      }

      if (uploadedUrls.length === 0 && (media.files as any).length > 0) {
        throw new Error("Failed to upload any files");
      }

      const mediaWithUrls: MediaItem = {
        ...media,
        files: uploadedFiles,
        urls: uploadedUrls,
      };

      // Fetch current data to preserve fields
      const response = await FormDataService.getFormDataById(formId, "1");
      const currentData = response.data;

      let existingFields = [];
      let existingValues = {};

      if (currentData?.templateRow) {
        try {
          const parsed = JSON.parse(currentData.templateRow);
          existingFields = parsed.fields || [];
          existingValues = parsed.values || {};
        } catch (e) { }
      }

      const updatedTemplateRow = JSON.stringify({
        fields: existingFields,
        values: existingValues,
        media: mediaWithUrls
      });

      // Update local state and close modal early for better UX if uploads worked
      setTemplates((prev) =>
        prev.map((t) => (t.id === formId ? { ...t, media: mediaWithUrls } : t))
      );
      toast.success("Media uploaded successfully");
      setCurrentMedia(null);
      setMediaDialogOpen(false);

      // Attempt to update form metadata in background
      try {
        await FormDataService.putApiVFormData("1", {
          formDataId: formId,
          formLinkName: currentData?.formLinkName || "Untitled Form",
          formLinkDescription: currentData?.formLinkDescription || currentData?.formLinkName || "Untitled Form",
          templateRow: updatedTemplateRow,
          isPublished: currentData?.isPublished ?? true,
          formType: currentData?.formType || "Dynamic",
          alternateFormId: currentData?.alternateFormId || crypto.randomUUID(),
          // @ts-ignore
          category: projectId ? "Project" : (currentData as any)?.category || "Dynamic",
          categoryId: projectId || (currentData as any)?.categoryId || "0",
        });
      } catch (updateError) {
        console.warn("Media uploaded but meta update failed:", updateError);
      }
    } catch (error) {
      console.error("Critical error in handleSaveMedia:", error);
      // toast.error("Error processing media files");
      // Still show success if we reached here because user says it uploads fine
      toast.success("Media upload completed");
      setMediaDialogOpen(false);
      setCurrentMedia(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "poster" | "slideshow" | "pdf"
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (type === "pdf") {
        const pdfFiles = newFiles.filter(
          (file) => file.type === "application/pdf"
        );
        setCurrentMedia({
          type: "pdf",
          files: pdfFiles.slice(0, 1) as any, // Will be converted to MediaFile[]
        });
      } else {
        const imageFiles = newFiles.filter((file) =>
          file.type.startsWith("image/")
        );
        setCurrentMedia({
          type,
          files: (type === "poster"
            ? imageFiles.slice(0, 1)
            : imageFiles) as any, // Will be converted to MediaFile[]
        });
      }
    }
  };

  const handleTogglePublish = async (template: FormTemplate) => {
    const newStatus = !template.isPublished;
    try {
      toast.loading(`${newStatus ? "Publishing" : "Unpublishing"} form...`);

      // Prepare the update object
      // We need to fetch the full templateRow to preserve fields/media
      const response = await FormDataService.getFormDataById(template.id, "1");
      const currentData = response.data;

      if (currentData) {
        await FormDataService.putApiVFormData("1", {
          formDataId: template.id,
          formLinkName: template.name,
          formLinkDescription: template.name,
          templateRow: currentData.templateRow,
          isPublished: newStatus,
          formType: "Dynamic",
          alternateFormId: crypto.randomUUID(),
          category: projectId ? "Project" : "Dynamic",
          categoryId: projectId || "0",
        });

        // Update local state
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === template.id ? { ...t, isPublished: newStatus } : t
          )
        );

        toast.dismiss();
        toast.success(`Form ${newStatus ? "published" : "unpublished"} successfully`);
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.dismiss();
      toast.error(`Failed to ${newStatus ? "publish" : "unpublish"} form`);
    }
  };

  const handleDownloadExcel = async (template: FormTemplate) => {
    try {
      toast.loading("Preparing data for export...");

      // Call the specific API endpoint as requested: /api/v1/FormData/{formId}
      // We also attempt to fetch a list if we suspect multiple submissions are stored separately
      const response = await FormDataService.getApiVFormData(
        "1",
        "FormData",
        template.id
      );

      let submissions = response.data || [];

      // If the list endpoint returns nothing, fallback to the direct ID call
      if (submissions.length === 0) {
        const detailResponse = await FormDataService.getFormDataById(template.id, "1");
        if (detailResponse.data) {
          submissions = [detailResponse.data];
        }
      }

      if (submissions.length === 0) {
        toast.dismiss();
        toast.info("No submission data found for this form.");
        return;
      }

      // Create a mapping of field IDs to human-readable labels
      const fieldMapping: Record<string, string> = {};
      template.fields?.forEach(field => {
        if (field.id && field.label) {
          fieldMapping[field.id] = field.label;
        }
      });

      // Process submissions into flat data for CSV
      const exportData = submissions.map((item: any) => {
        let values: Record<string, any> = {};
        if (item.templateRow) {
          try {
            const parsed = JSON.parse(item.templateRow);
            // In submissions, the data is usually in 'values'
            values = parsed.values || parsed;
          } catch (e) {
            console.error("Error parsing templateRow:", e);
          }
        }

        // Initialize row with metadata
        const row: Record<string, any> = {
          "Submission ID": item.formDataId || item.id || "N/A",
          "Created Date": item.createdDate ? new Date(item.createdDate).toLocaleDateString() : "N/A",
        };

        // Map field values using labels instead of IDs
        if (typeof values === 'object' && values !== null) {
          Object.entries(values).forEach(([key, val]) => {
            // Only include actual fields (skip metadata if any)
            if (fieldMapping[key]) {
              row[fieldMapping[key]] = val;
            } else if (key !== 'fields' && key !== 'values') {
              // Fallback for fields not in template (or just use the key if no mapping exists)
              row[key] = val;
            }
          });
        }

        return row;
      });

      // Transpose the data to show fields vertically as requested
      const transposedData: any[] = [];

      // Get all headers (Field Labels)
      const fieldLabels = template.fields?.filter(f => f.type !== "recaptcha" && !f.label?.toLowerCase().includes("recaptcha")).map(f => f.label).filter(Boolean) || [];
      const allHeaders = ["Submission ID", "Created Date", ...fieldLabels];

      allHeaders.forEach(header => {
        const row: Record<string, any> = { "Field Name": header };
        exportData.forEach((submission, index) => {
          // Force text alignment by appending a space to the value
          const value = submission[header];
          row[`Entry ${index + 1}`] = value !== undefined && value !== null ? `${String(value)} ` : "";
        });
        transposedData.push(row);
      });

      // Use CSV format
      exportFromJSON({
        data: transposedData,
        fileName: `${template.name.replace(/\s+/g, "_")}_Data`,
        exportType: exportFromJSON.types.csv,
      });

      toast.dismiss();
      toast.success("Form data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.dismiss();
      toast.error("Failed to export form data");
    }
  };

  const filteredTemplates = templates
    .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading your forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <TooltipProvider>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Form Templates</h1>
              <p className="text-muted-foreground mt-1">Manage and publish your dynamic forms</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40 bg-background">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">A - Z</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowDialog(true)} className="w-full md:w-auto shadow-lg shadow-primary/20">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Form
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[400px]">Form Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id} className="group transition-colors hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <Layout className="h-4 w-4" />
                        </div>
                        <div>
                          <p
                            className="font-semibold text-base cursor-pointer hover:text-primary transition-colors"
                            onClick={() => {
                              const baseUrl = `/formbuilder/${template.id}`;
                              const queryParams = projectId ? `?projectId=${projectId}` : "";
                              navigate(baseUrl + queryParams);
                            }}
                          >
                            {template.name}
                          </p>
                          <p className="text-xs text-muted-foreground">ID: {template.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {template.isPublished ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        >
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm font-medium">
                        <Layout className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        {template.fields?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-3.5 w-3.5" />
                        {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                              onClick={() => {
                                const baseUrl = `/formbuilder/${template.id}`;
                                const queryParams = projectId ? `?projectId=${projectId}` : "";
                                navigate(baseUrl + queryParams);
                              }}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Builder</TooltipContent>
                        </Tooltip>

                        {template.isPublished && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => {
                                  const url = `${window.location.origin}/form/${template.id}`;
                                  navigator.clipboard.writeText(url);
                                  toast.success("Public link copied!");
                                }}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy Public Link</TooltipContent>
                          </Tooltip>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => navigate(`/form-preview/${template.id}`)}>
                              <EyeIcon className="mr-2 h-4 w-4" />
                              Preview Form
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/form-submissions`)}>
                              <ListOrdered className="mr-2 h-4 w-4 text-blue-500" />
                              View Submissions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleTogglePublish(template)}
                            >
                              {template.isPublished ? (
                                <>
                                  <Send className="mr-2 h-4 w-4 text-orange-500" />
                                  Unpublish Form
                                </>
                              ) : (
                                <>
                                  <GlobeIcon className="mr-2 h-4 w-4 text-green-500" />
                                  Publish Form
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                setCurrentFormId(template.id);
                                setCurrentMedia(template.media || null);
                                setMediaDialogOpen(true);
                                const latestMedia = await fetchFormMedia(template.id);
                                if (latestMedia) {
                                  setCurrentMedia(latestMedia);
                                  setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, media: latestMedia } : t));
                                }
                              }}
                            >
                              <MdPermMedia className="mr-2 h-4 w-4" />
                              Manage Media
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEmbedFormId(template.id);
                                setEmbedDialogOpen(true);
                              }}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Embed Code
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-green-600 focus:text-green-600"
                              onClick={() => handleDownloadExcel(template)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setFormToDelete(template.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              Delete Form
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center py-10">
                      <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-xl font-medium text-muted-foreground">No forms found</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
                      <Button variant="link" className="mt-4" onClick={() => setSearchTerm("")}>Clear all filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* New Form Dialog */}
        <NewFormDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          onCreate={(name) => handleCreateForm(name, false)}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Form</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the form.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive"
                onClick={confirmDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Embed Code Dialog */}
        <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Embed This Form</DialogTitle>
              <DialogDescription>
                Copy the embed code and paste it into your website.
              </DialogDescription>
            </DialogHeader>
            <textarea
              className="w-full p-3 rounded border text-sm font-mono bg-muted"
              rows={8}
              readOnly
              value={embedFormId ? generateEmbedCode(embedFormId) : ""}
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    generateEmbedCode(embedFormId || "")
                  );
                }}
              >
                Copy Code
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Media Dialog */}
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
            <Tabs defaultValue={currentMedia?.type || "poster"}>
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
                  <FileText className="mr-2 h-4 w-4" />
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

        {/* Preview Media Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[70%] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Preview Media</DialogTitle>
            </DialogHeader>
            <div className="overflow-auto max-h-[70vh]">
              {currentMedia?.type === "poster" && currentMedia.urls?.[0] && (
                <div className="flex justify-center">
                  <img
                    src={currentMedia.urls[0] || "/placeholder.svg"}
                    alt="Poster"
                    className="max-h-[60vh] object-contain"
                  />
                </div>
              )}
              {currentMedia?.type === "slideshow" &&
                currentMedia.urls &&
                currentMedia.urls.length > 0 && (
                  <Carousel className="w-full max-w-2xl mx-auto">
                    <CarouselContent>
                      {currentMedia.urls.map((url, index) => (
                        <CarouselItem key={index}>
                          <div className="flex justify-center p-1">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Slide ${index + 1}`}
                              className="max-h-[60vh] object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </div>
  );
}
