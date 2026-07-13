import React from "react";
import { useField } from "react-final-form";
import { Input } from "@/components/ui/input";
import type { InputProps } from "@nextui-org/react";
import type { FieldProps } from "./types";

const TextInputField: React.FC<FieldProps<InputProps>> = ({
  name,
  onBlur,
  onChange,
  onFocus,
  errorMessage,
  ...rest
}) => {
  const { input, meta } = useField(name as string);
  const error = Boolean((meta.touched && meta.error) || meta.submitError);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      input.onChange(e);
      onChange?.(e);
    },
    [onChange, input.onChange]
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      input.onBlur();
      onBlur?.(e);
    },
    [onBlur, input.onBlur]
  );

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      input.onFocus(e);
      onFocus?.(e);
    },
    [onFocus, input.onFocus]
  );

  return (
    <div>
      <Input
        {...input}
        {...rest}
        isInvalid={error}
        description={error ? meta.error || meta.submitError : undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        classNames={{
          inputWrapper:
            " dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700",
          input:
            "text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
        }}
      />

      <p className="text-red-500">
        {error ? meta.error || meta.submitError : errorMessage}
      </p>
    </div>
  );
};

export default TextInputField;
