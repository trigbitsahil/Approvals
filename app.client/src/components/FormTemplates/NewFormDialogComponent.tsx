"use client";
import React, { type FunctionComponent, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { addTemplate } from "@/redux/entities/formBuilderEntity";
import useModalStrip from "@/global-hooks/useModalStrip";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NewFormDialogComponentProps {
  openDialog: boolean;
  setOpenDialog: (arg: boolean) => void;
}

const NewFormDialogComponent: FunctionComponent<
  NewFormDialogComponentProps
> = ({ openDialog, setOpenDialog }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModalStrip } = useModalStrip();
  const [creatingForm, setCreatingForm] = useState(false);
  const [formName, setFormName] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim() === "") {
      showModalStrip("danger", "Form name cannot be empty", 5000);
      return;
    }

    setCreatingForm(true);
    try {
      const template = await dispatch(addTemplate({ formName })).unwrap();
      navigate(`/formbuilder/${template.id}`);
    } catch (error) {
      showModalStrip(
        "danger",
        "Error occurred while creating a new Form",
        5000
      );
    } finally {
      setCreatingForm(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Enter a name for your new form template
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="formName" className="block text-sm font-medium">
              Form Name
            </label>
            <Input
              id="formName"
              name="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDialog(false)}
              disabled={creatingForm}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creatingForm}>
              {creatingForm ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Form"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFormDialogComponent;
