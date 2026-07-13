import type { Card } from "@/components/kanban/types";
import { IoTrash, IoFlag, IoCalendar } from "react-icons/io5";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TaskPriorityService } from "@/api/services/TaskPriorityService";
import { TaskPriorityListVM } from "@/api/models/TaskPriorityListVM";
import { cn } from "@/utils/cn";

interface TaskProps {
  task: Card;
  provided: any;
  onClick: () => void;
  onDelete?: () => void;
  onUpdateTask?: (updatedTask: Card) => void;
}

const getPriorityColor = (priorityName: string) => {
  const name = (priorityName || "").toLowerCase();
  if (name.includes("urgent") || name.includes("high")) return "text-red-500 hover:text-red-600";
  if (name.includes("medium")) return "text-yellow-500 hover:text-yellow-600";
  if (name.includes("low")) return "text-green-500 hover:text-green-600";
  return "text-gray-400 hover:text-gray-500";
};

const Task = ({
  task,
  provided,
  onClick,
  onDelete,
  onUpdateTask,
}: TaskProps) => {
  const [priorities, setPriorities] = useState<TaskPriorityListVM[]>([]);

  useEffect(() => {
    TaskPriorityService.getApiVTaskPriority("1")
      .then((response) => {
        if (response.success && response.data) {
          setPriorities(response.data);
        }
      })
      .catch((error) => console.error("Failed to fetch priorities in Task card:", error));
  }, []);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="w-full cursor-pointer bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow rounded-md px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 flex items-center justify-between"
      onClick={onClick}
    >
      <div className="font-medium">{task.title}</div>

      <div
        className="flex items-center gap-2 ml-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Popover>
          <PopoverTrigger asChild>
            <button className="focus:outline-none flex items-center">
              <IoCalendar
                className="text-gray-400 hover:text-blue-600 cursor-pointer"
                title="Due Date"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 bg-card/95 backdrop-blur-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <Calendar
              mode="single"
              selected={task.dueDate ? new Date(task.dueDate) : undefined}
              onSelect={(date) => {
                if (onUpdateTask) {
                  onUpdateTask({
                    ...task,
                    dueDate: date ? date.toISOString() : undefined,
                  });
                }
              }}
              className="p-2 scale-[0.88] origin-center"
              classNames={{
                nav: "flex items-center justify-between absolute inset-x-0 top-3 px-3 z-10",
                button_previous: "h-6 w-6 hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                button_next: "h-6 w-6 hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                head_cell: "text-muted-foreground/60 font-bold text-[9px] uppercase tracking-tighter w-8 border-none",
                cell: "p-0 text-center text-xs relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20 border-none",
                day: cn(
                  "h-7 w-7 p-0 font-semibold aria-selected:opacity-100 rounded-lg transition-all duration-200 border-none flex items-center justify-center mx-auto"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-md shadow-primary/20 border-none",
                day_today: "bg-primary/10 text-primary rounded-lg border-none",
                day_outside: "text-muted-foreground/30 opacity-50 border-none",
                day_disabled: "text-muted-foreground opacity-20 border-none",
                day_hidden: "invisible border-none",
              }}
            />
          </PopoverContent>
        </Popover>

        {task.dueDate && (
          <span className="text-xs text-gray-500 dark:text-zinc-400">
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none flex items-center">
              {(() => {
                const resolvedPriorityName = task.priority || priorities.find(p => p.taskPriorityId === task.taskPriorityId)?.name || "";
                return (
                  <IoFlag
                    className={cn("cursor-pointer hover:scale-110 transition-transform", getPriorityColor(resolvedPriorityName))}
                    title={`Priority: ${resolvedPriorityName || "None"}`}
                  />
                );
              })()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {priorities.length > 0 ? (
              priorities.map((p) => (
                <DropdownMenuItem
                  key={p.taskPriorityId}
                  onClick={() => {
                    if (onUpdateTask) {
                      onUpdateTask({
                        ...task,
                        taskPriorityId: p.taskPriorityId || undefined,
                        priority: p.name || undefined,
                      });
                    }
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <IoFlag className={getPriorityColor(p.name || "")} />
                  <span>{p.name}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-2 text-xs text-zinc-500 italic text-center">
                No priorities found
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <IoTrash
          className="text-gray-400  hover:text-red-500 cursor-pointer"
          title="Delete"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default Task;
