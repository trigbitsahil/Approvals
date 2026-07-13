"use client";
import { useEffect, useState } from "react";
import { SopService } from "@/api/services/SopService";
import { DepartmentService } from "@/api/services/DepartmentService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Download,
  Upload,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Check,
  File,
} from "lucide-react";
import { cn } from "@/utils/cn"; // Assuming cn is in utils/cn
import type { SopListVM } from "@/api/models/SopListVM";
import type { Department } from "@/api/models/Department";
import type { CreateDocumentUrlCommand } from "@/api/models/CreateDocumentUrlCommand";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import { getFileIcon, getFileExtension, getMimeType } from "@/utils/file-utils"; // Assuming these utilities exist
import { FilePreviewDialog } from "@/components/FilePreview"; // Corrected import

export default function SopPageEnhanced() {
  const [sops, setSops] = useState<SopListVM[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    []
  );
  const [error, setError] = useState("");
  const [editingSop, setEditingSop] = useState<SopListVM | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    departmentId: "",
    file: null as File | null,
  });
  const [fileBase64, setFileBase64] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingDocuments, setExistingDocuments] = useState<
    Record<string, DocumentUrlListVM[]>
  >({});
  const [departmentSearchOpen, setDepartmentSearchOpen] = useState(false);
  const [editDepartmentSearchOpen, setEditDepartmentSearchOpen] =
    useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] =
    useState<DocumentUrlListVM | null>(null);

  useEffect(() => {
    fetchSops();
    DepartmentService.getApiVDepartment("1.0")
      .then((res) => {
        const depts = res.data ?? [];
        setDepartments(depts);
        setFilteredDepartments(depts.slice(0, 10)); // Initial filter for performance
      })
      .catch(() => setError("Could not load departments list."));
  }, []);

  const fetchSops = () => {
    setIsLoading(true);
    SopService.getApiVSop("1")
      .then((res) => {
        const sopsData = (res.data as any)?.data ?? res.data ?? [];
        setSops(sopsData);
        const documentPromises = sopsData.map((sop: SopListVM) =>
          DocumentsService.getApiVDocuments("1", "Sop", sop.sopId)
            .then((docRes) => ({
              sopId: sop.sopId,
              documents: docRes.data ?? [],
            }))
            .catch(() => ({
              sopId: sop.sopId,
              documents: [],
            }))
        );
        Promise.all(documentPromises).then((results) => {
          const docsMap = results.reduce((acc, { sopId, documents }) => {
            acc[sopId] = documents;
            return acc;
          }, {} as Record<string, DocumentUrlListVM[]>);
          setExistingDocuments(docsMap);
        });
      })
      .catch(() => setError("Error loading SOPs. Please try again."))
      .finally(() => setIsLoading(false));
  };

  const resetForm = () => {
    setFormState({ name: "", description: "", departmentId: "", file: null });
    setFileBase64("");
    setUploadProgress(0);
    setIsUploading(false);
  };

  const DepartmentCombobox = ({
    value,
    onChange,
    open,
    setOpen,
    placeholder = "Select department...",
  }: {
    value: string;
    onChange: (val: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    placeholder?: string;
  }) => {
    const selectedDepartment = departments.find(
      (d) => d.departmentID === value
    );
    // Filter departments based on input for search
    const handleSearch = (search: string) => {
      const lowerCaseSearch = search.toLowerCase();
      setFilteredDepartments(
        departments.filter((dept) =>
          dept.name?.toLowerCase().includes(lowerCaseSearch)
        )
      );
    };
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 bg-background px-4 py-2 rounded-lg border border-input text-left shadow-sm transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" // Enhanced styling
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {selectedDepartment ? selectedDepartment.name : placeholder}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-lg shadow-lg" // Enhanced styling
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search departments..."
              className="h-9 px-4 py-2" // Enhanced styling
              onValueChange={handleSearch}
            />
            <CommandList>
              <CommandEmpty>No department found.</CommandEmpty>
              <CommandGroup>
                {filteredDepartments.map((dept) => (
                  <CommandItem
                    key={dept.departmentID}
                    value={dept.name}
                    onSelect={() => {
                      onChange(dept.departmentID);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground" // Enhanced styling
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {dept.departmentID?.slice(0, 20)}...
                        </div>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === dept.departmentID
                          ? "opacity-100 text-primary" // Highlight selected
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const handleFileChange = async (file: File | null) => {
    setFormState((p) => ({ ...p, file }));
    if (!file) {
      setFileBase64("");
      setUploadProgress(0);
      setIsUploading(false);
      return;
    }
    setError("");
    setIsUploading(true);
    setUploadProgress(0);
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };
    reader.onload = () => {
      setFileBase64(reader.result?.toString().split(",")[1] || "");
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setIsUploading(false);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    const { name, description, departmentId, file } = formState;
    if (!name.trim() || !description.trim() || !departmentId) {
      setError("Please fill in all required fields.");
      return;
    }
    if (file && isUploading) {
      setError("Please wait for the file to finish processing.");
      return;
    }
    setError(""); // Clear previous errors
    try {
      const sopRes = await SopService.postApiVSop("1", {
        name,
        description,
        departmentId,
      });
      const sopId =
        sopRes.data?.sopId ||
        (sopRes.data as any)?.data?.sopId ||
        (sopRes.data as any)?.data?.sopID;
      if (file && fileBase64 && sopId) {
        const ext = getFileExtension(file.name);
        const extension = ext.startsWith(".") ? ext : `.${ext}`;
        const docCmd: CreateDocumentUrlCommand = {
          name: file.name,
          description: `Document for ${name}`,
          content: fileBase64,
          category: "Sop",
          categoryId: sopId,
          extension: `.${getFileExtension(file.name)}`, // Ensure it starts with dot
          contentType: file.type || getMimeType(file.name), // Fallback to mime type detection
          documentFileName: file.name,
          // Remove the url field if not needed by the API
        };
        await DocumentsService.postApiVDocuments("1", docCmd);
      }
      resetForm();
      setIsCreateDialogOpen(false);
      fetchSops();
    } catch (error) {
      console.error("Create error:", error);
      setError("Failed to create SOP or upload document.");
    }
  };

  const handleEdit = (sop: SopListVM) => {
    setEditingSop(sop);
    setFormState({
      name: sop.name ?? "",
      description: sop.description ?? "",
      departmentId: (sop as any).departmentId ?? "",
      file: null,
    });
    setFileBase64("");
    setUploadProgress(0);
    setIsUploading(false);
    setError(""); // Clear errors when opening edit dialog
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingSop) return;
    const { name, description, departmentId, file } = formState;
    if (!name.trim() || !description.trim() || !departmentId) {
      setError("Please fill in all required fields.");
      return;
    }
    if (file && isUploading) {
      setError("Please wait for the file to finish processing.");
      return;
    }
    setError(""); // Clear previous errors
    try {
      await SopService.putApiVSop("1", {
        sopId: editingSop.sopId,
        name,
        description,
        departmentId,
      });
      if (file && fileBase64 && editingSop.sopId) {
        const ext = getFileExtension(file.name);
        const extension = ext.startsWith(".") ? ext : `.${ext}`;
        const docCmd: CreateDocumentUrlCommand = {
          name: file.name,
          description: `Document for ${name}`,
          content: fileBase64,
          category: "Sop",
          categoryId: editingSop.sopId,
          extension: extension,
          contentType: file.type,
          documentFileName: file.name,
          url: fileBase64,
        };
        await DocumentsService.postApiVDocuments("1", docCmd);
      }
      setEditingSop(null);
      resetForm();
      setIsEditDialogOpen(false);
      fetchSops();
    } catch (error) {
      console.error("Update error:", error);
      setError("Failed to update SOP or upload document.");
    }
  };

  const handleDelete = (id: string) =>
    confirm("Are you sure you want to delete this SOP?") &&
    SopService.deleteSop(id, "1")
      .then(fetchSops)
      .catch(() => setError("Failed to delete SOP. Please try again."));

  const handleCancel = () => {
    setEditingSop(null);
    resetForm();
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setDepartmentSearchOpen(false);
    setEditDepartmentSearchOpen(false);
    setIsPreviewDialogOpen(false);
    setPreviewDocument(null);
    setError(""); // Clear error on cancel
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat(
      (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]
    );
  };

  const handleDownload = async (doc: DocumentUrlListVM) => {
    try {
      if (!doc.categoryID || !doc.name || !doc.blobUrl) {
        console.warn("Missing document metadata for download");
        setError("Cannot download: Missing document URL or name.");
        return;
      }
      const link = document.createElement("a");
      link.href = doc.blobUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error", error);
      setError("Failed to download document.");
    }
  };

  const handlePreview = (doc: DocumentUrlListVM) => {
    setPreviewDocument(doc);
    setIsPreviewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {" "}
      {/* Changed background for better contrast */}
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-9xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          {" "}
          {/* Increased bottom margin */}
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl shadow-md">
              {" "}
              {/* Larger padding, more rounded, subtle shadow */}
              <FileText className="h-6 w-6 text-primary" /> {/* Larger icon */}
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                {" "}
                {/* Bolder font, darker text */}
                SOP Management
              </h1>
              <p className="text-muted-foreground text-md mt-1">
                {" "}
                {/* Slightly larger text */}
                Manage Standard Operating Procedures with ease
              </p>
            </div>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-xl transition-all duration-200 ease-in-out   transform hover:-translate-y-0.5"
              >
                {" "}
                {/* Enhanced button style */}
                <Plus className="h-5 w-5 mr-2" />
                Add New SOP
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
              {" "}
              {/* More rounded, stronger shadow */}
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50">
                  {" "}
                  {/* Bolder title */}
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Create New SOP
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Fill in the details below to create a new Standard Operating
                  Procedure.
                </DialogDescription>
              </DialogHeader>
              <Separator className="my-4" /> {/* Added margin to separator */}
              <div className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label
                    htmlFor="sop-title"
                    className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    {" "}
                    {/* Darker label text */}
                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    SOP Title
                  </Label>
                  <Input
                    id="sop-title"
                    placeholder="Enter SOP title..."
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" // Enhanced input style
                  />
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="sop-description"
                    className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    Description
                  </Label>
                  <Input
                    id="sop-description"
                    placeholder="Enter description..."
                    value={formState.description}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        description: e.target.value,
                      })
                    }
                    className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div className="grid gap-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    Department
                  </Label>
                  <DepartmentCombobox
                    value={formState.departmentId}
                    onChange={(val) =>
                      setFormState({ ...formState, departmentId: val })
                    }
                    open={departmentSearchOpen}
                    setOpen={setDepartmentSearchOpen}
                    placeholder="Search and select department..."
                  />
                </div>
                <div className="grid gap-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Upload className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    Attach File (optional)
                  </Label>
                  <div className="space-y-3">
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0] ?? null)
                      }
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
                      className="h-11 rounded-lg border border-input file:text-primary file:font-medium file:bg-primary/5 file:border-0 file:rounded-md file:py-2 file:px-3 hover:file:bg-primary/10 transition-all duration-200" // Enhanced file input
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        {" "}
                        {/* Added padding and border */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {uploadProgress < 100
                              ? "Reading file..."
                              : "Processing file..."}
                          </span>
                          <span className="font-medium text-blue-700 dark:text-blue-300">
                            {uploadProgress}%
                          </span>
                        </div>
                        <Progress
                          value={uploadProgress}
                          className="h-2 bg-blue-200 dark:bg-blue-800 [&>*]:bg-blue-600 dark:[&>*]:bg-blue-400"
                        />{" "}
                        {/* Styled progress bar */}
                      </div>
                    )}
                    {formState.file && !isUploading && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
                        {" "}
                        {/* Enhanced file info card */}
                        <div className="flex items-start gap-3">
                          {(() => {
                            const DocIcon = getFileIcon(
                              formState.file?.name ?? ""
                            );
                            return (
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <DocIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </div>
                            );
                          })()}
                          <div className="flex-1 space-y-1">
                            <div className="font-medium text-blue-900 dark:text-blue-100">
                              {formState.file.name}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              Size: {formatFileSize(formState.file.size)} •
                              Type: {getMimeType(formState.file.name)}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              Extension:{" "}
                              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-blue-800 dark:text-blue-200">
                                {" "}
                                {/* Styled code tag */}
                                {"." + getFileExtension(formState.file.name)}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  size="lg"
                  className="bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg transition-all duration-200" // Enhanced button style
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={
                    !formState.name.trim() ||
                    !formState.description.trim() ||
                    !formState.departmentId ||
                    isUploading
                  }
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200" // Enhanced button style
                >
                  Create SOP
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-8 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg shadow-sm" // Enhanced alert style
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />{" "}
            {/* Larger icon */}
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}
        {/* Main Content Card */}
        <Card className="shadow-xl border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          {" "}
          {/* Stronger shadow, more rounded, overflow hidden for table */}
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 p-6">
            {" "}
            {/* Added padding */}
            <CardTitle className="flex items-center justify-between text-2xl font-bold text-gray-900 dark:text-gray-50">
              {" "}
              {/* Bolder title, larger text */}
              <div className="flex items-center gap-3">
                <div className="p-2  rounded-lg">
                  <FileText className="h-6 w-6 text-primary " />{" "}
                  {/* Larger icon */}
                </div>
                <span>SOP Directory</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm font-semibold" // Enhanced badge style
              >
                {sops.length} {sops.length === 1 ? "item" : "items"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              View and manage all Standard Operating Procedures
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400" />
                <p className="text-muted-foreground font-medium text-lg">
                  Loading SOPs...
                </p>
              </div>
            ) : sops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    No SOPs found
                  </p>
                  <p className="text-muted-foreground text-base">
                    Get started by creating your first SOP
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    {" "}
                    {/* Slightly different header background */}
                    <TableRow className="border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold px-6 py-3 dark:text-gray-300 text-left">
                        {" "}
                        Title
                      </TableHead>
                      <TableHead className="font-semibold px-6 py-3  dark:text-gray-300 text-left">
                        Department
                      </TableHead>
                      <TableHead className="font-semibold px-6 py-3  dark:text-gray-300 text-left">
                        Documents
                      </TableHead>
                      <TableHead className="font-semibold px-6 py-3 dark:text-gray-300 text-left">
                        ID
                      </TableHead>
                      <TableHead className="text-right font-semibold px-6 py-3  dark:text-gray-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sops.map((sop) => (
                      <TableRow
                        key={sop.sopId}
                        className="border-b border-gray-100 dark:border-gray-800  dark:hover:bg-gray-850 transition-colors" // Subtle hover effect
                      >
                        <TableCell className="font-medium px-6 py-3 text-gray-900 dark:text-gray-100">
                          {sop.name}
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className=" ">
                              {departments.find(
                                (d) =>
                                  d.departmentID === (sop as any).departmentId
                              )?.name || "Unassigned"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <Badge
                            variant="outline"
                            className="gap-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 px-2 py-1 rounded-full"
                          >
                            {" "}
                            {/* Enhanced badge */}
                            <File className="h-3 w-3" />{" "}
                            {/* Changed to generic File icon */}
                            {existingDocuments[sop.sopId]?.length || 0} file(s)
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded font-mono">
                            {" "}
                            {/* Styled code tag */}
                            {sop.sopId?.slice(0, 12)}...
                          </code>
                        </TableCell>
                        <TableCell className="text-right px-6 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(sop)}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-200 dark:hover:border-blue-700 text-blue-600 dark:text-blue-400 rounded-md transition-all duration-200" // Enhanced button
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(sop.sopId)}
                              className="hover:bg-red-50 dark:hover:bg-red-900 hover:border-red-200 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 text-red-500 rounded-md transition-all duration-200" // Enhanced button
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            {" "}
            {/* More rounded, stronger shadow */}
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Edit className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                Edit SOP
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Update the SOP details and manage attached documents.
              </DialogDescription>
            </DialogHeader>
            <Separator className="my-4" />
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label
                  htmlFor="edit-sop-title"
                  className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  SOP Title
                </Label>
                <Input
                  id="edit-sop-title"
                  placeholder="Enter SOP title..."
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div className="grid gap-3">
                <Label
                  htmlFor="edit-sop-description"
                  className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Description
                </Label>
                <Input
                  id="edit-sop-description"
                  placeholder="Enter description..."
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  className="h-11 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div className="grid gap-3">
                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Department
                </Label>
                <DepartmentCombobox
                  value={formState.departmentId}
                  onChange={(val) =>
                    setFormState({ ...formState, departmentId: val })
                  }
                  open={editDepartmentSearchOpen}
                  setOpen={setEditDepartmentSearchOpen}
                  placeholder="Search and select department..."
                />
              </div>
              {/* Existing Documents Section */}
              {editingSop &&
                existingDocuments[editingSop.sopId]?.length > 0 && (
                  <div className="grid gap-3">
                    <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      Existing Documents
                    </Label>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {" "}
                      {/* Added custom-scrollbar for better styling */}
                      {existingDocuments[editingSop.sopId].map((doc) => {
                        const DocIcon = getFileIcon(doc.name || "");
                        return (
                          <div
                            key={doc.documentID}
                            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors" // Enhanced document card
                            onClick={() => handlePreview(doc)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <DocIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="font-medium text-blue-900 dark:text-blue-100">
                                  {doc.name || "Unnamed Document"}
                                </div>
                                {doc.description && (
                                  <div className="text-sm text-blue-700 dark:text-blue-300">
                                    {doc.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(doc);
                              }}
                              className="hover:bg-accent/20 dark:hover:bg-accent/30 text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors" // Enhanced button
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              <div className="grid gap-3">
                <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Upload className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Add New Document (optional)
                </Label>
                <div className="space-y-3">
                  <Input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] ?? null)
                    }
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
                    className="h-11 rounded-lg border border-input file:text-primary file:font-medium file:bg-primary/5 file:border-0 file:rounded-md file:py-2 file:px-3 hover:file:bg-primary/10 transition-all duration-200"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {uploadProgress < 100
                            ? "Reading file..."
                            : "Processing file..."}
                        </span>
                        <span className="font-medium text-blue-700 dark:text-blue-300">
                          {uploadProgress}%
                        </span>
                      </div>
                      <Progress
                        value={uploadProgress}
                        className="h-2 bg-blue-200 dark:bg-blue-800 [&>*]:bg-blue-600 dark:[&>*]:bg-blue-400"
                      />
                    </div>
                  )}
                  {formState.file && !isUploading && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="font-medium text-blue-900 dark:text-blue-100">
                            {formState.file.name}
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">
                            Size: {formatFileSize(formState.file.size)} • Type:{" "}
                            {getMimeType(formState.file.name)}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            Extension:{" "}
                            <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-blue-800 dark:text-blue-200">
                              {"." + getFileExtension(formState.file.name)}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {editingSop && (
              <div className="grid gap-3 mt-4">
                {" "}
                {/* Added margin top */}
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  SOP ID
                </Label>
                <div className="p-3 bg-muted/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {" "}
                  {/* Styled ID display */}
                  <code className="text-sm font-mono text-muted-foreground">
                    {editingSop.sopId}
                  </code>
                </div>
              </div>
            )}
            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="cursor-pointer bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                onClick={handleCancel}
                size="lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={
                  !formState.name.trim() ||
                  !formState.description.trim() ||
                  !formState.departmentId ||
                  isUploading
                }
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200"
              >
                Update SOP
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* File Preview Dialog */}
        <FilePreviewDialog
          open={isPreviewDialogOpen}
          onOpenChange={setIsPreviewDialogOpen}
          document={previewDocument}
        />
      </div>
    </div>
  );
}
