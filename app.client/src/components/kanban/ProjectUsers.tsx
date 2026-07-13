"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserService } from "@/api/services/UserService";
import { UserIntermediateService } from "@/api/services/UserIntermediateService";
import type { CreateUserIntermediateCommand } from "@/api/models/CreateUserIntermediateCommand";
import ConfirmationModal from "@/components/ConfirmationModal";

interface User {
    id: string;
    email: string;
    fullName?: string;
}

interface ActiveUser {
    id: string;
    userId: string;
    email: string;
    role?: string;
    status?: string;
}

export default function ActiveUsers() {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId") || localStorage.getItem("activeProjectId") || "";

    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingActive, setIsLoadingActive] = useState(true);
    const [userToRemove, setUserToRemove] = useState<string | null>(null);

    // Fetch Active Users in this Project
    const fetchActiveUsers = async () => {
        if (!projectId) {
            setActiveUsers([]);
            setIsLoadingActive(false);
            return;
        }

        setIsLoadingActive(true);
        try {
            const response = await UserIntermediateService.getApiVUserIntermediate(
                "1",
                "Project",
                projectId
            );

            setActiveUsers(
                Array.isArray(response.data)
                    ? response.data.map((item: any) => ({
                        id: item.userIntermediateId || item.userIntermediateID || item.id,
                        userId: item.userId || item.userID,
                        email: item.userEmail || item.email,
                        role: item.role || "Member",
                        status: "Active",
                    }))
                    : []
            );
        } catch (error) {
            console.error("Failed to fetch active users:", error);
            toast.error("Failed to load active users");
        } finally {
            setIsLoadingActive(false);
        }
    };

    // Fetch All Users
    const fetchAllUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await UserService.getApiVUser("1");
            setAllUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load user list");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchActiveUsers();
    }, [projectId]);

    const handleOpenDialog = () => {
        setSelectedUsers([]);
        fetchAllUsers();
        setIsDialogOpen(true);
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    // Handle multiple users - call API for each selected user
    const handleSave = async () => {
        if (!projectId) {
            toast.error("Project ID not found");
            return;
        }
        if (selectedUsers.length === 0) {
            toast.error("Please select at least one user");
            return;
        }

        setIsSaving(true);

        let successCount = 0;
        let failedCount = 0;

        for (const userId of selectedUsers) {
            const selectedUser = allUsers.find((u) => u.id === userId);
            if (!selectedUser) continue;

            const payload: CreateUserIntermediateCommand = {
                userId: userId,                    // string
                category: "Project",
                userEmail: selectedUser.email,     // string
                categoryId: projectId,
            };

            try {
                await UserIntermediateService.postApiVUserIntermediate("1", payload);
                successCount++;
            } catch (error) {
                console.error(`Failed to add user ${userId}:`, error);
                failedCount++;
            }
        }

        setIsSaving(false);
        setIsDialogOpen(false);
        setSelectedUsers([]);

        // Show appropriate toast
        if (successCount > 0) {
            toast.success(`${successCount} user(s) added successfully!`);
        }
        if (failedCount > 0) {
            toast.error(`${failedCount} user(s) failed to add`);
        }

        // Refresh active users list
        await fetchActiveUsers();
    };

    const handleRemoveUser = async (userIntermediateId: string) => {
        if (!userIntermediateId) {
            toast.error("Cannot remove user: Missing ID");
            return;
        }

        try {
            await UserIntermediateService.deleteUserIntermediate(userIntermediateId, "1");
            toast.success("User removed successfully");
            setActiveUsers((prev) => prev.filter((u) => u.id !== userIntermediateId));
        } catch (error) {
            console.error("Failed to remove user:", error);
            toast.error("Failed to remove user");
        } finally {
            setUserToRemove(null);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-6">
            <ConfirmationModal
                open={!!userToRemove}
                onConfirm={() => userToRemove && handleRemoveUser(userToRemove)}
                onCancel={() => setUserToRemove(null)}
                message="Remove User"
                description="Are you sure you want to remove this user from the project? They will lose access to all tasks."
                yesLabel="Remove"
            />
            <div className="mx-auto max-w-5xl">
                {/* Top Bar */}


                {/* Main Card */}
                <div className="rounded-2xl border border-zinc-800 p-4 md:p-6">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg md:text-2xl font-semibold">Active users</h2>
                            <Badge variant="secondary" className="text-xs md:text-sm">
                                {activeUsers.length}
                            </Badge>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={handleOpenDialog} className="gap-2 w-full md:w-auto text-sm md:text-base">
                                    <Plus className="h-4 w-4" />
                                    Add people
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-md w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-lg md:text-xl">Add people to project</DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Select users to add to this project.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-3 md:py-4">
                                    {isLoadingUsers ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        </div>
                                    ) : (
                                        <>
                                            {allUsers.length > 0 && (
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 px-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                                                        {selectedUsers.length} Selected
                                                    </span>
                                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                                        <button
                                                            type="button"
                                                            className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
                                                            onClick={() => setSelectedUsers(allUsers.map((u) => u.id))}
                                                        >
                                                            Select All
                                                        </button>
                                                        <span className="text-muted-foreground/30 text-xs">|</span>
                                                        <button
                                                            type="button"
                                                            className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
                                                            onClick={() => setSelectedUsers([])}
                                                        >
                                                            Deselect All
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <ScrollArea className="h-64 sm:h-80 pr-4">
                                            <div className="space-y-2">
                                                {allUsers.length === 0 ? (
                                                    <p className="text-center text-muted-foreground py-8 text-sm">
                                                        No users found
                                                    </p>
                                                ) : (
                                                    allUsers.map((user) => (
                                                        <div
                                                            key={user.id}
                                                            onClick={() => toggleUserSelection(user.id)}
                                                            className="flex items-center gap-2 sm:gap-3 rounded-lg border border-zinc-800 p-2 sm:p-3 dark:hover:bg-zinc-800/50 hover:bg-zinc-100 cursor-pointer select-none transition-colors"
                                                        >
                                                            <Checkbox
                                                                checked={selectedUsers.includes(user.id)}
                                                                className="pointer-events-none flex-shrink-0"
                                                            />
                                                            <Avatar className="h-7 sm:h-8 w-7 sm:w-8 flex-shrink-0">
                                                                <AvatarFallback className="text-xs">
                                                                    {user.email?.[0]?.toUpperCase() || "U"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate text-sm">
                                                                    {user.fullName || user.email}
                                                                </p>
                                                                <p className="text-xs text-zinc-500 truncate">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </ScrollArea>
                                        </>
                                    )}
                                </div>

                                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={isSaving}
                                        className="w-full sm:w-auto text-sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving || selectedUsers.length === 0}
                                        className="w-full sm:w-auto text-sm"
                                    >
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Add {selectedUsers.length > 0 ? `(${selectedUsers.length}) ` : ""}Users
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Active Users Table - Desktop View */}
                    {isLoadingActive ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                        </div>
                    ) : activeUsers.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 text-sm md:text-base">
                            No active users in this project yet.
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-zinc-800">
                                            <TableHead className="text-zinc-400 text-xs">User</TableHead>
                                            <TableHead className="text-zinc-400 text-xs">Email</TableHead>
                                            <TableHead className="text-zinc-400 text-xs">Role</TableHead>
                                            <TableHead className="text-zinc-400 text-xs">Status</TableHead>
                                            <TableHead className="text-zinc-400 w-[80px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeUsers.map((user) => (
                                            <TableRow key={user.userId} className="border-zinc-800 dark:hover:bg-zinc-800/50">
                                                <TableCell className="flex items-center gap-3 text-sm">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback className="bg-primary text-white text-xs">
                                                            {user.email?.[0]?.toUpperCase() || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">Member</span>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    <span className="inline-block rounded-md px-3 py-1 text-xs">
                                                        {user.role || "Project Member"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    <div className="flex items-center gap-2 text-emerald-500">
                                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                                        Active
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                                                        onClick={() => {
                                                            if (!user.id) {
                                                                toast.error("Cannot remove user: Missing ID");
                                                                return;
                                                            }
                                                            setUserToRemove(user.id);
                                                        }}
                                                        title="Remove User"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3">
                                {activeUsers.map((user) => (
                                    <div
                                        key={user.userId}
                                        className="border border-zinc-800 rounded-lg p-4 hover:bg-zinc-900/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                    <AvatarFallback className="bg-primary text-white text-sm">
                                                        {user.email?.[0]?.toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">
                                                        Member
                                                    </p>
                                                    <p className="text-xs text-zinc-500 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 h-8 w-8 flex-shrink-0"
                                                onClick={() => {
                                                    if (!user.id) {
                                                        toast.error("Cannot remove user: Missing ID");
                                                        return;
                                                    }
                                                    setUserToRemove(user.id);
                                                }}
                                                title="Remove User"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs">
                                            <span className="inline-block rounded-md px-2 py-1 bg-zinc-800/30 text-zinc-400">
                                                {user.role || "Project Member"}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-emerald-500">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                Active
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
