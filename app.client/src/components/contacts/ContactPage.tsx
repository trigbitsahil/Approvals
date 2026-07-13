"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  UserPlus,
  Search,
  Mail,
  Phone,
  Trash2,
  Edit2,
  MoreVertical,
  Loader2,
  LayoutGrid,
  List,
  Contact2,
  User,
  ExternalLink,
  ChevronRight,
  Filter,
  Plus,
  StickyNote
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContactService } from "@/api/services/ContactService";
import { ProjectService } from "@/api/services/ProjectService";
import type { ContactListVM } from "@/api/models/ContactListVM";
import type { CreateContactCommand } from "@/api/models/CreateContactCommand";
import { useConfirmation } from "@/contexts/ConfirmationContext";

type ViewMode = "grid" | "list";

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const { confirm } = useConfirmation();
  const projectId = searchParams.get("projectId") || localStorage.getItem("activeProjectId");

  const [contacts, setContacts] = useState<ContactListVM[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactListVM | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Form State
  const [formData, setFormData] = useState<Partial<CreateContactCommand>>({
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    note: "",
    isActive: true,
    isDefault: false
  });

  const fetchContacts = async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await ContactService.getApiVContact("1", "Project", projectId);
      if (res.success && res.data) {
        setContacts(res.data);
      } else {
        toast.error(res.message || "Failed to fetch contacts");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("An error occurred while loading contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectDetails = async () => {
    if (!projectId) return;
    try {
      const res = await ProjectService.getProjectById(projectId, "1");
      if (res.success && res.data) {
        setProjectName(res.data.name || "");
      }
    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchProjectDetails();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    setIsSubmitting(true);
    try {
      let res;
      if (editingContact) {
        res = await ContactService.putApiVContact("1", {
          ...formData,
          contactID: (editingContact as any).contactID,
          category: "Project",
          categoryID: projectId,
        } as any);
      } else {
        res = await ContactService.postApiVContact("1", {
          ...formData,
          category: "Project",
          categoryID: projectId,
        } as any);
      }

      if (res.success) {
        toast.success(editingContact ? "Contact updated successfully" : "Contact added successfully");
        closeDialog();
        fetchContacts();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddDialog = () => {
    setEditingContact(null);
    setFormData({
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      note: "",
      isActive: true,
      isDefault: false
    });
    setIsAdding(true);
  };

  const openEditDialog = (contact: ContactListVM) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      title: contact.title || "",
      email: contact.email || "",
      phone: contact.phone || "",
      note: contact.note || "",
      isActive: contact.isActive ?? true,
      isDefault: contact.isDefault ?? false
    });
    setIsAdding(true);
  };

  const closeDialog = () => {
    setIsAdding(false);
    setEditingContact(null);
  };

  const handleDelete = async (contactId: string) => {
    const isConfirmed = await confirm({
      title: "Delete Contact",
      message: "Are you sure you want to delete this contact? This action cannot be undone.",
      confirmLabel: "Delete",
      variant: "destructive"
    });

    if (!isConfirmed) return;

    try {
      const res = await ContactService.deleteContact(contactId, "1");
      if ((res as any).success) {
        toast.success("Contact deleted");
        setContacts(prev => prev.filter(c => (c as any).contactID !== contactId));
      } else {
        toast.error("Failed to delete contact");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("An error occurred while deleting");
    }
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (first?: string | null, last?: string | null) => {
    return `${(first || "?")[0]}${(last || "")[0] || ""}`.toUpperCase();
  };

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-muted-foreground animate-in fade-in zoom-in duration-500">
        <div className="p-6 rounded-full bg-muted/30 mb-5">
          <Contact2 size={48} className="opacity-40" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-1">No Project Selected</h2>
        <p className="text-sm">Please select a project to view its contacts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-1 py-2 animate-in fade-in duration-700">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Contacts
            </h1>
            {projectName && (
              <div className="flex items-center gap-2 text-muted-foreground/60 animate-in fade-in slide-in-from-left-2 duration-500">
                {/* <span className="text-xl font-light">/</span>
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors px-2 py-0 h-6 text-[10px] font-black uppercase tracking-wider">
                  {projectName}
                </Badge> */}
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-xs">Manage team members and stakeholders for this project.</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-9 h-10 bg-muted/40 border-border/60 focus:border-primary/50 rounded-2xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-muted/40 border border-border/50 rounded-2xl p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-foreground scale-105" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-card shadow-sm text-foreground scale-105" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Add Contact Button */}
          <Dialog open={isAdding} onOpenChange={(open) => {
            if (!open) closeDialog();
            else openAddDialog();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-2xl h-10 px-5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px]">
                <UserPlus className="h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-border/50 bg-card rounded-3xl overflow-hidden">
              <DialogHeader className="p-6 bg-muted/50">
                <DialogTitle className="text-xl">{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
                <DialogDescription className="text-xs">
                  {editingContact ? "Update the details for this contact." : "Fill in the details to add a new contact to this project."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">First Name</label>
                    <Input
                      required
                      placeholder="John"
                      className="bg-muted/30 border-border/50 rounded-xl h-11"
                      value={formData.firstName || ""}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Last Name</label>
                    <Input
                      required
                      placeholder="Doe"
                      className="bg-muted/30 border-border/50 rounded-xl h-11"
                      value={formData.lastName || ""}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Job Title</label>
                  <Input
                    placeholder="Project Manager"
                    className="bg-muted/30 border-border/50 rounded-xl h-11"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="bg-muted/30 border-border/50 rounded-xl h-11"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    className="bg-muted/30 border-border/50 rounded-xl h-11"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Internal Note</label>
                  <Input
                    placeholder="Key stakeholder for design approvals..."
                    className="bg-muted/30 border-border/50 rounded-xl h-11"
                    value={formData.note || ""}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>

                <DialogFooter className="pt-6">
                  <Button type="button" variant="ghost" onClick={closeDialog} className="rounded-xl h-11 px-6">
                    Cancel
                  </Button>
                  <Button disabled={isSubmitting} className="rounded-xl h-11 px-8 gap-2 bg-primary">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {editingContact ? "Update Contact" : "Create Contact"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Contacts", value: contacts.length, icon: Contact2, color: "text-blue-500" },
          { label: "Active Team", value: contacts.filter(c => c.isActive).length, icon: User, color: "text-emerald-500" },
          { label: "Email Addresses", value: contacts.filter(c => c.email).length, icon: Mail, color: "text-amber-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="group flex items-center gap-4 bg-card/40 border border-border/50 rounded-3xl p-5 backdrop-blur-md hover:bg-card/60 transition-all duration-300 shadow-sm"
          >
            <div className={`p-3 rounded-2xl bg-muted/50 ${s.color} transition-transform group-hover:scale-110`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black text-foreground leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT AREA */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 animate-pulse">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
          <p className="text-sm font-medium text-muted-foreground">Syncing contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-dashed border-border/50 bg-muted/10">
          <div className="p-6 rounded-full bg-muted/30 mb-5">
            <UserPlus size={40} className="text-muted-foreground/30" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-1">No contacts found</p>
          <p className="text-sm text-muted-foreground mb-6">Start by adding your first project member.</p>
          <Button variant="outline" className="rounded-2xl gap-2 border-primary/30 hover:bg-primary/5 text-primary" onClick={openAddDialog}>
            <Plus className="h-4 w-4" />
            Add New Contact
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={(contact as any).contactID}
              className="group relative flex flex-col bg-card/80 border border-border/100 rounded-3xl hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:translate-y-[-2px] transition-all duration-300 cursor-default backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl border-border/50 bg-card p-1">
                    <DropdownMenuItem
                      className="rounded-xl gap-2 focus:bg-primary/10"
                      onClick={() => openEditDialog(contact)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-xl gap-2 text-red-500 focus:bg-red-500/10"
                      onClick={() => handleDelete((contact as any).contactID)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Contact
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="p-6 pb-4">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xl font-black shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
                      {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    {contact.isDefault && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                        <Badge className="p-0 border-none bg-transparent hover:bg-transparent">
                          <Plus className="h-3 w-3 text-white" />
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{contact.title || "No Title Provided"}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-2.5">
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors group/link">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                  <span className="text-[11px] font-medium text-foreground/80 truncate flex-1">{contact.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors group/link">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                  <span className="text-[11px] font-medium text-foreground/80 truncate flex-1">{contact.phone || "No phone"}</span>
                </div>
                {contact.note && (
                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors">
                    <StickyNote className="h-3.5 w-3.5 text-primary mt-0.5" />
                    <span className="text-[10px] italic text-muted-foreground leading-relaxed line-clamp-2">{contact.note}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-card/60 border border-border/50 rounded-3xl overflow-hidden backdrop-blur-md shadow-sm">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-6 py-3.5 text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-muted/30 border-b border-border/40">
            <span className="w-10" />
            <span>Contact Name</span>
            <span>Job Title</span>
            <span>Contact Info</span>
            <span className="w-10" />
          </div>
          {filteredContacts.map((contact, idx) => (
            <div
              key={(contact as any).contactID}
              className={`group grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-muted/30 transition-all ${idx < filteredContacts.length - 1 ? "border-b border-border/20" : ""}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-muted/80 flex items-center justify-center text-primary font-black text-xs shadow-sm">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{contact.firstName} {contact.lastName}</p>
                {contact.isDefault && <Badge variant="secondary" className="mt-1 px-1.5 py-0 text-[8px] bg-emerald-500/10 text-emerald-600 border-none font-black uppercase">Primary</Badge>}
              </div>
              <div className="text-xs text-muted-foreground font-medium">{contact.title || "—"}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-foreground/80 font-medium">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  {contact.email || "—"}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-foreground/80 font-medium">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {contact.phone || "—"}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                  onClick={() => openEditDialog(contact)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete((contact as any).contactID)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
