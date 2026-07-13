"use client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";

import { FormFieldType } from "@/components/DynamicForm/types";
import { FormDataService } from "@/api/services/FormDataService";
import { toast } from "sonner";

export default function PreviewPage() {
  const params = useParams();
  const id = params?.id as string;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    name: string;
    fields: FormFieldType[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        if (id) {
          const response = await FormDataService.getFormDataById(id, "1");
          const form = response.data;
          if (form) {
            let fields = [];
            if (form.templateRow) {
              try {
                fields = JSON.parse(form.templateRow).fields || [];
              } catch (e) { }
            }
            setFormData({
              name: form.formLinkName || "Untitled Form",
              fields: fields,
            });
          }
        }
      } catch (error) {
        console.error("Error loading form:", error);
        toast.error("Failed to load form from server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading form preview...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p>Form not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 print:p-0">
      <div className="mb-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="print:border-none print:shadow-none">
        <CardHeader>
          <CardTitle className="text-center">{formData.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-center print:hidden">
        <Button onClick={handlePrint}>Print/Generate PDF</Button>
      </div>
    </div>
  );
}

function renderField(field: FormFieldType) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "phone":
      return (
        <div className="border-b-2 border-gray-300 py-2">
          {field.placeholder || "Enter your answer"}
        </div>
      );
    case "textarea":
      return (
        <div className="border-2 border-gray-300 rounded p-2 h-20">
          {field.placeholder || "Enter your answer"}
        </div>
      );
    case "select":
      return (
        <select className="w-full p-2 border rounded">
          {field.options?.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case "radioGroup":
      return (
        <div className="space-y-2">
          {field.options?.map((opt, i) => (
            <div key={i} className="flex items-center">
              <input type="radio" className="mr-2" />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>{field.label}</span>
        </div>
      );
    case "date":
      return (
        <div className="border-b-2 border-gray-300 py-2">
          {field.placeholder || "Select date"}
        </div>
      );
    case "file":
      return (
        <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
          Click to upload file
        </div>
      );
    default:
      return <div className="border-b-2 border-gray-300 py-2"></div>;
  }
}
