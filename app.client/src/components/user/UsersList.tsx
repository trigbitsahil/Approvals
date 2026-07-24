"use client";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserService } from "@/api/services/UserService";
import { DocumentsService } from "@/api/services/DocumentsService";
import type { CreateUserCommand } from "@/api/models/CreateUserCommand";
import type { UpdateUserCommand } from "@/api/models/UpdateUserCommand";
import { toast } from "sonner";
import { UserActivityDialog } from "./UserActivity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Users,
  UserPlus,
  Mail,
  Phone,
  Trash2,
  Edit3,
  Info,
  Activity,
  Search,
  EyeOff,
  Eye,
  ShieldCheck,
  UserCheck
} from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive?: boolean;
  createdDate?: string;
}

const API_VERSION = "1";

const UserAvatar = ({ userId, firstName, lastName, className = "" }: { userId?: string, firstName: string, lastName: string, className?: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!userId) return;
      try {
        const response = await DocumentsService.getApiVDocuments(API_VERSION, "User", userId);
        if (response?.data && response.data.length > 0) {
          const latestDoc = response.data[response.data.length - 1];
          setImageUrl(latestDoc.url || (latestDoc as any).blobUrl);
        }
      } catch (err) {
        console.error("Failed to fetch avatar", err);
      }
    };
    fetchImage();
  }, [userId]);

  const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  const colors = ["bg-primary/80"];
  const hash = (firstName + lastName).length % colors.length;

  return (
    <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ring-1 ring-white/10 ${colors[hash]} ${className} overflow-hidden`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={firstName} 
          className="h-full w-full object-cover" 
          loading="lazy"
          decoding="async"
        />
      ) : (
        initials || <Users className="h-4 w-4" />
      )}
    </div>
  );
};

import { UserFormDialog } from "./UserFormDialog";

export const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [activityUserId, setActivityUserId] = useState<string | null>(null);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchUsers = useCallback(async () => {
    try {
      const res = await UserService.getApiVUser(API_VERSION);
      setUsers(Array.isArray(res.data) ? (res.data as User[]) : []);
    } catch {
      toast.error("Failed to fetch users");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenDialog = (user?: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await UserService.deleteUser(id, API_VERSION);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Premium Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-muted/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm ring-1 ring-primary/20 shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              User Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium pl-0 sm:pl-[52px]">
            Manage, organize, and monitor system users and access levels.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[240px] h-10 rounded-xl border-muted-foreground/20 bg-muted/30 focus-visible:ring-primary focus-visible:bg-background transition-all"
            />
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="h-10 px-5 gap-2 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] justify-center"
          >
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      <Card className="border-slate-300/80 dark:border-muted shadow-sm overflow-hidden bg-white dark:bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-slate-50 dark:bg-muted/40 border-b border-slate-300 dark:border-white/10 text-muted-foreground text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left font-bold">User Information</th>
                <th className="px-4 sm:px-6 py-4 text-left font-bold">Registration Data</th>
                <th className="px-4 sm:px-6 py-4 text-left font-bold">Status</th>
                <th className="px-4 sm:px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 dark:divide-white/10">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleOpenDialog(user)}
                    className="group hover:bg-slate-50/80 dark:hover:bg-muted/30 transition-all duration-200 cursor-pointer border-b border-slate-300 dark:border-white/10"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar userId={user.id} firstName={user.firstName} lastName={user.lastName} />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors break-words">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5 break-all">
                            <Mail className="h-3 w-3 shrink-0 opacity-60" /> <span className="truncate">{user.email}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                          <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                          {user.phoneNumber || <span className="text-muted-foreground/40 italic">No phone</span>}
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 font-mono">
                          {user.id.slice(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge
                        variant={user.isActive !== false ? "default" : "secondary"}
                        className={`text-[10px] uppercase font-bold py-0.5 rounded-md ${user.isActive !== false
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none"
                          : "opacity-60"
                          }`}
                      >
                        {user.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-xl shadow-xl border-muted">
                          <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-2 pb-1.5">Management Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/roles?userId=${user.id}`); }} className="rounded-lg gap-2 cursor-pointer">
                            <ShieldCheck className="h-4 w-4 text-primary" /> Manage Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenDialog(user); }} className="rounded-lg gap-2 cursor-pointer">
                            <Edit3 className="h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setActivityUserId(user.id); }} className="rounded-lg gap-2 cursor-pointer">
                            Activity
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator className="my-1.5 mx-1" />
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                            className="rounded-lg gap-2 cursor-pointer text-red-500 focus:text-white focus:bg-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center px-6">
                      <div className="p-4 bg-muted/40 rounded-full mb-4">
                        <Users className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">No users found</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                        {searchQuery
                          ? `We couldn't find any user matching "${searchQuery}".`
                          : "Start by adding your first user to the system using the button above."}
                      </p>
                      {searchQuery && (
                        <Button
                          variant="link"
                          onClick={() => setSearchQuery("")}
                          className="mt-2 text-primary"
                        >
                          Clear search results
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <UserFormDialog 
        open={open} 
        onOpenChange={setOpen} 
        user={selectedUser} 
        onSuccess={fetchUsers} 
      />

      <UserActivityDialog
        open={!!activityUserId}
        userId={activityUserId!}
        onClose={() => setActivityUserId(null)}
      />
    </div>
  );
};

export default UserManagementPage;
