"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Ticket } from "./types/ticket";
import { toast } from "sonner";
import { UserService } from "@/api/services/UserService";
import { TicketTypeService } from "@/api/services/TicketTypeService";
import { getMimeType, getFileIcon, getFileExtension } from "@/utils/file-utils";
import { Download, X } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

const API_VERSION = "1";

interface TicketFormProps {
  initialData?: Partial<Ticket>;
  onSubmit: (
    ticket: Partial<Ticket> & {
      contractId?: string;
      mediaUnitIds?: string[];
      documents?: File[];
    }
  ) => Promise<{ id: string; ticketNo: string }>;
  onCancel: () => void;
  isSubmitting?: boolean;
  priorities: Array<{ ticketPriorityId: string; name: string }>;
  statuses: Array<{ ticketStatusId: string; name: string }>;
  contracts: Array<{ contractId: string; name: string }>;
  mediaUnits: Array<{ contractMediaUnitId: string; name: string }>;
  onContractChange: (contractId?: string) => void;
  teams?: Array<{ teamId: string; name: string }>;
}

export const TicketForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  priorities,
  statuses,
  contracts,
  mediaUnits,
  onContractChange,
  teams = [],
}: TicketFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    ticketPriorityId: initialData?.ticketPriorityId || "",
    ticketStatusId:
      initialData?.ticketStatusId ||
      statuses.find((s) => s.name.toLowerCase() === "open")?.ticketStatusId ||
      statuses[0]?.ticketStatusId ||
      "",
    ticketTypeId: initialData?.ticketTypeId || "",
    category: initialData?.category || "",
    assignee: initialData?.assignee || "Unassigned",
    ticketNo: initialData?.ticketNo || "",
    contractId: initialData?.contractId || "",
    mediaUnitIds: initialData?.mediaUnitIds || ([] as string[]),
    customer: {
      name: initialData?.customer?.name || "",
      email: initialData?.customer?.email || "",
      phone: initialData?.customer?.phone || "",
    },
    documents: [] as File[],
    departmentId: initialData?.departmentId || "",
    departmentName: initialData?.departmentName || "",
    teamId: initialData?.teamId || "",
    mediaType: initialData?.mediaType || "",
    issueCategory: initialData?.issueCategory || "",
    isClientRequest: initialData?.isClientRequest || false,
  });


  // Dynamic ticket types from backend
  const [dynamicTicketTypes, setDynamicTicketTypes] = useState<Array<{ ticketTypeId: string; name: string }>>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  const [contractSearchTerm, setContractSearchTerm] = useState("");
  const [filteredContracts, setFilteredContracts] = useState(contracts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMediaUnits, setFilteredMediaUnits] = useState(mediaUnits);

  // Fetch logged-in user
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await UserService.getLoggedInUser(API_VERSION);
        setLoggedInUserEmail(response.data?.email || "");
      } catch (error) {
        console.error("Failed to fetch logged in user:", error);
      }
    };
    fetchLoggedInUser();
  }, []);

  // Filter contracts
  useEffect(() => {
    setFilteredContracts(
      contractSearchTerm
        ? contracts.filter((c) =>
            c.name.toLowerCase().includes(contractSearchTerm.toLowerCase())
          )
        : contracts
    );
  }, [contractSearchTerm, contracts]);

  // Filter media units
  useEffect(() => {
    setFilteredMediaUnits(
      searchTerm
        ? mediaUnits.filter((u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : mediaUnits
    );
  }, [searchTerm, mediaUnits]);

  // Load ticket types when department changes
  const loadTicketTypes = async (departmentId: string) => {
    if (!departmentId) {
      setDynamicTicketTypes([]);
      setFormData(prev => ({ ...prev, ticketTypeId: "" }));
      return;
    }

    setLoadingTypes(true);
    try {
      const response = await TicketTypeService.getApiVTicketType(API_VERSION, departmentId);
      const items = response.data?.items || response.data || [];
      setDynamicTicketTypes(items);

      // Auto-select first type if none selected
      if (!formData.ticketTypeId && items.length > 0) {
        setFormData(prev => ({
          ...prev,
          ticketTypeId: items[0].ticketTypeId,
          category: items[0].name,
        }));
      }
    } catch (error) {
      console.error("Failed to load ticket types:", error);
      toast.error("Failed to load ticket types");
      setDynamicTicketTypes([]);
    } finally {
      setLoadingTypes(false);
    }
  };

  // Handle department change
  const handleDepartmentChange = (value: string) => {
    const deptMap: Record<string, { id: string; name: string }> = {
      operations: {
        id: "Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0",
        name: "Operations Department",
      },
      hr: {
        id: "Dep_2025_08_0131badf7b-5ae7-4f76-abb8-dfca79eac03d",
        name: "HR Department",
      },
    };

    const dept = deptMap[value];
    if (!dept) return;

    setFormData(prev => ({
      ...prev,
      departmentId: dept.id,
      departmentName: dept.name,
      ticketTypeId: "",
      category: "",
    }));

    loadTicketTypes(dept.id);
  };

  // Initialize department on edit
  useEffect(() => {
    if (initialData?.departmentId) {
      const reverseMap: Record<string, string> = {
        "Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0": "operations",
        "Dep_2025_08_0131badf7b-5ae7-4f76-abb8-dfca79eac03d": "hr",
      };
      const key = reverseMap[initialData.departmentId];
      if (key) {
        handleDepartmentChange(key);
      }
    }
  }, [initialData?.departmentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, [name]: value },
    }));
  };

  const handleContractChange = (contractId: string) => {
    setFormData(prev => ({
      ...prev,
      contractId,
      mediaUnitIds: [],
    }));
    onContractChange(contractId);
  };

  const handleMediaUnitChange = (mediaUnitId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      mediaUnitIds: checked
        ? [...prev.mediaUnitIds, mediaUnitId]
        : prev.mediaUnitIds.filter(id => id !== mediaUnitId),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, documents: Array.from(e.target.files) }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.departmentId) {
    toast.error("Please select a department");
    return;
  }
  if (!formData.ticketTypeId) {
    toast.error("Please select a ticket type");
    return;
  }
  
  const isOperations = formData.departmentId === "Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0";
  if (isOperations) {
    if (!formData.mediaType) {
      toast.error("Please select a media type");
      return;
    }
    if (!formData.issueCategory) {
      toast.error("Please select an issue category");
      return;
    }
  }

  try {
    await onSubmit({
      ...formData,
      ticketTypeId: formData.ticketTypeId,     // real GUID
      category: undefined,
      requestedBy: loggedInUserEmail,
      documents: formData.documents,
      departmentId: formData.departmentId,      // ← ADD THIS LINE
      mediaType: isOperations ? formData.mediaType : "",
      issueCategory: isOperations ? formData.issueCategory : "",
    });
  } catch (error) {
    toast.error("Failed to create ticket");
  }
};



  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      {/* Contract & Media Units */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <Label>Contract</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between bg-transparent">
                <div className="flex flex-wrap gap-1 overflow-hidden">
                  {formData.contractId ? (
                    <Badge variant="secondary" className="py-0.5 px-2 rounded-full">
                      {contracts.find(c => c.contractId === formData.contractId)?.name || "Unknown"}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">Select contract...</span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search contracts..." value={contractSearchTerm} onValueChange={setContractSearchTerm} />
                <CommandList>
                  <CommandEmpty>No contracts found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredContracts.map(contract => (
                      <CommandItem key={contract.contractId} onSelect={() => handleContractChange(contract.contractId)}>
                        <Checkbox checked={formData.contractId === contract.contractId} />
                        <Label className="cursor-pointer ml-2">{contract.name}</Label>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Media Units</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between bg-transparent">
                <div className="flex flex-wrap gap-1 overflow-hidden">
                  {formData.mediaUnitIds.length > 0 ? (
                    formData.mediaUnitIds.map(id => {
                      const unit = mediaUnits.find(mu => mu.contractMediaUnitId === id);
                      return unit ? (
                        <Badge key={id} variant="secondary" className="py-0.5 px-2 rounded-full">
                          {unit.name}
                        </Badge>
                      ) : null;
                    })
                  ) : (
                    <span className="text-muted-foreground">Select media units...</span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search media units..." value={searchTerm} onValueChange={setSearchTerm} />
                <CommandList>
                  <CommandEmpty>No media units found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredMediaUnits.map(unit => (
                      <CommandItem
                        key={unit.contractMediaUnitId}
                        onSelect={() => handleMediaUnitChange(unit.contractMediaUnitId, !formData.mediaUnitIds.includes(unit.contractMediaUnitId))}
                      >
                        <Checkbox checked={formData.mediaUnitIds.includes(unit.contractMediaUnitId)} />
                        <Label className="cursor-pointer ml-2">{unit.name}</Label>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Priority & Department */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={formData.ticketPriorityId} onValueChange={v => setFormData(prev => ({ ...prev, ticketPriorityId: v }))}>
            <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
            <SelectContent>
              {priorities.map(p => (
                <SelectItem key={p.ticketPriorityId} value={p.ticketPriorityId}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            value={
              formData.departmentId === "Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0" ? "operations" :
              formData.departmentId === "Dep_2025_08_0131badf7b-5ae7-4f76-abb8-dfca79eac03d" ? "hr" : ""
            }
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operations">Operations Department</SelectItem>
              <SelectItem value="hr">HR Department</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status & Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.ticketStatusId} onValueChange={v => setFormData(prev => ({ ...prev, ticketStatusId: v }))}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {statuses.map(s => (
                <SelectItem key={s.ticketStatusId} value={s.ticketStatusId}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type {loadingTypes && "(loading...)"}</Label>
          <Select
            value={formData.ticketTypeId}
            onValueChange={v => {
              const selected = dynamicTicketTypes.find(t => t.ticketTypeId === v);
              setFormData(prev => ({
                ...prev,
                ticketTypeId: v,
                category: selected?.name || "",
              }));
            }}
            disabled={loadingTypes || dynamicTicketTypes.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.departmentId ? "Select type" : "First select department"} />
            </SelectTrigger>
            <SelectContent>
              {dynamicTicketTypes.map(type => (
                <SelectItem key={type.ticketTypeId} value={type.ticketTypeId}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Linked Team */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Linked Team (Optional)</Label>
          <Select
            value={formData.teamId || "none"}
            onValueChange={v => setFormData(prev => ({ ...prev, teamId: v === "none" ? "" : v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {teams.map(t => (
                <SelectItem key={t.teamId} value={t.teamId}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Media Type & Issue Category */}
      {formData.departmentId === "Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Media Type</Label>
            <Select
              value={formData.mediaType}
              onValueChange={v => setFormData(prev => ({ ...prev, mediaType: v, issueCategory: "" }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OOH">OOH</SelectItem>
                <SelectItem value="DOOH">DOOH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Issue Category</Label>
            <Select
              value={formData.issueCategory}
              onValueChange={v => setFormData(prev => ({ ...prev, issueCategory: v }))}
              disabled={!formData.mediaType}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.mediaType ? "Select category" : "First select media type"} />
              </SelectTrigger>
              <SelectContent>
                {formData.mediaType === "OOH" && (
                  <>
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-xs text-muted-foreground px-2 py-1 bg-muted/30">Flex Related</SelectLabel>
                      <SelectItem value="Wrinkled">Wrinkled</SelectItem>
                      <SelectItem value="Torn">Torn</SelectItem>
                      <SelectItem value="Flex - Normal">Normal</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-xs text-muted-foreground px-2 py-1 bg-muted/30">Illumination Related</SelectLabel>
                      <SelectItem value="Light off">Light off</SelectItem>
                      <SelectItem value="Partially not working">Partially not working</SelectItem>
                      <SelectItem value="Illumination - Normal">Normal</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-xs text-muted-foreground px-2 py-1 bg-muted/30">Site Hygiene</SelectLabel>
                      <SelectItem value="Hygiene issue">Hygiene issue</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-xs text-muted-foreground px-2 py-1 bg-muted/30">Others</SelectLabel>
                      <SelectItem value="Other OOH-related issues">Other OOH-related issues</SelectItem>
                    </SelectGroup>
                  </>
                )}
                {formData.mediaType === "DOOH" && (
                  <>
                    <SelectItem value="Internet issue">Internet issue</SelectItem>
                    <SelectItem value="Patch issue">Patch issue</SelectItem>
                    <SelectItem value="Electricity issue">Electricity issue</SelectItem>
                    <SelectItem value="Brightness issue">Brightness issue</SelectItem>
                    <SelectItem value="Sync issue">Sync issue</SelectItem>
                    <SelectItem value="Hygiene issue">Hygiene issue</SelectItem>
                    <SelectItem value="Creative-related issue">Creative-related issue</SelectItem>
                    <SelectItem value="Wallop brand logo-related issue">Wallop brand logo-related issue</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Client Request Checkbox */}
      <div className="flex items-center gap-2 py-2">
        <Checkbox
          id="isClientRequest"
          checked={formData.isClientRequest}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isClientRequest: !!checked }))
          }
        />
        <Label htmlFor="isClientRequest" className="cursor-pointer font-medium">
          Is Client Request
        </Label>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Brief description" required />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="resize-none" />
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <Label>Attachments</Label>
        <Input type="file" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png,.xlsx" />
        {formData.documents.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.documents.map((file, i) => {
              const Icon = getFileIcon(file.name);
              return (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeDocument(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {initialData?.id ? "Update Ticket" : "Create Ticket"}
        </Button>
      </div>
    </form>
  );
};