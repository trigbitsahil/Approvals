import { OrderList } from "@/components/orders/OrderList";

export default function AllInboundOrdersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Inbound Orders</h1>
          <p className="text-muted-foreground font-medium">
            View and manage all inbound order headers.
          </p>
        </div>
        <OrderList type={2} title="All Inbound Orders" />
      </div>
    </div>
  );
}
