import { OrderList } from "@/components/orders/OrderList";
import { t } from "@lingui/macro";

export default function OrdersPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground font-medium">
                        Manage your order headers and lines.
                    </p>
                </div>
                <OrderList />
            </div>
        </div>
    );
}
