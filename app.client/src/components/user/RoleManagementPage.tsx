"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  Save,
  Users,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { UserService } from "@/api/services/UserService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SystemUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
}

const API_VERSION = "1";

export const RoleManagementPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  const [loggedInUserRoles, setLoggedInUserRoles] = useState<string[]>([]);

  // Fetch all users and system roles on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, rolesRes, loggedInRes] = await Promise.all([
          UserService.getApiVUser(API_VERSION),
          UserService.getAllRoles(API_VERSION),
          UserService.getLoggedInUser(API_VERSION).catch(() => null)
        ]);
        
        const loadedUsers = Array.isArray(usersRes.data) ? (usersRes.data as SystemUser[]) : [];
        setUsers(loadedUsers);
        
        if (rolesRes?.data) {
           setAllRoles(rolesRes.data);
        }
        
        if (loggedInRes?.data?.userID) {
           const loggedInRolesRes = await UserService.getUserRoles(API_VERSION, loggedInRes.data.userID).catch(() => null);
           setLoggedInUserRoles(loggedInRolesRes?.data || []);
        }
        
        const initialUserId = searchParams.get("userId");
        if (initialUserId && loadedUsers.some(u => u.id === initialUserId)) {
          handleSelectUser(initialUserId);
        } else if (loadedUsers.length > 0) {
          handleSelectUser(loadedUsers[0].id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users or roles");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const isSuperAdmin = loggedInUserRoles.includes("SuperAdmin");


  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = async (userId: string) => {
    setSelectedUserId(userId);
    setIsLoadingRoles(true);
    try {
      const res = await UserService.getUserRoles(API_VERSION, userId);
      if (res?.data) {
        setUserRoles(res.data);
      } else {
        setUserRoles([]);
      }
    } catch (err) {
      toast.error("Failed to load user's roles");
      setUserRoles([]);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const toggleRole = (role: string) => {
    if (userRoles.includes(role)) {
      setUserRoles(userRoles.filter(r => r !== role));
    } else {
      setUserRoles([...userRoles, role]);
    }
  };

  const handleSaveRoles = async () => {
    if (!selectedUserId) return;
    setIsSaving(true);
    try {
      const res = await UserService.addUserToRoles(API_VERSION, {
        userID: selectedUserId,
        roles: userRoles
      });
      
      // If the API returns success = false but status 200 (common in some CQRS responses)
      if (res && res.success === false) {
        toast.error(res.message || "Failed to update roles");
      } else {
        toast.success("Roles updated successfully!");
      }
    } catch (err: any) {
      const errorMessage = err?.body?.message || err?.message || "Failed to update roles";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    setIsCreatingRole(true);
    try {
      const res = await UserService.createRole(API_VERSION, { roleName: newRoleName.trim() });
      if (res && (res as any).success === false) {
        toast.error((res as any).message || "Failed to create role");
      } else {
        toast.success("Role created successfully!");
        setAllRoles([...allRoles, newRoleName.trim()]);
        setIsCreateRoleOpen(false);
        setNewRoleName("");
      }
    } catch (err: any) {
      const errorMessage = err?.body?.message || err?.message || "Failed to create role";
      toast.error(errorMessage);
    } finally {
      setIsCreatingRole(false);
    }
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  if (isLoading) {
    return (
      <div className="flex h-full w-full min-h-[400px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading roles configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-muted/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/users")}
              className="h-9 w-9 shrink-0 rounded-xl border-muted-foreground/20 hover:bg-muted"
              title="Back to Users"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="p-2 sm:p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm ring-1 ring-primary/20 shrink-0">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Role Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium pl-0 sm:pl-[92px]">
            Assign and revoke system-wide access permissions for your team.
          </p>
        </div>
        {isSuperAdmin && (
          <Button 
            onClick={() => setIsCreateRoleOpen(true)}
            className="h-10 px-4 sm:px-5 gap-2 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
          >
            + Create Role
          </Button>
        )}
      </div>

      <div className="w-full">
        {/* Role Assignment */}
        <div>
          <Card className="border-muted shadow-sm h-full min-h-[500px] sm:min-h-[600px] flex flex-col relative overflow-hidden">
            {!selectedUserId ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 backdrop-blur-sm z-10 p-6 text-center">
                <ShieldCheck className="h-12 w-12 sm:h-16 sm:w-16 mb-4 opacity-20" />
                <h3 className="text-lg sm:text-xl font-bold text-foreground/70 mb-2">No User Selected</h3>
                <p className="max-w-xs text-xs sm:text-sm">Please select a user to view and modify their system roles.</p>
              </div>
            ) : null}

            {selectedUser && (
              <>
                <div className="p-4 sm:p-6 border-b border-muted/60 bg-muted/10">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold break-words">{selectedUser.firstName} {selectedUser.lastName}</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-1 break-all">
                        <Mail className="h-4 w-4 shrink-0" /> <span className="truncate">{selectedUser.email}</span>
                      </p>
                    </div>
                    <Badge variant={selectedUser.isActive !== false ? "default" : "secondary"} className="self-start shrink-0">
                      {selectedUser.isActive !== false ? "Active Account" : "Inactive Account"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-bold">Assigned Roles</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Toggle the switches below to grant or revoke system permissions.</p>
                  </div>

                  {isLoadingRoles ? (
                    <div className="py-12 text-center text-muted-foreground text-sm">Loading roles...</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {allRoles
                        .filter(role => isSuperAdmin || role.toLowerCase() !== "superadmin")
                        .map(role => {
                        const hasRole = userRoles.includes(role);
                        return (
                          <div 
                            key={role}
                            onClick={() => toggleRole(role)}
                            className="p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between border-muted hover:border-muted-foreground/30 bg-card"
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                              <div className="p-1.5 sm:p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                                {hasRole ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /> : <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
                              </div>
                              <span className={`text-sm sm:text-base font-semibold truncate ${hasRole ? 'text-foreground' : 'text-muted-foreground'}`} title={role}>
                                {role}
                              </span>
                            </div>
                            
                            {/* Visual toggle switch */}
                            <div className={`shrink-0 w-9 sm:w-10 h-5 sm:h-6 rounded-full transition-colors relative ml-2 sm:ml-3 ${hasRole ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                              <div className={`absolute top-0.5 sm:top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${hasRole ? 'left-4 sm:left-5' : 'left-0.5 sm:left-1'}`} />
                            </div>
                          </div>
                        );
                      })}
                      {allRoles.length === 0 && (
                        <div className="col-span-full py-8 text-center text-xs sm:text-sm text-muted-foreground italic border-2 border-dashed border-muted rounded-xl">
                          No roles found in the system.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6 border-t border-muted/60 bg-muted/10 flex justify-end">
                  <Button 
                    onClick={handleSaveRoles} 
                    disabled={isSaving || isLoadingRoles}
                    className="h-10 sm:h-11 w-full sm:w-auto px-6 sm:px-8 rounded-xl shadow-lg shadow-primary/20"
                  >
                    {isSaving ? "Saving..." : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Create New Role</DialogTitle>
            <DialogDescription>
              Enter a name for the new system role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Role Name</label>
              <Input
                placeholder="e.g. HR Manager"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={isCreatingRole || !newRoleName.trim()} className="rounded-xl">
              {isCreatingRole ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
