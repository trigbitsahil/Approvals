"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CalendarDays, Info, X, Clock, Settings, Settings2, Trash2 } from "lucide-react";
import { TaskRecurrenceRuleService } from "@/api/services/TaskRecurrenceRuleService";
import { RecurrenceRuleService } from "@/api/services/RecurrenceRuleService";
import { toast } from "sonner";
import { format, addDays, addWeeks, addMonths, addYears, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isWeekend, parseISO } from "date-fns";
import { cn } from "@/utils/cn";

interface TaskRecurrenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rule: any) => void;
  onDelete?: () => void;
  initialRule?: any;
}

// Convert standard JS getDay() (0=Sunday, 1=Monday, ..., 6=Saturday)
// to Backend Day of Week (1=Monday, 2=Tuesday, ..., 7=Sunday)
const toBackendDay = (jsDay: number): number => {
  return jsDay === 0 ? 7 : jsDay;
};

// Convert Backend Day of Week (1=Monday, 2=Tuesday, ..., 7=Sunday)
// to standard JS getDay() (0=Sunday, 1=Monday, ..., 6=Saturday)
const toJSDay = (backendDay: number): number => {
  return backendDay === 7 ? 0 : backendDay;
};

const DAYS_OF_WEEK = [
  { label: "S", value: 0 },
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
];

export const TaskRecurrenceModal: React.FC<TaskRecurrenceModalProps> = ({
  open,
  onOpenChange,
  onSave,
  onDelete,
  initialRule,
}) => {
  const [activeTab, setActiveTab] = useState("time-based");
  const [frequency, setFrequency] = useState(initialRule?.frequency || "Day");
  const [interval, setInterval] = useState(initialRule?.interval || 1);

  const initialStartDate = initialRule?.transactionDate
    ? (typeof initialRule.transactionDate === "string" ? parseISO(initialRule.transactionDate) : initialRule.transactionDate)
    : (initialRule?.createdDate ? parseISO(initialRule.createdDate) : new Date());
  const [startingFrom, setStartingFrom] = useState<Date>(initialStartDate);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initialRule?.daysOfWeek
      ? initialRule.daysOfWeek.split(",").map(Number).map(toJSDay)
      : [initialStartDate.getDay()]
  );
  const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>(() => {
    if (initialRule?.dayOfMonth) {
      if (typeof initialRule.dayOfMonth === "string") {
        return initialRule.dayOfMonth.split(",").map(Number);
      } else if (typeof initialRule.dayOfMonth === "number") {
        return [initialRule.dayOfMonth];
      }
    }
    return [initialStartDate.getDate()];
  });

  const [skipWeekends, setSkipWeekends] = useState(
    !!(initialRule?.isSkipWeekend || initialRule?.skipWeekends)
  );
  const [dueDateType, setDueDateType] = useState(initialRule?.dueDateType || "Same day");
  const [estimatedTime, setEstimatedTime] = useState(initialRule?.estimatedTime || "0h");
  const [endsDate, setEndsDate] = useState<Date | null>(
    (initialRule?.repeatUntil || initialRule?.endsDate) ? parseISO(initialRule.repeatUntil || initialRule.endsDate) : null
  );
  const [defaultStatus, setDefaultStatus] = useState(initialRule?.defaultStatus || "New task");

  // Sync state with initialRule when it changes
  useEffect(() => {
    if (open) {
      setFrequency(initialRule?.frequency || "Day");
      setInterval(initialRule?.interval || 1);

      const startDay = initialRule?.transactionDate
        ? (typeof initialRule.transactionDate === "string" ? parseISO(initialRule.transactionDate) : initialRule.transactionDate)
        : (initialRule?.createdDate ? parseISO(initialRule.createdDate) : new Date());
      setStartingFrom(startDay);

      if (initialRule?.daysOfWeek) {
        setDaysOfWeek(
          initialRule.daysOfWeek.split(",").map(Number).map(toJSDay)
        );
      } else {
        setDaysOfWeek([startDay.getDay()]);
      }

      if (initialRule?.dayOfMonth) {
        if (typeof initialRule.dayOfMonth === "string") {
          setSelectedDaysOfMonth(initialRule.dayOfMonth.split(",").map(Number));
        } else if (typeof initialRule.dayOfMonth === "number") {
          setSelectedDaysOfMonth([initialRule.dayOfMonth]);
        }
      } else {
        setSelectedDaysOfMonth([startDay.getDate()]);
      }

      setSkipWeekends(!!(initialRule?.isSkipWeekend || initialRule?.skipWeekends));
      setEndsDate((initialRule?.repeatUntil || initialRule?.endsDate) ? parseISO(initialRule.repeatUntil || initialRule.endsDate) : null);
      setEstimatedTime(initialRule?.estimatedTime || "0h");
      setDefaultStatus(initialRule?.defaultStatus || "New task");
      setDueDateType(initialRule?.dueDateType || "Same day");

      // Reset visible months when opening
      setVisibleMonths(6);
    }
  }, [open, initialRule]);

  // Calendar logic
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [visibleMonths, setVisibleMonths] = useState(6);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setVisibleMonths((prev) => prev + 3);
    }
  };

  const scheduledDates = useMemo(() => {
    const dates: Date[] = [];
    let current = new Date(startingFrom);
    const end = addMonths(new Date(startingFrom), 24); // Preview 2 years ahead to support "infinite" scroll feel

    if (frequency === "Day") {
      while (current <= end) {
        if (!skipWeekends || !isWeekend(current)) {
          dates.push(new Date(current));
        }
        current = addDays(current, interval);
      }
    } else if (frequency === "Week") {
      while (current <= end) {
        const weekStart = current;
        daysOfWeek.forEach((dayOffset) => {
          // Find the day in the current interval week
          // This is a simplified weekly logic
          const targetDay = addDays(weekStart, (dayOffset - getDay(weekStart) + 7) % 7);
          if (targetDay >= startingFrom && targetDay <= end) {
            dates.push(targetDay);
          }
        });
        current = addWeeks(current, interval);
      }
    } else if (frequency === "Month") {
      while (current <= end) {
        selectedDaysOfMonth.forEach(d => {
          const targetDate = new Date(current.getFullYear(), current.getMonth(), d);
          if (targetDate.getMonth() === current.getMonth() && targetDate >= startingFrom && targetDate <= end) {
            dates.push(targetDate);
          }
        });
        current = addMonths(current, interval);
      }
    } else if (frequency === "Year") {
      while (current <= end) {
        dates.push(new Date(current));
        current = addYears(current, interval);
      }
    }

    return dates;
  }, [frequency, interval, daysOfWeek, skipWeekends, startingFrom, selectedDaysOfMonth]);

  const handleToggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleToggleMonthDay = (day: number) => {
    setSelectedDaysOfMonth((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // prevent empty selection
        return prev.filter((d) => d !== day);
      }
      return [...prev, day];
    });
  };

  const handleDeleteRecurrence = async () => {
    const ruleId = initialRule?.recurrenceRuleId || initialRule?.taskRecurrenceRuleId;
    if (!ruleId) return;
    try {
      await RecurrenceRuleService.deleteRecurrenceRule(
        ruleId,
        "1"
      );
      toast.success("Recurrence ended successfully");
      onDelete?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to delete recurrence rule:", err);
      toast.error("Failed to end recurrence. Please try again.");
    }
  };

  const handleSave = () => {
    let daysStr = "";
    if (frequency === "Day") {
      daysStr = skipWeekends ? "1,2,3,4,5" : "1,2,3,4,5,6,7";
    } else if (frequency === "Week") {
      daysStr = daysOfWeek
        .map(toBackendDay)
        .sort((a, b) => a - b)
        .join(",");
    } else {
      daysStr = String(toBackendDay(startingFrom.getDay()));
    }

    const formatToUTCString = (date: Date | null) => {
      if (!date) return null;
      return format(date, "yyyy-MM-dd'T'00:00:00.000'Z'");
    };

    onSave({
      frequency,
      interval,
      daysOfWeek: (frequency === "Month" || frequency === "Year") ? null : daysStr,
      daysOfMonth: frequency === "Month" ? selectedDaysOfMonth.sort((a, b) => a - b).join(",") : (frequency === "Year" ? startingFrom.getDate().toString() : null),
      monthOfYear: frequency === "Year" ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][startingFrom.getMonth()] : null,
      isSkipWeekend: skipWeekends,
      repeatUntil: formatToUTCString(endsDate),
      startingFrom: formatToUTCString(startingFrom),
      createdDate: formatToUTCString(startingFrom),
      dueDateType,
      estimatedTime,
      defaultStatus,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[760px] p-0 bg-background border-border text-foreground overflow-hidden rounded-2xl w-full">
        <div className="flex flex-col md:flex-row h-full max-h-[85vh] md:max-h-[85vh]">
          {/* Left Side: Configuration */}
          <div className="flex-1 p-4 md:p-6 border-r-0 md:border-r border-border overflow-y-auto custom-scroll">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
              <TabsList className="bg-muted p-1 w-full rounded-full">
                <TabsTrigger
                  value="time-based"
                  className="flex-1 rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs md:text-sm"
                >
                  Time-based
                </TabsTrigger>
                <TabsTrigger
                  value="after-completion"
                  className="flex-1 rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs md:text-sm"
                >
                  After completion
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start gap-2 text-muted-foreground text-xs md:text-sm">
                <Info size={14} className="mt-0.5 shrink-0 flex-shrink-0" />
                <p>
                  Creates a new task on a specific date, regardless of previous task completion
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <label className="text-sm font-medium">Repeat every</label>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex items-center bg-secondary border border-border rounded-lg overflow-hidden h-10">
                        <button
                          onClick={() => setInterval(Math.max(1, interval - 1))}
                          className="px-2 md:px-3 hover:bg-accent text-muted-foreground transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{interval}</span>
                        <button
                          onClick={() => setInterval(interval + 1)}
                          className="px-2 md:px-3 hover:bg-accent text-muted-foreground transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger className="flex-1 md:w-[120px] bg-background border-input h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Frequency" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                          <SelectItem value="Day">Day</SelectItem>
                          <SelectItem value="Week">Week</SelectItem>
                          <SelectItem value="Month">Month</SelectItem>
                          <SelectItem value="Year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {frequency === "Day" && (
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="skip-weekends"
                        checked={skipWeekends}
                        onCheckedChange={(checked) => setSkipWeekends(!!checked)}
                        className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label htmlFor="skip-weekends" className="text-sm text-foreground cursor-pointer">
                        Skip weekends
                      </label>
                    </div>
                  )}

                  {frequency === "Week" && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Days of week</label>
                      <div className="flex gap-1.5 md:gap-2 flex-wrap">
                        {DAYS_OF_WEEK.map((day) => (
                          <button
                            key={day.value}
                            onClick={() => handleToggleDay(day.value)}
                            className={cn(
                              "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all active:scale-95",
                              daysOfWeek.includes(day.value)
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted text-muted-foreground border border-border hover:border-accent"
                            )}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {frequency === "Month" && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Days of month</label>
                      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <button
                            key={day}
                            onClick={() => handleToggleMonthDay(day)}
                            className={cn(
                              "w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all active:scale-95",
                              selectedDaysOfMonth.includes(day)
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted text-muted-foreground border border-border hover:border-accent"
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {frequency === "Year" && (
                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <Select
                          value={startingFrom.getDate().toString()}
                          onValueChange={(val) => {
                            const newDate = new Date(startingFrom);
                            newDate.setDate(Number(val));
                            setStartingFrom(newDate);
                          }}
                        >
                          <SelectTrigger className="flex-1 bg-background border-input rounded-lg h-10 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border text-popover-foreground max-h-[300px]">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={startingFrom.getMonth().toString()}
                          onValueChange={(val) => {
                            const newDate = new Date(startingFrom);
                            newDate.setMonth(Number(val));
                            setStartingFrom(newDate);
                          }}
                        >
                          <SelectTrigger className="flex-1 md:flex-[2] bg-background border-input rounded-lg h-10 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border text-popover-foreground max-h-[300px]">
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                              <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-border" />                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <label className="text-sm font-medium">Starting from</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full md:w-[180px] justify-start text-left font-normal bg-background border-input rounded-lg h-9 text-sm"
                        >
                          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                          {startingFrom ? format(startingFrom, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border" align="end">
                        <Calendar
                          mode="single"
                          selected={startingFrom}
                          onSelect={(date) => date && setStartingFrom(date)}
                          initialFocus
                          className="bg-popover text-foreground"
                          classNames={{
                            selected: "bg-primary text-accent-foreground font-bold rounded-full",
                            today: "bg-accent text-accent-foreground font-bold rounded-full",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <label className="text-sm font-medium">Due date</label>
                    <Select value={dueDateType} onValueChange={setDueDateType}>
                      <SelectTrigger className="w-full md:w-[180px] bg-background border-input rounded-lg h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border text-popover-foreground max-h-[300px]">
                        <SelectItem value="Not set">Not set</SelectItem>
                        <DropdownMenuSeparator className="bg-border h-px my-1" />
                        <SelectItem value="Same day">Same day</SelectItem>
                        <SelectItem value="Next day">Next day</SelectItem>
                        <SelectItem value="in 2 days">in 2 days</SelectItem>
                        <SelectItem value="in 3 days">in 3 days</SelectItem>
                        <SelectItem value="in 4 days">in 4 days</SelectItem>
                        <SelectItem value="in 5 days">in 5 days</SelectItem>
                        <DropdownMenuSeparator className="bg-border h-px my-1" />
                        <div className="flex items-center px-2 py-1.5 text-sm gap-2 text-muted-foreground cursor-pointer hover:bg-accent hover:text-foreground">
                          <Settings size={14} /> <span>Custom</span>
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <label className="text-sm font-medium">Default status</label>
                    <Select value={defaultStatus} onValueChange={setDefaultStatus}>
                      <SelectTrigger className="w-full md:w-[180px] bg-background border-input rounded-lg h-9 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground truncate">
                          <span>📧</span>
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border text-popover-foreground">
                        <SelectItem value="New task">New task</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <label className="text-sm font-medium">Estimated time</label>
                    <Select value={estimatedTime} onValueChange={setEstimatedTime}>
                      <SelectTrigger className="w-full md:w-[180px] bg-background border-input rounded-lg h-9 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border text-popover-foreground max-h-[300px]">
                        <SelectItem value="0h">0h</SelectItem>
                        <DropdownMenuSeparator className="bg-border h-px my-1" />
                        <SelectItem value="15 min">15 min</SelectItem>
                        <SelectItem value="30 min">30 min</SelectItem>
                        <SelectItem value="45 min">45 min</SelectItem>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                        <SelectItem value="1:30 hours">1:30 hours</SelectItem>
                        <SelectItem value="2:00 hours">2:00 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <label className="text-sm font-medium">Ends</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full md:w-[180px] justify-start text-left font-normal bg-background border-input rounded-lg h-9 text-sm"
                        >
                          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                          {endsDate ? format(endsDate, "PPP") : <span>Never ends</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border" align="end">
                        <div className="p-1">
                          <Calendar
                            mode="single"
                            selected={endsDate || undefined}
                            onSelect={(date) => setEndsDate(date || null)}
                            initialFocus
                            className="bg-popover text-foreground"
                            classNames={{
                              selected: "bg-primary text-accent-foreground font-bold rounded-full",
                              today: "bg-accent text-accent-foreground font-bold rounded-full",
                            }}
                          />
                          <div className="p-2 border-t border-border">
                            <Button
                              variant="secondary"
                              className="w-full h-10 rounded-xl bg-secondary hover:bg-accent text-zinc-500 hover:text-foreground font-medium transition-colors"
                              onClick={() => setEndsDate(null)}
                            >
                              Never ends
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 md:pt-10 flex flex-col md:flex-row gap-3 md:gap-0 md:items-center md:justify-between">
              {initialRule?.taskRecurrenceRuleId ? (
                <button
                  onClick={handleDeleteRecurrence}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors px-1 order-last md:order-first"
                >
                  <Trash2 size={14} />
                  End repeats
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 md:flex-none text-muted-foreground hover:bg-accent rounded-lg text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px] rounded-lg shadow-sm text-sm"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side: Calendar Preview */}
          <div className="w-full md:w-[300px] bg-muted/30 p-3 md:p-4 flex flex-col mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-border rounded-t-xl md:rounded-t-none">
            <h3 className="text-base font-semibold mb-4 md:mb-6 flex items-center justify-between">
              Scheduled repeats

            </h3>

            <div
              className="flex-1 space-y-6 md:space-y-8 overflow-y-auto pr-2 custom-scroll max-h-[40vh] md:max-h-none"
              onScroll={handleScroll}
            >
              {Array.from({ length: visibleMonths }).map((_, i) => (
                <CalendarPreview
                  key={i}
                  month={addMonths(currentMonth, i)}
                  scheduledDates={scheduledDates}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CalendarPreview = ({ month, scheduledDates }: { month: Date; scheduledDates: Date[] }) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Padding for start of month
  const firstDayOfWeek = getDay(monthStart);
  const padding = Array.from({ length: firstDayOfWeek });

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="text-xs md:text-sm font-medium text-foreground">
        {format(month, "MMMM yyyy")}
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 md:gap-y-2 gap-x-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-[9px] md:text-[10px] text-muted-foreground text-center font-bold">
            {d}
          </div>
        ))}

        {padding.map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const isScheduled = scheduledDates.some((sd) => isSameDay(sd, day));
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-xs rounded-full transition-all duration-300 relative group",
                isScheduled
                  ? "bg-primary text-primary-foreground font-bold scale-110"
                  : "text-muted-foreground/60 hover:bg-accent hover:text-foreground hover:scale-110"
              )}
            >
              {isScheduled && (
                <div className="absolute inset-0 rounded-full bg-primary/40  -z-10 animate-pulse" />
              )}
              <span className={cn(isScheduled && "drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]")}>
                {format(day, "d")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
