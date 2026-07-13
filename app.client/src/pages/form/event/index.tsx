"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllTemplates } from "@/redux/entities/formBuilderEntity";
import type { TemplateType } from "@/types/FormTemplateTypes";
import FormLayoutComponent from "@/components/FormTemplates/FormLayoutComponent";
import NewFormDialogComponent from "@/components/FormTemplates/NewFormDialogComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";

const parseJSON = (jsonData: string): TemplateType => JSON.parse(jsonData);

const TemplatesPage = () => {
  const templates = useAppSelector(
    (state) => state.entities.formBuilder.allTemplates
  );
  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (templates.length === 0) {
      dispatch(getAllTemplates());
    }
  }, [dispatch, templates.length]);

  const filteredTemplates = templates.filter((template) =>
    template.formName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold">Form Templates</h1>
        <div className="flex w-full items-center space-x-2 md:w-auto">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search forms..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setOpenDialog(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <FormLayoutComponent
          createdFormLayout={false}
          setOpenDialog={setOpenDialog}
        />

        {filteredTemplates.map((template) => (
          <FormLayoutComponent
            key={template.id}
            isPublished={template.isPublished}
            formId={template.id}
            formLinkName={template.formLinkName}
            template={template}
            createdFormLayout={true}
          />
        ))}
      </div>

      <NewFormDialogComponent
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </div>
  );
};

export default TemplatesPage;
