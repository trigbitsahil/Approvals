import { MoveOrderList } from "@/components/orders/MoveOrderList";

export default function MoveOrdersListPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Move Orders</h1>
          <p className="text-muted-foreground font-medium">
            View and manage all move order headers.
          </p>
        </div>
        <MoveOrderList />
      </div>
    </div>
  );
}
