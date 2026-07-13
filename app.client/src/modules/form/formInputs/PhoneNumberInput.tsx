import { Input } from '@/components/ui/input';
import type { InputProps } from '@nextui-org/react';
import React from 'react';
import { useField } from 'react-final-form';
import type { FieldProps } from './types';

const PhoneNumberInput: React.FC<FieldProps<InputProps>> = ({
  errorMessage,
  name,
  onChange,
  onFocus,
  onBlur,
  ...rest 
}) => {
  const { input, meta } = useField(name as string);
  const error = Boolean((meta.touched && meta.error) || meta.submitError);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const lastChar = parseInt(inputValue[inputValue.length - 1], 10);
      if (!isNaN(lastChar) || !inputValue) {
        input.onChange(e);
        if (onChange) {
          onChange(e);
        }
      }
    },
    [onChange, input.onChange]
  );

  const handleBlur = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      input.onBlur();
      if (onBlur) {
        onBlur(e);
      }
    },
    [onBlur, input.onBlur]
  );

  const handleFocus = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      input.onFocus();
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus, input.onFocus]
  );

  return (
    <>
      <Input
        {...input}
        {...rest} 
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        classNames={{
    inputWrapper: "bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700",
    input: "text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
  }}

      />
      <p className="text-red-500">
        {error ? meta.error || meta.submitError : errorMessage}
      </p>
    </>
  );
};

export default PhoneNumberInput;
