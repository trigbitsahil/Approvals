import { OrderList } from "@/components/orders/OrderList";

export default function OpenOutboundOrdersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Open Outbound Orders</h1>
          <p className="text-muted-foreground font-medium">
            View and manage open outbound order headers.
          </p>
        </div>
        <OrderList type={3} title="Open Outbound Orders" />
      </div>
    </div>
  );
}
