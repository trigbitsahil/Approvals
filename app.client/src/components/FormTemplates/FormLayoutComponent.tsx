"use client";
import React, { type FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import NewFormLinkNameComponent from "./NewFormLinkName";
import { useAppDispatch } from "../../redux/hooks";
import { deleteTemplate } from "../../redux/entities/formBuilderEntity";
import useFormPreview from "../FormBuilder/hooks/useFormPreview";
import useModalStrip from "@/global-hooks/useModalStrip";
import type { TemplateType } from "../../types/FormTemplateTypes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { List, Eye, Trash2, ImagePlus, FileEdit, Copy } from "lucide-react";

interface FormLayoutComponentProps {
  isPublished?: boolean;
  formId?: string;
  formLinkName?: string;
  template?: TemplateType;
  createdFormLayout: boolean;
  setOpenDialog?: (arg: boolean) => void;
}

const FormLayoutComponent: FunctionComponent<FormLayoutComponentProps> = (
  props
) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showModalStrip } = useModalStrip();
  const [openD, setOpenD] = useState(false);

  const {
    template,
    createdFormLayout,
    setOpenDialog,
    formId,
    formLinkName,
    isPublished,
  } = props;

  const { showPreview, openPreviewDrawer, closePreviewDrawer } =
    useFormPreview();

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      showModalStrip("success", "Link copied to clipboard", 3000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const handleOpenLinkModal = useCallback(() => {
    setOpenD((prev) => !prev);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenD(false);
  }, []);

  if (!createdFormLayout) {
    return (
      <Card
        className="h-48 w-full cursor-pointer border-2 border-dashed bg-transparent hover:border-primary hover:bg-accent/20 transition-colors"
        onClick={() => setOpenDialog?.(true)}
      >
        <CardContent className="flex h-full flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PlusIcon className="h-8 w-8" />
          </div>
          <p className="mt-4 text-sm font-medium">Blank Form</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="relative pb-2">
          <CardTitle className="truncate text-lg">
            {template?.formName}
          </CardTitle>
          {isPublished && (
            <span className="absolute right-4 top-4 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              Published
            </span>
          )}
        </CardHeader>

        <CardContent className="flex h-32 items-center justify-center bg-gray-50">
          <div className="text-4xl text-gray-400">
            <i className="fas fa-journal-whills" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between space-x-2 p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this template?")
                  ) {
                    dispatch(deleteTemplate(template?.id ?? ""));
                    showModalStrip(
                      "success",
                      "Form deleted successfully",
                      5000
                    );
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                disabled={isPublished}
                onClick={() => navigate(`/posterbuilder/${formId}`)}
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Media</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => window.open(`/preview/${formId}`, "_blank")}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate(`/formSubmission/${formId}`)}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Submissions</TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>

      <Dialog open={openD} onOpenChange={setOpenD}>
        <DialogContent>
          <NewFormLinkNameComponent
            open={openD}
            setOpenDialog={handleCloseDialog}
            formId={formId!}
          />
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default FormLayoutComponent;
