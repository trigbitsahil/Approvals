"use client";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import type React from "react";
import { ConfirmationProvider } from "@/contexts/ConfirmationContext";

import { I18nProvider } from "@lingui/react";
import { lazy, Suspense } from "react";

const ForgotPasswordForm16 = lazy(
  () => import("@/modules/auth/forgotPassword"),
);
const ResetPasswordPage19 = lazy(() => import("@/modules/auth/resetPassword"));
const SignInForm36 = lazy(() => import("@/modules/auth/signIn"));
const SignUpForm37 = lazy(() => import("@/modules/auth/signUp"));
const RootTokenHandler44 = lazy(() => import("@/components/RootTokenHandler"));
const UsersList = lazy(() => import("@/components/user/UsersList"));
import { RoleManagementPage } from "@/components/user/RoleManagementPage";
import { i18n } from "@lingui/core";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavigationMenuBar } from "./components/NavigationMenu";


import DocumentsPage from "@/components/documents/DocumentsPage";
import  ApprovalsPage  from "@/components/approvals/ApprovalsPage";
import ApprovalDetailPage from "@/components/approvals/ApprovalDetailPage";
import  LedgerPage  from "@/components/ledger/LedgerPage";
import SignUpForm from "./modules/auth/signUp";
import SignInForm from "./modules/auth/signIn";
import { BankList } from "@/components/banks/BankList";
import { VendorList } from "@/components/vendors/VendorList";
import { BankTransactionList } from "@/components/banks/BankTransactionList";
import { Toaster } from "./components/ui/sonner";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import ForgotPasswordForm from "./modules/auth/forgotPassword";
import { OpenAPI } from "@/api/core/OpenAPI";
import { CustomOpenAPIConfig } from "@/api/custom/OpenAPIConfig";
import { AvatarProvider } from "@/stores/AvatarStore";
import ResetPasswordPage from "./modules/auth/resetPassword";
import FallbackRoot from "./ResetFallback";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { getAccessToken, storeTokens } from "@/utils/authToken";
import axios from "axios";
import { toast } from "sonner";


const localeMessages = {
  en: () => import("@/locales/en/messages.js"),
  hi: () => import("@/locales/hi/messages.js"),
  de: () => import("@/locales/de/messages.js"),
};

// Protected Route – requires login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

// Public Route – redirect to app if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

// Special Public Route that allows login via token (no redirect if not logged in)
const TokenAuthRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Layouts
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden bg-background">
          <NavigationMenuBar />

          <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
        </main>
        <Toaster richColors position="top-center" />
      </div>
    </SidebarProvider>
  );
};

const FullScreenLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      {children}
      <Toaster richColors position="top-center" />
    </div>
  );
};
// Add this new route component
const RedirectTokenRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>; // Completely bypass auth check
};

// Root Handler that checks for token validation or delegates to FallbackRoot
const RootTokenHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      setIsVerifying(true);
      const verifyToken = async () => {
        try {
          // Delay for 1.5 seconds as requested
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const response = await axios.post("", { token });

          const { isValid, accessToken, refreshToken, message } = response.data;

          if (!isValid) {
            toast.error(message || "Invalid or expired token");
            // Remove token param
            searchParams.delete("token");
            setSearchParams(searchParams);
            setIsVerifying(false);
            navigate("/signin", { replace: true });
            return;
          }

          // Store tokens
          storeTokens(accessToken, refreshToken);

          // Update auth context
          login(accessToken, refreshToken);
          toast.success("Login successful!");

          // Redirect to Tickets
          navigate("/tickets", { replace: true });
        } catch (error) {
          console.error("Token verification failed:", error);
          toast.error("Login failed. Please try again.");
          navigate("/signin", { replace: true });
        }
      };

      verifyToken();
    }
  }, [token, navigate, login, searchParams, setSearchParams]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-foreground">
            Validating token...
          </p>
        </div>
      </div>
    );
  }

  // If no token, use standard protection logic
  return isAuthenticated ? <FallbackRoot /> : <Navigate to="/signin" replace />;
};

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const fullScreenRoutes = ["/form-preview", "/form/", "/formbuilder"];

  // These routes always get full MainLayout (sidebar + header) even when NOT logged in
  const forceMainLayoutRoutes: string[] = [];
  const shouldForceMainLayout = forceMainLayoutRoutes.some((route) =>
    location.pathname.toLowerCase().startsWith(route.toLowerCase()),
  );

  const isFullScreen = fullScreenRoutes.some((route) =>
    location.pathname.toLowerCase().startsWith(route.toLowerCase()),
  );

  // Force MainLayout (with sidebar + header) even when not authenticated
  if (shouldForceMainLayout) {
    return <MainLayout>{children}</MainLayout>;
  }

  if (!isAuthenticated) {
    return <FullScreenLayout>{children}</FullScreenLayout>;
  }

  if (isFullScreen) {
    return <FullScreenLayout>{children}</FullScreenLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
};

function AppContent() {
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  useEffect(() => {
    const loadPreferredLocale = async () => {
      const savedLang = localStorage.getItem("lang") || "en";
      setIsLocaleReady(false);
      try {
        const langKey = savedLang as keyof typeof localeMessages;
        const module = await (localeMessages[langKey] ? localeMessages[langKey]() : localeMessages["en"]());
        const messages = (module as any).messages || (module as any).default;
        i18n.load(savedLang, messages);
        i18n.activate(savedLang);
      } catch (error) {
        console.error(`Failed to load locale ${savedLang}:`, error);
        const fallback = await localeMessages["en"]();
        i18n.load("en", (fallback as any).messages || (fallback as any).default);
        i18n.activate("en");
      } finally {
        // Critical: Make OpenAPI read token from cookies dynamically
        OpenAPI.BASE = CustomOpenAPIConfig.BASE;
        OpenAPI.VERSION = CustomOpenAPIConfig.VERSION;
        OpenAPI.WITH_CREDENTIALS = CustomOpenAPIConfig.WITH_CREDENTIALS;
        (OpenAPI as any).CREDENTIALS = CustomOpenAPIConfig.CREDENTIALS;

        // This is the key fix: token is read on every request
        (OpenAPI as any).TOKEN = async () => {
          const token = getAccessToken();
          return token || undefined;
        };

        setIsLocaleReady(true);
      }
    };

    loadPreferredLocale();
  }, []);

  // Update active project ID in localStorage whenever it's present in the URL
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const projectId = searchParams.get("projectId");
    if (projectId) {
      localStorage.setItem("activeProjectId", projectId);
    }
  }, [searchParams]);

  if (!isLocaleReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AvatarProvider>
      <I18nProvider i18n={i18n}>
        <ThemeProvider>
          <LayoutWrapper>
            <Suspense
              fallback={
                <div className="flex h-screen items-center justify-center">
                  Loading...
                </div>
              }>
              <Routes>
                {/* Public Auth Routes */}
                <Route
                  path="/signin"
                  element={
                    <PublicRoute>
                      <SignInForm />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <SignUpForm />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicRoute>
                      <ForgotPasswordForm />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <PublicRoute>
                      <ResetPasswordPage />
                    </PublicRoute>
                  }
                />
                {/* Protected Routes */}

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/banks"
                  element={
                    <ProtectedRoute>
                      <BankList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendors"
                  element={
                    <ProtectedRoute>
                      <VendorList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bank-transactions"
                  element={
                    <ProtectedRoute>
                      <BankTransactionList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute>
                      <DocumentsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UsersList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/roles"
                  element={
                    <ProtectedRoute>
                      <RoleManagementPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/approvals"
                  element={
                    <ProtectedRoute>
                      <ApprovalsPage />
                    </ProtectedRoute>
                  }
                />
                {/*<Route*/}
                {/*  path="/approvals/create"*/}
                {/*  element={*/}
                {/*    <ProtectedRoute>*/}
                {/*      <CreateApprovalPage />*/}
                {/*    </ProtectedRoute>*/}
                {/*  }*/}
                {/*/>*/}
                <Route
                  path="/approvals/:id"
                  element={
                    <ProtectedRoute>
                      <ApprovalDetailPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/Ledger"
                  element={
                    <ProtectedRoute>
                      <LedgerPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/signin" replace />} />
              </Routes>
            </Suspense>
          </LayoutWrapper>
        </ThemeProvider>
      </I18nProvider>
    </AvatarProvider>
  );
}

import { setupAxios } from "@/api/setupAxios";

// Initialize Axios interceptors
setupAxios();

export default function App() {
  return (
    <AuthProvider>
      <ConfirmationProvider>
        <AppContent />
      </ConfirmationProvider>
    </AuthProvider>
  );
}
