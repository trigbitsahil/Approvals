import { useState, useCallback } from "react";
import { UserService } from "@/api/services/UserService";
import { TicketTypeService } from "@/api/services/TicketTypeService";
import { TicketContractMediaUnitService } from "@/api/services/TicketContractMediaUnitService";
import { toast } from "sonner";

export const useTicketLookups = (apiVersion: string = "1") => {
    const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<{ id: string; email: string }[]>([]);
    const [ticketTypes, setTicketTypes] = useState<Array<{ ticketTypeId: string; name: string }>>([]);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [contractName, setContractName] = useState("N/A");
    const [mediaUnitName, setMediaUnitName] = useState("N/A");

    const fetchUsers = useCallback(async (searchQuery: string = "") => {
        try {
            // Optimization: In a real scenario, we might want to cache 'all users' 
            // instead of fetching every time if the API returns all users.
            // But preserving existing logic structure:
            const response = await UserService.getApiVUser(apiVersion);
            let allUsers = response.data || [];

            if (searchQuery) {
                allUsers = allUsers.filter((user: { email: string }) =>
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setUsers(allUsers);
            setFilteredUsers(allUsers);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setUsers([]);
            setFilteredUsers([]);
        }
    }, [apiVersion]);

    const loadTicketTypes = useCallback(async (departmentId: string) => {
        if (!departmentId) {
            setTicketTypes([]);
            return;
        }
        setLoadingTypes(true);
        try {
            const res = await TicketTypeService.getApiVTicketType(apiVersion, departmentId);
            const items = res.data?.items || res.data || [];
            setTicketTypes(items);
        } catch (err) {
            console.error("Failed to load types:", err);
            toast.error("Failed to load ticket types");
            setTicketTypes([]);
        } finally {
            setLoadingTypes(false);
        }
    }, [apiVersion]);

    const loadContractMedia = useCallback(async (ticketId: string) => {
        if (!ticketId) return;

        try {
            const res = await TicketContractMediaUnitService.getByTicketIdQuery(
                ticketId,
                apiVersion
            );

            const records = Array.isArray(res.data) ? res.data : [];

            if (records.length > 0) {
                const cName = records[0].contractName ?? "N/A";
                const mediaNames = records.map((r: any) => r.contractMediaUnitName).filter(Boolean).join(", ") || "N/A";

                setContractName(cName);
                setMediaUnitName(mediaNames);
            } else {
                setContractName("N/A");
                setMediaUnitName("N/A");
            }
        } catch (err: any) {
            console.warn("Failed to load contract/media-unit", err);
            setContractName("N/A");
            setMediaUnitName("N/A");
        }
    }, [apiVersion]);

    return {
        users,
        filteredUsers,
        fetchUsers,
        ticketTypes,
        loadingTypes,
        loadTicketTypes,
        contractName,
        mediaUnitName,
        loadContractMedia
    };
};
