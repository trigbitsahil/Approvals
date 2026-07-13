"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { OrderLineService } from "@/api/services/OrderLineService";
import { PickingProcessor } from "@/components/orders/PickingProcessor";

function PickingPageContent() {
  const { id, lineId } = useParams();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "";
  
  const [order, setOrder] = useState<any>(null);
  const [lineItem, setLineItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderRes, lineRes] = await Promise.all([
          OrderHeaderService.getOrderHeaderById(id as string, "1"),
          OrderLineService.getOrderLineById(lineId as string, "1"),
        ]);
        setOrder(orderRes.data);
        setLineItem(lineRes.data);
      } catch (err) {
        console.error("Failed to fetch picking data", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && lineId) {
      fetchData();
    }
  }, [id, lineId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 border-4 border-muted border-t-blue-500 rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Initializing Picking Processor...</p>
      </div>
    );
  }

  if (!order || !lineItem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive font-bold">Error: Order or Line Item not found.</p>
      </div>
    );
  }

  return <PickingProcessor order={order} lineItem={lineItem} from={from} />;
}

export default function PickingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen font-medium text-slate-500">Loading...</div>}>
      <PickingPageContent />
    </Suspense>
  );
}
