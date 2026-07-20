'use client';

import React, { useEffect, useState } from "react";
import { BankService } from "@/api/services/BankService";
import type { BankListVM } from "@/api/models/BankListVM";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Landmark } from "lucide-react";

export function InitialBalance() {
  const [banks, setBanks] = useState<BankListVM[]>([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const res: any = await BankService.getBanks();
      if (res.success) {
        setBanks(res.data);
      }
    } catch (e) {
      toast.error("Failed to fetch banks.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBankId) {
      toast.error("Please select a bank.");
      return;
    }
    if (amount === "" || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      await BankService.updateBank({
        bankId: selectedBankId,
        initialBalanceDescription: description || "Initial Balance",
        initialBalanceAmount: Number(amount),
      });
      toast.success("Initial balance updated successfully.");
      setSelectedBankId("");
      setDescription("");
      setAmount("");
    } catch (err: any) {
      toast.error(err?.body?.message || "Failed to set initial balance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border-border">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Initial Balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Bank Account
                </label>
                <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank..." />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((b) => (
                      <SelectItem key={b.bankId} value={b.bankId}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Amount
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional notes..."
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InitialBalance;