import React, { useEffect, useState, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import {
  DynamicCheckbox,
  DynamicInput,
  DynamicRadioGroup,
  DynamicSelect,
  DynamicTextarea,
  DynamicEmail,
  DynamicNumber,
  DynamicPhone,
  DynamicDate,
  DynamicTime,
  DynamicFile,
  DynamicToggle,
  DynamicSection,
  DynamicDivider,
} from "../fields/dynamic-fields";
import ReCAPTCHA from "react-google-recaptcha";
import { clientConfig } from "@/config/client";
import { FormFieldType, type FormField as DynamicFormField } from "../types";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FormDataService } from "@/api/services/FormDataService";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Trash2,
  GripVertical,
  PlusCircle,
  Layers,
  MousePointer2
} from "lucide-react";

interface FormPreviewProps {
  formId?: string;
  formName: string;
  formFields: DynamicFormField[];
  selectedFieldId: string | null;
  projectId?: string | null;
  onFieldClick: (id: string) => void;
  onDuplicateField?: (id: string) => void;
  onDeleteField?: (id: string) => void;
  onSaveForm?: (formData: any) => void;
  isPublished?: boolean;
  formLinkName?: string;
}

export interface FormPreviewHandle {
  handleSaveForm: () => Promise<boolean>;
  handlePublishForm: (slug?: string) => Promise<boolean>;
}

export const FormPreview = React.forwardRef<FormPreviewHandle, FormPreviewProps>((props, ref) => {
  const {
    formId,
    formName = "Untitled Form",
    formFields: initialFormFields = [],
    onFieldClick,
    onDuplicateField,
    onDeleteField,
    selectedFieldId,
    onSaveForm,
    isPublished = false,
    formLinkName: parentFormLinkName = "",
  } = props;
  const [formFields, setFormFields] =
    useState<DynamicFormField[]>(initialFormFields);
  const [savedValues, setSavedValues] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const { setNodeRef, isOver } = useDroppable({
    id: "form-drop-area",
    data: {
      accepts: [
        "text",
        "textarea",
        "select",
        "checkbox",
        "radioGroup",
        "email",
        "number",
        "phone",
        "toggle",
        "multiselect",
        "date",
        "time",
        "datetime",
        "file",
        "image",
        "section",
        "divider",
      ],
    },
  });





  // Sync with parent component when formFields prop changes
  useEffect(() => {
    setFormFields(initialFormFields);
  }, [initialFormFields]);



  // Generate schema dynamically based on current form fields
  const dynamicSchema = useMemo(() => {
    const schema: { [key: string]: z.ZodTypeAny } = {};
    formFields.forEach((field) => {
      // In Preview/Builder mode, we make everything optional 
      // so the user isn't blocked by validation errors while building.
      schema[field.id] = z.any().optional();
    });

    return z.object(schema);
  }, [formFields]);

  // Generate default values based on current form fields and saved values
  const defaultValues = useMemo(() => {
    return formFields.reduce(
      (acc, field) => {
        // Use saved value if available, otherwise use default
        if (savedValues[field.id] !== undefined) {
          acc[field.id] = savedValues[field.id];
        } else if (
          field.type === FormFieldType.Checkbox ||
          field.type === "toggle"
        ) {
          acc[field.id] = false;
        } else if (
          field.type === FormFieldType.Select ||
          field.type === "radioGroup" ||
          field.type === "multiselect"
        ) {
          acc[field.id] = "";
        } else {
          acc[field.id] = "";
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [formFields, savedValues]);

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues,
  });

  // Reset form when fields change
  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  function onSubmit(values: z.infer<typeof dynamicSchema>) {
    console.log("Form submitted:", values);

  }

  // 🏗️ Expose save method to parent
  React.useImperativeHandle(ref, () => {
    const performSave = async (publishedStatus: boolean, slug?: string) => {
      // 🟡 Enforce Validation - Check if all required fields are filled
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Form validation failed. Please check all required fields.");
        return false;
      }

      const currentValues = form.getValues();
      const templateRowString = JSON.stringify({
        fields: formFields,
        values: currentValues,
      });

      try {
        const isUpdate = formId && formId !== "new";
        const finalFormLinkName = slug || formName || parentFormLinkName;

        if (isUpdate) {
          await FormDataService.putApiVFormData("1", {
            formDataId: formId,
            formLinkName: finalFormLinkName,
            formLinkDescription: finalFormLinkName,
            templateRow: templateRowString,
            isPublished: publishedStatus,
            formType: "Dynamic",
            alternateFormId: crypto.randomUUID(),
            // @ts-ignore
            category: props.projectId ? "Project" : "Dynamic",
            categoryId: props.projectId || "0",
          });
          toast.success(publishedStatus ? "Form Published Successfully" : "Form Updated Successfully");
        } else {
          await FormDataService.postApiVFormData("1", {
            formLinkName: finalFormLinkName,
            formLinkDescription: finalFormLinkName,
            templateRow: templateRowString,
            isPublished: publishedStatus,
            formType: "Dynamic",
            alternateFormId: crypto.randomUUID(),
            // @ts-ignore
            category: props.projectId ? "Project" : "Dynamic",
            categoryId: props.projectId || "0",
          });
          toast.success(publishedStatus ? "Form Created & Published Successfully" : "Form Created Successfully");
        }

        if (onSaveForm) {
          onSaveForm({ id: formId, name: formName, fields: formFields, values: currentValues, isPublished: publishedStatus, formLinkName: finalFormLinkName });
        }
        return true;
      } catch (error) {
        console.error("Error saving form:", error);
        toast.error("Failed to save form to server");
        return false;
      }
    };

    return {
      handleSaveForm: () => performSave(isPublished),
      handlePublishForm: (slug?: string) => performSave(true, slug),
    };
  });

  // Save form with current values
  const handleSaveForm = async () => {
    return await (ref as any).current.handleSaveForm();
  };

  const handleFieldClick = (fieldId: string) => {
    if (onFieldClick) {
      onFieldClick(fieldId);
    }
  };

  // ✅ Memoize field IDs to prevent SortableContext from re-calculating unnecessarily
  const fieldIds = useMemo(() => formFields.map((f) => f.id), [formFields]);

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "min-h-full border-none shadow-none bg-transparent",
        isOver && "ring-2 ring-dashed ring-primary",
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg">Form Preview</CardTitle>
        <CardDescription>
          This is a preview of your form. Drag fields here to add them.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-visible relative pb-20">
        {formFields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] backdrop-blur-sm m-4 rounded-[1.5rem] border border-dashed border-primary dark:border-primary">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl ring-1 ring-black/5">
                <Layers className="h-12 w-12 text-primary" />
              </div>
              <PlusCircle className="absolute -bottom-2 -right-2 h-8 w-8 text-primary bg-white dark:bg-slate-800 rounded-full p-1 shadow-lg" />
            </div>

            <h3 className="text-xl font-bold tracking-tight mb-2">Build Your Masterpiece</h3>
            <p className="text-muted-foreground text-center max-w-[280px] text-sm leading-relaxed px-4">
              {isOver
                ? "Release to add the component!"
                : "Drag elements from the left panel and drop them here to start building your custom form."}
            </p>

            {!isOver && (
              <div className="mt-8 flex gap-3 text-xs font-medium text-primary   px-4 py-2 rounded-full ring-1 ring-primary/10 dark:ring-primary">
                <MousePointer2 className="h-3 w-3" />
                <span>Drag & Drop Enabled</span>
              </div>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
              <SortableContext
                items={fieldIds}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  {formFields.map((fieldConfig) => {
                    const DynamicComponent = renderDynamicField(fieldConfig);
                    return (
                      <motion.div
                        key={fieldConfig.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SortableFormField
                          fieldConfig={fieldConfig}
                          onFieldClick={handleFieldClick}
                          onDuplicate={() => onDuplicateField?.(fieldConfig.id)}
                          onDelete={() => onDeleteField?.(fieldConfig.id)}
                          selectedFieldId={selectedFieldId}
                          form={form}
                          DynamicComponent={DynamicComponent}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </SortableContext>

              {/* Hardcoded reCAPTCHA like in hiring portal */}
              <div className="mt-8 pt-6 border-t border-dashed border-primary/10">
                {clientConfig.recaptcha.key ? (
                  <ReCAPTCHA
                    sitekey={clientConfig.recaptcha.key}
                    onChange={() => { }}
                  />
                ) : (
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-sm font-medium">
                    reCAPTCHA Site Key missing. Please set VITE_RECAPTCHA_KEY in your .env file.
                  </div>
                )}
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
});

FormPreview.displayName = "FormPreview";

// 🟢 Move helper components OUTSIDE to prevent infinite re-render loops
const renderDynamicField = (fieldConfig: DynamicFormField) => {
  switch (fieldConfig.type) {
    case FormFieldType.Text:
      return DynamicInput;
    case FormFieldType.Textarea:
      return DynamicTextarea;
    case "email":
      return DynamicEmail;
    case "number":
      return DynamicNumber;
    case "phone":
      return DynamicPhone;
    case FormFieldType.Select:
    case "multiselect":
      return DynamicSelect;
    case FormFieldType.Checkbox:
      return DynamicCheckbox;
    case "toggle":
      return DynamicToggle;
    case FormFieldType.RadioGroup:
      return DynamicRadioGroup;
    case "date":
      return DynamicDate;
    case "time":
      return DynamicTime;
    case "file":
    case "image":
      return DynamicFile;
    case "section":
      return DynamicSection;
    case "divider":
      return DynamicDivider;
    default:
      return () => (
        <div className="text-sm text-muted-foreground">
          Field type "{fieldConfig.type}" is not yet implemented
        </div>
      );
  }
};

const SortableFormField = ({
  fieldConfig,
  onFieldClick,
  onDuplicate,
  onDelete,
  selectedFieldId,
  form,
  DynamicComponent,
}: {
  fieldConfig: DynamicFormField;
  onFieldClick: (id: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  selectedFieldId?: string | null;
  form: any;
  DynamicComponent: any;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: fieldConfig.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-2xl border transition-all duration-200",
        "bg-white dark:bg-slate-800/80 backdrop-blur-sm",
        "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
        selectedFieldId === fieldConfig.id
          ? "border-primary ring-4 ring-primary/10 shadow-2xl shadow-primary/10 z-10"
          : "border-slate-200/60 dark:border-white/10 shadow-sm",
        isDragging && "opacity-0 invisible"
      )}
      onClick={() => onFieldClick(fieldConfig.id)}
    >
      {/* 🛠 Field Action Toolbar */}
      <div className={cn(
        "absolute -top-3 right-4 flex gap-1 transition-all duration-200 z-20",
        selectedFieldId === fieldConfig.id || "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
      )}>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
          title="Duplicate Field"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive text-white shadow-lg hover:bg-destructive/90 transition-colors"
          title="Remove Field"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-6">
        <div
          {...attributes}
          {...listeners}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/30 hover:text-primary cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="pl-6 pt-1">
          <FormField
            control={form.control}
            name={fieldConfig.id}
            render={({ field }) => (
              <DynamicComponent fieldConfig={fieldConfig} field={field} />
            )}
          />
        </div>
      </div>
    </div>
  );
};
