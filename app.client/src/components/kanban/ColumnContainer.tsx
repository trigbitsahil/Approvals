import React, { useCallback, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import StrictModeDroppable from "./StrictModeDroppable";
import Task from "./Task";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import AddCardModal from "./AddCardModal";
import { TaskDetailSheet } from "./TaskDetailSheet";
import type { List, Card } from "@/components/kanban/types";
import { TaskService } from "@/api/services/TaskService";
import { toast } from "sonner";
import ConfirmationModal from "@/components/ConfirmationModal";

type Props = {
  column: List;
  list: List[];
  setList: React.Dispatch<React.SetStateAction<List[]>>;
  dragHandleProps?: any;
  onRefresh: () => void;
  onUpdateTask: (task: Card) => void;
};

const ColumnContainer: React.FC<Props> = ({
  column,
  list,
  setList,
  dragHandleProps,
  onRefresh,
  onUpdateTask,
}) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [editTask, setEditTask] = useState<Card | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  const handleAddTask = useCallback(
    (taskData: Card) => {
      setList(
        list.map((item) =>
          item.id === column.id
            ? { ...item, card: [...item.card, taskData] }
            : item,
        ),
      );
    },
    [column.id, list, setList],
  );

  const handleUpdateTask = (updatedTask: Card) => {
    onUpdateTask(updatedTask);
    setEditTask(null);
  };

  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col gap-2 py-4 px-3 rounded-md bg-[var(--color-card)] dark:bg-zinc-900 border border-[var(--color-border)] shadow-md">
      <StrictModeDroppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-3 flex-1 min-h-[150px]"
          >
            <div
              className={`w-full rounded-lg shadow p-3 text-sm font-semibold flex items-center justify-between text-foreground ${column.color}`}
              {...dragHandleProps}
            >
              <span>{column.title}</span>
              <span className="text-xs bg-white text-black rounded-full px-2 py-0.5 min-w-[20px] text-center dark:bg-zinc-700 dark:text-white">
                {column.card.length}
              </span>
            </div>

            {column.card.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div>
                    <Task
                      provided={provided}
                      task={task}
                      onClick={() => setEditTask(task)}
                      onUpdateTask={onUpdateTask}
                      onDelete={() => {
                        setTaskToDeleteId(task.id);
                      }}
                      onSetPriority={(priority) => {
                        setList(
                          list.map((col) =>
                            col.id === column.id
                              ? {
                                ...col,
                                card: col.card.map((c) =>
                                  c.id === task.id ? { ...c, priority } : c,
                                ),
                              }
                              : col,
                          ),
                        );
                      }}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>

      {/* <Button
        variant="outline"
        onClick={() => setOpenAdd(true)}
        className="text-primary"
      >
        <IoMdAdd className="mr-2 h-4 w-4" /> Add Task
      </Button> */}

      <AddCardModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onConfirm={(task) => {
          onRefresh();
          setOpenAdd(false);
        }}
      />

      {editTask && (
        <TaskDetailSheet
          open={!!editTask}
          task={editTask}
          onOpenChange={(open) => !open && setEditTask(null)}
          onUpdateTask={handleUpdateTask}
        />
      )}

      <ConfirmationModal
        open={!!taskToDeleteId}
        onConfirm={async () => {
          if (!taskToDeleteId) return;
          try {
            await TaskService.taskDelete(taskToDeleteId, "1");
            setList((prevList) =>
              prevList.map((col) =>
                col.id === column.id
                  ? {
                      ...col,
                      card: col.card.filter((c) => c.id !== taskToDeleteId),
                    }
                  : col,
              ),
            );
            toast.success("Task deleted");
          } catch (error) {
            console.error("Failed to delete task:", error);
            toast.error("Failed to delete task");
          } finally {
            setTaskToDeleteId(null);
          }
        }}
        onCancel={() => setTaskToDeleteId(null)}
        message="Are you sure you want to delete this task?"
        description="This action cannot be undone. This will permanently delete the task from our records."
        yesLabel="Delete"
        noLabel="Cancel"
        yesVariant="destructive"
      />
    </div>
  );
};

export default ColumnContainer;
