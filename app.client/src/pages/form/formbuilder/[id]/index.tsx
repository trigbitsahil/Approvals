"use client";

import React, { useEffect, useState } from "react";
import type { TemplateType } from "@/types/FormTemplateTypes";
import FormBuilder from "@/components/FormBuilder/FormBuilder";

interface FormBuilderPageProps {
  params: {
    id: string;
  };
}

const FormBuilderPage: React.FC<FormBuilderPageProps> = ({ params }) => {
  const { id } = params;

  const [template, setTemplate] = useState<TemplateType | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [formLinkName, setFormLinkName] = useState<string>("");

  useEffect(() => {
    // Mock simulated API call (replace with localStorage, Redux, or mock object)
    const fakeResponse = {
      templateRow: JSON.stringify({
        id,
        formName: "Mock Form",
        createdAt: Date.now(),
        creator: "Sahil",
        formLayoutComponents: [],
        lastPublishedAt: Date.now(),
        publishHistory: [],
        publishStatus: "draft",
        updatedAt: Date.now(),
      }),
      isPublished: true,
      formLinkName: "mock-form-link",
    };

    try {
      const parsedTemplate = JSON.parse(fakeResponse.templateRow);
      setTemplate(parsedTemplate);
      setIsPublished(fakeResponse.isPublished);
      setFormLinkName(fakeResponse.formLinkName);
    } catch (err) {
      console.error("Failed to parse template JSON:", err);
    }
  }, [id]);

  const defaultForm: TemplateType = {
    id: "0",
    formName: "",
    createdAt: 0,
    creator: "",
    formLayoutComponents: [],
    lastPublishedAt: 0,
    publishHistory: [],
    publishStatus: "draft",
    updatedAt: 0,
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading form builder...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <FormBuilder
        template={template ?? defaultForm}
        isPublished={isPublished}
        formLinkName={formLinkName}
      />
    </div>
  );
};

export default FormBuilderPage;
