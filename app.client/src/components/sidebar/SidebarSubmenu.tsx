"use client";

import { Button } from "@/components/ui/button";
import { Home, Search, User, Settings, Calendar1, NotebookIcon, FileText, Contact, CheckCircle2, Banknote, PiggyBank, Coins, TrendingUp, Layout, BarChart3, Timer, Scale } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Link, useSearchParams } from "react-router-dom";

export const SecondarySidebar = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const documentsUrl = `/documents${projectId ? `?projectId=${projectId}` : ""}`;
  const settingsUrl = `/settings${projectId ? `?projectId=${projectId}` : ""}`;
  const calendarUrl = `/calendar${projectId ? `?projectId=${projectId}` : ""}`;
  const notesUrl = `/notes${projectId ? `?projectId=${projectId}` : ""}`;
  const kanbanUrl = `/kanban${projectId ? `?projectId=${projectId}` : ""}`;
  const usersUrl = `/users${projectId ? `?projectId=${projectId}` : ""}`;
  const contactsUrl = `/contacts${projectId ? `?projectId=${projectId}` : ""}`;
  const approvalsUrl = `/approvals${projectId ? `?projectId=${projectId}` : ""}`;
  const expenseTransactionUrl = `/ExpenseTransaction${projectId ? `?projectId=${projectId}` : ""}`;
  const budgetUrl = `/Budget${projectId ? `?projectId=${projectId}` : ""}`;
  const incomeUrl = `/Income${projectId ? `?projectId=${projectId}` : ""}`;
  const incomeTransactionUrl = `/IncomeTransaction${projectId ? `?projectId=${projectId}` : ""}`;
  const ledgerUrl = `/Ledger${projectId ? `?projectId=${projectId}` : ""}`;
  const dynamicFormUrl = `/event${projectId ? `?projectId=${projectId}` : ""}`;
  const reportsUrl = `/Reports${projectId ? `?projectId=${projectId}` : ""}`;
  const dashboardUrl = `/ProjectDashboard${projectId ? `?projectId=${projectId}` : ""}`;

  return (
    <TooltipProvider>
      <aside
        className="flex flex-col items-center w-10 h-screen bg-muted border-r p-2 space-y-2 sticky top-0"
      >
        {/* Dashboard */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Link to={dashboardUrl}>
                <BarChart3 className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Dashboard</TooltipContent>
        </Tooltip>

        {/* Task / Kanban */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Link to={kanbanUrl}>
                <Timer className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Task</TooltipContent>
        </Tooltip>

        {/* Search */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Search</TooltipContent>
        </Tooltip> */}

        {/* Members / Users - FIXED */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Link to={usersUrl}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Members</TooltipContent>
        </Tooltip>

        {/* Calendar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Link to={calendarUrl}>
                <Calendar1 className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Calendar</TooltipContent>
        </Tooltip>

        {/* Notes */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={notesUrl}>
              <Button variant="ghost" size="icon">
                <NotebookIcon className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Notes</TooltipContent>
        </Tooltip>

        {/* Documents */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={documentsUrl}>
              <Button variant="ghost" size="icon">
                <FileText className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Documents</TooltipContent>
        </Tooltip>

        {/* Contact */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={contactsUrl}>
              <Button variant="ghost" size="icon">
                <Contact className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Contact</TooltipContent>
        </Tooltip>


        {/* Budget */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={budgetUrl}>
              <Button variant="ghost" size="icon">
                <PiggyBank className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Budget</TooltipContent>
        </Tooltip>

        {/* Expense Transaction */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={expenseTransactionUrl}>
              <Button variant="ghost" size="icon">
                <Banknote className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Expenses</TooltipContent>
        </Tooltip>


        {/* Income Transaction */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={incomeTransactionUrl}>
              <Button variant="ghost" size="icon">
                <TrendingUp className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Income Transactions</TooltipContent>
        </Tooltip>

        {/* Ledger */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={ledgerUrl}>
              <Button variant="ghost" size="icon">
                <Scale className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Ledger</TooltipContent>
        </Tooltip>

        {/* Dynamic Form */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={dynamicFormUrl}>
              <Button variant="ghost" size="icon">
                <Layout className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Dynamic Form</TooltipContent>
        </Tooltip>

        {/* Reports */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link to={reportsUrl}>
              <Button variant="ghost" size="icon">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Reports</TooltipContent>
        </Tooltip> */}

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={settingsUrl}>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
};

export default SecondarySidebar;