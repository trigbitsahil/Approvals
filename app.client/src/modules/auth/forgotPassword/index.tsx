"use client";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trans } from "@lingui/react";
import { i18n } from "@lingui/core";

import AsyncForm from "../../form/AsyncForm";
import { Button } from "@/components/ui/button";
import TextField from "@/modules/form/formInputs/TextInputFiled";
import ForgotPasswordSchema from "./validationSchema";
import { UserService } from "@/api/services/UserService";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: { email: string }) => {
      try {
        await UserService.forgotPassword("1", {
          email: values.email,
          ClientUrl: `${window.location.origin}/reset-password`,
        });

        alert(
          i18n.t({
            id: "ui.Reset link sent",
            message:
              "If the email exists, a password‑reset link has been sent.",
          })
        );

        navigate("/signin");
      } catch (error: any) {
        console.error("Forgot‑password error:", error);
        alert(
          i18n.t({
            id: "ui.Forgot password failure",
            message: "Failed to send reset link: ",
          }) + (error?.message ?? "")
        );
      }
    },
    [navigate]
  );

  /** Navigate back to sign‑in *************************************************/
  const goToSignIn = () => navigate("/signin");

  /** Render *******************************************************************/
  return (
    <AsyncForm
      name="ForgotPasswordForm"
      onSubmit={handleSubmit}
      ValidationSchema={ForgotPasswordSchema}
    >
      {(formProps) => (
        <div className="w-full max-w-md mx-auto mt-10 px-6 py-8 rounded-xl dark:bg-zinc-900 space-y-6 bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-md">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-primary">
              {i18n.t({ id: "ui.Forgot Password", message: "Forgot Password" })}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {i18n.t({
                id: "ui.Reset instructions",
                message:
                  "Enter your account email and we'll send a reset link.",
              })}
            </p>
          </div>

          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground block"
            >
              {i18n.t({ id: "ui.Email", message: "Email" })}
            </label>
            <TextField
              id="email"
              name="email"
              type="email"
              placeholder={i18n.t({
                id: "ui.Enter Email",
                message: "Enter your email address",
              })}
            />
          </div>

          {/* Submit button */}
          <div>
            <Button type="submit" className="w-full">
              {formProps.submitting ? (
                <Trans id="Sending..." />
              ) : (
                i18n.t({
                  id: "ui.Send Reset Link",
                  message: "Send Reset Link",
                })
              )}
            </Button>
          </div>

          {/* Back to sign in */}
          <div className="text-center text-sm text-foreground mt-4">
            <button
              onClick={goToSignIn}
              className="text-primary underline"
              type="button"
            >
              {i18n.t({
                id: "ui.Back to Sign In",
                message: "Back to Sign In",
              })}
            </button>
          </div>
        </div>
      )}
    </AsyncForm>
  );
};

export default ForgotPasswordForm;
