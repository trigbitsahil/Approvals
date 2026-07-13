"use client";

import { WarehouseUserTable } from "@/components/warehouse/WarehouseUserTable";

export default function WarehouseUsersPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <WarehouseUserTable />
        </div>
    );
}
