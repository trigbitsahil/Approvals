"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProjectService } from "@/api/services/ProjectService";
import { TaskTypeService } from "@/api/services/TaskTypeService";
import { TaskTypeListVM } from "@/api/models/TaskTypeListVM";
import { TaskTypeManager } from "./TaskTypeManager";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { useRef } from "react";
const ProjectSettings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize description text area with max height cap
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap at 150px max height, keep 44px min height
      textareaRef.current.style.height = `${Math.min(150, Math.max(44, scrollHeight))}px`;
    }
  }, [description]);

  // Task Type Management
  const [projectTypes, setProjectTypes] = useState<TaskTypeListVM[]>([]);
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);

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

  useEffect(() => {
    // Check URL first, then fall back to localStorage
    const idToFetch = projectId || localStorage.getItem("activeProjectId");
    setActiveId(idToFetch);

    if (idToFetch) {
      ProjectService.getProjectById(idToFetch, "1")
        .then((res) => {
          if (res.success && res.data) {
            setProjectName(res.data.name ?? "");
            setDescription(res.data.description ?? "");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch project details:", err);
        });
    }
  }, [projectId]);

  const handleSave = async () => {
    const idToUse = projectId || localStorage.getItem("activeProjectId");
    if (!idToUse) {
      toast.error("No active project found to save.");
      return;
    }

    if (!projectName.trim()) {
      toast.error("Project name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await ProjectService.projectPut("1", {
        projectId: idToUse,
        name: projectName,
        description: description,
        status: "PrjctStatus_0b6b35cb-5a99-42c2-9cf7-8bc9c481d272",
        isActive: true
      });

      if (response.success) {
        toast.success("Project updated successfully!");
      } else {
        toast.error(response.message || "Failed to update project.");
      }
    } catch (error: any) {
      console.error("Save failed:", error);
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg border-none bg-card/10 backdrop-blur-sm">
      <div className="flex justify-start p-4 md:p-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/kanban?projectId=${projectId}`)}
          className="h-10 md:h-11 px-3 md:px-5 text-primary rounded-lg text-sm md:text-base"
        >
          ← Back to Tasks
        </Button>
      </div>

      <CardContent className="p-4 md:p-8 space-y-8 md:space-y-10">
        <div className="space-y-6">
          <h2 className="text-lg md:text-2xl font-semibold">Project settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl pb-6 border-b border-border/50">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-muted-foreground font-medium text-xs md:text-sm">Project name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="bg-background/50 border-border focus-visible:ring-1 focus-visible:ring-primary h-10 md:h-11 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description" className="text-muted-foreground font-medium text-xs md:text-sm">Description</Label>
              <Textarea
                ref={textareaRef}
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                className="bg-background/50 border-border focus-visible:ring-1 focus-visible:ring-primary resize-none py-2 md:py-2.5 min-h-[44px] overflow-y-auto text-sm"
              />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Button
              onClick={handleSave}
              disabled={isSaving || !projectName.trim()}
              className="w-full md:w-auto h-10 md:h-11 px-6 md:px-10 bg-primary/90 font-semibold rounded-lg shadow-lg shadow-rose-500/20 text-sm md:text-base"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSettings;
