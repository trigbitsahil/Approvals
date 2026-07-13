"use client";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { orderHeaderSchema, OrderHeaderFormData } from "./validationSchema";
import { Textarea } from "@/components/ui/textarea";
import Scanner from "@/components/barcode/Scanner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { OrderHeaderService } from "@/api/services/OrderHeaderService";
import { CreateOrderHeaderCommand } from "@/api/models/CreateOrderHeaderCommand";
import { WarehouseService } from "@/api/services/WarehouseService";
import { OrderTypeService } from "@/api/services/OrderTypeService";
import { OrderHeaderListVM } from "@/api/models/OrderHeaderListVM";
import { InventoryItemService } from "@/api/services/InventoryItemService";
import { OrderLineService } from "@/api/services/OrderLineService";
import { CreateOrderLineCommand } from "@/api/models/CreateOrderLineCommand";
import { UserService } from "@/api/services/UserService";
import { i18n } from "@lingui/core";
import { ApiError } from "@/api/core/ApiError";
import Cookies from "js-cookie";

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderHeaderListVM | null;
  onSuccess: (orderHeaderId?: string) => void;
  isReadOnly?: boolean;
  useDialog?: boolean;
  /** The order list type context (1-7) this form was opened from */
  orderType?: number;
}

export const OrderFormDialog = ({
  open,
  onOpenChange,
  order,
  onSuccess,
  isReadOnly = false,
  useDialog = true,
  orderType,
}: OrderFormDialogProps) => {
  const navigate = useNavigate();

  // Map from orderType number to the corresponding back-navigation route
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

  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [orderTypes, setOrderTypes] = useState<any[]>([]);
  const [barcode, setBarcode] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [units, setUnits] = useState("");
  const [lines, setLines] = useState<CreateOrderLineCommand[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res: any = await InventoryItemService.inventoryItemGet("1");
        if (res?.data && Array.isArray(res.data)) {
          setInventoryItems(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch inventory items", error);
      }
    };
    fetchInventory();
  }, []);

  const handleBarcodeBlur = async (codeFromScanner?: string) => {
    const codeToUse = typeof codeFromScanner === "string" ? codeFromScanner : barcode;
    if (!codeToUse) return;

    if (typeof codeFromScanner === "string") {
      setBarcode(codeFromScanner);
    }

    try {
      const res: any = await InventoryItemService.getInventoryItemByCode(
        "1",
        codeToUse,
      );
      if (res && res.data) {
        setDescription(res.data.productDescription || "");
        setUnits(res.data.productUom || "");
        toast.success("Item found and populated");
      }
    } catch (error: any) {
      if (error?.status === 404) {
        toast.error("Barcode not found");
      } else {
        console.error("Failed to fetch item by barcode", error);
      }
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OrderHeaderFormData>({
    resolver: yupResolver(orderHeaderSchema) as any,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Check if user is SuperAdmin
        let isAdmin = false;
        try {
          const roleRes = await UserService.getMyRoles("1");
          const roles = Array.isArray(roleRes.data) ? roleRes.data : [];
          isAdmin = (roles.includes("SuperAdmin") || roles.includes("WarehouseAdmin"));
          setIsSuperAdmin(isAdmin);
        } catch {
          // fallback: treat as non-admin
        }

        const wRes = await WarehouseService.warehouseGet("1");
        console.log("OrderForm: Warehouse ResponseRaw", wRes);
        let allWarehouses: any[] = [];
        if (wRes && wRes.success && Array.isArray(wRes.data)) {
          allWarehouses = wRes.data;
        } else if (Array.isArray(wRes)) {
          allWarehouses = wRes;
        }

        if (isAdmin) {
          // SuperAdmin sees all warehouses
          setWarehouses(allWarehouses);
        } else {
          // Regular user: filter to only their assigned warehouse from cookie
          const cookieWhId = Cookies.get("selectedWarehouseId");
          if (cookieWhId) {
            const filtered = allWarehouses.filter(
              (w) => String(w.warehouseId) === String(cookieWhId)
            );
            setWarehouses(filtered.length > 0 ? filtered : allWarehouses);
          } else {
            setWarehouses(allWarehouses);
          }
        }
      } catch (error) {
        console.error("OrderForm: Failed to fetch warehouses", error);
      }

      try {
        const tRes = await OrderTypeService.orderTypeGet("1");
        console.log("OrderForm: OrderType ResponseRaw", tRes);
        if (tRes && tRes.success && Array.isArray(tRes.data)) {
          setOrderTypes(tRes.data);
        } else if (Array.isArray(tRes)) {
          setOrderTypes(tRes);
        } else if (tRes && Array.isArray((tRes as any).data)) {
          setOrderTypes((tRes as any).data);
        }
      } catch (error) {
        console.error("OrderForm: Failed to fetch order types", error);
      }
    };
    fetchOptions();
  }, []);

  const filteredOrderTypes = useMemo(() => {
    if (!orderType) return orderTypes;

    // Output types: 1=All Outbound, 3=Open Outbound, 5=My Open Outbound
    if ([1, 3, 5].includes(orderType)) {
      return orderTypes.filter((t) =>
        t.name?.toLowerCase().includes("transfer order outbound") ||
        t.name?.toLowerCase().includes("sales order")
        // t.name?.toLowerCase().includes("work order")
      );
    }
    // Inbound types: 2=All Inbound, 4=Open Inbound, 6=My Open Inbound
    if ([2, 4, 6].includes(orderType)) {
      return orderTypes.filter((t) =>
        t.name?.toLowerCase().includes("transfer order inbound") ||
        t.name?.toLowerCase().includes("purchase order"),
      );
    }
    // Move order: 7
    if (orderType === 7) {
      return orderTypes.filter((t) =>
        t.name?.toLowerCase().includes("move order"),
      );
    }

    return orderTypes;
  }, [orderTypes, orderType]);

  // Pre-select Order Type and Warehouse based on context or existing order
  useEffect(() => {
    if (orderTypes.length > 0) {
      if (order?.orderTypeId) {
        setValue("orderTypeId", order.orderTypeId);
      } else if (orderType) {
        let searchStr = "";
        if ([1, 3, 5].includes(orderType)) searchStr = "Outbound";
        else if ([2, 4, 6].includes(orderType)) searchStr = "Inbound";
        else if (orderType === 7) searchStr = "Move";

        if (searchStr) {
          const matched = orderTypes.find((t) =>
            t.name?.toLowerCase().includes(searchStr.toLowerCase()),
          );
          if (matched) {
            setValue("orderTypeId", matched.orderTypeId as string);
          }
        }
      }
    }
  }, [orderType, orderTypes, order, setValue]);

  useEffect(() => {
    if (warehouses.length > 0) {
      if (order?.warehouseId) {
        setValue("warehouseId", order.warehouseId);
      } else if (!isSuperAdmin) {
        // Auto-select the assigned warehouse for non-SuperAdmin users
        const cookieWhId = Cookies.get("selectedWarehouseId");
        if (cookieWhId) {
          const match = warehouses.find(
            (w) => String(w.warehouseId) === String(cookieWhId)
          );
          if (match) setValue("warehouseId", match.warehouseId as string);
        } else if (warehouses.length === 1) {
          setValue("warehouseId", warehouses[0].warehouseId as string);
        }
      }
    }
  }, [warehouses, order, isSuperAdmin, setValue]);

  useEffect(() => {
    if (!order?.orderHeaderId) return;

    const fetchLines = async () => {
      try {
        const res: any = await OrderLineService.orderLineGet("1");

        if (res?.data && Array.isArray(res.data)) {
          const filteredLines = res.data.filter(
            (line: any) => line.orderHeaderId === order.orderHeaderId,
          );

          setLines(filteredLines);
        }
      } catch (error) {
        console.error("Failed to fetch order lines", error);
      }
    };

    fetchLines();
  }, [order]);

  const postOrderLines = async (orderHeaderId: string, currentOrderTypeId?: string) => {
    console.log("Posting lines for order:", orderHeaderId);
    console.log("Lines:", lines);

    const selectedType = orderTypes.find(t => t.orderTypeId === currentOrderTypeId);
    const typeName = selectedType?.name?.toLowerCase() || "";
    // Determine if outbound based on type name
    const isOutbound = typeName.includes("outbound") || typeName.includes("sales order");

    for (const line of lines) {
      const qty = Number(line.orderIncQty) || 0;

      const payload = {
        orderHeaderId,
        barcodeItemNum: line.barcodeItemNum,
        lineDescription: line.lineDescription,
        orderIncQty: !isOutbound ? qty : 0,
        orderDecQty: isOutbound ? qty : 0,
        unitOfMeasure: line.unitOfMeasure || "",
      };

      console.log("ORDER LINE PAYLOAD:", payload);

      await OrderLineService.orderLinePost("1", payload);
    }
  };

  useEffect(() => {
    if (order) {
      reset({
        clientOrderNum: order.clientOrderNum,
        orderDate: order.orderDate
          ? new Date(order.orderDate).toISOString().split("T")[0]
          : "",
        shipToAttention: order.shipToAttn,
        shipToName: order.shipToName,

        shipToAddress1: order.shipToAddress1,
        shipToAddress2: order.shipToAddress2,
        shipToCity: order.shipToCity,
        shipToState: order.shipToState,

        shipToZip: order.shipToZip,
        shipToCountry: order.shipToCountry,
        shipToPhone: order.shipToPhone,
        poNum: order.poNum,

        freightTerms: order.shipFreightTerms,
        shipMethod: order.shipMethod,
        dueDate: order.customerDueDate
          ? new Date(order.customerDueDate).toISOString().split("T")[0]
          : "",
        shipmentDeadline: order.shipmentDeadline
          ? new Date(order.shipmentDeadline).toISOString().split("T")[0]
          : "",

        freightAcc: order.freightAcctNumber,
        freightQuote: order.freightQuoteNum,
        freightQuoteAmount: order.freightQuotedAmount,
        shippingCharges: order.shippingAndHandlingCharge,

        receiptFromName: order.receiptFromName,
        receiptDeadline: order.receiptDeadline
          ? new Date(order.receiptDeadline).toISOString().split("T")[0]
          : "",
        comments: order.comments,
        discrepancyDetail: order.discrepancyDetail,

        warehouseId: order.warehouseId,
        orderTypeId: order.orderTypeId,
        documentClientId: order.documentClientId,
        custOrderNum: order.customerOrderNum,
        increasedItemNum: (order as any).increasedItemNum || "",
        increasedItemQty: (order as any).increasedItemQty || 0,
        increasedItemUnits: (order as any).increasedItemUnits || "",
      });
    } else {
      reset({
        clientOrderNum: "",
        orderDate: new Date().toISOString().split("T")[0],
        shipToAttention: "",
        shipToName: "",
        shipToAddress1: "",
        shipToAddress2: "",
        shipToCity: "",
        shipToState: "",
        shipToZip: "",
        shipToCountry: "",
        shipToPhone: "",
        poNum: "",
        freightTerms: "",
        shipMethod: "",
        dueDate: "",
        shipmentDeadline: "",
        freightAcc: "",
        freightQuote: "",
        freightQuoteAmount: 0,
        shippingCharges: 0,
        receiptFromName: "",
        receiptDeadline: "",
        comments: "",
        discrepancyDetail: "",
        warehouseId: "",
        orderTypeId: "",
        documentClientId: "",
        custOrderNum: "",
        increasedItemNum: "",
        increasedItemQty: 0,
        increasedItemUnits: "",
      });
    }
  }, [order, reset, open]);

  const onSubmit = async (data: any) => {
    if (lines.length === 0) {
      toast.error("Please add at least one item");
      return;
    }
    try {
      const payload: any = {
        warehouseId: data.warehouseId || "1",
        documentClientId: data.documentClientId || null,
        orderTypeId: data.orderTypeId || null,
        clientOrderNum: data.clientOrderNum || null,
        orderDate: data.orderDate
          ? new Date(data.orderDate).toISOString()
          : new Date().toISOString(),

        shipToAttn: data.shipToAttention || null,
        shipToName: data.shipToName || null,
        shipToAddress1: data.shipToAddress1 || null,
        shipToAddress2: data.shipToAddress2 || null,
        shipToCity: data.shipToCity || null,
        shipToState: data.shipToState || null,
        shipToZip: data.shipToZip || null,
        shipToCountry: data.shipToCountry || null,
        shipToPhone: data.shipToPhone || null,

        poNum: data.poNum || null,
        shipFreightTerms: data.freightTerms || null,
        shipMethod: data.shipMethod || null,
        customerOrderNum: data.custOrderNum || null,
        customerDueDate: data.dueDate
          ? new Date(data.dueDate).toISOString()
          : null,
        shipmentDeadline: data.shipmentDeadline
          ? new Date(data.shipmentDeadline).toISOString()
          : null,

        freightAcctNumber: data.freightAcc || null,
        freightQuoteNum: data.freightQuote || null,
        freightQuotedAmount: Number(data.freightQuoteAmount || 0),
        shippingAndHandlingCharge: Number(data.shippingCharges || 0),

        receiptFromName: data.receiptFromName || null,
        receiptDeadline: data.receiptDeadline
          ? new Date(data.receiptDeadline).toISOString()
          : null,
        comments: data.comments || null,
        discrepancyDetail: data.discrepancyDetail || "",

        increasedItemNum: data.increasedItemNum || null,
        increasedItemQty: data.increasedItemQty ? Number(data.increasedItemQty) : null,
        increasedItemUnits: data.increasedItemUnits || null,
      };

      console.log("ORDER PAYLOAD:", payload);

      let orderHeaderId = order?.orderHeaderId;

      if (order && orderHeaderId) {
        await OrderHeaderService.orderHeaderPut("1", {
          ...payload,
          orderHeaderId: orderHeaderId,
        } as any);
        toast.success("Order Updated Successfully");
      } else {
        const response: any = await OrderHeaderService.orderHeaderPost(
          "1",
          payload,
        );
        toast.success("Order Created Successfully");

        orderHeaderId =
          response?.data?.orderHeaderId || response?.orderHeaderId;
      }

      if (orderHeaderId) {
        await postOrderLines(orderHeaderId as string, payload.orderTypeId);
      }

      reset();
      onSuccess(orderHeaderId as string);
      onOpenChange(false);
    } catch (error: any) {
      console.log("FULL API ERROR:", error);
      console.log("ERROR BODY:", error?.body);
      console.log("VALIDATION ERRORS:", error?.body?.errors);

      toast.error(error?.body?.message || "Order submission failed");
    }
  };

  const content = (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* HEADER */}
      <div className="px-5 py-3 sm:px-6 sm:py-4 flex justify-between items-center shrink-0 border-b bg-card whitespace-nowrap">
        <button
          type="button"
          onClick={() => navigate(backRoute)}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </button>
        <h2 className="text-lg font-semibold">{order ? "Edit Order" : "Create New Order"}</h2>
        <div className="w-20" />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("FORM VALIDATION ERRORS:", errors);
          toast.error("Please fill in all required fields");
        })}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 sm:space-y-10">
          {/* ORDER INFORMATION SECTION */}
          <section>
            <div className="border-l-4 border-primary pl-3 mb-5">
              <h3 className="text-base font-bold tracking-tight">Order Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold opacity-90">Client Doc. Num</Label>
                <Input
                  {...register("clientOrderNum")}
                  disabled={isReadOnly}
                  placeholder="Enter document number"
                  className={`h-9 ${errors.clientOrderNum ? "border-red-500" : ""}`}
                />
                {errors.clientOrderNum && (
                  <p className="text-[10px] text-red-500">{errors.clientOrderNum.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Order Date</Label>
                <Controller
                  name="orderDate"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <DatePickerInput
                        value={field.value as string}
                        onChange={field.onChange}
                        disabled={isReadOnly}
                        placeholder="Select date"
                      />
                      {errors.orderDate && (
                        <p className="text-[10px] text-red-500">{errors.orderDate.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Warehouse</Label>
                <Controller
                  name="warehouseId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger
                        className={`h-9 ${errors.warehouseId ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((w) => (
                          <SelectItem key={w.warehouseId} value={w.warehouseId as string}>
                            {w.warehouseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.warehouseId && (
                  <p className="text-[10px] text-red-500">{errors.warehouseId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Order Type</Label>
                <Controller
                  name="orderTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger
                        className={`h-9 ${errors.orderTypeId ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredOrderTypes.map((type) => (
                          <SelectItem key={type.orderTypeId} value={type.orderTypeId as string}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.orderTypeId && (
                  <p className="text-[10px] text-red-500">{errors.orderTypeId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Document Client ID</Label>
                <Input
                  {...register("documentClientId")}
                  disabled={isReadOnly}
                  placeholder="Client ID"
                  className={`h-9 ${errors.documentClientId ? "border-red-500" : ""}`}
                />
                {errors.documentClientId && (
                  <p className="text-[10px] text-red-500">{errors.documentClientId.message}</p>
                )}
              </div>

              {/* Conditional PO Number for Sales Orders / Increased Item for Work Orders */}
              {(() => {
                const selectedTypeId = watch("orderTypeId");
                const selectedType = orderTypes.find(t => t.orderTypeId === selectedTypeId);
                const typeName = selectedType?.name?.toLowerCase() || "";

                if (typeName.includes("sales order")) {
                  return (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold opacity-90">PO Number</Label>
                      <Input
                        {...register("poNum")}
                        disabled={isReadOnly}
                        placeholder="Enter PO number"
                        className={`h-9 ${errors.poNum ? "border-red-500" : ""}`}
                      />
                      {errors.poNum && (
                        <p className="text-[10px] text-red-500">{errors.poNum.message}</p>
                      )}
                    </div>
                  );
                } else if (typeName.includes("work order")) {
                  return (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Increased Item Num.</Label>
                        <Input
                          {...register("increasedItemNum")}
                          disabled={isReadOnly}
                          placeholder="Item Number"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Increased Item Qty</Label>
                        <Input
                          type="number"
                          {...register("increasedItemQty")}
                          disabled={isReadOnly}
                          placeholder="Quantity"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Increased Item Units</Label>
                        <Input
                          {...register("increasedItemUnits")}
                          disabled={isReadOnly}
                          placeholder="Units"
                          className="h-9"
                        />
                      </div>
                    </>
                  );
                }
                return null;
              })()}
            </div>
          </section>

          {/* SHIPPING ADDRESS SECTION */}
          <section>
            <div className="border-l-4 border-primary pl-3 mb-5">
              <h3 className="text-base font-bold tracking-tight">Shipping Address</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold opacity-90">Attention</Label>
                <Input
                  {...register("shipToAttention")}
                  disabled={isReadOnly}
                  placeholder="Recipient name"
                  className={`h-9 ${errors.shipToAttention ? "border-red-500" : ""}`}
                />
                {errors.shipToAttention && (
                  <p className="text-[10px] text-red-500">{errors.shipToAttention.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ship To Name</Label>
                <Input
                  {...register("shipToName")}
                  disabled={isReadOnly}
                  placeholder="Company/name"
                  className={`h-9 ${errors.shipToName ? "border-red-500" : ""}`}
                />
                {errors.shipToName && (
                  <p className="text-[10px] text-red-500">{errors.shipToName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Address 1</Label>
                <Input
                  {...register("shipToAddress1")}
                  disabled={isReadOnly}
                  placeholder="Street address"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Address 2</Label>
                <Input
                  {...register("shipToAddress2")}
                  disabled={isReadOnly}
                  placeholder="Apartment, suite (optional)"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">City</Label>
                <Input
                  {...register("shipToCity")}
                  disabled={isReadOnly}
                  placeholder="City"
                  className={`h-9 ${errors.shipToCity ? "border-red-500" : ""}`}
                />
                {errors.shipToCity && (
                  <p className="text-[10px] text-red-500">{errors.shipToCity.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">State</Label>
                <Input
                  type="text"
                  {...register("shipToState")}
                  disabled={isReadOnly}
                  placeholder="State/Province"
                  className={`h-9 ${errors.shipToState ? "border-red-500" : ""}`}
                />
                {errors.shipToState && (
                  <p className="text-[10px] text-red-500">{errors.shipToState.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Zip Code</Label>
                <Input
                  {...register("shipToZip")}
                  disabled={isReadOnly}
                  placeholder="Postal code"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Country</Label>
                <Input
                  {...register("shipToCountry")}
                  disabled={isReadOnly}
                  placeholder="Country"
                  className={`h-9 ${errors.shipToCountry ? "border-red-500" : ""}`}
                />
                {errors.shipToCountry && (
                  <p className="text-[10px] text-red-500">{errors.shipToCountry.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone</Label>
                <Input
                  type="number"
                  {...register("shipToPhone")}
                  disabled={isReadOnly}
                  placeholder="Contact number"
                  className={`h-9 ${errors.shipToPhone ? "border-red-500" : ""}`}
                />
                {errors.shipToPhone && (
                  <p className="text-[10px] text-red-500">{errors.shipToPhone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Customer Order #</Label>
                <Input
                  {...register("custOrderNum")}
                  disabled={isReadOnly}
                  placeholder="Customer PO"
                  className="h-9"
                />
              </div>
            </div>
          </section>

          {/* SHIPPING DETAILS SECTION - Hidden for Work Orders */}
          {(() => {
            const selectedTypeId = watch("orderTypeId");
            const selectedType = orderTypes.find(t => t.orderTypeId === selectedTypeId);
            const isWorkOrder = selectedType?.name?.toLowerCase().includes("");

            if (isWorkOrder) return null;

            return (
              <section>
                <div className="border-l-4 border-primary pl-3 mb-5">
                  <h3 className="text-base font-bold tracking-tight">Shipping Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Freight Terms</Label>
                    <Input
                      {...register("freightTerms")}
                      disabled={isReadOnly}
                      placeholder="e.g., FOB, CIF"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ship Method</Label>
                    <Input
                      {...register("shipMethod")}
                      disabled={isReadOnly}
                      placeholder="e.g., Ground, Air"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Due Date</Label>
                    <Controller
                      name="dueDate"
                      control={control}
                      render={({ field }) => (
                        <DatePickerInput
                          value={field.value as string}
                          onChange={field.onChange}
                          disabled={isReadOnly}
                          placeholder="Customer due date"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Shipment Deadline</Label>
                    <Controller
                      name="shipmentDeadline"
                      control={control}
                      render={({ field }) => (
                        <DatePickerInput
                          value={field.value as string}
                          onChange={field.onChange}
                          disabled={isReadOnly}
                          placeholder="Deadline"
                        />
                      )}
                    />
                  </div>
                </div>
              </section>
            );
          })()}

          {/* FREIGHT INFORMATION SECTION - Hidden for Work Orders */}
          {(() => {
            const selectedTypeId = watch("orderTypeId");
            const selectedType = orderTypes.find(t => t.orderTypeId === selectedTypeId);
            const isWorkOrder = selectedType?.name?.toLowerCase().includes("work order");

            if (isWorkOrder) return null;

            return (
              <section>
                <div className="border-l-4 border-primary pl-3 mb-5">
                  <h3 className="text-base font-bold tracking-tight">Freight Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold opacity-90">Freight Account #</Label>
                    <Input
                      {...register("freightAcc")}
                      disabled={isReadOnly}
                      placeholder="Account number"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Freight Quote #</Label>
                    <Input
                      {...register("freightQuote")}
                      disabled={isReadOnly}
                      placeholder="Quote number"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Freight Quote Amt.</Label>
                    <Input
                      type="number"
                      {...register("freightQuoteAmount")}
                      disabled={isReadOnly}
                      placeholder="Amount"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Shipping Charges</Label>
                    <Input
                      type="number"
                      {...register("shippingCharges")}
                      disabled={isReadOnly}
                      placeholder="Charges"
                      className="h-9"
                    />
                  </div>
                </div>
              </section>
            );
          })()}

          {/* RECEIPT & NOTES SECTION */}
          <section>
            <div className="border-l-4 border-primary pl-3 mb-5">
              <h3 className="text-base font-bold tracking-tight">Receipt & Additional Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold opacity-90">Receipt From Name</Label>
                <Input
                  {...register("receiptFromName")}
                  disabled={isReadOnly}
                  placeholder="Receipt recipient"
                  className={`h-9 ${errors.receiptFromName ? "border-red-500" : ""}`}
                />
                {errors.receiptFromName && (
                  <p className="text-[10px] text-red-500">{errors.receiptFromName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Receipt Deadline</Label>
                <Controller
                  name="receiptDeadline"
                  control={control}
                  render={({ field }) => (
                    <DatePickerInput
                      value={field.value as string}
                      onChange={field.onChange}
                      disabled={isReadOnly}
                      placeholder="Receipt deadline"
                    />
                  )}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label className="text-sm font-medium">Comments</Label>
                <Input
                  {...register("comments")}
                  disabled={isReadOnly}
                  placeholder="Additional comments"
                  className="h-9"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label className="text-sm font-medium">Discrepancy Detail</Label>
                <Input
                  {...register("discrepancyDetail")}
                  disabled={isReadOnly}
                  placeholder="Any discrepancies"
                  className="h-9"
                />
              </div>
            </div>
          </section>

          {!(order && orderType !== undefined && [1, 2, 3, 4, 5, 6].includes(orderType)) && (
            <section className="pt-6 border-t font-nunito">
              <div className="border-l-4 border-primary pl-3 mb-5">
                <h3 className="text-base font-bold tracking-tight">Order Items</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ADD LINE */}
                <div className="border rounded-lg p-3 sm:p-5 space-y-4">
                  <h4 className="font-semibold text-sm">Add Item to Order</h4>

                  {/* SCANNER */}
                  <div className="rounded-md border border-dashed p-1 sm:p-3">
                    <Scanner
                      onScan={(code: string) => {
                        setBarcode(code);
                        handleBarcodeBlur(code);
                      }}
                      onBlur={handleBarcodeBlur}
                    />
                  </div>

                  {/* INPUT FIELDS */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Description</Label>
                      <Input
                        placeholder="Item description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Quantity</Label>
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Unit</Label>
                        <Input
                          placeholder="UOM"
                          value={units}
                          onChange={(e) => setUnits(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      type="button"
                      className="flex-1"
                      disabled={!barcode || !quantity}
                      onClick={() => {
                        if (!barcode || !quantity) {
                          toast.error("Barcode and Quantity required");
                          return;
                        }
                        const qty = Number(quantity);
                        if (isNaN(qty)) {
                          toast.error("Valid Quantity required");
                          return;
                        }
                        const newLine: CreateOrderLineCommand = {
                          orderHeaderId: "",
                          barcodeItemNum: barcode,
                          lineDescription: description,
                          orderIncQty: qty,
                          unitOfMeasure: units,
                        };
                        setLines((prev) => [...prev, newLine]);
                        setBarcode("");
                        setDescription("");
                        setQuantity("");
                        setUnits("");
                      }}
                    >
                      Add Item
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setBarcode("");
                        setDescription("");
                        setQuantity("");
                        setUnits("");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {/* ORDER LINE TABLE */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Items Added</h4>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full border">
                      {lines.length} item{lines.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    {/* Desktop view */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader className="bg-muted/50 border-b">
                          <TableRow>
                            <TableHead className="text-xs font-bold uppercase tracking-wider border-r px-4">Item</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider border-r px-4">Description</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider border-r px-4">Qty</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider border-r px-4">UOM</TableHead>
                            <TableHead className="text-right text-xs font-bold uppercase tracking-wider px-4">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lines.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="h-24 text-center text-gray-500 text-sm"
                              >
                                No items added yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            lines.map((line, index) => (
                              <TableRow key={index} className="hover:bg-muted/30 transition-colors border-b">
                                <TableCell className="text-sm font-medium border-r px-4">
                                  {line.barcodeItemNum}
                                </TableCell>
                                <TableCell className="text-sm border-r px-4 max-w-[200px] truncate">
                                  {line.lineDescription}
                                </TableCell>
                                <TableCell className="text-sm font-bold border-r px-4">
                                  {line.orderIncQty?.toString() || "0"}
                                </TableCell>
                                <TableCell className="text-sm border-r px-4 italic opacity-70">
                                  {line.unitOfMeasure}
                                </TableCell>
                                <TableCell className="text-right px-4">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                                    onClick={() =>
                                      setLines(lines.filter((_, i) => i !== index))
                                    }
                                  >
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y">
                      {lines.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                          No items added yet
                        </div>
                      ) : (
                        lines.map((line, index) => (
                          <div key={index} className="p-4 space-y-3 bg-card">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Item #</p>
                                <p className="text-sm font-bold">{line.barcodeItemNum}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-red-600 font-bold hover:text-red-700 hover:bg-red-50 -mt-2 -mr-2"
                                onClick={() =>
                                  setLines(lines.filter((_, i) => i !== index))
                                }
                              >
                                Remove
                              </Button>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Description</p>
                              <p className="text-sm">{line.lineDescription || "No description"}</p>
                            </div>
                            <div className="flex gap-8">
                              <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Quantity</p>
                                <p className="text-sm font-bold">{line.orderIncQty?.toString() || "0"}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">UOM</p>
                                <p className="text-sm">{line.unitOfMeasure || "-"}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* FOOTER BUTTONS - STICKY */}
        <div className="shrink-0 p-4 sm:p-6 border-t bg-card flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none px-6 h-10 font-bold"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {!isReadOnly && (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-8 h-10 font-bold shadow-lg"
            >
              {isSubmitting ? "Saving..." : "Save Order"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );

  if (useDialog) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl h-full sm:h-[90vh] w-full overflow-hidden p-0 rounded-none sm:rounded-lg">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
