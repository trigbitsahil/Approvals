"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Search,
  Plus,
  AlertCircle,
  HelpCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Type,
  Link,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  UserPlus,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const STATUSES = [
  { label: "No status", color: "bg-gray-300" },
  { label: "Not started", color: "bg-gray-400" },
  { label: "Ready", color: "bg-emerald-400" },
  { label: "In progress", color: "bg-yellow-400" },
  { label: "On hold", color: "bg-orange-400" },
  { label: "Draft", color: "bg-stone-300" },
  { label: "Needs review", color: "bg-primary/80" },
  { label: "With client", color: "bg-purple-500" },
  { label: "Completed", color: "bg-green-500" },
  { label: "Extension", color: "bg-red-500" },
  { label: "Training Status", color: "bg-cyan-400" },
  { label: "Status Training", color: "bg-cyan-400" },
  { label: "Extended", color: "bg-lime-500" },
];

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState(STATUSES[0]);
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [isRecurring, setIsRecurring] = useState(false);
  const [items, setItems] = useState<any[]>([]); // To track subtasks and client requests

  const addSubtask = () => {
    setItems([...items, { id: Date.now(), type: 'subtask' }]);
  };

  const removeSubtask = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCreateAndManage = () => {
    if (!taskName.trim()) return;

    const newTask = {
      id: Date.now(),
      name: taskName,
      status: "No status",
      priority: "Medium",
      assignees: [
        { name: "CG", color: "bg-orange-500", img: "https://github.com/shadcn.png" }
      ],
      startDate: "Set today",
      dueDate: "Next week",
      progress: 0,
      subtasks: items.filter(i => i.type === 'subtask').map(i => ({
        id: i.id,
        name: "New Subtask",
        priority: "Low",
        status: "No status",
        dueDate: "No due date"
      }))
    };

    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    localStorage.setItem("tasks", JSON.stringify([...savedTasks, newTask]));

    // Reset and navigate
    onClose();
    navigate(`/tasks/${newTask.id}`);
  };

  const filteredStatuses = STATUSES.filter(s =>
    s.label.toLowerCase().includes(statusSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[20px] border-none shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Create Task</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 px-3 gap-2 rounded-full border-border/50 hover:bg-muted font-bold text-[11px] uppercase tracking-wider">
                  <div className={cn("w-2 h-2 rounded-full", selectedStatus.color)} />
                  {selectedStatus.label}
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px] p-2 rounded-xl shadow-xl">
                <div className="px-2 py-1.5 mb-2 relative">
                  <Search className="absolute left-4 top-3 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="find a status"
                    className="pl-8 h-8 text-xs bg-muted/50 border-none ring-1 ring-border/50 focus-visible:ring-primary rounded-lg"
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto pr-1">
                  {filteredStatuses.map((s) => (
                    <DropdownMenuItem
                      key={s.label}
                      className="gap-3 rounded-lg py-2 cursor-pointer"
                      onClick={() => setSelectedStatus(s)}
                    >
                      <div className={cn("w-2 h-2 rounded-full", s.color)} />
                      <span className="text-xs font-semibold">{s.label}</span>
                    </DropdownMenuItem>
                  ))}
                  <div className="h-px bg-border/50 my-2 mx-1" />
                  <DropdownMenuItem className="gap-3 rounded-lg py-2 cursor-pointer text-muted-foreground italic">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <span className="text-xs">Add custom status</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-card/50">

          {/* Main fields group */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-baseline sm:gap-4">
              <Label className="text-[13px] font-bold text-muted-foreground">Task name <span className="text-red-500">*</span></Label>
              <div className="space-y-1.5">
                <div className="relative group">
                  <Input
                    placeholder="Tax Prep {{clientname}} {{cur...}}"
                    className="h-10 rounded-xl pr-10 font-medium"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-primary">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">Type "{`{`}{`{`}" to add dynamic placeholder</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
              <Label className="text-[13px] font-bold text-muted-foreground">Client</Label>
              <Input placeholder="Albert Brennaman" className="h-10 rounded-xl font-medium" />
            </div>





            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
              <Label className="text-[13px] font-bold text-muted-foreground">Assignee(s)</Label>
              <div className="h-10 flex items-center px-4 rounded-xl border bg-muted/20 text-sm font-semibold cursor-pointer hover:bg-muted/40 transition-colors">
                3 selected
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
              <Label className="text-[13px] font-bold text-muted-foreground">Budgeted hours</Label>
              <Input type="number" defaultValue={0} className="h-10 max-w-[120px] rounded-xl font-bold" />
            </div>

            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
              <Label className="text-[13px] font-bold text-muted-foreground">Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger className="h-10 rounded-xl font-bold text-orange-500">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <SelectValue placeholder="Priority" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="high" className="text-red-500 font-bold">High</SelectItem>
                  <SelectItem value="medium" className="text-orange-500 font-bold">Medium</SelectItem>
                  <SelectItem value="low" className="text-blue-500 font-bold">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-start sm:gap-4">
              <Label className="text-[13px] font-bold text-muted-foreground py-2">Description</Label>
              <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                <div className="flex items-center gap-1 p-2 bg-muted/10 border-b">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Type className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 px-1 text-[10px] items-baseline font-bold">H<span className="text-[7px]">1</span></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 px-1 text-[10px] items-baseline font-bold">H<span className="text-[7px]">2</span></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 px-1 text-[10px] items-baseline font-bold">H<span className="text-[7px]">3</span></Button>
                  <div className="w-px h-4 bg-border/50 mx-1" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 font-serif font-bold"><Bold className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 font-serif italic"><Italic className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Underline className="w-4 h-4" /></Button>
                  <div className="w-px h-4 bg-border/50 mx-1" />
                  <Button variant="ghost" size="icon" className="h-8 w-8"><List className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><ListOrdered className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto"><Link className="w-4 h-4" /></Button>
                </div>
                <textarea
                  className="w-full h-32 p-4 text-sm bg-transparent outline-none resize-none font-medium text-muted-foreground/80"
                  placeholder="Add description"
                />
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-3">
            {/* Date Section */}
            <div className="p-5 rounded-2xl bg-muted/20 border border-border/50 group hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm font-bold tracking-tight">Date</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 pl-0 sm:pl-12">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Start date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-10 rounded-xl justify-start font-medium text-muted-foreground/50 border-border/30 italic hover:border-primary/30 transition-all">
                        {startDate ? startDate.toLocaleDateString() : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl shadow-2xl border-none overflow-hidden bg-card/80 backdrop-blur-xl">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-4"
                        classNames={{
                          nav: "flex items-center justify-between absolute inset-x-0 top-4 px-4 z-10",
                          button_previous: "hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                          button_next: "hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                          head_cell: "text-muted-foreground/60 font-bold text-[10px] uppercase tracking-tighter w-9",
                          cell: "p-0 text-center text-sm relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                          day: cn(
                            "h-9 w-9 p-0 font-bold aria-selected:opacity-100 rounded-xl transition-all duration-200"
                          ),
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-lg shadow-primary/20 scale-105",
                          day_today: "bg-primary/10 text-primary rounded-xl",
                          day_outside: "text-muted-foreground/30 opacity-50",
                          day_disabled: "text-muted-foreground opacity-20",
                          day_hidden: "invisible",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Due date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-10 rounded-xl justify-start font-medium text-muted-foreground/50 border-border/30 italic hover:border-primary/30 transition-all">
                        {dueDate ? dueDate.toLocaleDateString() : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl shadow-2xl border-none overflow-hidden bg-card/80 backdrop-blur-xl">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        className="p-4"
                        classNames={{
                          nav: "flex items-center justify-between absolute inset-x-0 top-4 px-4 z-10",
                          button_previous: "hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                          button_next: "hover:bg-primary/10 text-muted-foreground border-none ring-0 focus:ring-0",
                          head_cell: "text-muted-foreground/60 font-bold text-[10px] uppercase tracking-tighter w-9",
                          cell: "p-0 text-center text-sm relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                          day: cn(
                            "h-9 w-9 p-0 font-bold aria-selected:opacity-100 rounded-xl transition-all duration-200"
                          ),
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-lg shadow-primary/20 scale-105",
                          day_today: "bg-primary/10 text-primary rounded-xl",
                          day_outside: "text-muted-foreground/30 opacity-50",
                          day_disabled: "text-muted-foreground opacity-20",
                          day_hidden: "invisible",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button variant="link" className="text-primary font-bold p-0 ml-0 sm:ml-12 h-auto text-xs decoration-2 mt-4">Add a date</Button>
            </div>

            {/* Recurring Section */}
            <div className="p-4 rounded-xl bg-muted/10 border border-border/10 hover:bg-muted/20 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-foreground/80">Recurring</h3>
                <Switch
                  className="scale-75 data-[state=checked]:bg-green-500"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
              </div>

              {isRecurring && (
                <div className="pt-4 pb-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
                    <Label className="text-[12px] font-bold text-muted-foreground">Recreate on</Label>
                    <Select defaultValue="completion">
                      <SelectTrigger className="h-9 rounded-lg font-semibold text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="completion" className="text-xs font-semibold">Completion</SelectItem>
                        <SelectItem value="due_date" className="text-xs font-semibold">Due date schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
                    <Label className="text-[12px] font-bold text-muted-foreground">Recur</Label>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="daily">
                        <SelectTrigger className="h-9 w-[120px] rounded-lg font-semibold text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="daily" className="text-xs font-semibold">Daily</SelectItem>
                          <SelectItem value="weekly" className="text-xs font-semibold">Weekly</SelectItem>
                          <SelectItem value="monthly" className="text-xs font-semibold">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-xs font-medium text-muted-foreground">every</span>
                      <Input type="number" defaultValue={1} className="h-9 w-[60px] rounded-lg font-bold text-center text-xs" />
                      <span className="text-xs font-medium text-muted-foreground">day(s)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other toggles */}
            {[
              { label: "Tax preparation fields", link: null },
              { label: "Reminder", link: "Add reminder" },
              { label: "File", link: "Add file" },
              { label: "Automation", link: "Add automation" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/10 hover:bg-muted/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-bold text-foreground/80">{item.label}</h3>
                  {item.link && (
                    <Button variant="link" className="text-primary font-bold p-0 h-auto text-xs">
                      {item.link}
                    </Button>
                  )}
                </div>
                <Switch className="scale-75" />
              </div>
            ))}

            {/* Dynamic Items (Subtasks/Client Requests) */}
            {items.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl border-2 border-border/50 bg-card/80 shadow-sm animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold tracking-tight">Subtask</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    onClick={() => removeSubtask(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-baseline sm:gap-4">
                    <Label className="text-[13px] font-bold text-muted-foreground">Subtask name <span className="text-primary">*</span></Label>
                    <Input placeholder="Add name" className="h-10 rounded-xl font-medium focus-visible:ring-primary shadow-sm" />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
                    <Label className="text-[13px] font-bold text-muted-foreground">Priority</Label>
                    <Select defaultValue="no_priority">
                      <SelectTrigger className="h-10 rounded-xl font-semibold text-muted-foreground italic">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" />
                          <SelectValue placeholder="No priority" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no_priority">No priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
                    <Label className="text-[13px] font-bold text-muted-foreground">Assignee(s)</Label>
                    <Select>
                      <SelectTrigger className="h-10 rounded-xl text-muted-foreground font-medium italic">
                        <SelectValue placeholder="Select assignee(s)" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="user1">User A</SelectItem>
                        <SelectItem value="user2">User B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-center sm:gap-4">
                    <Label className="text-[13px] font-bold text-muted-foreground">Budgeted hours</Label>
                    <Input type="number" defaultValue={0} className="h-10 max-w-[120px] rounded-xl font-bold" />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[140px,1fr] sm:items-start sm:gap-4">
                    <Label className="text-[13px] font-bold text-muted-foreground text-right py-2">Description</Label>
                    <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                      <div className="flex items-center gap-1 p-2 bg-muted/10 border-b">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Type className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 px-1 text-[10px] items-baseline font-bold font-sans">H<span className="text-[7px]">1</span></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 px-1 text-[10px] items-baseline font-bold font-sans">H<span className="text-[7px]">2</span></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 px-1 text-[10px] items-baseline font-bold font-sans">H<span className="text-[7px]">3</span></Button>
                        <div className="w-px h-4 bg-border/50 mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8 font-serif font-bold"><Bold className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 font-serif italic"><Italic className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Underline className="w-4 h-4" /></Button>
                        <div className="w-px h-4 bg-border/50 mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8"><List className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ListOrdered className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto"><Link className="w-4 h-4" /></Button>
                      </div>
                      <textarea
                        className="w-full h-32 p-4 text-sm bg-transparent outline-none resize-none font-medium text-muted-foreground/80"
                        placeholder="Add description"
                      />
                    </div>
                  </div>

                  {/* Subtask Date Section */}
                  <div className="mt-4 p-5 rounded-2xl bg-muted/20 border border-border/50">
                    <h3 className="text-sm font-bold tracking-tight mb-4">Date</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 pl-0 sm:pl-12">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Start date</Label>
                        <Button variant="outline" className="w-full h-10 rounded-xl justify-start font-medium text-muted-foreground/50 border-border/30 italic">Select a date</Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Due date</Label>
                        <Button variant="outline" className="w-full h-10 rounded-xl justify-start font-medium text-muted-foreground/50 border-border/30 italic">Select a date</Button>
                      </div>
                    </div>
                    <Button variant="link" className="text-primary font-bold p-0 ml-0 sm:ml-12 h-auto text-xs decoration-2 mt-4">Add a date</Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Action Buttons Icons Row */}
            <div className="flex items-center gap-4 pt-4 px-2">
              <Button variant="ghost" className="h-10 px-4 gap-3 text-primary hover:text-primary hover:bg-primary/5 rounded-xl group transition-all">
                <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-sm font-bold tracking-tight">Add a client request</span>
              </Button>
              <Button
                variant="ghost"
                className="h-10 px-4 gap-3 text-primary hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/20 bg-muted/5 group transition-all"
                onClick={addSubtask}
              >
                <div className="p-1 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold tracking-tight">Add a subtask</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t bg-card flex items-center gap-4">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/20"
            onClick={handleCreateAndManage}
          >
            Create and manage
          </Button>
          <Button variant="ghost" className="text-primary hover:text-primary/90 hover:bg-primary/10 font-bold h-11 px-6 rounded-xl">
            Create and close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
