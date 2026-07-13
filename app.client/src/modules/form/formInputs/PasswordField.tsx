"use client";

import React, { useCallback, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useField } from "react-final-form";
import type { FieldProps } from "./types";
import { Input } from "@/components/ui/input"; 
const PasswordInput: React.FC<FieldProps<React.InputHTMLAttributes<HTMLInputElement>>> = ({
  errorMessage,
  name,
  onChange,
  onFocus,
  onBlur,
  ...rest
}) => {
  const { input, meta } = useField(name as string);
  const error = Boolean((meta.touched && meta.error) || meta.submitError);

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible((prev) => !prev);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      input.onChange(e);
      if (onChange) onChange(e);
    },
    [input.onChange, onChange]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      input.onFocus();
      if (onFocus) onFocus(e);
    },
    [input.onFocus, onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      input.onBlur();
      if (onBlur) onBlur(e);
    },
    [input.onBlur, onBlur]
  );

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          {...input}
          {...rest}
          id={name}
          type={visible ? "text" : "password"}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 focus:outline-none cursor-pointer"
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {meta.error || meta.submitError || errorMessage}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
