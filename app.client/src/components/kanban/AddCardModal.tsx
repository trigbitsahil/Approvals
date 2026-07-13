import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { IoFlag, IoCalendarOutline, IoSettingsOutline } from "react-icons/io5";
import type { Card } from "./types";
import { TASK_TYPES } from "./taskTypes";
import { TaskTypeService } from "@/api/services/TaskTypeService";
import { TaskStatusService } from "@/api/services/TaskStatusService";
import { TaskTypeListVM } from "@/api/models/TaskTypeListVM";
import { TaskStatusListVM } from "@/api/models/TaskStatusListVM";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TaskService } from "@/api/services/TaskService";
import { TaskPriorityService } from "@/api/services/TaskPriorityService";
import { TaskPriorityListVM } from "@/api/models/TaskPriorityListVM";
import { Textarea } from "@/components/ui/textarea";


export type ConfirmationModalProps = {
  onConfirm: (taskData: Card) => void;
  onCancel: () => void;
  open: boolean;
};

const AddCardModal: React.FC<ConfirmationModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectIdFromUrl = searchParams.get("projectId");
  const projectId = projectIdFromUrl || localStorage.getItem("activeProjectId") || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>();
  const [taskPriorityId, setTaskPriorityId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<Card["status"]>();
  const [type, setType] = useState<string>("Operational");
  const [assignee, setAssignee] = useState<string>();

  const [dynamicTaskTypes, setDynamicTaskTypes] = useState<TaskTypeListVM[]>([]);
  const [dynamicTaskStatuses, setDynamicTaskStatuses] = useState<TaskStatusListVM[]>([]);
  const [dynamicTaskPriorities, setDynamicTaskPriorities] = useState<TaskPriorityListVM[]>([]);

  useEffect(() => {
    if (projectId) {
      // Reset form on project switch
      setTitle("");
      setDescription("");
      setPriority(undefined);
      setTaskPriorityId(null);
      setDueDate(undefined);
      setStartDate(new Date());
      setStatus(undefined);
      setType("Operational");
      setAssignee(undefined);
    }
    
    if (open && projectId) {
      // Fetch types
      TaskTypeService.taskTypeGet("1", "Project", projectId)
        .then((response) => {
          if (response.success && response.data) {
            setDynamicTaskTypes(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch task types:", error);
        });

      // Fetch statuses
      TaskStatusService.getApiVTaskStatus("1", "Project", projectId)
        .then((response) => {
          if (response.success && response.data) {
            setDynamicTaskStatuses(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch task statuses:", error);
        });

      // Fetch priorities
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
  }, [open, projectId]);

  const getDynamicTypeColor = (typeName: string) => {
    const typeObj = dynamicTaskTypes.find(t => t.name === typeName);
    if (typeObj?.colorOrIcon) return typeObj.colorOrIcon;
    return TASK_TYPES.find(t => t.label === typeName)?.color ?? "#3b82f6";
  };

  const getStatusDisplayName = (statusId?: string) => {
    if (!statusId) return "Status";
    const statusObj = dynamicTaskStatuses.find(s => s.taskStatusId === statusId);
    return statusObj ? statusObj.name : statusId;
  };

  const getStatusIcon = (statusId?: string) => {
    if (!statusId) return null;
    const statusObj = dynamicTaskStatuses.find(s => s.taskStatusId === statusId);
    return statusObj ? statusObj.colorOrIcon : "🗒️";
  };


  const handleSubmit = async () => {
    if (!title.trim() || !status || !projectId || !description.trim()) {
      alert("Missing required fields (Name, Status, Description, Project ID)");
      return;
    }

    try {
      const response = await TaskService.taskPost("1", {
        name: title,
        description: description,
        status: status,
        category: "Project",
        categoryId: projectId,
        taskType: type || null,
        taskPriorityId: taskPriorityId || null,
        priority: priority || null,
        startDate: startDate.toISOString(),
        endDate: dueDate?.toISOString() || null,
        dueDate: dueDate?.toISOString() || null,
      } as any);

      if (response.success) {
        onConfirm({
          id: response.data?.taskId || Date.now().toString(),
          title,
          description,
          priority,
          taskPriorityId,
          dueDate: dueDate?.toISOString(),
          startDate: startDate.toISOString(),
          status,
          type,
          assignee,
        });
        setTitle("");
        setDescription("");
        setPriority(undefined);
        setTaskPriorityId(null);
        setDueDate(undefined);
        setStartDate(new Date());
        setStatus(undefined);
        setType("Operational");
        setAssignee(undefined);
      } else {
        alert(`Failed to create task: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("API error creating task:", error);
      alert("An error occurred while creating the task.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>

        {/* Title */}
        <div className="space-y-4">
          <Input
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea 
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* Due Date and Priority */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Schedule for</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                  <IoCalendarOutline className="text-gray-500" />
                  {startDate ? format(startDate, "PPP") : "Today"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                  <IoCalendarOutline className="text-gray-500" />
                  {dueDate ? format(dueDate, "PPP") : "Pick due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-4">

            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <IoFlag className="text-zinc-400 text-lg" />
                {taskPriorityId ? (
                  dynamicTaskPriorities.find(p => p.taskPriorityId === taskPriorityId)?.name || "Priority"
                ) : (
                  "Priority"
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {dynamicTaskPriorities.length > 0 ? (
                dynamicTaskPriorities.map((p) => (
                  <DropdownMenuItem
                    key={p.taskPriorityId}
                    onClick={() => {
                      setTaskPriorityId(p.taskPriorityId || null);
                      setPriority(p.name || undefined);
                    }}
                  >
                    <IoFlag className="text-zinc-400 mr-2" />
                    {p.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-3 text-xs text-zinc-500 text-center italic">
                  No priorities present
                </div>
              )}
              <DropdownMenuItem onClick={() => {
                setTaskPriorityId(null);
                setPriority(undefined);
              }}>
                <span className="text-gray-400 mr-2">🚫</span> Clear
              </DropdownMenuItem>
            </DropdownMenuContent>
        </div>

        {/* Type */}
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Type</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                {type && (
                  <span
                    className="inline-flex w-5 h-5 rounded-md shrink-0"
                    style={{ backgroundColor: getDynamicTypeColor(type) }}
                  />
                )}
                {type ?? "Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {dynamicTaskTypes.length > 0 ? (
                dynamicTaskTypes.map((t) => (
                  <DropdownMenuItem key={t.taskTypeId} onClick={() => setType(t.name || "")} className="gap-2">
                    <span
                      className="inline-flex w-5 h-5 rounded-md shrink-0"
                      style={{ backgroundColor: t.colorOrIcon || "#3b82f6" }}
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

        {/* Status */}
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Status</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                <span className="text-lg shrink-0">
                  {getStatusIcon(status)}
                </span>
                {getStatusDisplayName(status)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {dynamicTaskStatuses.length > 0 ? (
                dynamicTaskStatuses.map((s) => (
                  <DropdownMenuItem
                    key={s.taskStatusId}
                    onClick={() => setStatus(s.taskStatusId || "")}
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

        {/* Assignee */}
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Assignee</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {assignee ?? " Assignee"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["Me", "John Doe", "Jane Smith", "Team A"].map((a) => (
                <DropdownMenuItem key={a} onClick={() => setAssignee(a)}>
                  {a}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer */}
        <DialogFooter className="pt-4">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardModal;
