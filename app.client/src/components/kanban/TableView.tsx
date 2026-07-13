"use client";

import React, { useState, useEffect, useImperativeHandle } from "react";
import { format, parseISO } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoTrash } from "react-icons/io5";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import type { Card, List } from "@/components/kanban/types";
import { TASK_TYPES, getTypeColor } from "@/components/kanban/taskTypes";
import { TaskTypeService } from "@/api/services/TaskTypeService";
import { TaskStatusService } from "@/api/services/TaskStatusService";
import { TaskService } from "@/api/services/TaskService";
import { EventService } from "@/api/services/EventService";
import { TaskTypeListVM } from "@/api/models/TaskTypeListVM";
import { TaskStatusListVM } from "@/api/models/TaskStatusListVM";
import { TaskPriorityService } from "@/api/services/TaskPriorityService";
import { TaskPriorityListVM } from "@/api/models/TaskPriorityListVM";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserService } from "@/api/services/UserService";
import {
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoHammer,
  IoCalendarOutline,
  IoChevronDown,
  IoChevronForward,
  IoAdd,
  IoFlag,
  IoReorderThreeOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import Scheduled from "@/components/kanban/Scheduled";
type Props = {
  list: List[];
  setList: React.Dispatch<React.SetStateAction<List[]>>;
  onRefresh: () => void;
};

const getPriorityColor = (priorityName: string) => {
  switch (priorityName.toLowerCase()) {
    case 'urgent': return 'text-red-500';
    case 'high': return 'text-red-400';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-emerald-500';
    default: return 'text-zinc-400';
  }
};

const DEFAULT_STATUS_OPTIONS = [
  {
    id: "new",
    label: "New Task",
    icon: "🗒️",
  },
  {
    id: "scheduled",
    label: "Scheduled",
    icon: "📅",
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: "🔧",
  },
  {
    id: "completed",
    label: "Completed",
    icon: "✅",
  },
];

const toLocalISOString = (date: Date | string | undefined | null) => {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return undefined;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
};

const TableView = React.forwardRef<
  { openCreateDialog: (initialStatus?: string) => void },
  Props
>(({ list, setList, onRefresh }, ref) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectIdFromUrl = searchParams.get("projectId");
  const projectId = projectIdFromUrl || localStorage.getItem("activeProjectId") || "";

  const safeList = list ?? [];
  const [activeTasksExpanded, setActiveTasksExpanded] = useState(true);
  const [completedTasksExpanded, setCompletedTasksExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Card | null>(null);
  const [dynamicUsers, setDynamicUsers] = useState<any[]>([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [form, setForm] = useState<Partial<Card>>({
    title: "",
    description: "",
    dueDate: undefined,
    priority: undefined,
    type: undefined,
    assignee: undefined,
    status: undefined,
    taskPriorityId: undefined,
    estimatedHours: undefined,
    taskTypeId: undefined,
    subtasks: [],
    startDate: toLocalISOString(new Date()),
  });

  const [dynamicTaskTypes, setDynamicTaskTypes] = useState<TaskTypeListVM[]>([]);
  const [dynamicTaskStatuses, setDynamicTaskStatuses] = useState<TaskStatusListVM[]>([]);
  const [dynamicTaskPriorities, setDynamicTaskPriorities] = useState<TaskPriorityListVM[]>([]);

  useEffect(() => {
    if (projectId) {
      // Reset form on project switch
      setForm({
        title: "",
        description: "",
        dueDate: undefined,
        priority: undefined,
        type: undefined,
        assignee: undefined,
        status: undefined,
        estimatedHours: undefined,
        subtasks: [],
        startDate: toLocalISOString(new Date()),
      });

      // Fetch Types
      TaskTypeService.taskTypeGet("1", "Project", projectId)
        .then((response) => {
          if (response.success && response.data) {
            setDynamicTaskTypes(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch task types:", error);
        });

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
      TaskPriorityService.getApiVTaskPriority("1")
        .then((response) => {
          if (response.success && response.data) {
            setDynamicTaskPriorities(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch task priorities:", error);
        });
      // Fetch Users (real list from UserService)
      UserService.getApiVUser("1")
        .then((response) => {
          if (response.success && response.data) {
            setDynamicUsers(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch users:", error);
        });
    }

  }, [projectId]);

  const getDynamicTypeColor = (typeIdentifier?: string | null) => {
    if (!typeIdentifier) return "#94a3b8";

    // Try by name first
    const byName = dynamicTaskTypes.find((t) => t.name === typeIdentifier);
    if (byName?.colorOrIcon) return byName.colorOrIcon;

    // Then try by taskTypeId
    const byId = dynamicTaskTypes.find((t) => t.taskTypeId === typeIdentifier);
    if (byId?.colorOrIcon) return byId.colorOrIcon;

    return getTypeColor(typeIdentifier);
  };
  // Helper to get Type Name from taskTypeId
  const getTypeNameFromId = (taskTypeId?: string | null): string => {
    if (!taskTypeId) return "";
    const foundType = dynamicTaskTypes.find((t) => t.taskTypeId === taskTypeId);
    return foundType?.name || taskTypeId; // fallback to ID if name not found
  };
  // Filtered users for searchable assignee dropdown
  const filteredUsers = dynamicUsers.filter((user) => {
    const searchTerm = assigneeSearch.toLowerCase().trim();
    if (!searchTerm) return true;
    return (
      (user.email && user.email.toLowerCase().includes(searchTerm)) ||
      (user.name && user.name.toLowerCase().includes(searchTerm))
    );
  });

  const allCards: { card: Card }[] = [];
  safeList.forEach((col) => {
    col.card.forEach((c) => {
      allCards.push({ card: c });
    });
  });

  const activeTasks = allCards.filter(({ card }) => {
    const col = safeList.find((l) => l.card.some((c) => c.id === card.id));
    return col?.title.toLowerCase() !== "completed";
  });

  const completedTasks = allCards.filter(({ card }) => {
    const col = safeList.find((l) => l.card.some((c) => c.id === card.id));
    return col?.title.toLowerCase() === "completed";
  });

  const openCreateDialog = (initialStatus?: string) => {
    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      dueDate: undefined,
      estimatedHours: undefined,
      subtasks: [],
      startDate: toLocalISOString(new Date()),
      status: initialStatus || undefined,
    });
    setDialogOpen(true);
  };

  useImperativeHandle(ref, () => ({
    openCreateDialog
  }));

  const openEditDialog = (card: Card) => {
    setEditingTask(card);
    setForm({ ...card, subtasks: [] });
    setDialogOpen(true);

    // Fetch subtasks for this task
    TaskService.taskGet("1", "task", card.id)
      .then((response) => {
        if (response.success && response.data) {
          const subtasks = response.data.map((t: any) => ({
            id: t.taskId,
            name: t.name,
            status: t.status,
            description: t.description,
          }));
          setForm((prev) => ({ ...prev, subtasks }));
        }
      })
      .catch((error) => console.error("Failed to fetch subtasks:", error));
  };

  const handleSave = async () => {
    if (!form.title || !form.status || !projectId || !form.description) {
      alert("Missing required fields (Name, Status, Description, Project ID)");
      return;
    }

    if (editingTask) {
      // Update existing task via API
      try {
        const response = await TaskService.taskPut("1", {
          taskId: editingTask.id,
          name: form.title || "Untitled",
          description: form.description || "",
          status: form.status || null,
          startDate: form.startDate || null,
          endDate: form.dueDate || null,
          dueDate: form.dueDate || null,
          estimatedHours: form.estimatedHours ?? null,
          isActive: true,
          isRecurring: false,
          taskTypeId: form.taskTypeId,
          taskPriorityId: form.taskPriorityId || null,
          assignedTo: form.assignee || null,
        } as any);

        if (response.success) {
          // Sync subtasks
          if (form.subtasks && form.subtasks.length > 0) {
            await Promise.all(
              form.subtasks.map(subtask => {
                if (subtask.id) {
                  // Update existing
                  return TaskService.taskPut("1", {
                    taskId: subtask.id,
                    name: subtask.name,
                    status: subtask.status || form.status,
                    description: subtask.description || form.description,
                    startDate: form.startDate || null,
                    taskTypeId: form.taskTypeId || null,
                    taskPriorityId: form.taskPriorityId || null,
                    endDate: form.dueDate || null,
                    dueDate: form.dueDate || null,
                    estimatedHours: form.estimatedHours ?? null,
                  } as any);
                } else if (subtask.name.trim()) {
                  // Create new
                  return TaskService.taskPost("1", {
                    name: subtask.name,
                    description: form.description || "",
                    status: form.status,
                    category: "task",
                    categoryId: editingTask.id,
                    priority: form.priority || null,
                    startDate: form.startDate || null,
                    taskTypeId: form.taskTypeId || null,
                    taskPriorityId: form.taskPriorityId || null,
                    endDate: form.dueDate || null,
                    dueDate: form.dueDate || null,
                    estimatedHours: form.estimatedHours ?? null,
                  } as any);
                }
                return Promise.resolve();
              })
            );
          }

          onRefresh();   // ← this will now fetch the updated estimatedHours back into the tasks
          toast.success("Task updated successfully");
          setDialogOpen(false);
        } else {
          toast.error(`Failed to update task: ${response.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("API Error updating task:", error);
        toast.error("An error occurred while updating the task.");
      }
    } else {
      // Create new task via API
      try {
        const response = await TaskService.taskPost("1", {
          name: form.title,
          description: form.description,
          startDate: form.startDate || null,
          endDate: form.dueDate,
          dueDate: form.dueDate,
          status: form.status,
          category: "Project",
          categoryId: projectId,


          priority: form.priority || null,
          taskPriorityId: form.taskPriorityId || null,
          taskTypeId: form.taskTypeId || null,
          estimatedHours: form.estimatedHours ?? null,
          assignedTo: form.assignee || null,
        } as any);

        if (response.success) {
          const mainTaskId = response.data?.taskId;

          // Create subtasks if any
          if (mainTaskId && form.subtasks && form.subtasks.length > 0) {
            await Promise.all(
              form.subtasks.map(subtask =>
                TaskService.taskPost("1", {
                  name: subtask.name,
                  description: form.description || "",
                  status: form.status,
                  category: "task",
                  categoryId: mainTaskId,
                  startDate: form.startDate || null,
                  endDate: form.dueDate,
                  dueDate: form.dueDate,
                  taskTypeId: form.taskTypeId || null,
                  taskPriorityId: form.taskPriorityId || null,

                } as any)
              )
            );
          }

          onRefresh();
          toast.success("Task created successfully");
          setDialogOpen(false);
        } else {
          toast.error(`Failed to create task: ${response.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("API Error creating task:", error);
        toast.error("An error occurred while creating the task.");
      }
    }
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let targetStatusId: string | null = null;
    let movedCardRef: any = null;

    setList((prev) => {
      const updated = [...prev];

      // Correctly find the actual column that contains the dragged card
      const sourceCol = updated.find((col) => col.card.some((c) => c.id === draggableId));

      // Find the destination column
      const destCol = updated.find((col) => {
        if (destination.droppableId === "active-tasks") {
          // If we are moving within active tasks, keep the task in its current status column
          if (sourceCol && sourceCol.title.toLowerCase() !== "completed") return col.id === sourceCol.id;
          // If moving from completed to active, default to the first active column
          return col.title.toLowerCase() !== "completed";
        }
        if (destination.droppableId === "completed-tasks") {
          return col.title.toLowerCase() === "completed";
        }
        return false;
      });

      if (!sourceCol || !destCol) return prev;

      const cardIndex = sourceCol.card.findIndex((c) => c.id === draggableId);
      if (cardIndex === -1) return prev;

      const [movedCard] = sourceCol.card.splice(cardIndex, 1);

      // If moving to a different section, update the local status property
      if (source.droppableId !== destination.droppableId) {
        movedCard.status = destCol.id;
        targetStatusId = destCol.id;
        movedCardRef = { ...movedCard };
      }

      destCol.card.splice(destination.index, 0, movedCard);
      return updated;
    });

    // Make the API call to persist the status change
    if (source.droppableId !== destination.droppableId && movedCardRef && targetStatusId) {
      TaskService.taskPut("1", {
        taskId: movedCardRef.id,
        name: movedCardRef.title || "Untitled",
        description: movedCardRef.description || "Task description",
        status: targetStatusId,
        startDate: movedCardRef.startDate || null,
        dueDate: movedCardRef.dueDate || null,
        estimatedHours: movedCardRef.estimatedHours ?? null,
        isActive: true,
        isRecurring: false,
        taskTypeId: movedCardRef.taskTypeId || movedCardRef.type || null,
        taskPriorityId: movedCardRef.taskPriorityId || null,
        assignedTo: movedCardRef.assignee || movedCardRef.assignedTo || null,
      } as any).catch(err => console.error("Failed to update task via API in TableView:", err));
    }
  };

  const TableHeader = () => (
    <div className="hidden md:grid grid-cols-7 gap-4 py-2.5 px-4 text-[11px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40">
      <div className="pl-6">Task</div>
      <div>Status</div>
      <div>Type</div>
      <div>Due Date</div>
      <div>Priority</div>
      <div>Assignee</div>
      <div className="text-center">Actions</div>
    </div>
  );

  const TaskRow = ({ card, index }: { card: Card; index: number }) => {
    const getPriorityInfo = (priorityId?: string | null) => {
      if (!priorityId) return null;
      const priorityObj = dynamicTaskPriorities.find(p => p.taskPriorityId === priorityId);
      return priorityObj ? { label: priorityObj.name } : null;
    };

    const priorityInfo = getPriorityInfo(card.taskPriorityId);

    const getStatusInfo = (statusId?: string) => {
      if (!statusId) return null;
      const statusObj = dynamicTaskStatuses.find(s => s.taskStatusId === statusId);
      if (statusObj) {
        return { label: statusObj.name, icon: statusObj.colorOrIcon };
      }
      const defaultObj = DEFAULT_STATUS_OPTIONS.find(s => s.id === statusId);
      return defaultObj ? { label: defaultObj.label, icon: defaultObj.icon } : null;
    };

    const statusInfo = getStatusInfo(card.status);
    const typeName = getTypeNameFromId(card.taskTypeId || (card as any).type);
    const typeColor = getDynamicTypeColor(card.taskTypeId || (card as any).type); const assigneeInitial = card.assignee?.charAt(0).toUpperCase() ?? "?";

   const handleDeleteTask = async (cardId: string, isEvent: boolean) => {
  if (
    window.confirm(
      `Are you sure you want to delete this ${isEvent ? "event" : "task"}?`
    )
  ) {
    try {
      if (isEvent) {
        await EventService.deleteEvent(cardId, "1");
        toast.success("Event deleted");
      } else {
        await TaskService.taskDelete(cardId, "1");
        toast.success("Task deleted");
      }

      // Remove card from UI after successful delete
      setList((prev) =>
        prev.map((col) => ({
          ...col,
          card: col.card.filter((c) => c.id !== cardId),
        }))
      );
    } catch (error) {
      toast.error(`Failed to delete ${isEvent ? "event" : "task"}`);
    }
  }
};

    return (
      <Draggable draggableId={card.id} index={index}>
        {(provided) => (
          <>
            {/* Desktop Table View */}
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className="group hidden md:grid grid-cols-7 gap-4 py-3 px-4 border-b border-gray-100 dark:border-zinc-800/60 items-center hover:bg-gray-50 dark:hover:bg-zinc-900/50 cursor-pointer"
              onClick={() => openEditDialog(card)}
            >
              {/* Task Title */}
              <div className="flex items-center gap-2 min-w-0">
                <div
                  {...provided.dragHandleProps}
                  className="cursor-grab p-1 opacity-0 group-hover:opacity-40 transition-opacity shrink-0"
                >
                  <IoReorderThreeOutline className="w-4 h-4 text-gray-400 dark:text-zinc-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">{card.title}</span>
              </div>

              {/* Status */}
              <div>
                {statusInfo ? (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${(card.status)}`}>
                    <span className="text-sm">{statusInfo.icon}</span>
                    {statusInfo.label}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-zinc-600 text-sm">—</span>
                )}
              </div>

              {/* Type */}
              <div className="flex items-center gap-1.5">
                {typeName ? (
                  <>
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: typeColor }}
                    />
                    <span className="text-sm text-gray-700 dark:text-zinc-300">{typeName}</span>
                  </>
                ) : (
                  <span className="text-gray-400 dark:text-zinc-600 text-sm">—</span>
                )}
              </div>

              {/* Due Date */}
              <div className="text-sm text-gray-600 dark:text-zinc-400">
                {card.dueDate ? (
                  format(parseISO(card.dueDate), "MMM d, yyyy")
                ) : (
                  <span className="text-gray-400 dark:text-zinc-600">No date</span>
                )}
              </div>

              {/* Priority */}
              <div className="flex items-center gap-1.5 text-sm">
                {priorityInfo ? (
                  <>
                    <IoFlag className={getPriorityColor(priorityInfo.label || "")} />
                    <span className={getPriorityColor(priorityInfo.label || "")}>{priorityInfo.label}</span>
                  </>
                ) : (
                  <span className="text-gray-400 dark:text-zinc-600">—</span>
                )}
              </div>

              {/* Assignee */}
              <div>
                {card.assignee ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {assigneeInitial}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-zinc-300 truncate">{card.assignee}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 dark:text-zinc-600 text-sm">—</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center">
                <IoTrash
                  className="text-gray-400 dark:text-zinc-600 dark:hover:text-red-800 hover:text-red-400 cursor-pointer transition-colors opacity-100 shrink-0 w-4 h-4"
                  title="Delete task"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(card.id);
                  }}
                />
              </div>
            </div>

            {/* Mobile Card View */}
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className="md:hidden p-4 mb-3 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
              onClick={() => openEditDialog(card)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Task Title with drag handle */}
                  <div className="flex items-start gap-2 mb-3">
                    <div
                      {...provided.dragHandleProps}
                      className="cursor-grab p-0.5 opacity-50 shrink-0 mt-0.5"
                    >
                      <IoReorderThreeOutline className="w-4 h-4 text-gray-400 dark:text-zinc-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 line-clamp-2">{card.title}</span>
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    {statusInfo ? (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${(card.status)}`}>
                        <span className="text-sm">{statusInfo.icon}</span>
                        <span className="whitespace-nowrap">{statusInfo.label}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-zinc-600 text-xs">No status</span>
                    )}
                  </div>

                  {/* Info Grid: Type, Priority, Due Date - Stack vertically */}
                  <div className="space-y-2 mb-3">
                    {/* Type */}
                    {typeName && (
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: typeColor }}
                        />
                        <span className="text-xs text-gray-700 dark:text-zinc-300 font-medium">Type:</span>
                        <span className="text-xs text-gray-600 dark:text-zinc-400 truncate">{typeName}</span>
                      </div>
                    )}

                    {/* Priority */}
                    {priorityInfo && (
                      <div className="flex items-center gap-2 min-w-0">
                        <IoFlag className={`${getPriorityColor(priorityInfo.label || "")} w-3.5 h-3.5 shrink-0`} />
                        <span className="text-xs text-gray-700 dark:text-zinc-300 font-medium">Priority:</span>
                        <span className={`text-xs truncate ${getPriorityColor(priorityInfo.label || "")}`}>{priorityInfo.label}</span>
                      </div>
                    )}

                    {/* Due Date */}
                    {card.dueDate && (
                      <div className="flex items-center gap-2 min-w-0">
                        <IoCalendarOutline className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400 shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-zinc-300 font-medium">Due:</span>
                        <span className="text-xs text-gray-600 dark:text-zinc-400 whitespace-nowrap">
                          {format(parseISO(card.dueDate), "MMM d")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Assignee */}
                  {card.assignee && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                        {assigneeInitial}
                      </div>
                      <span className="text-xs text-gray-700 dark:text-zinc-300 truncate">{card.assignee}</span>
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors flex-shrink-0 -mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(card.id);
                  }}
                >
                  <IoTrash className="text-gray-400 dark:text-zinc-600 hover:text-red-500 w-4 h-4 transition-colors" />
                </button>
              </div>
            </div>
          </>
        )}
      </Draggable>
    );
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="w-full">
          {/* Active Tasks */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl mb-4 overflow-hidden">
            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 md:px-5 py-3 md:py-3.5 cursor-pointer bg-gray-50 dark:bg-zinc-900/60 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              onClick={() => setActiveTasksExpanded(!activeTasksExpanded)}
            >
              <div className="flex items-center gap-2.5">
                {activeTasksExpanded ? (
                  <IoChevronDown className="text-gray-500 dark:text-zinc-400" />
                ) : (
                  <IoChevronForward className="text-gray-500 dark:text-zinc-400" />
                )}
                <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-zinc-100">Active tasks</span>
                <span className="text-xs bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded-full px-2 py-0.5">
                  {activeTasks.length}
                </span>
              </div>
              <Button
                size="sm"
                className="text-white border-none h-8 md:h-8 px-3 md:px-4 text-xs font-semibold rounded-lg w-full md:w-auto"
                onClick={(e) => { e.stopPropagation(); openCreateDialog(); }}
              >
                <IoAdd className="mr-1" /> Create Task
              </Button>
            </div>

            {activeTasksExpanded && (
              <div className="overflow-x-auto">
                <div className="min-w-full md:min-w-[700px]">
                  <TableHeader />
                  <Droppable droppableId="active-tasks">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="p-3 md:p-0 md:bg-transparent bg-gray-50 dark:bg-zinc-900/30">
                        {activeTasks.length > 0 ? (
                          activeTasks.map(({ card }, index) => (
                            <TaskRow key={card.id} card={card} index={index} />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                              <IoAdd className="text-gray-400 dark:text-zinc-500 text-xl" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">No active tasks</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-600 mt-1">Click "Create Task" to get started</p>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 md:px-5 py-3 md:py-3.5 cursor-pointer bg-gray-50 dark:bg-zinc-900/60 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              onClick={() => setCompletedTasksExpanded(!completedTasksExpanded)}
            >
              <div className="flex items-center gap-2.5">
                {completedTasksExpanded ? (
                  <IoChevronDown className="text-gray-500 dark:text-zinc-400" />
                ) : (
                  <IoChevronForward className="text-gray-500 dark:text-zinc-400" />
                )}
                <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-zinc-100">Completed tasks</span>
                <span className="text-xs bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-500 rounded-full px-2 py-0.5">
                  {completedTasks.length}
                </span>
              </div>
            </div>

            {completedTasksExpanded && (
              <div className="overflow-x-auto">
                <div className="min-w-full md:min-w-[700px]">
                  <TableHeader />
                  <Droppable droppableId="completed-tasks">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="p-3 md:p-0 md:bg-transparent bg-gray-50 dark:bg-zinc-900/30">
                        {completedTasks.length > 0 ? (
                          completedTasks.map(({ card }, index) => (
                            <TaskRow key={card.id} card={card} index={index} />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                              <IoCheckmarkCircle className="text-gray-400 dark:text-zinc-500 text-xl" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">No completed tasks</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-600 mt-1">Completed tasks will appear here</p>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Dialog - Task Details Sheet (this was the missing piece) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="overflow-x-hidden w-full max-w-[95vw] sm:max-w-3xl lg:max-w-3xl h-full sm:h-[calc(100dvh-8rem)] max-h-[100dvh] sm:max-h-[100dvh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left side: Form */}
            <div className="col-span-1 md:col-span-2 p-3 sm:p-6 space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-semibold">
                {editingTask ? "Edit Task" : "Create Task"}
              </h2>
              <div className="space-y-3">
                {/* Title */}
                <div>
                  <Input
                    placeholder="Task name"
                    value={form.title || ""}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                {/* Description */}
                <div>
                  <div className="mt-2">
                    <Scheduled
                      taskName={form.title || "Task"}
                      initialDescription={form.description || ""}
                      onDescriptionChange={(content) =>
                        setForm({ ...form, description: content })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-zinc-800 p-3 sm:p-6 space-y-3 sm:space-y-4">
              {/* <div className="space-y-2">
                <p className="text-xs uppercase font-semibold ">Create in</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold">
                    S
                  </div>
                  <span className="text-sm font-medium">Trigbit</span>
                </div>
              </div> */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400 text-[11px]">Type</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-900 dark:text-zinc-100 w-full gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {form.taskTypeId || form.type ? (
                        <>
                          <span
                            className="inline-flex w-5 h-5 rounded-md shrink-0"
                            style={{
                              backgroundColor: getDynamicTypeColor(form.taskTypeId || form.type)
                            }}
                          />
                          {getTypeNameFromId(form.taskTypeId || form.type)}
                        </>
                      ) : (
                        "Select type"
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {dynamicTaskTypes.length > 0 ? (
                      dynamicTaskTypes.map((t) => (
                        <DropdownMenuItem
                          key={t.taskTypeId}
                          onClick={() => setForm({
                            ...form,
                            type: t.name || "",
                            taskTypeId: t.taskTypeId || undefined
                          })}
                          className="gap-2"
                        >
                          <span
                            className="inline-flex w-5 h-5 rounded-md shrink-0"
                            style={{ backgroundColor: t.colorOrIcon || "#94a3b8" }}
                          />
                          {t.name}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-zinc-500 text-center italic">
                        No task types present for this project
                      </div>
                    )}
                    <div className="border-t border-zinc-200 dark:border-zinc-800 mt-1 pt-1">
                      <DropdownMenuItem
                        className="gap-2 text-zinc-600 dark:text-zinc-400 focus:text-zinc-900 dark:focus:text-zinc-100"
                        onClick={() => navigate(`/settings?projectId=${projectId}`)}
                      >
                        <IoSettingsOutline className="w-4 h-4" />
                        Edit types
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400">Status</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-900 dark:text-zinc-100 w-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {form.status ? (
                        (() => {
                          const s = dynamicTaskStatuses.find(st => st.taskStatusId === form.status);
                          if (s) return <span className="flex items-center gap-2"><span>{s.colorOrIcon}</span> {s.name}</span>;
                          const d = DEFAULT_STATUS_OPTIONS.find(st => st.id === form.status);
                          if (d) return <span className="flex items-center gap-2"><span>{d.icon}</span> {d.label}</span>;
                          return "Select status";
                        })()
                      ) : "Select status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {dynamicTaskStatuses.length > 0 ? (
                      dynamicTaskStatuses.map((s) => (
                        <DropdownMenuItem
                          key={s.taskStatusId}
                          onClick={() => setForm({ ...form, status: s.taskStatusId || "" })}
                          className="gap-2"
                        >
                          <span className="text-lg shrink-0">{s.colorOrIcon || "🗒️"}</span>
                          {s.name}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-zinc-500 text-center italic">
                        No statuses present for this project
                      </div>
                    )}
                    <div className="border-t border-zinc-200 dark:border-zinc-800 mt-1 pt-1">
                      <DropdownMenuItem
                        className="gap-2 text-zinc-600 dark:text-zinc-400 focus:text-zinc-900 dark:focus:text-zinc-100"
                        onClick={() => navigate(`/settings?projectId=${projectId}`)}
                      >
                        <IoSettingsOutline className="w-4 h-4" />
                        Edit statuses
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400">Priority</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-900 dark:text-zinc-100 w-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {form.taskPriorityId ? (
                        (() => {
                          const p = dynamicTaskPriorities.find(pr => pr.taskPriorityId === form.taskPriorityId);
                          return p ? (
                            <span className="flex items-center gap-1">
                              <IoFlag className={getPriorityColor(p.name || "")} />
                              {p.name}
                            </span>
                          ) : "Set priority";
                        })()
                      ) : (
                        "Set priority"
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {dynamicTaskPriorities.length > 0 ? (
                      dynamicTaskPriorities.map((p) => (
                        <DropdownMenuItem
                          key={p.taskPriorityId}
                          onClick={() =>
                            setForm({
                              ...form,
                              taskPriorityId: p.taskPriorityId,
                              priority: p.name || null,
                            })
                          }
                        >
                          <div className="flex items-center gap-2">
                            <IoFlag className={getPriorityColor(p.name || "")} />
                            <span>{p.name}</span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-zinc-500 text-center italic">
                        No priorities present
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400">Assignee</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-900 dark:text-zinc-100 w-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {form.assignee ?? "Select assignee"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 p-0">
                    {/* Search Input */}
                    <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={assigneeSearch}
                        onChange={(e) => setAssigneeSearch(e.target.value)}
                        className="w-full"
                        autoFocus
                      />
                    </div>

                    {/* Scrollable User List */}
                    <div className="max-h-[340px] overflow-y-auto py-1 custom-scroll">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <DropdownMenuItem
                            key={user.userId || user.email}
                            onClick={() => setForm({
                              ...form,
                              assignee: user.email || user.name || ""
                            })}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shrink-0">
                              {(user.email || user.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">
                                {user.email || user.name || "Unknown User"}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="p-6 text-center text-zinc-500 text-sm">
                          No users found
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400">Schedule this task for</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-900 dark:text-zinc-100 w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-xl"
                    >
                      <IoCalendarOutline className="mr-2 h-4 w-4" />
                      {form.startDate
                        ? format(parseISO(form.startDate), "MMM d, yyyy")
                        : "Today"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-3xl shadow-2xl border-none overflow-hidden bg-card/80 backdrop-blur-xl">
                    <Calendar
                      mode="single"
                      selected={
                        form.startDate ? parseISO(form.startDate) : undefined
                      }
                      onSelect={(date) =>
                        setForm({ ...form, startDate: toLocalISOString(date) })
                      }
                      className="p-4"
                      classNames={{
                        nav: "flex items-center justify-between absolute inset-x-0 top-4 px-4 z-10",
                        button_previous: "hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                        button_next: "hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                        head_cell: "text-muted-foreground/60 font-bold text-[10px] uppercase tracking-tighter w-9 border-none",
                        cell: "p-0 text-center text-sm relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20 border-none",
                        day: cn(
                          "h-9 w-9 p-0 font-bold aria-selected:opacity-100 rounded-xl transition-all duration-200 border-none"
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-none",
                        day_today: "bg-primary/10 text-primary rounded-xl border-none",
                        day_outside: "text-muted-foreground/30 opacity-50 border-none",
                        day_disabled: "text-muted-foreground opacity-20 border-none",
                        day_hidden: "invisible border-none",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400">Due date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-900 dark:text-zinc-100 w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-xl"
                    >
                      <IoCalendarOutline className="mr-2 h-4 w-4" />
                      {form.dueDate
                        ? format(parseISO(form.dueDate), "MMM d, yyyy")
                        : "Pick due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-3xl shadow-2xl border-none overflow-hidden bg-card/80 backdrop-blur-xl">
                    <Calendar
                      mode="single"
                      selected={
                        form.dueDate ? parseISO(form.dueDate) : undefined
                      }
                      onSelect={(date) =>
                        setForm({ ...form, dueDate: toLocalISOString(date) })
                      }
                      className="p-4"
                      classNames={{
                        nav: "flex items-center justify-between absolute inset-x-0 top-4 px-4 z-10",
                        button_previous: "hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                        button_next: "hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                        head_cell: "text-muted-foreground/60 font-bold text-[10px] uppercase tracking-tighter w-9 border-none",
                        cell: "p-0 text-center text-sm relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20 border-none",
                        day: cn(
                          "h-9 w-9 p-0 font-bold aria-selected:opacity-100 rounded-xl transition-all duration-200 border-none"
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-none",
                        day_today: "bg-primary/10 text-primary rounded-xl border-none",
                        day_outside: "text-muted-foreground/30 opacity-50 border-none",
                        day_disabled: "text-muted-foreground opacity-20 border-none",
                        day_hidden: "invisible border-none",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* ← NEW: Estimated Hours field (this was missing) */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400">Estimated hours</p>
                <Input
                  type="number"
                  placeholder="0"
                  step="0.5"
                  min="0"
                  value={form.estimatedHours ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      estimatedHours: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full"
                />
                <p className="text-[10px] text-zinc-500">Hours (e.g. 8.5)</p>
              </div>
            </div>
          </div>
          {/* Subtasks Section for Creation & Editing */}
          <div className="border-t border-gray-200 dark:border-zinc-800 p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50/50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
              <IoCheckmarkCircle className="text-primary flex-shrink-0" />
              <span className="truncate">Subtasks</span> <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded-full text-xs flex-shrink-0">{(form.subtasks || []).length}</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {(form.subtasks || []).map((st: any, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 p-2 sm:p-3 rounded-xl shadow-sm">
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <Input
                      placeholder="Subtask name"
                      value={st.name}
                      onChange={(e) => {
                        const newSubtasks = [...(form.subtasks || [])];
                        newSubtasks[idx].name = e.target.value;
                        setForm({ ...form, subtasks: newSubtasks });
                      }}
                      className="bg-transparent border-none shadow-none focus-visible:ring-0 h-7 sm:h-8 text-xs sm:text-sm dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500 min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold">
                      {form.assignee?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <button
                      onClick={() => {
                        const newSubtasks = [...(form.subtasks || [])];
                        newSubtasks.splice(idx, 1);
                        setForm({ ...form, subtasks: newSubtasks });
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setForm({
                  ...form,
                  subtasks: [...(form.subtasks || []), { name: "" }]
                })}
                className="flex items-center gap-2 text-sm text-primary  font-medium hover:text-primary/80 transition-colors pl-1"
              >
                <IoAdd />
                Add subtask
              </button>
            </div>
          </div>


          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:justify-between border-t border-gray-200 dark:border-zinc-800 p-3 sm:p-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto text-sm">
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto text-sm">
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default TableView;
