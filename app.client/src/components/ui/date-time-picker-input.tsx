"use client";

import * as React from "react";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerInputProps {
  /** datetime-local string "YYYY-MM-DDTHH:mm" or null */
  value?: string | null;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DateTimePickerInput({
  value,
  onChange,
  disabled = false,
  placeholder = "Pick date & time",
  className,
}: DateTimePickerInputProps) {
  const [open, setOpen] = React.useState(false);

  // Parse value to a Date object
  const parsed = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isValid(d) ? d : undefined;
  }, [value]);

  const hour = parsed ? parsed.getHours().toString().padStart(2, "0") : "12";
  const minute = parsed ? parsed.getMinutes().toString().padStart(2, "0") : "00";

  const buildString = (date: Date, h: string, m: string): string => {
    const d = new Date(date);
    d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
    return format(d, "yyyy-MM-dd'T'HH:mm");
  };

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      onChange?.(null);
      return;
    }
    onChange?.(buildString(day, hour, minute));
    // keep popover open so user can adjust time
  };

  const handleTimeChange = (type: "hour" | "minute", val: string) => {
    const base = parsed ?? new Date();
    onChange?.(
      type === "hour"
        ? buildString(base, val, minute)
        : buildString(base, hour, val)
    );
  };

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !parsed && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-60" />
          {parsed ? format(parsed, "dd/MM/yyyy, HH:mm") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 shadow-lg bg-popover text-popover-foreground border"
        align="center"
        side="bottom"
        sideOffset={4}
      >
        <div className="flex flex-col sm:flex-row bg-popover rounded-md max-w-[100vw] sm:max-w-none overflow-x-hidden">
          {/* ── Calendar ── */}
          <div className="flex justify-center w-full sm:w-auto">
            <Calendar
              mode="single"
              selected={parsed}
              onSelect={handleDaySelect}
              initialFocus
            />
          </div>

          {/* ── Time picker ── */}
          <div className="flex flex-col items-center gap-3 p-4 border-t sm:border-t-0 sm:border-l border-border min-w-[140px] w-full sm:w-auto">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Time (24h)
            </p>

            <div className="flex items-center gap-2">
              {/* Hour */}
              <select
                value={hour}
                onChange={(e) => handleTimeChange("hour", e.target.value)}
                className={cn(
                  "w-16 rounded-md border border-input px-2 py-1.5 text-sm",
                  "bg-background text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  "appearance-none text-center cursor-pointer"
                )}
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const h = i.toString().padStart(2, "0");
                  return (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  );
                })}
              </select>

              <span className="text-foreground font-bold text-lg select-none">:</span>

              {/* Minute */}
              <select
                value={minute}
                onChange={(e) => handleTimeChange("minute", e.target.value)}
                className={cn(
                  "w-16 rounded-md border border-input px-2 py-1.5 text-sm",
                  "bg-background text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  "appearance-none text-center cursor-pointer"
                )}
              >
                {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Current selection preview */}
            {parsed && (
              <p className="text-xs text-muted-foreground text-center">
                {format(parsed, "dd MMM yyyy")}
                <br />
                <span className="font-semibold text-foreground">
                  {hour}:{minute}
                </span>
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-auto w-full pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  onChange?.(null);
                  setOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
