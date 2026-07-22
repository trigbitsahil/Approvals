"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  Search,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  Save,
  Users
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
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  // Fetch all users and system roles on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          UserService.getApiVUser(API_VERSION),
          UserService.getAllRoles(API_VERSION)
        ]);
        
        setUsers(Array.isArray(usersRes.data) ? (usersRes.data as SystemUser[]) : []);
        
        if (rolesRes?.data) {
           setAllRoles(rolesRes.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users or roles");
      }
    };
    fetchInitialData();
  }, []);


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

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-muted/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm ring-1 ring-primary/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Role Management
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-[52px]">
            Assign and revoke system-wide access permissions for your team.
          </p>
        </div>

        <Button onClick={() => setIsCreateRoleOpen(true)} className="rounded-xl">
          + Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: User Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search users to manage roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-12 rounded-xl border-muted-foreground/20 bg-card focus-visible:ring-primary shadow-sm transition-all"
            />
          </div>
          
          <Card className="border-muted shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 bg-muted/40 border-b border-muted/60">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" /> Select User
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No users found.</div>
              )}
              {filteredUsers.map(user => (
                <div 
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedUserId === user.id 
                      ? "bg-primary/10 border-primary/30 shadow-sm" 
                      : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-full">
                      <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${selectedUserId === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-semibold truncate ${selectedUserId === user.id ? 'text-primary' : ''}`}>
                          {user.firstName} {user.lastName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 min-w-0">
                          <Mail className="h-3 w-3 shrink-0" /> <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Role Assignment */}
        <div className="lg:col-span-7">
          <Card className="border-muted shadow-sm h-full min-h-[600px] flex flex-col relative overflow-hidden">
            {!selectedUserId ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 backdrop-blur-sm z-10 p-8 text-center">
                <ShieldCheck className="h-16 w-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-foreground/70 mb-2">No User Selected</h3>
                <p className="max-w-xs">Select a user from the list on the left to view and modify their system roles.</p>
              </div>
            ) : null}

            {selectedUser && (
              <>
                <div className="p-6 border-b border-muted/60 bg-muted/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4" /> {selectedUser.email}
                      </p>
                    </div>
                    <Badge variant={selectedUser.isActive !== false ? "default" : "secondary"}>
                      {selectedUser.isActive !== false ? "Active Account" : "Inactive Account"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold">Assigned Roles</h3>
                    <p className="text-sm text-muted-foreground">Toggle the switches below to grant or revoke system permissions.</p>
                  </div>

                  {isLoadingRoles ? (
                    <div className="py-12 text-center text-muted-foreground">Loading roles...</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {allRoles.map(role => {
                        const hasRole = userRoles.includes(role);
                        return (
                          <div 
                            key={role}
                            onClick={() => toggleRole(role)}
                            className="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between border-muted hover:border-muted-foreground/30 bg-card"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                                {hasRole ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <XCircle className="h-5 w-5" />}
                              </div>
                              <span className={`font-semibold truncate ${hasRole ? 'text-foreground' : 'text-muted-foreground'}`} title={role}>
                                {role}
                              </span>
                            </div>
                            
                            {/* Visual toggle switch */}
                            <div className={`shrink-0 w-10 h-6 rounded-full transition-colors relative ml-3 ${hasRole ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${hasRole ? 'left-5' : 'left-1'}`} />
                            </div>
                          </div>
                        );
                      })}
                      {allRoles.length === 0 && (
                        <div className="col-span-full py-8 text-center text-muted-foreground italic border-2 border-dashed border-muted rounded-xl">
                          No roles found in the system.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-muted/60 bg-muted/10 flex justify-end">
                  <Button 
                    onClick={handleSaveRoles} 
                    disabled={isSaving || isLoadingRoles}
                    className="h-11 px-8 rounded-xl shadow-lg shadow-primary/20"
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
