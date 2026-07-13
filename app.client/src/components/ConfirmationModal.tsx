"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ConfirmationModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
  message?: React.ReactNode;
  description?: React.ReactNode;
  yesLabel?: React.ReactNode;
  noLabel?: React.ReactNode;
  warnMessage?: React.ReactNode;
  yesVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onCancel,
  onConfirm,
  open,
  yesLabel,
  noLabel,
  message,
  description,
  warnMessage,
  yesVariant = "default",
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message || "Are you sure about it?"}</DialogTitle>
          {description && (
            <DialogDescription className=" mt-1">
              {description}
            </DialogDescription>
          )}
          {warnMessage && (
            <p className="text-sm text-red-600 mt-2">{warnMessage}</p>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onConfirm} variant={yesVariant}>
            {yesLabel || "Yes"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {noLabel || "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
