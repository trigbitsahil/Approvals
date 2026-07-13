"use client";

import React from "react";

export type TextProps = {
  numberOfLines?: number;
  component?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

const Text: React.FC<TextProps> = ({
  numberOfLines,
  component: Component = "p",
  className = "",
  children,
  ...rest
}) => {
  const style: React.CSSProperties = numberOfLines
    ? {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: numberOfLines,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }
    : {};

  return (
    <Component className={className} style={style} {...rest}>
      {children}
    </Component>
  );
};

export default Text;
