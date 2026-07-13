import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InventoryItemListVM } from '@/api/models/InventoryItemListVM';
import { BillingItemListVM } from '@/api/models/BillingItemListVM';
import { X, CheckCircle2, Minus, Plus } from 'lucide-react';

interface BulkAddItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItems: InventoryItemListVM[];
  billingItems: BillingItemListVM[];           // ← Required now
  onAddItems: (items: {
    item: InventoryItemListVM | BillingItemListVM;
    quantity: number;
    isBillingItem?: boolean;
  }[]) => void;
}

export default function BulkAddItemsModal({
  open,
  onOpenChange,
  inventoryItems = [],
  billingItems = [],
  onAddItems
}: BulkAddItemsModalProps) {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  // Reset when modal opens
  React.useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedQuantities({});
    }
  }, [open]);

  // Combine both types of items
  const allItems = useMemo(() => {
    const inv = (inventoryItems || []).map(item => ({
      ...item,
      isBillingItem: false as const
    }));
    const bill = (billingItems || []).map(item => ({
      ...item,
      isBillingItem: true as const
    }));
    return [...inv, ...bill];
  }, [inventoryItems, billingItems]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems;

    const lowerQuery = searchQuery.toLowerCase();
    return allItems.filter(item => {
      const name = item.productDescription || item.billingDescription || item.itemNum || '';
      const code = item.ownerBarcodeItemNum || item.itemNum || '';
      return name.toLowerCase().includes(lowerQuery) ||
        code.toLowerCase().includes(lowerQuery);
    });
  }, [allItems, searchQuery]);

  const handleToggleItem = (item: any) => {
    const key = item.isBillingItem ? item.billingItemId : item.inventoryItemId;
    if (!key) return;

    setSelectedQuantities(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = 1;
      }
      return next;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setSelectedQuantities(prev => {
      const current = prev[id] || 0;
      const nextVal = current + delta;
      const next = { ...prev };
      if (nextVal <= 0) {
        delete next[id];
      } else {
        next[id] = nextVal;
      }
      return next;
    });
  };

  const selectedItemsList = useMemo(() => {
    const list: any[] = [];
    Object.keys(selectedQuantities).forEach(id => {
      const item = allItems.find(i =>
        (i.isBillingItem && i.billingItemId === id) ||
        (!i.isBillingItem && i.inventoryItemId === id)
      );
      if (item) {
        list.push({
          item,
          quantity: selectedQuantities[id],
          isBillingItem: item.isBillingItem
        });
      }
    });
    return list;
  }, [selectedQuantities, allItems]);

  const totalQuantity = useMemo(() => {
    return Object.values(selectedQuantities).reduce((a, b) => a + b, 0);
  }, [selectedQuantities]);

  const [activeTab, setActiveTab] = React.useState<'items' | 'selected'>('items');

  const handleAdd = () => {
    onAddItems(selectedItemsList);
    onOpenChange(false);
  }; return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden h-[85vh] max-h-[800px] flex flex-col bg-background gap-0 mx-2 sm:mx-auto" showClose={false}>
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Add Items in Bulk</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-red-500 hover:text-red-600">

          </Button>
        </div>

        {/* Mobile Tabs */}
        <div className="sm:hidden flex border-b border-border">
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'items' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground'
              }`}
            onClick={() => setActiveTab('items')}
          >
            All Items ({filteredItems.length})
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'selected' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground'
              }`}
            onClick={() => setActiveTab('selected')}
          >
            Selected ({selectedItemsList.length})
          </button>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
          {/* LEFT PANE */}
          <div className={`${activeTab === 'items' ? 'flex' : 'hidden'} sm:flex w-full sm:w-1/2 border-r border-border flex-col bg-muted/10 min-h-0`}>
            <div className="p-4 border-b border-border">
              <Input
                placeholder="Search inventory or billing items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 h-10 w-full rounded-md shadow-sm border-border bg-background"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
              {filteredItems.map((item: any) => {
                const key = item.isBillingItem ? item.billingItemId : item.inventoryItemId;
                const isSelected = !!selectedQuantities[key];
                const displayName = item.productDescription || item.billingDescription || item.itemNum || 'Unknown Item';

                return (
                  <div
                    key={key}
                    onClick={() => { handleToggleItem(item); if (window.innerWidth < 640) setActiveTab('selected'); }}
                    className={`flex justify-between items-center p-3 rounded-md cursor-pointer border transition-colors ${isSelected ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20' : 'border-transparent hover:bg-muted/50'}`}
                  >
                    <div>
                      <div className={`font-medium text-sm ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>
                        {displayName}
                      </div>
                      <div className="text-xs mt-1 text-muted-foreground">
                        {item.isBillingItem ? '📋 Billing Item' : '📦 Inventory Item'} •
                        Rate: ₹{item.lastPricePaid || item.saleUnitPrice || 0}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="text-center p-8 text-muted-foreground text-sm">
                  No items found.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE - Selected Items */}
          <div className={`${activeTab === 'selected' ? 'flex' : 'hidden'} sm:flex w-full sm:w-1/2 flex-col bg-background min-h-0`}>
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-foreground">Selected Items</h3>
                <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-semibold border border-border">
                  {selectedItemsList.length}
                </span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Total Quantity: {totalQuantity}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {selectedItemsList.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground text-sm">
                  Select items from the left panel
                </div>
              ) : (
                selectedItemsList.map(({ item, quantity, isBillingItem }) => {
                  const key = isBillingItem ? item.billingItemId : item.inventoryItemId;
                  return (
                    <div key={key} className="flex justify-between items-center group">
                      <div className="text-sm text-foreground flex-1 pr-4 truncate">
                        {item.productDescription || item.billingDescription || item.itemNum || 'Unknown Item'}
                      </div>
                      <div className="flex items-center border border-border rounded-md shadow-sm overflow-hidden bg-background">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-muted text-muted-foreground"
                          onClick={() => updateQuantity(key!, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x border-border">
                          {quantity}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-muted text-muted-foreground"
                          onClick={() => updateQuantity(key!, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-border flex gap-3 bg-muted/10">
              <Button
                onClick={handleAdd}
                className="bg-[#2eb872] hover:bg-[#28a164] text-white shadow-sm"
                disabled={selectedItemsList.length === 0}
              >
                Add Items
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="shadow-sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}