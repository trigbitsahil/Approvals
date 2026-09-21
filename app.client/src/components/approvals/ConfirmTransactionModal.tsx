"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckCircle2,
  Upload,
  FileText,
  Loader2,
  X,
  AlertCircle
} from "lucide-react";
import { BankTransactionService } from "@/api/services/BankTransactionService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { getFileExtension, getMimeType } from "@/utils/file-utils";
import type { PendingBankTransactionVM } from "@/api/models/PendingBankTransactionVM";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface ConfirmTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingTx: PendingBankTransactionVM | null;
  approvalId: string;
  approvalType?: string;
  onSuccess: () => Promise<void>;
}

export default function ConfirmTransactionModal({
  open,
  onOpenChange,
  pendingTx,
  approvalId,
  approvalType,
  onSuccess,
}: ConfirmTransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [remarks, setRemarks] = useState<string>("");
  const [settlementType, setSettlementType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDebtorOrReceipt = Boolean(
    pendingTx?.debtorId ||
    pendingTx?.debtorName ||
    pendingTx?.approvalType?.toLowerCase().includes("receipt") ||
    approvalType?.toLowerCase().includes("receipt")
  );

  if (!pendingTx) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Upload documents if selected (Optional)
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result?.toString() || "");
            reader.onerror = reject;
          });

          const base64Content = base64.split(",")[1];
          const rawExt = getFileExtension(file.name);
          const extension = rawExt.startsWith(".") ? rawExt : `.${rawExt}`;

          const docRes = await DocumentsService.postApiVDocuments("1", {
            name: file.name,
            description: `Confirmation document for approval: ${pendingTx.approvalName || approvalId}`,
            content: base64Content,
            category: "Approval",
            categoryID: approvalId,
            extension: extension,
            contentType: file.type || getMimeType(file.name),
            documentFileName: file.name,
            documentType: "SettlementProof",
            documentTypeID: pendingTx.transactionId,
            documentDate: new Date().toISOString(),
          } as any);

          if (!docRes.success) {
            toast.error(docRes.message || `Failed to upload '${file.name}'`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      // 2. Confirm transaction with remarks & confirmedAmount
      const confirmedAmt = settlementType === "partial" && partialAmount ? parseFloat(partialAmount) : undefined;
      const res = await BankTransactionService.confirmTransaction(pendingTx.transactionId, remarks, confirmedAmt);
      if (res.success) {
        toast.success(res.message || "Transaction confirmed successfully.");
        onOpenChange(false);
        setSelectedFiles([]);
        setRemarks("");
        setSettlementType("full");
        setPartialAmount("");
        await onSuccess();
      } else {
        toast.error(res.message || "Failed to confirm transaction.");
      }
    } catch (err: any) {
      console.error("Confirmation error:", err);
      toast.error(err?.message || "An error occurred during confirmation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!isSubmitting) {
        if (!val) {
          setSelectedFiles([]);
          setRemarks("");
          setSettlementType("full");
          setPartialAmount("");
        }
        onOpenChange(val);
      }
    }}>
      <DialogContent className="sm:max-w-xl rounded-2xl p-7 gap-6 bg-card border-border/50">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
            Confirm & Finalize
          </DialogTitle>
          
        </DialogHeader>

        {/* Settlement Type Selection (Only for Expense/Distributor/Bank Transfer, hidden for Receipts/Debtors) */}
        {!isDebtorOrReceipt && (
          <div className="space-y-3 p-4 bg-muted/20 border border-border/50 rounded-xl">
            <label className="text-sm font-semibold text-foreground block">
              Settlement Option
            </label>
            <RadioGroup
              value={settlementType}
              onValueChange={(val) => setSettlementType(val as "full" | "partial")}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <RadioGroupItem value="full" id="r-full" />
                <label htmlFor="r-full" className="text-sm font-medium text-foreground cursor-pointer">
                  Full Amount {pendingTx ? `(₹${pendingTx.amount.toLocaleString("en-IN")})` : ""}
                </label>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer">
                <RadioGroupItem value="partial" id="r-partial" />
                <label htmlFor="r-partial" className="text-sm font-medium text-foreground cursor-pointer">
                  Partial Amount
                </label>
              </div>
            </RadioGroup>

            {settlementType === "partial" && (
              <div className="pt-2 space-y-1.5 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Partial Amount
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Max allowed: ₹{pendingTx ? pendingTx.amount.toLocaleString("en-IN") : 0}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">
                    ₹
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter partial amount..."
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    className="pl-7 bg-background border-border/50 rounded-xl text-sm"
                    max={pendingTx?.amount}
                    min={0}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Remarks Section */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Remarks <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
          </label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks or notes..."
            className="bg-muted/30 border-border/50 text-sm min-h-[85px] resize-none rounded-xl"
            rows={3}
          />
        </div>

        {/* Document Upload Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Upload Document <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
            </label>
            <span className="text-xs text-muted-foreground">PDF, PNG, JPG, DOCX</span>
          </div>

          {/* Dropzone Button */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/60 hover:border-primary/40 bg-muted/20 hover:bg-primary/5 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">
              Click or drag documents to upload
            </p>
            <p className="text-xs text-muted-foreground">Upload receipt, bank statement, or transaction slip</p>
          </div>

          {/* Selected Files Chips */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2 pt-1 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted/40 border border-border/40 rounded-xl text-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span className="font-semibold text-foreground truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-[10px] font-bold text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
                      Attached
                    </Badge>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRemoveFile(idx)}
                      className="text-muted-foreground hover:text-rose-500 p-1 rounded-md transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-3 pt-3 border-t border-border/40">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSelectedFiles([]);
              setRemarks("");
              setSettlementType("full");
              setPartialAmount("");
              onOpenChange(false);
            }}
            disabled={isSubmitting}
            className="rounded-xl text-sm font-bold h-10 px-5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl text-sm font-bold uppercase gap-2 h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all hover:scale-105 active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Confirm & Finalize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
