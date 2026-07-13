import React from "react";
import {
  Checkbox,
  type CheckboxProps as NextUiCheckboxProps,
} from "@nextui-org/react";
import { useField, type FieldProps } from "react-final-form";

export type CheckBoxProps = NextUiCheckboxProps & {
  errorMessage?: string | number | React.ReactElement;
  label?: string | number | React.ReactElement;
};
const CheckboxField: React.FC<FieldProps<CheckBoxProps>> = ({
  errorMessage,
  name,
  label,
  onChange,
  onFocus,
  onBlur,
  rest,
}) => {
  const { input, meta } = useField(name as string);
  const error = Boolean((meta.touched && meta.error) || meta.submitError);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      input.onChange(e.currentTarget.checked);
      if (onChange) {
        onChange(e);
      }
      input.onBlur();
    },
    [input.onChange, input.onBlur, onChange]
  );
  return (
    <div className=" flex flex-col">
      <Checkbox name={input.name} onChange={handleChange}>
        {/* {...rest} */}
        {label}
      </Checkbox>
      <p className="text-red-500 p-2">
        {error ? meta.error || meta.submitError : errorMessage}
      </p>
    </div>
  );
};
export default CheckboxField;
