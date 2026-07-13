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
import { ChevronDown, Search, Plus, Loader2, Trash2 } from 'lucide-react';
import { InvoicesService } from '@/api/services/InvoicesService';
import { CustomerService } from '@/api/services/CustomerService';
import { CustomerListVM } from '@/api/models/CustomerListVM';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ConfirmationModal';

interface InvoiceListVM {
    invoiceId?: string;
    invoiceNumber?: string;
    orderNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    customerId?: string;
    salesperson?: string;
    status?: string;
    totalAmount?: number;
}

export default function InvoicesPage() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<InvoiceListVM[]>([]);
    const [customers, setCustomers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredInvoices = invoices.filter(inv => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const custName = (inv.customerId ? customers[inv.customerId] || '' : '').toLowerCase();
        return (
            (inv.invoiceNumber?.toLowerCase() || '').includes(query) ||
            (inv.orderNumber?.toLowerCase() || '').includes(query) ||
            (inv.salesperson?.toLowerCase() || '').includes(query) ||
            custName.includes(query)
        );
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [invoiceRes, custRes] = await Promise.all([
                InvoicesService.getInvoices('1.0'),
                CustomerService.getApiVCustomer('1.0')
            ]);

            if (custRes.success && custRes.data) {
                const custMap: Record<string, string> = {};
                custRes.data.forEach((c: CustomerListVM) => {
                    if (c.customerId) {
                        custMap[c.customerId] = `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.companyName || 'Unknown Customer';
                    }
                });
                setCustomers(custMap);
            }

            if (invoiceRes.success && invoiceRes.data) {
                setInvoices(invoiceRes.data);
            } else {
                toast.error('Failed to load invoices');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectAll = () => {
        const allFilteredSelected = filteredInvoices.length > 0 && filteredInvoices.every(inv => selectedIds.includes(inv.invoiceId as string));
        if (allFilteredSelected) {
            const filteredIds = filteredInvoices.map(inv => inv.invoiceId as string);
            setSelectedIds(selectedIds.filter(id => !filteredIds.includes(id)));
        } else {
            const filteredIds = filteredInvoices.map(inv => inv.invoiceId as string);
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

    const getStatus = (status?: string) => {
        const s = (status || 'DRAFT').toUpperCase();
        switch (s) {
            case 'PAID':
                return { label: 'PAID', color: 'text-green-500 bg-green-500/10 border-green-500/20' };
            case 'SENT':
                return { label: 'SENT', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
            case 'VOIDED':
                return { label: 'VOIDED', color: 'text-red-400 bg-red-400/10 border-red-400/20' };
            default:
                return { label: 'DRAFT', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
        }
    };

    const confirmDelete = async () => {
        setIsConfirmModalOpen(false);
        try {
            setIsDeleting(true);
            await Promise.all(
                selectedIds.map(id => InvoicesService.deleteInvoice(id, '1.0'))
            );
            toast.success('Successfully deleted selected invoice(s)');
            setSelectedIds([]);
            fetchData(); // Reload table
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Error deleting invoices');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-background text-sm rounded-md shadow-sm border border-border">
            {/* Header Area */}
            <div className="flex justify-between items-center p-4 border-b border-border h-[64px]">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <h1 className="text-xl font-medium text-foreground">All Invoices</h1>
                        <ChevronDown className="h-5 w-5 text-blue-500 mt-1" />
                    </div>

                    {selectedIds.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => setIsConfirmModalOpen(true)}
                            disabled={isDeleting}
                            className="flex items-center gap-2 h-8 px-3 rounded-md shadow-sm ml-2"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Delete Selected ({selectedIds.length})
                        </Button>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative w-60">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            ref={searchInputRef}
                            type="search"
                            placeholder="Search invoices..."
                            className="pl-8 h-8 w-full bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => navigate('/billing')} className="bg-[#2eb872] hover:bg-[#28a164] text-white flex items-center gap-1 h-8 px-3 rounded-md shadow-sm">
                        <Plus className="h-4 w-4" />
                        New
                    </Button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="w-[50px] p-4">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={filteredInvoices.length > 0 && filteredInvoices.every(inv => selectedIds.includes(inv.invoiceId as string))}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </div>
                            </TableHead>
                            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">DATE</TableHead>
                            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">INVOICE NUMBER</TableHead>
                            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ORDER NUMBER</TableHead>
                            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">CUSTOMER NAME</TableHead>
                            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">SALESPERSON</TableHead>
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
                        ) : filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center p-8 text-muted-foreground">
                                    {searchQuery ? 'No matching invoices found.' : 'No invoices found. Click New to create one.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((inv) => {
                                const statusInfo = getStatus(inv.status);
                                return (
                                    <TableRow
                                        key={inv.invoiceId}
                                        className="border-b border-border hover:bg-muted/50 group cursor-pointer"
                                        onClick={(e) => {
                                            // Don't navigate when clicking the checkbox cell
                                            if ((e.target as HTMLElement).closest('[data-no-nav]')) return;
                                            navigate(`/Invoice/${inv.invoiceId}`);
                                        }}
                                    >
                                        <TableCell className="p-4" data-no-nav>
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedIds.includes(inv.invoiceId as string)}
                                                    onCheckedChange={() => toggleSelect(inv.invoiceId as string)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                            {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                        </TableCell>
                                        <TableCell
                                            className="text-blue-500 font-medium font-mono hover:text-blue-400 hover:underline"
                                        >
                                            {inv.invoiceNumber || inv.invoiceId}
                                        </TableCell>
                                        <TableCell className="text-foreground font-mono">{inv.orderNumber || '-'}</TableCell>
                                        <TableCell className="text-foreground">{inv.customerId ? customers[inv.customerId] || 'Loading...' : '-'}</TableCell>
                                        <TableCell className="text-foreground">{inv.salesperson || '-'}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-foreground font-medium font-mono">
                                            ₹{(inv.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            <ConfirmationModal
                open={isConfirmModalOpen}
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmModalOpen(false)}
                message={`Are you sure you want to delete/void ${selectedIds.length} invoice(s)?`}
                description="This action cannot be undone."
                yesVariant="destructive"
                yesLabel="Delete"
            />
        </div>
    );
}
