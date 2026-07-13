"use client";

import React from "react";
import PasswordInput from "./PasswordField";

interface ChangePasswordFieldsProps {
  fieldNames: {
    current: string;
    new: string;
    confirm: string;
  };
}

const ChangePasswordFields: React.FC<ChangePasswordFieldsProps> = ({
  fieldNames,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor={fieldNames.current}
          className="block text-sm font-medium"
        >
          Current Password
        </label>
        <PasswordInput
          name={fieldNames.current}
          placeholder="Enter current password"
        />
      </div>

      <div>
        <label htmlFor={fieldNames.new} className="block text-sm font-medium">
          New Password
        </label>
        <PasswordInput name={fieldNames.new} placeholder="Enter new password" />
      </div>

      <div>
        <label
          htmlFor={fieldNames.confirm}
          className="block text-sm font-medium"
        >
          Confirm New Password
        </label>
        <PasswordInput
          name={fieldNames.confirm}
          placeholder="Confirm new password"
        />
      </div>
    </div>
  );
};

export default ChangePasswordFields;
