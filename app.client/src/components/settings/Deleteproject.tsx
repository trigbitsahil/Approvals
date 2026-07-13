"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteProjectProps {
  projectName?: string;

}

const DeleteProject = ({ projectName = "Project" }: DeleteProjectProps) => {
  const firstLetter =
    projectName && projectName.length > 0
      ? projectName.charAt(0).toUpperCase()
      : "P";

  const handleDelete = () => {
    console.log(`${projectName} deleted`);
  };

  return (
    <AlertDialog>
      <div className="bg-background text-foreground rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">Delete project</h2>

        <p className="text-sm text-muted-foreground mb-6">
          After deleting this project you will lose all related information
          including tasks, events, files, notes etc. You will not be able to
          recover it later, so think twice before doing this.
        </p>

        <AlertDialogTrigger asChild>
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium">
            <Trash2 size={16} />
            Delete project
          </button>
        </AlertDialogTrigger>
      </div>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Delete project
          </AlertDialogTitle>
        </AlertDialogHeader>

        <p className="text-sm text-muted-foreground mt-2">
          Are you sure you want to permanently delete this project?
        </p>

        <div className="flex items-center gap-3 bg-muted rounded-md p-3 mt-4">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-500 text-white text-sm font-medium">
            {firstLetter}
          </div>
          <span className="text-sm font-medium">{projectName}</span>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProject;
