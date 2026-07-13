"use client";

import { useMemo, useState } from "react";
import { Trans } from "@lingui/react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { UserFormDialog } from "./UserFormDialog";
import {i18n} from '@lingui/core';
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
};

export const UserTable = () => {
  const [data, setData] = useState<User[]>(() => {
    const users: User[] = [];
    for (let i = 1; i <= 500; i++) {
      users.push({
        id: `${i}`,
        firstName: `John ${i}`,
        lastName: `Doe${i}`,
        age: `${20 + (i % 30)}`,
        gender: i % 2 === 0 ? i18n.t({id:"ui.Male",message:"Male"}) :  i18n.t({id:"ui.Female",message:"Female"}),
    
email: i18n.t({
  id: "user.email",
  message: "user{index}@example.com",
  values: { index: i }
}),
        phone: `90000${String(i).padStart(5, "0")}`,
      });
    }
    return users;
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((user) => user.id !== id));
  };

  const handleUpdate = (updatedUser: User) => {
    setData((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const openUpdateDialog = (user: User) => {
    setSelectedUser(user);
    setIsUpdateOpen(true);
  };

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "firstName", header: () => i18n.t({id:"ui.First Name",message:"First Name"}) },
    { accessorKey: "lastName", header: () =>i18n.t({id:"ui.Last Name",message:"Last Name"}) },
    { accessorKey: "age", header: () => i18n.t({id:"ui.Age",message:"Age"})  },
    {
      accessorKey: "gender",
      header:()=> i18n.t({id:"ui.Gender",message:"Gender"})  ,
      cell: ({ row }) => <Trans id={row.getValue("gender")} />,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        {i18n.t({id:"ui.Email",message:"Email"})} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    { accessorKey: "phone", header: ()=>i18n.t({id:"ui.Phone",message:"Phone"}) },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <>
            <Button variant="outline" onClick={() => openUpdateDialog(user)}>
              {i18n.t({id:"ui.Update",message:"Update"})}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                              {i18n.t({id:"ui.Delete",message:"Delete"})}

              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                                                 {i18n.t({id:"ui.Are you absolutely sure?",message:"Are you absolutely sure?"})}

                  </AlertDialogTitle>
                  <AlertDialogDescription>
                                                                    {i18n.t({id:"ui.This action cannot be undone",message:"This action cannot be undone"})}

                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                                                 {i18n.t({id:"ui.Cancel",message:"Cancel"})}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(user.id)}>
                                                 {i18n.t({id:"ui.Continue",message:"Continue"})}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full px-4 mt-8">
      <div className="flex flex-wrap gap-2 items-center py-4">
        <Input
          placeholder={i18n.t({id:"ui.Filter Emails",message:"Filter Emails..."})}
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddOpen(true)}>
         {i18n.t({id:"ui.Add",message:"Add"})}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
           {i18n.t({id:"ui.Columns",message:"Columns"})} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(value) => col.toggleVisibility(!!value)}
              >
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full rounded-md border">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24">
                      <Trans id="No results." />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {i18n.t({id:"ui.of",message:"of"})}{" "}
          {table.getFilteredRowModel().rows.length} {i18n.t({id:"ui.row(s) selected.",message:"row(s) selected."})} 
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
           {i18n.t({id:"ui.Previous",message:"Previous"})}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
                      {i18n.t({id:"ui.Next",message:"Next"})}

          </Button>
        </div>
      </div>

      {/* Add Dialog */}
      <UserFormDialog
        mode="add"
        open={isAddOpen}
        setOpen={setIsAddOpen}
        onSubmit={(newUser) => setData((prev) => [...prev, newUser])}
      />

      {/* Update Dialog */}
      <UserFormDialog
        mode="update"
        open={isUpdateOpen}
        setOpen={setIsUpdateOpen}
        onSubmit={handleUpdate}
        initialData={selectedUser!}
      />
    </div>
  );
};

export default UserTable;
