// src/components/ticket/TicketDetailPage.tsx
"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TicketDetail from "./TicketDetail";
import { TicketService } from "@/api/services/TicketService";
import { TicketPriorityService } from "@/api/services/TicketPriorityService";
import { TicketStatusService } from "@/api/services/TicketStatusService";
import { TicketTypeService } from "@/api/services/TicketTypeService"; // FIXED version
import { UserService } from "@/api/services/UserService";
import { ContractService } from "@/api/services/ContractService";
import { ContractMediaUnitService } from "@/api/services/ContractMediaUnitService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { TeamService } from "@/api/services/TeamService";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_VERSION = "1";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // lookup tables
  const [statuses, setStatuses] = useState<Array<{ ticketStatusId: string; name: string }>>([]);
  const [priorities, setPriorities] = useState<Array<{ ticketPriorityId: string; name: string }>>([]);
  const [types, setTypes] = useState<Array<{ ticketTypeName: string; name: string }>>([]);
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const [contracts, setContracts] = useState<Array<{ contractId: string; name: string }>>([]);
  const [mediaUnits, setMediaUnits] = useState<Array<{ contractMediaUnitId: string; name: string }>>([]);
  const [teams, setTeams] = useState<Array<{ teamId: string; name: string }>>([]);

  useEffect(() => {
    const loadAll = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // 1. Load ticket
        const ticketRes = await TicketService.getTicketById(id, API_VERSION);
        const t = ticketRes.data;
        setTicket(t);

        // 2. Get logged-in user + roles to determine department
        const loggedInUserRes = await UserService.getLoggedInUser(API_VERSION);
        const loggedInUser = loggedInUserRes.data;
        if (loggedInUser?.email) {
          setCurrentUserEmail(loggedInUser.email);
        }
        const rolesRes = await UserService.getUserRoles(API_VERSION, loggedInUser.id);
        const roles = rolesRes?.data || [];
        const isOperationHead = roles.includes("OperationHead");
        const isHR = roles.includes("HR");

        // 3. Determine effective departmentId
        let effectiveDepartmentId: string | null = null;
        if (isOperationHead) {
          effectiveDepartmentId = "Dep_2025_04_05de41fe70-a071-41b9-9529-dbb46ed122e0";
        } else if (isHR) {
          effectiveDepartmentId = "Dep_2025_08_0131badf7b-5ae7-4f76-abb8-dfca79eac03d";
        } else {
          effectiveDepartmentId = loggedInUser.departmentId ?? null;
        }

        // 4. Load lookups in parallel
        const [
          priRes,
          staRes,
          typRes,
          usrRes,
          conRes,
          teamRes,
        ] = await Promise.all([
          TicketPriorityService.getApiVTicketPriority(API_VERSION),
          TicketStatusService.getApiVTicketStatus(API_VERSION),
          effectiveDepartmentId
            ? TicketTypeService.getApiVTicketType(API_VERSION, effectiveDepartmentId)
            : Promise.resolve({ data: [] }), // no error if no dept
          UserService.getApiVUser(API_VERSION),
          ContractService.getApiVContract(API_VERSION),
          TeamService.getApiVTeam(API_VERSION),
        ]);

        setPriorities(priRes.data || []);
        setStatuses(staRes.data || []);
        setTypes(typRes.data?.items || typRes.data || []);
        setUsers((usrRes.data || []).map((u: any) => ({ id: u.id, email: u.email })));
        setContracts((conRes.data || []).map((c: any) => ({
          contractId: c.contractID,
          name: c.name,
        })));
        setTeams((teamRes.data || []).map((t: any) => ({
          teamId: t.teamId || t.id,
          name: t.name,
        })));

        // 5. Load media units if needed
        if (t.contractId) {
          const muRes = await ContractMediaUnitService.getApiVContractMediaUnit(API_VERSION, t.contractId);
          setMediaUnits((muRes.data || []).map((mu: any) => ({
            contractMediaUnitId: mu.contractMediaUnitID || mu.id,
            name: mu.name || mu.mediaUnitName || `Media Unit ${mu.id}`,
          })));
        } else {
          setMediaUnits([]);
        }

        // 6. Load documents
        const docRes = await DocumentsService.getApiVDocuments(API_VERSION, "Ticket", id);
        setDocuments(docRes.data || []);

      } catch (err: any) {
        console.error("Failed to load ticket detail:", err);
        toast.error("Failed to load ticket details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id, navigate]);

  const refresh = async () => {
    if (!id) return;
    try {
      const res = await TicketService.getTicketById(id, API_VERSION);
      setTicket((res as any).data);
      const docRes = await DocumentsService.getApiVDocuments(API_VERSION, "Ticket", id);
      setDocuments(docRes.data || []);
    } catch {
      toast.error("Failed to refresh");
    }
  };

  const loadMediaUnits = async (contractId?: string) => {
    if (!contractId) {
      setMediaUnits([]);
      return;
    }
    try {
      const res = await ContractMediaUnitService.getApiVContractMediaUnit(API_VERSION, contractId);
      setMediaUnits((res.data || []).map((mu: any) => ({
        contractMediaUnitId: mu.contractMediaUnitID || mu.id,
        name: mu.name || mu.mediaUnitName || `Media Unit ${mu.id}`,
      })));
    } catch {
      setMediaUnits([]);
    }
  };

  const [sendingFollowUp, setSendingFollowUp] = useState(false);

  const handleFollowUp = async () => {
    if (!id) return;
    setSendingFollowUp(true);
    try {
      const res = await TicketService.sendFollowUpEmail(API_VERSION, id);
      if (res && res.success === false) {
        toast.error(res.message || "Failed to send follow-up email.");
      } else {
        toast.success("Follow-up email sent successfully!");
        refresh();
      }
    } catch (err: any) {
      console.error("Follow-up error:", err);
      toast.error("Failed to send follow-up email.");
    } finally {
      setSendingFollowUp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          onClick={() => navigate("/tickets")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Button>

        {(ticket.assignee || ticket.assignedTo) &&
          !ticket.isResolved &&
          !ticket.isCompleted &&
          currentUserEmail &&
          (ticket.assignee || ticket.assignedTo).toLowerCase() !== currentUserEmail.toLowerCase() && (
          <Button
            size="sm"
            onClick={handleFollowUp}
            disabled={sendingFollowUp}
            className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 py-2 rounded-lg"
          >
            {sendingFollowUp ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Send Follow Up
          </Button>
        )}
      </div>

      <TicketDetail
        ticket={ticket}
        onTicketUpdated={refresh}
        onMessageSend={refresh}
        statuses={statuses}
        priorities={priorities}
        types={types}
        users={users}
        contracts={contracts}
        mediaUnits={mediaUnits}
        onContractChange={loadMediaUnits}
        documents={documents}
        teams={teams}
      />
    </div>
  );
}