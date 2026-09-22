import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/utils/cn";
import type { SortOrder } from "@/hooks/useDataTable";

export interface SortableHeadProps extends React.ComponentProps<typeof TableHead> {
  field: string;
  currentField: string | null;
  currentOrder: SortOrder;
  onSort: (field: string) => void;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}

export function SortableHead({
  field,
  currentField,
  currentOrder,
  onSort,
  children,
  align = "left",
  className,
  ...props
}: SortableHeadProps) {
  const isActive = currentField === field;

  const alignmentClasses = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right",
  };

  return (
    <TableHead
      className={cn(
        "cursor-pointer select-none group hover:bg-muted/60 transition-colors py-3 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={() => onSort(field)}
      {...props}
    >
      <div className={cn("flex items-center gap-1.5", alignmentClasses[align])}>
        <span>{children}</span>
        <span className="shrink-0 inline-flex items-center justify-center">
          {isActive && currentOrder === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-primary animate-in fade-in zoom-in duration-150" />
          ) : isActive && currentOrder === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-primary animate-in fade-in zoom-in duration-150" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
          )}
        </span>
      </div>
    </TableHead>
  );
}
