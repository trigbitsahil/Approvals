import { useState, useEffect } from "react";
import { TicketPriorityService } from "@/api/services/TicketPriorityService";
import { TicketStatusService } from "@/api/services/TicketStatusService";
import { ContractService } from "@/api/services/ContractService";
import { ContractMediaUnitService } from "@/api/services/ContractMediaUnitService";

const API_VERSION = "1";

export const useCommonLookups = () => {
    const [statuses, setStatuses] = useState<Array<{ ticketStatusId: string; name: string }>>([]);
    const [priorities, setPriorities] = useState<Array<{ ticketPriorityId: string; name: string }>>([]);
    const [contracts, setContracts] = useState<Array<{ contractId: string; name: string }>>([]);
    const [mediaUnits, setMediaUnits] = useState<Array<{ contractMediaUnitId: string; name: string }>>([]);
    const [loadingLookups, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [priRes, staRes, conRes] = await Promise.all([
                    TicketPriorityService.getApiVTicketPriority(API_VERSION),
                    TicketStatusService.getApiVTicketStatus(API_VERSION),
                    ContractService.getApiVContract(API_VERSION),
                ]);
                setStatuses(staRes.data || []);
                setPriorities(priRes.data || []);
                setContracts((conRes.data || []).map((c: any) => ({
                    contractId: c.contractID,
                    name: c.name,
                })));
            } catch (e) {
                console.error("Failed to load lookups", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Media units often depend on contract or list all?
    // For filters, we might want ALL media units or none.
    // Original TicketDetail loaded them by contract. 
    // Let's implement a helper to load all if needed, or just leave empty basic lookups.
    // For the Create Form, we need media units based on contract usually.

    const loadMediaUnits = async (contractId: string) => {
        if (!contractId) {
            setMediaUnits([]);
            return;
        }
        try {
            const res = await ContractMediaUnitService.getApiVContractMediaUnit(API_VERSION, contractId);
            setMediaUnits((res.data || []).map((mu: any) => ({
                contractMediaUnitId: mu.contractMediaUnitID || mu.id,
                name: mu.name || mu.mediaUnitName,
            })));
        } catch (e) {
            console.error(e);
            setMediaUnits([]);
        }
    };

    return {
        statuses,
        priorities,
        contracts,
        mediaUnits,
        loadingLookups,
        loadMediaUnits,
    };
};
