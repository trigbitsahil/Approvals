"use client";

import { useCallback, useState } from "react";
import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { i18n } from "@lingui/core";
import { UserService } from "@/api/services/UserService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import validationSchema from "./validationSchema";

const required = (value: any) => (value ? undefined : "Required");

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(
    async (values: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      try {
        await UserService.postApiVUser("1", {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          userName: values.email,
        });

        toast.success("User registered successfully!");
        navigate("/signin");
      } catch (error: any) {
        console.error("Signup error:", error);
        toast.error(
          i18n.t({
            id: "ui.Signup failure",
            message: "Failed to register user: ",
          }) + (error?.message ?? "")
        );
      }
    },
    [navigate]
  );

  return (
    <div className="w-full max-w-md mx-auto mt-10 px-6 py-8 rounded-xl  dark:bg-zinc-900  space-y-6 bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-md">
      <h2 className="text-2xl font-semibold text-center text-primary mb-6">
        {i18n.t({ id: "ui.Sign Up", message: "Sign Up" })}
      </h2>

      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  First Name
                </label>
                <Field name="firstName" validate={required}>
                  {({ input, meta }) => (
                    <>
                      <input
                        {...input}
                        type="text"
                        placeholder="First Name"
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      {meta.touched && meta.error && (
                        <span className="text-sm text-red-500">
                          {meta.error}
                        </span>
                      )}
                    </>
                  )}
                </Field>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Last Name
                </label>
                <Field name="lastName" validate={required}>
                  {({ input, meta }) => (
                    <>
                      <input
                        {...input}
                        type="text"
                        placeholder="Last Name"
                        className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      {meta.touched && meta.error && (
                        <span className="text-sm text-red-500">
                          {meta.error}
                        </span>
                      )}
                    </>
                  )}
                </Field>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <Field name="email" validate={required}>
                {({ input, meta }) => (
                  <>
                    <input
                      {...input}
                      type="email"
                      placeholder="email@example.com"
                      className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    {meta.touched && meta.error && (
                      <span className="text-sm text-red-500">{meta.error}</span>
                    )}
                  </>
                )}
              </Field>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Password</label>
              <Field name="password" validate={required}>
                {({ input, meta }) => (
                  <div className="relative">
                    <input
                      {...input}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {meta.touched && meta.error && (
                      <span className="text-sm text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>
            </div>

            <div className="relative text-center text-sm after:border-t after:absolute after:inset-x-0 after:top-1/2 after:z-0">
              <span className="relative z-10 px-2 bg-background text-muted-foreground">
                {i18n.t({
                  id: "ui.or continue with",
                  message: "or continue with",
                })}
              </span>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" type="button" className="w-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Login with Google</span>
              </Button>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-10 bg-primary  rounded-md  transition-colors"
            >
              {i18n.t({ id: "ui.Sign Up", message: "Sign Up" })}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              {i18n.t({
                id: "ui.Already have an account?",
                message: "Already have an account?",
              })}{" "}
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="text-primary underline"
              >
                {i18n.t({ id: "ui.Sign in", message: "Sign in" })}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default SignUpForm;
