// File: src/components/ui/typography.tsx
import React from "react";
import { cn } from "@/utils/cn";

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: "h1" | "h2" | "h3" | "p";
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "p",
  className,
  children,
  ...props
}) => {
  const Tag = variant;

  return (
    <Tag
      className={cn(
        variant === "h1" && "text-4xl font-bold",
        variant === "h2" && "text-2xl font-semibold",
        variant === "h3" && "text-xl font-medium",
        variant === "p" && "text-base",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Typography;
