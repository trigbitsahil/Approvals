import { Textarea } from "@/components/ui/textarea";
import type { TextAreaProps } from '@nextui-org/react';
import React from 'react';
import { useField } from 'react-final-form';
import type { FieldProps } from './types';

const TextareaField: React.FC<FieldProps<TextAreaProps>> = ({
  errorMessage,
  name,
  onChange,
  onFocus,
  label,
  onBlur,
  ...rest
}) => {
  const { input, meta } = useField(name as string);
  const error = Boolean((meta.touched && meta.error) || meta.submitError);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      input.onChange(e);
      if (onChange) onChange(e);
    },
    [input.onChange, onChange]
  );

  const handleBlur = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      input.onBlur();
      if (onBlur) onBlur(e);
    },
    [input.onBlur, onBlur]
  );

  const handleFocus = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      input.onFocus();
      if (onFocus) onFocus(e);
    },
    [input.onFocus, onFocus]
  );

  return (
    <>
      <Textarea
        {...input}
        {...rest}
        label={label}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        classNames={{
          base: "bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700",
          input: "text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
        }}
      />
      <p className="text-red-500 text-sm mt-1">
        {error ? meta.error || meta.submitError : errorMessage}
      </p>
    </>
  );
};

export default TextareaField;
