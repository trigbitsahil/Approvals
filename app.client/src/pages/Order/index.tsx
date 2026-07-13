"use client";

import { OrderList } from "@/components/orders/OrderList";
import { i18n } from "@lingui/core";

export default function OrdersPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order</h1>
                    <p className="text-muted-foreground font-medium">
                        {i18n.t("Manage your order headers and lines.")}
                    </p>
                </div>
                <OrderList />
            </div>
        </div>
    );
}