"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { FormFieldType, type FormFieldTypeEnum } from "../types";
import {
  FileInputIcon,
  TextIcon,
  CheckIcon,
  ListIcon,
  RadioIcon,
  CalendarIcon,
  ToggleRightIcon,
  ImageIcon,
  HashIcon,
  MailIcon,
  PhoneIcon,
  ClockIcon,
  ListOrderedIcon,
} from "lucide-react";

interface FieldPaletteItemProps {
  type: FormFieldTypeEnum;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const fieldCategories = [
  "Basic Inputs",
  "Selection Controls",
  "Date & Time",
  "Media",
  "Advanced",
];

const fieldPaletteItems: FieldPaletteItemProps[] = [
  // Basic Inputs
  {
    type: FormFieldType.Text,
    label: "Text Input",
    icon: <FileInputIcon className="h-4 w-4" />,
    category: "Basic Inputs",
  },
  {
    type: FormFieldType.Textarea,
    label: "Textarea",
    icon: <TextIcon className="h-4 w-4" />,
    category: "Basic Inputs",
  },
  {
    type: "email",
    label: "Email Input",
    icon: <MailIcon className="h-4 w-4" />,
    category: "Basic Inputs",
  },
  {
    type: "number",
    label: "Number Input",
    icon: <HashIcon className="h-4 w-4" />,
    category: "Basic Inputs",
  },
  {
    type: "phone",
    label: "Phone Input",
    icon: <PhoneIcon className="h-4 w-4" />,
    category: "Basic Inputs",
  },

  // Selection Controls
  {
    type: FormFieldType.Select,
    label: "Dropdown",
    icon: <ListIcon className="h-4 w-4" />,
    category: "Selection Controls",
  },
  {
    type: FormFieldType.Checkbox,
    label: "Checkbox",
    icon: <CheckIcon className="h-4 w-4" />,
    category: "Selection Controls",
  },
  {
    type: FormFieldType.RadioGroup,
    label: "Radio Group",
    icon: <RadioIcon className="h-4 w-4" />,
    category: "Selection Controls",
  },
  {
    type: "toggle",
    label: "Toggle Switch",
    icon: <ToggleRightIcon className="h-4 w-4" />,
    category: "Selection Controls",
  },
  {
    type: "multiselect",
    label: "Multi-Select",
    icon: <ListOrderedIcon className="h-4 w-4" />,
    category: "Selection Controls",
  },

  // Date & Time
  {
    type: "date",
    label: "Date Picker",
    icon: <CalendarIcon className="h-4 w-4" />,
    category: "Date & Time",
  },
  {
    type: "time",
    label: "Time Picker",
    icon: <ClockIcon className="h-4 w-4" />,
    category: "Date & Time",
  },
  {
    type: "datetime",
    label: "Date & Time",
    icon: <CalendarIcon className="h-4 w-4" />,
    category: "Date & Time",
  },

  // Media
  {
    type: "file",
    label: "File Upload",
    icon: <FileInputIcon className="h-4 w-4" />,
    category: "Media",
  },
  {
    type: "image",
    label: "Image Upload",
    icon: <ImageIcon className="h-4 w-4" />,
    category: "Media",
  },

  // Advanced
  {
    type: "section",
    label: "Section Header",
    icon: <TextIcon className="h-4 w-4" />,
    category: "Advanced",
  },
  {
    type: "divider",
    label: "Divider",
    icon: <div className="h-4 w-4 border-t-2 border-gray-400" />,
    category: "Advanced",
  },
];

interface FieldPaletteProps {
  onAdd?: (type: FormFieldTypeEnum, label: string) => void;
}

export function FieldPalette({ onAdd }: FieldPaletteProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredItems = fieldPaletteItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-full border-none bg-transparent shadow-none flex flex-col">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-xl font-bold tracking-tight">Components</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-white/10 focus-visible:ring-indigo-500/30 rounded-xl"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        {fieldCategories.map((category) => {
          const categoryFields = filteredItems.filter(
            (field) => field.category === category
          );

          if (categoryFields.length === 0) return null;

          return (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-xs font-bold  text-primary uppercase tracking-widest mb-3 px-1">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {categoryFields.map((item) => (
                  <DraggableFieldItem
                    key={item.type}
                    type={item.type}
                    label={item.label}
                    icon={item.icon}
                    onAdd={onAdd}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No matches found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DraggableFieldItem({
  type,
  label,
  icon,
  onAdd,
}: Omit<FieldPaletteItemProps, "category"> & { onAdd?: (type: FormFieldTypeEnum, label: string) => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${type}`,
    data: { type, label },
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 rounded-md border p-3 text-sm transition-colors hover:bg-muted/50 active:bg-muted relative"
    >
      {/* ✋ Drag handle - Icon and Label */}
      <div
        {...listeners}
        {...attributes}
        className="flex items-center gap-3 flex-1 cursor-grab active:cursor-grabbing"
      >
        <span className="flex-shrink-0 text-muted-foreground">{icon}</span>
        <span>{label}</span>
      </div>

      {/* ➕ Add button - Separate from drag handle */}
      {onAdd && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd(type, label);
          }}
          className="h-7 w-7 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm active:scale-90 transition-transform relative z-10"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
