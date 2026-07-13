"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FieldConfig } from "@/types1/crud";

export function CrudForm<T>({
  fields,
  initialValues = {},
  onSubmit,
}: {
  fields: FieldConfig[];
  initialValues?: Partial<T>;
  onSubmit: (data: T) => void;
}) {
  const [formData, setFormData] = useState<Partial<T>>(initialValues);

  /* 🔑 Sync when a new item is chosen for editing */
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData as T);
  };

  return (
    <Card className="border-0 shadow-none bg-gradient-to-br from-slate-50/50 to-white">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map((f, index) => (
              <div
                key={f.name}
                className={`group space-y-2 ${
                  f.type === "textarea" ? "md:col-span-2" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Label
                  htmlFor={f.name}
                  className="text-sm font-semibold text-slate-700 group-focus-within:text-blue-600 transition-colors"
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
                    className="min-h-[100px] resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300"
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
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
