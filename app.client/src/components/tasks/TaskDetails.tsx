"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ChevronDown,
  HelpCircle,
  MoreVertical,
  Plus,
  RefreshCcw,
  Timer,
  UserPlus,
  Zap,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/cn";

const TABS = [
  { name: "Work", count: 1, active: true },
  { name: "Files", count: 0, active: false },
  { name: "Notes", count: 0, active: false },
  { name: "Reminders", count: 0, active: false },
  { name: "Automation", count: 1, active: false, icon: <Zap className="w-3 h-3 text-muted-foreground/50" /> },
];

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const foundTask = savedTasks.find((t: any) => t.id === Number(id));
    if (foundTask) {
      setTask(foundTask);
    } else {
      // Fallback dummy data if not found in localStorage (for demo)
      setTask({
        id: id,
        name: foundTask?.name || "Task Details",
        recurring: "Primary Recurring Task",
        status: foundTask?.status || "No status",
        priority: foundTask?.priority || "Medium",
        assignees: [
          { name: "CG", color: "bg-orange-500", img: "https://github.com/shadcn.png" },
          { name: "BR", color: "bg-gray-600" },
          { name: "IE", color: "bg-blue-500", img: "https://github.com/leerob.png" },
        ],
        startDate: "3 day(s) after...",
        dueDate: "July 5, 2024",
        progress: 0,
        subtasks: foundTask?.subtasks || [
          { name: "Review Forms", priority: "Low", status: "No status", dueDate: "No due date" }
        ]
      });
    }
  }, [id]);

  if (!task) return <div className="p-8 text-center font-bold">Loading task details...</div>;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Top Header Card */}
      <div className="p-8 rounded-[24px] bg-card border shadow-sm space-y-8">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold tracking-tight">{task.name}</h1>
              {task.recurring && (
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border">
                  <RefreshCcw className="w-3 h-3" />
                  {task.recurring}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {task.assignees.map((a: any, i: number) => (
                  <Avatar key={i} className="w-9 h-9 border-2 border-card ring-2 ring-transparent hover:ring-primary transition-all cursor-pointer">
                    <AvatarImage src={a.img} />
                    <AvatarFallback className={cn("text-[10px] font-bold text-white", a.color)}>{a.name}</AvatarFallback>
                  </Avatar>
                ))}
                <Button variant="ghost" size="icon" className="w-9 h-9 border-2 border-dashed border-muted-foreground/30 hover:border-primary rounded-full ml-2">
                  <Plus className="w-4 h-4 opacity-50" />
                </Button>
              </div>

              <div className="h-4 w-px bg-border/50 mx-2" />

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">Total time</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold opacity-80">00:00 / 00:00</span>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40 cursor-help" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold text-muted-foreground">Recurs every <span className="text-foreground">1 day</span> on completion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 py-1 px-3 bg-muted/20 border border-border/50 rounded-lg">
              <Timer className="w-4 h-4 text-muted-foreground/60" />
              <span className="text-xs font-bold opacity-50 tracking-wider">00:00</span>
              <span className="text-xs font-bold opacity-30 tracking-wider">00:00</span>
            </div>
            <Badge variant="outline" className="h-9 px-4 gap-2 rounded-lg border-orange-500/20 text-orange-500 font-bold bg-orange-500/5">
              <AlertCircle className="w-4 h-4" />
              Medium
            </Badge>
            <Badge variant="outline" className="h-9 px-4 gap-2 rounded-lg bg-muted/20 border-muted text-muted-foreground font-bold">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              No status
            </Badge>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg opacity-40">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Middle row: Dates & Progress */}
        <div className="grid grid-cols-[1fr,300px] gap-8 pt-4 border-t border-border/50">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight opacity-50">Dates</h3>
              <Button variant="outline" className="h-8 text-xs font-bold px-4 rounded-lg bg-muted/10">Add a date</Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-bold w-[100px]">Start date</span>
                  <span className="text-[13px] font-medium opacity-70">
                    3 day(s) after Tax Prep {task.name} is set to Ready
                  </span>
                </div>
                <MoreHorizontal className="w-4 h-4 opacity-0 group-hover:opacity-30 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-bold w-[100px]">Due date</span>
                  <span className="text-[13px] font-medium opacity-70">{task.dueDate}</span>
                </div>
                <MoreHorizontal className="w-4 h-4 opacity-0 group-hover:opacity-30 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4">
             {/* Progress Spinner Simulation */}
             <div className="relative w-28 h-28">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                 <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" strokeDasharray={301.59} strokeDashoffset={301.59 * (1 - task.progress / 100)} strokeLinecap="round" fill="transparent" className="text-blue-500 transition-all duration-1000" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-xs font-bold leading-none">{task.progress}%</span>
                 <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">PROGRESS</span>
               </div>
               <div className="absolute bottom-1 right-5 w-2 h-2 bg-blue-600 rounded-full border-2 border-card shadow-lg" />
             </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content Section */}
      <div className="rounded-[24px] bg-card border shadow-sm overflow-hidden min-h-[500px]">
        <div className="flex border-b border-border/50 bg-muted/10 shadow-sm">
          {TABS.map((tab) => (
            <button 
              key={tab.name}
              className={cn(
                "flex items-center gap-2 px-6 h-12 text-sm font-bold tracking-tight transition-all border-b-2",
                tab.active 
                  ? "border-primary text-primary bg-background" 
                  : "border-transparent text-muted-foreground/60 hover:text-foreground/80 hover:bg-muted/30"
              )}
            >
              {tab.name} 
              <span className={cn("text-[10px] font-extrabold opacity-40 px-1.5 py-0.5 rounded-full bg-muted shadow-inner", tab.active && "text-primary opacity-60")}>
                {tab.count}
              </span>
              {tab.icon}
            </button>
          ))}
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold tracking-tight">Subtasks</h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-9 px-4 text-xs font-bold rounded-lg bg-muted/10">Add a client request</Button>
              <Button variant="outline" className="h-9 px-4 text-xs font-bold rounded-lg bg-muted/10">Add a subtask</Button>
            </div>
          </div>

          <div className="space-y-1">
            {task.subtasks?.map((subtask: any, i: number) => (
              <div key={i} className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/5 transition-all">
                <Checkbox className="w-5 h-5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary" />
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors cursor-pointer">{subtask.name}</h4>
                  <p className="text-[11px] font-semibold text-muted-foreground/60">{subtask.dueDate}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="h-7 gap-1.5 rounded-md border-muted text-muted-foreground font-bold">
                    <AlertCircle className="w-3 h-3" />
                    {subtask.priority}
                  </Badge>
                  <Button variant="ghost" className="h-8 px-2 gap-2 text-muted-foreground/60 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{subtask.status}</span>
                  </Button>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 rounded-lg">
                    <Timer className="w-3.5 h-3.5 opacity-40" />
                    <span className="text-[11px] font-bold opacity-30 tracking-widest">00:00</span>
                    <span className="text-[11px] font-bold opacity-20 tracking-widest">00:00</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 group-hover:opacity-80">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 group-hover:opacity-80">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {task.subtasks?.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground/40 italic">
               <CheckCircle2 className="w-12 h-12 mb-4 opacity-10" />
               <p className="text-sm font-medium">No subtasks yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import { AlertCircle } from "lucide-react";
