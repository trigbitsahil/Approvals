"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Plus, Edit, Trash2, AlertCircle } from "lucide-react";

import { DepartmentService } from "@/api/services/DepartmentService";
import type { Department } from "@/api/models/Department";
import type { CreateDepartmentCommand } from "@/api/models/CreateDepartmentCommand";
import type { UpdateDepartmentCommand } from "@/api/models/UpdateDepartmentCommand";

const API_VERSION = "1.0";

export default function DepartmentList() {
  /* ───────── state ───────── */
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);

  const [form, setForm] = useState<CreateDepartmentCommand>({
    name: "",
    description: "",
    email: "",
  });

  /* ───────── fetch list ───────── */
  const load = () => {
    setLoading(true);
    DepartmentService.getApiVDepartment(API_VERSION)
      .then((res) => setDepartments(res.data ?? []))
      .catch(() => setError("Could not load departments."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  /* ───────── helpers ───────── */
  const resetForm = () => setForm({ name: "", description: "", email: "" });

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (d: Department) => {
    setEditing(d);
    setForm({
      name: d.name,
      description: d.description ?? "",
      email: d.email ?? "",
    });
    setEditOpen(true);
  };

  const closeDialogs = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setEditing(null);
  };

  // CRUD
  const createDept = () =>
    DepartmentService.postApiVDepartment(API_VERSION, form)
      .then(() => {
        closeDialogs();
        load();
      })
      .catch(() => setError("Failed to create department."));

  const updateDept = () => {
    if (!editing) return;
    const payload: UpdateDepartmentCommand = {
      departmentID: editing.departmentID,
      ...form,
    };
    DepartmentService.putApiVDepartment(API_VERSION, payload)
      .then(() => {
        closeDialogs();
        load();
      })
      .catch(() => setError("Failed to update department."));
  };

  const removeDept = (id: string) =>
    confirm("Delete this department?") &&
    DepartmentService.deleteApiVDepartment(id, API_VERSION)
      .then(load)
      .catch(() => setError("Failed to delete department."));

  /* ───────── render ───────── */
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Departments
            </h1>
            <p className="text-muted-foreground">
              Manage your organisation’s departments
            </p>
          </div>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          {/* create dialog */}
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription>
                Fill the details below to add a new department.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={closeDialogs}>
                Cancel
              </Button>
              <Button onClick={createDept}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* error */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Department List</span>
            <Badge variant="secondary">
              {departments.length} {departments.length === 1 ? "item" : "items"}
            </Badge>
          </CardTitle>
          <CardDescription>View and manage all departments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : departments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No departments found.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((d) => (
                    <TableRow key={d.departmentID}>
                      <TableCell>{d.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {d.description}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {d.email}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-sm text-muted-foreground">
                        {d.departmentID}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEdit(d)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeDept(d.departmentID)}
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

      {/* edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {editing && (
              <div className="grid gap-2">
                <Label className="text-sm text-muted-foreground">
                  Department ID
                </Label>
                <div className="px-3 py-2 bg-muted rounded-md font-mono text-sm">
                  {editing.departmentID}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialogs}>
              Cancel
            </Button>
            <Button onClick={updateDept} disabled={!form.name.trim()}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
