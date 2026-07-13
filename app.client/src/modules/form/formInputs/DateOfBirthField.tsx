"use client";

import * as React from "react";
import { useField, type FieldProps } from "react-final-form";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { i18n } from "@lingui/core";
function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  return date instanceof Date && !isNaN(date.getTime());
}

export const DateOfBirthField: React.FC<FieldProps> = ({ name }) => {
  const { input, meta } = useField(name as string);
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(undefined);

  const selectedDate = input.value ? new Date(input.value) : undefined;
  const displayValue = formatDate(selectedDate);

  const error = meta.touched && (meta.error || meta.submitError);

  const handleSelect = (date: Date | undefined) => {
    if (isValidDate(date)) {
      input.onChange(date.toISOString());
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsed = new Date(val);
    if (isValidDate(parsed)) {
      input.onChange(parsed.toISOString());
    } else {
      input.onChange("");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name} className="px-1">
        {i18n.t({ id: "ui.Date of Birth", message: "Date of Birth" })}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id={name}
          name={name}
          value={displayValue}
          placeholder={i18n.t({
            id: "ui.Date of Birth",
            message: "Date of Birth",
          })}
          className="bg-background pr-10"
          onChange={handleInputChange}
          onBlur={input.onBlur}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={`${name}-picker`}
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && (
        <p className="text-sm text-red-500 pl-1">
          {meta.error || meta.submitError}
        </p>
      )}
    </div>
  );
};

export default DateOfBirthField;
