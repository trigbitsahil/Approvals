import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EventTypeService } from "@/api/services/EventTypeService";
import { EventTypeListVM } from "@/api/models/EventTypeListVM";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import {
  Plus,
  Search,
  GripVertical,
  ChevronLeft,
  Trash2
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EventTypeManagerProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTypesUpdated: (newTypes?: EventTypeListVM[]) => void;
  projectTypes: EventTypeListVM[];
}

type ModalState = "edit" | "add" | "create" | "edit-type";

const PRESET_COLORS = [
  "#2563eb", // blue
  "#0ea5e9", // light blue
  "#0d9488", // teal
  "#15803d", // emerald
  "#4d7c0f", // green
  "#a8a29e", // grey
  "#78350f", // brown
  "#92400e", // amber
  "#86198f", // purple
  "#17c345ff", // indigo
  "#995797ff",
  "#6366F1", // indigo-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#F43F5E", // rose-500
];

interface SortableItemProps {
  type: EventTypeListVM;
  onClick: () => void;
  onDelete: (id: string) => void;
}

const SortableEventTypeItem: React.FC<SortableItemProps> = ({ type, onClick, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: type.eventTypeId! });

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
        "flex items-center justify-between group cursor-default hover:bg-muted p-2 rounded-md transition-colors",
        isDragging && "bg-muted shadow-sm opacity-50"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div
          className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
          onClick={onClick}
        >
          <div
            className="w-4 h-4 rounded-sm shrink-0"
            style={{ backgroundColor: type.colorOrIcon || "#555" }}
          />
          <span className="text-sm font-medium truncate">{type.name}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(type.eventTypeId!);
        }}
        className="text-muted-foreground  group-hover:opacity-100 p-1 rounded hover:bg-background transition-all shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const EventTypeManager: React.FC<EventTypeManagerProps> = ({
  projectId,
  open,
  onOpenChange,
  onTypesUpdated,
  projectTypes,
}) => {
  const [modalState, setModalState] = useState<ModalState>("edit");
  const [workspaceTypes, setWorkspaceTypes] = useState<EventTypeListVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkspaceTypes, setSelectedWorkspaceTypes] = useState<string[]>([]);

  // Create Type Form State
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeColor, setNewTypeColor] = useState(PRESET_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingSelected, setIsAddingSelected] = useState(false);

  // Edit Type Form State
  const [editingType, setEditingType] = useState<EventTypeListVM | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Drag and Drop State
  const [orderedTypes, setOrderedTypes] = useState<EventTypeListVM[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Reset state when modal closes/opens
  useEffect(() => {
    if (open) {
      setModalState("edit");
      setSearchQuery("");
      setSelectedWorkspaceTypes([]);
      setOrderedTypes(projectTypes);
    }
  }, [open, projectTypes]);

  // Fetch workspace event types when entering "add" mode
  useEffect(() => {
    if (modalState === "add") {
      EventTypeService.getApiVEventType("1")
        .then((res) => {
          if (res.success && res.data) {
            // Filter out types that are already in the project
            const existingIds = projectTypes.map(t => t.eventTypeId);
            setWorkspaceTypes(res.data.filter(t => !existingIds.includes(t.eventTypeId)));
          }
        })
        .catch(err => console.error("Failed to fetch workspace event types", err));
    }
  }, [modalState, projectTypes]);

  const handleCreateType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Please enter a type name.");
      return;
    }

    setIsCreating(true);
    try {
      const response = await EventTypeService.postApiVEventType("1", {
        name: newTypeName,
        code: newTypeName.replace(/\s+/g, "_"),
        category: "Project",
        categoryId: projectId,
        colorOrIcon: newTypeColor,
        description: "Project event type",
      });

      if (response.success) {
        toast.success(`Event type "${newTypeName}" created!`);
        onTypesUpdated();
        setModalState("edit");
        setNewTypeName("");
      } else {
        toast.error(response.message || "Failed to create event type.");
      }
    } catch (error) {
      toast.error("An error occurred while creating.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateType = async () => {
    if (!editingType || !editName.trim()) {
      toast.error("Please enter a type name.");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await EventTypeService.putApiVEventType("1", {
        eventTypeId: editingType.eventTypeId,
        name: editName,
        code: editingType.code,
        description: editingType.description,
        isActive: true,
        colorOrIcon: editColor,
      });

      if (response.success) {
        toast.success(`Event type updated successfully!`);
        onTypesUpdated();
        setModalState("edit");
        setEditingType(null);
      } else {
        toast.error(response.message || "Failed to update event type.");
      }
    } catch (error) {
      toast.error("An error occurred while updating.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddSelectedTypes = async () => {
    if (selectedWorkspaceTypes.length === 0) return;

    setIsAddingSelected(true);
    try {
      for (const typeId of selectedWorkspaceTypes) {
        const typeToAdd = workspaceTypes.find(t => t.eventTypeId === typeId);
        if (typeToAdd) {
          await EventTypeService.postApiVEventType("1", {
            name: typeToAdd.name,
            code: typeToAdd.code,
            category: "Project",
            categoryId: projectId,
            colorOrIcon: typeToAdd.colorOrIcon || PRESET_COLORS[0],
            description: typeToAdd.description,
          });
        }
      }
      toast.success("Event types added to project!");
      onTypesUpdated();
      setModalState("edit");
    } catch (error) {
      toast.error("Failed to add some types.");
    } finally {
      setIsAddingSelected(false);
    }
  };

  const startEditDetail = (type: EventTypeListVM) => {
    setEditingType(type);
    setEditName(type.name || "");
    setEditColor(type.colorOrIcon || PRESET_COLORS[0]);
    setModalState("edit-type");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedTypes((items) => {
        const oldIndex = items.findIndex((i) => i.eventTypeId === active.id);
        const newIndex = items.findIndex((i) => i.eventTypeId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDeleteType = async (typeId: string) => {
    try {
      const response = await EventTypeService.deleteEventType(typeId, "1");
      if ((response as any).success) {
        toast.success("Event type deleted successfully");
        onTypesUpdated();
        setOrderedTypes(prev => prev.filter(t => t.eventTypeId !== typeId));
      } else {
        toast.error("Failed to delete event type");
      }
    } catch (error) {
      toast.error("An error occurred while deleting event type");
    }
  };

  const filteredWorkspaceTypes = workspaceTypes.filter(t =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-background border-border">

        {modalState === "edit" && (
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Edit event types</DialogTitle>
            </DialogHeader>

            <div className="space-y-1">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedTypes.map(t => t.eventTypeId!)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedTypes.map((type) => (
                    <SortableEventTypeItem
                      key={type.eventTypeId}
                      type={type}
                      onClick={() => startEditDetail(type)}
                      onDelete={handleDeleteType}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <button
              onClick={() => setModalState("add")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
            >
              <Plus className="w-4 h-4" />
              Add event type
            </button>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={() => {
                onTypesUpdated(orderedTypes);
                onOpenChange(false);
              }}>Save</Button>
            </div>
          </div>
        )}

        {modalState === "add" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setModalState("edit")} className="hover:text-primary transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <DialogTitle className="text-xl font-semibold">Add event type</DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
                onClick={() => setModalState("create")}
              >
                <Plus className="w-4 h-4 mr-1" />
                Create new
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-9 bg-muted/50 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2 px-1">Available event types in the workspace</p>
              {filteredWorkspaceTypes.length > 0 ? (
                filteredWorkspaceTypes.map((type) => (
                  <label
                    key={type.eventTypeId}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-sm shrink-0"
                        style={{ backgroundColor: type.colorOrIcon || "#555" }}
                      />
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                    <Checkbox
                      checked={selectedWorkspaceTypes.includes(type.eventTypeId!)}
                      onCheckedChange={(checked) => {
                        setSelectedWorkspaceTypes(prev =>
                          checked
                            ? [...prev, type.eventTypeId!]
                            : prev.filter(id => id !== type.eventTypeId)
                        );
                      }}
                    />
                  </label>
                ))
              ) : (
                <p className="text-center py-8 text-sm text-muted-foreground">No types found.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setModalState("edit")}>Cancel</Button>
              <Button
                onClick={handleAddSelectedTypes}
                disabled={selectedWorkspaceTypes.length === 0 || isAddingSelected}
              >
                {isAddingSelected ? "Adding..." : "Add event types"}
              </Button>
            </div>
          </div>
        )}

        {modalState === "create" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setModalState("add")} className="hover:text-primary transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <DialogTitle className="text-xl font-semibold">Create event type</DialogTitle>
            </div>

            <div className="flex items-center gap-3 p-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer border border-border shadow-sm"
                style={{ backgroundColor: newTypeColor }}
              />
              <Input
                placeholder="Type name"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="flex-1 bg-muted/30 border-border focus-visible:ring-1 focus-visible:ring-primary h-10"
              />
            </div>

            <div className="p-2 border border-border rounded-xl bg-card/50">
              <div className="grid grid-cols-5 gap-3 p-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewTypeColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-lg transition-transform hover:scale-110 flex items-center justify-center",
                      newTypeColor === color ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : ""
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setModalState("add")}>Cancel</Button>
              <Button onClick={handleCreateType} disabled={isCreating || !newTypeName.trim()}>
                {isCreating ? "Creating..." : "Create event type"}
              </Button>
            </div>
          </div>
        )}

        {modalState === "edit-type" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setModalState("edit")} className="hover:text-primary transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <DialogTitle className="text-xl font-semibold">Edit event type</DialogTitle>
            </div>

            <div className="flex items-center gap-3 p-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer border border-border shadow-sm shrink-0"
                style={{ backgroundColor: editColor }}
              />
              <Input
                placeholder="Type name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 bg-muted/30 border-border focus-visible:ring-1 focus-visible:ring-primary h-10"
              />
            </div>

            <div className="p-2 border border-border rounded-xl bg-card/50">
              <div className="grid grid-cols-5 gap-3 p-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-lg transition-transform hover:scale-110 flex items-center justify-center",
                      editColor === color ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : ""
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setModalState("edit")}>Cancel</Button>
              <Button onClick={handleUpdateType} disabled={isUpdating || !editName.trim()}>
                {isUpdating ? "Updating..." : "Save"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
