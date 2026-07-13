"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Receipt,
  BookOpen,
  Target,
  Activity,
  DollarSign,
  RefreshCw,
  ExternalLink,
  Layers,
  Users,
  FileText,
  Contact,
  ClipboardList,
  Circle,
  Flag,
  FileImage,
  Link2,
  File,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Services
import { ProjectService } from "@/api/services/ProjectService";
import { IncomeTransactionService } from "@/api/services/IncomeTransactionService";
import { ExpenseTransactionService } from "@/api/services/ExpenseTransactionService";
import { BudgetService } from "@/api/services/BudgetService";
import { TaskService } from "@/api/services/TaskService";
import { TaskStatusService } from "@/api/services/TaskStatusService";
import { UserIntermediateService } from "@/api/services/UserIntermediateService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { ContactService } from "@/api/services/ContactService";

// Types
import type { ProjectDetailVM } from "@/api/models/ProjectDetailVM";
import type { BudgetListVM } from "@/api/models/BudgetListVM";
import type { TaskListVM } from "@/api/models/TaskListVM";
import type { TaskStatusListVM } from "@/api/models/TaskStatusListVM";

interface Transaction {
  id: string;
  date: string;
  name: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  typeName?: string;
  isCleared?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d?: string | null) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const diffDays = (a?: string | null, b?: string | null) => {
  if (!a || !b) return null;
  return Math.ceil(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
  );
};

const progressPercent = (start?: string | null, end?: string | null) => {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
};

const statusColor = (status?: string | null) => {
  const s = (status || "").toLowerCase();
  if (s.includes("active") || s.includes("progress")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (s.includes("complete") || s.includes("done")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (s.includes("hold") || s.includes("pause")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (s.includes("cancel")) return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-purple-500/20 text-purple-400 border-purple-500/30";
};

// Derive a display color for task statuses based on name/colorOrIcon
const taskStatusAccent = (name?: string | null, colorOrIcon?: string | null): string => {
  if (colorOrIcon && colorOrIcon.startsWith("#")) return "";
  const n = (name || "").toLowerCase();
  if (n.includes("done") || n.includes("complete")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (n.includes("progress") || n.includes("doing") || n.includes("active")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (n.includes("review") || n.includes("pending")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (n.includes("block") || n.includes("hold") || n.includes("cancel")) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (n.includes("todo") || n.includes("backlog") || n.includes("open") || n.includes("new")) return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  return "bg-purple-500/20 text-purple-400 border-purple-500/30";
};

const getDocIcon = (ext?: string | null) => {
  const e = (ext || "").toLowerCase().replace(".", "");
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(e)) return FileImage;
  if (["pdf"].includes(e)) return FileText;
  if (["doc", "docx", "txt", "rtf"].includes(e)) return FileText;
  if (e === "" || e === "url" || e === "link") return Link2;
  return File;
};

const getDocTypeColor = (ext?: string | null) => {
  const e = (ext || "").toLowerCase().replace(".", "");
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(e)) return "bg-pink-500/20 text-pink-400";
  if (e === "pdf") return "bg-red-500/20 text-red-400";
  if (["doc", "docx"].includes(e)) return "bg-blue-500/20 text-blue-400";
  if (e === "" || e === "url") return "bg-sky-500/20 text-sky-400";
  return "bg-slate-500/20 text-slate-400";
};

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, accent, trend, loading,
}: {
  label: string; value: string; sub?: string; icon: React.ElementType;
  accent: string; trend?: "up" | "down" | "neutral"; loading?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-6 flex flex-col gap-3 group hover:border-white/15 transition-all duration-500 hover:shadow-xl hover:shadow-black/20">
      <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-500 ${accent}`} />
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-2xl ${accent} bg-opacity-15 border border-white/10`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {trend === "up" && <span className="text-emerald-400 text-xs font-bold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> up</span>}
        {trend === "down" && <span className="text-rose-400 text-xs font-bold flex items-center gap-0.5"><TrendingDown className="h-3 w-3" /> down</span>}
      </div>
      <div>
        {loading ? (
          <><Skeleton className="h-8 w-32 mb-1 rounded-xl bg-white/5" /><Skeleton className="h-3 w-20 rounded-xl bg-white/5" /></>
        ) : (
          <><p className="text-2xl font-black tracking-tight text-foreground">{value}</p>{sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}</>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
    </div>
  );
}

// ── Mini Bar ─────────────────────────────────────────────────────────────────

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

// ── Recent Transactions Row ───────────────────────────────────────────────────

function TxRow({ tx }: { tx: Transaction }) {
  const isIncome = tx.type === "income";
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/3 px-2 rounded-xl transition-colors">
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${isIncome ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
        {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{tx.name || "—"}</p>
        <p className="text-[10px] text-muted-foreground truncate">{fmtDate(tx.date)} · {tx.typeName}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-xs font-bold ${isIncome ? "text-emerald-400" : "text-rose-400"}`}>
          {isIncome ? "+" : "-"}{fmt(tx.amount)}
        </p>
        {tx.isCleared !== undefined && (
          <p className={`text-[9px] ${tx.isCleared ? "text-emerald-500" : "text-amber-500"}`}>
            {tx.isCleared ? "Cleared" : "Pending"}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Quick Link Card ───────────────────────────────────────────────────────────

function QuickLink({ label, description, icon: Icon, color, onClick }: {
  label: string; description: string; icon: React.ElementType; color: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="group flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-card/40 hover:bg-card/80 hover:border-white/20 transition-all duration-300 text-left w-full hover:shadow-lg hover:shadow-black/15">
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-20 border border-white/10 flex-shrink-0`}><Icon className="h-4 w-4 text-white" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground truncate">{description}</p>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
    </button>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, iconColor, action, children, loading, emptyIcon: EmptyIcon, emptyText }: {
  title: string; icon: React.ElementType; iconColor: string;
  action?: { label: string; onClick: () => void };
  children?: React.ReactNode; loading?: boolean;
  emptyIcon?: React.ElementType; emptyText?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
        </h2>
        {action && (
          <button onClick={action.onClick} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
            {action.label} <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
          </button>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl bg-white/5" />)}
        </div>
      ) : children}
    </div>
  );
}

// ── Stat Pill (for counts per status) ─────────────────────────────────────────

function StatPill({ label, count, accent }: { label: string; count: number; accent: string }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-2xl border ${accent} bg-opacity-10`}>
      <span className="text-[11px] font-semibold truncate pr-2">{label}</span>
      <span className="text-sm font-black flex-shrink-0">{count}</span>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function ProjectDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectDetailVM | null>(null);
  const [incomeList, setIncomeList] = useState<Transaction[]>([]);
  const [expenseList, setExpenseList] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetListVM[]>([]);

  // New state
  const [tasks, setTasks] = useState<TaskListVM[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<TaskStatusListVM[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!projectId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [
        projRes, incRes, expRes, budRes,
        taskRes, statusRes, memberRes, docRes, contactRes
      ] = await Promise.all([
        ProjectService.getProjectById(projectId, "1").catch(() => null),
        IncomeTransactionService.getApiVIncomeTransaction2("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
        ExpenseTransactionService.getApiVExpenseTransaction2("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
        BudgetService.getApiVBudget("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
        TaskService.taskGet("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
        TaskStatusService.getApiVTaskStatus("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
        UserIntermediateService.getApiVUserIntermediate("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
        DocumentsService.getApiVDocuments("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
        ContactService.getApiVContact("1", "Project", projectId).catch(() => ({ success: false, data: [] })),
      ]);

      if (projRes?.success && projRes.data) setProject(projRes.data);

      const incomeTx: Transaction[] = ((incRes as any).data || []).map((t: any) => ({
        id: t.incomeTransactionID || t.incomeTransactionId || "",
        date: t.dateOfIncome || t.createdDate || "",
        name: t.name || "",
        description: t.description || "",
        amount: Number(t.incomeAmount || 0),
        type: "income" as const,
        typeName: t.incomeTypeName || "Income",
        isCleared: t.isCleared,
      }));
      const expenseTx: Transaction[] = ((expRes as any).data || []).map((t: any) => ({
        id: t.expenseTransactionID || t.expenseTransactionId || "",
        date: t.dateOfExpense || t.createdDate || "",
        name: t.name || "",
        description: t.description || "",
        amount: Number(t.expenseAmount || 0),
        type: "expense" as const,
        typeName: t.expenseTypeName || "Expense",
        isCleared: t.isCleared,
      }));

      setIncomeList(incomeTx);
      setExpenseList(expenseTx);
      if ((budRes as any)?.data) setBudgets((budRes as any).data);
      if ((taskRes as any)?.data) setTasks((taskRes as any).data);
      if ((statusRes as any)?.data) setTaskStatuses((statusRes as any).data);
      if ((memberRes as any)?.data) setMembers((memberRes as any).data);
      if ((docRes as any)?.data) setDocuments((docRes as any).data);
      if ((contactRes as any)?.data) setContacts((contactRes as any).data);
    } catch {
      toast.error("Failed to load project data");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20">
          <BarChart3 className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-foreground">No Project Selected</h2>
        <p className="text-muted-foreground text-sm max-w-xs text-center">Select a project from the sidebar to view its dashboard.</p>
        <Button onClick={() => navigate("/Kanban")} variant="outline" className="rounded-2xl">Browse Projects</Button>
      </div>
    );
  }

  // ── Derived metrics ─────────────────────────────────────────────────────────

  const totalIncome = incomeList.reduce((s, t) => s + t.amount, 0);
  const totalExpense = expenseList.reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const totalBudget = budgets.reduce((s, b) => s + (b.amount || 0), 0);
  const totalBudgetSpent = budgets.reduce((s, b) => s + (b.expenseTransactionTotalPaid || 0), 0);
  const budgetPct = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;
  const clearedIncome = incomeList.filter(t => t.isCleared).reduce((s, t) => s + t.amount, 0);
  const pendingIncome = totalIncome - clearedIncome;
  const clearedExpense = expenseList.filter(t => t.isCleared).reduce((s, t) => s + t.amount, 0);
  const timelinePct = progressPercent(project?.startDate, project?.endDate);
  const daysLeft = diffDays(new Date().toISOString(), project?.endDate);
  const totalDays = diffDays(project?.startDate, project?.endDate);

  // Task by status grouping
  const tasksByStatus = taskStatuses.map(s => ({
    status: s,
    count: tasks.filter(t => t.status === s.taskStatusId).length,
  }));

  // Tasks without a known status
  const knownStatusIds = new Set(taskStatuses.map(s => s.taskStatusId));
  const unknownStatusCount = tasks.filter(t => !t.status || !knownStatusIds.has(t.status)).length;

  // Task priority breakdown
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !["done","complete","completed"].some(k => (t.status || "").toLowerCase().includes(k))).length;

  // Members
  const activeMembers = members.filter(m => m.isActive !== false && !m.isVoided).length;
  const inactiveMembers = members.length - activeMembers;

  // Documents by type
  const docByExt = documents.reduce((acc: Record<string, number>, d: any) => {
    const ext = ((d.extension || d.documentType || "other") as string).toLowerCase().replace(".", "");
    acc[ext] = (acc[ext] || 0) + 1;
    return acc;
  }, {});
  const docGroups = Object.entries(docByExt).sort((a, b) => b[1] - a[1]);

  // Contacts
  const activeContacts = contacts.filter((c: any) => c.isActive !== false).length;
  const defaultContacts = contacts.filter((c: any) => c.isDefault).length;

  // Monthly sparkline
  const buildMonthly = (list: Transaction[]) => {
    const months: number[] = Array(6).fill(0);
    const now = new Date();
    list.forEach(t => {
      const d = new Date(t.date);
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diff >= 0 && diff < 6) months[5 - diff] += t.amount;
    });
    return months;
  };
  const incomeMonthly = buildMonthly(incomeList);
  const expenseMonthly = buildMonthly(expenseList);

  const recentIncome = [...incomeList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const recentExpense = [...expenseList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const nav = (path: string) => navigate(`${path}?projectId=${projectId}`);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20">
            <BarChart3 className="h-7 w-7 text-primary" />
          </div>
          <div>
            {loading ? (
              <><Skeleton className="h-7 w-48 rounded-xl bg-white/5 mb-1" /><Skeleton className="h-4 w-32 rounded-xl bg-white/5" /></>
            ) : (
              <>
                <h1 className="text-2xl font-black tracking-tight text-foreground">{project?.name || "Project Dashboard"}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Activity className="h-3 w-3" />
                  {project?.description || "Project overview and financial summary"}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!loading && project?.statusName && (
            <Badge className={`rounded-2xl border px-3 py-1 text-xs font-bold ${statusColor(project.statusName)}`}>{project.statusName}</Badge>
          )}
          <Button variant="outline" size="sm" onClick={load} className="rounded-2xl gap-2 border-white/10 hover:border-white/20">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Income" value={fmt(totalIncome)} sub={`${incomeList.length} transactions`} icon={TrendingUp} accent="bg-emerald-500" trend="up" loading={loading} />
        <KpiCard label="Total Expenses" value={fmt(totalExpense)} sub={`${expenseList.length} transactions`} icon={TrendingDown} accent="bg-rose-500" trend="down" loading={loading} />
        <KpiCard label="Net Balance" value={fmt(netBalance)} sub={netBalance >= 0 ? "Surplus" : "Deficit"} icon={Scale} accent={netBalance >= 0 ? "bg-sky-500" : "bg-orange-500"} trend={netBalance >= 0 ? "up" : "down"} loading={loading} />
        <KpiCard label="Budget Allocated" value={fmt(totalBudget)} sub={`${Math.round(budgetPct)}% utilized`} icon={Wallet} accent="bg-violet-500" loading={loading} />
      </div>

      {/* ── Activity Overview Row ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Tasks", value: tasks.length, sub: `${overdueTasks} overdue`, icon: ClipboardList, color: "bg-blue-500/20 text-blue-400 border-blue-500/30", glow: "bg-blue-500" },
          { label: "Members", value: members.length, sub: `${activeMembers} active`, icon: Users, color: "bg-teal-500/20 text-teal-400 border-teal-500/30", glow: "bg-teal-500" },
          { label: "Documents", value: documents.length, sub: `${docGroups.length} types`, icon: FileText, color: "bg-amber-500/20 text-amber-400 border-amber-500/30", glow: "bg-amber-500" },
          { label: "Contacts", value: contacts.length, sub: `${activeContacts} active`, icon: Contact, color: "bg-pink-500/20 text-pink-400 border-pink-500/30", glow: "bg-pink-500" },
        ].map(({ label, value, sub, icon: Icon, color, glow }) => (
          <div key={label} className={`relative overflow-hidden rounded-[2rem] border ${color} bg-card/50 backdrop-blur-xl p-5 flex flex-col gap-2 group hover:border-opacity-60 transition-all duration-300`}>
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity ${glow}`} />
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl ${color}`}><Icon className="h-4 w-4" /></div>
              {loading ? <Skeleton className="h-6 w-10 rounded-lg bg-white/5" /> : (
                <span className="text-2xl font-black text-foreground">{value}</span>
              )}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</p>
              {loading ? <Skeleton className="h-3 w-16 rounded-lg bg-white/5 mt-1" /> : (
                <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left col (2/3) ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Project timeline */}
          <div className="rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Project Timeline
              </h2>
              {!loading && daysLeft !== null && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${daysLeft < 0 ? "bg-red-500/10 border-red-500/20 text-red-400" : daysLeft < 14 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                  {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d remaining`}
                </span>
              )}
            </div>
            {loading ? (
              <div className="space-y-3"><Skeleton className="h-4 w-full rounded-xl bg-white/5" /><Skeleton className="h-2 w-full rounded-xl bg-white/5" /><Skeleton className="h-4 w-48 rounded-xl bg-white/5" /></div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Start: {fmtDate(project?.startDate)}</span>
                  <span className="font-bold text-foreground">{timelinePct}%</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />End: {fmtDate(project?.endDate)}</span>
                </div>
                <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000" style={{ width: `${timelinePct}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { label: "Duration", val: totalDays != null ? `${totalDays} days` : "—", icon: Calendar },
                    { label: "Elapsed", val: totalDays != null ? `${Math.round(timelinePct / 100 * (totalDays || 0))} days` : "—", icon: Clock },
                    { label: "Status", val: project?.statusName || "—", icon: Activity },
                  ].map(({ label, val, icon: Ic }) => (
                    <div key={label} className="bg-white/3 rounded-2xl p-3 border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1 mb-1"><Ic className="h-3 w-3" />{label}</p>
                      <p className="text-sm font-bold text-foreground">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Tasks by Status ── */}
          <SectionCard
            title="Tasks by Status"
            icon={ClipboardList}
            iconColor="text-blue-400"
            action={{ label: "View board", onClick: () => nav("/Kanban") }}
            loading={loading}
          >
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                <ClipboardList className="h-7 w-7 opacity-30" />
                <p className="text-xs">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Status breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tasksByStatus.map(({ status, count }) => (
                    <div
                      key={status.taskStatusId}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-2xl border ${taskStatusAccent(status.name, status.colorOrIcon)}`}
                      style={status.colorOrIcon?.startsWith("#") ? { borderColor: `${status.colorOrIcon}40`, background: `${status.colorOrIcon}15`, color: status.colorOrIcon } : {}}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Circle className="h-2 w-2 flex-shrink-0 fill-current" />
                        <span className="text-[11px] font-semibold truncate">{status.name}</span>
                      </div>
                      <span className="text-sm font-black ml-2 flex-shrink-0">{count}</span>
                    </div>
                  ))}
                  {unknownStatusCount > 0 && (
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl border bg-slate-500/10 text-slate-400 border-slate-500/30">
                      <span className="text-[11px] font-semibold">No Status</span>
                      <span className="text-sm font-black">{unknownStatusCount}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar per status */}
                <div className="space-y-2 pt-1">
                  {tasksByStatus.filter(s => s.count > 0).map(({ status, count }) => (
                    <div key={status.taskStatusId} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">{status.name}</span>
                        <span className="text-foreground font-bold">{Math.round((count / tasks.length) * 100)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 bg-blue-500"
                          style={{
                            width: `${(count / tasks.length) * 100}%`,
                            background: status.colorOrIcon?.startsWith("#") ? status.colorOrIcon : undefined,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-lg font-black text-foreground">{tasks.length}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-amber-400">{overdueTasks}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Overdue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-blue-400">{taskStatuses.length}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Statuses</p>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Income vs Expense chart bars */}
          <div className="rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> 6-Month Overview
              </h2>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Income</span>
                <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-sm bg-rose-500 inline-block" />Expense</span>
              </div>
            </div>
            {loading ? (
              <div className="flex items-end gap-2 h-20">{[60,80,45,90,70,55].map((h,i) => <Skeleton key={i} className="flex-1 rounded-t-xl bg-white/5" style={{ height: h }} />)}</div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-1">
                  {incomeMonthly.map((inc, i) => {
                    const exp = expenseMonthly[i];
                    const maxVal = Math.max(...incomeMonthly, ...expenseMonthly, 1);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="flex items-end gap-0.5 h-20 w-full">
                          <div className="flex-1 bg-emerald-500/60 rounded-t-sm" style={{ height: `${(inc / maxVal) * 100}%`, minHeight: inc > 0 ? 4 : 0 }} />
                          <div className="flex-1 bg-rose-500/60 rounded-t-sm" style={{ height: `${(exp / maxVal) * 100}%`, minHeight: exp > 0 ? 4 : 0 }} />
                        </div>
                        <p className="text-[9px] text-muted-foreground/60">
                          {new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleString("en", { month: "short" })}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  <div className="text-center"><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Cleared Income</p><p className="text-sm font-bold text-emerald-400">{fmt(clearedIncome)}</p></div>
                  <div className="text-center"><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Pending Income</p><p className="text-sm font-bold text-amber-400">{fmt(pendingIncome)}</p></div>
                  <div className="text-center"><p className="text-[10px] text-muted-foreground uppercase tracking-widest">Paid Expenses</p><p className="text-sm font-bold text-rose-400">{fmt(clearedExpense)}</p></div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><ArrowUpRight className="h-3.5 w-3.5" /> Recent Income</h3>
                <button onClick={() => nav("/IncomeTransaction")} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">View all <ExternalLink className="h-2.5 w-2.5" /></button>
              </div>
              {loading ? <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl bg-white/5" />)}</div>
                : recentIncome.length === 0 ? <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground"><DollarSign className="h-6 w-6 opacity-30" /><p className="text-xs">No income recorded</p></div>
                : recentIncome.map(tx => <TxRow key={tx.id} tx={tx} />)
              }
            </div>
            <div className="rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-rose-400 flex items-center gap-1.5"><ArrowDownRight className="h-3.5 w-3.5" /> Recent Expenses</h3>
                <button onClick={() => nav("/ExpenseTransaction")} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">View all <ExternalLink className="h-2.5 w-2.5" /></button>
              </div>
              {loading ? <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl bg-white/5" />)}</div>
                : recentExpense.length === 0 ? <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground"><Receipt className="h-6 w-6 opacity-30" /><p className="text-xs">No expenses recorded</p></div>
                : recentExpense.map(tx => <TxRow key={tx.id} tx={tx} />)
              }
            </div>
          </div>

          {/* ── Members & Contacts row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Members */}
            <SectionCard title="Team Members" icon={Users} iconColor="text-teal-400"
              action={{ label: "Manage", onClick: () => nav("/users") }} loading={loading}>
              {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                  <Users className="h-6 w-6 opacity-30" /><p className="text-xs">No members assigned</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                      <UserCheck className="h-5 w-5 text-teal-400 mb-1" />
                      <p className="text-2xl font-black text-teal-400">{activeMembers}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Active</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20">
                      <UserX className="h-5 w-5 text-slate-400 mb-1" />
                      <p className="text-2xl font-black text-slate-400">{inactiveMembers}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Inactive</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <MiniBar pct={(activeMembers / members.length) * 100} color="bg-teal-500" />
                    <p className="text-[10px] text-muted-foreground text-right">{Math.round((activeMembers / members.length) * 100)}% active</p>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {members.slice(0, 6).map((m, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-[9px] font-black flex-shrink-0">
                          {(m.userEmail || "?").charAt(0).toUpperCase()}
                        </div>
                        <p className="text-[11px] text-foreground truncate">{m.userEmail || "Unknown"}</p>
                        <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${m.isActive !== false ? "bg-teal-500/15 text-teal-400" : "bg-slate-500/15 text-slate-400"}`}>
                          {m.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))}
                    {members.length > 6 && <p className="text-[10px] text-muted-foreground text-center pt-1">+{members.length - 6} more</p>}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Contacts */}
            <SectionCard title="Contacts" icon={Contact} iconColor="text-pink-400"
              action={{ label: "View all", onClick: () => nav("/contacts") }} loading={loading}>
              {contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                  <Contact className="h-6 w-6 opacity-30" /><p className="text-xs">No contacts linked</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Total", val: contacts.length, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
                      { label: "Active", val: activeContacts, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
                      { label: "Default", val: defaultContacts, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className={`flex flex-col items-center p-3 rounded-2xl border ${color}`}>
                        <p className="text-xl font-black">{val}</p>
                        <p className="text-[9px] uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {contacts.slice(0, 6).map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                        <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[9px] font-black flex-shrink-0">
                          {(c.firstName || c.lastName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-foreground truncate">{[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}</p>
                          {c.title && <p className="text-[9px] text-muted-foreground truncate">{c.title}</p>}
                        </div>
                        {c.isDefault && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 flex-shrink-0">Default</span>}
                      </div>
                    ))}
                    {contacts.length > 6 && <p className="text-[10px] text-muted-foreground text-center pt-1">+{contacts.length - 6} more</p>}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>

        {/* ── Right col (1/3) ── */}
        <div className="flex flex-col gap-5">

          {/* Documents breakdown */}
          <SectionCard title="Documents" icon={FileText} iconColor="text-amber-400"
            action={{ label: "View all", onClick: () => nav("/documents") }} loading={loading}>
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                <FileText className="h-6 w-6 opacity-30" /><p className="text-xs">No documents uploaded</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <FileText className="h-6 w-6 text-amber-400" />
                  <div>
                    <p className="text-2xl font-black text-amber-400">{documents.length}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Total Files</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {docGroups.map(([ext, count]) => {
                    const Icon = getDocIcon(ext);
                    const colorClass = getDocTypeColor(ext);
                    const pct = Math.round((count / documents.length) * 100);
                    const label = ext === "" || ext === "url" ? "Link / URL" : ext.toUpperCase();
                    return (
                      <div key={ext} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-lg ${colorClass}`}><Icon className="h-3 w-3" /></div>
                          <span className="text-[11px] text-foreground font-medium flex-1 truncate">{label}</span>
                          <span className="text-[11px] font-black text-foreground">{count}</span>
                          <span className="text-[9px] text-muted-foreground w-7 text-right">{pct}%</span>
                        </div>
                        <MiniBar pct={pct} color={colorClass.includes("pink") ? "bg-pink-500" : colorClass.includes("red") ? "bg-red-500" : colorClass.includes("blue") ? "bg-blue-500" : colorClass.includes("sky") ? "bg-sky-500" : "bg-slate-500"} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Budget breakdown */}
          <div className="rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-violet-400" /> Budgets
              </h2>
              <button onClick={() => nav("/Budget")} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
                Manage <ExternalLink className="h-2.5 w-2.5" />
              </button>
            </div>
            {loading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl bg-white/5" />)}</div>
              : budgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                  <Layers className="h-6 w-6 opacity-30" /><p className="text-xs">No budgets configured</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {budgets.slice(0, 5).map(b => {
                    const spent = b.expenseTransactionTotalPaid || 0;
                    const alloc = b.amount || 0;
                    const pct = alloc > 0 ? (spent / alloc) * 100 : 0;
                    const isOver = pct > 100;
                    return (
                      <div key={b.budgetId!} className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <p className="text-[11px] font-semibold text-foreground truncate pr-2">{b.name}</p>
                          <p className={`text-[10px] font-bold flex-shrink-0 ${isOver ? "text-red-400" : pct > 80 ? "text-amber-400" : "text-emerald-400"}`}>{Math.round(pct)}%</p>
                        </div>
                        <MiniBar pct={pct} color={isOver ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-violet-500"} />
                        <div className="flex justify-between text-[9px] text-muted-foreground">
                          <span>Spent: {fmt(spent)}</span><span>Budget: {fmt(alloc)}</span>
                        </div>
                      </div>
                    );
                  })}
                  {budgets.length > 5 && <p className="text-[10px] text-muted-foreground text-center pt-1">+{budgets.length - 5} more budgets</p>}
                  <div className="pt-3 mt-3 border-t border-white/5 space-y-1">
                    {[
                      { label: "Total Allocated", val: fmt(totalBudget), color: "text-foreground" },
                      { label: "Total Spent", val: fmt(totalBudgetSpent), color: budgetPct > 100 ? "text-red-400" : "text-violet-400" },
                      { label: "Remaining", val: fmt(totalBudget - totalBudgetSpent), color: totalBudget - totalBudgetSpent < 0 ? "text-red-400" : "text-emerald-400" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">{label}</span><span className={`font-bold ${color}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Financial summary */}
          <div className="rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-4">
              <DollarSign className="h-3.5 w-3.5 text-sky-400" /> Financial Summary
            </h2>
            {loading ? <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-8 w-full rounded-xl bg-white/5" />)}</div>
              : (
                <div className="space-y-2">
                  {[
                    { label: "Gross Income", val: fmt(totalIncome), color: "text-emerald-400" },
                    { label: "Cleared Income", val: fmt(clearedIncome), color: "text-emerald-300" },
                    { label: "Pending Income", val: fmt(pendingIncome), color: "text-amber-400" },
                    { label: "Total Expenses", val: fmt(totalExpense), color: "text-rose-400" },
                    { label: "Paid Expenses", val: fmt(clearedExpense), color: "text-rose-300" },
                    { label: "Net Balance", val: fmt(netBalance), color: netBalance >= 0 ? "text-sky-400" : "text-orange-400", bold: true },
                  ].map(({ label, val, color, bold }) => (
                    <div key={label} className={`flex justify-between items-center py-1.5 border-b border-white/4 last:border-0 ${bold ? "pt-2 mt-1 border-t border-white/10" : ""}`}>
                      <span className={`text-[10px] ${bold ? "font-black uppercase tracking-wider text-foreground" : "text-muted-foreground"}`}>{label}</span>
                      <span className={`text-xs font-bold ${color}`}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Quick navigation */}
          <div className="rounded-[2rem] border border-white/8 bg-card/50 backdrop-blur-xl p-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <QuickLink label="Task Board" description="Kanban & task management" icon={Layers} color="bg-blue-500" onClick={() => nav("/Kanban")} />
              <QuickLink label="Income Transactions" description="Record & view income" icon={ArrowUpRight} color="bg-emerald-500" onClick={() => nav("/IncomeTransaction")} />
              <QuickLink label="Expense Transactions" description="Record & view expenses" icon={ArrowDownRight} color="bg-rose-500" onClick={() => nav("/ExpenseTransaction")} />
              <QuickLink label="Ledger" description="Full financial ledger" icon={BookOpen} color="bg-sky-500" onClick={() => nav("/Ledger")} />
              <QuickLink label="Budgets" description="Budget allocation & tracking" icon={Target} color="bg-violet-500" onClick={() => nav("/Budget")} />
              <QuickLink label="Documents" description="Project files & links" icon={FileText} color="bg-amber-500" onClick={() => nav("/documents")} />
              <QuickLink label="Contacts" description="Project contacts" icon={Contact} color="bg-pink-500" onClick={() => nav("/contacts")} />
            </div>
          </div>

          {/* Alert summary */}
          {!loading && (budgetPct > 90 || (daysLeft !== null && daysLeft < 7) || overdueTasks > 0) && (
            <div className="rounded-[2rem] border border-amber-500/25 bg-amber-500/8 backdrop-blur-xl p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-3">
                <AlertCircle className="h-3.5 w-3.5" /> Alerts
              </h2>
              <div className="space-y-2">
                {budgetPct > 90 && <div className="flex items-start gap-2 text-xs text-amber-300"><span className="mt-0.5 flex-shrink-0">⚠</span><span>Budget is {Math.round(budgetPct)}% utilized — approaching limit</span></div>}
                {daysLeft !== null && daysLeft >= 0 && daysLeft < 7 && <div className="flex items-start gap-2 text-xs text-amber-300"><span className="mt-0.5 flex-shrink-0">⏰</span><span>Project deadline in {daysLeft} day{daysLeft !== 1 ? "s" : ""}</span></div>}
                {daysLeft !== null && daysLeft < 0 && <div className="flex items-start gap-2 text-xs text-red-400"><span className="mt-0.5 flex-shrink-0">🔴</span><span>Project is {Math.abs(daysLeft)} day{Math.abs(daysLeft) !== 1 ? "s" : ""} overdue</span></div>}
                {overdueTasks > 0 && <div className="flex items-start gap-2 text-xs text-amber-300"><span className="mt-0.5 flex-shrink-0">📋</span><span>{overdueTasks} task{overdueTasks !== 1 ? "s are" : " is"} past due date</span></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
