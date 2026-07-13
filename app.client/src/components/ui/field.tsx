// components/ui/field.tsx
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal" | "responsive";
  invalid?: boolean;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, orientation = "vertical", invalid = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        data-invalid={invalid ? true : undefined}
        className={cn(
          "flex flex-col gap-1",
          orientation === "horizontal" && "sm:flex-row sm:items-center sm:gap-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Field.displayName = "Field";

const FieldContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
        {children}
      </div>
    );
  }
);
FieldContent.displayName = "FieldContent";

const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <label ref={ref} className={cn("font-medium text-sm", className)} {...props}>
        {children}
      </label>
    );
  }
);
FieldLabel.displayName = "FieldLabel";

const FieldDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
        {children}
      </p>
    );
  }
);
FieldDescription.displayName = "FieldDescription";

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: Array<{ message?: string } | undefined>;
}

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, errors, ...props }, ref) => {
    const msgs = errors?.map((e, idx) => e?.message).filter(Boolean) as string[];
    if (!children && !msgs.length) {
      return null;
    }
    return (
      <p ref={ref} className={cn("text-sm text-destructive mt-1", className)} {...props}>
        {children ?? msgs.join(", ")}
      </p>
    );
  }
);
FieldError.displayName = "FieldError";

const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props}>
        {children}
      </div>
    );
  }
);
FieldGroup.displayName = "FieldGroup";

const FieldSet = React.forwardRef<HTMLFieldSetElement, React.FieldsetHTMLAttributes<HTMLFieldSetElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <fieldset ref={ref} className={cn("border border-input rounded-md p-4", className)} {...props}>
        {children}
      </fieldset>
    );
  }
);
FieldSet.displayName = "FieldSet";

const FieldLegend = React.forwardRef<HTMLLegendElement, React.HTMLAttributes<HTMLLegendElement>>(
  ({ className, children, variant = "legend", ...props }: React.HTMLAttributes<HTMLLegendElement> & { variant?: "legend" | "label" }, ref) => {
  return (
    <legend ref={ref} className={cn(variant === "label" ? "text-sm font-semibold" : "text-base font-semibold", className)} {...props}>
      {children}
    </legend>
  );
});
FieldLegend.displayName = "FieldLegend";

const FieldSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("h-px bg-border my-4", className)} {...props}>
        {children}
      </div>
    );
  }
);
FieldSeparator.displayName = "FieldSeparator";

export {
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldSeparator,
};
