"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  UserPlus,
  HelpCircle,
  AlertCircle,
  FileText,
  ClipboardList,
  UserCheck,
  MessageSquare,
  StickyNote,
  Files,
  Zap,
  LayoutGrid,
  History,
  CreditCard,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

// Dummy data matching the screenshot
const TASKS = [
  {
    id: "1",
    status: "Needs review",
    statusColor: "bg-red-500",
    name: "2024 1040 Tax Organizer - Questionnaire",
    type: "Questionnaire",
    assignees: [
      { name: "Chloe Griffin", fallback: "CG" },
      { name: "Mart With...", fallback: "MW" }
    ],
    startDate: null,
    dueDate: "Overdue 7/30/2025",
    priority: "No priority",
    progress: null,
  },
  {
    id: "2",
    status: "With client",
    statusColor: "bg-purple-500",
    name: "Von Riu Household 202...",
    type: "Questionnaire",
    assignees: [
      { name: "Chloe Griffin", fallback: "CG" },
      { name: "Mart With...", fallback: "MW" }
    ],
    startDate: null,
    dueDate: "Overdue 10/22/2025",
    priority: "No priority",
    progress: null,
  },
  {
    id: "3",
    status: "In progress",
    statusColor: "bg-yellow-500",
    name: "1040 Tax Ret...",
    type: "Task w/ subtasks",
    assignees: [
      { name: "Chloe Griffin", fallback: "CG" },
      { name: "Mart With...", fallback: "MW" }
    ],
    startDate: "11/19/2025",
    dueDate: "Overdue 11/6/2025",
    priority: "No priority",
    progress: "4 / 12",
  },
  {
    id: "4",
    status: "With client",
    statusColor: "bg-purple-500",
    name: "eSign request: 8879 & Id...",
    type: "eSign Request",
    assignees: [{ name: "Irie Earnest (me)", fallback: "IE" }],
    startDate: null,
    dueDate: "12/31/2025",
    priority: "No priority",
    progress: null,
  },
  {
    id: "5",
    status: "With client",
    statusColor: "bg-purple-500",
    name: "eSign request: f8879.pdf",
    type: "eSign Request",
    assignees: [{ name: "Irie Earnest (me)", fallback: "IE" }],
    startDate: null,
    dueDate: "12/31/2025",
    priority: "No priority",
    progress: null,
  },
  {
    id: "6",
    status: "No status",
    statusColor: "bg-gray-400",
    name: "1040 Tax Return",
    type: "Task w/ subtasks",
    assignees: [{ name: "Irie Earnest (me)", fallback: "IE" }],
    startDate: null,
    dueDate: null,
    priority: "No priority",
    progress: "0 / 9",
  },
  {
    id: "7",
    status: "No status",
    statusColor: "bg-gray-400",
    name: "1040 Tax Return",
    type: "Task w/ subtasks",
    assignees: [{ name: "Irie Earnest (me)", fallback: "IE" }],
    startDate: null,
    dueDate: null,
    priority: "Medium",
    progress: "0 / 9",
  },
  {
    id: "8",
    status: "With client",
    statusColor: "bg-purple-500",
    name: "2024 1040 Tax Organize...",
    type: "Questionnaire",
    assignees: [{ name: "Irie Earnest (me)", fallback: "IE" }],
    startDate: null,
    dueDate: null,
    priority: "No priority",
    progress: null,
  },
  {
    id: "9",
    status: "Draft",
    statusColor: "bg-orange-300",
    name: "2024 1040 Tax Organize...",
    type: "Questionnaire",
    assignees: [{ name: "Irie Earnest (me)", fallback: "IE" }],
    startDate: null,
    dueDate: null,
    priority: "No priority",
    progress: null,
  },
  {
    id: "10",
    status: "Draft",
    statusColor: "bg-orange-300",
    name: "2025 Tax Preparation D...",
    type: "Document Checklist",
    assignees: [{ name: "Irie Earnest (me)", fallback: "IE" }],
    startDate: null,
    dueDate: null,
    priority: "No priority",
    progress: null,
  },
];

const TABS = [
  { name: "Home", icon: <LayoutGrid className="w-4 h-4" /> },
  { name: "Communication", icon: <MessageSquare className="w-4 h-4" /> },
  { name: "Notes", icon: <StickyNote className="w-4 h-4" /> },
  { name: "Files", icon: <Files className="w-4 h-4" /> },
  { name: "Tasks", icon: <ClipboardList className="w-4 h-4" />, active: true },
  { name: "Resolution", icon: <Zap className="w-4 h-4" /> },
  { name: "Organizers", icon: <FileText className="w-4 h-4" /> },
  { name: "Transcripts", icon: <History className="w-4 h-4" /> },
  { name: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  { name: "Time", icon: <Timer className="w-4 h-4" /> },
];

import { TaskForm } from "./TaskForm";

export const TaskListView = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [allTasks, setAllTasks] = useState(TASKS);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    // Merge dummy data with saved data, ensuring no duplicates if using IDs
    const merged = [...savedTasks, ...TASKS.filter(dt => !savedTasks.find((st: any) => st.id === dt.id))];
    setAllTasks(merged);
  }, [isTaskFormOpen]); // Refresh when form closes (potential new task)

  const filteredTasks = allTasks.filter(task => 
    task.name.toLowerCase().includes(search.toLowerCase()) ||
    task.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Nav Tabs */}
      <nav className="flex items-center gap-1 border-b px-6 h-12 overflow-x-auto no-scrollbar scroll-smooth bg-card group shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.name}
            className={cn(
              "flex items-center gap-2 px-4 h-full text-xs font-semibold whitespace-nowrap transition-all border-b-2",
              tab.active 
                ? "border-primary text-primary bg-primary/5" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </nav>

      <div className="flex-1 p-6 space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Active tasks ({TASKS.length})</h1>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              <span className="text-xs font-bold text-primary uppercase tracking-widest cursor-pointer hover:underline">Show subtasks</span>
              <Switch checked={showSubtasks} onCheckedChange={setShowSubtasks} className="scale-75" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-6 rounded-xl shadow-lg shadow-primary/20 group">
                  Create <ChevronDown className="w-4 h-4 ml-1 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl">
                <DropdownMenuItem 
                  className="gap-2 rounded-lg py-2.5 cursor-pointer"
                  onClick={() => setIsTaskFormOpen(true)}
                >
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-bold text-xs uppercase tracking-tight">Task</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 rounded-lg py-2.5">
                  <UserPlus className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-xs uppercase tracking-tight">Client request</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 rounded-lg py-2.5">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span className="font-bold text-xs uppercase tracking-tight">Questionnaire</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 rounded-lg py-2.5">
                  <ClipboardList className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-xs uppercase tracking-tight">Document checklist</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters/Search Row */}
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search tasks, types, or assignees..." 
            className="pl-9 h-9 rounded-xl bg-card border-none ring-1 ring-border/50 shadow-sm focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden">
          <div className="overflow-x-auto overflow-y-hidden">
            <Table>
              <TableHeader className="bg-muted/30 border-b border-border/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold uppercase text-[10px] tracking-[0.2em] py-4 pl-6 text-muted-foreground w-[150px]">Status</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-[0.2em] py-4 text-muted-foreground">Task name</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-[0.2em] py-4 text-muted-foreground">Task type</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-[0.2em] py-4 text-muted-foreground">Assignee(s)</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-[0.2em] py-4 text-muted-foreground">Start date</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-[0.2em] py-4 text-muted-foreground">Due date</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-[0.2em] py-4 pr-6 text-right text-muted-foreground"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} className="group transition-colors border-b border-border/50 hover:bg-muted/20">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("w-2 h-2 rounded-full", task.statusColor)} />
                        <span className="text-[11px] font-bold uppercase tracking-wide opacity-80">{task.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <span 
                          className="text-sm font-semibold text-primary hover:underline cursor-pointer transition-colors"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          {task.name}
                        </span>
                        {task.progress && (
                          <Badge variant="outline" className="bg-muted/50 border-muted text-[10px] font-bold h-5 px-1.5 rounded-md flex items-center gap-1 group-hover:bg-primary/10 transition-colors">
                            {task.progress}
                            <ChevronDown className="w-3 h-3 opacity-50" />
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-[13px] font-medium text-muted-foreground">{task.type}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex -space-x-1.5 overflow-hidden transition-transform group-hover:translate-x-1">
                        {task.assignees.map((assignee, idx) => (
                          <Avatar key={idx} className="inline-block h-6 w-6 border-2 border-background ring-1 ring-border/20">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-[10px] font-bold bg-muted/80">{assignee.fallback}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-[13px] font-medium text-muted-foreground/60">{task.startDate || "—"}</TableCell>
                    <TableCell className="py-4">
                      <span className={cn(
                        "text-[13px] font-medium",
                        task.dueDate?.includes("Overdue") ? "text-red-500 font-bold" : "text-muted-foreground"
                      )}>
                        {task.dueDate || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-4">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "h-7 rounded-full px-3 gap-2 border-border/50 font-bold text-[10px] uppercase shadow-sm group-hover:bg-card transition-all",
                            task.priority === "Medium" ? "text-orange-500" : "text-muted-foreground opacity-60"
                          )}
                        >
                          {task.priority === "Medium" ? (
                             <AlertCircle className="w-3 h-3" />
                          ) : (
                            <HelpCircle className="w-3 h-3" />
                          )}
                          {task.priority}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Task Counter Footer */}
        <div className="flex justify-between items-center px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 italic">
          <span>Viewing {filteredTasks.length} active tasks</span>
          <span className="flex items-center gap-2">
            Automated Refresh in 5s <Zap className="w-3 h-3 animate-pulse text-yellow-500" />
          </span>
        </div>
      </div>

      <TaskForm isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} />
    </div>
  );
};
