"use client";

import { MoveOrderList } from "@/components/orders/MoveOrderList";
import { i18n } from "@lingui/core";

export default function MoveOrderPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-4">
                <MoveOrderList />
            </div>
        </div>
    );
}
