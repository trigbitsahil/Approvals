"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
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
    X,
    Loader2,
    Plus,
    ArrowLeft,
    Check,
    ChevronsUpDown,
    Package,
    Receipt,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

// Service imports
import { CustomerService } from "@/api/services/CustomerService";
import { ProjectService } from "@/api/services/ProjectService";
import { InventoryItemService } from "@/api/services/InventoryItemService";
import { InvoicesService } from "@/api/services/InvoicesService";
import { InvoiceLinesService } from "@/api/services/InvoiceLinesService";
import { BillingItemService } from "@/api/services/BillingItemService";

// Type imports
import { CustomerListVM } from "@/api/models/CustomerListVM";
import { ProjectListVM } from "@/api/models/ProjectListVM";
import { InventoryItemListVM } from "@/api/models/InventoryItemListVM";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BillingItemVM {
    billingItemId?: string | null;
    name?: string | null;
    description?: string | null;
    rate?: number;
    itemNum?: string | null;
    unitOfMeasure?: string | null;
}

type LineItemType = "InventoryItem" | "BillingItem";

interface InvoiceLineItem {
    lineItemType: LineItemType;
    inventoryItemId: string;
    billingItemId: string;
    description: string;
    quantity: number;
    rate: number;
    discount: number;
    taxPercentage: number;
    amount: number;
}

// ─── Combobox Component ───────────────────────────────────────────────────────

interface ComboboxItem {
    value: string;
    label: string;
    sublabel?: string;
}

function Combobox({
    items,
    value,
    onValueChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyText = "No items found.",
    disabled = false,
    loading = false,
    className,
}: {
    items: ComboboxItem[];
    value: string;
    onValueChange: (val: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const selected = items.find((i) => i.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled || loading}
                    className={cn(
                        "w-full justify-between font-normal text-left",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    {loading ? (
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Loading...
                        </span>
                    ) : selected ? (
                        <span className="truncate">{selected.label}</span>
                    ) : (
                        placeholder
                    )}
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
                                <CommandItem
                                    key={item.value}
                                    value={`${item.label} ${item.sublabel ?? ""}`}
                                    onSelect={() => {
                                        onValueChange(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm">{item.label}</span>
                                        {item.sublabel && (
                                            <span className="text-xs text-muted-foreground">{item.sublabel}</span>
                                        )}
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

// ─── Main Component ───────────────────────────────────────────────────────────

export const InvoiceForm = () => {
    const navigate = useNavigate();

    // ── Loading / saving states
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [loadingInventory, setLoadingInventory] = useState(false);
    const [loadingBilling, setLoadingBilling] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [saving, setSaving] = useState(false);

    // ── Lookup errors
    const [customerError, setCustomerError] = useState<string | null>(null);
    const [inventoryError, setInventoryError] = useState<string | null>(null);
    const [billingError, setBillingError] = useState<string | null>(null);

    // ── Lookup data
    const [customers, setCustomers] = useState<CustomerListVM[]>([]);
    const [projects, setProjects] = useState<ProjectListVM[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItemListVM[]>([]);
    const [billingItems, setBillingItems] = useState<BillingItemVM[]>([]);

    // ── Header form state
    const [customerId, setCustomerId] = useState<string>("");
    const [projectId, setProjectId] = useState<string>("");
    const [invoiceNumber, setInvoiceNumber] = useState<string>("");
    const [orderNumber, setOrderNumber] = useState<string>("");
    const [invoiceDate, setInvoiceDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [terms, setTerms] = useState<string>("Due on Receipt");
    const [dueDate, setDueDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [salesperson, setSalesperson] = useState<string>("");
    const [taxType, setTaxType] = useState<"TaxExclusive" | "TaxInclusive" | "OutOfScope">(
        "TaxExclusive"
    );
    const [customerNotes, setCustomerNotes] = useState<string>("Thanks for your business.");
    const [termsConditions, setTermsConditions] = useState<string>("");
    const [isRecurring, setIsRecurring] = useState<boolean>(false);

    // ── Line items
    const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
        {
            lineItemType: "InventoryItem",
            inventoryItemId: "",
            billingItemId: "",
            description: "",
            quantity: 1,
            rate: 0,
            discount: 0,
            taxPercentage: 0,
            amount: 0,
        },
    ]);

    // ── Totals extras
    const [shippingCharges, setShippingCharges] = useState<number>(0);
    const [adjustmentName, setAdjustmentName] = useState<string>("Adjustment");
    const [adjustmentValue, setAdjustmentValue] = useState<number>(0);

    // ── Invoice numbering
    const [prefMode, setPrefMode] = useState<"auto" | "manual">("auto");
    const [prefPrefix] = useState<string>("INV-");
    const [prefNext] = useState<string>(
        Math.floor(100000 + Math.random() * 900000).toString()
    );

    // ─── Effects ──────────────────────────────────────────────────────────────

    useEffect(() => {
        if (prefMode === "auto") {
            setInvoiceNumber(`${prefPrefix}${prefNext}`);
        }
        loadCustomers();
        loadProjects();
        loadInventoryItems();
        loadBillingItems();
    }, []);

    // Auto-calculate due date from invoice date + payment terms
    useEffect(() => {
        if (!invoiceDate) return;
        const date = new Date(invoiceDate);
        const termDays: Record<string, number> = {
            "Net 15": 15,
            "Net 30": 30,
            "Net 45": 45,
            "Net 60": 60,
        };
        const days = termDays[terms];
        if (days) date.setDate(date.getDate() + days);
        setDueDate(date.toISOString().split("T")[0]);
    }, [invoiceDate, terms]);

    // ─── Data loaders ─────────────────────────────────────────────────────────

    const loadCustomers = async () => {
        try {
            setLoadingCustomers(true);
            setCustomerError(null);
            const res = await CustomerService.getApiVCustomer("1.0");
            if (res?.success && res?.data) {
                setCustomers(res.data);
            } else {
                setCustomerError("Failed to load customers.");
            }
        } catch (err: any) {
            console.error("Customer load error:", err);
            setCustomerError(err?.message || "Network error loading customers.");
        } finally {
            setLoadingCustomers(false);
        }
    };

    const loadProjects = async () => {
        try {
            setLoadingProjects(true);
            const res = await ProjectService.projectGet("1.0");
            if (res?.success && res?.data) {
                setProjects(res.data);
            }
        } catch (err) {
            console.error("Project load error:", err);
        } finally {
            setLoadingProjects(false);
        }
    };

    const loadInventoryItems = async () => {
        try {
            setLoadingInventory(true);
            setInventoryError(null);
            const res = await InventoryItemService.inventoryItemGet("1.0");
            if (res?.success && res?.data) {
                setInventoryItems(res.data);
            } else {
                setInventoryError("Failed to load inventory items.");
            }
        } catch (err: any) {
            console.error("Inventory load error:", err);
            setInventoryError(err?.message || "Network error loading inventory items.");
        } finally {
            setLoadingInventory(false);
        }
    };

    const loadBillingItems = async () => {
        try {
            setLoadingBilling(true);
            setBillingError(null);
            const res = await BillingItemService.billingItemGet("1");
            if (res?.success && res?.data) {
                setBillingItems(res.data);
            } else {
                setBillingError("Failed to load billing items.");
            }
        } catch (err: any) {
            console.error("Billing items load error:", err);
            setBillingError(err?.message || "Network error loading billing items.");
        } finally {
            setLoadingBilling(false);
        }
    };

    // ─── Memoized combobox data ───────────────────────────────────────────────

    const customerComboItems = useMemo<ComboboxItem[]>(
        () =>
            customers.map((c) => ({
                value: c.customerId as string,
                label:
                    [c.firstName, c.lastName].filter(Boolean).join(" ") ||
                    c.companyName ||
                    c.customerId ||
                    "Unknown",
                sublabel: c.companyName
                    ? [c.firstName, c.lastName].filter(Boolean).join(" ")
                        ? c.companyName
                        : undefined
                    : c.email ?? undefined,
            })),
        [customers]
    );

    const projectComboItems = useMemo<ComboboxItem[]>(
        () =>
            projects.map((p) => ({
                value: p.projectId as string,
                label: p.name || p.projectId || "Unknown",
            })),
        [projects]
    );

    const inventoryComboItems = useMemo<ComboboxItem[]>(
        () =>
            inventoryItems.map((itm) => ({
                value: itm.inventoryItemId as string,
                label: itm.productDescription || "Unnamed Item",
                sublabel: itm.ownerBarcodeItemNum
                    ? `Code: ${itm.ownerBarcodeItemNum}  ${itm.productUom ? `| UOM: ${itm.productUom}` : ""}`
                    : undefined,
            })),
        [inventoryItems]
    );

    const billingComboItems = useMemo<ComboboxItem[]>(
        () =>
            billingItems.map((b) => ({
                value: b.billingItemId as string,
                label: b.itemNum || "Unnamed Billing Item",
                sublabel: b.description ?? undefined,
            })),
        [billingItems]
    );

    // ─── Line item handlers ───────────────────────────────────────────────────

    const recalcAmount = (item: InvoiceLineItem): InvoiceLineItem => {
        const amount = item.quantity * item.rate * (1 - item.discount / 100);
        return { ...item, amount };
    };

    const handleInventoryItemSelect = (index: number, itemId: string) => {
        const selectedItem = inventoryItems.find((itm) => itm.inventoryItemId === itemId);
        const updated = [...lineItems];
        updated[index] = recalcAmount({
            ...updated[index],
            lineItemType: "InventoryItem",
            inventoryItemId: itemId,
            billingItemId: "",
            description: selectedItem?.productDescription || "",
            rate: selectedItem?.lastPricePaid || 0,
        });
        setLineItems(updated);
    };

    const handleBillingItemSelect = (index: number, itemId: string) => {
        const selectedItem = billingItems.find((b) => b.billingItemId === itemId);
        const updated = [...lineItems];
        updated[index] = recalcAmount({
            ...updated[index],
            lineItemType: "BillingItem",
            billingItemId: itemId,
            inventoryItemId: "",
            description: selectedItem?.description || selectedItem?.name || "",
            rate: selectedItem?.rate || 0,
        });
        setLineItems(updated);
    };

    const handleLineChange = (
        index: number,
        field: keyof InvoiceLineItem,
        value: string | number
    ) => {
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

    const handleLineTypeToggle = (index: number, type: LineItemType) => {
        const updated = [...lineItems];
        updated[index] = {
            ...updated[index],
            lineItemType: type,
            inventoryItemId: "",
            billingItemId: "",
            description: "",
            rate: 0,
            amount: 0,
        };
        setLineItems(updated);
    };

    const handleAddRow = () => {
        setLineItems([
            ...lineItems,
            {
                lineItemType: "InventoryItem",
                inventoryItemId: "",
                billingItemId: "",
                description: "",
                quantity: 1,
                rate: 0,
                discount: 0,
                taxPercentage: 0,
                amount: 0,
            },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        if (lineItems.length === 1) {
            toast.warning("Invoices must have at least one line item.");
            return;
        }
        setLineItems(lineItems.filter((_, i) => i !== index));
    };

    // ─── Totals ───────────────────────────────────────────────────────────────

    const subTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);

    const taxAmount = useMemo(() => {
        if (taxType === "TaxExclusive") {
            return lineItems.reduce(
                (sum, item) => sum + (item.amount * item.taxPercentage) / 100,
                0
            );
        } else if (taxType === "TaxInclusive") {
            return lineItems.reduce(
                (sum, item) =>
                    sum + (item.amount * item.taxPercentage) / (100 + item.taxPercentage),
                0
            );
        }
        return 0;
    }, [lineItems, taxType]);

    const baseTotal = taxType === "TaxExclusive" ? subTotal + taxAmount : subTotal;
    const netTotalBeforeAdjustments = baseTotal + shippingCharges + adjustmentValue;
    const grandTotal = Math.round(netTotalBeforeAdjustments * 100) / 100;
    const roundOff = Math.round((grandTotal - netTotalBeforeAdjustments) * 100) / 100;

    // ─── Save ─────────────────────────────────────────────────────────────────

    const handleSave = async (status: "Draft" | "Sent") => {
        if (!customerId) {
            toast.error("Please select a customer.");
            return;
        }
        if (!invoiceNumber) {
            toast.error("Please provide an invoice number.");
            return;
        }
        if (
            lineItems.some(
                (line) =>
                    (line.lineItemType === "InventoryItem" && !line.inventoryItemId) ||
                    (line.lineItemType === "BillingItem" && !line.billingItemId)
            )
        ) {
            toast.error("Please select an item for all line rows.");
            return;
        }

        try {
            setSaving(true);

            const headerPayload = {
                customerId,
                projectId: projectId && projectId !== "none" ? projectId : null,
                invoiceNumber,
                orderNumber: orderNumber || null,
                invoiceDate: new Date(invoiceDate).toISOString(),
                terms,
                dueDate: new Date(dueDate).toISOString(),
                salesperson: salesperson || null,
                taxType,
                priceListId: "-",
                customerNotes: customerNotes || null,
                termsConditions: termsConditions || null,
                subTotal,
                shippingCharges,
                adjustmentName: adjustmentName || "Adjustment",
                adjustmentValue,
                roundOff,
                totalAmount: grandTotal,
                taxAmount,
                status,
                isRecurring,
                isVoided: false,
                tenantId: "",
            };

            const headerRes = await InvoicesService.createInvoice("1.0", headerPayload);

            if (!headerRes.success) {
                throw new Error(headerRes.message || "Failed to create invoice header.");
            }

            const createdInvoiceId = headerRes.data?.invoiceId;
            if (!createdInvoiceId) {
                throw new Error("Server did not return an invoiceId.");
            }

            await Promise.all(
                lineItems.map((line, index) => {
                    const linePayload = {
                        invoiceId: createdInvoiceId,
                        lineNum: index + 1,
                        lineDescription: line.description || "Line Item",
                        quantity: line.quantity,
                        unitPrice: line.rate,
                        discountValue: line.discount,
                        discountType: "Percent",
                        taxId: "-",
                        taxPercentage: line.taxPercentage,
                        totalPrice: line.amount,
                        itemType: line.lineItemType,
                        inventoryItemId:
                            line.lineItemType === "InventoryItem" ? line.inventoryItemId : null,
                        billingItemId:
                            line.lineItemType === "BillingItem" ? line.billingItemId : "-",
                        isVoided: false,
                        tenantId: "",
                    };
                    return InvoiceLinesService.createInvoiceLine("1.0", linePayload);
                })
            );

            toast.success(`Invoice ${invoiceNumber} created as ${status}!`);
            navigate("/Invoice");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Error saving invoice.");
        } finally {
            setSaving(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    const isInitialLoading = loadingCustomers && customers.length === 0;

    return (
        <div className="flex flex-col min-h-screen bg-background border border-border rounded-md shadow-sm overflow-hidden">

            {/* ── Top Header ── */}
            <div className="flex items-center justify-between p-4 border-b border-border shadow-sm">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/invoices")}
                        className="hover:bg-muted"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-foreground">New Invoice</h1>
                    {isInitialLoading && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Loading data...
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground text-xs gap-1.5"
                        onClick={() => {
                            const next = prefMode === "auto" ? "manual" : "auto";
                            setPrefMode(next);
                            if (next === "auto") {
                                setInvoiceNumber(`${prefPrefix}${prefNext}`);
                            }
                        }}
                    >
                        Numbering: {prefMode === "auto" ? "Auto" : "Manual"}
                    </Button>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

                {/* ── Row 1: Customer & Invoice Number ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Customer */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-foreground font-medium">
                                Customer Name <span className="text-red-500">*</span>
                            </Label>
                            {customerError && (
                                <button
                                    onClick={loadCustomers}
                                    className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400"
                                >
                                    <RefreshCw className="h-3 w-3" /> Retry
                                </button>
                            )}
                        </div>
                        {customerError && (
                            <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-2 py-1.5 rounded">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {customerError}
                            </div>
                        )}
                        <Combobox
                            items={customerComboItems}
                            value={customerId}
                            onValueChange={setCustomerId}
                            placeholder="Select a customer..."
                            searchPlaceholder="Search customers..."
                            emptyText="No customers found."
                            loading={loadingCustomers}
                        />
                    </div>

                    {/* Invoice Number */}
                    <div className="space-y-2">
                        <Label className="text-foreground font-medium">
                            Invoice Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            disabled={prefMode === "auto"}
                            placeholder="INV-000000"
                        />
                    </div>

                    {/* Order Number */}
                    <div className="space-y-2">
                        <Label className="text-foreground font-medium">Order Number</Label>
                        <Input
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="PO-0000"
                        />
                    </div>
                </div>

                {/* ── Row 2: Dates, Terms, Salesperson ── */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label className="text-foreground font-medium">Invoice Date *</Label>
                        <Input
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-foreground font-medium">Terms</Label>
                        <Select value={terms} onValueChange={setTerms}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                                <SelectItem value="Net 15">Net 15</SelectItem>
                                <SelectItem value="Net 30">Net 30</SelectItem>
                                <SelectItem value="Net 45">Net 45</SelectItem>
                                <SelectItem value="Net 60">Net 60</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-foreground font-medium">Due Date</Label>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            disabled
                            className="bg-muted/50 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-foreground font-medium">Salesperson</Label>
                        <Input
                            value={salesperson}
                            onChange={(e) => setSalesperson(e.target.value)}
                            placeholder="Name"
                        />
                    </div>
                </div>

                {/* ── Row 3: Tax Type & Project ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-foreground font-medium">Tax Type</Label>
                        <Select
                            value={taxType}
                            onValueChange={(val) => setTaxType(val as typeof taxType)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TaxExclusive">Tax Exclusive</SelectItem>
                                <SelectItem value="TaxInclusive">Tax Inclusive</SelectItem>
                                <SelectItem value="OutOfScope">Out of Scope</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-foreground font-medium">Associate Project</Label>
                        <Combobox
                            items={[{ value: "none", label: "None" }, ...projectComboItems]}
                            value={projectId || "none"}
                            onValueChange={(v) => setProjectId(v === "none" ? "" : v)}
                            placeholder="Select a project..."
                            searchPlaceholder="Search projects..."
                            emptyText="No projects found."
                            loading={loadingProjects}
                        />
                    </div>
                </div>

                {/* ── Line Items Table ── */}
                <div className="border border-border rounded-md bg-card shadow-sm overflow-hidden">
                    <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-foreground">Item Details</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {loadingInventory && (
                                <span className="flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Loading inventory...
                                </span>
                            )}
                            {loadingBilling && (
                                <span className="flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Loading billing items...
                                </span>
                            )}
                            {inventoryError && (
                                <button
                                    onClick={loadInventoryItems}
                                    className="flex items-center gap-1 text-amber-500 hover:text-amber-400"
                                >
                                    <RefreshCw className="h-3 w-3" /> Retry inventory
                                </button>
                            )}
                            {billingError && (
                                <button
                                    onClick={loadBillingItems}
                                    className="flex items-center gap-1 text-amber-500 hover:text-amber-400"
                                >
                                    <RefreshCw className="h-3 w-3" /> Retry billing
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-muted/20 border-b border-border text-muted-foreground font-medium text-xs">
                                    <th className="p-3 w-8">#</th>
                                    <th className="p-3 w-[90px]">Type</th>
                                    <th className="p-3 min-w-[260px]">Item &amp; Description</th>
                                    <th className="p-3 w-16 text-center">Qty</th>
                                    <th className="p-3 w-28 text-right">Rate (₹)</th>
                                    <th className="p-3 w-20 text-center">Disc (%)</th>
                                    <th className="p-3 w-32 text-center">Tax (%)</th>
                                    <th className="p-3 w-28 text-right">Amount (₹)</th>
                                    <th className="p-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((item, index) => (
                                    <tr key={index} className="border-b border-border hover:bg-muted/5">

                                        {/* Row number */}
                                        <td className="p-3 text-muted-foreground text-xs">{index + 1}</td>

                                        {/* Item type toggle */}
                                        <td className="p-3">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => handleLineTypeToggle(index, "InventoryItem")}
                                                    className={cn(
                                                        "flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors",
                                                        item.lineItemType === "InventoryItem"
                                                            ? "bg-blue-500/10 border-blue-500/40 text-blue-500"
                                                            : "border-border text-muted-foreground hover:border-blue-400/50"
                                                    )}
                                                >
                                                    <Package className="h-3 w-3" /> Inv
                                                </button>
                                                <button
                                                    onClick={() => handleLineTypeToggle(index, "BillingItem")}
                                                    className={cn(
                                                        "flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors",
                                                        item.lineItemType === "BillingItem"
                                                            ? "bg-violet-500/10 border-violet-500/40 text-violet-500"
                                                            : "border-border text-muted-foreground hover:border-violet-400/50"
                                                    )}
                                                >
                                                    <Receipt className="h-3 w-3" /> Bill
                                                </button>
                                            </div>
                                        </td>

                                        {/* Item selector & description */}
                                        <td className="p-3 space-y-2">
                                            {item.lineItemType === "InventoryItem" ? (
                                                <Combobox
                                                    items={inventoryComboItems}
                                                    value={item.inventoryItemId}
                                                    onValueChange={(val) => handleInventoryItemSelect(index, val)}
                                                    placeholder="Select inventory item..."
                                                    searchPlaceholder="Search inventory..."
                                                    emptyText={
                                                        inventoryError
                                                            ? "Error loading items. Retry above."
                                                            : "No inventory items found."
                                                    }
                                                    loading={loadingInventory}
                                                />
                                            ) : (
                                                <Combobox
                                                    items={billingComboItems}
                                                    value={item.billingItemId}
                                                    onValueChange={(val) => handleBillingItemSelect(index, val)}
                                                    placeholder="Select billing item..."
                                                    searchPlaceholder="Search billing items..."
                                                    emptyText={
                                                        billingError
                                                            ? "Error loading items. Retry above."
                                                            : "No billing items found."
                                                    }
                                                    loading={loadingBilling}
                                                />
                                            )}
                                            <Input
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleLineChange(index, "description", e.target.value)
                                                }
                                                placeholder="Item description..."
                                                className="text-xs"
                                            />
                                        </td>

                                        {/* Quantity */}
                                        <td className="p-3">
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleLineChange(index, "quantity", e.target.value)
                                                }
                                                className="text-center w-16 mx-auto"
                                            />
                                        </td>

                                        {/* Rate */}
                                        <td className="p-3">
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.rate}
                                                onChange={(e) =>
                                                    handleLineChange(index, "rate", e.target.value)
                                                }
                                                className="text-right w-24 ml-auto"
                                            />
                                        </td>

                                        {/* Discount */}
                                        <td className="p-3">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={item.discount}
                                                onChange={(e) =>
                                                    handleLineChange(index, "discount", e.target.value)
                                                }
                                                className="text-center w-16 mx-auto"
                                            />
                                        </td>

                                        {/* Tax */}
                                        <td className="p-3">
                                            <Select
                                                value={item.taxPercentage.toString()}
                                                onValueChange={(val) =>
                                                    handleLineChange(index, "taxPercentage", val)
                                                }
                                                disabled={taxType === "OutOfScope"}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">No Tax (0%)</SelectItem>
                                                    <SelectItem value="5">GST 5%</SelectItem>
                                                    <SelectItem value="12">GST 12%</SelectItem>
                                                    <SelectItem value="18">GST 18%</SelectItem>
                                                    <SelectItem value="28">GST 28%</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>

                                        {/* Amount */}
                                        <td className="p-3 text-right font-medium text-foreground tabular-nums">
                                            ₹
                                            {item.amount.toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>

                                        {/* Remove */}
                                        <td className="p-3 text-center">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Remove Line</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Remove this line item from the invoice?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleRemoveRow(index)}
                                                            className="bg-red-500 hover:bg-red-600 text-white"
                                                        >
                                                            Remove
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Row */}
                    <div className="p-3 bg-muted/10 flex gap-3 border-t border-border">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddRow}
                            className="flex items-center gap-1.5 text-xs"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add Row
                        </Button>
                    </div>
                </div>

                {/* ── Totals & Notes ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Notes */}
                    <div className="md:col-span-7 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-foreground font-medium">Customer Notes</Label>
                            <Textarea
                                value={customerNotes}
                                onChange={(e) => setCustomerNotes(e.target.value)}
                                placeholder="Notes visible to the customer on the invoice..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground font-medium">Terms &amp; Conditions</Label>
                            <Textarea
                                value={termsConditions}
                                onChange={(e) => setTermsConditions(e.target.value)}
                                placeholder="Include payment policies, service terms..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-5 border border-border rounded-md p-5 bg-card space-y-4">
                        <h4 className="font-semibold text-sm text-foreground pb-2 border-b border-border">
                            Invoice Summary
                        </h4>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Sub Total</span>
                            <span className="font-medium tabular-nums">
                                ₹{subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {taxAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Tax ({taxType === "TaxInclusive" ? "Inclusive" : "Exclusive"})
                                </span>
                                <span className="font-medium tabular-nums">
                                    ₹{taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-sm gap-4">
                            <span className="text-muted-foreground whitespace-nowrap">Shipping</span>
                            <Input
                                type="number"
                                min="0"
                                value={shippingCharges}
                                onChange={(e) => setShippingCharges(Number(e.target.value) || 0)}
                                className="w-28 text-right text-xs h-8"
                            />
                        </div>

                        <div className="flex justify-between items-center text-sm gap-4">
                            <Input
                                value={adjustmentName}
                                onChange={(e) => setAdjustmentName(e.target.value)}
                                className="h-8 text-xs"
                                placeholder="Adjustment"
                            />
                            <Input
                                type="number"
                                value={adjustmentValue}
                                onChange={(e) => setAdjustmentValue(Number(e.target.value) || 0)}
                                className="w-28 text-right text-xs h-8"
                            />
                        </div>

                        {roundOff !== 0 && (
                            <div className="flex justify-between text-xs text-muted-foreground italic">
                                <span>Round Off</span>
                                <span className="tabular-nums">
                                    ₹{roundOff.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-base font-bold text-foreground border-t border-border pt-4">
                            <span>Total (₹)</span>
                            <span className="text-lg text-primary tabular-nums">
                                ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 pt-2 text-xs">
                            <input
                                type="checkbox"
                                id="isRecurring"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="h-4 w-4 accent-primary rounded cursor-pointer"
                            />
                            <Label
                                htmlFor="isRecurring"
                                className="cursor-pointer font-medium text-muted-foreground select-none"
                            >
                                Make this invoice recurring
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Sticky Footer ── */}
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between sticky bottom-0 z-20">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleSave("Draft")}
                        disabled={saving}
                        className="hover:bg-muted text-sm"
                    >
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Save as Draft
                    </Button>
                    <Button
                        onClick={() => handleSave("Sent")}
                        disabled={saving}
                        className="text-white text-sm"
                    >
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Save and Send
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/invoices")}
                        className="text-sm text-muted-foreground"
                    >
                        Cancel
                    </Button>
                </div>

                {/* Line count info */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="gap-1">
                        <Package className="h-3 w-3" />
                        {lineItems.filter((l) => l.lineItemType === "InventoryItem").length} Inventory
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Receipt className="h-3 w-3" />
                        {lineItems.filter((l) => l.lineItemType === "BillingItem").length} Billing
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;
