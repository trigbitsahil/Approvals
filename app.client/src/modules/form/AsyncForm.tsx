import React from "react";
import { Form } from "react-final-form";
import { Schema } from "yup";
import type { FormProps, FormRenderProps } from "react-final-form";

export type AsyncFormProps = Omit<
  FormProps,
  "render" | "component" | "children"
> & {
  name: string;
  ValidationSchema?: Schema;
  transformValues?: (data: Record<string, any>) => any;
  children: (props: FormRenderProps) => React.ReactNode;
};

const AsyncForm: React.FC<AsyncFormProps> = ({
  name,
  ValidationSchema,
  transformValues,
  children,
  onSubmit,
  ...rest
}) => {
  const handleValidate = React.useCallback(
    async (values: { [key: string]: any }) => {
      try {
        const newValues = transformValues
          ? transformValues(values)
          : { ...values };
        if (ValidationSchema) {
          try {
            await ValidationSchema.validate(newValues, {
              context: { ...values, ...newValues },
              abortEarly: false,
            });
            return {};
          } catch (err) {
            if (err.name === "ValidationError") {
              const errors: Record<string, string> = {};
              err.inner.forEach((error: { path: string; message: string }) => {
                errors[error.path] = error.message;
              });
              return errors;
            }
            return {};
          }
        }
        return {};
      } catch (err) {
        console.error("Validation error:", err);
        return {};
      }
    },
    [ValidationSchema, transformValues]
  );

  return (
    <Form name={name} onSubmit={onSubmit} validate={handleValidate} {...rest}>
      {(formProps) => (
        <form onSubmit={formProps.handleSubmit} noValidate>
          {children(formProps)}
        </form>
      )}
    </Form>
  );
};

export default AsyncForm;
