"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { TaskTypeService } from "@/api/services/TaskTypeService";
import { TaskTypeListVM } from "@/api/models/TaskTypeListVM";
import { TaskTypeManager } from "./TaskTypeManager";
import { EventTypeService } from "@/api/services/EventTypeService";
import { EventTypeListVM } from "@/api/models/EventTypeListVM";
import { EventTypeManager } from "./EventTypeManager";
import { cn } from "@/utils/cn";

const TypeBadge = ({ label, color }: { label: string; color: string }) => {
  return (
    <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background hover:bg-muted transition-colors">
      <div
        className={cn("w-3 h-3 rounded-sm")}
        style={{ backgroundColor: color }}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
};

const ColorsSetting = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || localStorage.getItem("activeProjectId");
  const [inherit, setInherit] = React.useState(false);

  // Task Types
  const [isTypesModalOpen, setIsTypesModalOpen] = React.useState(false);
  const [projectTypes, setProjectTypes] = React.useState<TaskTypeListVM[]>([]);

  // Event Types
  const [isEventTypesModalOpen, setIsEventTypesModalOpen] = React.useState(false);
  const [projectEventTypes, setProjectEventTypes] = React.useState<EventTypeListVM[]>([]);

  const fetchProjectTypes = async (id: string) => {
    try {
      const res = await TaskTypeService.taskTypeGet("1", "Project", id);
      if (res.success && res.data) {
        setProjectTypes(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch project task types", err);
    }
  };

  const fetchProjectEventTypes = async (id: string) => {
    try {
      const res = await EventTypeService.getApiVEventType("1", "Project", id);
      if (res.success && res.data) {
        setProjectEventTypes(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch project event types", err);
    }
  };

  React.useEffect(() => {
    if (projectId) {
      fetchProjectTypes(projectId);
      fetchProjectEventTypes(projectId);
    }
  }, [projectId]);

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-xl font-semibold">Types and colors</h2>

        {/* <div className="flex items-center gap-3">
          <Checkbox
            id="inherit"
            checked={inherit}
            onCheckedChange={(checked) => setInherit(!!checked)}
          />
          <label htmlFor="inherit" className="text-sm text-muted-foreground">
            Inherit settings from workspace{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Go to workspace settings
            </span>
          </label>
        </div> */}

        <fieldset
          disabled={inherit}
          className={inherit ? "opacity-50 pointer-events-none" : ""}
        >
          {/* Task Types */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Task types</p>

            <div className="flex flex-wrap gap-3">
              {projectTypes.map((type) => (
                <TypeBadge
                  key={type.taskTypeId}
                  label={type.name || ""}
                  color={type.colorOrIcon || "#555"}
                />
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Button
              variant="default"
              className="w-fit   border-none shadow-none px-6 h-10"
              onClick={() => setIsTypesModalOpen(true)}
            >
              Edit types
            </Button>
          </div>

          {/* Event Types */}
          <div className="space-y-4 mt-8">
            <p className="text-sm text-muted-foreground">Event types</p>

            <div className="flex flex-wrap gap-3">
              {projectEventTypes.map((type) => (
                <TypeBadge
                  key={type.eventTypeId}
                  label={type.name || ""}
                  color={type.colorOrIcon || "#555"}
                />
              ))}
            </div>
            <Button
              variant="default"
              className="w-fit mt-2   border-none shadow-none px-6 h-10"
              onClick={() => setIsEventTypesModalOpen(true)}
            >
              Edit events
            </Button>
          </div>

        </fieldset>

        {/* Default Selectors */}
        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-border/50">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              Default type for tasks
            </p>

            <Select defaultValue={projectTypes[0]?.name || ""}>
              <SelectTrigger className="w-[240px] bg-background/50 border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type.taskTypeId} value={type.name || ""}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: type.colorOrIcon || "#555" }}
                      />
                      {type.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              Default type for events
            </p>

            <Select defaultValue={projectEventTypes[0]?.name || ""}>
              <SelectTrigger className="w-[240px] bg-background/50 border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {projectEventTypes.map((type) => (
                  <SelectItem key={type.eventTypeId} value={type.name || ""}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: type.colorOrIcon || "#555" }}
                      />
                      {type.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task Type Manager Modal */}
        {projectId && (
          <TaskTypeManager
            projectId={projectId}
            open={isTypesModalOpen}
            onOpenChange={setIsTypesModalOpen}
            onTypesUpdated={(newTypes) => {
              if (newTypes) {
                setProjectTypes(newTypes);
              } else {
                fetchProjectTypes(projectId);
              }
            }}
            projectTypes={projectTypes}
          />
        )}

        {/* Event Type Manager Modal */}
        {projectId && (
          <EventTypeManager
            projectId={projectId}
            open={isEventTypesModalOpen}
            onOpenChange={setIsEventTypesModalOpen}
            onTypesUpdated={(newTypes) => {
              if (newTypes) {
                setProjectEventTypes(newTypes);
              } else {
                fetchProjectEventTypes(projectId);
              }
            }}
            projectTypes={projectEventTypes}
          />
        )}
      </div>
    </div>
  );
};

export default ColorsSetting;
