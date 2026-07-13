import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomerService } from '@/api/services/CustomerService';
import { AddressService } from '@/api/services/AddressService';
import { CustomerDetailVM } from '@/api/models/CustomerDetailVM';
import { AddressListVM } from '@/api/models/AddressListVM';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [customer, setCustomer] = useState<Partial<CustomerDetailVM>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Addresses
  const [billingAddress, setBillingAddress] = useState<Partial<AddressListVM>>({ addressType: 'Billing' });
  const [shippingAddress, setShippingAddress] = useState<Partial<AddressListVM>>({ addressType: 'Shipping' });

  // UI Only State (Mocked)
  const [customerType, setCustomerType] = useState('business');

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (customerId: string) => {
    setLoading(true);
    try {
      const [customerRes, addressRes] = await Promise.all([
        CustomerService.getCustomerById(customerId, '1.0'),
        AddressService.getApiVAddress('1.0', 'Customer', customerId)
      ]);

      if (customerRes.success && customerRes.data) {
        setCustomer(customerRes.data);
      } else {
        toast.error('Failed to load customer details');
      }

      if (addressRes.success && addressRes.data) {
        const bAddress = addressRes.data.find(a => a.addressType === 'Billing');
        const sAddress = addressRes.data.find(a => a.addressType === 'Shipping');
        if (bAddress) setBillingAddress(bAddress);
        if (sAddress) setShippingAddress(sAddress);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    // Validate fields
    const errors: Record<string, string> = {};
    if (!customer.firstName || !customer.firstName.trim()) errors.firstName = 'First name is required';
    if (!customer.lastName || !customer.lastName.trim()) errors.lastName = 'Last name is required';
    if (!customer.companyName || !customer.companyName.trim()) errors.companyName = 'Company is required';
  if (!customer.phone || !customer.phone.trim()) errors.phone = 'Phone is required';
    if (!customer.description || !customer.description.trim()) errors.description = 'Description is required';

    // Email format
    if (customer.email && customer.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer.email.trim())) errors.email = 'Please enter a valid email address';
    }

    // Phone numeric check
    if (customer.phone && customer.phone.trim()) {
      const phoneDigits = customer.phone.replace(/\s+/g, '');
      if (!/^\d+$/.test(phoneDigits)) errors.phone = 'Phone must contain only numbers';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    setSaving(true);
    try {
      // Update Customer
      const payload: any = { ...customer };
      if (payload.isActive === false) payload.status = '-';
      else if (!payload.status) payload.status = payload.status || 'Active';

      const custRes = await CustomerService.putApiVCustomer('1.0', {
        ...payload,
        customerId: id,
      });

      if (!custRes.success) {
        throw new Error(custRes.message || 'Failed to update customer');
      }

      // Update Addresses
      // Helper to determine if we should update or create an address
      const saveAddress = async (addr: Partial<AddressListVM>) => {
        // Only save if there is some data (e.g. addressLine1 or city)
        if (!addr.addressLine1 && !addr.city && !addr.countryId && !addr.zipCode) return;

        const addressName = addr.name || addr.addressType || 'Default Address';

        if (addr.addressId) {
          return await AddressService.putApiVAddress('1.0', {
            ...addr,
            name: addressName,
            addressId: addr.addressId,
            categoryId: id,
            category: 'Customer',
            countryId: "-",
            stateId: "-",
          });
        } else {
          return await AddressService.postApiVAddress('1.0', {
            ...addr,
            name: addressName,
            categoryId: id,
            category: 'Customer',
            countryId: "-",
            stateId: "-",
          });
        }
      };

      await Promise.all([
        saveAddress(billingAddress),
        saveAddress(shippingAddress)
      ]);

      toast.success('Customer details updated successfully');
      navigate('/customers');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error saving data');
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
    <div className="flex flex-col h-full bg-background rounded-md border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')} className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Edit Customer</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl space-y-8">

          {/* Top Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-2 sm:gap-4">
              <Label className="text-muted-foreground font-medium">Customer Type</Label>
              <RadioGroup value={customerType} onValueChange={setCustomerType} className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="font-normal cursor-pointer">Business</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="font-normal cursor-pointer">Individual</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-2 sm:gap-4">
              <Label className="text-muted-foreground font-medium">Primary Contact <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-[100px_1fr_1fr] gap-3 max-w-xl">
                {/* <Input disabled value="Mr." className="bg-muted/30" /> */}
                <Input
                  placeholder="First Name"
                  value={customer.firstName || ''}
                  onChange={e => setCustomer({ ...customer, firstName: e.target.value })}
                  onBlur={(e) => {
                    const v = e.target.value;
                    const errs = { ...formErrors };
                    if (!v || !v.trim()) errs.firstName = 'First name is required'; else delete errs.firstName;
                    setFormErrors(errs);
                  }}
                />
                {formErrors.firstName && <p className="text-xs text-red-400 mt-1">{formErrors.firstName}</p>}
                <Input
                  placeholder="Last Name"
                  value={customer.lastName || ''}
                  onChange={e => setCustomer({ ...customer, lastName: e.target.value })}
                  onBlur={(e) => {
                    const v = e.target.value;
                    const errs = { ...formErrors };
                    if (!v || !v.trim()) errs.lastName = 'Last name is required'; else delete errs.lastName;
                    setFormErrors(errs);
                  }}
                />
                {formErrors.lastName && <p className="text-xs text-red-400 mt-1">{formErrors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-2 sm:gap-4">
              <Label className="text-muted-foreground font-medium">Company Name <span className="text-red-500">*</span></Label>
              <Input
                value={customer.companyName || ''}
                onChange={e => setCustomer({ ...customer, companyName: e.target.value })}
                onBlur={(e) => {
                  const v = e.target.value;
                  const errs = { ...formErrors };
                  if (!v || !v.trim()) errs.companyName = 'Company is required'; else delete errs.companyName;
                  setFormErrors(errs);
                }}
                className="max-w-xl"
              />
              {formErrors.companyName && <p className="text-xs text-red-400 mt-1">{formErrors.companyName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-2 sm:gap-4">
              <Label className="text-muted-foreground font-medium">Display Name <span className="text-red-500">*</span></Label>
              <Input
                disabled
                value={`${customer.firstName || ''} ${customer.lastName || ''}`}
                className="max-w-xl bg-muted/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-2 sm:gap-4">
              <Label className="text-muted-foreground font-medium">Currency</Label>
              <Input disabled value="Indian Rupee" className="max-w-xl bg-muted/30" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-2 sm:gap-4">
              <Label className="text-muted-foreground font-medium">Email Address</Label>
              <Input
                type="email"
                value={customer.email || ''}
                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                onBlur={(e) => {
                  const v = e.target.value;
                  const errs = { ...formErrors };
                  if (v && v.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(v.trim())) errs.email = 'Please enter a valid email address'; else delete errs.email;
                  } else {
                    delete errs.email;
                  }
                  setFormErrors(errs);
                }}
                className="max-w-xl"
              />
              {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-2 sm:gap-4">
              <Label className="text-muted-foreground font-medium">Phone <span className="text-red-500">*</span></Label>
              <div className="flex gap-3 max-w-xl">
                <Input
                  placeholder="Work Phone"
                  value={customer.phone || ''}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  onBlur={(e) => {
                    const v = e.target.value;
                    const errs = { ...formErrors };
                    if (!v || !v.trim()) {
                      errs.phone = 'Phone is required';
                    } else {
                      const phoneDigits = v.replace(/\s+/g, '');
                      if (!/^\d+$/.test(phoneDigits)) errs.phone = 'Phone must contain only numbers'; else delete errs.phone;
                    }
                    setFormErrors(errs);
                  }}
                />
                {formErrors.phone && <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>}
                {/* <Input disabled placeholder="Mobile" className="bg-muted/30" /> */}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="other-details" className="w-full pt-4">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0">
              <TabsTrigger value="other-details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">
                Other Details
              </TabsTrigger>
              <TabsTrigger value="address" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">
                Address
              </TabsTrigger>
              {/* <TabsTrigger value="contact-persons" disabled className="rounded-none">
                Contact Persons
              </TabsTrigger>
              <TabsTrigger value="custom-fields" disabled className="rounded-none">
                Custom Fields
              </TabsTrigger>
              <TabsTrigger value="remarks" disabled className="rounded-none">
                Remarks
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="other-details" className="pt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2 sm:gap-4">
                  <Label className="text-muted-foreground">Is Active</Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="otherIsActive"
                      type="checkbox"
                      checked={customer.isActive === undefined ? true : !!customer.isActive}
                      onChange={e => setCustomer({ ...customer, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="otherIsActive" className="text-sm">Active</label>
                  </div>
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2 sm:gap-4">
                <Label className="text-muted-foreground">Tax ID</Label>
                <Input
                  value={customer.taxId || ''}
                  onChange={e => setCustomer({ ...customer, taxId: e.target.value })}
                  className="max-w-md"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2 sm:gap-4">
                <Label className="text-muted-foreground">Payment Terms</Label>
                <Input
                  value={customer.paymentTerms || ''}
                  onChange={e => setCustomer({ ...customer, paymentTerms: e.target.value })}
                  className="max-w-md"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-start gap-2 sm:gap-4">
                <Label className="text-muted-foreground mt-2">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  value={customer.description || ''}
                  onChange={e => setCustomer({ ...customer, description: e.target.value })}
                  onBlur={(e) => {
                    const v = e.target.value;
                    const errs = { ...formErrors };
                    if (!v || !v.trim()) errs.description = 'Description is required'; else delete errs.description;
                    setFormErrors(errs);
                  }}
                  className="max-w-md min-h-[100px]"
                />
              {formErrors.description && <p className="text-xs text-red-400 mt-1">{formErrors.description}</p>}
              </div>
            </TabsContent>

            <TabsContent value="address" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-lg pb-2">Billing Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-1 sm:gap-2">
                    <Label className="text-muted-foreground">Attention</Label>
                    <Input
                      value={billingAddress.contactPersonName || ''}
                      onChange={e => setBillingAddress({ ...billingAddress, contactPersonName: e.target.value })}
                    />
                  </div>
                  {/* <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label className="text-muted-foreground">Country/Region</Label>
                    <Input
                      value={billingAddress.countryId || ''}
                      onChange={e => setBillingAddress({ ...billingAddress, countryId: e.target.value })}
                    />
                  </div> */}
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start gap-1 sm:gap-2">
                    <Label className="text-muted-foreground mt-2">Address</Label>
                    <div className="space-y-2">
                      <Textarea
                        value={billingAddress.addressLine1 || ''}
                        onChange={e => setBillingAddress({ ...billingAddress, addressLine1: e.target.value })}
                        className="min-h-[60px]"
                      />
                      <Textarea
                        value={billingAddress.addressLine2 || ''}
                        onChange={e => setBillingAddress({ ...billingAddress, addressLine2: e.target.value })}
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-1 sm:gap-2">
                    <Label className="text-muted-foreground">City</Label>
                    <Input
                      value={billingAddress.city || ''}
                      onChange={e => setBillingAddress({ ...billingAddress, city: e.target.value })}
                    />
                  </div>
                  {/* <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label className="text-muted-foreground">State</Label>
                    <Input
                      value={billingAddress.stateId || ''}
                      onChange={e => setBillingAddress({ ...billingAddress, stateId: e.target.value })}
                    />
                  </div> */}
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-1 sm:gap-2">
                    <Label className="text-muted-foreground">Zip Code</Label>
                    <Input
                      value={billingAddress.zipCode || ''}
                      onChange={e => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-1 sm:gap-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    <Input
                      value={billingAddress.phone || ''}
                      onChange={e => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <h3 className="font-semibold text-foreground text-lg">Shipping Address</h3>
                    <Button variant="link" className="h-auto p-0 text-blue-500" onClick={() => setShippingAddress({ ...billingAddress, addressType: 'Shipping', addressId: shippingAddress.addressId })}>
                      ↓ Copy billing address
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-1 sm:gap-2">
                    <Label className="text-muted-foreground">Attention</Label>
                    <Input
                      value={shippingAddress.contactPersonName || ''}
                      onChange={e => setShippingAddress({ ...shippingAddress, contactPersonName: e.target.value })}
                    />
                  </div>
                  {/* <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label className="text-muted-foreground">Country/Region</Label>
                    <Input
                      value={shippingAddress.countryId || ''}
                      onChange={e => setShippingAddress({ ...shippingAddress, countryId: e.target.value })}
                    />
                  </div> */}
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start gap-1 sm:gap-2">
                    <Label className="text-muted-foreground mt-2">Address</Label>
                    <div className="space-y-2">
                      <Textarea
                        value={shippingAddress.addressLine1 || ''}
                        onChange={e => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                        className="min-h-[60px]"
                      />
                      <Textarea
                        value={shippingAddress.addressLine2 || ''}
                        onChange={e => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-1 sm:gap-2">
                    <Label className="text-muted-foreground">City</Label>
                    <Input
                      value={shippingAddress.city || ''}
                      onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    />
                  </div>
                  {/* <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label className="text-muted-foreground">State</Label>
                    <Input
                      value={shippingAddress.stateId || ''}
                      onChange={e => setShippingAddress({ ...shippingAddress, stateId: e.target.value })}
                    />
                  </div> */}
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-1 sm:gap-2">
                    <Label className="text-muted-foreground">Zip Code</Label>
                    <Input
                      value={shippingAddress.zipCode || ''}
                      onChange={e => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-1 sm:gap-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    <Input
                      value={shippingAddress.phone || ''}
                      onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    />
                  </div>
                </div>

              </div>
            </TabsContent>
          </Tabs>

        </div>
      </div>

      {/* Footer sticky bar */}
      <div className="p-3 sm:p-4 bg-muted/20 border-t border-border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-light text-white w-full sm:w-auto px-6">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/customers')} className="w-full sm:w-auto">
          Cancel
        </Button>
      </div>

    </div>
  );
}
