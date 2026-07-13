"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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
} from "./fields/dynamic-fields";
import { FormFieldType, type FormField as DynamicFormField } from "./types";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { FormDataService } from "@/api/services/FormDataService";
import ReCAPTCHA from "react-google-recaptcha";
import { clientConfig } from "@/config/client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ShieldAlert, Lock, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { FormSubmissionService } from "@/api/services/FormSubmissionService";
import { DocumentsService } from "@/api/services/DocumentsService";

export default function PublicFormPage() {
  const { idOrName } = useParams();
  const [formFields, setFormFields] = useState<DynamicFormField[]>([]);
  const [formName, setFormName] = useState("Loading Form...");
  const [formDataId, setFormDataId] = useState<string | null>(null);
  const [alternateFormId, setAlternateFormId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        if (idOrName) {
          const response = await FormDataService.getFormDataById(idOrName, "1");
          const form = response.data;
          if (form) {
            setFormDataId(form.id || form.formDataId || idOrName);
            setAlternateFormId(form.alternateFormId || null);
            setIsPublished(form.isPublished || false);
            setFormName(form.formLinkName || "Untitled Form");
            if (form.templateRow) {
              try {
                const parsed = JSON.parse(form.templateRow);
                setFormFields(parsed.fields || []);
              } catch (e) {
                console.error("Error parsing templateRow:", e);
              }
            }
          } else {
            setError("Form not found");
          }
        }
      } catch (error) {
        console.error("Error loading form:", error);
        setError("Failed to load form. It might be private or deleted.");
      } finally {
        setIsLoading(false);
      }
    };
    loadForm();
  }, [idOrName]);

  // Generate schema dynamically
  const dynamicSchema = useMemo(() => {
    const schema: { [key: string]: z.ZodTypeAny } = {};
    formFields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case FormFieldType.Text:
        case FormFieldType.Textarea:
        case "email":
        case "phone": {
          fieldSchema = z.string({
            required_error: `${field.label} is required`,
          });
          if (field.required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
          }
          break;
        }
        case "number": {
          fieldSchema = z.preprocess(
            (val) => (val === "" ? undefined : Number(val)),
            field.required
              ? z.number({ required_error: `${field.label} is required` })
              : z.number().optional()
          );
          break;
        }
        case FormFieldType.Select:
        case FormFieldType.RadioGroup: {
          fieldSchema = z.string({
            required_error: `${field.label} is required`,
          });
          if (field.required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
          }
          break;
        }
        case FormFieldType.Checkbox:
        case "toggle": {
          fieldSchema = z.boolean();
          if (field.required) {
            fieldSchema = z.boolean().refine((val) => val === true, {
              message: `${field.label} must be checked`,
            });
          }
          break;
        }
        default:
          fieldSchema = z.any().optional();
      }

      if (!field.required && field.type !== "number" && field.type !== "recaptcha") {
        fieldSchema = fieldSchema.optional();
      }

      schema[field.id] = fieldSchema;
    });

    // Add hardcoded reCAPTCHA to schema
    schema["recaptcha"] = z.string({
      required_error: "Please complete the reCAPTCHA",
    }).min(1, "Please complete the reCAPTCHA");

    return z.object(schema);
  }, [formFields]);

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof dynamicSchema>) {
    console.log("Form values:", values);
    setIsLoading(true);
    try {
      const filePromises: Promise<any>[] = [];

      const isFile = (v: any) => v && typeof v === "object" && v.data && v.name;

      for (const key of Object.keys(values)) {
        const val = values[key];
        if (val) {
          if (Array.isArray(val)) {
            for (const f of val) {
              if (isFile(f)) {
                const base64Data = f.data.includes(',') ? f.data.split(',')[1] : f.data;
                filePromises.push(DocumentsService.postApiVDocuments("1", {
                  name: f.name,
                  url: f.data,
                  category: "FormData",
                  categoryId: formDataId || idOrName,
                  extension: f.type,
                  content: base64Data,
                  contentType: f.type,
                  documentFileName: f.name
                } as any));
              }
            }
          } else if (isFile(val)) {
            const base64Data = val.data.includes(',') ? val.data.split(',')[1] : val.data;
            filePromises.push(DocumentsService.postApiVDocuments("1", {
              name: val.name,
              url: val.data,
              category: "FormData",
              categoryId: formDataId || idOrName,
              extension: val.type,
              content: base64Data,
              contentType: val.type,
              documentFileName: val.name
            } as any));
          }
        }
      }

      if (filePromises.length > 0) {
        await Promise.all(filePromises);
      }

      const response = await FormSubmissionService.postApiVFormSubmission("1", {
        formDataId: formDataId || idOrName,
        alternateFormId: alternateFormId,
        jsonData: JSON.stringify(values),
      });

      if (response.success) {
        setIsSubmitted(true);
        toast.success("Form submitted successfully!");
      } else {
        toast.error(response.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !isPublished) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden">
            {/* Background Decorative element */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500" />

            <div className="h-24 w-24 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
              <ShieldAlert className="h-12 w-12 text-orange-600 dark:text-orange-400 -rotate-12" />
            </div>

            <h1 className="text-3xl font-black mb-4 tracking-tight">Form Unavailable</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {error || "This form is currently  not accepting responses."}
            </p>

            {/* <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-2xl h-12 border-slate-200 hover:bg-slate-50 transition-all font-semibold"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Link to="/" className="block">
                <Button className="w-full rounded-2xl h-12 shadow-lg shadow-primary/20 font-bold">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Button>
              </Link>
            </div> */}
          </div>

          <p className="text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            Secure Form Portal
          </p>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-white/10">
            <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground">Your response has been successfully submitted.</p>
            <Button
              className="mt-8 w-full rounded-full"
              onClick={() => window.location.reload()}
            >
              Submit Another Response
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.05] via-transparent to-transparent py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-800 p-0 gap-0">
            {/* 📝 Simplified Header with Primary Tint */}
            <div className="pt-5 pb-6 px-6 sm:pt-6 sm:pb-7 sm:px-8 border-b border-slate-100 dark:border-slate-800 bg-primary/10 dark:bg-primary/[0.05]">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1.5 flex items-center gap-2">
                <div className="h-6 w-1.5 bg-primary rounded-full" />
                {formName}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Please fill out the information below. All fields marked with * are required.
              </p>
            </div>

            <CardContent className="p-6 sm:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6">
                    {formFields.map((fieldConfig) => (
                      <FormField
                        key={fieldConfig.id}
                        control={form.control}
                        name={fieldConfig.id}
                        render={({ field }) => renderPublicField(fieldConfig, field)}
                      />
                    ))}
                  </div>

                  {/* 🛡️ Verification Section */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Verification</h4>
                        <p className="text-xs text-slate-500">Confirm you are human</p>
                      </div>
                      <FormField
                        control={form.control}
                        name="recaptcha"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              {clientConfig.recaptcha.key ? (
                                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                  <ReCAPTCHA
                                    sitekey={clientConfig.recaptcha.key}
                                    theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                                    onChange={field.onChange}
                                  />
                                </div>
                              ) : (
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500 text-xs rounded-lg flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  reCAPTCHA Key missing.
                                </div>
                              )}
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md active:scale-[0.99]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        "Submit Form"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>

  );
}

function renderPublicField(fieldConfig: DynamicFormField, field: any) {
  switch (fieldConfig.type) {
    case FormFieldType.Text:
      return <DynamicInput fieldConfig={fieldConfig} field={field} />;
    case FormFieldType.Textarea:
      return <DynamicTextarea fieldConfig={fieldConfig} field={field} />;
    case "email":
      return <DynamicInput fieldConfig={{ ...fieldConfig, type: "email" } as any} field={field} />;
    case "number":
      return <DynamicNumber fieldConfig={fieldConfig} field={field} />;
    case "phone":
      return <DynamicPhone fieldConfig={fieldConfig} field={field} />;
    case FormFieldType.Select:
      return <DynamicSelect fieldConfig={fieldConfig} field={field} />;
    case FormFieldType.Checkbox:
      return <DynamicCheckbox fieldConfig={fieldConfig} field={field} />;
    case "toggle":
      return <DynamicToggle fieldConfig={fieldConfig} field={field} />;
    case FormFieldType.RadioGroup:
      return <DynamicRadioGroup fieldConfig={fieldConfig} field={field} />;
    case "date":
      return <DynamicDate fieldConfig={fieldConfig} field={field} />;
    case "time":
      return <DynamicTime fieldConfig={fieldConfig} field={field} />;
    case "file":
    case "image":
      return <DynamicFile fieldConfig={fieldConfig} field={field} />;
    case "section":
      return <DynamicSection fieldConfig={fieldConfig} />;
    case "divider":
      return <DynamicDivider />;
    default:
      return <div className="text-sm text-destructive">Unsupported field type: {fieldConfig.type}</div>;
  }
}
