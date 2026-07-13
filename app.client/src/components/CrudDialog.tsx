"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Sparkles } from "lucide-react";
import type { FieldConfig } from "@/types1/crud";

type Props<T> = {
  fields: FieldConfig[];
  initialValues: Partial<T>;
  title: string;
  triggerLabel: string;
  onSubmit: (data: T) => Promise<void>;
  variant?: "add" | "edit";
};

export function CrudDialog<T>({
  fields,
  initialValues,
  title,
  triggerLabel,
  onSubmit,
  variant = "add",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<T>>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* sync when editing another row */
  useEffect(() => setFormData(initialValues), [initialValues, open]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData as T);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TriggerIcon = variant === "add" ? Plus : Edit;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant === "add" ? "default" : "outline"}
          size={variant === "add" ? "default" : "sm"}
          className={
            variant === "add"
              ? "bg-primary shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 transform hover:scale-105"
              : "hover:bg-blue-50 hover:text-blue-700 cursor-pointer hover:border-blue-300 transition-all duration-200"
          }
        >
          <TriggerIcon className="w-4 h-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl ">
        <DialogHeader className="space-y-3 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold to-slate-600 ">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((f, index) => (
            <div
              key={f.name}
              className="group space-y-2 animate-in slide-in-from-left-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Label
                htmlFor={f.name}
                className="text-sm font-semibold  group-focus-within:text-primary transition-colors"
              >
                {f.label}
              </Label>
              {f.type === "textarea" ? (
                <Textarea
                  id={f.name}
                  name={f.name}
                  value={(formData as any)[f.name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${f.label.toLowerCase()}…`}
                  className="min-h-[80px] resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300"
                />
              ) : (
                <Input
                  id={f.name}
                  type={f.type}
                  name={f.name}
                  value={(formData as any)[f.name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${f.label.toLowerCase()}…`}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 hover:bg-slate-50 cursor-pointer transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl cursor-pointer  transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
