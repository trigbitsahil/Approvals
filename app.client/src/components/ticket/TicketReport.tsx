"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DatePickerWithRange } from "./components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";
import { TicketService } from "@/api/services/TicketService";
import { UserService } from "@/api/services/UserService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import exportFromJSON from "export-from-json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowLeft,
  FileText,
  RefreshCw,
  Search,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

// Constants for backend Status UUIDs
const STATUS_OPEN = "TcktStatus_2025_07_30858be8b7-c407-4eee-a578-40a0d0b829fd";
const STATUS_IN_PROGRESS = "TcktStatus_2025_07_301d660566-08a8-4db2-8e91-bfd38fb75ba3";
const STATUS_RESOLVED = "TcktStatus_2025_07_3181ef0640-ad38-4a5d-a201-d683f73b7226";
const STATUS_COMPLETED = "TcktStatus_2025_07_3175925d31-36bf-42cf-a52e-20524b48bc3f";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  [STATUS_OPEN]: { label: "Open", color: "hsl(var(--warning))", bg: "hsl(var(--warning)/0.15)" },
  [STATUS_IN_PROGRESS]: { label: "In Progress", color: "hsl(var(--info, 190 90% 50%))", bg: "hsl(var(--info, 190 90% 50%)/0.15)" },
  [STATUS_RESOLVED]: { label: "Resolved", color: "hsl(170, 90%, 40%)", bg: "hsl(170, 90%, 40%, 0.15)" },
  [STATUS_COMPLETED]: { label: "Completed", color: "hsl(var(--success))", bg: "hsl(var(--success)/0.15)" },
};

// Chart Colors
const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#10b981"]; // Warning, Blue, Teal, Green
const STATUS_COLORS: Record<string, string> = {
  "Open": "#f59e0b",
  "In Progress": "#3b82f6",
  "Resolved": "#0d9488",
  "Completed": "#10b981",
};

export default function TicketReport() {
  const navigate = useNavigate();

  // Date Range state: defaults to last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal drilldown state
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [drilldownTitle, setDrilldownTitle] = useState("");
  const [drilldownTickets, setDrilldownTickets] = useState<any[]>([]);

  // Load system users to match user emails to Display Names
  useEffect(() => {
    UserService.getApiVUser("1")
      .then((res) => {
        if (res.success && res.data) {
          setUsers(res.data);
        }
      })
      .catch((err) => console.error("Failed to load users:", err));
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const query: any = {
        pageNumber: 1,
        pageSize: 10000, // Large pageSize to get all tickets in selected range
      };
      if (dateRange?.from) {
        query.startDate = dateRange.from.toISOString();
      }
      if (dateRange?.to) {
        query.endDate = dateRange.to.toISOString();
      }

      const res = await TicketService.getTicketListByUser("1", query);
      if (res.success && res.data?.ticketList) {
        setTickets(res.data.ticketList);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Failed to fetch tickets for report:", err);
      toast.error("Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  // Helper: Format duration from milliseconds into human-readable string
  const formatDuration = (ms: number) => {
    if (ms < 0) ms = 0;
    const totalMinutes = Math.floor(ms / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.length > 0 ? parts.join(" ") : "0m";
  };

  // Helper: Find user name by email
  const getUserDisplayName = (email: string) => {
    if (!email) return "System / Unknown";
    const matched = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    return matched ? `${matched.firstName} ${matched.lastName}` : email;
  };

  // Helper: Open drilldown modal
  const handleDrilldown = (title: string, filteredList: any[]) => {
    setDrilldownTitle(title);
    setDrilldownTickets(filteredList);
    setIsDrilldownOpen(true);
  };

  // Helper functions for Excel Export
  const dateRangeStr = useMemo(() => {
    return dateRange?.from
      ? `${format(dateRange.from, "yyyy-MM-dd")}_to_${dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "present"}`
      : "all_time";
  }, [dateRange]);

  const exportAllTickets = () => {
    if (tickets.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const dataToExport = tickets.map((t) => {
      const config = STATUS_CONFIG[t.ticketStatusId] || { label: "Open" };
      const createdStr = t.createdDate ? format(new Date(t.createdDate), "yyyy-MM-dd HH:mm") : "N/A";
      const closedDate = t.completedDate || t.resolvedDate;
      const closedStr = closedDate ? format(new Date(closedDate), "yyyy-MM-dd HH:mm") : "N/A";
      
      let durationStr = "N/A";
      if (t.createdDate && closedDate) {
        const duration = new Date(closedDate).getTime() - new Date(t.createdDate).getTime();
        if (duration >= 0) {
          durationStr = formatDuration(duration);
        }
      }

      return {
        "Ticket No": t.ticketNo || "N/A",
        Title: t.title || "N/A",
        "Requested By": getUserDisplayName(t.requestedBy),
        "Created Date": createdStr,
        "Closed Date": closedStr,
        "Resolution Time": durationStr,
        Priority: t.ticketPriorityId === "TcktPriority_2025_07_30456def89-0123" ? "High" : "Normal",
        Status: config.label,
      };
    });

    exportFromJSON({
      data: dataToExport,
      fileName: `Tickets_Report_${dateRangeStr}`,
      exportType: exportFromJSON.types.xls,
    });
    toast.success("Excel report exported successfully");
  };

  const exportClosurePerformance = () => {
    const closedList = analytics.closedTicketsList;
    if (closedList.length === 0) {
      toast.error("No closed tickets available to export");
      return;
    }

    const dataToExport = closedList.map((t) => ({
      "Ticket No": t.ticketNo || "N/A",
      Title: t.title || "N/A",
      "Requested By": getUserDisplayName(t.requestedBy),
      "Created Date": t.createdDate ? format(new Date(t.createdDate), "yyyy-MM-dd HH:mm") : "N/A",
      "Closed Date": t.closedDate ? format(new Date(t.closedDate), "yyyy-MM-dd HH:mm") : "N/A",
      "Time Taken to Close": t.durationStr,
      Status: t.status,
    }));

    exportFromJSON({
      data: dataToExport,
      fileName: `Ticket_Closure_Performance_${dateRangeStr}`,
      exportType: exportFromJSON.types.xls,
    });
    toast.success("Closure performance list exported successfully");
  };

  const exportUserBreakdown = () => {
    const breakdown = analytics.userChartData;
    if (breakdown.length === 0) {
      toast.error("No breakdown data available to export");
      return;
    }

    const dataToExport = breakdown.map((u) => {
      const closedRatio = u.tickets > 0 ? Math.round((u.closed / u.tickets) * 100) : 0;
      return {
        "User Name": u.name,
        Email: u.email,
        "Open Tickets": u.open,
        "Closed Tickets": u.closed,
        "Total Tickets Raised": u.tickets,
        "Closure Rate (%)": `${closedRatio}%`,
      };
    });

    exportFromJSON({
      data: dataToExport,
      fileName: `Ticket_User_Breakdown_${dateRangeStr}`,
      exportType: exportFromJSON.types.xls,
    });
    toast.success("User breakdown list exported successfully");
  };

  // Calculations for dashboard
  const analytics = useMemo(() => {
    const total = tickets.length;
    let closedCount = 0;
    let openCount = 0;
    let totalResolutionTime = 0;
    let resolvedOrCompletedCount = 0;

    const statusCounts: Record<string, number> = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
      Completed: 0,
    };

    const userWiseMap: Record<string, { email: string; total: number; open: number; closed: number }> = {};
    const closedTicketsList: Array<{
      ticketId: string;
      ticketNo: string;
      title: string;
      requestedBy: string;
      createdDate: string;
      closedDate: string;
      durationMs: number;
      durationStr: string;
      status: string;
    }> = [];

    tickets.forEach((ticket) => {
      // 1. Status classification
      const config = STATUS_CONFIG[ticket.ticketStatusId] || { label: "Open" };
      statusCounts[config.label] = (statusCounts[config.label] || 0) + 1;

      const isClosed = ticket.isCompleted || ticket.ticketStatusId === STATUS_COMPLETED;
      if (isClosed) {
        closedCount++;
      } else {
        openCount++;
      }

      // 2. Closure time duration logic
      const dateEnd = ticket.completedDate
        ? new Date(ticket.completedDate)
        : ticket.isResolved && ticket.resolvedDate
        ? new Date(ticket.resolvedDate)
        : null;

      if (dateEnd && ticket.createdDate) {
        const dateStart = new Date(ticket.createdDate);
        const duration = dateEnd.getTime() - dateStart.getTime();
        if (duration >= 0) {
          totalResolutionTime += duration;
          resolvedOrCompletedCount++;

          closedTicketsList.push({
            ticketId: ticket.ticketId,
            ticketNo: ticket.ticketNo,
            title: ticket.title,
            requestedBy: ticket.requestedBy,
            createdDate: ticket.createdDate,
            closedDate: ticket.completedDate || ticket.resolvedDate,
            durationMs: duration,
            durationStr: formatDuration(duration),
            status: config.label,
          });
        }
      }

      // 3. User-wise grouping by requestedBy (using user email)
      const creator = ticket.requestedBy || "Unknown";
      if (!userWiseMap[creator]) {
        userWiseMap[creator] = { email: creator, total: 0, open: 0, closed: 0 };
      }
      userWiseMap[creator].total++;
      if (isClosed) {
        userWiseMap[creator].closed++;
      } else {
        userWiseMap[creator].open++;
      }
    });

    const avgResolutionTimeStr =
      resolvedOrCompletedCount > 0
        ? formatDuration(totalResolutionTime / resolvedOrCompletedCount)
        : "N/A";

    // Chart: Status list mapping
    const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    })).filter(item => item.value > 0);

    // Chart: User-wise raising count mapping (Top 8 users)
    const userChartData = Object.values(userWiseMap)
      .map((item) => ({
        name: getUserDisplayName(item.email),
        email: item.email,
        tickets: item.total,
        open: item.open,
        closed: item.closed,
      }))
      .sort((a, b) => b.tickets - a.tickets);

    // Sort closed ticket list by completion time (descending)
    closedTicketsList.sort((a, b) => new Date(b.closedDate).getTime() - new Date(a.closedDate).getTime());

    return {
      total,
      openCount,
      closedCount,
      avgResolutionTimeStr,
      statusCounts,
      statusChartData,
      userChartData,
      closedTicketsList,
    };
  }, [tickets, users]);

  // Filtered lists for the tables
  const filteredClosedTickets = useMemo(() => {
    if (!searchQuery) return analytics.closedTicketsList;
    const query = searchQuery.toLowerCase();
    return analytics.closedTicketsList.filter(
      (t) =>
        t.ticketNo.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        getUserDisplayName(t.requestedBy).toLowerCase().includes(query)
    );
  }, [analytics.closedTicketsList, searchQuery, users]);

  const filteredUserBreakdown = useMemo(() => {
    if (!searchQuery) return analytics.userChartData;
    const query = searchQuery.toLowerCase();
    return analytics.userChartData.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }, [analytics.userChartData, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header and navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ticket Operations Report
          </h1>
          <p className="text-muted-foreground">
            Overview of raising patterns, response durations, and operational statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-[280px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 hover:bg-white/5 text-xs font-semibold cursor-pointer"
                disabled={loading || tickets.length === 0}
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border border-white/10 text-foreground">
              <DropdownMenuItem onClick={exportAllTickets} className="hover:bg-white/5 cursor-pointer text-xs">
                Export All Tickets ({tickets.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportClosurePerformance} className="hover:bg-white/5 cursor-pointer text-xs">
                Export Closure Performance List ({analytics.closedTicketsList.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportUserBreakdown} className="hover:bg-white/5 cursor-pointer text-xs">
                Export User-wise Breakdown ({analytics.userChartData.length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchReportData}
            disabled={loading}
            className="hover:bg-white/5 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card
          onClick={() => handleDrilldown("Total Raised Tickets", tickets)}
          className="bg-card/40 backdrop-blur-md border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Raised</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{analytics.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Tickets created in date range (Click to view)</p>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            handleDrilldown(
              "Open Tickets (Pending / In Progress)",
              tickets.filter((t) => !(t.isCompleted || t.ticketStatusId === STATUS_COMPLETED))
            )
          }
          className="bg-card/40 backdrop-blur-md border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-500">{analytics.openCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending resolution / in progress (Click to view)</p>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            handleDrilldown(
              "Closed Tickets (Completed)",
              tickets.filter((t) => t.isCompleted || t.ticketStatusId === STATUS_COMPLETED)
            )
          }
          className="bg-card/40 backdrop-blur-md border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Closed Tickets</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-500">{analytics.closedCount}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Closure Rate:</span>
              <span className="text-xs font-semibold text-green-400">
                {analytics.total > 0 ? Math.round((analytics.closedCount / analytics.total) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-white/5 hover:border-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Avg Resolve Time</CardTitle>
            <Clock className="h-4 w-4 text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-teal-400">{analytics.avgResolutionTimeStr}</div>
            <p className="text-xs text-muted-foreground mt-1">Average time taken to resolve/close</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown chart */}
        <Card className="bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Ticket Status Distribution</CardTitle>
            <CardDescription>Breakdown of current status within selected range</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center">
            {analytics.statusChartData.length > 0 ? (
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-around">
                <div className="w-[180px] h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.statusChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.statusChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: "8px",
                          color: "black",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 md:mt-0">
                  {analytics.statusChartData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[item.name] || COLORS[index % COLORS.length] }}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.value} ({Math.round((item.value / analytics.total) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">No ticket data available for this range</div>
            )}
          </CardContent>
        </Card>

        {/* User raising list */}
        <Card className="bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Top Requesters</CardTitle>
            <CardDescription>Users who raised the most tickets in this range</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {analytics.userChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.userChartData.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "8px",
                      color: "black",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="tickets" name="Tickets Raised" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No requesters available in this range
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs and Tables */}
      <Card className="bg-card/40 border-white/5 overflow-hidden">
        <Tabs defaultValue="close-times" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 px-6 py-4 gap-4">
            <TabsList className="bg-black/20 border border-white/5">
              <TabsTrigger value="close-times" className="text-xs data-[state=active]:bg-white/5">
                Closure Times
              </TabsTrigger>
              <TabsTrigger value="user-breakdown" className="text-xs data-[state=active]:bg-white/5">
                User-wise Breakdown
              </TabsTrigger>
              <TabsTrigger value="status-summary" className="text-xs data-[state=active]:bg-white/5">
                Status Matrix
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search report table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 bg-black/10 border-white/5 focus-visible:ring-amber-500 text-xs"
              />
            </div>
          </div>

          {/* Tab: Close Times Table */}
          <TabsContent value="close-times" className="p-0 m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-[120px] text-xs font-bold">Ticket No</TableHead>
                    <TableHead className="text-xs font-bold">Title</TableHead>
                    <TableHead className="text-xs font-bold">Raised By</TableHead>
                    <TableHead className="w-[140px] text-xs font-bold">Raised Date</TableHead>
                    <TableHead className="w-[140px] text-xs font-bold">Resolved Date</TableHead>
                    <TableHead className="w-[140px] text-right text-xs font-bold">Time Taken to Close</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClosedTickets.length > 0 ? (
                    filteredClosedTickets.map((t) => (
                      <TableRow
                        key={t.ticketId}
                        onClick={() => navigate(`/tickets/${t.ticketId}`)}
                        className="border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                      >
                        <TableCell className="font-mono text-xs font-bold text-amber-500">
                          {t.ticketNo}
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate">{t.title}</TableCell>
                        <TableCell className="text-xs font-semibold">
                          {getUserDisplayName(t.requestedBy)}
                        </TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">
                          {t.createdDate ? format(new Date(t.createdDate), "LLL dd, yyyy HH:mm") : "N/A"}
                        </TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">
                          {t.closedDate ? format(new Date(t.closedDate), "LLL dd, yyyy HH:mm") : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="border-teal-500/20 text-teal-400 bg-teal-500/5 text-[10px]">
                            {t.durationStr}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                        No closed tickets matching date range/filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Tab: User wise tickets table */}
          <TabsContent value="user-breakdown" className="p-0 m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-xs font-bold">User Name</TableHead>
                    <TableHead className="text-xs font-bold">Email</TableHead>
                    <TableHead className="w-[100px] text-center text-xs font-bold">Open</TableHead>
                    <TableHead className="w-[100px] text-center text-xs font-bold">Closed</TableHead>
                    <TableHead className="w-[100px] text-center text-xs font-bold">Total Raised</TableHead>
                    <TableHead className="w-[200px] text-xs font-bold">Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUserBreakdown.length > 0 ? (
                    filteredUserBreakdown.map((u) => {
                      const closedRatio = u.tickets > 0 ? (u.closed / u.tickets) * 100 : 0;
                      return (
                        <TableRow key={u.email} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                          <TableCell className="text-xs font-bold">{u.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">{u.email}</TableCell>
                          <TableCell className="text-center font-semibold text-amber-500 text-xs">{u.open}</TableCell>
                          <TableCell className="text-center font-semibold text-green-500 text-xs">{u.closed}</TableCell>
                          <TableCell className="text-center font-black text-xs">{u.tickets}</TableCell>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <Progress value={closedRatio} className="h-1.5 flex-1" />
                              <span className="text-[10px] text-muted-foreground w-8 text-right">
                                {Math.round(closedRatio)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                        No requesters found matching search/range
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Tab: Ticket status summary grid/matrix */}
          <TabsContent value="status-summary" className="p-6 m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(STATUS_CONFIG).map(([id, cfg]) => {
                const count = tickets.filter((t) => t.ticketStatusId === id).length;
                const percentage = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                return (
                  <div
                    key={id}
                    className="p-5 rounded-xl border border-white/5 bg-black/10 flex flex-col justify-between h-[120px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">{cfg.label}</span>
                      <Badge style={{ color: cfg.color, backgroundColor: cfg.bg }} className="text-[9px] border-none">
                        {percentage}%
                      </Badge>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-foreground">{count}</div>
                      <Progress value={percentage} className="h-1 mt-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Drilldown dialog/modal popover */}
      <Dialog open={isDrilldownOpen} onOpenChange={setIsDrilldownOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{drilldownTitle}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Showing matching tickets represented in the selected metrics card.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto mt-4 rounded-lg border border-white/5">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[120px] text-xs font-bold">Ticket No</TableHead>
                  <TableHead className="text-xs font-bold">Title</TableHead>
                  <TableHead className="text-xs font-bold">Raised By</TableHead>
                  <TableHead className="w-[100px] text-xs font-bold">Priority</TableHead>
                  <TableHead className="w-[110px] text-xs font-bold">Status</TableHead>
                  <TableHead className="w-[130px] text-xs font-bold">Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drilldownTickets.length > 0 ? (
                  drilldownTickets.map((t) => {
                    const statusConfig = STATUS_CONFIG[t.ticketStatusId] || { label: "Open", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
                    return (
                      <TableRow
                        key={t.ticketId}
                        onClick={() => {
                          setIsDrilldownOpen(false);
                          navigate(`/tickets/${t.ticketId}`);
                        }}
                        className="border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                      >
                        <TableCell className="font-mono text-xs font-bold text-amber-500">
                          {t.ticketNo}
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate font-medium">{t.title}</TableCell>
                        <TableCell className="text-xs">{getUserDisplayName(t.requestedBy)}</TableCell>
                        <TableCell className="text-xs">
                          {t.ticketPriorityId === "TcktPriority_2025_07_30456def89-0123" ? (
                            <Badge variant="outline" className="border-red-500/20 text-red-400 bg-red-500/5 text-[10px]">
                              High
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-white/10 text-muted-foreground text-[10px]">
                              Normal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
                            className="text-[10px] border-none font-semibold"
                          >
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">
                          {t.createdDate ? format(new Date(t.createdDate), "LLL dd, yyyy HH:mm") : "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      No matching tickets in this category
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
