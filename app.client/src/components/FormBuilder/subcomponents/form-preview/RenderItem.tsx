"use client";

import React, { type FC, useCallback, useState } from "react";
import { type FormLayoutComponentChildrenType } from "../../../../types/FormTemplateTypes";
import { FormControlNames } from "@/utils/formBuilderUtils";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface RenderItemProps {
  item: FormLayoutComponentChildrenType;
  onSelectedFile: (file: File) => void;
  selectedFile: File | null;
}

const RenderItem: FC<RenderItemProps> = ({ item, onSelectedFile }) => {
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  const maxFileSize = 10 * 1024 * 1024;

  const handleFileChange = async (e: any) => {
    setFileError(null);
    const file = e.target.files?.[0] || null;

    try {
      if (file && file.size > maxFileSize) {
        throw new Error("File size exceeds 10 MB");
      }
      onSelectedFile(file);
    } catch (error: any) {
      setFileError(error.message);
    }
  };

  const handleCheckListChange = useCallback(
    (_: React.SyntheticEvent, checked: boolean) => {
      setCount((prev) => (checked ? prev + 1 : prev - 1));
    },
    []
  );

  switch (item.controlName) {
    case FormControlNames.INPUTTEXTFIELD:
    case FormControlNames.INPUTEMAILFIELD:
    case FormControlNames.INPUTNUMBERFIELD:
      return (
        <Input
          type={item.dataType}
          name={item.labelName}
          required={item.required}
          placeholder={item.placeholder}
          className="w-full"
        />
      );

    case FormControlNames.INPUTMULTILINE:
      return (
        <Textarea
          name={item.labelName}
          required={item.required}
          rows={item.rows}
          placeholder={item.placeholder}
          className="w-full"
        />
      );

    case FormControlNames.CHECKBOX:
      return (
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id={item.id}
            name={item.labelName}
            required={item.required}
          />
          <Label htmlFor={item.id}>{item.placeholder}</Label>
        </div>
      );

    case FormControlNames.RADIOGROUP:
      return (
        <RadioGroup name={item.labelName} className="flex space-x-4 mt-2">
          {item.items?.map((i) => (
            <div key={i.value} className="flex items-center space-x-2">
              <RadioGroupItem value={i.value} id={i.value} />
              <Label htmlFor={i.value}>{i.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );

    case FormControlNames.SELECTDROPDOWN:
    case FormControlNames.UNIVERSITYDROPDOWN:
      return (
        <Select name={item.labelName} required={item.required}>
          <SelectTrigger className="w-full">{item.labelName}</SelectTrigger>
          <SelectContent>
            {item.items?.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case FormControlNames.MULTISELECT:
      return (
        <div>
          <Label>{item.labelName}</Label>
          <div className="flex flex-wrap gap-2 border rounded p-2 min-h-[40px]">
            {multiSelect.map((value) => (
              <span
                key={value}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
              >
                {value}
              </span>
            ))}
          </div>
          <select
            multiple
            className="w-full border rounded mt-2"
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions).map(
                (o) => o.value
              );
              setMultiSelect(options);
            }}
          >
            {item.items?.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
      );

    case FormControlNames.DATEFIELD:
      return (
        <Input
          type="date"
          name={item.labelName}
          required={item.required}
          className="w-full"
        />
      );

    case FormControlNames.TIMEFIELD:
      return (
        <Input
          type="time"
          name={item.labelName}
          required={item.required}
          className="w-full"
        />
      );

    case FormControlNames.FILEUPLOAD:
      return (
        <div>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            name={item.labelName}
            className="w-full"
            required={item.required}
          />
          {fileError && (
            <p className="text-red-500 text-sm mt-1">{fileError}</p>
          )}
          {imageUrl && (
            <Input
              type="hidden"
              name={`url-${item.labelName}`}
              defaultValue={imageUrl}
            />
          )}
        </div>
      );

    case FormControlNames.CHECKLIST:
      return (
        <div className="flex flex-col gap-2 mt-2">
          {item.items?.map((i) => (
            <div key={i.value} className="flex items-center space-x-2">
              <Checkbox
                id={i.value}
                onCheckedChange={(checked) =>
                  handleCheckListChange(null, !!checked)
                }
                name={i.label}
                required={!count && item.required}
              />
              <Label htmlFor={i.value}>{i.label}</Label>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default RenderItem;
