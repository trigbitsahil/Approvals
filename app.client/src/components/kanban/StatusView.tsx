"use client";

import { useState, useEffect, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import type { Card, List } from "@/components/kanban/types";
import { Settings, GripVertical } from "lucide-react";
import { cn } from "@/utils/cn";
import { TaskDetailSheet } from "@/components/kanban/TaskDetailSheet";
import { getTypeColor } from "@/components/kanban/taskTypes";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TaskTypeService } from "@/api/services/TaskTypeService";
import { TaskStatusService } from "@/api/services/TaskStatusService";
import { TaskTypeListVM } from "@/api/models/TaskTypeListVM";
import { TaskStatusListVM } from "@/api/models/TaskStatusListVM";


interface StatusViewProps {
  lists: List[];
  onDragEnd: (result: DropResult) => void;
  onUpdateTask: (task: Card) => void;
  onDeleteTask?: (taskId: string) => void;
  openCreateDialog?: (initialStatus?: string) => void;
}

const DEFAULT_STATUS_COLUMNS = [
  {
    id: "new",
    label: "New task",
    emoji: "🗒️",
  },
  {
    id: "scheduled",
    label: "Scheduled",
    emoji: "📅",
  },
  {
    id: "inprogress",
    label: "In progress",
    emoji: "🔧",
  },
  {
    id: "completed",
    label: "Completed",
    emoji: "✅",
  },
];

const StatusView = ({ lists, onDragEnd, onUpdateTask, onDeleteTask, openCreateDialog }: StatusViewProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Card | null>(null);

  const [dynamicTaskTypes, setDynamicTaskTypes] = useState<TaskTypeListVM[]>([]);
  const [dynamicTaskStatuses, setDynamicTaskStatuses] = useState<TaskStatusListVM[]>([]);

  useEffect(() => {
    const activeProjectId = projectId || localStorage.getItem("activeProjectId");
    if (activeProjectId) {
      // Fetch Types
      TaskTypeService.taskTypeGet("1", "Project", activeProjectId)
        .then((response) => {
          if (response.success && response.data) {
            setDynamicTaskTypes(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch task types in StatusView:", error);
        });

      // Fetch Statuses
      TaskStatusService.getApiVTaskStatus("1", "Project", activeProjectId)
        .then((response) => {
          if (response.success && response.data) {
            setDynamicTaskStatuses(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch task statuses in StatusView:", error);
        });
    }
  }, [projectId]);

  const dynamicColumns = useMemo(() => {
    if (dynamicTaskStatuses.length > 0) {
      return dynamicTaskStatuses.map(s => ({
        id: s.taskStatusId || "",
        label: s.name || "",
        emoji: s.colorOrIcon || "🗒️"
      }));
    }
    return DEFAULT_STATUS_COLUMNS;
  }, [dynamicTaskStatuses]);

  const getDynamicTypeColor = (taskTypeId?: string | null, typeName?: string | null) => {
    // 1. Try to find by ID (most reliable)
    if (taskTypeId) {
      const typeById = dynamicTaskTypes.find((t) => t.taskTypeId === taskTypeId);
      if (typeById?.colorOrIcon) return typeById.colorOrIcon;
    }

    // 2. Try to find by name (fallback/legacy)
    const typeByName = dynamicTaskTypes.find((t) => t.name === typeName);
    if (typeByName?.colorOrIcon) return typeByName.colorOrIcon;

    return getTypeColor(typeName);
  };

  const allCards: { card: Card; listId: string }[] = [];
  (lists ?? []).forEach((list) => {
    list.card?.forEach((card) => {
      allCards.push({ card, listId: list.id });
    });
  });

  const groupedByStatus = dynamicColumns.reduce(
    (acc: Record<string, { card: Card; listId: string }[]>, s) => {
      acc[s.id] = allCards.filter((c) => c.card.status === s.id);
      return acc;
    },
    {} as Record<string, { card: Card; listId: string }[]>,
  );

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div
          className="flex flex-col"
          style={{
            minWidth: `${dynamicColumns.length * 220}px`,
            background: "var(--color-background, #09090b)",
            color: "var(--color-foreground, #fafafa)",
            border: "1px solid #3f3f46",
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Header row */}
            <div
              className="flex items-stretch"
              style={{
                borderBottom: "1px solid #3f3f46",
                background: "rgba(255, 255, 255, 0.02)"
              }}
            >
              {dynamicColumns.map((status: any, i: number) => {
                const tasks = groupedByStatus[status.id] || [];
                const taskCount = tasks.length;
                return (
                  <div
                    key={status.id}
                    className="flex-1 flex items-center gap-2 px-4 py-3"
                    style={{
                      minWidth: "160px",
                      borderRight: "1px solid #3f3f46",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    <span className="text-base">{status.emoji}</span>
                    <span className="opacity-90">{status.label}</span>
                    <span
                      className="ml-auto"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.6
                      }}
                    >
                      {taskCount}
                    </span>
                  </div>
                );
              })}
              {/* Settings icon */}
              <div
                className="flex items-center justify-center px-4"
                style={{ width: "44px" }}
              >
                <Settings
                  className="w-4 h-4 cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
                  onClick={() => navigate(`/settings${projectId ? `?projectId=${projectId}` : ""}`)}
                />
              </div>
            </div>

            <div className="flex items-stretch flex-1">
              {dynamicColumns.map((status: any, i: number) => {
                const tasks = groupedByStatus[status.id] || [];
                const taskCount = tasks.length;

                return (
                  <Droppable droppableId={status.id} key={status.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 flex flex-col"
                        style={{
                          borderRight: "1px solid #3f3f46",
                          background: snapshot.isDraggingOver
                            ? "rgba(255, 255, 255, 0.02)"
                            : "transparent",
                          transition: "background 0.1s ease",
                          padding: "16px",
                          gap: "12px",
                          minHeight: "80vh",
                        }}
                      >
                        {i === 0 && (
                          <button
                            className="flex items-center gap-2 text-[#00a3ff] hover:text-[#33b5ff] text-[13px] font-medium mb-2 transition-colors w-fit group/btn"
                            onClick={() => openCreateDialog?.(status.id)}
                          >
                            <span className="text-lg opacity-80 group-hover/btn:opacity-100">+</span>
                            {/* <span>Create task</span> */}
                          </button>
                        )}

                        {taskCount === 0 ? (
                          i !== 0 && (
                            <div className="flex flex-col items-center pt-8 text-center px-2">
                              <div className="text-[13px] opacity-30 italic">
                                No {status.label.toLowerCase()} yet
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col gap-2.5">
                            {tasks.map(({ card }: { card: Card }, index: number) => (
                              <Draggable
                                key={card.id}
                                draggableId={card.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    onClick={() => {
                                      setSelectedTask(card);
                                      setOpen(true);
                                    }}
                                    className={cn(
                                      "group rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-all duration-150",
                                      "flex items-center gap-2.5",
                                    )}
                                    style={{
                                      ...provided.draggableProps.style,
                                      background: getDynamicTypeColor(card.taskTypeId, card.type) !== "transparent"
                                        ? getDynamicTypeColor(card.taskTypeId, card.type)
                                        : snapshot.isDragging
                                          ? "#27272a"
                                          : "#1e3a2f",
                                      boxShadow: snapshot.isDragging
                                        ? "0 4px 12px rgba(0,0,0,0.5)"
                                        : "none",
                                      color: "#fff",
                                      opacity: snapshot.isDragging ? 0.95 : 1,
                                    }}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="opacity-0 group-hover:opacity-40 transition-opacity cursor-grab shrink-0"
                                    >
                                      <GripVertical className="w-3.5 h-3.5" />
                                    </div>
                                    {/* Avatar circle */}
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white text-[11px] font-semibold shrink-0 uppercase">
                                      {(card.assignee ?? card.title).charAt(0)}
                                    </div>
                                    <span className="flex-1 truncate text-[13px] font-semibold text-white">
                                      {card.title}
                                    </span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
              {/* End spacer */}
              <div style={{ width: "44px", flexShrink: 0 }} />
            </div>
          </DragDropContext>
        </div>
      </div>

      <TaskDetailSheet
        open={open}
        onOpenChange={setOpen}
        task={selectedTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </>
  );
};

export default StatusView;
