import React, { useState, useEffect, useRef } from 'react';
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
import { ChevronDown, MoreVertical, Search, HelpCircle, Plus, SlidersHorizontal, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomerService } from '@/api/services/CustomerService';
import { CustomerListVM } from '@/api/models/CustomerListVM';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '@/components/ConfirmationModal';


export default function CustomerPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerListVM[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CustomerListVM>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (c.firstName?.toLowerCase() || '').includes(query) ||
      (c.lastName?.toLowerCase() || '').includes(query) ||
      (c.companyName?.toLowerCase() || '').includes(query) ||
      (c.email?.toLowerCase() || '').includes(query) ||
      (c.phone?.toLowerCase() || '').includes(query)
    );
  });

  const confirmDelete = async () => {
    setIsConfirmModalOpen(false);
    try {
      setIsDeleting(true);
      await Promise.all(
        selectedIds.map(id => CustomerService.deleteCustomer(id, '1.0'))
      );
      toast.success('Successfully deleted selected customer(s)');
      setSelectedIds([]);
      fetchCustomers(); // Reload table
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error deleting customers');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await CustomerService.getApiVCustomer('1.0');
      if (res.success && res.data) {
        setCustomers(res.data);
      } else {
        toast.error('Failed to load customers');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    const allFilteredSelected = filteredCustomers.length > 0 && filteredCustomers.every(c => selectedIds.includes(c.customerId as string));
    if (allFilteredSelected) {
      const filteredIds = filteredCustomers.map(c => c.customerId as string);
      setSelectedIds(selectedIds.filter(id => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredCustomers.map(c => c.customerId as string);
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

  const handleOpenNew = () => {
    setFormData({ isActive: false });
    setIsEditing(false);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: CustomerListVM) => {
    navigate(`/customers/${customer.customerId}`);
  };

  const handleSave = async () => {
    // Validate required fields
    const errors: Record<string, string> = {};
    if (!formData.firstName || !formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName || !formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.companyName || !formData.companyName.trim()) errors.companyName = 'Company is required';
    if (!formData.phone || !formData.phone.trim()) errors.phone = 'Phone is required';
  // status is handled via isActive checkbox; do not require status text here
    if (!formData.description || !formData.description.trim()) errors.description = 'Description is required';

    // Email format validation (only if provided)
    if (formData.email && formData.email.trim()) {
      const emailVal = formData.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    // Phone must be numeric only (digits only)
    if (formData.phone && formData.phone.trim()) {
      const phoneVal = formData.phone.trim();
      const phoneDigits = phoneVal.replace(/\s+/g, '');
      if (!/^\d+$/.test(phoneDigits)) {
        errors.phone = 'Phone must contain only numbers';
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix validation errors in the form');
      return;
    }

    try {
      setSaving(true);
      if (isEditing && formData.customerId) {
        // Edit logic is now handled in CustomerDetailsPage
      } else {
        const payload = { ...formData } as any;
        // Ensure status reflects isActive
        if (payload.isActive === false) payload.status = '-';
        else if (!payload.status) payload.status = payload.status || '-';

        const res = await CustomerService.postApiVCustomer('1.0', payload);
          if (res.success) {
            toast.success('Customer created successfully');
            setFormErrors({});
            setIsModalOpen(false);
            fetchCustomers();
          } else {
          toast.error(res.message || 'Failed to create customer');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const validateField = (field: string, value?: string) => {
    const errors = { ...formErrors };
    const val = value || '';
    if (!val.trim()) {
      // Required for these specific fields
    if (['firstName', 'lastName', 'companyName', 'phone', 'description'].includes(field)) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      } else {
        delete errors[field];
      }
    } else {
      // Field-specific validation
      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
      } else if (field === 'phone') {
        const phoneDigits = val.replace(/\s+/g, '');
        if (!/^\d+$/.test(phoneDigits)) {
          errors.phone = 'Phone must contain only numbers';
        } else {
          delete errors.phone;
        }
      } else {
        delete errors[field];
      }
    }
    setFormErrors(errors);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-background text-sm rounded-md shadow-sm border border-border">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-border gap-3 sm:h-[64px]">
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center space-x-2 cursor-pointer">
            <h1 className="text-xl font-medium text-foreground">All Customers</h1>
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
              placeholder="Search customers..."
              className="pl-8 h-8 w-full bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleOpenNew} className="bg-primary hover:bg-primary-light text-white flex items-center gap-1 h-8 px-3 rounded-md shadow-sm shrink-0">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      {/* Table Area - hidden on mobile */}
      <div className="flex-1 overflow-auto hidden sm:block">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="w-[50px] p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={filteredCustomers.length > 0 && filteredCustomers.every(c => selectedIds.includes(c.customerId as string))}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">NAME</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">COMPANY NAME</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">EMAIL</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">WORK PHONE</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">RECEIVABLES</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">UNUSED CREDITS</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-8 text-muted-foreground">
                  {searchQuery ? 'No matching customers found.' : 'No customers found. Click New to add one.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.customerId} className="border-b border-border hover:bg-muted/50 group">
                  <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4" />
                      <Checkbox
                        checked={selectedIds.includes(customer.customerId as string)}
                        onCheckedChange={() => toggleSelect(customer.customerId as string)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-500 cursor-pointer hover:underline font-medium" onClick={() => handleOpenEdit(customer)}>
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell className="text-foreground">{customer.companyName}</TableCell>
                  <TableCell className="text-foreground">{customer.email}</TableCell>
                  <TableCell className="text-foreground">{customer.phone}</TableCell>
                  <TableCell className="text-right text-foreground">₹0</TableCell>
                  <TableCell className="text-right text-foreground">₹0</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(customer)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            {searchQuery ? 'No matching customers found.' : 'No customers found. Click New to add one.'}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.customerId}
                className="p-4 hover:bg-muted/50 active:bg-muted/70 cursor-pointer"
                onClick={() => handleOpenEdit(customer)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <Checkbox
                      checked={selectedIds.includes(customer.customerId as string)}
                      onCheckedChange={() => toggleSelect(customer.customerId as string)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-blue-500">{customer.firstName} {customer.lastName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{customer.companyName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{customer.email} {customer.phone ? `• ${customer.phone}` : ''}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleOpenEdit(customer); }} className="h-8 w-8 text-muted-foreground shrink-0">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              New Customer
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="e.g. John"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                onBlur={(e) => validateField('firstName', e.target.value)}
                className="w-full"
              />
              {formErrors.firstName && <p className="text-xs text-red-400 mt-1">{formErrors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="e.g. Doe"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                onBlur={(e) => validateField('lastName', e.target.value)}
                className="w-full"
              />
              {formErrors.lastName && <p className="text-xs text-red-400 mt-1">{formErrors.lastName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium">
                Company <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="e.g. Acme Corp"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                onBlur={(e) => validateField('companyName', e.target.value)}
                className="w-full"
              />
              {formErrors.companyName && <p className="text-xs text-red-400 mt-1">{formErrors.companyName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. john@example.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={(e) => validateField('email', e.target.value)}
                className="w-full"
              />
              {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="number"
                placeholder="Enter phone number"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onBlur={(e) => validateField('phone', e.target.value)}
                className="w-full"
              />
              {formErrors.phone && <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>}
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <Label className="text-sm font-medium">Is Active</Label>
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive === undefined ? false : !!formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="isActive" className="text-sm">Active</label>
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                onBlur={(e) => validateField('description', e.target.value)}
                className="min-h-[80px] w-full"
              />
              {formErrors.description && <p className="text-xs text-red-400 mt-1">{formErrors.description}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-light text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        open={isConfirmModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        message={`Are you sure you want to delete ${selectedIds.length} customer(s)?`}
        description="This action cannot be undone."
        yesVariant="destructive"
        yesLabel="Delete"
      />
    </div>
  );
}
