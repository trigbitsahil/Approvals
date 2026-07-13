"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { FieldPalette } from "./fields-palette";
import { FormPreview, type FormPreviewHandle } from "../preview/FormPreviewPage";
import { FieldEditor } from "./field-editor";
import { FormFieldType, type FormField } from "../types";
import { toast } from "sonner";
import { ChevronLeft, Plus, Copy, Trash2, Download, Search, Globe, Settings, Send, XCircle, Layers, LayoutGrid, Pencil, Eye } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { FormDataService } from "@/api/services/FormDataService";

// Mobile detection hook
function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function FormBuilder() {
  const params = useParams();
  const id = params?.id as string;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const isMobile = useMobile();

  const [formId, setFormId] = useState<string>(id === "new" ? "new" : id || "new");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [formName, setFormName] = useState(location.state?.name || "Untitled Form");
  const [isPublished, setIsPublished] = useState(false);
  const [formLinkName, setFormLinkName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mobileTab, setMobileTab] = useState<"components" | "preview" | "editor">("preview");
  const [activeDragData, setActiveDragData] = useState<{ type: string; label: string } | null>(null);
  const formPreviewRef = useRef<FormPreviewHandle>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    const loadForm = async () => {
      try {
        if (id === "new") {
          setFormId("new");
          setFormName(location.state?.name || "Untitled Form");
          setFormFields([]);
          setSelectedFieldId(null);
          setIsInitialized(true);
          return;
        }
        if (id) {
          const response = await FormDataService.getFormDataById(id, "1");
          const formData = response.data;
          if (formData) {
            setFormId(formData.formDataId || id);
            setFormName(formData.formLinkName || "Untitled Form");
            setIsPublished(formData.isPublished || false);
            setFormLinkName(formData.formLinkName || "");
            if (formData.templateRow) {
              try {
                const parsed = JSON.parse(formData.templateRow);
                setFormFields(parsed.fields || []);
              } catch (e) {
                setFormFields([]);
              }
            }
            setIsInitialized(true);
          } else {
            toast.error("Form not found");
            navigate("/formbuilder/new", { replace: true });
          }
        }
      } catch (error) {
        toast.error("Failed to load form");
      }
    };
    if (!isInitialized) loadForm();
  }, [id, navigate, isInitialized]);

  // 🎯 Helper for numbering logic (from old code)
  const getNextFieldLabel = (baseLabel: string) => {
    const cleanBaseLabel = baseLabel.replace(/\s\d+$/, "");
    const sameTypeFields = formFields.filter(f => f.label?.startsWith(cleanBaseLabel));

    let nextNumber = 1;
    const existingNumbers = sameTypeFields
      .map(f => {
        const match = f.label?.match(/\s(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);

    if (existingNumbers.length > 0) {
      nextNumber = Math.max(...existingNumbers) + 1;
    } else if (sameTypeFields.length > 0) {
      // If there's already one field but it doesn't have a number, next should be 1 or 2?
      // Old code used nextNumber = 1 for the first copy.
      nextNumber = sameTypeFields.length;
    }

    return `${cleanBaseLabel} ${nextNumber}`;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragData(event.active.data.current as { type: string; label: string });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragData(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const isActiveField = activeId.startsWith("field-") || formFields.some(f => f.id === activeId);
    const isOverField = overId.startsWith("field-") || formFields.some(f => f.id === overId);

    if (isActiveField && isOverField && activeId !== overId) {
      setFormFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === activeId);
        const newIndex = items.findIndex((i) => i.id === overId);
        return arrayMove(items, oldIndex, newIndex);
      });
      return;
    }

    if (activeId.startsWith("draggable-") && (overId === "form-drop-area" || isOverField)) {
      const fieldType = active.data.current?.type as FormFieldType;
      const fieldLabel = active.data.current?.label as string;
      const isDivider = fieldType === FormFieldType.Divider;

      const newFieldLabel = isDivider ? undefined : getNextFieldLabel(fieldLabel);

      const newField: FormField = {
        id: `field-${crypto.randomUUID()}`,
        type: fieldType,
        label: newFieldLabel,
        placeholder: isDivider ? undefined : `Enter ${fieldLabel.toLowerCase()}`,
        required: false,
      };

      if ([FormFieldType.Select, FormFieldType.RadioGroup].includes(fieldType)) {
        newField.options = [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ];
      }

      setFormFields((prev) => {
        if (isOverField) {
          const overIndex = prev.findIndex((f) => f.id === overId);
          const newFields = [...prev];
          newFields.splice(overIndex + 1, 0, newField);
          return newFields;
        }
        return [...prev, newField];
      });
      setSelectedFieldId(newField.id);
    }
  };

  const handleDragCancel = () => setActiveDragData(null);

  const handleAddFieldByType = (type: FormFieldType, label: string) => {
    const isDivider = type === FormFieldType.Divider;
    const newFieldLabel = isDivider ? undefined : getNextFieldLabel(label);

    const newField: FormField = {
      id: `field-${crypto.randomUUID()}`,
      type: type,
      label: newFieldLabel,
      placeholder: isDivider ? undefined : `Enter ${label.toLowerCase()}`,
      required: false,
    };
    if ([FormFieldType.Select, FormFieldType.RadioGroup].includes(type)) {
      newField.options = [{ label: "Option 1", value: "option1" }, { label: "Option 2", value: "option2" }];
    }
    setFormFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
    toast.success(`${label} added`);
    if (isMobile) setMobileTab("preview");
  };

  const handleUpdateField = (updated: FormField) => {
    setFormFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleDuplicateField = (id: string) => {
    const fieldIndex = formFields.findIndex((f) => f.id === id);
    if (fieldIndex === -1) return;
    const fieldToClone = formFields[fieldIndex];

    // Logic from old code for numbering
    const baseLabel = fieldToClone.label?.replace(/\s\d+$/, "") || "Field";
    const newFieldLabel = getNextFieldLabel(baseLabel);

    const newField = {
      ...fieldToClone,
      id: `field-${crypto.randomUUID()}`,
      label: newFieldLabel
    };
    const updatedFields = [...formFields];
    updatedFields.splice(fieldIndex + 1, 0, newField);
    setFormFields(updatedFields);
    setSelectedFieldId(newField.id);
    toast.success("Field duplicated");
  };

  const handleDeleteField = (id: string) => {
    setFormFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedFieldId) return;
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key === "Backspace" || e.key === "Delete") handleDeleteField(selectedFieldId);
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        handleDuplicateField(selectedFieldId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFieldId, formFields]);

  const FieldEditorComponent = selectedFieldId ? (
    <FieldEditor
      field={formFields.find((f) => f.id === selectedFieldId)!}
      onUpdateField={handleUpdateField}
      onDeleteField={handleDeleteField}
    />
  ) : (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
      <div className="mb-4 rounded-full bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-slate-200/60 dark:ring-white/10">
        <Pencil className="h-8 w-8 text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No field selected</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Select a field to configure its properties.</p>
    </div>
  );

  const handleSaveForm = async () => {
    if (formPreviewRef.current) {
      setIsSaving(true);
      try {
        const success = await formPreviewRef.current.handleSaveForm();
        if (success) {
          // Success is already signaled by the toast in FormPreview
          const returnUrl = `/event${projectId ? `?projectId=${projectId}` : ""}`;
          setTimeout(() => navigate(returnUrl), 600);
        }
      } catch (error) {
        console.error("Save failed", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-white dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-2 sm:px-6 z-20">
        <div className="flex items-center gap-1.5 sm:gap-4 min-w-0">
          <button 
            onClick={() => {
              const returnUrl = `/event${projectId ? `?projectId=${projectId}` : ""}`;
              navigate(returnUrl);
            }} 
            className="flex items-center gap-1 px-1.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all group"
          >
            <ChevronLeft className="h-5 w-5 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            <span className="hidden sm:inline text-sm font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Back</span>
          </button>
          <div className="flex flex-col min-w-0">
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="text-[13px] sm:text-sm font-bold tracking-tight truncate bg-transparent border-none focus:ring-0 p-0 h-auto w-full max-w-[120px] sm:max-w-[200px] outline-none"
              placeholder="Untitled Form"
            />
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wide uppercase flex items-center gap-1">
              {isPublished ? <Globe className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-emerald-500" /> : <Layers className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-amber-500" />}
              {isPublished ? "Live" : "Draft"} <span className="hidden xs:inline">• workspace</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Button variant="outline" size="sm" onClick={() => formPreviewRef.current?.handlePublishForm()} className="rounded-xl border-slate-200 dark:border-white/10 h-8 sm:h-9 text-[11px] sm:text-xs font-semibold px-2 sm:px-4">
            {isPublished ? (isMobile ? "Update" : "Update Live") : "Publish"}
          </Button>
          <Button size="sm" onClick={handleSaveForm} className="rounded-xl h-8 sm:h-9 text-[11px] sm:text-xs font-semibold px-3 sm:px-5 shadow-lg shadow-primary/20">
            {isSaving ? "Saving..." : (isMobile ? "Save" : "Save Workspace")}
          </Button>
        </div>
      </header>

      <main className="relative h-[calc(100dvh-56px)] px-2 md:px-6 py-3 md:py-6 overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          {!isMobile ? (
            <div className="grid grid-cols-12 gap-6 h-full">
              <div className="md:col-span-3 h-full overflow-hidden rounded-[2rem] border border-slate-200/50 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-2xl shadow-xl transition-colors">
                <FieldPalette onAdd={handleAddFieldByType} />
              </div>

              <div className="md:col-span-6 h-full overflow-hidden flex flex-col">
                <div className="h-full overflow-y-auto custom-scrollbar rounded-[2rem] shadow-inner bg-slate-50 dark:bg-slate-900/40 p-1 border border-slate-200/50 dark:border-white/10">
                  <FormPreview
                    ref={formPreviewRef}
                    formId={formId}
                    formName={formName}
                    formFields={formFields}
                    isPublished={isPublished}
                    formLinkName={formLinkName}
                    selectedFieldId={selectedFieldId}
                    projectId={projectId}
                    onFieldClick={setSelectedFieldId}
                    onDuplicateField={handleDuplicateField}
                    onDeleteField={handleDeleteField}
                  />
                </div>
              </div>

              <div className="md:col-span-3 h-full overflow-hidden flex flex-col">
                <div className="h-full rounded-[2rem] border border-slate-200/50 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-2xl shadow-xl overflow-hidden transition-colors">
                  <AnimatePresence mode="wait">
                    <motion.div key={selectedFieldId || "empty"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full">
                      {FieldEditorComponent}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {mobileTab === "components" && (
                    <motion.div key="components" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }} className="h-full overflow-hidden rounded-[1.5rem] border border-slate-200/50 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-xl">
                      <FieldPalette onAdd={handleAddFieldByType} />
                    </motion.div>
                  )}
                  {mobileTab === "preview" && (
                    <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.18 }} className="h-full overflow-y-auto custom-scrollbar rounded-[1.5rem] shadow-inner bg-slate-50 dark:bg-slate-900/40 p-1 border border-slate-200/50 dark:border-white/10">
                      <FormPreview
                        ref={formPreviewRef}
                        formId={formId}
                        formName={formName}
                        formFields={formFields}
                        isPublished={isPublished}
                        formLinkName={formLinkName}
                        selectedFieldId={selectedFieldId}
                        projectId={projectId}
                        onFieldClick={(id) => { setSelectedFieldId(id); setMobileTab("editor"); }}
                        onDuplicateField={handleDuplicateField}
                        onDeleteField={handleDeleteField}
                      />
                    </motion.div>
                  )}
                  {mobileTab === "editor" && (
                    <motion.div key="editor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.18 }} className="h-full overflow-hidden rounded-[1.5rem] border border-slate-200/50 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-xl">
                      <AnimatePresence mode="wait">
                        <motion.div key={selectedFieldId || "empty"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
                          {FieldEditorComponent}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex shrink-0 mt-2 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg overflow-hidden">
                <button onClick={() => setMobileTab("components")} className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all", mobileTab === "components" ? "text-primary bg-primary/10" : "text-muted-foreground")}>
                  <LayoutGrid className="h-4 w-4" /> Components
                </button>
                <button onClick={() => setMobileTab("preview")} className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all border-x border-slate-200/50 dark:border-white/10", mobileTab === "preview" ? "text-primary bg-primary/10" : "text-muted-foreground")}>
                  <Eye className="h-4 w-4" /> Preview
                </button>
                <button onClick={() => setMobileTab("editor")} className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all", mobileTab === "editor" ? "text-primary bg-primary/10" : "text-muted-foreground")}>
                  <Pencil className="h-4 w-4" /> {selectedFieldId ? "Edit Field" : "Editor"}
                </button>
              </div>
            </div>
          )}

          <DragOverlay dropAnimation={null} zIndex={1000}>
            {activeDragData ? (
              <div className="flex items-center gap-3 rounded-2xl border-2 border-primary bg-white dark:bg-slate-900 p-4 shadow-2xl scale-110 rotate-2 cursor-grabbing overflow-hidden">
                <div className="bg-primary/10 dark:bg-primary/90 p-2 rounded-xl">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-lg tracking-tight truncate max-w-[150px]">{activeDragData.label}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
