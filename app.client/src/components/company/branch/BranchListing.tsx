"use client";
import { MapPin, MoreHorizontal, Eye, Edit, Trash2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Branch } from "./types";

interface BranchListingTableProps {
  branches: Branch[];
  isLoading: boolean;
  onEdit: (branch: Branch) => void;
  onDelete: (branchId: string) => void;
  onDetails: (branch: Branch) => void;
  companyName: string;
}

export function BranchListingTable({
  branches,
  isLoading,
  onEdit,
  onDelete,
  onDetails,
  companyName,
}: BranchListingTableProps) {
  return (
    <Card className="shadow-xl border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800 p-6">
        <CardTitle className="flex items-center justify-between text-2xl font-bold text-gray-900 dark:text-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <span>{companyName} Sites</span>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary dark:text-blue-200 px-3 py-1.5 rounded-full text-sm font-semibold"
          >
            {branches.length} {branches.length === 1 ? "branch" : "branches"}
          </Badge>
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-2">
          View and manage all sites for {companyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400" />
            <p className="text-muted-foreground font-medium text-lg">
              Loading branches...
            </p>
          </div>
        ) : branches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
              <MapPin className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                No branches found
              </p>
              <p className="text-muted-foreground text-base">
                Get started by adding the first branch for {companyName}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="font-semibold px-6 py-3 dark:text-gray-300 text-left">
                    Company Sitt Name
                  </TableHead>
                  <TableHead className="font-semibold px-6 py-3 dark:text-gray-300 text-left">
                    Website
                  </TableHead>
                  <TableHead className="text-right font-semibold px-6 py-3 dark:text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow
                    key={branch.companySiteId}
                    className="border-b border-gray-100 dark:border-gray-800 dark:hover:bg-gray-850 transition-colors"
                  >
                    <TableCell className="font-medium px-6 py-3 text-gray-900 dark:text-gray-100">
                      {branch.name}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      {branch.website ? (
                        <a
                          href={branch.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Globe className="h-4 w-4" />
                          {branch.website.replace(
                            /^(https?:\/\/)?(www\.)?/,
                            ""
                          )}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right px-6 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDetails(branch)}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit(branch)}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(branch.companySiteId)}
                            className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
