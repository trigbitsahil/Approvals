import { OrderList } from "@/components/orders/OrderList";

export default function MyOpenInboundOrdersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Open Inbound Orders</h1>
          <p className="text-muted-foreground font-medium">
            View and manage your open inbound order headers.
          </p>
        </div>
        <OrderList type={6} title="My Open Inbound Orders" />
      </div>
    </div>
  );
}
