"use client";

import { useState, useRef } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Scheduled from "@/components/kanban/Scheduled";
import { SheetTitle } from "@/components/ui/sheet";
import {
  X,
  CalendarDays,
  Clock,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Equal,
  Minus,
  ListTodo,
  Paperclip,
  PauseCircle,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Trash2,
  Tag,
  Repeat,
  Info,
  Users,
} from "lucide-react";

import type { Card } from "@/components/kanban/types";
import { TASK_TYPES, getTypeColor } from "@/components/kanban/taskTypes";
import { useEffect } from "react";
import { TaskTypeService } from "@/api/services/TaskTypeService";
import { TaskStatusService } from "@/api/services/TaskStatusService";
import { TaskTypeListVM } from "@/api/models/TaskTypeListVM";
import { TaskStatusListVM } from "@/api/models/TaskStatusListVM";
import { TaskPriorityService } from "@/api/services/TaskPriorityService";
import { TaskPriorityListVM } from "@/api/models/TaskPriorityListVM";
import { useSearchParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { TaskService } from "@/api/services/TaskService";
import { syncReminderWithEvent } from "./reminderUtils";

import { UserService } from "@/api/services/UserService";
import { UserIntermediateService } from "@/api/services/UserIntermediateService";
import { IoAdd } from "react-icons/io5";
import { TaskRecurrenceModal } from "@/components/kanban/TaskRecurrenceModal";
import { RecurrenceRuleService } from "@/api/services/RecurrenceRuleService";
import { RecurrenceRuleListVM } from "@/api/models/RecurrenceRuleListVM";
import { EventTypeService } from "@/api/services/EventTypeService";
import { EventService } from "@/api/services/EventService";
import { Settings, CheckCircle2 } from "lucide-react";
import { ReminderService } from "@/api/services/ReminderService";
import { TagService } from '@/api/services/TagService';
import { TagIntermediateService } from '@/api/services/TagIntermediateService';
import { DocumentsService } from "@/api/services/DocumentsService";
import { FileIcon, FileText, FileImage, Download, ExternalLink, Loader2 } from "lucide-react";
import { getFileExtension, getMimeType } from "@/utils/file-utils";
import { FilePreviewDialog } from "@/components/FilePreview";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import type { CreateUserIntermediateCommand } from "@/api/models/CreateUserIntermediateCommand";

/* ---------------- REMINDER OPTIONS ---------------- */
const REMINDER_OPTIONS = [
  { label: "Don't remind", minutes: null },
  { label: "At time of event", minutes: 0 },
  { label: "5 minutes before", minutes: 5 },
  { label: "10 minutes before", minutes: 10 },
  { label: "15 minutes before", minutes: 15 },
  { label: "30 minutes before", minutes: 30 },
  { label: "1 hour before", minutes: 60 },
  { label: "2 hours before", minutes: 120 },
  { label: "1 day before", minutes: 1440 },
];

interface TaskDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Card | any | null;
  onUpdateTask?: (task: any) => void;
  onDeleteTask?: (taskId: string) => void;
  isEvent?: boolean;
}
/* ---------------- STATUS CONFIG ---------------- */
const defaultStatuses = [
  { id: "new", label: "New task", color: "bg-gray-500", emoji: "🗒️" },
  { id: "scheduled", label: "Scheduled", color: "bg-yellow-500", emoji: "📅" },
  { id: "inprogress", label: "In progress", color: "bg-blue-500", emoji: "🔧" },
  { id: "completed", label: "Completed", color: "bg-green-500", emoji: "✅" },
];

/* ---------------- TYPE CONFIG ---------------- */
// Imported from shared taskTypes.ts


/* ---------------- TIME OPTIONS ---------------- */
const timeOptions = [
  "15 min",
  "30 min",
  "45 min",
  "1 hour",
  "1:30 hours",
  "2 hours",
];

const timeToHoursMap: Record<string, number> = {
  "15 min": 0.25,
  "30 min": 0.5,
  "45 min": 0.75,
  "1 hour": 1,
  "1:30 hours": 1.5,
  "2 hours": 2,
};

const hoursToTimeLabel = (hours: number | undefined | null): string => {
  if (hours === undefined || hours === null) return "0h";
  const entry = Object.entries(timeToHoursMap).find(([_, v]) => v === hours);
  return entry ? entry[0] : `${hours}h`;
};

/* ---------------- PRIORITY ---------------- */


const toLocalISOString = (date: Date | string | undefined | null) => {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return undefined;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
};

export const TaskDetailSheet = ({
  open,
  onOpenChange,
  task,
  onUpdateTask: onUpdateTaskProp,
  onDeleteTask: onDeleteTaskProp,
  isEvent,
}: TaskDetailSheetProps) => {
  const onUpdateTask = (updatedTask: any) => {
    if (onUpdateTaskProp) {
      onUpdateTaskProp(updatedTask);
      toast.success(isEvent ? "Event updated" : "Task updated");
    }
  };

  // Remove a tag intermediate association
  const removeTagFromTask = async (intermediateId: string) => {
    if (!intermediateId) return;
    try {
      await TagIntermediateService.deleteTagIntermediate(intermediateId, "1");
      // refresh attached tags
      if (task?.id) {
        const resp = await TagIntermediateService.getApiVTagIntermediate("1", isEvent ? "Events" : "Task", task.id);
        if (resp && resp.success && resp.data) {
          const intermediates = resp.data;
          const mapped = intermediates.map((inter: any) => {
            const tagId = inter.tagId || inter.tagID || inter.tagid;
            const intermediateId = inter.tagIntermediateId || inter.tagIntermediateID || inter.id || inter.tagIntermediateId;
            const tagObj = (allTags || []).find((t: any) => (t.tagId || t.id) === tagId) || { tagId: tagId, name: inter.tagName || inter.name || "" };
            return { ...(tagObj as any), intermediateId, tagId };
          });
          setTaskTags(mapped);
        }
      }
      toast.success("Tag removed");
    } catch (err) {
      console.error("Failed to remove tag", err);
      toast.error("Failed to remove tag");
    }
  };

  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");
  const projectId = projectIdFromUrl || localStorage.getItem("activeProjectId") || "";

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localTitle, setLocalTitle] = useState(task?.title || "");
  const [localDesc, setLocalDesc] = useState(task?.description || "");
  const [localLocation, setLocalLocation] = useState(task?.location || "");
  const [localEventDate, setLocalEventDate] = useState("");
  const [localStartTime, setLocalStartTime] = useState("");
  const [localEndTime, setLocalEndTime] = useState("");
  const [attachedDocuments, setAttachedDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentUrlListVM | null>(null);

  // Helper: build ISO from a date string + time string
  const buildISO = (dateStr: string, timeStr: string): string => {
    if (!dateStr || !timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date(dateStr);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  useEffect(() => {
    if (task) {
      setLocalTitle(task.title || "");
      setLocalDesc(task.description || "");
      setLocalLocation(task.location || "");
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setEstimatedTime(hoursToTimeLabel(task.estimatedHours));
      // Sync event date/time fields
      if (task.startDate) {
        const sd = new Date(task.startDate);
        setLocalEventDate(sd.toISOString().split("T")[0]); // YYYY-MM-DD
        setLocalStartTime(`${String(sd.getHours()).padStart(2, "0")}:${String(sd.getMinutes()).padStart(2, "0")}`);
      }
      if (task.endDate) {
        const ed = new Date(task.endDate);
        setLocalEndTime(`${String(ed.getHours()).padStart(2, "0")}:${String(ed.getMinutes()).padStart(2, "0")}`);
      }
    }
  }, [task?.title, task?.description, task?.location, task?.dueDate, task?.estimatedHours, task?.taskPriorityId, task?.startDate, task?.endDate]);
  const [tasks, setTasks] = useState([]);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [showType, setShowType] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // Tag UI state
  const [allTags, setAllTags] = useState<any[]>([]);
  const [tagQuery, setTagQuery] = useState("");
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [taskTags, setTaskTags] = useState<any[]>([]);

  // Save selected tags to task/event (posts only new relations)
  const saveSelectedTags = async (tags: any[]) => {
    if (!task?.id || !tags || tags.length === 0) return;
    try {
      const existingIds = taskTags.map((t: any) => t.tagId || t.id);
      const toAdd = tags.filter((t) => !existingIds.includes(t.tagId || t.id));

      for (const tag of toAdd) {
        await TagIntermediateService.postApiVTagIntermediate("1", {
          tagId: tag.tagId || tag.id,
          category: isEvent ? "Events" : "Task",
          categoryId: task.id,
        } as any);
      }

      if (toAdd.length > 0) toast.success("Tag(s) added to task");
      setIsTagOpen(false);
      setSelectedTags([]);

      // Refresh attached tags (map intermediates -> tag objects and include intermediateId)
      try {
        const resp = await TagIntermediateService.getApiVTagIntermediate("1", isEvent ? "Events" : "Task", task.id);
        if (resp && resp.success && resp.data) {
          const intermediates = resp.data;
          const mapped = intermediates.map((inter: any) => {
            const tagId = inter.tagId || inter.tagID || inter.tagid;
            const intermediateId = inter.tagIntermediateId || inter.tagIntermediateID || inter.id || inter.tagIntermediateId;
            const tagObj = (allTags || []).find((t: any) => (t.tagId || t.id) === tagId) || { tagId: tagId, name: inter.tagName || inter.name || "" };
            return { ...(tagObj as any), intermediateId, tagId };
          });
          setTaskTags(mapped);
        }
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Failed to save tags", err);
      toast.error("Failed to save tag(s)");
    }
  };

  const [currentStatus, setCurrentStatus] = useState<(typeof defaultStatuses)[number]>(
    defaultStatuses[0],
  );
  const [openLogModal, setOpenLogModal] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const handleAddLog = (log: any) => {
    setLogs((prev) => [...prev, log]);
  };
  const [currentType, setCurrentType] = useState<(typeof TASK_TYPES)[number]>(
    TASK_TYPES[0],
  );

  const [dynamicTaskTypes, setDynamicTaskTypes] = useState<TaskTypeListVM[]>([]);
  const [dynamicTaskStatuses, setDynamicTaskStatuses] = useState<TaskStatusListVM[]>([]);
  const [dynamicTaskPriorities, setDynamicTaskPriorities] = useState<TaskPriorityListVM[]>([]);
  const [dynamicUsers, setDynamicUsers] = useState<any[]>([]);
  const [eventParticipants, setEventParticipants] = useState<any[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [openParticipantMenuId, setOpenParticipantMenuId] = useState<string | null>(null);
  const [isAddParticipantsOpen, setIsAddParticipantsOpen] = useState(false);
  const [selectedForAdd, setSelectedForAdd] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isSavingParticipants, setIsSavingParticipants] = useState(false);

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      await UserIntermediateService.deleteUserIntermediate(participantId, "1");
      setEventParticipants(prev => prev.filter((p: any) => p.userIntermediateId !== participantId));
      toast.success("Participant removed");
    } catch (err) {
      console.error("Failed to remove participant", err);
      toast.error("Failed to remove participant");
    } finally {
      setOpenParticipantMenuId(null);
    }
  };

  const handleOpenAddParticipants = () => {
    // Pre-select current participants
    const existingIds = eventParticipants
      .map((p) => p.userId || p.userID)
      .filter(Boolean);
    setSelectedForAdd(existingIds);
    setIsAddParticipantsOpen(true);
  };

  const handleSaveParticipants = async () => {
    if (!task?.id) return;
    setIsSavingParticipants(true);

    try {
      // Current IDs
      const existingIds = eventParticipants
        .map((p) => p.userId || p.userID)
        .filter(Boolean);

      // New ones to add
      const toAdd = selectedForAdd.filter((id) => !existingIds.includes(id));

      if (toAdd.length === 0) {
        setIsAddParticipantsOpen(false);
        return;
      }

      let addedCount = 0;
      for (const userId of toAdd) {
        const user = dynamicUsers.find((u) => u.id === userId || u.userID === userId);
        if (!user) continue;

        const payload: CreateUserIntermediateCommand = {
          userId: userId,
          category: "Event",
          userEmail: user.email || user.userName || "",
          categoryId: task.id,
        };

        try {
          await UserIntermediateService.postApiVUserIntermediate("1", payload);
          addedCount++;
        } catch (err) {
          console.error(`Failed to add participant ${userId}`, err);
        }
      }

      if (addedCount > 0) {
        toast.success(`${addedCount} new participant(s) added`);
        // Refresh list
        const response = await UserIntermediateService.getApiVUserIntermediate("1", "Event", task.id);
        if (response.success && response.data) {
          setEventParticipants(response.data);
        }
      }

      setIsAddParticipantsOpen(false);
    } catch (err) {
      console.error("Failed to save participants", err);
      toast.error("An error occurred while saving participants");
    } finally {
      setIsSavingParticipants(false);
    }
  };

  useEffect(() => {
    if (open && projectId) {
      if (isEvent) {
        // Fetch Event Types
        EventTypeService.getApiVEventType("1", "Project", projectId)
          .then((response) => {
            if (response.success && response.data) {
              setDynamicTaskTypes(response.data as any);
            }
          })
          .catch((error) => console.error("Failed to fetch event types:", error));
      } else {
        // Fetch Task Types
        TaskTypeService.taskTypeGet("1", "Project", projectId)
          .then((response) => {
            if (response.success && response.data) {
              setDynamicTaskTypes(response.data);
            }
          })
          .catch((error) => console.error("Failed to fetch task types:", error));
      }

      // Fetch Statuses
      TaskStatusService.getApiVTaskStatus("1", "Project", projectId)
        .then((response) => {
          if (response.success && response.data) {
            setDynamicTaskStatuses(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch task statuses:", error);
        });

      // Fetch Priorities
      if (!isEvent) {
        TaskPriorityService.getApiVTaskPriority("1")
          .then((response) => {
            if (response.success && response.data) {
              setDynamicTaskPriorities(response.data);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch task priorities:", error);
          });
      }

      // Fetch Users for Assignee dropdown
      UserService.getApiVUser("1")
        .then((response) => {
          if (response.success && response.data) {
            setDynamicUsers(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch users:", error);
        });

      // NEW: Fetch subtasks
      if (task?.id && !isEvent) {
        TaskService.taskGet("1", "task", task.id)
          .then((response) => {
            if (response.success && response.data) {
              setSubtasks(response.data.map((t: any) => ({
                id: t.taskId,
                name: t.name,
                dueDate: t.endDate ? new Date(t.endDate) : null,
                time: hoursToTimeLabel(t.estimatedHours),
                assignee: t.assignedTo || "",
                completed: t.status === "completed" || t.status === "3e9b7b9b-7e9b-4e9b-8e9b-7e9b7e9b7e9b", // handle both ID and name
              })));
            }
          })
          .catch((error) => console.error("Failed to fetch subtasks:", error));
      }

      // Fetch Recurrence Rule
      if (task?.id) {
        RecurrenceRuleService.getApiVRecurrenceRule("1", isEvent ? "Events" : "Task", task.id)
          .then((response) => {
            if (response.success && response.data && response.data.length > 0) {
              setRecurrenceRule(response.data[0]);
            } else {
              setRecurrenceRule(null);
            }
          })
          .catch((error) => console.error("Failed to fetch recurrence rule:", error));

        // Fetch tags and attached tags for this task/event
        TagService.getTagList("1")
          .then((resp) => {
            if (resp.success && resp.data) {
              setAllTags(resp.data);

              // Now fetch attached tags and map to objects
                    if (task?.id) {
                      TagIntermediateService.getApiVTagIntermediate("1", isEvent ? "Events" : "Task", task.id)
                        .then((r) => {
                          if (r && r.success && r.data) {
                            // r.data is list of intermediate entries with tagId and intermediate id
                            const intermediates = r.data;
                            const mapped = intermediates.map((inter: any) => {
                              const tagId = inter.tagId || inter.tagID || inter.tagid;
                              const intermediateId = inter.tagIntermediateId || inter.tagIntermediateID || inter.id || inter.tagIntermediateId;
                              const tagObj = (resp.data || []).find((t: any) => (t.tagId || t.id) === tagId) || { tagId: tagId, name: inter.tagName || inter.name || "" };
                              return { ...(tagObj as any), intermediateId, tagId };
                            });
                            setTaskTags(mapped);
                          }
                        })
                        .catch((e) => console.error("Failed to fetch task tags", e));
                    }
            }
          })
          .catch((err) => console.error("Failed to fetch tags", err));
      }

      // Fetch Reminders for events
      if (task?.id && isEvent) {
        ReminderService.getApiVReminder("1", "Events", task.id)
          .then((response) => {
            if (response.success && response.data && response.data.length > 0) {
              const reminder = response.data[0];
              if (reminder.reminderDate && task.startDate) {
                const rDate = new Date(reminder.reminderDate);
                const sDate = new Date(task.startDate);
                const diffMs = sDate.getTime() - rDate.getTime();
                const diffMin = Math.round(diffMs / 60000);

                // Find matching option (fuzzy match within 1 minute)
                const matchedOption = REMINDER_OPTIONS.find(opt =>
                  opt.minutes !== null && Math.abs(opt.minutes - diffMin) <= 1
                );
                if (matchedOption) {
                  setCurrentReminder(matchedOption);
                } else {
                  // If custom time, just show the label for the first match or default
                  setCurrentReminder(REMINDER_OPTIONS[0]);
                }
                setExistingReminderId(reminder.reminderId || null);
              }
            } else {
              setCurrentReminder(REMINDER_OPTIONS[0]);
              setExistingReminderId(null);
            }
          })
          .catch((error) => console.error("Failed to fetch reminders:", error));
      }

      // Fetch Participants (Events only)
      if (task?.id && isEvent) {
        setIsLoadingParticipants(true);
        UserIntermediateService.getApiVUserIntermediate("1", "Event", task.id)
          .then((response) => {
            if (response.success && response.data) {
              setEventParticipants(response.data);
            } else {
              setEventParticipants([]);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch participants:", error);
            setEventParticipants([]);
          })
          .finally(() => setIsLoadingParticipants(false));
      }

      // Fetch Documents
      if (task?.id) {
        const category = isEvent ? "Events" : "Tasks";
        DocumentsService.getApiVDocuments("1", category, task.id)
          .then((response) => {
            if (response.success && response.data) {
              setAttachedDocuments(response.data);
            }
          })
          .catch((error) => console.error("Failed to fetch documents:", error));
      }
    }
  }, [open, projectId, task?.id, isEvent]);

  // Sync currentStatus with task.status and dynamicTaskStatuses
  useEffect(() => {
    if (task?.status) {
      const dynamicStatus = dynamicTaskStatuses.find(s => s.taskStatusId === task.status);
      if (dynamicStatus) {
        setCurrentStatus({
          id: dynamicStatus.taskStatusId || "",
          label: dynamicStatus.name || "",
          color: "bg-zinc-800",
          emoji: dynamicStatus.colorOrIcon || "🗒️"
        });
      } else {
        const defaultStatus = defaultStatuses.find(s => s.id === task.status);
        if (defaultStatus) {
          setCurrentStatus(defaultStatus);
        }
      }
    }
  }, [task?.status, dynamicTaskStatuses]);

  // Helper to get Type Name from taskTypeId (NEW)
  const getTypeNameFromId = (taskTypeId?: string | null): string => {
    if (!taskTypeId) return "No type";
    const foundType = dynamicTaskTypes.find((t) => (t.taskTypeId === taskTypeId || (t as any).eventTypeId === taskTypeId));
    return foundType?.name || taskTypeId; // fallback to ID if name not found
  };

  // Updated getDynamicTypeColor to support both name and taskTypeId
  const getDynamicTypeColor = (typeIdentifier?: string | null) => {
    if (!typeIdentifier) return "#94a3b8";

    // Try by name
    const byName = dynamicTaskTypes.find((t) => t.name === typeIdentifier);
    if (byName?.colorOrIcon) return byName.colorOrIcon;

    // Try by taskTypeId or eventTypeId
    const byId = dynamicTaskTypes.find((t) => t.taskTypeId === typeIdentifier || (t as any).eventTypeId === typeIdentifier);
    if (byId?.colorOrIcon) return byId.colorOrIcon;

    return getTypeColor(typeIdentifier);
  };

  const [showFileMenu, setShowFileMenu] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate ? new Date(task.dueDate) : null);
  const [estimatedTime, setEstimatedTime] = useState<string>("0h");
  const [priority, setPriority] = useState<{ label: string; color: string } | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showLogTime, setShowLogTime] = useState<boolean>(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [showTaskCalendar, setShowTaskCalendar] = useState<boolean>(false);
  const [showAddSubtaskInput, setShowAddSubtaskInput] = useState(false);
  const [showSubtaskCalendar, setShowSubtaskCalendar] =
    useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSubtasks, setShowSubtasks] = useState<boolean>(false);
  const [subtask, setSubtask] = useState<string>("");
  const [assigneeSearch, setAssigneeSearch] = useState("");

  // Filtered users based on search
  const filteredUsers = dynamicUsers.filter((user) => {
    const searchTerm = assigneeSearch.toLowerCase();
    return (
      (user.email && user.email.toLowerCase().includes(searchTerm)) ||
      (user.name && user.name.toLowerCase().includes(searchTerm))
    );
  });
  const [openCalendarIndex, setOpenCalendarIndex] = useState<number | null>(
    null,
  );
  const [subtaskTime, setSubtaskTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [subtasks, setSubtasks] = useState<
    {
      id?: string;
      name: string;
      dueDate: Date | null;
      time: string;
      assignee: string;
      completed?: boolean;
    }[]
  >([]);
  const [subtaskDueDate, setSubtaskDueDate] = useState<Date | null>(null);
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRuleListVM | null>(null);

  // Helper to format days of week (1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun)
  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      "1": "Monday",
      "2": "Tuesday",
      "3": "Wednesday",
      "4": "Thursday",
      "5": "Friday",
      "6": "Saturday",
      "7": "Sunday",
    };
    return days[day] || "";
  };

  const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const getRecurrenceSummary = (rule: RecurrenceRuleListVM | null) => {
    if (!rule) return isEvent ? "Repeat event" : "Repeat task";
    const { frequency, interval, daysOfWeek, daysOfMonth, isSkipWeekend } = rule;

    let summary = "";

    // Day frequency — weekday vs day
    if (frequency === "Day" && isSkipWeekend) {
      summary = (!interval || interval === 1) ? "Every weekday" : `Every ${interval} weekdays`;
    } else if (frequency === "Month") {
      summary = (!interval || interval === 1) ? "Every month" : `Every ${interval} months`;
      // Append selected days of month
      if (daysOfMonth) {
        const dayNums = daysOfMonth.split(",").map(Number).filter(Boolean).sort((a, b) => a - b);
        if (dayNums.length > 0) {
          summary += ` on the ${dayNums.map(getOrdinal).join(", ")}`;
        }
      }
    } else {
      summary = (!interval || interval === 1)
        ? `Every ${frequency?.toLowerCase()}`
        : `Every ${interval} ${frequency?.toLowerCase()}s`;
    }

    if (frequency === "Week" && daysOfWeek) {
      const dayNames = daysOfWeek.split(",").map(getDayName).filter(Boolean);
      if (dayNames.length > 0) {
        summary += ` on ${dayNames.join(", ")}`;
      }
    }

    return summary;
  };

  const [showRepeatMenu, setShowRepeatMenu] = useState(false);
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [initialRecurrenceRule, setInitialRecurrenceRule] = useState<any>(null);

  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(REMINDER_OPTIONS[0]);
  const [existingReminderId, setExistingReminderId] = useState<string | null>(null);

  const handleRepeatOption = (option: string) => {
    setShowRepeatMenu(false);
    let rule: any = { frequency: "Day", interval: 1 };

    switch (option) {
      case "Every day":
        rule = { frequency: "Day", interval: 1 };
        break;
      case "Every workday":
        rule = { frequency: "Day", interval: 1, skipWeekends: true }; // Modal logic handles skip weekends
        break;
      case "Every week":
        rule = { frequency: "Week", interval: 1 };
        break;
      case "Every month":
        rule = { frequency: "Month", interval: 1 };
        break;
      case "Every year":
        rule = { frequency: "Year", interval: 1 };
        break;
    }

    if (task?.transactionDate) {
      rule.transactionDate = task.transactionDate;
    }
    setInitialRecurrenceRule(rule);
    setShowRecurrenceModal(true);
  };

  const handleReminderOption = async (option: typeof REMINDER_OPTIONS[0]) => {
    setCurrentReminder(option);
    setShowReminderMenu(false);

    // CASE: Delete existing reminder
    if (option.minutes === null) {
      if (existingReminderId) {
        try {
          await ReminderService.deleteReminder(existingReminderId, "1");
          setExistingReminderId(null);
          toast.success("Reminder removed");
        } catch (error) {
          console.error("Failed to delete reminder:", error);
        }
      }
      return;
    }

    if (!task?.id || !task?.startDate) {
      toast.error("Event start date is required for reminders");
      return;
    }

    try {
      const eventDate = new Date(task.startDate);
      const reminderDate = new Date(eventDate.getTime() - option.minutes * 60000);

      const payload = {
        name: task.title || "Reminder",
        description: task.description || task.title || "Reminder for event",
        reminderDate: reminderDate.toISOString(),
        category: "Events",
        categoryId: task.id,
      };

      if (existingReminderId) {
        // UPDATE existing reminder
        await ReminderService.putApiVReminder("1", {
          ...payload,
          reminderId: existingReminderId,
        } as any);
        toast.success(`Reminder updated to ${option.label}`);
      } else {
        // CREATE new reminder
        const response = await ReminderService.postApiVReminder("1", payload as any);
        if (response && response.data) {
          setExistingReminderId(response.data.reminderId || null);
        }
        toast.success(`Reminder set for ${option.label}`);
      }
    } catch (error) {
      console.error("Failed to save reminder:", error);
      toast.error("Failed to save reminder");
    }
  };

  const handleSaveRecurrence = async (rule: any) => {
    try {
      if (task?.id) {
        let response;
        const ruleId = recurrenceRule?.recurrenceRuleId;
        if (ruleId) {
          // Update existing rule using new RecurrenceRuleService
          response = await RecurrenceRuleService.putApiVRecurrenceRule("1", {
            ...rule,
            recurrenceRuleId: ruleId,
          });
          toast.success("Recurrence rule updated");
        } else {
          // Create new rule using new RecurrenceRuleService
          response = await RecurrenceRuleService.postApiVRecurrenceRule("1", {
            ...rule,
            category: isEvent ? "Events" : "Task",
            categoryId: task.id,
          });
          toast.success("Recurrence rule created");
        }

        // Update the local rule so the Repeat row reflects the change immediately
        if (response && response.data) {
          setRecurrenceRule(response.data as any);
        } else {
          setRecurrenceRule({
            ...rule,
            category: isEvent ? "Events" : "Task",
            categoryId: task.id,
            recurrenceRuleId: ruleId
          });
        }
      }
    } catch (error) {
      console.error("Failed to save recurrence rule:", error);
      toast.error("Failed to save recurrence rule");
    }
  };

  if (!task) return null;
  const taskName = task.title;
  const firstLetter = taskName.charAt(0).toUpperCase();
  const formatDate = (date: Date | null) => {
    if (!date) return "No due date";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const toggle = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (

    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[600px] lg:w-[700px] border-l border-border bg-background p-6 sm:p-8 overflow-y-auto [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Task Details</SheetTitle>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Personal Workspace / Project
            </p>

            <input
              type="text"
              className="text-2xl sm:text-3xl font-bold mt-1 w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground focus:ring-0"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={() => {
                if (localTitle.trim() !== task.title && onUpdateTask) {
                  onUpdateTask({ ...task, title: localTitle.trim() });
                }
              }}
              placeholder="Task title"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (window.confirm(`Are you sure you want to delete this ${isEvent ? "event" : "task"}?`)) {
                  if (onDeleteTaskProp) {
                    onDeleteTaskProp(task.id);
                    onOpenChange(false);
                  } else {
                    try {
                      if (isEvent) {
                        await EventService.deleteEvent(task.id, "1");
                        toast.success("Event deleted");
                      } else {
                        await TaskService.taskDelete(task.id, "1");
                        toast.success("Task deleted");
                      }
                      onOpenChange(false);
                    } catch (error) {
                      toast.error(`Failed to delete ${isEvent ? "event" : "task"}`);
                    }
                  }
                }
              }}
              className="p-2  hover:text-red-500 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
              title="Delete task"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MAIN DETAILS */}
        <div className="space-y-6 text-sm">
          {/* isEvent CONDITIONAL BRANCH */}
          {isEvent ? (
            <>
              {/* DATE & TIME (editable for events) */}
              <div className="relative text-gray-800 dark:text-zinc-200">
                <DetailRow
                  label="Date & Time"
                  value={
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Date */}
                      <input
                        type="date"
                        value={localEventDate}
                        onChange={(e) => setLocalEventDate(e.target.value)}
                        onBlur={() => {
                          if (onUpdateTask && localEventDate && localStartTime) {
                            const newStart = buildISO(localEventDate, localStartTime);
                            const oldStart = task.startDate;
                            onUpdateTask({
                              ...task,
                              startDate: newStart,
                              endDate: localEndTime ? buildISO(localEventDate, localEndTime) : task.endDate,
                            });
                            if (isEvent && task.id) {
                              syncReminderWithEvent(task.id, newStart, oldStart, task.title, task.description);
                            }
                          }
                        }}
                        className="bg-muted/50 dark:bg-zinc-900 border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:border-muted-foreground/30 transition-colors"
                      />
                      {/* Start time */}
                      <input
                        type="time"
                        value={localStartTime}
                        onChange={(e) => setLocalStartTime(e.target.value)}
                        onBlur={() => {
                          if (onUpdateTask && localEventDate && localStartTime) {
                            const newStart = buildISO(localEventDate, localStartTime);
                            const oldStart = task.startDate;
                            onUpdateTask({
                              ...task,
                              startDate: newStart,
                            });
                            if (isEvent && task.id) {
                              syncReminderWithEvent(task.id, newStart, oldStart, task.title, task.description);
                            }
                          }
                        }}
                        className="bg-muted/50 dark:bg-zinc-900 border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:border-muted-foreground/30 transition-colors"
                      />
                      <span className="text-zinc-500 text-sm">–</span>
                      {/* End time */}
                      <input
                        type="time"
                        value={localEndTime}
                        onChange={(e) => setLocalEndTime(e.target.value)}
                        onBlur={() => {
                          if (onUpdateTask && localEventDate && localEndTime) {
                            const newEnd = buildISO(localEventDate, localEndTime);
                            onUpdateTask({
                              ...task,
                              endDate: newEnd,
                            });
                          }
                        }}
                        className="bg-muted/50 dark:bg-zinc-900 border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:border-muted-foreground/30 transition-colors"
                      />
                    </div>
                  }
                />
              </div>

              {/* LOCATION */}
              <div className="relative text-gray-800 dark:text-zinc-200">
                <DetailRow
                  label="Location"
                  value={
                    <div className="flex items-center w-64 max-w-full">
                      <input
                        type="text"
                        value={localLocation}
                        onChange={(e) => setLocalLocation(e.target.value)}
                        onBlur={() => {
                          if (localLocation !== task.location && onUpdateTask) {
                            onUpdateTask({ ...task, location: localLocation });
                          }
                        }}
                        placeholder="Location"
                        className="flex-1 bg-muted/50 dark:bg-zinc-900 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-muted-foreground/30 transition-colors"
                      />
                    </div>
                  }
                />
              </div>

              {/* REMINDER */}
              <div className="relative text-gray-800 dark:text-zinc-200">
                <DetailRow
                  label="Reminder"
                  value={
                    <span className="text-sm font-medium text-foreground">
                      {currentReminder.label}
                    </span>
                  }
                  onClick={() => setShowReminderMenu(!showReminderMenu)}
                />

                {showReminderMenu && (
                  <div className="absolute top-10 right-0 w-56 bg-popover border border-border rounded-xl shadow-2xl z-[70] overflow-hidden">
                    <div className="p-2 space-y-1">
                      {REMINDER_OPTIONS.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleReminderOption(opt)}
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* REPEAT (events) — same logic as tasks; category="Events", categoryId=event id */}
              <div className="relative">
                <DetailRow
                  label="Repeat event"
                  value={
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <Repeat size={14} className={recurrenceRule ? "text-primary" : "opacity-60"} />
                      {getRecurrenceSummary(recurrenceRule)}
                    </span>
                  }
                  onClick={() => setShowRepeatMenu(!showRepeatMenu)}
                />

                {showRepeatMenu && (
                  <div className="absolute top-10 right-0 w-56 bg-popover border border-border rounded-xl shadow-2xl z-[70] overflow-hidden">
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                        After completion
                        <Info size={14} className="text-muted-foreground/50" />
                      </div>
                      <div className="h-px bg-border mx-2 my-1" />
                      <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Time-based
                      </div>
                      {["Every day", "Every workday", "Every week", "Every month", "Every year"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleRepeatOption(opt)}
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                      <div className="h-px bg-border mx-2 my-1" />
                      <button
                        onClick={() => {
                          setInitialRecurrenceRule(recurrenceRule ? { ...recurrenceRule, transactionDate: task?.transactionDate } : { transactionDate: task?.transactionDate });
                          setShowRepeatMenu(false);
                          setShowRecurrenceModal(true);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                      >
                        <Settings size={14} /> Customize repeat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // REGULAR TASK FIELDS
            <>
              {/* STATUS */}
              <div className="relative text-gray-800 dark:text-zinc-200">
                <DetailRow
                  label="Status"
                  value={
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <span className="text-base">{currentStatus.emoji}</span>
                      {currentStatus.label}
                    </span>
                  }
                  onClick={() => {
                    setShowStatus(!showStatus);
                    setShowType(false);
                    setShowCalendar(false);
                    setActiveDropdown(null);
                  }}
                />

                {showStatus && (
                  <div className="absolute top-10 right-0 w-52 rounded-lg border border-border bg-popover shadow-xl z-50 overflow-hidden">
                    {dynamicTaskStatuses.length > 0 ? (
                      dynamicTaskStatuses.map((s) => (
                        <button
                          key={s.taskStatusId}
                          onClick={() => {
                            const newStatus = {
                              id: s.taskStatusId || "",
                              label: s.name || "",
                              color: "bg-zinc-800",
                              emoji: s.colorOrIcon || "🗒️"
                            };
                            setCurrentStatus(newStatus);
                            setShowStatus(false);
                            if (task && onUpdateTask) {
                              onUpdateTask({ ...task, status: s.taskStatusId as string });
                            }
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition"
                        >
                          <span className="text-base">{s.colorOrIcon || "🗒️"}</span>
                          {s.name}
                        </button>
                      ))
                    ) : (
                      defaultStatuses.map((s) => (
                        <button
                          key={s.label}
                          onClick={() => {
                            setCurrentStatus(s);
                            setShowStatus(false);
                            if (task && onUpdateTask) {
                              onUpdateTask({ ...task, status: s.id as any });
                            }
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800 transition"
                        >
                          <span className="text-base">{s.emoji}</span>
                          {s.label}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* TYPE */}
              {/* TYPE - Now shows Type Name instead of ID */}
              <div className="relative text-gray-800 dark:text-zinc-200">
                <DetailRow
                  label="Type"
                  value={
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm text-foreground">
                      <span
                        className="w-5 h-5 rounded-md shrink-0"
                        style={{ backgroundColor: getDynamicTypeColor(task.taskTypeId || task.type) }}
                      />
                      {getTypeNameFromId(task.taskTypeId || task.type)}
                    </span>
                  }
                  onClick={() => {
                    setShowType(!showType);
                    setShowStatus(false);
                    setShowCalendar(false);
                    setActiveDropdown(null);
                  }}
                />

                {showType && (
                  <div className="absolute top-10 right-0 w-52 rounded-lg border border-border bg-popover shadow-xl z-50 overflow-hidden">
                    {dynamicTaskTypes.length > 0 ? (
                      dynamicTaskTypes.map((t) => (
                        <button
                          key={t.taskTypeId || (t as any).eventTypeId}
                          onClick={() => {
                            if (task && onUpdateTask) {
                              onUpdateTask({
                                ...task,
                                type: t.name || "",
                                taskTypeId: t.taskTypeId || (t as any).eventTypeId
                              });
                            }
                            setShowType(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition"
                        >
                          <span
                            className="w-5 h-5 rounded-md shrink-0"
                            style={{ backgroundColor: t.colorOrIcon || "#3b82f6" }}
                          />
                          {t.name}
                        </button>
                      ))
                    ) : (
                      TASK_TYPES.map((t) => (
                        <button
                          key={t.label}
                          onClick={() => {
                            if (task && onUpdateTask) {
                              onUpdateTask({ ...task, type: t.label });
                            }
                            setShowType(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition"
                        >
                          <span
                            className="w-5 h-5 rounded-md shrink-0"
                            style={{ backgroundColor: t.color }}
                          />
                          {t.label}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* DUE DATE */}
              <div className="relative">
                <DetailRow
                  label="Due date"
                  value={
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <CalendarDays size={14} className="opacity-60" />
                      {formatDate(dueDate)}
                    </span>
                  }
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    setShowStatus(false);
                    setShowType(false);
                    setActiveDropdown(null);
                  }}
                />

                {showCalendar && (
                  <CalendarDropdown
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date);
                      setShowCalendar(false);
                      if (task && onUpdateTask) {
                        onUpdateTask({ ...task, dueDate: date ? toLocalISOString(date) : undefined });
                      }
                    }}
                    onClear={() => {
                      setDueDate(null);
                      setShowCalendar(false);
                      if (task && onUpdateTask) {
                        onUpdateTask({ ...task, dueDate: undefined });
                      }
                    }}
                  />
                )}
              </div>

              {/* ASSIGNEE / PARTICIPANTS */}
              {!isEvent && (
                <div className="relative">
                  <DetailRow
                    label="Assignee"
                    value={
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shrink-0">
                          {task?.assignee ? task.assignee.charAt(0).toUpperCase() : firstLetter}
                        </div>
                        <span className=" text-sm truncate">
                          {task?.assignee || "Unassigned"}
                        </span>
                      </div>
                    }
                    onClick={() => {
                      toggle("assignee");
                      setAssigneeSearch("");
                    }}
                  />

                  {activeDropdown === "assignee" && (
                    <div
                      className="absolute top-12 right-0 w-80 border bg-background rounded-2xl shadow-2xl z-[60] overflow-hidden"
                    >
                      {/* Search Input */}
                      <div className="p-3 border-b border-zinc-700">
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={assigneeSearch}
                          onChange={(e) => setAssigneeSearch(e.target.value)}
                          className="w-full bg-muted/50 dark:bg-zinc-800/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                          autoFocus
                        />
                      </div>

                      {/* Scrollable User List */}
                      <div className="max-h-[340px] overflow-y-auto py-1 custom-scroll">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => {
                            const displayName = user.email || user.name || "Unknown";
                            const initial = (user.email || user.name || "?").charAt(0).toUpperCase();
                            return (
                              <button
                                key={user.userId || user.email}
                                onClick={() => {
                                  const newAssignee = user.email || user.name || "";
                                  if (task && onUpdateTask) {
                                    onUpdateTask({
                                      ...task,
                                      assignee: newAssignee,
                                      assignedTo: user.userId || newAssignee,
                                    });
                                  }
                                  setActiveDropdown(null);
                                  setAssigneeSearch("");
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 transition-colors text-left"
                              >
                                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                                  {initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm  truncate">{displayName}</p>
                                  {user.name && user.email && user.name !== user.email && (
                                    <p className="text-xs truncate">{user.name}</p>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                            No users found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ESTIMATED TIME */}
              <div className="relative">
                <DetailRow
                  label="Estimated time"
                  value={
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <Clock size={14} className="opacity-60" />
                      {estimatedTime}
                    </span>
                  }
                  onClick={() => toggle("time")}
                />

                {activeDropdown === "time" && (
                  <Dropdown>
                    {timeOptions.map((time) => (
                      <DropdownItem
                        key={time}
                        onClick={() => {
                          const numericHours = timeToHoursMap[time] || 0;
                          setEstimatedTime(time);
                          setActiveDropdown(null);

                          if (task && onUpdateTask) {
                            onUpdateTask({
                              ...task,
                              estimatedHours: numericHours,
                            });
                          }
                        }}
                      >
                        {time}
                      </DropdownItem>
                    ))}
                  </Dropdown>
                )}
              </div>

              {/* PRIORITY */}
              <div className="relative">
                {(() => {
                  const getPriorityConfig = (name?: string | null) => {
                    const n = name?.toLowerCase() || "";
                    if (n.includes("urgent")) return { icon: ChevronsUp, color: "text-red-500", label: name };
                    if (n.includes("high")) return { icon: ChevronUp, color: "text-orange-500", label: name };
                    if (n.includes("medium")) return { icon: Equal, color: "text-yellow-500", label: name };
                    if (n.includes("low") && !n.includes("lowest")) return { icon: ChevronDown, color: "text-blue-500", label: name };
                    if (n.includes("lowest")) return { icon: ChevronsDown, color: "text-sky-400", label: name };

                    return { icon: null, color: "text-muted-foreground", label: name || "None" };
                  };

                  const currentPriority = dynamicTaskPriorities.find(p => p.taskPriorityId === task.taskPriorityId);
                  const config = getPriorityConfig(currentPriority?.name);

                  return (
                    <>
                      <DetailRow
                        label="Priority"
                        value={
                          <span className={`flex items-center gap-2 text-sm font-medium ${config.color}`}>
                            {config.icon && <config.icon size={14} />}
                            {config.label}
                          </span>
                        }
                        onClick={() => toggle("priority")}
                      />

                      {activeDropdown === "priority" && (
                        <Dropdown>
                          <DropdownItem
                            onClick={() => {
                              if (task && onUpdateTask) {
                                onUpdateTask({ ...task, taskPriorityId: null });
                              }
                              setActiveDropdown(null);
                            }}
                          >
                            <div className="flex items-center gap-2 text-foreground">
                              <span>None</span>
                            </div>
                          </DropdownItem>
                          {dynamicTaskPriorities.map((p) => {
                            const pConfig = getPriorityConfig(p.name);
                            return (
                              <DropdownItem
                                key={p.taskPriorityId}
                                onClick={() => {
                                  if (task && onUpdateTask) {
                                    onUpdateTask({ ...task, taskPriorityId: p.taskPriorityId as string });
                                  }
                                  setActiveDropdown(null);
                                }}
                              >
                                <div className={`flex items-center gap-3 ${pConfig.color}`}>
                                  {pConfig.icon && <pConfig.icon size={14} />}
                                  <span className="font-medium">{p.name}</span>
                                </div>
                              </DropdownItem>
                            );
                          })}
                        </Dropdown>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* REPEAT */}
              <div className="relative">
                <DetailRow
                  label={isEvent ? "Repeat event" : "Repeat task"}
                  value={
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <Repeat size={14} className={recurrenceRule ? "text-primary" : "opacity-60"} />
                      {getRecurrenceSummary(recurrenceRule)}
                    </span>
                  }
                  onClick={() => setShowRepeatMenu(!showRepeatMenu)}
                />

                {showRepeatMenu && (
                  <div className="absolute top-10 right-0 w-56 bg-popover border border-border rounded-xl shadow-2xl z-[70] overflow-hidden">
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                        After completion
                        <Info size={14} className="text-muted-foreground/50" />
                      </div>
                      <div className="h-px bg-border mx-2 my-1" />
                      <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Time-based
                      </div>
                      {["Every day", "Every workday", "Every week", "Every month", "Every year"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleRepeatOption(opt)}
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                      <div className="h-px bg-border mx-2 my-1" />
                      <button
                        onClick={() => {
                          setInitialRecurrenceRule(recurrenceRule ? { ...recurrenceRule, transactionDate: task?.transactionDate } : { transactionDate: task?.transactionDate });
                          setShowRepeatMenu(false);
                          setShowRecurrenceModal(true);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                      >
                        <Settings size={14} /> Customize repeat
                      </button>
                    </div>
                  </div>
                )}
              </div>
                   {/* ACTION BUTTONS */}
              <div className=" ">
            {/* TAGS DISPLAY */}
            <DetailRow
              label="Tags"
              value={
                <div className="flex flex-wrap gap-2 items-center ml-4 mt-1">
                  {taskTags.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  ) : (
                    taskTags.map((t) => (
                      <div key={t.tagId || t.id} className="relative group inline-flex items-center">
                        <span className="px-3 py-2 rounded-md bg-muted text-sm font-medium block whitespace-nowrap">{t.name}</span>
                        {t.intermediateId && (
                          <button
                            aria-label="Remove tag"
                            onClick={() => removeTagFromTask(t.intermediateId)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 text-white text-xs flex items-center justify-center  md:group-hover:opacity-100 transition"
                            title="Remove tag"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              }
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-zinc-700 px-3 py-2 rounded-full text-sm  transition hover:bg-zinc-800 disabled:opacity-50"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />}
                {isUploading ? "Uploading..." : "Attach file"}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && task?.id) {
                    setIsUploading(true);
                    try {
                      // 1. Read file as Base64 to satisfy 'Content' requirement
                      const base64 = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result?.toString() || "");
                        reader.onerror = reject;
                      });
                      const base64Content = base64.split(",")[1];

                      const category = isEvent ? "Events" : "Tasks";
                      const ext = getFileExtension(file.name);
                      const extension = ext.startsWith(".") ? ext : `.${ext}`;

                      const res = await DocumentsService.postApiVDocuments("1", {
                        name: file.name,
                        description: `Attached to ${isEvent ? "event" : "task"}`,
                        content: base64Content,
                        category: category,
                        categoryId: task.id,
                        extension: extension,
                        contentType: file.type || getMimeType(file.name),
                        documentFileName: file.name
                      } as any);

                      if (res.success) {
                        toast.success("File attached successfully");
                        // Refresh documents list
                        const freshDocs = await DocumentsService.getApiVDocuments("1", category, task.id);
                        if (freshDocs.success && freshDocs.data) {
                          setAttachedDocuments(freshDocs.data);
                        }
                      } else {
                        toast.error(res.message || "Failed to attach file");
                      }
                    } catch (err) {
                      console.error("Upload failed", err);
                      toast.error("An error occurred during upload");
                    } finally {
                      setIsUploading(false);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                  }
                }}
              />

              {/* <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm transition hover:bg-muted font-medium text-foreground"
              >
                <Paperclip size={14} /> Attach file
              </button> */}

              {!isEvent ? (
                <>
                  {/* <button
                    onClick={() => setIsTimerPaused(!isTimerPaused)}
                    className="flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm transition hover:bg-muted font-medium text-foreground"
                  >
                    <PauseCircle size={14} /> {isTimerPaused ? "Resume timer" : "Start timer"}
                  </button> */}

                  {/* <button
                    onClick={() => setShowLogTime(true)}
                    className="flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm transition hover:bg-muted font-medium text-foreground"
                  >
                    <Clock size={14} /> Log time
                  </button> */}

                  {/* <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm transition hover:bg-muted font-medium text-foreground"
                  >
                    <Tag size={14} /> Add tag
                  </button> */}
                  <div className="relative">
                    <button
                      onClick={() => setIsTagOpen(!isTagOpen)}
                      className="flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm transition hover:bg-muted font-medium text-foreground"
                    >
                      <Tag size={14} /> Add tag
                    </button>
                    {isTagOpen && (
                      <div
                        className="absolute right-0 mt-2 w-64 bg-card border border-border rounded shadow-lg z-50 p-3"
                        onBlur={() => {
                          // when focus leaves, save selected tags
                          if (selectedTags.length > 0) saveSelectedTags(selectedTags);
                          setIsTagOpen(false);
                        }}
                        tabIndex={0}
                      >
                        <div className="mb-2">
                          <div className="relative">
                            <Search className="absolute left-2 top-2 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Search or type new tag"
                              value={tagQuery}
                              onChange={(e) => setTagQuery(e.target.value)}
                              className="pl-8 w-full bg-transparent border border-muted rounded px-2 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <div className="max-h-40 overflow-auto">
                          {allTags.filter(t => (t.name || '').toLowerCase().includes(tagQuery.toLowerCase())).length === 0 ? (
                            <div className="text-sm text-muted-foreground py-4 text-center">No tags yet</div>
                          ) : (
                            allTags.filter(t => (t.name || '').toLowerCase().includes(tagQuery.toLowerCase())).map((t) => {
                              const isSelected = selectedTags.some(st => (st.tagId || st.id) === (t.tagId || t.id));
                              return (
                                <div
                                  key={t.tagId || t.id}
                                  className={`px-2 py-1 rounded cursor-pointer hover:bg-muted/20 flex items-center justify-between ${isSelected ? 'bg-muted/10' : ''}`}
                                  onClick={() => {
                                    setSelectedTags(prev => {
                                      if (prev.some(st => (st.tagId || st.id) === (t.tagId || t.id))) {
                                        return prev.filter(st => (st.tagId || st.id) !== (t.tagId || t.id));
                                      }
                                      return [...prev, t];
                                    });
                                  }}
                                >
                                  <div className="text-sm">{t.name}</div>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    readOnly
                                    aria-label={isSelected ? `Selected ${t.name}` : `Select ${t.name}`}
                                    className="w-4 h-4 rounded border border-muted text-primary bg-card"
                                  />
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button size="sm" onClick={() => saveSelectedTags(selectedTags)}>Save</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsAddParticipantsOpen(true)}
                  className="flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm transition hover:bg-muted font-medium text-foreground"
                >
                  <Users size={14} /> Add participants
                </button>
              )}
            </div>

            {/* DESCRIPTION & SCHEDULER */}
            {!isEvent && (
              <div className="mt-8">
                <Scheduled
                  taskName={taskName}
                  initialDescription={localDesc}
                  onDescriptionChange={(content) => {
                    setLocalDesc(content);
                  }}
                  onBlur={() => {
                    if (localDesc !== task.description && onUpdateTask) {
                      onUpdateTask({ ...task, description: localDesc });
                    }
                  }}
                />
              </div>
            )}

            {/* ATTACHMENTS LIST */}
            {attachedDocuments.length > 0 && (
              <div className="mt-8 space-y-4 pb-4 border-t border-zinc-800/50 pt-5">
                <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-2 px-1">
                  <Paperclip size={14} /> Attachments ({attachedDocuments.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attachedDocuments.map((doc) => {
                    const isImg = ["jpg", "jpeg", "png", "gif", "webp"].includes(doc.extension?.toLowerCase() || "");
                    const isPdf = doc.extension?.toLowerCase() === "pdf";

                    return (
                      <div
                        key={(doc as any).documentUrlID || doc.documentID}
                        className="group flex flex-col p-3 rounded-xl  border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            {isImg ? <FileImage className="text-primary" size={20} /> :
                              isPdf ? <FileText className="text-primary" size={20} /> :
                                <FileIcon className="text-primary" size={20} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate" title={doc.name}>{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{doc.extension || "FILE"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border justify-end">
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsPreviewOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="View"
                          >
                            <ExternalLink size={14} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Are you sure you want to delete this attachment?")) {
                                try {
                                  const docId = (doc as any).documentUrlID as string;
                                  const res = await DocumentsService.deleteDocumentUrl(docId, "1");
                                  if ((res as any).success) {
                                    toast.success("Attachment deleted");
                                    setAttachedDocuments(prev => prev.filter(d => (d as any).documentUrlID !== docId));
                                  } else {
                                    toast.error("Failed to delete attachment");
                                  }
                                } catch (err) {
                                  console.error("Delete failed", err);
                                  toast.error("An error occurred");
                                }
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-900/30 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

              {!isEvent && showSubtasks && (
                <button
                  onClick={() => setShowAddSubtaskInput(true)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-2 transition"
                >
                  + Add subtask
                </button>
              )}

              {/* SUBTASKS SECTION */}
              {!isEvent && (
                <div className="mt-8 border-t border-border pt-6">
                  <div
                    className="flex items-center justify-between cursor-pointer mb-4"
                    onClick={() => setShowSubtasks(!showSubtasks)}
                  >
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <ListTodo size={16} />
                      Subtasks <span className="ml-1 px-2 py-0.5 bg-muted rounded-full text-xs font-bold">{subtasks.length}</span>
                    </div>
                    {showSubtasks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {showSubtasks && (
                    <div className="space-y-4">
                      {/* SUBTASK LIST */}
                      <div className="space-y-2">
                        {subtasks.map((s, i) => (
                          <div key={i}>
                            {editingIndex === i ? (
                              <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary/30">
                                <input
                                  type="text"
                                  value={subtask}
                                  onChange={(e) => setSubtask(e.target.value)}
                                  className="flex-1 bg-transparent outline-none text-sm text-foreground"
                                  autoFocus
                                />
                                <div className="relative flex items-center gap-1">
                                  <button
                                    onClick={() => setShowTimePicker(!showTimePicker)}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {subtaskTime || "hh:mm"}
                                  </button>
                                  {showTimePicker && (
                                    <div className="absolute top-full left-0 mt-2 z-50 min-w-[100px]">
                                      <Dropdown>
                                        {timeOptions.map((t) => (
                                          <DropdownItem
                                            key={t}
                                            onClick={() => {
                                              setSubtaskTime(t);
                                              setShowTimePicker(false);
                                            }}
                                          >
                                            <span className="text-xs text-foreground">{t}</span>
                                          </DropdownItem>
                                        ))}
                                      </Dropdown>
                                    </div>
                                  )}
                                </div>

                                <div className="relative">
                                  <button onClick={() => setShowSubtaskCalendar(!showSubtaskCalendar)} className="text-muted-foreground hover:text-foreground">
                                    <CalendarDays size={16} />
                                  </button>
                                  {showSubtaskCalendar && (
                                    <div className="absolute top-full right-6 left-28 mt-2 z-50">
                                      <CalendarDropdown
                                        selected={subtaskDueDate}
                                        onSelect={(date) => { setSubtaskDueDate(date); setShowSubtaskCalendar(false); }}
                                        onClear={() => { setSubtaskDueDate(null); setShowSubtaskCalendar(false); }}
                                      />
                                    </div>
                                  )}
                                </div>
                                {/* <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                                  {s.assignee?.charAt(0).toUpperCase() || "U"}
                                </div> */}
                                <Button
                                  size="sm"
                                  className="h-7 px-3 text-xs  hover:bg-primary/80 text-white"
                                  onClick={async () => {
                                    if (!subtask.trim()) return;
                                    try {
                                      await TaskService.taskPut("1", {
                                        taskId: s.id,
                                        name: subtask,
                                        status: s.completed ? "completed" : task.status,
                                        description: task.description,
                                        endDate: subtaskDueDate ? toLocalISOString(subtaskDueDate) : null,
                                        estimatedHours: subtaskTime ? timeToHoursMap[subtaskTime] : null,
                                      } as any);
                                      setSubtasks(prev => prev.map((item, idx) => idx === i ? {
                                        ...item,
                                        name: subtask,
                                        dueDate: subtaskDueDate,
                                        time: subtaskTime,
                                      } : item));
                                      setEditingIndex(null);
                                      setSubtask("");
                                      setSubtaskDueDate(null);
                                      toast.success("Subtask updated");
                                    } catch (e) {
                                      toast.error("Failed to update subtask");
                                    }
                                  }}
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm group transition bg-muted/50 border border-border hover:border-muted-foreground/30"
                                onClick={() => {
                                  setEditingIndex(i);
                                  setSubtask(s.name);
                                  setSubtaskDueDate(s.dueDate);
                                  setSubtaskTime(s.time);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={s.completed}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={async (e) => {
                                      e.stopPropagation();
                                      const newCompleted = !s.completed;
                                      try {
                                        await TaskService.taskPut("1", {
                                          taskId: s.id,
                                          name: s.name,
                                          status: newCompleted ? "completed" : task.status, // toggle
                                          description: task.description,
                                        } as any);
                                        setSubtasks(prev => prev.map((item, idx) => idx === i ? { ...item, completed: newCompleted } : item));
                                      } catch (e) {
                                        toast.error("Failed to update status");
                                      }
                                    }}
                                    className="accent-primary cursor-pointer h-4 w-4 shrink-0"
                                  />
                                  <span className={s.completed ? "line-through opacity-60" : ""}>{s.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                  {s.time && <span className="flex items-center gap-1"><Clock size={12} /> {s.time}</span>}
                                  {s.dueDate && <span>{new Date(s.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                                    {s.assignee?.charAt(0).toUpperCase() || "U"}
                                  </div>
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (window.confirm("Delete subtask?")) {
                                        try {
                                          await TaskService.taskDelete(s.id!, "1");
                                          setSubtasks(prev => prev.filter((_, idx) => idx !== i));
                                          toast.success("Subtask deleted");
                                        } catch (e) {
                                          toast.error("Failed to delete subtask");
                                        }
                                      }
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* ADD SUBTASK BUTTON */}
                      <button
                        onClick={() => setShowAddSubtaskInput(true)}
                        className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors pl-1"
                      >
                        <IoAdd />
                        Add subtask
                      </button>

                      {showAddSubtaskInput && (
                        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2">
                          <input
                            type="text"
                            placeholder="Subtask name"
                            value={subtask}
                            onChange={(e) => setSubtask(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-black dark:text-white"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            className="h-7 px-3 text-xs bg-primary text-white"
                            onClick={async () => {
                              if (!subtask.trim()) return;
                              try {
                                const res = await TaskService.taskPost("1", {
                                  name: subtask,
                                  description: task.description,
                                  status: task.status,
                                  category: "task",
                                  categoryId: task.id,
                                } as any);
                                if (res.success) {
                                  setSubtasks(prev => [...prev, {
                                    id: res.data?.taskId || undefined,
                                    name: subtask,
                                    dueDate: null,
                                    time: "0h",
                                    assignee: "",
                                    completed: false
                                  }]);
                                  setSubtask("");
                                  setShowAddSubtaskInput(false);
                                  toast.success("Subtask added");
                                }
                              } catch (e) {
                                toast.error("Failed to add subtask");
                              }
                            }}
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => { setShowAddSubtaskInput(false); setSubtask(""); }}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

     

          {/* AGENDA FOR EVENTS (Using Scheduled component as a pure rich text editor) */}
          {isEvent && (
            <div className="mt-6 border-t border-border pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <ListTodo size={14} />
                <span className="font-medium">Agenda</span>
              </div>
              <Scheduled
                taskName={taskName}
                initialDescription={localDesc}
                onDescriptionChange={(content) => {
                  setLocalDesc(content);
                }}
                onBlur={() => {
                  if (localDesc !== task.description && onUpdateTask) {
                    onUpdateTask({ ...task, description: localDesc });
                  }
                }}
                hideScheduleCard={true}
              />
            </div>
          )}

          {/* PARTICIPANTS FOR EVENTS */}
          {isEvent && (
            <div className="mt-6 border-t border-border pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Users size={16} /> Participants
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {eventParticipants.length} participant{eventParticipants.length !== 1 ? "s" : ""}
                  <ChevronDown size={14} className="opacity-70" />
                </div>
              </div>

              {isLoadingParticipants ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 size={14} className="animate-spin" /> Loading participants...
                </div>
              ) : eventParticipants.length === 0 ? (
                <p className="text-sm text-muted-foreground">No participants yet.</p>
              ) : (
                <div className="space-y-2">
                  {eventParticipants.map((participant: any) => {
                    const email = participant.userEmail || participant.email || "";
                    const initial = (email?.[0] || "U").toUpperCase();
                    const participantId = participant.userIntermediateId;
                    const isMenuOpen = openParticipantMenuId === participantId;
                    return (
                      <div key={participantId || email} className="relative flex items-center gap-3 bg-muted/30 dark:bg-zinc-800/50 rounded-lg px-3 py-2 group">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0d9488] text-white text-sm font-semibold">
                            {initial}
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-zinc-900 rounded-full border border-zinc-600">
                            <CheckCircle2 size={12} className="text-green-500 bg-black rounded-full" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-foreground truncate flex-1">{email}</span>

                        {/* ⋮ menu button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenParticipantMenuId(isMenuOpen ? null : participantId);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted dark:hover:bg-zinc-700 transition-opacity"
                        >
                          <MoreVertical size={14} className="text-muted-foreground" />
                        </button>

                        {/* Dropdown */}
                        {isMenuOpen && (
                          <div
                            className="absolute right-0 top-9 z-50 w-48 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleRemoveParticipant(participantId)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-muted dark:hover:bg-zinc-800 transition-colors"
                            >
                              <X size={14} />
                              Remove participant
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleOpenAddParticipants}
                className="flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-6 h-6 rounded-full border border-dashed border-muted-foreground group-hover:border-foreground flex items-center justify-center transition-colors">
                  <IoAdd size={14} />
                </div>
                Add participants
              </button>
            </div>
          )}
        </div>
      </SheetContent>

      {/* ADD PARTICIPANTS DIALOG */}
      <Dialog open={isAddParticipantsOpen} onOpenChange={setIsAddParticipantsOpen}>
        <DialogContent className="max-w-md bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Add participants</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full bg-muted border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="Search people..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1">
                {dynamicUsers
                  .filter((u) => {
                    const search = userSearchQuery.toLowerCase();
                    const email = (u.email || u.userName || "").toLowerCase();
                    return email.includes(search);
                  })
                  .map((user) => {
                    const userId = user.id || user.userID;
                    const email = user.email || user.userName || "";
                    const initial = email.charAt(0).toUpperCase();

                    return (
                      <div
                        key={userId}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer group"
                        onClick={() => {
                          setSelectedForAdd((prev) =>
                            prev.includes(userId)
                              ? prev.filter((id) => id !== userId)
                              : [...prev, userId]
                          );
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-border">
                            <AvatarFallback className="bg-[#0e7490] text-xs font-bold text-white uppercase">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{email}</span>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedForAdd.includes(userId)}
                          onCheckedChange={(checked) => {
                            setSelectedForAdd((prev) =>
                              checked
                                ? [...prev, userId]
                                : prev.filter((id) => id !== userId)
                            );
                          }}
                          className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setIsAddParticipantsOpen(false)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveParticipants}
              disabled={isSavingParticipants}
              className="bg-primary hover:bg-primary/90 text-white min-w-[100px]"
            >
              {isSavingParticipants ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save selection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FilePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        document={selectedDoc}
      />

      <LogTimeModal
        open={openLogModal}
        onClose={() => setOpenLogModal(false)}
        taskName={taskName}
        onSave={handleAddLog}
      />
      <TaskRecurrenceModal
        open={showRecurrenceModal}
        onOpenChange={setShowRecurrenceModal}
        onSave={handleSaveRecurrence}
        onDelete={() => setRecurrenceRule(null)}
        initialRule={initialRecurrenceRule}
      />
    </Sheet >

  );
};

/* ---------------- COMPONENTS ---------------- */

function DetailRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center border-b border-border py-3.5 hover:border-muted-foreground/30 cursor-pointer"
    >
      <span className="text-muted-foreground text-sm uppercase tracking-tight">{label}</span>
      {value}
    </div>
  );
}

function ColoredBadge({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2   px-3 py-1 rounded-md">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover shadow-xl p-2 z-50 space-y-1">
      {children}
    </div>
  );
}

function DropdownItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="px-3 py-2 rounded-md cursor-pointer transition"
    >
      {children}
    </div>
  );
}

function PriorityBadge({
  label,
  Icon,
  color,
}: {
  label: string;
  Icon: any;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2  px-3 py-1 rounded-md">
      {Icon && <Icon size={14} className={color} />}
      <span className={color}>{label}</span>
    </div>
  );
}
function CalendarDropdown({
  selected,
  onSelect,
  onClear,
}: {
  selected: Date | null;
  onSelect: (date: Date) => void;
  onClear: () => void;
}) {
  return (
    <div className="absolute right-0 mt-2 w-auto bg-popover border border-border rounded-3xl shadow-xl z-50 overflow-hidden">
      <Calendar
        mode="single"
        selected={selected || undefined}
        onSelect={(day) => {
          if (day) onSelect(day);
        }}
        initialFocus
        className="w-auto p-2"
      />
      <div className="mt-1 border-t border-border pt-3 pb-3 px-4 bg-popover">
        <button
          onClick={onClear}
          className="text-sm font-semibold text-red-500 hover:text-red-400 focus:outline-none w-full text-left"
        >
          No due date
        </button>
      </div>
    </div>
  );
}
function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
function LogTimeModal({
  open,
  onClose,
  taskName,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  taskName: string;
  onSave: (log: any) => void;
}) {
  const [billable, setBillable] = useState(false);
  const [loggedTime, setLoggedTime] = useState("");
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");

  const [logs, setLogs] = useState<any[]>([]);

  const timeOptions = [
    "15 min",
    "30 min",
    "45 min",
    "1 hour",
    "1:30 hours",
    "1:00 hours",
    "2:00 hours",
    "3:00 hours",
    "4:00 hours",
    "5:00 hours",
    "6:00 hours",
    "7:00 hours",
  ];

  const firstLetter = taskName?.charAt(0).toUpperCase();

  const handleSave = () => {
    const newLog = {
      date: date || new Date().toISOString().split('T')[0],
      user: firstLetter || "User",
      comment,
      billable,
      time: loggedTime,
    };

    setLogs((prev) => [...prev, newLog]);
    onSave(newLog);

    setLoggedTime("");
    setComment("");
    setDate("");

    onClose();
  };

  return (
    <>
      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/40">
          <div className="w-full max-w-lg bg-black text-white rounded-2xl shadow-2xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-6">Log time</h2>

            <div className="space-y-5 text-sm">
              {/* Date */}
              <div>
                <label className="text-zinc-400 block mb-2">Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
                />
              </div>

              {/* Logged Time */}
              <div className="relative">
                <label className="text-zinc-400 block mb-2">Logged time</label>

                <div
                  onClick={() => setShowTimeOptions(!showTimeOptions)}
                  className="flex items-center gap-2 cursor-pointer w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
                >
                  👤
                  <input
                    type="text"
                    value={loggedTime}
                    placeholder="0h"
                    readOnly
                    className="bg-transparent outline-none flex-1"
                  />
                </div>

                {showTimeOptions && (
                  <div className="absolute top-11 left-0 w-full rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg max-h-48 overflow-y-auto">
                    {timeOptions.map((time) => (
                      <div
                        key={time}
                        onClick={() => {
                          setLoggedTime(time);
                          setShowTimeOptions(false);
                        }}
                        className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label className="text-zinc-400 block mb-2">Assignee</label>

                <div className="flex items-center gap-3 px-3 py-2 border border-zinc-700 rounded-lg bg-zinc-900">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-600 text-white text-xs">
                    {firstLetter}
                  </div>

                  <span>{taskName}</span>
                </div>
              </div>

              {/* Billable */}
              <div>
                <label className="text-zinc-400 block mb-2">Billable</label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setBillable(true)}
                    className={`px-4 py-2 rounded-lg border ${billable
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-zinc-700"
                      }`}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillable(false)}
                    className={`px-4 py-2 rounded-lg border ${!billable
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-zinc-700"
                      }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-zinc-400 block mb-2">Comment</label>

                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Your comment..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={onClose} className="text-zinc-400">
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGGED TIME LIST (DIV KE NICHE SHOW HOGA) */}
      {logs.length > 0 && (
        <div className="mt-8 border-t border-zinc-700 pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Logged time ({logs.length})
          </h3>

          <div className="grid grid-cols-6 text-xs text-zinc-400 border-b border-zinc-700 pb-2 mb-3">
            <span>Date</span>
            <span>User</span>
            <span className="col-span-2">Comment</span>
            <span>Billable</span>
            <span className="text-right">Time</span>
          </div>

          {logs.map((log, i) => (
            <div
              key={i}
              className="grid grid-cols-6 items-center py-3 border-b border-zinc-800 text-sm"
            >
              <span>{log.date || "-"}</span>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                  {log.user}
                </div>
              </div>

              <span className="col-span-2">{log.comment || "-"}</span>

              <span className="text-blue-400">{log.billable ? "$" : "-"}</span>

              <span className="text-right font-medium">{log.time}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
