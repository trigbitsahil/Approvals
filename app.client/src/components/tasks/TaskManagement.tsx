"use client";

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import {
  format,
  parseISO,
  isSameDay,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  isWeekend,
  startOfDay,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { DndContext, useDraggable, useDroppable, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarIcon,
  CheckSquare,
  MapPin,
  Clock,
  Bell,
  Repeat,
  Paperclip,
  Users,
  Flag,
  Search,
  ChevronDown,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { EventService } from "@/api/services/EventService";
import { EventTypeService } from "@/api/services/EventTypeService";
import { UserService } from "@/api/services/UserService";
import { TaskService } from "@/api/services/TaskService";
import { TaskTypeService } from "@/api/services/TaskTypeService";
import { RecurrenceRuleService } from "@/api/services/RecurrenceRuleService";
import { RecurrenceTransactionService } from "@/api/services/RecurrenceTransactionService";
import type { EventListVM } from "@/api/models/EventListVM";
import type { EventTypeListVM } from "@/api/models/EventTypeListVM";
import type { TaskTypeListVM } from "@/api/models/TaskTypeListVM";
import type { UserListVM } from "@/api/models/UserListVM";
import type { RecurrenceRuleListVM } from "@/api/models/RecurrenceRuleListVM";
import { toast } from "sonner";
import type { Card, List } from "./types";
import { TaskDetailSheet } from "@/components/kanban/TaskDetailSheet";
import { syncReminderWithEvent } from "@/components/kanban/reminderUtils";
import { getTypeColor } from "@/components/kanban/taskTypes";
import type { CreateUserIntermediateCommand } from "@/api/models/CreateUserIntermediateCommand";
import { UserIntermediateService } from "@/api/services/UserIntermediateService";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const STATUS_OPTIONS = [
  {
    id: "new",
    label: "New Task",
    icon: <CheckSquare className="w-4 h-4 text-gray-500" />,
  },
  {
    id: "scheduled",
    label: "Scheduled",
    icon: <CalendarIcon className="w-4 h-4 text-red-500" />,
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: <Clock className="w-4 h-4 text-yellow-500" />,
  },
  {
    id: "completed",
    label: "Completed",
    icon: <CheckSquare className="w-4 h-4 text-green-500" />,
  },
];

const PRIORITY_LABELS = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
};

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "urgent":
      return "text-red-500";
    case "high":
      return "text-yellow-500";
    case "normal":
      return "text-blue-500";
    case "low":
      return "text-gray-500";
    default:
      return "text-gray-400";
  }
};

// Local event form state type
interface EventFormState {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  eventTypeId: string;
  isRecurring: boolean;
  assignedTo?: string | null;
}

const defaultEventForm = (): EventFormState => ({
  title: "",
  description: "",
  date: new Date().toISOString(),
  startTime: "11:00",
  endTime: "12:00",
  location: "",
  eventTypeId: "",
  isRecurring: false,
  assignedTo: null,
});

const DroppableDayColumn = ({ day, isToday, children }: { day: Date, isToday: boolean, children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: day.toISOString(),
  });

  return (
    <div
      ref={setNodeRef}
      className={`border-r border-border dark:border-[#2a2a2a] last:border-r-0 p-3 space-y-2 overflow-y-auto min-h-full transition-colors ${isOver
        ? "bg-primary/10 dark:bg-[#2c3340]"
        : isToday
          ? "bg-muted/10 dark:bg-transparent"
          : "bg-transparent"
        }`}
    >
      {children}
    </div>
  );
};

const EventCardContent = ({ event, evType }: { event: any, evType: any }) => {
  const bgColor = evType?.colorOrIcon || "#0d9488";
  const startLabel = event.startDate ? format(new Date(event.startDate), "HH:mm") : "";
  const endLabel = event.endDate ? format(new Date(event.endDate), "HH:mm") : "";

  return (
    <div
      className="rounded-xl p-3 space-y-1 relative w-full h-full"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium pointer-events-none">
        <Clock className="w-3 h-3 shrink-0" />
        <span>{startLabel}{endLabel ? ` – ${endLabel}` : ""}</span>
      </div>
      <div className="text-white font-semibold text-sm leading-snug pointer-events-none">{event.name}</div>
    </div>
  );
};

const DraggableEventCard = ({ event, evType, onClick }: { event: any, evType: any, onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.eventId,
    data: { event }
  });

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="rounded-xl p-3 space-y-1 relative opacity-50 outline-dashed outline-2 outline-gray-500 min-h-[60px]"
      />
    );
  }

  return (
    // Outer div: click-only, NO drag listeners
    <div
      ref={setNodeRef}
      className="relative cursor-pointer hover:brightness-110 transition-all outline-none group/card"
      onClick={onClick}
    >
      <EventCardContent event={event} evType={evType} />

      {/* Drag handle — only THIS element has the dnd-kit listeners */}
      <div
        {...listeners}
        {...attributes}
        className="absolute top-1.5 right-1.5 opacity-0 group-hover/card:opacity-60 hover:!opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-0.5 rounded"
        onClick={(e) => e.stopPropagation()} // don't fire card click when grabbing
        title="Drag to move"
      >
        <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5.5" cy="4" r="1.2" /><circle cx="10.5" cy="4" r="1.2" />
          <circle cx="5.5" cy="8" r="1.2" /><circle cx="10.5" cy="8" r="1.2" />
          <circle cx="5.5" cy="12" r="1.2" /><circle cx="10.5" cy="12" r="1.2" />
        </svg>
      </div>
    </div>
  );
};

const toLocalISOString = (date: Date | string | undefined | null) => {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return undefined;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
};

export const TaskManagement = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || localStorage.getItem("activeProjectId") || undefined;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [list, setList] = useState<List[]>([
    {
      id: "1",
      title: "Tasks",
      color: "bg-blue-400",
      card: [],
    },
  ]);
  const [apiEvents, setApiEvents] = useState<EventListVM[]>([]);
  const [recurrenceRules, setRecurrenceRules] = useState<RecurrenceRuleListVM[]>([]);
  const [recurrenceTransactions, setRecurrenceTransactions] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypeListVM[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskTypeListVM[]>([]);
  const [users, setUsers] = useState<UserListVM[]>([]);

  // Dialog states
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Card | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventListVM | null>(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Event detail sheet state
  const [eventSheetOpen, setEventSheetOpen] = useState(false);
  const [eventForSheet, setEventForSheet] = useState<any | null>(null);

  // Task detail sheet state
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);
  const [taskForSheet, setTaskForSheet] = useState<any | null>(null);


  // New state for participants
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [participantSearch, setParticipantSearch] = useState("");
  // Drag states
  const [activeEvent, setActiveEvent] = useState<EventListVM | null>(null);

  // Task form state
  const [taskForm, setTaskForm] = useState<Partial<Card>>({
    title: "",
    description: "",
    dueDate: undefined,
    priority: undefined,
    type: undefined,
    assignee: undefined,
    status: undefined,
  });

  // Event form state
  const [eventForm, setEventForm] = useState<EventFormState>(defaultEventForm());

  // Fetch events from API
  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      const res = await EventService.getApiVEvent("1", "Project", projectId);
      if (res.success && res.data) {
        setApiEvents(res.data);

        // Fetch recurrence rules for these events
        const eventIds = res.data.map(e => e.eventId).filter(Boolean) as string[];
        const rulePromises = eventIds.map(id =>
          RecurrenceRuleService.getApiVRecurrenceRule("1", "Events", id)
            .then(r => (r.success && r.data) ? r.data : [])
            .catch(() => [])
        );
        const results = await Promise.all(rulePromises);
        const rules = results.flat().filter(Boolean);
        setRecurrenceRules(prev => {
          const taskRules = prev.filter(r => r.category === "Task");
          return [...taskRules, ...rules];
        });

        // ✅ NEW: Fetch recurrence transactions for these events (same pattern as tasks)
        const txPromises = eventIds.map(id =>
          RecurrenceTransactionService.getApiVRecurrenceTransaction("1", "Events", id)
            .then(r => (r.success && r.data) ? r.data : [])
            .catch(() => [])
        );
        const txResults = await Promise.all(txPromises);
        const transactions = txResults.flat().filter(Boolean);
        setRecurrenceTransactions(prev => {
          const taskTransactions = prev.filter(t => t.category === "Task");
          return [...taskTransactions, ...transactions];
        });
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  }, [projectId]);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await TaskService.taskGet("1", "Project", projectId);
      if (res.success && res.data) {
        setList([
          {
            id: "1",
            title: "Tasks",
            color: "bg-blue-400",
            card: res.data.map(t => ({
              id: t.taskId || crypto.randomUUID(),
              title: t.name || "Untitled",
              description: t.description || "",
              status: t.status || "",
              dueDate: t.dueDate || undefined,
              startDate: t.startDate || undefined,
              type: (t as any).taskTypeId || "Operational",
              taskTypeId: (t as any).taskTypeId || null,
              taskPriorityId: (t as any).taskPriorityId || null,
              assignee: t.assignedTo || t.createdBy || "Unassigned",
              estimatedHours: t.estimatedHours ?? undefined,
            }))
          }
        ]);

        // Fetch recurrence rules for these tasks
        const taskIds = res.data.map(t => t.taskId).filter(Boolean) as string[];
        const rulePromises = taskIds.map(id =>
          RecurrenceRuleService.getApiVRecurrenceRule("1", "Task", id)
            .then(r => (r.success && r.data) ? r.data : [])
            .catch(() => [])
        );
        const results = await Promise.all(rulePromises);
        const rules = results.flat().filter(Boolean);
        setRecurrenceRules(prev => {
          const eventRules = prev.filter(r => r.category === "Events");
          return [...eventRules, ...rules];
        });

        // Fetch recurrence transactions for these tasks
        const txPromises = taskIds.map(id =>
          RecurrenceTransactionService.getApiVRecurrenceTransaction("1", "Task", id)
            .then(r => (r.success && r.data) ? r.data : [])
            .catch(() => [])
        );
        const txResults = await Promise.all(txPromises);
        const transactions = txResults.flat().filter(Boolean);
        setRecurrenceTransactions(prev => {
          const eventTransactions = prev.filter(t => t.category === "Events");
          return [...eventTransactions, ...transactions];
        });
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  }, [projectId]);

  // Fetch event types scoped to project
  const fetchEventTypes = useCallback(async () => {
    try {
      const res = await EventTypeService.getApiVEventType("1", "Project", projectId);
      if (res.success && res.data && res.data.length > 0) {
        setEventTypes(res.data);
      } else {
        // Fallback: fetch all event types
        const fallback = await EventTypeService.getApiVEventType("1");
        if (fallback.success && fallback.data) {
          setEventTypes(fallback.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch event types", err);
    }
  }, [projectId]);

  // Fetch task types scoped to project
  const fetchTaskTypes = useCallback(async () => {
    try {
      const res = await TaskTypeService.taskTypeGet("1", "Project", projectId);
      if (res.success && res.data && res.data.length > 0) {
        setTaskTypes(res.data);
      } else {
        const fallback = await TaskTypeService.taskTypeGet("1");
        if (fallback.success && fallback.data) {
          setTaskTypes(fallback.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch task types", err);
    }
  }, [projectId]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await UserService.getApiVUser("1");
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchTasks();
    fetchEventTypes();
    fetchTaskTypes();
    fetchUsers();
  }, [fetchEvents, fetchTasks, fetchEventTypes, fetchTaskTypes, fetchUsers]);

  // Sync state whenever event or task sheet closes
  useEffect(() => {
    if (!eventSheetOpen && !taskSheetOpen) {
      fetchEvents();
      fetchTasks();
      fetchTaskTypes();
    }
  }, [eventSheetOpen, taskSheetOpen, fetchEvents, fetchTasks, fetchTaskTypes]);

  // 14-day navigation
  const navigateDays = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      if (direction === "prev") {
        return addDays(prev, -7);
      } else {
        return addDays(prev, 7);
      }
    });
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dayOffset, setDayOffset] = useState({ backward: 30, forward: 60 });
  const [prevBackward, setPrevBackward] = useState(30);
  const [visibleMonth, setVisibleMonth] = useState<Date>(currentDate);

  // When currentDate changes externally (e.g. mini calendar), reset view and scroll to center
  useLayoutEffect(() => {
    setDayOffset({ backward: 30, forward: 60 });
    setPrevBackward(30);
    setVisibleMonth(currentDate);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 30 * 250;
    }
  }, [currentDate]);

  // When dayOffset.backward increases, adjust scrollLeft to prevent jumping
  useLayoutEffect(() => {
    if (dayOffset.backward > prevBackward && scrollContainerRef.current) {
      const addedDays = dayOffset.backward - prevBackward;
      scrollContainerRef.current.scrollLeft += addedDays * 250;
      setPrevBackward(dayOffset.backward);
    }
  }, [dayOffset.backward, prevBackward]);

  const handleHorizontalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    if (scrollWidth - scrollLeft <= clientWidth + 500) {
      setDayOffset(prev => ({ ...prev, forward: prev.forward + 30 }));
    }
    if (scrollLeft <= 500 && dayOffset.backward < 365) {
      setDayOffset(prev => ({ ...prev, backward: prev.backward + 30 }));
    }
    // Compute which day column is at the left edge (after the 52px gutter) and update visible month
    const COLUMN_WIDTH = 250;
    const GUTTER_WIDTH = 52;
    const dayIndex = Math.floor((scrollLeft + GUTTER_WIDTH) / COLUMN_WIDTH);
    const clampedIndex = Math.max(0, Math.min(dayIndex, dayOffset.backward + dayOffset.forward - 1));
    const visibleDay = addDays(currentDate, clampedIndex - dayOffset.backward);
    setVisibleMonth(visibleDay);
  };

  const viewDays = Array.from({ length: dayOffset.backward + dayOffset.forward }, (_, i) => addDays(currentDate, i - dayOffset.backward));

  // Task dialog functions
  const openCreateTaskDialog = () => {
    setEditingTask(null);
    setTaskForm({
      title: "",
      description: "",
      dueDate: undefined,
      priority: undefined,
      type: undefined,
      assignee: undefined,
      status: undefined,
    });
    setTaskDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskForm.title) return;

    if (editingTask) {
      setList((prev) =>
        prev.map((col) => ({
          ...col,
          card: col.card.map((c) =>
            c.id === editingTask.id ? { ...c, ...taskForm } : c
          ),
        }))
      );
    } else {
      const firstList = list[0];
      const newCard: Card = {
        id: crypto.randomUUID(),
        title: taskForm.title || "Untitled",
        description: taskForm.description || "",
        dueDate: taskForm.dueDate ?? "",
        priority: taskForm.priority,
        status: taskForm.status ?? "new",
        type: taskForm.type,
        assignee: taskForm.assignee,
      };

      setList((prev) =>
        prev.map((col) =>
          col.id === firstList.id
            ? { ...col, card: [...col.card, newCard] }
            : col
        )
      );
    }
    setTaskDialogOpen(false);
  };

  // Event dialog functions
  const openCreateEventDialog = () => {
    setEditingEvent(null);
    setEventForm({
      ...defaultEventForm(),
      eventTypeId: eventTypes[0]?.eventTypeId || "",

    });
    setEventDialogOpen(true);
    setSelectedParticipants([]);           // Reset participants
  };
  // New: Open participants selection
  const openParticipantsSelector = () => {
    setShowParticipantsDialog(true);
  };

  // Handle Save Event + Add Participants to UserIntermediate
  const handleSaveEvent = async () => {
    if (!eventForm.title.trim()) {
      toast.error("Please enter an event name.");
      return;
    }

    setIsSavingEvent(true);

    try {
      // 1. Get logged-in user email (as you already had)
      let currentUserEmail = "";
      try {
        const userResponse = await UserService.getLoggedInUser?.("1");
        currentUserEmail = userResponse?.data?.email || userResponse?.email || userResponse?.data?.userEmail || "";
      } catch (e) {
        currentUserEmail = eventForm.assignedTo || "";
      }

      // 2. Prepare event payload
      const dateBase = eventForm.date ? new Date(eventForm.date) : new Date();
      const [startH, startM] = eventForm.startTime.split(":").map(Number);
      const [endH, endM] = eventForm.endTime.split(":").map(Number);

      const startDate = new Date(dateBase); startDate.setHours(startH, startM, 0, 0);
      const endDate = new Date(dateBase); endDate.setHours(endH, endM, 0, 0);

      const commonPayload = {
        name: eventForm.title,
        description: eventForm.description,
        location: eventForm.location,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isRecurring: eventForm.isRecurring,
        eventTypeId: eventForm.eventTypeId || null,
        assignedTo: currentUserEmail || null,
        isActive: true,
        status: "-",
        category: "Project",
        categoryId: projectId || null,
      };

      let createdEventId: string | null = null;

      if (editingEvent) {
        const res = await EventService.putApiVEvent("1", { eventId: editingEvent.eventId, ...commonPayload });
        if (res.success) {
          toast.success("Event updated!");
          createdEventId = editingEvent.eventId;
        }
      } else {
        const res = await EventService.postApiVEvent("1", commonPayload);
        if (res.success) {
          toast.success("Event created!");
          createdEventId = res.data?.eventId || res.eventId;   // adjust based on your API response
        }
      }

      // 3. If we have a new event ID and selected participants → add them via UserIntermediate
      if (createdEventId && selectedParticipants.length > 0) {
        let addedCount = 0;

        for (const userId of selectedParticipants) {
          const selectedUser = users.find(u => u.id === userId || u.userID === userId);
          if (!selectedUser) continue;

          const payload: CreateUserIntermediateCommand = {
            userId: userId,
            category: "Event",
            userEmail: selectedUser.email || selectedUser.userName || "",
            categoryId: createdEventId,        // ← Event ID as CategoryId
          };

          try {
            await UserIntermediateService.postApiVUserIntermediate("1", payload);
            addedCount++;
          } catch (err) {
            console.error("Failed to add participant", err);
          }
        }

        if (addedCount > 0) {
          toast.success(`${addedCount} participant(s) added to event`);
        }
      }

      fetchEvents();
      setEventDialogOpen(false);
      setSelectedParticipants([]);

    } catch (err) {
      toast.error("An error occurred while saving the event.");
      console.error(err);
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveEvent(e.active.data.current?.event as EventListVM);
  };

  const handleDragCancel = () => {
    setActiveEvent(null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveEvent(null);
    if (!over) return;

    const draggedEvent = active.data.current?.event as EventListVM;
    const targetDateISO = over.id as string;

    if (!draggedEvent || !targetDateISO) return;

    const targetDate = new Date(targetDateISO);
    const startD = draggedEvent.startDate ? new Date(draggedEvent.startDate) : new Date();

    if (isSameDay(startD, targetDate)) return; // Didn't change days

    const newStartDate = new Date(startD);
    newStartDate.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    const endD = draggedEvent.endDate ? new Date(draggedEvent.endDate) : new Date();
    const newEndDate = new Date(endD);

    const dayDiff = targetDate.getDate() - startD.getDate();
    newEndDate.setFullYear(
      targetDate.getFullYear() + (endD.getFullYear() - startD.getFullYear()),
      targetDate.getMonth() + (endD.getMonth() - startD.getMonth()),
      endD.getDate() + dayDiff
    );

    // Optimistic UI update
    setApiEvents(prev => prev.map(ev =>
      ev.eventId === draggedEvent.eventId
        ? { ...ev, startDate: newStartDate.toISOString(), endDate: newEndDate.toISOString() }
        : ev
    ));

    try {
      const res = await EventService.putApiVEvent("1", {
        eventId: draggedEvent.eventId,
        name: draggedEvent.name,
        description: draggedEvent.description,
        location: draggedEvent.location,
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString(),
        isRecurring: draggedEvent.isRecurring || false,
        eventTypeId: draggedEvent.eventTypeId || null,
        isActive: true,
        status: "-"
      });
      if (res.success) {
        // Sync reminder with new date
        syncReminderWithEvent(
          draggedEvent.eventId!,
          newStartDate.toISOString(),
          draggedEvent.startDate || null,
          draggedEvent.name || "",
          draggedEvent.description || ""
        );
      } else {
        toast.error("Failed to move event.");
        fetchEvents(); // revert on failure
      }
    } catch (err) {
      toast.error("An error occurred moving the event.");
      fetchEvents(); // revert on error
    }
  };

  const getTaskTypeColor = (taskTypeIdentifier?: string | null) => {
    if (!taskTypeIdentifier) return "#2563eb"; // default blue

    // Try by name
    const byName = taskTypes.find((t) => t.name === taskTypeIdentifier);
    if (byName?.colorOrIcon) return byName.colorOrIcon;

    // Try by taskTypeId
    const byId = taskTypes.find((t) => t.taskTypeId === taskTypeIdentifier);
    if (byId?.colorOrIcon) return byId.colorOrIcon;

    // Try shared taskTypes helper
    const fallback = getTypeColor(taskTypeIdentifier);
    if (fallback && fallback !== "transparent") return fallback;

    return "#2563eb"; // default blue
  };

  const matchRecurrence = (rule: RecurrenceRuleListVM, date: Date, originalDate: Date): boolean => {
    const startingFromStr = rule.startingFrom || rule.createdDate;
    if (!startingFromStr) return false;

    const startLimit = startOfDay(parseISO(startingFromStr));
    const target = startOfDay(date);

    // If target date is before the recurrence starting date, it doesn't match
    if (target < startLimit) return false;

    // If target date is after the recurrence repeat until date, it doesn't match
    if (rule.repeatUntil) {
      const endLimit = startOfDay(parseISO(rule.repeatUntil));
      if (target > endLimit) return false;
    }

    const frequency = rule.frequency; // "Day", "Week", "Month", "Year"
    const interval = rule.interval || 1;
    const skipWeekends = rule.isSkipWeekend || false;

    if (skipWeekends && isWeekend(target)) return false;

    const toJSDay = (backendDay: number): number => {
      return backendDay === 7 ? 0 : backendDay;
    };

    const freq = frequency ? frequency.toLowerCase() : "";

    if (freq === "day") {
      const diff = differenceInDays(target, startLimit);
      return diff >= 0 && diff % interval === 0;
    } else if (freq === "week") {
      // Find difference in weeks between startLimit and target
      const diffWeeks = differenceInWeeks(target, startLimit);
      if (diffWeeks < 0 || diffWeeks % interval !== 0) return false;

      // Check if target day of week is one of the scheduled daysOfWeek
      const daysOfWeek = rule.daysOfWeek
        ? rule.daysOfWeek.split(",").map(Number).map(toJSDay)
        : [startLimit.getDay()];
      return daysOfWeek.includes(target.getDay());
    } else if (freq === "month") {
      const diffMonths = differenceInMonths(target, startLimit);
      if (diffMonths < 0 || diffMonths % interval !== 0) return false;

      // Check if target day of month matches daysOfMonth
      const selectedDaysOfMonth = rule.daysOfMonth
        ? rule.daysOfMonth.split(",").map(Number)
        : [startLimit.getDate()];
      return selectedDaysOfMonth.includes(target.getDate());
    } else if (freq === "year") {
      const diffYears = differenceInYears(target, startLimit);
      if (diffYears < 0 || diffYears % interval !== 0) return false;

      // Target month and day must match startingFrom month and day
      return target.getMonth() === startLimit.getMonth() && target.getDate() === startLimit.getDate();
    }

    return false;
  };

  // Get tasks and events for a specific date
  const getItemsForDate = (date: Date) => {
    const tasksForDate = list.flatMap((col) =>
      col.card.filter((card) => {
        try {
          // Find active recurrence rule for this task
          const rule = recurrenceRules.find(r => r.categoryId === card.id && r.category === "Task" && r.isVoided !== true);
          if (rule) {
            const targetDateStr = card.startDate || card.dueDate;
            if (!targetDateStr) return false;
            const originalDate = parseISO(targetDateStr);

            // Also check if there is a recurrence transaction for this task on this day
            const hasTransaction = recurrenceTransactions.some(
              (t) =>
                t.categoryId === card.id &&
                t.transactionDate &&
                isSameDay(parseISO(t.transactionDate), date)
            );

            return matchRecurrence(rule, date, originalDate) || hasTransaction;
          }

          // If no recurrence rule, check if the date matches either startDate or dueDate
          const startD = card.startDate ? parseISO(card.startDate) : null;
          const dueD = card.dueDate ? parseISO(card.dueDate) : null;

          const isStart = startD ? isSameDay(startD, date) : false;
          const isDue = dueD ? isSameDay(dueD, date) : false;

          return isStart || isDue;
        } catch {
          return false;
        }
      })
    );

    // Include recurrence transactions for the same date
    const transactionsForDate = recurrenceTransactions
      .filter((tx) => {
        if (!tx.transactionDate) return false;
        try {
          const txDate = parseISO(tx.transactionDate);
          return isSameDay(txDate, date);
        } catch {
          return false;
        }
      })
      .map((tx) => {
        const parentTask = list.flatMap((col) => col.card).find((c) => c.id === tx.categoryId);
        return {
          id: tx.recurrenceTransactionId || crypto.randomUUID(),
          title: parentTask ? parentTask.title : (tx.status || "Transaction"),
          description: tx.category || "",
          status: tx.status || "new",
          dueDate: tx.transactionDate || "",
          type: "transaction",
          assignee: "Recurring",
          isTransaction: true,
          transactionData: tx,
          parentTask: parentTask,
        };
      });

    const eventsForDate = apiEvents.filter((event) => {
      if (!event.startDate) return false;
      try {
        const originalDate = parseISO(event.startDate);

        // Find active recurrence rule for this event
        const rule = recurrenceRules.find(r => r.categoryId === event.eventId && r.category === "Events" && r.isVoided !== true);
        if (rule) {
          // Check if there is a recurrence transaction for this event on this day
          const hasTransaction = recurrenceTransactions.some(
            (t) =>
              t.categoryId === event.eventId &&
              t.transactionDate &&
              isSameDay(parseISO(t.transactionDate), date)
          );
          return matchRecurrence(rule, date, originalDate) || hasTransaction;
        }

        return isSameDay(originalDate, date);
      } catch {
        return false;
      }
    });

    return { tasks: tasksForDate, events: eventsForDate };
  };

  const selectedEventType = eventTypes.find(t => t.eventTypeId === eventForm.eventTypeId);

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#2a2a2a] px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className=" text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add new
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {/* <DropdownMenuItem onClick={openCreateTaskDialog}>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Task
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={openCreateEventDialog}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className=" bg-transparent">
                  Today
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-100 p-0" align="start">
                <div className="   rounded-lg">
                  {/* Year selector */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className=" hover:bg-gray-700"
                        onClick={() =>
                          setCurrentDate(
                            (prev) =>
                              new Date(
                                prev.getFullYear() - 1,
                                prev.getMonth(),
                                prev.getDate()
                              )
                          )
                        }
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-medium">
                        {format(currentDate, "yyyy")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-700"
                        onClick={() =>
                          setCurrentDate(
                            (prev) =>
                              new Date(
                                prev.getFullYear() + 1,
                                prev.getMonth(),
                                prev.getDate()
                              )
                          )
                        }
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex">
                    {/* Month selector */}
                    <div className="w-32 border-r border-gray-700">
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month, index) => (
                        <button
                          key={month}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${currentDate.getMonth() === index
                            ? "bg-gray-700 text-blue-400"
                            : ""
                            }`}
                          onClick={() =>
                            setCurrentDate(
                              (prev) =>
                                new Date(
                                  prev.getFullYear(),
                                  index,
                                  prev.getDate()
                                )
                            )
                          }
                        >
                          {month}
                        </button>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="flex-1 p-4">
                      {/* Days of week header */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                          <div
                            key={day}
                            className="text-center text-xs  font-medium p-1"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar days */}
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const monthStart = startOfMonth(currentDate);
                          const monthEnd = endOfMonth(currentDate);
                          const calendarStart = startOfWeek(monthStart, {
                            weekStartsOn: 0,
                          });
                          const calendarEnd = endOfWeek(monthEnd, {
                            weekStartsOn: 0,
                          });
                          const calendarDays = eachDayOfInterval({
                            start: calendarStart,
                            end: calendarEnd,
                          });

                          return calendarDays.map((day) => {
                            const isCurrentMonth = isSameMonth(
                              day,
                              currentDate
                            );
                            const isToday = isSameDay(day, new Date());
                            const isSelected = isSameDay(day, currentDate);

                            return (
                              <button
                                key={day.toISOString()}
                                className={`
                                  w-8 h-8 text-sm rounded transition-colors
                                  ${!isCurrentMonth ? "" : ""}
                                  ${isToday ? "bg-blue-500 text-white" : ""}
                                  ${isSelected && !isToday
                                    ? "bg-gray-600 text-white"
                                    : ""
                                  }
                                  ${isCurrentMonth && !isToday && !isSelected
                                    ? "hover:bg-gray-700"
                                    : ""
                                  }
                                `}
                                onClick={() => {
                                  setCurrentDate(day);
                                }}
                              >
                                {format(day, "d")}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-gray-500" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Calendar View with Horizontal Scroll */}
      <div className="flex flex-col overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          autoScroll={{
            threshold: { x: 0.2, y: 0.1 },
            acceleration: 10,
            canScroll: (element) => {
              // Ensure we are scrolling the main horizontal container
              return element.classList.contains('overflow-x-auto');
            }
          }}
        >
          <div
            ref={scrollContainerRef}
            onScroll={handleHorizontalScroll}
            className="flex-1 overflow-x-auto overflow-y-hidden"
          >
            <div className="flex flex-col min-w-max h-full">
              {/* Header row: month label + nav + day columns */}
              <div
                className="grid border-b border-border dark:border-[#2a2a2a] sticky top-0 bg-background z-20"
                style={{ gridTemplateColumns: `52px repeat(${viewDays.length}, 250px)` }}
              >
                {/* Month/Year + nav in the first cell */}
                <div className="flex flex-col justify-between px-2 py-3 border-r border-border dark:border-[#2a2a2a] sticky left-0 bg-background z-30">
                  <span className="text-[11px] text-muted-foreground font-medium leading-tight">
                    {format(visibleMonth, "MMM yyyy")}
                  </span>
                  <div className="flex items-center gap-0.5 mt-1">
                    <button
                      onClick={() => navigateDays("prev")}
                      className="p-0.5 rounded hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors text-muted-foreground hover:text-foreground dark:hover:text-white"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigateDays("next")}
                      className="p-0.5 rounded hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors text-muted-foreground hover:text-foreground dark:hover:text-white"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Day column headers */}
                {viewDays.map((day) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div
                      key={day.toISOString()}
                      className={`px-4 py-3 border-r border-border dark:border-[#2a2a2a] last:border-r-0 ${isToday ? "bg-muted/50 dark:bg-[#1a1a1a]/50" : "bg-transparent"
                        }`}
                    >
                      <div className="flex flex-col items-start gap-0.5">
                        <span className={`text-base font-semibold ${isToday ? "text-foreground dark:text-white" : "text-muted-foreground"
                          }`}>
                          {format(day, "d")} {format(day, "EEE")}
                        </span>
                        {isToday && (
                          <div className="h-[2px] w-8 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Body row: time gutter + day columns */}
              <div className="flex flex-1 overflow-y-auto">
                {/* Time gutter */}
                <div className="w-[52px] shrink-0 border-r border-border dark:border-[#2a2a2a] px-2 py-4 sticky left-0 bg-background z-10 h-full">
                  <span className="text-[11px] text-muted-foreground">1h</span>
                </div>

                {/* Day content columns */}
                <div
                  className="grid flex-1"
                  style={{ gridTemplateColumns: `repeat(${viewDays.length}, 250px)` }}
                >
                  {viewDays.map((day) => {
                    const { tasks, events } = getItemsForDate(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <DroppableDayColumn key={day.toISOString()} day={day} isToday={isToday}>
                        {/* Tasks */}
                        {tasks.map((task) => {
                          const isTransaction = (task as any).isTransaction === true;

                          if (isTransaction) {
                            const txData = (task as any).transactionData;
                            const parentTask = (task as any).parentTask;
                            return (
                              <div
                                key={task.id}
                                style={{ backgroundColor: "#8b5cf6" }}
                                className="text-white p-3 rounded-xl cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all shadow-sm flex flex-col gap-1.5 mb-2"
                                onClick={() => {
                                  if (parentTask) {
                                    setTaskForSheet({
                                      ...parentTask,
                                      transactionDate: txData.transactionDate,
                                    });
                                  } else {
                                    setTaskForSheet(task);
                                  }
                                  setTaskSheetOpen(true);
                                }}
                              >
                                <div className="font-semibold text-sm leading-tight flex items-center gap-2">
                                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                  </svg>
                                  {task.title}
                                </div>
                                <div className="text-[11px] text-white/80">
                                  Status: {txData?.status || "Pending"}
                                </div>
                                <div className="text-[11px] text-white/70">
                                  Category: {txData?.category || "Task"}
                                </div>
                              </div>
                            );
                          }

                          const taskColor = getTaskTypeColor(task.taskTypeId || task.type);

                          // Days left calculation
                          // - Non-recurring: diff from today to dueDate (fixed due date)
                          // - Recurring: diff from today to this specific calendar occurrence (the `day` column)
                          const taskRule = recurrenceRules.find(r => r.categoryId === task.id && r.category === "Task" && r.isVoided !== true);
                          const referenceDate = taskRule
                            ? startOfDay(day)                                               // recurring → use the column day
                            : (task.dueDate ? startOfDay(parseISO(task.dueDate)) : null);   // non-recurring → use dueDate
                          const today = startOfDay(new Date());
                          const daysLeft = referenceDate ? differenceInDays(referenceDate, today) : null;
                          let daysLabel = "";
                          if (daysLeft !== null) {
                            if (daysLeft === 0) daysLabel = "Due today";
                            else if (daysLeft === 1) daysLabel = "1 day left";
                            else if (daysLeft > 1) daysLabel = `${daysLeft} days left`;
                            else daysLabel = `${Math.abs(daysLeft)} days overdue`;
                          }

                          // Priority label
                          const priorityLabel = task.priority as string | undefined;

                          // Recurrence label from fetched rules

                          let recurrenceLabel = "";
                          if (taskRule) {
                            const freq = (taskRule.frequency || "").toLowerCase();
                            const n = taskRule.interval || 1;
                            const skipWknd = taskRule.isSkipWeekend;
                            const toOrdinal = (num: number) => {
                              const s = ["th", "st", "nd", "rd"];
                              const v = num % 100;
                              return num + (s[(v - 20) % 10] || s[v] || s[0]);
                            };
                            if (freq === "day") {
                              recurrenceLabel = skipWknd
                                ? (n === 1 ? "Every weekday" : `Every ${n} weekdays`)
                                : (n === 1 ? "Every day" : `Every ${n} days`);
                            } else if (freq === "week") {
                              recurrenceLabel = n === 1 ? "Every week" : `Every ${n} weeks`;
                            } else if (freq === "month") {
                              recurrenceLabel = n === 1 ? "Every month" : `Every ${n} months`;
                              if (taskRule.daysOfMonth) {
                                const dayNums = taskRule.daysOfMonth.split(",").map(Number).filter(Boolean).sort((a, b) => a - b);
                                if (dayNums.length > 0) {
                                  recurrenceLabel += ` on the ${dayNums.map(toOrdinal).join(", ")}`;
                                }
                              }
                            } else if (freq === "year") {
                              recurrenceLabel = n === 1 ? "Every year" : `Every ${n} years`;
                            }
                          }

                          return (
                            <div
                              key={task.id}
                              style={{ backgroundColor: taskColor }}
                              className="text-white p-3 rounded-xl cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all shadow-sm flex flex-col gap-1.5 mb-2"
                              onClick={() => {
                                const tx = recurrenceTransactions.find(
                                  (t) =>
                                    t.categoryId === task.id &&
                                    t.transactionDate &&
                                    isSameDay(parseISO(t.transactionDate), day)
                                );
                                setTaskForSheet({
                                  ...task,
                                  transactionDate: tx ? tx.transactionDate : format(day, "yyyy-MM-dd'T'HH:mm:ss"),
                                });
                                setTaskSheetOpen(true);
                              }}
                            >
                              <div className="font-semibold text-sm leading-tight">{task.title}</div>

                              {priorityLabel && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold uppercase bg-white/20 rounded-full px-2 py-0.5 flex items-center gap-1">
                                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M5 3l14 9-14 9V3z" />
                                    </svg>
                                    {priorityLabel}
                                  </span>
                                </div>
                              )}

                              {/* {recurrenceLabel && (
                                <div className="flex items-center gap-1 text-white/80 text-[11px]">
                                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 1l4 4-4 4" />
                                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                    <path d="M7 23l-4-4 4-4" />
                                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                                  </svg>
                                  <span>{recurrenceLabel}</span>
                                </div>
                              )} */}

                              {daysLabel && (
                                <div className="flex items-center gap-1 text-white/70 text-[11px]">
                                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                  </svg>
                                  <span>{daysLabel}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* API Events */}
                        {events.map((event) => {
                          const evType = eventTypes.find(t => t.eventTypeId === event.eventTypeId);
                          return (
                            <DraggableEventCard
                              key={event.eventId}
                              event={event}
                              evType={evType}
                              onClick={() => {
                                const tx = recurrenceTransactions.find(
                                  (t) =>
                                    t.categoryId === event.eventId &&
                                    t.transactionDate &&
                                    isSameDay(parseISO(t.transactionDate), day)
                                );
                                // Open TaskDetailSheet (sidebar) for events, just like tasks
                                setEventForSheet({
                                  id: event.eventId,
                                  title: event.name || "",
                                  description: event.description || "",
                                  location: event.location || "",
                                  startDate: event.startDate,
                                  endDate: event.endDate,
                                  eventTypeId: event.eventTypeId,
                                  isRecurring: event.isRecurring || false,
                                  transactionDate: tx ? tx.transactionDate : format(day, "yyyy-MM-dd'T'HH:mm:ss"),
                                });
                                setEventSheetOpen(true);
                              }}
                            />
                          );
                        })}

                        {/* Empty dash for days with no content */}
                        {tasks.length === 0 && events.length === 0 && (
                          <div className="flex justify-end pr-1 pt-1">
                            <span className="text-[#3a3a3a] text-base select-none pointer-events-none">–</span>
                          </div>
                        )}
                      </DroppableDayColumn>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeEvent ? (
              <div className="cursor-grabbing" style={{ width: '100%', maxWidth: '280px' }}>
                <EventCardContent
                  event={activeEvent}
                  evType={eventTypes.find(t => t.eventTypeId === activeEvent.eventTypeId)}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="overflow-x-hidden w-full max-w-[100vw] sm:max-w-3xl lg:max-w-3xl h-full sm:h-[calc(100dvh-8rem)] max-h-[100dvh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left side: Form */}
            <div className="col-span-2 p-4 sm:p-6 space-y-4">
              <h2 className="text-lg font-semibold">
                {editingTask ? "Edit Task" : "Create Task"}
              </h2>
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Task name"
                    value={taskForm.title || ""}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Task description"
                    rows={6}
                    value={taskForm.description || ""}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-zinc-800 p-4 sm:p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Create in</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold">
                    T
                  </div>
                  <span className="text-sm font-medium">Trigbit</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Type</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.type ?? "Select type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[
                      "Operational",
                      "Administrative",
                      "Research",
                      "Support",
                    ].map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => setTaskForm({ ...taskForm, type })}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Status</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.status
                        ? STATUS_OPTIONS.find((s) => s.id === taskForm.status)
                          ?.label
                        : "Select status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {STATUS_OPTIONS.map((s) => (
                      <DropdownMenuItem
                        key={s.id}
                        onClick={() =>
                          setTaskForm({
                            ...taskForm,
                            status: s.id as Card["status"],
                          })
                        }
                      >
                        <div className="flex items-center gap-2">
                          {s.icon}
                          <span>{s.label}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Priority</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.priority ? (
                        <span className="flex items-center gap-1">
                          <Flag
                            className={getPriorityColor(taskForm.priority)}
                          />
                          {PRIORITY_LABELS[taskForm.priority]}
                        </span>
                      ) : (
                        "Set priority"
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                      <DropdownMenuItem
                        key={k}
                        onClick={() =>
                          setTaskForm({
                            ...taskForm,
                            priority: k as keyof typeof PRIORITY_LABELS,
                          })
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Flag className={getPriorityColor(k)} />
                          <span>{v}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Assignee</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.assignee ?? "Select assignee"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["Me", "John Doe", "Jane Smith", "Team A"].map((a) => (
                      <DropdownMenuItem
                        key={a}
                        onClick={() =>
                          setTaskForm({ ...taskForm, assignee: a })
                        }
                      >
                        {a}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Due date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.dueDate
                        ? format(parseISO(taskForm.dueDate), "MMM d, yyyy")
                        : "Pick due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={
                        taskForm.dueDate
                          ? parseISO(taskForm.dueDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        setTaskForm({
                          ...taskForm,
                          dueDate: toLocalISOString(date),
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t border-gray-200 dark:border-zinc-800 p-4">
            <Button variant="ghost" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== EVENT DIALOG (Redesigned to match SS2) ===== */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="overflow-x-hidden w-full max-w-[100vw] sm:max-w-3xl lg:max-w-3xl p-0 max-h-[100dvh] overflow-y-auto sm:overflow-hidden bg-background border-border text-foreground">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] divide-y md:divide-y-0 md:divide-x divide-border">

            {/* LEFT side */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              {/* Title row */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold ">
                  {editingEvent ? "Edit event" : "Create event"}
                </h2>
                {/* Set repeats toggle - top right of left panel */}
                {/* <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Set repeats</span>
                  <Switch
                    checked={eventForm.isRecurring}
                    onCheckedChange={(v) => setEventForm({ ...eventForm, isRecurring: v })}
                  />
                </div> */}
              </div>

              {/* Date and Time */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-muted/50 dark:bg-[#2a2a2a] rounded-lg px-3 py-2 border border-border dark:border-[#3a3a3a]">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-sm  font-medium hover:text-muted-foreground transition-colors outline-none">
                        {eventForm.date
                          ? format(new Date(eventForm.date), "MMM d, yyyy") === format(new Date(), "MMM d, yyyy")
                            ? "Today"
                            : format(new Date(eventForm.date), "MMM d, yyyy")
                          : "Today"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 bg-background border-border">
                      <Calendar
                        mode="single"
                        selected={eventForm.date ? new Date(eventForm.date) : undefined}
                        onSelect={(date) => setEventForm({ ...eventForm, date: date?.toISOString() || new Date().toISOString() })}
                        className="bg-[#1a1a1a] text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="time"
                    value={eventForm.startTime}
                    onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                    className="bg-muted/50 dark:bg-[#2a2a2a] border border-border dark:border-[#3a3a3a] text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 w-24"
                  />
                  <span className="text-muted-foreground">–</span>
                  <input
                    type="time"
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    className="bg-muted/50 dark:bg-[#2a2a2a] border border-border dark:border-[#3a3a3a] text-foreground rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 w-24"
                  />
                </div>
              </div>

              {/* Event name */}
              <Input
                id="event-name"
                placeholder="Event name"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="bg-muted/50 dark:bg-[#2a2a2a] border-border dark:border-[#3a3a3a] text-foreground placeholder:text-muted-foreground focus-visible:ring-red-500 focus-visible:border-red-500"
              />

              {/* Location */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-muted/50 dark:bg-[#2a2a2a] border border-border dark:border-[#3a3a3a] rounded-lg px-3 py-2 text-sm text-muted-foreground min-w-[120px]">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Location</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </div>
                <Input
                  placeholder="Event location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="flex-1 bg-muted/50 dark:bg-[#2a2a2a] border-border dark:border-[#3a3a3a] text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Event agenda */}
              <Textarea
                placeholder="Event agenda"
                rows={8}
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="bg-muted/50 dark:bg-[#2a2a2a] border-border dark:border-[#3a3a3a] text-foreground placeholder:text-muted-foreground resize-none"
              />

              {/* Action buttons */}
              {/* <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-white">
                  <Paperclip className="w-4 h-4" />
                  Attach file
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-white">
                  <Bell className="w-4 h-4" />
                  Set reminder
                </Button>
              </div> */}
            </div>

            {/* RIGHT sidebar */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              {/* Create in */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Create in</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-semibold shrink-0">
                    {projectId ? projectId[0].toUpperCase() : "P"}
                  </div>
                  <span className="text-sm font-medium  truncate">
                    {projectId ? `Project` : "No project"}
                  </span>
                </div>
              </div>

              {/* Type - from API event types */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Type</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 text-sm  hover:text-muted-foreground transition-colors w-full outline-none">
                      {selectedEventType ? (
                        <>
                          <div
                            className="w-4 h-4 rounded-full shrink-0"
                            style={{ backgroundColor: selectedEventType.colorOrIcon || "#6366f1" }}
                          />
                          <span>{selectedEventType.name}</span>
                        </>
                      ) : eventTypes.length > 0 ? (
                        <>
                          <div className="w-4 h-4 rounded-full bg-blue-500 shrink-0" />
                          <span>Select type</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">No event types</span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-background border-border text-foreground">
                    {eventTypes.map((type) => (
                      <DropdownMenuItem
                        key={type.eventTypeId}
                        onClick={() => setEventForm({ ...eventForm, eventTypeId: type.eventTypeId || "" })}
                        className="hover:bg-muted dark:hover:bg-[#2a2a2a] cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: type.colorOrIcon || "#6366f1" }}
                          />
                          {type.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Participants - Multi Select */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-medium">Participants</p>

                {/* Creator (Me) */}
                {/* <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-semibold border-2 border-blue-400 shrink-0">
                    M
                  </div>
                  <span className="text-sm text-white">Me</span>
                </div> */}

                {/* Selected Additional Participants */}
                {selectedParticipants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedParticipants.map((userId) => {
                      const user = users.find(u => (u.id || u.userID) === userId);
                      if (!user) return null;
                      return (
                        <div
                          key={userId}
                          className="flex items-center gap-1.5 bg-zinc-800 rounded-full pl-2 pr-3 py-1 text-sm"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                            {(user.email?.[0] || user.userName?.[0] || "U").toUpperCase()}
                          </div>
                          <span className="truncate max-w-[140px]">{user.email || user.userName}</span>
                          <button
                            onClick={() => setSelectedParticipants(prev => prev.filter(id => id !== userId))}
                            className="ml-1 text-zinc-400 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Participants Button + Popover with Multi-Select */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer transition-colors outline-none">
                      <span className="text-lg leading-none">+</span>
                      <span>Add participants</span>
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-80 p-0 bg-background border-border pointer-events-auto"
                    align="center"
                    side="bottom"
                    sideOffset={16}
                    collisionPadding={24}
                  >
                    <div className="p-3 border-b border-border space-y-2">
                      <p className="text-sm font-medium text-foreground">Select participants</p>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                        <Input
                          placeholder="Search participants..."
                          className="pl-8 h-8 text-xs bg-muted/40 border-border/30 rounded-lg text-foreground focus-visible:ring-1"
                          value={participantSearch}
                          onChange={(e) => setParticipantSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div
                      ref={(el) => {
                        if (el) {
                          el.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
                          el.addEventListener("touchmove", (e) => e.stopPropagation(), { passive: true });
                        }
                      }}
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="h-48 overflow-y-auto p-3 space-y-2"
                    >
                      {(() => {
                        const filtered = users.filter((u) => {
                          const query = participantSearch.toLowerCase().trim();
                          if (!query) return true;
                          return (
                            u.email?.toLowerCase().includes(query) ||
                            u.userName?.toLowerCase().includes(query)
                          );
                        });
                        return filtered.length > 0 ? (
                          filtered.map((user) => {
                            const userId = user.id || user.userID;
                            const isSelected = selectedParticipants.includes(userId);

                            return (
                              <div
                                key={userId}
                                className="flex items-center gap-3 p-2 hover:bg-muted/80 rounded-lg cursor-pointer transition-colors"
                                onClick={() => {
                                  setSelectedParticipants(prev =>
                                    isSelected
                                      ? prev.filter(id => id !== userId)
                                      : [...prev, userId]
                                  );
                                }}
                              >
                                <Checkbox checked={isSelected} />
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-emerald-600 text-white text-xs">
                                    {(user.email?.[0] || user.userName?.[0] || "U").toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-foreground">
                                    {user.email || user.userName}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-xs text-muted-foreground">No users found</div>
                        );
                      })()}
                    </div>

                    <div className="p-3 border-t border-border text-right">
                      <p className="text-xs text-muted-foreground">
                        {selectedParticipants.length} selected
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t border-border px-4 sm:px-6 py-4 bg-muted/30 dark:bg-[#1a1a1a]">
            <Button variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => setEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEvent}
              disabled={isSavingEvent || !eventForm.title.trim()}
              className=" disabled:opacity-40"
            >
              {isSavingEvent ? "Saving..." : editingEvent ? "Save changes" : "Create event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      {/* Event Detail Sheet — opens in sidebar just like tasks */}
      <TaskDetailSheet
        open={eventSheetOpen}
        onOpenChange={setEventSheetOpen}
        task={eventForSheet}
        isEvent={true}
        onUpdateTask={async (updatedEvent: any) => {
          try {
            await EventService.putApiVEvent("1", {
              eventId: updatedEvent.id,
              name: updatedEvent.title,
              description: updatedEvent.description,
              location: updatedEvent.location,
              startDate: updatedEvent.startDate,
              endDate: updatedEvent.endDate,
              isRecurring: updatedEvent.isRecurring || false,
              eventTypeId: updatedEvent.eventTypeId || null,
              isActive: true,
              status: "-",
            });
            fetchEvents();
          } catch (err) {
            console.error("Failed to update event from sheet", err);
          }
        }}
        onDeleteTask={async (eventId: string) => {
          try {
            await EventService.deleteEvent(eventId, "1");
            fetchEvents();
            setEventSheetOpen(false);
          } catch (err) {
            console.error("Failed to delete event from sheet", err);
          }
        }}
      />

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        open={taskSheetOpen}
        onOpenChange={setTaskSheetOpen}
        task={taskForSheet}
        isEvent={false}
        onUpdateTask={async (updatedTask: any) => {
          try {
            await TaskService.taskPut("1", {
              taskId: updatedTask.id,
              name: updatedTask.title || "Untitled",
              description: updatedTask.description || "Task description",
              status: updatedTask.status || null,
              startDate: updatedTask.startDate || null,
              dueDate: updatedTask.dueDate || null,
              estimatedHours: updatedTask.estimatedHours ?? null,
              isActive: true,
              isRecurring: false,
              taskTypeId: updatedTask.taskTypeId || updatedTask.type || null,
              taskPriorityId: updatedTask.taskPriorityId || null,
              assignedTo: updatedTask.assignee || updatedTask.assignedTo || null,
            } as any);
            fetchTasks();
          } catch (err) {
            console.error("Failed to update task from sheet", err);
          }
        }}
        onDeleteTask={async (taskId: string) => {
          try {
            await TaskService.taskDelete(taskId, "1");
            fetchTasks();
            setTaskSheetOpen(false);
          } catch (err) {
            console.error("Failed to delete task from sheet", err);
          }
        }}
      />
    </div>
  );
};
