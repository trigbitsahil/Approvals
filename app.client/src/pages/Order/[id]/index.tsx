"use client";

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { MoveOrderDetails } from "@/components/orders/MoveOrderDetails";

function OrderDetailsPageContent() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get the back route from query params, fallback to /orders
  const from = searchParams.get("from");
  const backRoute = from ? decodeURIComponent(from) : "/orders";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await OrderHeaderService.orderHeaderGet("1");
        if (res.success && res.data) {
          const found = res.data.find(
            (o: any) => String(o.orderHeaderId) === String(id)
          );
          setOrder(found);
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
          <div className="text-slate-500 font-medium">Loading Order Details...</div>
        </div>
      </div>
    );
  }

  const isMoveOrder = order?.moving || String(order?.orderTypeId) === "7" || backRoute === "/Order/move";

  return (
    <div className="min-h-screen py-8">
      {isMoveOrder ? (
        <MoveOrderDetails order={order} backRoute={backRoute} />
      ) : (
        <OrderDetails order={order} backRoute={backRoute} />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen font-medium text-slate-500">Loading...</div>}>
      <OrderDetailsPageContent />
    </Suspense>
  );
}
