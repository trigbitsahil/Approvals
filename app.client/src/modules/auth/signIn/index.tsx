

"use client";

import { useCallback, useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Trans } from "@lingui/react";
import AsyncForm from "../../form/AsyncForm";
import TextInputField from "../../form/formInputs/TextInputFiled";
import PasswordInput from "@/modules/form/formInputs/PasswordField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import SignInValidationSchema from "./validationSchema";
import { i18n } from "@lingui/core";
import { AppServerService } from "@/api/services/AppServerService";
import type { LoginRequest } from "@/api/models/LoginRequest";
import type { AccessTokenResponse } from "@/api/models/AccessTokenResponse";
import { OpenAPI } from "@/api/core/OpenAPI";
import { storeTokens } from "@/utils/authToken";
import { CustomOpenAPIConfig } from "@/api/custom/OpenAPIConfig";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { UserService } from "@/api/services/UserService";
import { WarehouseUserService } from "@/api/services/WarehouseUserService";

const SignInForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // New state to checking token validation
  const [isVerifyingToken, setIsVerifyingToken] = useState(!!searchParams.get("token"));

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setIsVerifyingToken(true);

      const verifyToken = async () => {
        try {

        //  await new Promise((resolve) => setTimeout(resolve, 1500));

          const response = await axios.post(
            `${CustomOpenAPIConfig.BASE}/api/v1/Authentication/AuthenticateRedirectToken`,
            { token }
          );

          const { isValid, accessToken, refreshToken, message } = response.data;

          if (!isValid) {
            toast.error(message || "Invalid or expired token");
            // Remove token param to show login form
            const params = new URLSearchParams(searchParams);
            params.delete("token");
            navigate(`${pathname}?${params.toString()}`, { replace: true });
            setIsVerifyingToken(false);
            return;
          }

          // Store tokens
          storeTokens(accessToken, refreshToken);

          OpenAPI.TOKEN = CustomOpenAPIConfig.TOKEN;

          // Update auth context
          login(accessToken, refreshToken);

          try {
            // Fetch User Email
            const userRes = await UserService.getLoggedInUser("1");
            const userEmail = userRes.data?.email;

            // Fetch WarehouseUser Data
            const whUsersRes = await WarehouseUserService.warehouseUserGet("1");
            const loggedUserWHs = whUsersRes.data?.filter(
              (wu: any) => (wu.userEmail || wu.email) === userEmail
            );

            if (loggedUserWHs && loggedUserWHs.length > 0) {
              const whIds = loggedUserWHs.map((wu: any) => wu.warehouseId || wu.warehouseUserId).filter(Boolean);
              if (whIds.length > 0) {
                Cookies.set("selectedWarehouseId", whIds.join(","), { expires: 365 });
              }
            }
          } catch (e) {
            console.error("Failed to fetch/set selectedWarehouseId on token login:", e);
          }

          toast.success("Login successful!");

          // Redirect to tickets route
          navigate("/tickets", { replace: true });

        } catch (error) {
          console.error("Token verification failed:", error);
          toast.error("Login failed. Please try again.");
          // Remove token param to show login form
          const params = new URLSearchParams(searchParams);
          params.delete("token");
          navigate(`${pathname}?${params.toString()}`, { replace: true });
          setIsVerifyingToken(false);
        }
      };

      verifyToken();
    }
  }, [searchParams, login, navigate, pathname]);

  const handleSubmit = useCallback(
    (values: any) => {
      setIsLoading(true);

      const requestBody: LoginRequest = {
        email: values.email,
        password: values.password,
        twoFactorCode: "",
        twoFactorRecoveryCode: "",
      };

      AppServerService.postApiVIdentityLogin(true, false, requestBody)
        .then(async () => {
          // No need to store actual tokens anymore!
          storeTokens("", ""); 

          // Update auth state (sets isLoggedIn to true and authReady)
          login("", ""); 

          try {
            // Fetch User Email
            const userRes = await UserService.getLoggedInUser("1");
            const userEmail = userRes.data?.email;

            // Fetch WarehouseUser Data
            const whUsersRes = await WarehouseUserService.warehouseUserGet("1");
            const loggedUserWHs = whUsersRes.data?.filter(
              (wu: any) => (wu.userEmail || wu.email) === userEmail
            );

            if (loggedUserWHs && loggedUserWHs.length > 0) {
              const whIds = loggedUserWHs.map((wu: any) => wu.warehouseId || wu.warehouseUserId).filter(Boolean);
              if (whIds.length > 0) {
                Cookies.set("selectedWarehouseId", whIds.join(","), { expires: 365 });
              }
            }
          } catch (e) {
            console.error("Failed to fetch/set selectedWarehouseId on login:", e);
          }

          // Reset loading state and navigate to tickets page
          setIsLoading(false);
          toast.success("Login successful!");
          navigate("/");
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Login error:", error);
          toast.error("Login failed: " + (error?.message || "Unknown error"));
        });
    },
    [navigate, login]
  );

  const handleToggleToSignUp = () => {
    navigate("/signup");
  };

  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  if (isVerifyingToken) {
    // Show a small overlay or toast instead of full-screen loader?
    // The user wants to see the signin page, so we just let it render.
    // We can add a "Checking link..." message if needed.
  }

  return (
    <div className=" flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">
                {i18n.t({ id: "ui.Sign In", message: "Sign In" })}
              </h1>
              <p className="text-muted-foreground text-balance">
                {isVerifyingToken
                  ? "Validating your link, please wait..."
                  : i18n.t({
                    id: "ui.Welcome back Login to your account",
                    message: "Welcome back, login to your account",
                  })}
              </p>
            </div>
            <AsyncForm
              name="SignInForm"
              onSubmit={handleSubmit}
              ValidationSchema={SignInValidationSchema}
            >
              {(formProps) => (
                <div className="flex flex-col gap-6 mt-6">
                  <Field>
                    <FieldLabel htmlFor="email">
                      {i18n.t({ id: "ui.Email", message: "Email" })}
                    </FieldLabel>
                    <TextInputField
                      id="email"
                      name="email"
                      placeholder="m@example.com"
                      type="email"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">
                        {i18n.t({ id: "ui.Password", message: "Password" })}
                      </FieldLabel>
                      <a
                        href="#"
                        onClick={handleChangePassword}
                        className="ml-auto text-sm underline-offset-2 hover:underline text-primary"
                      >
                        {i18n.t({
                          id: "ui.Forgot Your Password",
                          message: "Forgot your password?",
                        })}
                      </a>
                    </div>
                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder={i18n.t({
                        id: "ui.Enter Your Password",
                        message: "Enter Your Password",
                      })}
                      required
                    />
                  </Field>
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || formProps.submitting}
                    >
                      {isLoading || formProps.submitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <Trans id="Signing In..." />
                        </div>
                      ) : (
                        i18n.t({ id: "ui.Sign In", message: "Sign In" })
                      )}
                    </Button>
                  </Field>
                  <div className="text-center text-sm text-foreground">
                    {i18n.t({
                      id: "ui.Don't have an account?",
                      message: "Don't have an account?",
                    })}{" "}
                    <button
                      onClick={handleToggleToSignUp}
                      className="text-primary underline cursor-pointer"
                      type="button"
                    >
                      {i18n.t({ id: "ui.Sign up", message: "Sign up" })}
                    </button>
                  </div>
                </div>
              )}
            </AsyncForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInForm;