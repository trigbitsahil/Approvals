import React from "react";
import { useField } from "react-final-form";
import type { FieldProps } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import { Label } from "@/components/ui/label";

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = FieldProps<{
  label?: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
}>;

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder,
  options,
  onChange,
  onFocus,
  onBlur,
  errorMessage,
  disabled,
  ...rest
}) => {
  const { input, meta } = useField(name as string);
  const error = Boolean((meta.touched && meta.error) || meta.submitError);

  const handleChange = (value: string) => {
    input.onChange(value);
    if (onChange) {
      onChange({ target: { name, value } } as any); 
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    input.onBlur();
    if (onBlur) onBlur(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    input.onFocus();
    if (onFocus) onFocus(e);
  };

  return (
    <div className="w-full space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Select
        disabled={disabled}
        onValueChange={handleChange}
        value={input.value}
        {...rest}
      >
        <SelectTrigger
          id={name}
          className={`w-full ${
            error ? "border-red-500 focus:ring-red-500" : ""
          }`}
          onBlur={handleBlur}
          onFocus={handleFocus}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-zinc-900 text-black dark:text-white">
          {options.map((option:Option):React.ReactNode => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {meta.error || meta.submitError}
        </p>
      )}
    </div>
  );
};

export default SelectField;
