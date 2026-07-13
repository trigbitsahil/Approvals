import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronDown, MoreVertical, Search, HelpCircle, Plus, SlidersHorizontal, Loader2, Link2, Trash2 } from 'lucide-react';
import { CustomerQuoteService } from '@/api/services/CustomerQuoteService';
import { CustomerService } from '@/api/services/CustomerService';
import { CustomerQuoteListVM } from '@/api/models/CustomerQuoteListVM';
import { CustomerListVM } from '@/api/models/CustomerListVM';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function QuotesPage() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<CustomerQuoteListVM[]>([]);
  const [customers, setCustomers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredQuotes = quotes.filter(q => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const custName = (q.customerId ? customers[q.customerId] || '' : '').toLowerCase();
    return (
      (q.quoteName?.toLowerCase() || '').includes(query) ||
      (q.quoteToOrderPo?.toLowerCase() || '').includes(query) ||
      custName.includes(query)
    );
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quoteRes, custRes] = await Promise.all([
        CustomerQuoteService.getApiVCustomerQuote('1.0'),
        CustomerService.getApiVCustomer('1.0')
      ]);

      if (custRes.success && custRes.data) {
        const custMap: Record<string, string> = {};
        custRes.data.forEach((c: CustomerListVM) => {
          if (c.customerId) custMap[c.customerId] = `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.companyName || 'Unknown Customer';
        });
        setCustomers(custMap);
      }

      if (quoteRes.success && quoteRes.data) {
        setQuotes(quoteRes.data);
      } else {
        toast.error('Failed to load quotes');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    const allFilteredSelected = filteredQuotes.length > 0 && filteredQuotes.every(q => selectedIds.includes(q.customerQuoteId as string));
    if (allFilteredSelected) {
      const filteredIds = filteredQuotes.map(q => q.customerQuoteId as string);
      setSelectedIds(selectedIds.filter(id => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredQuotes.map(q => q.customerQuoteId as string);
      setSelectedIds(Array.from(new Set([...selectedIds, ...filteredIds])));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getStatus = (quote: CustomerQuoteListVM) => {
    if (quote.isExpired) return { label: 'EXPIRED', color: 'text-gray-400' };
    return { label: 'DRAFT', color: 'text-orange-500' };
  };

  const confirmDelete = async () => {
    setIsConfirmModalOpen(false);
    try {
      setIsDeleting(true);
      await Promise.all(
        selectedIds.map(id => CustomerQuoteService.deleteCustomerQuote(id, '1.0'))
      );
      toast.success('Successfully deleted selected quote(s)');
      setSelectedIds([]);
      fetchData(); // Reload table
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error deleting quotes');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-background text-sm rounded-md shadow-sm border border-border">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-border gap-3 sm:h-[64px]">
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center space-x-2 cursor-pointer">
            <h1 className="text-xl font-medium text-foreground">All Estimates</h1>
            <ChevronDown className="h-5 w-5 text-blue-500 mt-1" />
          </div>

          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={isDeleting}
              className="flex items-center gap-2 h-8 px-3 rounded-md shadow-sm"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              <span className="hidden sm:inline">Delete Selected ({selectedIds.length})</span>
              <span className="sm:hidden">Delete ({selectedIds.length})</span>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search estimates..."
              className="pl-8 h-8 w-full bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate('/quotes/new')} className="bg-primary hover:bg-primary/80 text-white flex items-center gap-1 h-8 px-3 rounded-md shadow-sm shrink-0">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      {/* Table Area - hidden on mobile, shown on sm+ */}
      <div className="flex-1 overflow-auto hidden sm:block">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="w-[50px] p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={filteredQuotes.length > 0 && filteredQuotes.every(q => selectedIds.includes(q.customerQuoteId as string))}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">DATE</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ESTIMATE NUMBER</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">REFERENCE NUMBER</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">CUSTOMERNAME</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">STATUS</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">AMOUNT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                </TableCell>
              </TableRow>
            ) : filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-8 text-muted-foreground">
                  {searchQuery ? 'No matching estimates found.' : 'No quotes found. Click New to create one.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => {
                const statusInfo = getStatus(quote);
                return (
                  <TableRow key={quote.customerQuoteId} className="border-b border-border hover:bg-muted/50 group">
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-4" />
                        <Checkbox
                          checked={selectedIds.includes(quote.customerQuoteId as string)}
                          onCheckedChange={() => toggleSelect(quote.customerQuoteId as string)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {quote.quoteDate ? new Date(quote.quoteDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </TableCell>
                    <TableCell className="text-blue-500 cursor-pointer hover:underline font-medium" onClick={() => navigate(`/quotes/${quote.customerQuoteId}`)}>
                      {quote.quoteName || quote.customerQuoteId}
                    </TableCell>
                    <TableCell className="text-foreground">{quote.quoteToOrderPo || '-'}</TableCell>
                    <TableCell className="text-foreground">{quote.customerId ? customers[quote.customerId] || 'Loading...' : '-'}</TableCell>
                    <TableCell className={`text-xs font-semibold ${statusInfo.color}`}>{statusInfo.label}</TableCell>
                    <TableCell className="text-right text-foreground">₹0.00</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="flex-1 overflow-auto sm:hidden">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            {searchQuery ? 'No matching estimates found.' : 'No quotes found. Click New to create one.'}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredQuotes.map((quote) => {
              const statusInfo = getStatus(quote);
              return (
                <div
                  key={quote.customerQuoteId}
                  className="p-4 hover:bg-muted/50 active:bg-muted/70 cursor-pointer"
                  onClick={() => navigate(`/quotes/${quote.customerQuoteId}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <Checkbox
                        checked={selectedIds.includes(quote.customerQuoteId as string)}
                        onCheckedChange={(e) => { (e as any).stopPropagation?.(); toggleSelect(quote.customerQuoteId as string); }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-blue-500 truncate">{quote.quoteName || quote.customerQuoteId}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {quote.customerId ? customers[quote.customerId] || 'Loading...' : '-'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {quote.quoteDate ? new Date(quote.quoteDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                          {quote.quoteToOrderPo ? ` • Ref: ${quote.quoteToOrderPo}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-xs font-semibold ${statusInfo.color}`}>{statusInfo.label}</div>
                      <div className="text-sm font-medium text-foreground mt-1">₹0.00</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmationModal
        open={isConfirmModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        message={`Are you sure you want to delete ${selectedIds.length} quote(s)?`}
        description="This action cannot be undone."
        yesVariant="destructive"
        yesLabel="Delete"
      />
    </div>
  );
}
