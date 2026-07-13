"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IoMdAdd } from "react-icons/io";
import ColumnContainer from "./ColumnContainer";
import type { List } from "@/components/kanban/types";
import TableView from "./TableView";
import StatusView from "./StatusView";
import { CiViewTable } from "react-icons/ci";
import { MdOutlineViewKanban } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { TaskService } from "@/api/services/TaskService";
import { TaskStatusService } from "@/api/services/TaskStatusService";
import { toast } from "sonner";
import { Card } from "./types";

const KanbanBoard = () => {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");
  const projectId = projectIdFromUrl || localStorage.getItem("activeProjectId") || "";

  const tableViewRef = useRef<any>(null);
  const [view, setView] = useState<"kanban" | "table" | "status">("kanban");
  const [list, setList] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTask = async (updatedTask: any) => {
    // Optimistic UI Update
    setList((prevList) => {
      let movedCard: any = null;

      // First, remove the card from its original column and capture its updated data
      const listWithoutCard = prevList.map((col) => {
        const found = col.card.find((c) => c.id === updatedTask.id);
        if (found) {
          movedCard = { ...found, ...updatedTask };
          return { ...col, card: col.card.filter((c) => c.id !== updatedTask.id) };
        }
        return col;
      });

      if (!movedCard) return prevList;

      // Second, add it to the column that matches its new status
      return listWithoutCard.map((col) => {
        if (col.id === movedCard.status) {
          return { ...col, card: [...col.card, movedCard] };
        }
        return col;
      });
    });

    // Call API - Now includes assignedTo
    try {
      const response = await TaskService.taskPut("1", {
        taskId: updatedTask.id,
        name: updatedTask.title || "Untitled",
        description: updatedTask.description || "Task description",
        status: updatedTask.status || null,
        startDate: updatedTask.startDate || null,
        dueDate: updatedTask.dueDate || null,
        estimatedHours: updatedTask.estimatedHours ?? null,
        isActive: true,
        isRecurring: false,
        taskTypeId: updatedTask.taskTypeId || null,
        taskPriorityId: updatedTask.taskPriorityId || null,
        assignedTo: updatedTask.assignee || updatedTask.assignedTo || null,   // ← Added: sends assigned user to API
      } as any);
      if (!response.success) {
        console.error("Failed to update task API response:", response.message);
      }
    } catch (error) {
      console.error("Failed to update task via API:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskService.taskDelete(taskId, "1");
      setList((prevList) =>
        prevList.map((listItem) => ({
          ...listItem,
          card: listItem.card.filter((c) => c.id !== taskId),
        }))
      );
      toast.success("Task deleted");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      // 1. Fetch Statuses to define columns
      const statusRes = await TaskStatusService.getApiVTaskStatus("1", "Project", projectId);
      const statuses = statusRes.data || [];

      // 2. Fetch Tasks
      const taskRes = await TaskService.taskGet("1", "Project", projectId);
      const allTasks = taskRes.data || [];

      // 3. Map Tasks to Status Columns
      const columns: List[] = statuses.map((s, idx) => {
        const tasksForStatus: Card[] = allTasks
          .filter(t => t.status === s.taskStatusId)
          .map((t, tIdx) => ({
            id: t.taskId || `status-${idx}-task-${tIdx}`,
            title: t.name || "Untitled",
            description: t.description || "",
            status: t.status || "",
            dueDate: t.dueDate || undefined,
            startDate: t.startDate || undefined,
            type: (t as any).taskTypeId || "Operational",
            taskTypeId: (t as any).taskTypeId || null,
            taskPriorityId: (t as any).taskPriorityId || null,
            assignee: t.assignedTo || t.createdBy || "Unassigned",
            estimatedHours: t.estimatedHours ?? undefined,   // ← FIXED: now we pull the real value from API (was missing)
          }));

        return {
          id: s.taskStatusId || idx.toString(),
          title: s.name || "Unnamed Status",
          color: "dark:bg-zinc-800 bg-muted",
          card: tasksForStatus
        };
      });

      // Special case: Tasks with no status or unknown status
      const unassignedTasks = allTasks.filter(t => !statuses.find(s => s.taskStatusId === t.status));
      if (unassignedTasks.length > 0) {
        columns.unshift({
          id: "unassigned",
          title: "Backlog",
          color: "bg-gray-400",
          card: unassignedTasks.map((t, idx) => ({
            id: t.taskId || `unassigned-${idx}`,
            title: t.name || "Untitled",
            description: t.description || "",
            status: t.status || "",
            dueDate: t.endDate || undefined,
            startDate: t.startDate || undefined,
            type: (t as any).taskTypeId || "Operational",
            taskTypeId: (t as any).taskTypeId || null,
            taskPriorityId: (t as any).taskPriorityId || null,
            assignee: t.assignedTo || t.createdBy || "Unassigned",
            estimatedHours: t.estimatedHours ?? undefined,   // ← FIXED: now we pull the real value from API
          }))
        });
      }

      setList(columns);
    } catch (error) {
      console.error("Failed to fetch project tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleAddList = useCallback(() => {
    const colors = [
      "bg-yellow-400",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-400",
      "bg-blue-400",
    ];

    setList((prevList) => [
      ...prevList,
      {
        id: Date.now().toString(),
        title: `List ${prevList.length + 1}`,
        color: colors[prevList.length % colors.length],
        card: [],
      },
    ]);
  }, []);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      const reordered = Array.from(list);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);
      setList(reordered);
      return;
    }

    const sourceList = list.find((l) => l.id === source.droppableId);
    const destList = list.find((l) => l.id === destination.droppableId);
    if (!sourceList || !destList) return;

    const sourceCards = [...sourceList.card];
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCards.splice(destination.index, 0, movedCard);
      setList((prev) =>
        prev.map((l) =>
          l.id === sourceList.id ? { ...l, card: sourceCards } : l,
        ),
      );
    } else {
      const destCards = [...destList.card];

      // Keep ALL original fields + only update status
      const updatedCard = {
        ...movedCard,
        status: destination.droppableId
      };

      destCards.splice(destination.index, 0, updatedCard);

      setList((prev) =>
        prev.map((l) => {
          if (l.id === sourceList.id) return { ...l, card: sourceCards };
          if (l.id === destList.id) return { ...l, card: destCards };
          return l;
        }),
      );

      // API call - preserve taskTypeId and all other fields
      TaskService.taskPut("1", {
        taskId: updatedCard.id,
        name: updatedCard.title || "Untitled",
        description: updatedCard.description || "Task description",
        status: updatedCard.status || null,
        startDate: updatedCard.startDate || null,
        dueDate: updatedCard.dueDate || null,
        estimatedHours: (updatedCard as any).estimatedHours ?? null,
        isActive: true,
        isRecurring: false,
        taskTypeId: updatedCard.taskTypeId || (updatedCard as any).type || null,        // ← Fixed: preserve taskTypeId or fallback to type
        taskPriorityId: updatedCard.taskPriorityId || null,
        assignedTo: updatedCard.assignee || (updatedCard as any).assignedTo || null,
      } as any).catch(err => console.error("Failed to update task via API:", err));
    }
  };
  const handleStatusDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setList((prevList) =>
      prevList.map((listItem) => ({
        ...listItem,
        card: listItem.card.map((card) =>
          card.id === draggableId
            ? { ...card, status: destination.droppableId }
            : card,
        ),
      })),
    );

    // Sync status change to backend - preserve all fields
    const movedCard = list.flatMap(l => l.card).find(c => c.id === draggableId);
    if (movedCard) {
      TaskService.taskPut("1", {
        taskId: movedCard.id,
        name: movedCard.title || "Untitled",
        description: movedCard.description || "Task description",
        status: destination.droppableId,
        startDate: movedCard.startDate || null,
        dueDate: movedCard.dueDate || null,
        estimatedHours: (movedCard as any).estimatedHours ?? null,
        isActive: true,
        isRecurring: false,
        taskTypeId: movedCard.taskTypeId || (movedCard as any).type || null,        // ← Fixed: preserve taskTypeId or fallback to type
        taskPriorityId: movedCard.taskPriorityId || null,
        assignedTo: movedCard.assignee || (movedCard as any).assignedTo || null,
      } as any).catch(err => console.error("Failed to update task via API:", err));
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-background text-foreground overflow-x-auto">
      {/* View Toggle */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={view === "table" ? "secondary" : "outline"}
          onClick={() => setView("table")}
        >
          <CiViewTable />
          Table view
        </Button>
        {/* <Button
          variant={view === "kanban" ? "secondary" : "outline"}
          onClick={() => setView("kanban")}
        >
          <MdOutlineViewKanban />
          Status
        </Button> */}
        <Button
          variant={view === "status" ? "secondary" : "outline"}
          onClick={() => setView("status")}
        >
          Kanban
        </Button>
      </div>

      <DragDropContext
        onDragEnd={view === "status" ? handleStatusDragEnd : onDragEnd}
      >
        <div style={{ display: view === "table" ? "block" : "none" }}>
          <TableView
            ref={tableViewRef}
            list={list}
            setList={setList}
            onRefresh={fetchProjectData}
          />
        </div>

        {view === "kanban" ? (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-zinc-500">Loading tasks...</div>
            ) : (
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex gap-4 pb-6"
                  >
                    {list.map((column, index) => (
                      <Draggable
                        draggableId={column.id}
                        index={index}
                        key={column.id}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className="flex-shrink-0"
                          >
                            <ColumnContainer
                              column={column}
                              list={list}
                              setList={setList}
                              dragHandleProps={provided.dragHandleProps}
                              onRefresh={fetchProjectData}
                              onUpdateTask={handleUpdateTask}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}

            <div className="w-full flex justify-start mt-4">
              <Button onClick={() => tableViewRef.current?.openCreateDialog()}>
                <IoMdAdd className="mr-2 h-4 w-4" /> Add Another List
              </Button>
            </div>
          </>
        ) : (
          <>
            {view === "status" && (
              <StatusView
                lists={list}
                onDragEnd={handleStatusDragEnd}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                openCreateDialog={(initialStatus) =>
                  tableViewRef.current?.openCreateDialog(initialStatus)
                }
              />
            )}
          </>
        )}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;