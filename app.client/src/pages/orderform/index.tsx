"use client";

import { Suspense, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OrderFormDialog } from "@/components/orders/OrderFormDialog";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { toast } from "sonner";

function OrderFormContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const idParam = searchParams.get("id");
  const orderType = typeParam ? parseInt(typeParam, 10) : undefined;
  const [open, setOpen] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(!!idParam);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!idParam) return;
      try {
        const res = await OrderHeaderService.getOrderHeaderById(idParam, "1");
        if (res.success && res.data) {
          setOrder(res.data);
        } else {
          toast.error("Failed to load order for editing");
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
        toast.error("An error occurred while loading the order");
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [idParam]);

  // Map order type number to back-navigation URL
  const typeToRoute: Record<number, string> = {
    1: "/Order/alloutbound",
    2: "/Order/allinbound",
    3: "/Order/openoutbound",
    4: "/Order/openinbound",
    5: "/Order/myopenoutbound",
    6: "/Order/myopeninbound",
    7: "/Order/move",
  };

  const backRoute =
    orderType !== undefined ? (typeToRoute[orderType] ?? "/orders") : "/orders";

  if (loadingOrder) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-primary/20 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <div className="text-muted-foreground font-medium">Loading Order Form...</div>
        </div>
      </div>
    );
  }

  return (
    <OrderFormDialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) navigate(backRoute);
      }}
      order={order}
      useDialog={false}
      orderType={orderType}
      onSuccess={(id) => {
        if (id) {
          navigate(`/Order/${id}`);
        } else {
          navigate(backRoute);
        }
      }}
    />
  );
}

export default function OrderFormPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading form...</div>}>
      <OrderFormContent />
    </Suspense>
  );
}
