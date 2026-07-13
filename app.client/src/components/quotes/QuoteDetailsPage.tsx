import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { CreateCustomerQuoteCommand } from '@/api/models/CreateCustomerQuoteCommand';
import { CreateCustomerQuoteLineCommand } from '@/api/models/CreateCustomerQuoteLineCommand';
import { CustomerQuoteService } from '@/api/services/CustomerQuoteService';
import { CustomerQuoteLineService } from '@/api/services/CustomerQuoteLineService';
import { CustomerService } from '@/api/services/CustomerService';
import { CustomerListVM } from '@/api/models/CustomerListVM';
import { toast } from 'sonner';
import QuoteHeaderForm from './components/QuoteHeaderForm';
import QuoteItemTable from './components/QuoteItemTable';
import QuoteTotals from './components/QuoteTotals';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/cn';

export default function QuoteDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useSimplifiedView, setUseSimplifiedView] = useState(false);

  const [customers, setCustomers] = useState<CustomerListVM[]>([]);
  const [headerData, setHeaderData] = useState<Partial<CreateCustomerQuoteCommand>>({
    quoteDate: new Date().toISOString(),
  });
  const [lineItems, setLineItems] = useState<CreateCustomerQuoteLineCommand[]>([]);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const custRes = await CustomerService.getApiVCustomer('1.0');
      if (custRes.success && custRes.data) {
        setCustomers(custRes.data);
      }

      if (!isNew) {
        // Load existing quote header
        const quoteRes = await CustomerQuoteService.getCustomerQuoteById(id, '1.0');
        if (quoteRes.success && quoteRes.data) {
          setHeaderData(quoteRes.data);
        } else {
          toast.error('Failed to load quote details');
          navigate('/quotes');
        }

        // Load existing quote lines
        const linesRes = await CustomerQuoteLineService.getApiVCustomerQuoteLine('1.0');
        if (linesRes.success && linesRes.data) {
          const relatedLines = linesRes.data.filter(l => l.customerQuoteId === id);
          setLineItems(relatedLines as CreateCustomerQuoteLineCommand[]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderChange = (field: string, value: any) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (status: 'draft' | 'send') => {
    if (!headerData.customerId || !headerData.quoteName || !headerData.quoteDate) {
      toast.error('Please fill in Customer Name, Quote#, and Quote Date');
      return;
    }

    try {
      setSaving(true);
      let quoteId = id;

      // 1. Save Header
      // customerShippingAddressId is required by the API — default to empty string if not set
      const payload = {
        ...headerData,
        customerShippingAddressId: headerData.customerShippingAddressId || '',
      };
      if (isNew) {
        const res = await CustomerQuoteService.postApiVCustomerQuote('1.0', payload);
        if (res.success && res.data) {
          // res.data may be the full response object — extract the string ID
          const data = res.data as any;
          quoteId = typeof data === 'string' ? data : (data.customerQuoteId || data.id || data);
        } else {
          throw new Error('Failed to create quote');
        }
      } else {
        const res = await CustomerQuoteService.putApiVCustomerQuote('1.0', {
          ...payload,
          customerQuoteId: quoteId
        });
        if (!res.success) throw new Error('Failed to update quote');
      }

      // 2. Save Lines (simplified: in a real app you'd need to diff for edits/deletes if not new)
      if (isNew && quoteId && lineItems.length > 0) {
        await Promise.all(lineItems.map(line =>
          CustomerQuoteLineService.postApiVCustomerQuoteLine('1.0', {
            ...line,
            customerQuoteId: quoteId,
            lineId: line.lineId || '-',
            lineTypeId: line.lineTypeId || 'Inventoryitem',
            priceMethodId: line.priceMethodId || '-',
            customerPartRefNum: line.customerPartRefNum || '-',
          })
        ));
      }

      toast.success(`Quote ${isNew ? 'created' : 'updated'} successfully`);
      navigate('/quotes');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error saving quote');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-background rounded-md shadow-sm border border-border overflow-hidden">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 border-b border-border shadow-sm z-10 relative gap-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-medium text-foreground">{isNew ? 'New Quote' : 'Edit Quote'}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-l pl-3 sm:pl-4 border-border select-none">
            <span className="text-xs sm:text-sm">Use Simplified View</span>
            <div 
              onClick={() => setUseSimplifiedView(!useSimplifiedView)}
              className={cn(
                "w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out",
                useSimplifiedView ? "bg-primary" : "bg-muted"
              )}
            >
              <div 
                className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-200 ease-in-out",
                  useSimplifiedView ? "left-[22px]" : "left-0.5"
                )}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/quotes')} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">

          <QuoteHeaderForm
            data={headerData}
            onChange={handleHeaderChange}
            customers={customers}
            useSimplifiedView={useSimplifiedView}
          />

          <div className="border border-border rounded-md overflow-hidden bg-background">
            <QuoteItemTable
              lines={lineItems}
              onChange={setLineItems}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-6 sm:gap-8 items-start">
            <div className="space-y-6">
              <div>
                <Label className="text-foreground font-medium mb-2 block">Customer Notes</Label>
                <Textarea
                  placeholder="Will be displayed on the quote"
                  value={headerData.headerComment || ''}
                  onChange={e => handleHeaderChange('headerComment', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label className="text-foreground font-medium mb-2 block">Terms &amp; Conditions</Label>
                <Textarea
                  placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="space-y-6">
              <QuoteTotals lines={lineItems} />
              <div className="border border-dashed border-border rounded-md p-4 text-center text-muted-foreground text-sm">
                <p className="font-medium text-foreground mb-1">Attach File(s) to Quote</p>
                <p className="text-xs">Upload files here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky bottom-0 z-10">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving} className="w-full sm:w-auto">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save as Draft
          </Button>
          <Button className="text-white w-full sm:w-auto" onClick={() => handleSave('send')} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save and Send
          </Button>
          <Button variant="outline" onClick={() => navigate('/quotes')} className="w-full sm:w-auto">Cancel</Button>
        </div>
        <div className="text-sm flex items-center justify-center sm:justify-start gap-2">
          <span className="text-muted-foreground">PDF Template:</span>
          <span className="text-blue-500 cursor-pointer hover:underline">Change</span>
        </div>
      </div>
    </div>
  );
}
