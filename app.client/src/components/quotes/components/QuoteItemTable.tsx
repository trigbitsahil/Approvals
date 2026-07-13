import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, List, Loader2, GripVertical, MoreVertical, Calculator, ChevronDown } from 'lucide-react';
import { CreateCustomerQuoteLineCommand } from '@/api/models/CreateCustomerQuoteLineCommand';
import { InventoryItemService } from '@/api/services/InventoryItemService';
import { InventoryItemListVM } from '@/api/models/InventoryItemListVM';
import BulkAddItemsModal from './BulkAddItemsModal';
import { BillingItemService } from '@/api/services/BillingItemService';
import { BillingItemListVM } from '@/api/models/BillingItemListVM';
import { cn } from '@/utils/cn';


interface QuoteItemTableProps {
  lines: CreateCustomerQuoteLineCommand[];
  onChange: (lines: CreateCustomerQuoteLineCommand[]) => void;
}

// ─── Item Search Combobox (per row) ────────────────────────────────────────────
interface ItemSearchProps {
  value: string;
  items: any[];
  onSelect: (item: any) => void;
  onChange: (val: string) => void;
}

function ItemSearchInput({ value, items, onSelect, onChange }: ItemSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Sync external value changes
  useEffect(() => { setQuery(value || ''); }, [value]);

  // Compute dropdown position whenever it opens
  const updatePosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 2,
        left: rect.left,
        width: Math.max(rect.width, 340),
        zIndex: 9999,
      });
    }
  }, []);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, updatePosition]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query.trim()
    ? items.filter(i =>
      (i.productDescription || i.billingDescription || i.itemNum || '').toLowerCase().includes(query.toLowerCase()) ||
      (i.ownerBarcodeItemNum || '').toLowerCase().includes(query.toLowerCase())
    )
    : items;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (item: any) => {
    const name = item.productDescription || item.billingDescription || item.ownerBarcodeItemNum || item.itemNum || '';
    setQuery(name);
    onChange(name);
    onSelect(item);
    setOpen(false);
  };

  const inventoryFiltered = filtered.filter(i => !i.billingItemId);
  const billingFiltered = filtered.filter(i => !!i.billingItemId);

  const dropdown = open ? ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="bg-popover border border-border rounded-md shadow-2xl overflow-hidden"
    >
      <div className="max-h-[260px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">No items found</div>
        ) : (
          <>
            {inventoryFiltered.length > 0 && (
              <div className="pb-2">
                <div className="px-4 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">
                  📦 Inventory Items
                </div>
                {inventoryFiltered.map(item => (
                  <button
                    key={item.inventoryItemId}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur before click
                      handleSelect(item);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-primary hover:text-primary-foreground group border-b border-border/50 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-sm">{item.productDescription || item.ownerBarcodeItemNum || 'Unnamed Item'}</div>
                    {item.lastPricePaid != null && (
                      <div className="text-xs mt-0.5 text-muted-foreground group-hover:text-white/80">
                        Rate: ₹{item.lastPricePaid.toFixed(2)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {billingFiltered.length > 0 && (
              <div className="pt-1 pb-2">
                <div className="px-4 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 border-t border-border/50">
                  📋 Billing Items
                </div>
                {billingFiltered.map(item => (
                  <button
                    key={item.billingItemId}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur before click
                      handleSelect(item);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-primary hover:text-primary-foreground group border-b border-border/50 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-sm">{item.billingDescription || item.itemNum || 'Unnamed Item'}</div>
                    {item.saleUnitPrice != null && (
                      <div className="text-xs mt-0.5 text-muted-foreground group-hover:text-white/80">
                        Rate: ₹{item.saleUnitPrice.toFixed(2)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {/* <div className="border-t border-border p-2">
        <button
          type="button"
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium px-2 py-1.5 rounded hover:bg-blue-50 w-full"
        >
          <Plus className="h-4 w-4" />
          Add New Item
        </button>
      </div> */}
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={query}
        onChange={handleChange}
        onFocus={() => { updatePosition(); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Type or click to select an item."
        className="border-transparent hover:border-border focus:border-primary shadow-none h-10 bg-transparent"
      />
      {dropdown}
    </div>
  );
}

// ─── Main Table Component ───────────────────────────────────────────────────────
export default function QuoteItemTable({ lines, onChange }: QuoteItemTableProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemListVM[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [billingItems, setBillingItems] = useState<BillingItemListVM[]>([]);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragEnabledIndex, setDragEnabledIndex] = useState<number | null>(null);

  // Ensure stable keys
  lines.forEach((line, idx) => {
    if (!(line as any).id) {
      (line as any).id = (line as any).customerQuoteLineId || `line-${idx}-${Math.random().toString(36).substring(2, 5)}`;
    }
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());

    // Set draggedIndex after a small delay so browser captures the opaque drag image
    setTimeout(() => {
      setDraggedIndex(index);
    }, 0);
  };


  const loadAllItems = async () => {
    setLoadingItems(true);
    try {
      const [invRes, billRes] = await Promise.all([
        InventoryItemService.inventoryItemGet('1.0'),
        BillingItemService.billingItemGet('1')
      ]);

      setInventoryItems(invRes?.data || []);
      setBillingItems(billRes?.data || []);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoadingItems(false);
    }
  };
  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIdx) return;

    const updated = [...lines];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIdx, 0, draggedItem);

    onChange(updated);
    setDraggedIndex(targetIdx);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragEnabledIndex(null);
  };

  useEffect(() => {
    loadAllItems();
  }, []);

  const addLine = () => {
    const newLine: CreateCustomerQuoteLineCommand = {
      lineDescription: '',
      quoteToOrderQty: 1,
      priceValue: 0,
      lineTypeId: 'Inventoryitem',
      priceMethodId: '-',
      customerPartRefNum: '-',
    };
    onChange([...lines, newLine]);
  };

  const handleBulkAdd = (selected: any[]) => {
    const newLines: CreateCustomerQuoteLineCommand[] = selected.map(({ item, quantity, isBillingItem }) => ({
      lineId: isBillingItem ? item.billingItemId : item.inventoryItemId,
      lineDescription: item.productDescription || item.billingDescription || item.itemNum || '',
      quoteToOrderQty: quantity,
      priceValue: (item.lastPricePaid || item.saleUnitPrice || 0),
      lineTypeId: isBillingItem ? 'BillingItem' : 'Inventoryitem',   // Important
      priceMethodId: '-',
      customerPartRefNum: '-',
    }));
    onChange([...lines, ...newLines]);
  };

  const removeLine = (index: number) => {
    const updated = [...lines];
    updated.splice(index, 1);
    onChange(updated);
  };

  const updateLine = (index: number, field: string, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleItemSelect = (index: number, item: any) => {
    const isBilling = !!(item as any).billingItemId;

    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      lineDescription: item.productDescription || item.billingDescription || item.itemNum || '',
      priceValue: item.lastPricePaid || item.saleUnitPrice || 0,
      lineId: isBilling ? item.billingItemId : item.inventoryItemId,
      lineTypeId: isBilling ? 'BillingItem' : 'Inventoryitem',
      priceMethodId: '-',
      customerPartRefNum: '-',
    };
    onChange(updated);
  };

  return (
    <div className="bg-background">
      <div className="p-4 border-b border-border bg-[#f8f9fa] dark:bg-[#1a1b1c] flex justify-between items-center">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Item Table</h3>
        <div className="flex items-center gap-2">
          {loadingItems && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          <Select defaultValue="none">
            <SelectTrigger className="w-[200px] h-8 text-xs bg-background border-border">
              <SelectValue placeholder="Select Price List" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select Price List</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader className="bg-[#f8f9fa] dark:bg-[#1a1b1c] border-b border-border/80">
            <TableRow className="hover:bg-transparent">
              {/* Grip Header Cell */}
              <TableHead className="w-10 p-0 border-r border-border/60"></TableHead>
              <TableHead className="w-[35%] text-xs font-semibold text-muted-foreground uppercase border-r border-border/60 py-3">ITEM DETAILS</TableHead>
              <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase border-r border-border/60 w-[12%] py-3">QUANTITY</TableHead>
              <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase border-r border-border/60 w-[15%] py-3">
                <span className="inline-flex items-center gap-1.5 justify-end w-full">
                  RATE
                  <Calculator className="h-3.5 w-3.5 text-muted-foreground/60" />
                </span>
              </TableHead>
              <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase border-r border-border/60 w-[15%] py-3">DISCOUNT</TableHead>
              <TableHead className="text-left text-xs font-semibold text-muted-foreground uppercase border-r border-border/60 w-[15%] py-3">TAX</TableHead>
              <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase border-r border-border/60 w-[13%] py-3">AMOUNT</TableHead>
              {/* Actions Header Cell */}
              <TableHead className="w-16 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-8 text-muted-foreground italic">
                  No items added. Click below to add an item.
                </TableCell>
              </TableRow>
            ) : (
              lines.map((line, idx) => {
                const qty = line.quoteToOrderQty || 0;
                const rate = line.priceValue || 0;
                const discountValue = (line as any).discountValue || 0;
                const discountType = (line as any).discountType || 'percent';

                let amount = qty * rate;
                if (discountType === 'percent') {
                  amount = amount - (amount * (discountValue / 100));
                } else {
                  amount = amount - discountValue;
                }
                amount = Math.max(0, amount);

                const lineKey = (line as any).id;

                return (
                  <TableRow
                    key={lineKey}
                    draggable={idx === dragEnabledIndex}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "group border-b border-border/60 transition-all duration-150",
                      idx === draggedIndex ? "opacity-30 bg-primary/5 border-dashed border-primary" : "hover:bg-muted/10"
                    )}
                  >
                    {/* Grip Cell */}
                    <TableCell className="p-0 text-center border-r border-border/60 align-middle w-10">
                      <div
                        className="flex justify-center items-center w-full drag-handle cursor-grab active:cursor-grabbing"
                        onMouseDown={() => setDragEnabledIndex(idx)}
                        onMouseUp={() => setDragEnabledIndex(null)}
                        onMouseLeave={() => setDragEnabledIndex(null)}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground/30 hover:text-primary transition-colors" />
                      </div>
                    </TableCell>


                    {/* Item Details */}
                    <TableCell className="p-0 border-r border-border/60">
                      <ItemSearchInput
                        value={line.lineDescription || ''}
                        items={[...inventoryItems, ...billingItems]}
                        onSelect={(item) => handleItemSelect(idx, item)}
                        onChange={(val) => updateLine(idx, 'lineDescription', val)}
                      />
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="p-0 border-r border-border/60">
                      <Input
                        type="number"
                        step="0.01"
                        value={qty}
                        onChange={e => updateLine(idx, 'quoteToOrderQty', parseFloat(e.target.value) || 0)}
                        className="text-right border-transparent hover:border-border focus:border-primary shadow-none h-10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </TableCell>

                    {/* Rate */}
                    <TableCell className="p-0 border-r border-border/60">
                      <Input
                        type="number"
                        step="0.01"
                        value={rate}
                        onChange={e => updateLine(idx, 'priceValue', parseFloat(e.target.value) || 0)}
                        className="text-right border-transparent hover:border-border focus:border-primary shadow-none h-10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </TableCell>

                    {/* Discount */}
                    <TableCell className="p-0 border-r border-border/60">
                      <div className="flex items-center justify-end w-full h-10">
                        <Input
                          type="number"
                          value={discountValue}
                          onChange={e => updateLine(idx, 'discountValue', parseFloat(e.target.value) || 0)}
                          className="text-right border-transparent hover:border-border focus:border-primary shadow-none h-full w-full bg-transparent p-1 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Select
                          value={discountType}
                          onValueChange={val => updateLine(idx, 'discountType', val)}
                        >
                          <SelectTrigger className="w-14 h-full border-transparent hover:border-border focus:border-primary shadow-none bg-transparent px-2 rounded-none focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percent">%</SelectItem>
                            <SelectItem value="amount">₹</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>

                    {/* Tax */}
                    <TableCell className="p-0 border-r border-border/60">
                      <Select
                        value={(line as any).taxName || "none"}
                        onValueChange={(val) => {
                          let rate = 0;
                          if (val === "gst_5") rate = 5;
                          else if (val === "gst_12") rate = 12;
                          else if (val === "gst_18") rate = 18;
                          else if (val === "gst_28") rate = 28;

                          const updated = [...lines];
                          updated[idx] = {
                            ...updated[idx],
                            taxName: val,
                            taxRate: rate
                          } as any;
                          onChange(updated);
                        }}
                      >
                        <SelectTrigger className="w-full h-10 border-transparent hover:border-border focus:border-primary shadow-none bg-transparent px-3 rounded-none focus:ring-0 text-foreground">
                          <SelectValue placeholder="Select a Tax" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select a Tax</SelectItem>
                          <SelectItem value="gst_5">GST @ 5%</SelectItem>
                          <SelectItem value="gst_12">GST @ 12%</SelectItem>
                          <SelectItem value="gst_18">GST @ 18%</SelectItem>
                          <SelectItem value="gst_28">GST @ 28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="p-2 text-right border-r border-border/60 font-semibold text-foreground align-middle">
                      {amount.toFixed(3)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="p-2 align-middle w-16">
                      <div className="flex items-center gap-2 justify-center">
                        <button type="button" className="text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-600 transition-colors"
                          onClick={() => removeLine(idx)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-border flex gap-3">
        <div className="inline-flex rounded-md shadow-sm">
          <Button
            onClick={addLine}
            variant="outline"
            className="text-primary border-primary/20 hover:bg-primary/10 h-8 text-xs font-semibold rounded-r-none border-r-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add New Row
          </Button>
          <Button
            variant="outline"
            className="text-primary border-primary/20 hover:bg-primary/10 h-8 w-8 px-0 text-xs font-semibold rounded-l-none"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button
          onClick={() => setIsBulkAddOpen(true)}
          variant="outline"
          className="text-primary border-primary/20 hover:bg-primary/10 h-8 text-xs font-semibold"
        >
          <List className="h-3.5 w-3.5 mr-1" /> Add Items in Bulk
        </Button>
      </div>

      <BulkAddItemsModal
        open={isBulkAddOpen}
        onOpenChange={setIsBulkAddOpen}
        inventoryItems={inventoryItems}
        billingItems={billingItems}           // ← New prop
        onAddItems={handleBulkAdd}
      />
    </div>
  );
}
