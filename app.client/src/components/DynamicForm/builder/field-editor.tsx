"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type FormField,
  type FormFieldOption,
  FormFieldType,
  type SelectField,
  type RadioGroupField,
  type MultiSelectField,
} from "../types";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

interface FieldEditorProps {
  field: FormField | null;
  onUpdateField: (field: FormField) => void;
  onDeleteField: (id: string) => void;
}

export function FieldEditor({
  field,
  onUpdateField,
  onDeleteField,
}: FieldEditorProps) {
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");

  if (!field) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Field Properties</CardTitle>
          <CardDescription>
            Select a field on the form to edit its properties.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-100px)] items-center justify-center text-muted-foreground">
          No field selected.
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdateField({ ...field, [e.target.name]: e.target.value } as FormField);
  };

  const handleSwitchChange = (checked: boolean) => {
    onUpdateField({ ...field, required: checked } as FormField);
  };

  const handleAddOption = () => {
    if (newOptionLabel.trim() && newOptionValue.trim()) {
      const newOption: FormFieldOption = {
        label: newOptionLabel.trim(),
        value: newOptionValue.trim(),
      };
      const currentOptions =
        (field as SelectField | RadioGroupField | MultiSelectField).options || [];
      onUpdateField({
        ...field,
        options: [...currentOptions, newOption],
      } as FormField);
      setNewOptionLabel("");
      setNewOptionValue("");
    }
  };

  const handleDeleteOption = (index: number) => {
    const currentOptions =
      (field as SelectField | RadioGroupField | MultiSelectField).options || [];
    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    onUpdateField({
      ...field,
      options: updatedOptions,
    } as FormField);
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">Edit Field: {field.label || field.type}</CardTitle>
        <CardDescription>
          Modify the properties of the selected form field.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {field.type !== FormFieldType.Divider && (
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              name="label"
              value={field.label || ""}
              onChange={handleInputChange}
              placeholder="Enter field label"
            />
          </div>
        )}
        {field.type !== FormFieldType.Divider && (
          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            {field.type === FormFieldType.Textarea ? (
              <Textarea
                id="placeholder"
                name="placeholder"
                value={field.placeholder || ""}
                onChange={handleInputChange}
                placeholder="Enter placeholder text"
              />
            ) : (
              <Input
                id="placeholder"
                name="placeholder"
                value={field.placeholder || ""}
                onChange={handleInputChange}
                placeholder="Enter placeholder text"
              />
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Required</Label>
          <Switch
            id="required"
            checked={field.required || false}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        {/* ── Number: Min / Max / Step ── */}
        {field.type === FormFieldType.Number && (
          <>
            <Separator />
            <h3 className="text-sm font-semibold text-primary">Number Constraints</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="min" className="text-xs">Min</Label>
                <Input
                  id="min"
                  name="min"
                  type="number"
                  value={(field as any).min ?? ""}
                  onChange={(e) =>
                    onUpdateField({
                      ...field,
                      min: e.target.value === "" ? undefined : Number(e.target.value),
                    } as FormField)
                  }
                  placeholder="e.g. 0"
                />
              </div>
              <div>
                <Label htmlFor="max" className="text-xs">Max</Label>
                <Input
                  id="max"
                  name="max"
                  type="number"
                  value={(field as any).max ?? ""}
                  onChange={(e) =>
                    onUpdateField({
                      ...field,
                      max: e.target.value === "" ? undefined : Number(e.target.value),
                    } as FormField)
                  }
                  placeholder="e.g. 100"
                />
              </div>
              <div>
                <Label htmlFor="step" className="text-xs">Step</Label>
                <Input
                  id="step"
                  name="step"
                  type="number"
                  value={(field as any).step ?? ""}
                  onChange={(e) =>
                    onUpdateField({
                      ...field,
                      step: e.target.value === "" ? undefined : Number(e.target.value),
                    } as FormField)
                  }
                  placeholder="e.g. 1"
                />
              </div>
            </div>
          </>
        )}

        {/* ── Textarea: Rows ── */}
        {field.type === FormFieldType.Textarea && (
          <>
            <Separator />
            <h3 className="text-sm font-semibold text-primary">Textarea Settings</h3>
            <div>
              <Label htmlFor="rows" className="text-xs">Rows (height)</Label>
              <Input
                id="rows"
                name="rows"
                type="number"
                min={1}
                max={20}
                value={(field as any).rows ?? 3}
                onChange={(e) =>
                  onUpdateField({
                    ...field,
                    rows: e.target.value === "" ? 3 : Number(e.target.value),
                  } as FormField)
                }
                placeholder="3"
              />
            </div>
          </>
        )}

        {/* ── File / Image: Accept & Multiple ── */}
        {(field.type === FormFieldType.File || field.type === "image") && (
          <>
            <Separator />
            <h3 className="text-sm font-semibold text-primary">File Settings</h3>
            <div>
              <Label htmlFor="accept" className="text-xs">Accepted File Types</Label>
              <Input
                id="accept"
                name="accept"
                value={(field as any).accept ?? ""}
                onChange={(e) =>
                  onUpdateField({ ...field, accept: e.target.value } as FormField)
                }
                placeholder="e.g. image/*, application/pdf"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated MIME types or extensions (e.g. <code>.pdf,.docx</code>)
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="multiple" className="text-xs">Allow Multiple Files</Label>
              <Switch
                id="multiple"
                checked={(field as any).multiple ?? false}
                onCheckedChange={(checked) =>
                  onUpdateField({ ...field, multiple: checked } as FormField)
                }
              />
            </div>
          </>
        )}

        {(field.type === FormFieldType.Select ||
          field.type === FormFieldType.RadioGroup ||
          field.type === FormFieldType.MultiSelect) && (
          <>
            <Separator />
            <h3 className="text-md font-semibold text-primary">Options</h3>
            <div className="space-y-2">
              {(field as SelectField | RadioGroupField | MultiSelectField).options?.map(
                (option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option.label}
                      onChange={(e) => {
                        const updatedOptions = [
                          ...((field as SelectField | RadioGroupField | MultiSelectField)
                            .options || []),
                        ];
                        updatedOptions[index] = {
                          ...updatedOptions[index],
                          label: e.target.value,
                        };
                        onUpdateField({
                          ...field,
                          options: updatedOptions,
                        } as FormField);
                      }}
                      placeholder="Option Label"
                    />
                    <Input
                      value={option.value}
                      onChange={(e) => {
                        const updatedOptions = [
                          ...((field as SelectField | RadioGroupField | MultiSelectField)
                            .options || []),
                        ];
                        updatedOptions[index] = {
                          ...updatedOptions[index],
                          value: e.target.value,
                        };
                        onUpdateField({
                          ...field,
                          options: updatedOptions,
                        } as FormField);
                      }}
                      placeholder="Option Value"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteOption(index)}
                    >
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )
              )}
              <div className="flex items-center gap-2">
                <Input
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  placeholder="New Option Label"
                />
                <Input
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder="New Option Value"
                />
                <Button variant="outline" size="icon" onClick={handleAddOption}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator />
        <Button
          variant="destructive"
          className=""
          onClick={() => onDeleteField(field.id)}
        >
          Delete Field
        </Button>
      </CardContent>
    </Card>
  );
}
