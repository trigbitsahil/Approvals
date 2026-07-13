"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  MoreVertical,
  Plus,
  ChevronLeft,
  X,
} from "lucide-react";
import { TaskStatusService } from "@/api/services/TaskStatusService";
import { TaskStatusListVM } from "@/api/models/TaskStatusListVM";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { EmojiPicker } from "@/components/ui/emoji-picker";

function SortableItem({ status, onEdit, onDelete }: { status: TaskStatusListVM; onEdit: (s: TaskStatusListVM) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: status.taskStatusId! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-3 border border-zinc-800  group transition-colors",
        isDragging && " border-zinc-700 shadow-xl opacity-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-zinc-300">
          <GripVertical size={16} />
        </div>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xl w-6 h-6 flex items-center justify-center shrink-0">
            {status.colorOrIcon || "🗒️"}
          </span>
          <span className="text-sm font-medium ">{status.name}</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-zinc-500 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800 transition-colors">
            <MoreVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 bborder-zinc-800">
          <DropdownMenuItem onClick={() => onEdit(status)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(status.taskStatusId!)}
            className="text-red-500 "
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const TaskStatuses = () => {
  const [statuses, setStatuses] = useState<TaskStatusListVM[]>([]);
  const [orderedStatuses, setOrderedStatuses] = useState<TaskStatusListVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [listModalOpen, setListModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    icon: "🗒️",
    id: "",
  });

  const projectId = typeof window !== "undefined" ? localStorage.getItem("activeProjectId") : null;

  const fetchStatuses = async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const response = await TaskStatusService.getApiVTaskStatus("1", "Project", projectId);
      if (response.success && response.data) {
        setStatuses(response.data);
        setOrderedStatuses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      toast.error("Failed to load statuses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [projectId]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrderedStatuses((items) => {
        const oldIndex = items.findIndex((i) => i.taskStatusId === active.id);
        const newIndex = items.findIndex((i) => i.taskStatusId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCreateStatus = async () => {
    if (!formData.name.trim() || !projectId) return;

    try {
      const response = await TaskStatusService.postApiVTaskStatus("1", {
        name: formData.name,
        colorOrIcon: formData.icon,
        category: "Project",
        categoryId: projectId,
        isActive: true,
      });

      if (response.success) {
        toast.success("Status created successfully");
        setCreateModalOpen(false);
        setFormData({ name: "", icon: "🗒️", id: "" });
        fetchStatuses();
      } else {
        toast.error(response.message || "Failed to create status");
      }
    } catch (error) {
      toast.error("An error occurred while creating status");
    }
  };

  const handleUpdateStatus = async () => {
    if (!formData.name.trim() || !formData.id) return;

    try {
      const response = await TaskStatusService.putApiVTaskStatus("1", {
        taskStatusId: formData.id,
        name: formData.name,
        colorOrIcon: formData.icon,
        isActive: true,
      });

      if (response.success) {
        toast.success("Status updated successfully");
        setEditModalOpen(false);
        setFormData({ name: "", icon: "🗒️", id: "" });
        fetchStatuses();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
    }
  };

  const handleDeleteStatus = async (id: string) => {
    try {
      const response = await TaskStatusService.deleteTaskStatus(id, "1");
      if ((response as any).success) {
        toast.success("Status deleted successfully");
        fetchStatuses();
      } else {
        toast.error("Failed to delete status");
      }
    } catch (error) {
      toast.error("An error occurred while deleting status");
    }
  };

  const openCreateModal = () => {
    setFormData({ name: "", icon: "🗒️", id: "" });
    setCreateModalOpen(true);
  };

  const openEditModal = (status: TaskStatusListVM) => {
    setFormData({
      name: status.name || "",
      icon: status.colorOrIcon || "🗒️",
      id: status.taskStatusId || "",
    });
    setEditModalOpen(true);
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg border-zinc-800 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-semibold ">Task statuses</h2>
            <p className="text-sm ">Configure visual indicators for your task workflow progress</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {isLoading ? (
              <div className="animate-pulse flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="h-10 w-24  rounded-xl" />)}
              </div>
            ) : statuses.length > 0 ? (
              statuses.map((status, index) => (
                <React.Fragment key={status.taskStatusId}>
                  <div className="flex items-center gap-2.5 border border-zinc-800  rounded-xl px-5 py-2.5 transition-all hover:border-zinc-600 group">
                    <span className="text-lg group-hover:scale-110 transition-transform">{status.colorOrIcon || "🗒️"}</span>
                    <span className="text-sm font-medium">{status.name}</span>
                  </div>

                  {index !== statuses.length - 1 && (
                    <div className="h-px w-4 dark:bg-zinc-500 bg-zinc-800 shrink-0" />
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className="text-sm text-zinc-500 italic">No statuses configured for this project.</p>
            )}
          </div>

          <Button
            className="rounded-xl h-11 px-6 font-medium shadow-xl  "
            onClick={() => {
              setOrderedStatuses(statuses);
              setListModalOpen(true);
            }}
          >
            Edit statuses
          </Button>
        </CardContent>
      </Card>

      {/* EDIT LIST MODAL */}
      <Dialog open={listModalOpen} onOpenChange={setListModalOpen}>
        <DialogContent className="max-w-[440px] p-0  shadow-2xl overflow-hidden rounded-2xl">
          <div className="p-6 space-y-6">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0">
              <DialogTitle className="text-xl font-bold ">Edit statuses</DialogTitle>

            </DialogHeader>

            <div className="max-h-[400px] overflow-y-auto pr-1">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedStatuses.map((s) => s.taskStatusId!)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2.5">
                    {orderedStatuses.map((status) => (
                      <SortableItem
                        key={status.taskStatusId}
                        status={status}
                        onEdit={openEditModal}
                        onDelete={handleDeleteStatus}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-dashed hover:bg-white/10 hover:border-zinc-500  transition-all font-medium flex items-center justify-center gap-2"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              Add New Status
            </Button>
          </div>

          <div className="p-4  border-t border-zinc-800 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setListModalOpen(false)}
              className="text-white bg-zinc-800 hover:bg-zinc-700 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setStatuses(orderedStatuses);
                setListModalOpen(false);
                toast.success("Order saved locally");
              }}
              className="bg-[#f43f5e] hover:bg-[#e11d48] text-white px-8 rounded-xl font-bold"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CREATE/EDIT STATUS MODAL */}
      <Dialog open={createModalOpen || editModalOpen} onOpenChange={(val) => {
        if (!val) {
          setCreateModalOpen(false);
          setEditModalOpen(false);
        }
      }}>
        <DialogContent className="max-w-[400px] p-6  border-zinc-800 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
              }}
              className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400"
            >
              <ChevronLeft size={20} />
            </button>
            <DialogTitle className="text-xl font-bold ">
              {createModalOpen ? "Create task status" : "Edit task status"}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-4 group">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-12 h-12 flex items-center justify-center border border-zinc-700 rounded-xl text-2xl hover:border-zinc-500 transition-colors shadow-lg shrink-0">
                  {formData.icon}
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-none bg-transparent shadow-none" align="start">
                <EmojiPicker
                  onSelect={(e) => setFormData({ ...formData, icon: e })}
                  onRemove={() => setFormData({ ...formData, icon: "🗒️" })}
                />
              </PopoverContent>
            </Popover>

            <Input
              placeholder="Status name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12   border-zinc-700   rounded-xl focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-zinc-800">
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
              }}
              className="border-zinc-700  rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={createModalOpen ? handleCreateStatus : handleUpdateStatus}
              className="  px-8 rounded-xl font-bold transition-all shadow-lg "
              disabled={!formData.name.trim()}
            >
              {createModalOpen ? "Create" : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskStatuses;
