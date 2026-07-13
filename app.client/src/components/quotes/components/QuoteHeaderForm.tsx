import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Info } from 'lucide-react';
import { CustomerListVM } from '@/api/models/CustomerListVM';
import { AddressListVM } from '@/api/models/AddressListVM';
import { AddressService } from '@/api/services/AddressService';

interface QuoteHeaderFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
  customers: CustomerListVM[];
  useSimplifiedView?: boolean;
}

export default function QuoteHeaderForm({ data, onChange, customers, useSimplifiedView = false }: QuoteHeaderFormProps) {
  const [billingAddress, setBillingAddress] = useState<AddressListVM | null>(null);
  const [shippingAddress, setShippingAddress] = useState<AddressListVM | null>(null);

  // Quote Preferences Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prefMode, setPrefMode] = useState<'auto' | 'manual'>('auto');
  const [prefPrefix, setPrefPrefix] = useState('EST-');
  const [prefNext, setPrefNext] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  useEffect(() => {
    // Auto-populate quote name on mount for new quotes
    if (prefMode === 'auto' && !data.quoteName) {
      onChange('quoteName', `${prefPrefix}${prefNext}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.customerId) {
      loadAddresses(data.customerId);
    } else {
      setBillingAddress(null);
      setShippingAddress(null);
    }
  }, [data.customerId]);

  const loadAddresses = async (customerId: string) => {
    try {
      const res = await AddressService.getApiVAddress('1.0', 'Customer', customerId);
      if (res.success && res.data) {
        setBillingAddress(res.data.find(a => a.addressType === 'Billing') || null);
        setShippingAddress(res.data.find(a => a.addressType === 'Shipping') || null);
      }
    } catch (err) {
      console.error('Failed to load addresses for customer', err);
    }
  };

  const renderAddress = (title: string, address: AddressListVM | null) => (
    <div className="space-y-1 text-sm text-muted-foreground mt-4">
      <div className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-2 flex items-center gap-2">
        {title}
        {/* <span className="text-blue-500 cursor-pointer">🔗</span> */}
      </div>
      {address ? (
        <>
          {address.contactPersonName && <div className="font-medium text-foreground">{address.contactPersonName}</div>}
          {address.addressLine1 && <div>{address.addressLine1}</div>}
          {address.addressLine2 && <div>{address.addressLine2}</div>}
          <div>
            {[address.city, address.stateId, address.zipCode].filter(Boolean).join(', ')}
          </div>
          {address.countryId && <div>{address.countryId}</div>}
          {address.phone && <div>Phone: {address.phone}</div>}
        </>
      ) : (
        <div className="italic">No address set</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Customer Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-start gap-2 sm:gap-6">
        <Label className="text-red-500 font-medium sm:pt-2">Customer Name*</Label>
        <div className="max-w-2xl">
          <div className="flex gap-2">
            <Select value={data.customerId || ''} onValueChange={(val) => onChange('customerId', val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.customerId} value={c.customerId as string}>
                    {c.firstName} {c.lastName} {c.companyName ? `(${c.companyName})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="bg-primary/10 text-primary px-3 flex items-center rounded border border-primary/20 font-medium text-xs whitespace-nowrap">
              ⨁ INR
            </div>
          </div>

          {data.customerId && !useSimplifiedView && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-2">
              {renderAddress('BILLING ADDRESS', billingAddress)}
              {renderAddress('SHIPPING ADDRESS', shippingAddress)}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2 sm:gap-6">
        <Label className="text-red-500 font-medium">Place of Supply*</Label>
        <Select defaultValue="default">
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Select place of supply" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default State</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted/10 -mx-4 sm:-mx-8 px-4 sm:px-8 py-6 sm:py-8 border-y border-border mt-6 sm:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2 sm:gap-6 mb-4 sm:mb-6">
          <Label className="text-red-500 font-medium">Quote#*</Label>
          <div className="flex gap-2 max-w-sm">
            <Input
              value={data.quoteName || ''}
              onChange={e => onChange('quoteName', e.target.value)}
              placeholder="EST-0000"
              disabled={prefMode === 'auto'}
            />
            <div
              className="p-2 border border-border rounded text-muted-foreground cursor-pointer hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2 sm:gap-6 mb-4 sm:mb-6">
          <Label className="font-medium text-foreground">Reference#</Label>
          <Input
            value={data.quoteToOrderPo || ''}
            onChange={e => onChange('quoteToOrderPo', e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-start gap-2 sm:gap-6 mb-4 sm:mb-6">
          <Label className="text-red-500 font-medium sm:pt-2">Quote Date*</Label>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 max-w-2xl">
            <Input
              type="date"
              value={data.quoteDate ? data.quoteDate.split('T')[0] : ''}
              onChange={e => onChange('quoteDate', e.target.value)}
              className="max-w-[180px] sm:max-w-[200px] flex-1 sm:flex-none"
            />
            <Label className="font-medium text-foreground whitespace-nowrap">Expiry Date</Label>
            <Input
              type="date"
              value={data.expiresOn ? data.expiresOn.split('T')[0] : ''}
              onChange={e => onChange('expiresOn', e.target.value)}
              className="max-w-[180px] sm:max-w-[200px] flex-1 sm:flex-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2 sm:gap-6 mb-4 sm:mb-6">
          <Label className="font-medium text-foreground">Salesperson</Label>
          <Select defaultValue="none">
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Select or Add Salesperson" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select or Add Salesperson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2 sm:gap-6">
          <Label className="font-medium text-foreground">Project Name</Label>
          <Select defaultValue="none">
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a project</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-xl font-medium text-foreground">
              Configure Quote Number Preferences
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4 text-sm">
            <p className="text-foreground">
              Your quote numbers are set on auto-generate mode to save your time.<br />
              Are you sure about changing this setting?
            </p>

            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                  <input
                    type="radio"
                    name="numbering_pref"
                    checked={prefMode === 'auto'}
                    onChange={() => setPrefMode('auto')}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary accent-primary"
                  />
                  Continue auto-generating quote numbers
                  <Info className="h-4 w-4 text-muted-foreground ml-1" />
                </label>

                {prefMode === 'auto' && (
                  <div className="pl-6 grid grid-cols-2 gap-4 max-w-sm">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-normal text-muted-foreground">Prefix</Label>
                      <Input value={prefPrefix} onChange={e => setPrefPrefix(e.target.value)} className="h-9 focus:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-normal text-muted-foreground">Next Number</Label>
                      <Input value={prefNext} onChange={e => setPrefNext(e.target.value)} className="h-9 focus:ring-primary" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                  <input
                    type="radio"
                    name="numbering_pref"
                    checked={prefMode === 'manual'}
                    onChange={() => setPrefMode('manual')}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary accent-primary"
                  />
                  Enter quote numbers manually
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-border pt-4 sm:justify-start">
            <Button
              className="bg-primary hover:bg-primary/80 text-white"
              onClick={() => {
                if (prefMode === 'auto') {
                  onChange('quoteName', `${prefPrefix}${prefNext}`);
                }
                setIsSettingsOpen(false);
              }}
            >
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
