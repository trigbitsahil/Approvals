"use client";

import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { Trans } from "@lingui/react";
import { i18n } from "@lingui/core";

import AsyncForm from "../../form/AsyncForm";
import { Button } from "@/components/ui/button";
import TextField from "@/modules/form/formInputs/TextInputFiled";
import ResetPasswordSchema from "./validationSchema";
import { UserService } from "@/api/services/UserService";

/* ------------------------------------------------------------------ */
/* 1️⃣  Whole Page Component                                          */
/* ------------------------------------------------------------------ */
const ResetPasswordPage = () => {
  /* ── Read query params ─────────────────────────────────────────── */
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  /* ── Persist token in a short‑lived cookie (15 min)  OPTIONAL ─── */
  useEffect(() => {
    if (token) Cookies.set("resetToken", token, { expires: 1 / 96 }); // 15 min
  }, [token]);

  /* ── Guard: malformed link → back to forgot‑password ───────────── */
  if (!email || !token) {
    navigate("/forgot-password", { replace: true });
    return null;
  }

  /* ── Render the form ───────────────────────────────────────────── */
  return <ResetPasswordForm email={email} token={token} />;
};

export default ResetPasswordPage;

/* ------------------------------------------------------------------ */
/* 2️⃣  Form Component (nested in same file)                           */
/* ------------------------------------------------------------------ */
interface Props {
  email: string;
  token: string;
}

const ResetPasswordForm = ({ email, token }: Props) => {
  const navigate = useNavigate();

  /* ── Submit handler ────────────────────────────────────────────── */
  const handleSubmit = useCallback(
    async (values: { password: string; confirmPassword: string }) => {
      try {
        await UserService.resetPassword("1", {
          email,
          token,
          newPassword: values.password,
          Password: values.password, // API expects "Password" field
        });

        alert(
          i18n.t({
            id: "ui.Password reset success",
            message: "Your password has been successfully reset.",
          })
        );

        navigate("/signin");
      } catch (error: any) {
        console.error("Reset‑password error:", error);
        alert(
          i18n.t({
            id: "ui.Reset password failure",
            message: "Failed to reset password: ",
          }) + (error?.message ?? "")
        );
      }
    },
    [navigate, email, token]
  );

  /* ── UI ────────────────────────────────────────────────────────── */
  return (
    <AsyncForm
      name="ResetPasswordForm"
      onSubmit={handleSubmit}
      ValidationSchema={ResetPasswordSchema}
    >
      {(formProps) => (
        <div className="w-full max-w-md mx-auto mt-10 px-6 py-8 rounded-xl dark:bg-zinc-900 space-y-6 bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-md">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-primary">
              {i18n.t({ id: "ui.Reset Password", message: "Reset Password" })}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {i18n.t({
                id: "ui.Enter new password",
                message: "Please enter your new password below.",
              })}
            </p>
          </div>

          {/* New password */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground block"
            >
              {i18n.t({ id: "ui.New Password", message: "New Password" })}
            </label>
            <TextField
              id="password"
              name="password"
              type="password"
              placeholder={i18n.t({
                id: "ui.Enter New Password",
                message: "Enter new password",
              })}
            />
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground block"
            >
              {i18n.t({
                id: "ui.Confirm Password",
                message: "Confirm Password",
              })}
            </label>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={i18n.t({
                id: "ui.Re-enter Password",
                message: "Re-enter your password",
              })}
            />
          </div>

          {/* Submit button */}
          <div>
            <Button type="submit" className="w-full">
              {formProps.submitting ? (
                <Trans id="Submitting..." />
              ) : (
                i18n.t({
                  id: "ui.Reset Password Button",
                  message: "Reset Password",
                })
              )}
            </Button>
          </div>
        </div>
      )}
    </AsyncForm>
  );
};
