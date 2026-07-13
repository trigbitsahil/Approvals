"use client";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trans } from "@lingui/react";
import { toast } from "sonner";
import AsyncForm from "../../form/AsyncForm";
import PasswordInput from "@/modules/form/formInputs/PasswordField";
import { Button } from "@/components/ui/button";
import { i18n } from "@lingui/core";
import ChangePasswordSchema from "./validationSchema";
import { UserService } from "@/api/services/UserService";
import type { ChangePasswordCommand } from "@/api/models/ChangePasswordCommand";

const ChangePasswordForm = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      if (values.newPassword !== values.confirmNewPassword) {
        toast.error("New passwords do not match.");
        return;
      }

      const payload: ChangePasswordCommand = {
        CurrentPassword: values.currentPassword,
        NewPassword: values.newPassword,
      } as any;

      try {
        await UserService.changePassword("v1", payload);
        toast.success("Password changed successfully.");
        navigate("/signin");
      } catch (error: any) {
        const message =
          error?.body?.title ||
          error?.message ||
          "Failed to change password. Please try again.";
        toast.error(message);
        console.error("Change password error:", error);
      }
    },
    [navigate]
  );

  const goToSignIn = () => navigate("/signin");

  return (
    <AsyncForm
      name="ChangePasswordForm"
      onSubmit={handleSubmit}
      ValidationSchema={ChangePasswordSchema}
    >
      {(formProps) => (
        <div className="w-full max-w-md mx-auto mt-10 px-6 py-8 rounded-xl dark:bg-zinc-900 space-y-6 bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-primary">
              {i18n.t({ id: "ui.Change Password", message: "Change Password" })}
            </h2>
          </div>

          <div>
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-foreground block"
            >
              {i18n.t({
                id: "ui.Current Password",
                message: "Current Password",
              })}
            </label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              placeholder={i18n.t({
                id: "ui.Enter Current Password",
                message: "Enter Current Password",
              })}
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-foreground block"
            >
              {i18n.t({ id: "ui.New Password", message: "New Password" })}
            </label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              placeholder={i18n.t({
                id: "ui.Enter New Password",
                message: "Enter New Password",
              })}
            />
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="text-sm font-medium text-foreground block"
            >
              {i18n.t({
                id: "ui.Confirm New Password",
                message: "Confirm New Password",
              })}
            </label>
            <PasswordInput
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder={i18n.t({
                id: "ui.Confirm Your New Password",
                message: "Confirm Your New Password",
              })}
            />
          </div>

          <div>
            <Button type="submit" className="w-full">
              {formProps.submitting ? (
                <Trans id="Changing..." />
              ) : (
                i18n.t({ id: "ui.Change Password", message: "Change Password" })
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-foreground mt-4">
            <button
              onClick={goToSignIn}
              className="text-primary underline"
              type="button"
            >
              {i18n.t({ id: "ui.Back to Sign In", message: "Back to Sign In" })}
            </button>
          </div>
        </div>
      )}
    </AsyncForm>
  );
};

export default ChangePasswordForm;
