import React from 'react';
import { CreateCustomerQuoteLineCommand } from '@/api/models/CreateCustomerQuoteLineCommand';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';

interface QuoteTotalsProps {
  lines: CreateCustomerQuoteLineCommand[];
}

export default function QuoteTotals({ lines }: QuoteTotalsProps) {
  const [shippingCharges, setShippingCharges] = React.useState<number>(0);
  const [adjustment, setAdjustment] = React.useState<number>(0);
  const [tcsRate, setTcsRate] = React.useState<number>(0);
  const [tcsName, setTcsName] = React.useState<string>("none");

  // 1. Calculate Sub Total (tax-exclusive taxable value)
  const subTotal = lines.reduce((acc, line) => {
    const qty = line.quoteToOrderQty || 0;
    const rate = line.priceValue || 0;
    const discountValue = (line as any).discountValue || 0;
    const discountType = (line as any).discountType || 'percent';

    let lineAmount = qty * rate;
    if (discountType === 'percent') {
      lineAmount = lineAmount - (lineAmount * (discountValue / 100));
    } else {
      lineAmount = lineAmount - discountValue;
    }
    return acc + Math.max(0, lineAmount);
  }, 0);

  // 2. Calculate aggregated line-item taxes (GST) split into CGST and SGST
  const taxSplits: { label: string; amount: number }[] = [];
  const rates = [5, 12, 18, 28];
  const rateTotals: Record<number, number> = {}; // rate -> total taxable line amount

  lines.forEach(line => {
    const qty = line.quoteToOrderQty || 0;
    const rate = line.priceValue || 0;
    const discountValue = (line as any).discountValue || 0;
    const discountType = (line as any).discountType || 'percent';
    const taxRate = (line as any).taxRate || 0;

    if (taxRate > 0) {
      let lineAmount = qty * rate;
      if (discountType === 'percent') {
        lineAmount = lineAmount - (lineAmount * (discountValue / 100));
      } else {
        lineAmount = lineAmount - discountValue;
      }
      lineAmount = Math.max(0, lineAmount);
      
      rateTotals[taxRate] = (rateTotals[taxRate] || 0) + lineAmount;
    }
  });

  let totalTax = 0;
  rates.forEach(rate => {
    const amount = rateTotals[rate];
    if (amount) {
      const halfRate = rate / 2;
      const taxAmount = amount * (halfRate / 100);
      
      // Central GST
      taxSplits.push({
        label: `CGST${halfRate} [${halfRate}%]`,
        amount: taxAmount
      });
      // State GST
      taxSplits.push({
        label: `SGST${halfRate} [${halfRate}%]`,
        amount: taxAmount
      });
      
      totalTax += (taxAmount * 2);
    }
  });

  // 3. Calculate TCS
  const baseForTcs = subTotal + totalTax + shippingCharges + adjustment;
  const tcsAmount = baseForTcs * (tcsRate / 100);

  // 4. Grand Total
  const total = baseForTcs + tcsAmount;

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#1a1b1c] rounded-lg p-6 w-full space-y-5 text-sm text-foreground border border-border/60">
      {/* Sub Total */}
      <div className="flex justify-between items-center font-bold">
        <span className="text-foreground font-semibold">Sub Total</span>
        <span className="font-bold text-base text-foreground">{subTotal.toFixed(3)}</span>
      </div>

      {/* Dynamic Tax line if taxes exist */}
      {taxSplits.length > 0 && (
        <div className="border-l-2 border-primary pl-4 space-y-3.5 py-0.5">
          {taxSplits.map((split, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{split.label}</span>
              <span className="font-medium text-foreground">{split.amount.toFixed(3)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Shipping Charges */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <span className="text-muted-foreground text-xs sm:text-sm flex-1 sm:flex-none sm:w-1/3 sm:min-w-[120px]">Shipping</span>
        <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
          <Input
            type="number"
            className="h-8 w-20 sm:w-24 text-right bg-background border-border text-foreground px-2"
            value={shippingCharges || ''}
            onChange={(e) => setShippingCharges(parseFloat(e.target.value) || 0)}
          />
          <HelpCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-pointer hidden sm:block" />
        </div>
        <span className="font-semibold text-right w-16 sm:w-20 text-foreground text-xs sm:text-sm shrink-0">{shippingCharges.toFixed(3)}</span>
      </div>

      {/* Adjustment */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex-1 sm:flex-none sm:w-1/3 sm:min-w-[120px]">
          <span className="border border-dashed border-border/80 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded text-muted-foreground bg-background/50 text-xs sm:text-sm whitespace-nowrap">
            Adjustment
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
          <Input
            type="number"
            className="h-8 w-20 sm:w-24 text-right bg-background border-border text-foreground px-2"
            value={adjustment || ''}
            onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
          />
          <HelpCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-pointer hidden sm:block" />
        </div>
        <span className="font-semibold text-right w-16 sm:w-20 text-foreground text-xs sm:text-sm shrink-0">{adjustment.toFixed(3)}</span>
      </div>

      {/* TCS */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 pb-4 border-b border-border/60">
        <span className="text-muted-foreground text-xs sm:text-sm flex-1 sm:flex-none sm:w-1/3 sm:min-w-[120px]">TCS</span>
        <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
          <Select
            value={tcsName}
            onValueChange={(val) => {
              setTcsName(val);
              let rate = 0;
              if (val === "tcs_0_1") rate = 0.1;
              else if (val === "tcs_1") rate = 1.0;
              else if (val === "tcs_5") rate = 5.0;
              setTcsRate(rate);
            }}
          >
            <SelectTrigger className="h-8 w-[100px] sm:w-36 bg-background border-border text-[10px] sm:text-xs text-foreground px-2">
              <SelectValue placeholder="Select a Tax" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a Tax</SelectItem>
              <SelectItem value="tcs_0_1">TCS - 0.1%</SelectItem>
              <SelectItem value="tcs_1">TCS - 1%</SelectItem>
              <SelectItem value="tcs_5">TCS - 5%</SelectItem>
            </SelectContent>
          </Select>
          <HelpCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-pointer hidden sm:block" />
        </div>
        <span className="font-semibold text-right w-16 sm:w-20 text-foreground text-xs sm:text-sm shrink-0">{tcsAmount.toFixed(3)}</span>
      </div>

      {/* Grand Total */}
      <div className="flex justify-between items-center pt-2 text-base font-bold text-foreground">
        <span>Total ( ₹ )</span>
        <span className="text-lg">{total.toFixed(3)}</span>
      </div>
    </div>
  );
}
