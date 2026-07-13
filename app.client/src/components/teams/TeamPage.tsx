"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Plus,
  Trash2,
  Edit2,
  MoreVertical,
  Loader2,
  LayoutGrid,
  List,
  UserPlus,
  ShieldAlert,
  CheckCircle,
  XCircle,
  ChevronRight
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamService } from "@/api/services/TeamService";
import { TeamMemberService } from "@/api/services/TeamMemberService";
import { UserService } from "@/api/services/UserService";
import { CitiesService } from "@/api/services/CitiesService";
import type { UserListVM } from "@/api/models/UserListVM";
import { useConfirmation } from "@/contexts/ConfirmationContext";

interface TeamVM {
  teamId: string;
  name: string;
  description?: string;
  email?: string;
  isActive: boolean;
  isVoided: boolean;
  memberCount?: number;
  cityId?: string | null;
  isSystemTeam?: boolean;
}

interface CityItem {
  cityId: string;
  name: string;
}

interface TeamMemberVM {
  teamMemberId: string;
  teamId: string;
  memberId: string;
  name: string;
  isActive: boolean;
}

type ViewMode = "grid" | "list";

export default function TeamPage() {
  const { confirm } = useConfirmation();

  // State
  const [teams, setTeams] = useState<TeamVM[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamVM | null>(null);
  const [members, setMembers] = useState<TeamMemberVM[]>([]);
  const [systemUsers, setSystemUsers] = useState<UserListVM[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  
  // Dialog State
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamVM | null>(null);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Form States
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
    email: "",
    isActive: true,
    cityId: "none",
  });

  const [memberForm, setMemberForm] = useState({
    memberId: "",
    isActive: true,
  });

  // Fetch Teams
  const fetchTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const res = await TeamService.getApiVTeam("1");
      if (res.success && res.data) {
        // Map backend properties carefully (casing check)
        const mappedTeams = res.data.map((t: any) => ({
          teamId: t.teamId || t.TeamId,
          name: t.name || t.Name,
          description: t.description || t.Description || "",
          email: t.email || t.Email || "",
          isActive: t.isActive !== undefined ? t.isActive : t.IsActive,
          isVoided: t.isVoided !== undefined ? t.isVoided : t.IsVoided,
          cityId: t.cityId || t.CityId || null,
          isSystemTeam: t.isSystemTeam !== undefined ? t.isSystemTeam : t.IsSystemTeam,
        }));
        
        // Parallelly fetch member counts or setup counts if possible
        setTeams(mappedTeams);
      } else {
        toast.error(res.message || "Failed to fetch teams");
      }
    } catch (err) {
      console.error("Fetch teams error:", err);
      toast.error("An error occurred while loading teams");
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // Fetch Team Members
  const fetchMembers = async (teamId: string) => {
    setIsLoadingMembers(true);
    try {
      const res = await TeamMemberService.getMembersByTeamId(teamId);

      if (res.success && res.data) {
        const mappedMembers = res.data.map((m: any) => ({
          teamMemberId: m.teamMemberId || m.TeamMemberId,
          teamId: m.teamId || m.TeamId,
          memberId: m.memberId || m.MemberId,
          name: m.name || m.Name || "Unnamed Member",
          isActive: m.isActive !== undefined ? m.isActive : m.IsActive,
        }));
        setMembers(mappedMembers);

        // Update the count for this team locally
        setTeams(prev => prev.map(t => t.teamId === teamId ? { ...t, memberCount: mappedMembers.length } : t));
      } else {
        toast.error(res.message || "Failed to fetch members");
      }
    } catch (err) {
      console.error("Fetch members error:", err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Fetch System Users for selection dropdown
  const fetchSystemUsers = async () => {
    try {
      const res = await UserService.getApiVUser("1");
      if (res.success && res.data) {
        setSystemUsers(res.data);
      }
    } catch (err) {
      console.error("Fetch system users error:", err);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await CitiesService.getCityList("1");
      if (res?.success && res?.data) {
        const mappedCities = res.data.map((c: any) => ({
          cityId: c.cityId || c.CityId || c.cityID || c.CityID || "",
          name: c.name || c.Name || "",
        }));
        setCities(mappedCities);
      }
    } catch (err) {
      console.error("Fetch cities error:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchSystemUsers();
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchMembers(selectedTeam.teamId);
    } else {
      setMembers([]);
    }
  }, [selectedTeam]);

  // Team Form Actions
  const handleOpenAddTeam = () => {
    setEditingTeam(null);
    setTeamForm({
      name: "",
      description: "",
      email: "",
      isActive: true,
      cityId: "none",
    });
    setIsTeamDialogOpen(true);
  };

  const handleOpenEditTeam = (team: TeamVM) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description || "",
      email: team.email || "",
      isActive: team.isActive,
      cityId: team.cityId || "none",
    });
    setIsTeamDialogOpen(true);
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim()) {
      toast.error("Team name is required");
      return;
    }

    const payload = {
      ...teamForm,
      cityId: (teamForm.cityId && teamForm.cityId !== "none") ? teamForm.cityId : null,
    };

    setIsSubmitting(true);
    try {
      let res;
      if (editingTeam) {
        res = await TeamService.putApiVTeam("1", {
          teamId: editingTeam.teamId,
          ...payload,
        });
      } else {
        res = await TeamService.postApiVTeam("1", payload);
      }

      if (res.success) {
        toast.success(editingTeam ? "Team updated successfully" : "Team created successfully");
        setIsTeamDialogOpen(false);
        fetchTeams();
        if (selectedTeam && editingTeam && selectedTeam.teamId === editingTeam.teamId) {
          setSelectedTeam({ ...selectedTeam, ...payload });
        }
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (err) {
      console.error("Team submit error:", err);
      toast.error("An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async (team: TeamVM) => {
    const isConfirmed = await confirm({
      title: "Delete Team",
      message: `Are you sure you want to delete the team "${team.name}"? This will remove all member associations.`,
      confirmLabel: "Delete",
      variant: "destructive",
    });

    if (!isConfirmed) return;

    try {
      const res = await TeamService.deleteApiVTeam(team.teamId, "1");
      if (res.success) {
        toast.success("Team deleted successfully");
        fetchTeams();
        if (selectedTeam?.teamId === team.teamId) {
          setSelectedTeam(null);
        }
      } else {
        toast.error(res.message || "Failed to delete team");
      }
    } catch (err) {
      console.error("Delete team error:", err);
      toast.error("An error occurred while deleting the team");
    }
  };

  // Team Member Form Actions
  const handleOpenAddMember = () => {
    if (!selectedTeam) return;
    setMemberForm({
      memberId: "",
      isActive: true,
    });
    setIsMemberDialogOpen(true);
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    if (!memberForm.memberId) {
      toast.error("Please select a user");
      return;
    }

    // Check if user is already a member
    if (members.some(m => m.memberId === memberForm.memberId)) {
      toast.error("This user is already a member of this team");
      return;
    }

    const selectedUser = systemUsers.find(u => u.id === memberForm.memberId);
    const memberName = selectedUser ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() || selectedUser.userName || "" : "New Member";

    setIsSubmitting(true);
    try {
      const res = await TeamMemberService.postApiVTeamMember("1", {
        teamId: selectedTeam.teamId,
        memberId: memberForm.memberId,
        name: memberName,
        isActive: memberForm.isActive,
      });

      if (res.success) {
        toast.success("Member added successfully");
        setIsMemberDialogOpen(false);
        fetchMembers(selectedTeam.teamId);
      } else {
        toast.error(res.message || "Failed to add member");
      }
    } catch (err) {
      console.error("Member add error:", err);
      toast.error("An error occurred while adding the member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleMemberStatus = async (member: TeamMemberVM) => {
    try {
      const res = await TeamMemberService.putApiVTeamMember("1", {
        teamMemberId: member.teamMemberId,
        teamId: member.teamId,
        memberId: member.memberId,
        name: member.name,
        isActive: !member.isActive,
      });
      if (res.success) {
        toast.success("Member status updated");
        fetchMembers(member.teamId);
      } else {
        toast.error(res.message || "Failed to update member status");
      }
    } catch (err) {
      console.error("Member update error:", err);
    }
  };

  const handleRemoveMember = async (member: TeamMemberVM) => {
    const isConfirmed = await confirm({
      title: "Remove Member",
      message: `Are you sure you want to remove ${member.name} from this team?`,
      confirmLabel: "Remove",
      variant: "destructive",
    });

    if (!isConfirmed) return;

    try {
      const res = await TeamMemberService.deleteApiVTeamMember(member.teamMemberId, "1");
      if (res.success) {
        toast.success("Member removed successfully");
        fetchMembers(member.teamId);
      } else {
        toast.error(res.message || "Failed to remove member");
      }
    } catch (err) {
      console.error("Remove member error:", err);
      toast.error("An error occurred while removing the member");
    }
  };

  // Filtering
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.description && team.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (team.email && team.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-2 py-4 animate-in fade-in duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text">
            Teams Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Organise users into functional business teams and assign memberships.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border/80 rounded-md p-1 bg-muted/20">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </Button>
          </div>
          <Button onClick={handleOpenAddTeam} className="bg-primary hover:bg-primary/95 text-primary-foreground gap-2 shadow-sm">
            <Plus size={16} />
            Add Team
          </Button>
        </div>
      </div>

      {/* Main Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Main Column: Teams List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams by name, email or description..."
              className="pl-9 bg-background/50 focus-visible:ring-1 border-border/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoadingTeams ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="animate-spin mb-3 text-primary" size={32} />
              <p>Loading teams...</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-muted/10 text-muted-foreground">
              <Users size={48} className="opacity-20 mb-3" />
              <h3 className="font-semibold text-foreground">No Teams Found</h3>
              <p className="text-sm mt-1">Get started by creating your first business team.</p>
              <Button variant="outline" onClick={handleOpenAddTeam} className="mt-4 gap-2">
                <Plus size={16} />
                Create Team
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTeams.map((team) => (
                <div
                  key={team.teamId}
                  onClick={() => setSelectedTeam(team)}
                  className={`group relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedTeam?.teamId === team.teamId
                      ? "bg-primary/5 border-primary shadow-md shadow-primary/5"
                      : "bg-card hover:bg-muted/30 border-border/80 hover:border-border"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {team.name}
                      </div>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Badge variant={team.isActive ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                          {team.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {!team.isSystemTeam && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                                <MoreVertical size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem onClick={() => handleOpenEditTeam(team)} className="gap-2">
                                <Edit2 size={14} />
                                Edit details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTeam(team)} className="text-destructive gap-2">
                                <Trash2 size={14} />
                                Delete Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
                      {team.description || "No description provided."}
                    </p>
                  </div>

                  <div className="border-t border-border/40 mt-4 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} />
                      <span className="truncate max-w-[150px]">{team.email || "No email"}</span>
                    </div>
                    {team.cityId && (
                      <div className="flex items-center gap-1">
                        <span className="truncate max-w-[100px] text-foreground font-medium">
                          {cities.find(c => c.cityId === team.cityId)?.name || "Unknown City"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 font-semibold text-foreground bg-muted px-2 py-0.5 rounded-full">
                      <Users size={10} />
                      <span>Members</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border/80 rounded-xl overflow-hidden bg-card divide-y divide-border/60">
              {filteredTeams.map((team) => (
                <div
                  key={team.teamId}
                  onClick={() => setSelectedTeam(team)}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    selectedTeam?.teamId === team.teamId ? "bg-primary/5" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">{team.name}</span>
                      <Badge variant={team.isActive ? "default" : "secondary"} className="text-[9px] px-1.5">
                        {team.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{team.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{team.email || "No email"}</span>
                    {!team.isSystemTeam && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => handleOpenEditTeam(team)} className="gap-2">
                            <Edit2 size={14} />
                            Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTeam(team)} className="text-destructive gap-2">
                            <Trash2 size={14} />
                            Delete Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Selected Team Members */}
        <div className="lg:col-span-1">
          {selectedTeam ? (
            <div className="border border-border rounded-xl bg-card p-5 space-y-5 shadow-sm sticky top-6 animate-in fade-in duration-300">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-bold text-xl text-foreground truncate max-w-[200px]">{selectedTeam.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Team Members</p>
                </div>
                <Button size="sm" onClick={handleOpenAddMember} className="h-8 gap-1 px-2.5">
                  <UserPlus size={14} />
                  Add Member
                </Button>
              </div>

              {isLoadingMembers ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="animate-spin text-primary mb-2" size={24} />
                  <p className="text-xs">Loading members...</p>
                </div>
              ) : members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/5">
                  <UserPlus size={32} className="opacity-20 mb-2" />
                  <p className="text-xs font-semibold text-foreground">No Members Assigned</p>
                  <p className="text-[11px] mt-0.5">Assign users to this team to get started.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {members.map((member) => (
                    <div
                      key={member.teamMemberId}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-background/50 hover:bg-muted/10 transition-colors"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="font-medium text-sm text-foreground truncate">{member.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <button
                            onClick={() => handleToggleMemberStatus(member)}
                            className="focus:outline-none"
                            title="Click to toggle status"
                          >
                            <Badge
                              variant={member.isActive ? "default" : "secondary"}
                              className={`text-[9px] px-1 py-0 cursor-pointer ${
                                member.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" : ""
                              }`}
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
                        onClick={() => handleRemoveMember(member)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-border/80 rounded-xl bg-muted/5 p-8 text-center text-muted-foreground h-full min-h-[300px] flex flex-col justify-center items-center">
              <Users size={40} className="opacity-15 mb-3" />
              <h4 className="font-semibold text-foreground text-sm">No Team Selected</h4>
              <p className="text-xs mt-1 max-w-[200px]">
                Click on any team card from the list to view and manage its member workspace.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Team Create/Edit Dialog */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTeam ? "Edit Team Details" : "Create New Team"}</DialogTitle>
            <DialogDescription>
              Enter the functional details for the team. Ensure names are clear and recognizable.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTeamSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Team Name</label>
              <Input
                id="name"
                placeholder="e.g. Sales, Operations, Delhi Hub"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Team Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. team-hub@company.com"
                value={teamForm.email}
                onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-semibold text-muted-foreground">Description</label>
              <Input
                id="description"
                placeholder="Short summary of the team's operational scope..."
                value={teamForm.description}
                onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">City</label>
              <Select
                value={teamForm.cityId}
                onValueChange={(val) => setTeamForm({ ...teamForm, cityId: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a city..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No City</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.cityId} value={city.cityId}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editingTeam && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={teamForm.isActive}
                  onChange={(e) => setTeamForm({ ...teamForm, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Mark team as active and visible
                </label>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingTeam ? "Save Changes" : "Create Team"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Assign an existing system user to the team {selectedTeam?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMemberSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Select User</label>
              <Select
                value={memberForm.memberId}
                onValueChange={(val) => setMemberForm({ ...memberForm, memberId: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Search or select a user..." />
                </SelectTrigger>
                <SelectContent>
                  {systemUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id || "none"}>
                      {`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">

              <Button type="button" variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
