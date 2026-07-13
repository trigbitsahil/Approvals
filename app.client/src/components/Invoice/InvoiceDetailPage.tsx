import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Save,
  X,
  Plus,
  Trash2,
  Check,
  ChevronsUpDown,
  Package,
  Receipt,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

import { InvoicesService } from "@/api/services/InvoicesService";
import { InvoiceLinesService } from "@/api/services/InvoiceLinesService";
import { CustomerService } from "@/api/services/CustomerService";
import { InventoryItemService } from "@/api/services/InventoryItemService";
import { BillingItemService } from "@/api/services/BillingItemService";
import { ProjectService } from "@/api/services/ProjectService";

import { CustomerListVM } from "@/api/models/CustomerListVM";
import { ProjectListVM } from "@/api/models/ProjectListVM";
import { InventoryItemListVM } from "@/api/models/InventoryItemListVM";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BillingItemVM {
  billingItemId?: string | null;
  name?: string | null;
  description?: string | null;
  rate?: number;
  itemNum?: string | null;
}

type LineItemType = "InventoryItem" | "BillingItem";

interface InvoiceLineItem {
  invoiceLineId?: string;
  lineItemType: LineItemType;
  inventoryItemId: string;
  billingItemId: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  taxPercentage: number;
  amount: number;
  lineNum?: number;
}

interface InvoiceHeader {
  invoiceId?: string;
  customerId?: string;
  projectId?: string;
  invoiceNumber?: string;
  orderNumber?: string;
  invoiceDate?: string;
  terms?: string;
  dueDate?: string;
  salesperson?: string;
  taxType?: string;
  customerNotes?: string;
  termsConditions?: string;
  subTotal?: number;
  shippingCharges?: number;
  adjustmentName?: string;
  adjustmentValue?: number;
  roundOff?: number;
  totalAmount?: number;
  taxAmount?: number;
  status?: string;
  isRecurring?: boolean;
}

// ─── Combobox ─────────────────────────────────────────────────────────────────

interface ComboboxItem { value: string; label: string; sublabel?: string; }

function Combobox({
  items, value, onValueChange, placeholder = "Select...", searchPlaceholder = "Search...",
  emptyText = "No items found.", disabled = false, loading = false, className,
}: {
  items: ComboboxItem[]; value: string; onValueChange: (v: string) => void;
  placeholder?: string; searchPlaceholder?: string; emptyText?: string;
  disabled?: boolean; loading?: boolean; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = items.find((i) => i.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline" role="combobox" aria-expanded={open}
          disabled={disabled || loading}
          className={cn("w-full justify-between font-normal text-left", !value && "text-muted-foreground", className)}
        >
          {loading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading...
            </span>
          ) : selected ? <span className="truncate">{selected.label}</span> : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem key={item.value} value={`${item.label} ${item.sublabel ?? ""}`}
                  onSelect={() => { onValueChange(item.value); setOpen(false); }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span className="text-sm">{item.label}</span>
                    {item.sublabel && <span className="text-xs text-muted-foreground">{item.sublabel}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusStyle(status?: string) {
  const s = (status || "DRAFT").toUpperCase();
  switch (s) {
    case "PAID":   return { label: "PAID",   cls: "text-green-500 bg-green-500/10 border-green-500/30" };
    case "SENT":   return { label: "SENT",   cls: "text-blue-500 bg-blue-500/10 border-blue-500/30" };
    case "VOIDED": return { label: "VOIDED", cls: "text-red-400 bg-red-400/10 border-red-400/30" };
    default:       return { label: "DRAFT",  cls: "text-orange-500 bg-orange-500/10 border-orange-500/30" };
  }
}

function fmt(n?: number) {
  return (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Loading / Edit
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Data
  const [header, setHeader] = useState<InvoiceHeader>({});
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([]);

  // Lookup data
  const [customers, setCustomers] = useState<CustomerListVM[]>([]);
  const [projects, setProjects] = useState<ProjectListVM[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItemListVM[]>([]);
  const [billingItems, setBillingItems] = useState<BillingItemVM[]>([]);

  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // ── Load invoice + lines ──────────────────────────────────────────────────

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
      loadLookups();
    }
  }, [id]);

  const fetchInvoice = async (invoiceId: string) => {
    try {
      setLoading(true);
      const [invRes, linesRes] = await Promise.all([
        InvoicesService.getInvoiceById(invoiceId, "1.0"),
        InvoiceLinesService.getInvoiceLines(invoiceId, "1.0"),
      ]);

      if (invRes?.success && invRes?.data) {
        setHeader(invRes.data);
      } else {
        toast.error("Failed to load invoice.");
      }

      if (linesRes?.success && linesRes?.data) {
        const mapped: InvoiceLineItem[] = linesRes.data.map((l: any) => ({
          invoiceLineId: l.invoiceLineId,
          lineItemType: l.itemType || "InventoryItem",
          inventoryItemId: l.inventoryItemId || "",
          billingItemId: l.billingItemId || "",
          description: l.lineDescription || "",
          quantity: l.quantity || 1,
          rate: l.unitPrice || 0,
          discount: l.discountValue || 0,
          taxPercentage: l.taxPercentage || 0,
          amount: l.totalPrice || 0,
          lineNum: l.lineNum,
        }));
        setLineItems(mapped);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading invoice.");
    } finally {
      setLoading(false);
    }
  };

  // ── Load lookups (only when entering edit mode) ───────────────────────────

  const loadLookups = async () => {
    setLoadingCustomers(true);
    setLoadingProjects(true);
    setLoadingInventory(true);
    setLoadingBilling(true);
    setCustomerError(null);
    try {
      const [custRes, projRes, invRes, billRes] = await Promise.all([
        CustomerService.getApiVCustomer("1.0"),
        ProjectService.projectGet("1.0"),
        InventoryItemService.inventoryItemGet("1.0"),
        BillingItemService.billingItemGet("1"),
      ]);
      if (custRes?.success && custRes?.data) setCustomers(custRes.data);
      else setCustomerError("Failed to load customers.");
      if (projRes?.success && projRes?.data) setProjects(projRes.data);
      if (invRes?.success && invRes?.data) setInventoryItems(invRes.data);
      if (billRes?.success && billRes?.data) setBillingItems(billRes.data);
    } catch (err: any) {
      setCustomerError(err?.message || "Error loading lookup data.");
    } finally {
      setLoadingCustomers(false);
      setLoadingProjects(false);
      setLoadingInventory(false);
      setLoadingBilling(false);
    }
  };

  const handleEnterEditMode = () => {
    setIsEditMode(true);
    if (customers.length === 0) loadLookups();
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (id) fetchInvoice(id);
  };

  // ─── Combobox items ───────────────────────────────────────────────────────

  const customerComboItems = useMemo<ComboboxItem[]>(() =>
    customers.map((c) => ({
      value: c.customerId as string,
      label: [c.firstName, c.lastName].filter(Boolean).join(" ") || c.companyName || c.customerId || "Unknown",
      sublabel: c.companyName ?? c.email ?? undefined,
    })), [customers]);

  const projectComboItems = useMemo<ComboboxItem[]>(() =>
    projects.map((p) => ({ value: p.projectId as string, label: p.name || p.projectId || "Unknown" })), [projects]);

  const inventoryComboItems = useMemo<ComboboxItem[]>(() =>
    inventoryItems.map((itm) => ({
      value: itm.inventoryItemId as string,
      label: itm.productDescription || "Unnamed Item",
      sublabel: itm.ownerBarcodeItemNum ? `Code: ${itm.ownerBarcodeItemNum}` : undefined,
    })), [inventoryItems]);

  const billingComboItems = useMemo<ComboboxItem[]>(() =>
    billingItems.map((b) => ({
      value: b.billingItemId as string,
      label: b.itemNum || "Unnamed Billing Item",
      sublabel: b.description ?? undefined,
    })), [billingItems]);

  // ─── Line item handlers ───────────────────────────────────────────────────

  const recalcAmount = (item: InvoiceLineItem): InvoiceLineItem => ({
    ...item,
    amount: item.quantity * item.rate * (1 - item.discount / 100),
  });

  const handleLineChange = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    const updated = [...lineItems];
    const numericFields = ["quantity", "rate", "discount", "taxPercentage"] as const;
    if (numericFields.includes(field as any)) {
      (updated[index] as any)[field] = Number(value) || 0;
      updated[index] = recalcAmount(updated[index]);
    } else {
      (updated[index] as any)[field] = value;
    }
    setLineItems(updated);
  };

  const handleInventorySelect = (index: number, itemId: string) => {
    const selected = inventoryItems.find((i) => i.inventoryItemId === itemId);
    const updated = [...lineItems];
    updated[index] = recalcAmount({
      ...updated[index], lineItemType: "InventoryItem", inventoryItemId: itemId,
      billingItemId: "", description: selected?.productDescription || "", rate: selected?.lastPricePaid || 0,
    });
    setLineItems(updated);
  };

  const handleBillingSelect = (index: number, itemId: string) => {
    const selected = billingItems.find((b) => b.billingItemId === itemId);
    const updated = [...lineItems];
    updated[index] = recalcAmount({
      ...updated[index], lineItemType: "BillingItem", billingItemId: itemId,
      inventoryItemId: "", description: selected?.description || selected?.name || "", rate: selected?.rate || 0,
    });
    setLineItems(updated);
  };

  const handleLineTypeToggle = (index: number, type: LineItemType) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], lineItemType: type, inventoryItemId: "", billingItemId: "", description: "", rate: 0, amount: 0 };
    setLineItems(updated);
  };

  const handleAddRow = () => {
    setLineItems([...lineItems, {
      lineItemType: "InventoryItem", inventoryItemId: "", billingItemId: "",
      description: "", quantity: 1, rate: 0, discount: 0, taxPercentage: 0, amount: 0,
    }]);
  };

  const handleRemoveRow = (index: number) => {
    if (lineItems.length === 1) { toast.warning("Must have at least one line item."); return; }
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // ─── Totals ───────────────────────────────────────────────────────────────

  const taxType = (header.taxType || "TaxExclusive") as "TaxExclusive" | "TaxInclusive" | "OutOfScope";
  const subTotal = lineItems.reduce((s, l) => s + l.amount, 0);
  const taxAmount = useMemo(() => {
    if (taxType === "TaxExclusive") return lineItems.reduce((s, l) => s + (l.amount * l.taxPercentage) / 100, 0);
    if (taxType === "TaxInclusive") return lineItems.reduce((s, l) => s + (l.amount * l.taxPercentage) / (100 + l.taxPercentage), 0);
    return 0;
  }, [lineItems, taxType]);
  const baseTotal = taxType === "TaxExclusive" ? subTotal + taxAmount : subTotal;
  const netTotal = baseTotal + (header.shippingCharges || 0) + (header.adjustmentValue || 0);
  const grandTotal = Math.round(netTotal * 100) / 100;
  const roundOff = Math.round((grandTotal - netTotal) * 100) / 100;

  // ─── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!header.customerId) { toast.error("Please select a customer."); return; }
    try {
      setSaving(true);
      const updatedHeader = {
        ...header,
        subTotal,
        taxAmount,
        totalAmount: grandTotal,
        roundOff,
      };
      const headerRes = await InvoicesService.updateInvoice("1.0", updatedHeader);
      if (!headerRes?.success) throw new Error(headerRes?.message || "Failed to update invoice.");

      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "_");
      await Promise.all(lineItems.map((line, index) => {
        const payload = {
          invoiceLineId: line.invoiceLineId || `InvcLine_${datePart}_${Math.random().toString(36).substring(2, 9)}`,
          invoiceId: header.invoiceId,
          lineNum: line.lineNum ?? index + 1,
          lineDescription: line.description || "Line Item",
          quantity: line.quantity,
          unitPrice: line.rate,
          discountValue: line.discount,
          discountType: "Percent",
          taxId: "-",
          taxPercentage: line.taxPercentage,
          totalPrice: line.amount,
          itemType: line.lineItemType,
          inventoryItemId: line.lineItemType === "InventoryItem" ? line.inventoryItemId : null,
          billingItemId: line.lineItemType === "BillingItem" ? line.billingItemId : "-",
          isVoided: false,
          tenantId: "",
        };
        return line.invoiceLineId
          ? InvoiceLinesService.updateInvoiceLine("1.0", payload)
          : InvoiceLinesService.createInvoiceLine("1.0", payload);
      }));

      toast.success("Invoice updated successfully!");
      setIsEditMode(false);
      if (id) fetchInvoice(id);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error saving invoice.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusStyle(header.status);

  return (
    <div className="flex flex-col min-h-screen bg-background border border-border rounded-md shadow-sm overflow-hidden">

      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate("/Invoice")} className="hover:bg-muted shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 truncate">
                <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                <span className="truncate">{header.invoiceNumber || header.invoiceId || "Invoice"}</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {header.invoiceDate ? new Date(header.invoiceDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}
              </p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${statusInfo.cls}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {isEditMode ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={saving} className="gap-1.5">
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={handleEnterEditMode} className="gap-1.5">
              <Pencil className="h-4 w-4" /> Edit Invoice
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* ── Summary Cards (View mode only) ── */}
        {!isEditMode && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Subtotal", value: `₹${fmt(header.subTotal)}` },
              { label: "Tax", value: `₹${fmt(header.taxAmount)}` },
              { label: "Shipping", value: `₹${fmt(header.shippingCharges)}` },
              { label: "Total Amount", value: `₹${fmt(header.totalAmount)}`, highlight: true },
            ].map((card) => (
              <div key={card.label} className={`rounded-xl border p-4 ${card.highlight ? "border-blue-500/30 bg-blue-500/5" : "border-border bg-muted/30"}`}>
                <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                <p className={`text-lg font-bold mt-1 font-mono ${card.highlight ? "text-blue-500" : "text-foreground"}`}>{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Row 1: Customer & Invoice Number ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Customer Name</Label>
            {isEditMode ? (
              <>
                {customerError && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-2 py-1.5 rounded">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {customerError}
                  </div>
                )}
                <Combobox
                  items={customerComboItems}
                  value={header.customerId || ""}
                  onValueChange={(v) => setHeader({ ...header, customerId: v })}
                  placeholder="Select a customer..."
                  searchPlaceholder="Search customers..."
                  emptyText="No customers found."
                  loading={loadingCustomers}
                />
              </>
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[38px] flex items-center">
                {(() => {
                  const c = customers.find(x => x.customerId === header.customerId);
                  const name = c ? ([c.firstName, c.lastName].filter(Boolean).join(" ") || c.companyName) : null;
                  return name || header.customerId || <span className="text-muted-foreground">—</span>;
                })()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Invoice Number</Label>
            {isEditMode ? (
              <Input value={header.invoiceNumber || ""} onChange={(e) => setHeader({ ...header, invoiceNumber: e.target.value })} placeholder="INV-000000" />
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-mono text-foreground min-h-[38px] flex items-center">
                {header.invoiceNumber || <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Order Number</Label>
            {isEditMode ? (
              <Input value={header.orderNumber || ""} onChange={(e) => setHeader({ ...header, orderNumber: e.target.value })} placeholder="PO-0000" />
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-mono text-foreground min-h-[38px] flex items-center">
                {header.orderNumber || <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>
        </div>

        {/* ── Row 2: Dates, Terms, Salesperson ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Invoice Date</Label>
            {isEditMode ? (
              <Input type="date" value={header.invoiceDate ? header.invoiceDate.split("T")[0] : ""} onChange={(e) => setHeader({ ...header, invoiceDate: e.target.value })} />
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[38px] flex items-center">
                {header.invoiceDate ? new Date(header.invoiceDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Terms</Label>
            {isEditMode ? (
              <Select value={header.terms || "Due on Receipt"} onValueChange={(v) => setHeader({ ...header, terms: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 45">Net 45</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[38px] flex items-center">
                {header.terms || <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Due Date</Label>
            {isEditMode ? (
              <Input type="date" value={header.dueDate ? header.dueDate.split("T")[0] : ""} onChange={(e) => setHeader({ ...header, dueDate: e.target.value })} />
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[38px] flex items-center">
                {header.dueDate ? new Date(header.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Salesperson</Label>
            {isEditMode ? (
              <Input value={header.salesperson || ""} onChange={(e) => setHeader({ ...header, salesperson: e.target.value })} placeholder="Name" />
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[38px] flex items-center">
                {header.salesperson || <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>
        </div>

        {/* ── Row 3: Tax Type & Project ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Tax Type</Label>
            {isEditMode ? (
              <Select value={header.taxType || "TaxExclusive"} onValueChange={(v) => setHeader({ ...header, taxType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TaxExclusive">Tax Exclusive</SelectItem>
                  <SelectItem value="TaxInclusive">Tax Inclusive</SelectItem>
                  <SelectItem value="OutOfScope">Out of Scope</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[38px] flex items-center">
                {header.taxType || "TaxExclusive"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Status</Label>
            {isEditMode ? (
              <Select value={header.status || "Draft"} onValueChange={(v) => setHeader({ ...header, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Voided">Voided</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[38px] flex items-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.cls}`}>{statusInfo.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Line Items Table ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Line Items</h2>
            {isEditMode && (
              <Button variant="outline" size="sm" onClick={handleAddRow} className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Row
              </Button>
            )}
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 w-[40px]">#</th>
                    {isEditMode && <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Type</th>}
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Item</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Description</th>
                    <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Qty</th>
                    <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Rate (₹)</th>
                    <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Disc %</th>
                    <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Tax %</th>
                    <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Amount (₹)</th>
                    {isEditMode && <th className="w-[50px]"></th>}
                  </tr>
                </thead>
                <tbody>
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan={isEditMode ? 10 : 8} className="text-center py-8 text-muted-foreground text-sm">
                        No line items found.
                      </td>
                    </tr>
                  ) : lineItems.map((line, index) => (
                    <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground font-mono">{(line.lineNum ?? index + 1)}</td>

                      {isEditMode && (
                        <td className="px-4 py-3">
                          <div className="flex rounded-md border border-border overflow-hidden w-fit">
                            <button
                              onClick={() => handleLineTypeToggle(index, "InventoryItem")}
                              className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors ${line.lineItemType === "InventoryItem" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                            >
                              <Package className="h-3 w-3" /> Inv
                            </button>
                            <button
                              onClick={() => handleLineTypeToggle(index, "BillingItem")}
                              className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors ${line.lineItemType === "BillingItem" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                            >
                              <Receipt className="h-3 w-3" /> Bill
                            </button>
                          </div>
                        </td>
                      )}

                      <td className="px-4 py-3 min-w-[160px]">
                        {isEditMode ? (
                          line.lineItemType === "InventoryItem" ? (
                            <Combobox items={inventoryComboItems} value={line.inventoryItemId} onValueChange={(v) => handleInventorySelect(index, v)}
                              placeholder="Select item..." loading={loadingInventory} className="text-xs" />
                          ) : (
                            <Combobox items={billingComboItems} value={line.billingItemId} onValueChange={(v) => handleBillingSelect(index, v)}
                              placeholder="Select billing item..." loading={loadingBilling} className="text-xs" />
                          )
                        ) : (
                          <span className="text-foreground font-medium">
                            {line.lineItemType === "InventoryItem"
                              ? (inventoryItems.find(i => i.inventoryItemId === line.inventoryItemId)?.productDescription || line.inventoryItemId || "—")
                              : (billingItems.find(b => b.billingItemId === line.billingItemId)?.name || line.billingItemId || "—")}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 min-w-[180px]">
                        {isEditMode ? (
                          <Input value={line.description} onChange={(e) => handleLineChange(index, "description", e.target.value)}
                            placeholder="Description" className="h-8 text-xs" />
                        ) : (
                          <span className="text-muted-foreground">{line.description || "—"}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isEditMode ? (
                          <Input type="number" min="1" value={line.quantity} onChange={(e) => handleLineChange(index, "quantity", e.target.value)}
                            className="h-8 text-xs text-right w-20 ml-auto" />
                        ) : (
                          <span className="font-mono">{line.quantity}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isEditMode ? (
                          <Input type="number" min="0" value={line.rate} onChange={(e) => handleLineChange(index, "rate", e.target.value)}
                            className="h-8 text-xs text-right w-28 ml-auto" />
                        ) : (
                          <span className="font-mono">{fmt(line.rate)}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isEditMode ? (
                          <Input type="number" min="0" max="100" value={line.discount} onChange={(e) => handleLineChange(index, "discount", e.target.value)}
                            className="h-8 text-xs text-right w-20 ml-auto" />
                        ) : (
                          <span className="font-mono">{line.discount}%</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isEditMode ? (
                          <Input type="number" min="0" max="100" value={line.taxPercentage} onChange={(e) => handleLineChange(index, "taxPercentage", e.target.value)}
                            className="h-8 text-xs text-right w-20 ml-auto" />
                        ) : (
                          <span className="font-mono">{line.taxPercentage}%</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                        ₹{fmt(isEditMode ? line.amount : line.amount)}
                      </td>

                      {isEditMode && (
                        <td className="px-2 py-3">
                          <button onClick={() => handleRemoveRow(index)}
                            className="rounded p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Totals Section ── */}
        <div className="flex flex-col items-end gap-0">
          <div className="w-full max-w-sm space-y-2 rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono font-medium">₹{fmt(isEditMode ? subTotal : header.subTotal)}</span>
            </div>
            {(isEditMode ? taxAmount : (header.taxAmount || 0)) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-mono font-medium">₹{fmt(isEditMode ? taxAmount : header.taxAmount)}</span>
              </div>
            )}
            {/* Shipping */}
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground">Shipping</span>
              {isEditMode ? (
                <Input type="number" min="0" value={header.shippingCharges || 0}
                  onChange={(e) => setHeader({ ...header, shippingCharges: Number(e.target.value) })}
                  className="h-7 text-xs text-right w-28" />
              ) : (
                <span className="font-mono font-medium">₹{fmt(header.shippingCharges)}</span>
              )}
            </div>
            {/* Adjustment */}
            <div className="flex justify-between text-sm items-center">
              {isEditMode ? (
                <Input value={header.adjustmentName || "Adjustment"} onChange={(e) => setHeader({ ...header, adjustmentName: e.target.value })}
                  className="h-7 text-xs w-32" placeholder="Adjustment name" />
              ) : (
                <span className="text-muted-foreground">{header.adjustmentName || "Adjustment"}</span>
              )}
              {isEditMode ? (
                <Input type="number" value={header.adjustmentValue || 0}
                  onChange={(e) => setHeader({ ...header, adjustmentValue: Number(e.target.value) })}
                  className="h-7 text-xs text-right w-28" />
              ) : (
                <span className="font-mono font-medium">₹{fmt(header.adjustmentValue)}</span>
              )}
            </div>
            {(isEditMode ? Math.abs(roundOff) : Math.abs(header.roundOff || 0)) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Round Off</span>
                <span className="font-mono font-medium">₹{fmt(isEditMode ? roundOff : header.roundOff)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-border pt-3 mt-1">
              <span className="text-foreground">Total</span>
              <span className="font-mono text-blue-500">₹{fmt(isEditMode ? grandTotal : header.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* ── Notes & Terms ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Customer Notes</Label>
            {isEditMode ? (
              <Textarea value={header.customerNotes || ""} onChange={(e) => setHeader({ ...header, customerNotes: e.target.value })}
                placeholder="Thanks for your business." rows={3} />
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[80px]">
                {header.customerNotes || <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Terms & Conditions</Label>
            {isEditMode ? (
              <Textarea value={header.termsConditions || ""} onChange={(e) => setHeader({ ...header, termsConditions: e.target.value })}
                placeholder="Enter terms and conditions..." rows={3} />
            ) : (
              <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground min-h-[80px]">
                {header.termsConditions || <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
