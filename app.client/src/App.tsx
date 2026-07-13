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
const PageWrapper0 = lazy(
    () => import("@/pages/Inventory/Adjustments/Create/index"),
);
import { TransactionHistory as TransactionHistory1 } from "@/components/transaction-history/TransactionHistory";
const PageWrapper2 = lazy(() => import("@/pages/Order/MoveOrder/Create/index"));
const PageWrapper3 = lazy(() => import("@/pages/Inventory/Adjustments/index"));
const PageWrapper4 = lazy(() => import("@/pages/Order/inventory-items/index"));
const PageWrapper5 = lazy(() => import("@/pages/Order/myopenoutbound/index"));
const PageWrapper6 = lazy(() => import("@/pages/Order/myopeninbound/index"));
const PageWrapper7 = lazy(() => import("@/pages/Order/openoutbound/index"));
const PageWrapper8 = lazy(() => import("@/pages/Order/alloutbound/index"));
const PageWrapper9 = lazy(() => import("@/pages/Order/openinbound/index"));
const PageWrapper10 = lazy(() => import("@/pages/WarehouseLocation/index"));
const CompanyManagementPage11 = lazy(
    () => import("@/components/company/layout"),
);
const PageWrapper12 = lazy(() => import("@/pages/Order/allinbound/index"));
const PageWrapper13 = lazy(() => import("@/pages/Inventory/Types/index"));
const PageWrapper14 = lazy(() => import("@/pages/Order/MoveOrder/index"));
const PageWrapper15 = lazy(() => import("@/pages/Warehouse/Users/index"));
const ForgotPasswordForm16 = lazy(
    () => import("@/modules/auth/forgotPassword"),
);
const FormBuilder17 = lazy(
    () => import("@/components/DynamicForm/builder/form-builder"),
);
const PageWrapper18 = lazy(() => import("@/pages/redirectTicket/index"));
const ResetPasswordPage19 = lazy(() => import("@/modules/auth/resetPassword"));
const PageWrapper20 = lazy(() => import("@/pages/InventoryItem/index"));
const PageWrapper21 = lazy(() => import("@/pages/Order/move/index"));
const PageWrapper22 = lazy(() => import("@/pages/form/event/index"));
const PageWrapper23 = lazy(() => import("@/pages/Warehouse/index"));
const PageWrapper24 = lazy(() => import("@/pages/orderform/index"));
import { TaskManagement as TaskManagement25 } from "@/components/tasks/TaskManagement";
const PageWrapper26 = lazy(() => import("@/pages/settings/index"));
const SopPage27 = lazy(() => import("@/components/Sop"));
const Account28 = lazy(() => import("@/components/Account"));
const PageWrapper29 = lazy(() => import("@/pages/barcode/index"));
import { InvoiceForm as InvoiceForm30 } from "@/components/InvoiceForm";
const ProfilePage31 = lazy(() => import("@/components/ProfilePage"));
const TicketingSystem32 = lazy(
    () => import("@/components/ticket/TicketManagement"),
);
const CitiesPage33 = lazy(() => import("@/components/Cities"));
const KanbanBoard34 = lazy(() => import("@/components/kanban/KanbanBoard"));
const PageWrapper35 = lazy(() => import("@/pages/orders/index"));
const SignInForm36 = lazy(() => import("@/modules/auth/signIn"));
const SignUpForm37 = lazy(() => import("@/modules/auth/signUp"));
const PageWrapper38 = lazy(() => import("@/pages/Order/index"));
const OrgChart39 = lazy(() => import("@/components/OrganisationChart"));
const FormTemplatesPage40 = lazy(
    () => import("@/components/DynamicForm/FormTemplates"),
);
const Inbox41 = lazy(() => import("@/components/Inbox"));
const UserTable42 = lazy(() => import("@/components/user/UserTable"));
const UserManagementPage43 = lazy(() => import("@/components/user/UsersList"));
const RootTokenHandler44 = lazy(() => import("@/components/RootTokenHandler"));
import { TransactionHistoryDetails as TransactionHistoryDetails45 } from "@/components/transaction-history/TransactionHistoryDetails";
const PageWrapper46 = lazy(
    () => import("@/pages/Order/[id]/Pick/[lineId]/index"),
);
const PageWrapper47 = lazy(
    () => import("@/pages/form/formSubmission/[id]/index"),
);
const PageWrapper49 = lazy(() => import("@/pages/form/formbuilder/[id]/index"));
const PageWrapper51 = lazy(() => import("@/pages/barcode/product/[id]/index"));
const BarcodeGeneratorPage59 = lazy(
    () => import("@/pages/barcode/generator/index"),
);
const DocumentsPage60 = lazy(
    () => import("@/components/documents/DocumentsPage"),
);
const ContactPage61 = lazy(() => import("@/components/contacts/ContactPage"));
const ApprovalsPage62 = lazy(
    () => import("@/components/approvals/ApprovalsPage"),
);
//const CreateApprovalPage = lazy(
//  () => import("@/components/approvals/create/CreateApprovalPage"),
//);
const ExpenseTransactionPage = lazy(
    () => import("@/components/expense-transaction/ExpenseTransactionPage"),
);
const BudgetPage = lazy(() => import("@/components/budget/BudgetPage"));
const FileSystemPage = lazy(
    () => import("@/components/file-system/FileSystemPage"),
);
const ReportsPage = lazy(() => import("@/components/reports/ReportsPage"));
const CustomerPage = lazy(() => import("@/components/customer/CustomerPage"));
const CustomerDetailsPage = lazy(
    () => import("@/components/customer/CustomerDetailsPage"),
);
const QuotesPage = lazy(() => import("@/components/quotes/QuotesPage"));
const QuoteDetailsPage = lazy(
    () => import("@/components/quotes/QuoteDetailsPage"),
);
const TeamPage = lazy(() => import("@/components/teams/TeamPage"));

const PageWrapper52 = lazy(() => import("@/pages/InventoryItem/[id]/index"));
const BillingItemDetailPage = lazy(
    () => import("@/pages/BillingItem/[id]/index"),
);
const MediaFormPreviewPage53 = lazy(
    () => import("@/components/DynamicForm/preview/FormPreviewPage1"),
);
const FormBuilder55 = lazy(
    () => import("@/components/DynamicForm/builder/form-builder"),
);
const PageWrapper56 = lazy(() => import("@/pages/form/list/[id]/index"));
const TicketDetailPage57 = lazy(
    () => import("@/components/ticket/TicketDetailPage"),
);
const PageWrapper58 = lazy(() => import("@/pages/Order/[id]/index"));
const UserDetailPage59 = lazy(() => import("@/pages/User/[id]/index"));
const ApprovalDetailPage = lazy(
    () => import("@/components/approvals/ApprovalDetailPage"),
);
const WatermarkCameraPage = lazy(
    () => import("@/components/camera/WatermarkCameraPage"),
);

import { i18n } from "@lingui/core";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavigationMenuBar } from "./components/NavigationMenu";
import Inbox from "./components/Inbox";
import SignUpForm from "./modules/auth/signUp";
import SignInForm from "./modules/auth/signIn";
import UserTable from "./components/user/UserTable";
import Settings from "@/pages/settings/index";
import Account from "./components/Account";
import { Toaster } from "./components/ui/sonner";
import KanbanBoard from "./components/kanban/KanbanBoard";
import OrgChart from "./components/OrganisationChart";
import { InvoiceForm } from "./components/Invoice/InvoiceForm";
import { PushManager } from "./components/PushManager";
import TicketingSystem from "./components/ticket/TicketManagement";
import ProfilePage from "./components/ProfilePage";
import ForgotPasswordForm from "./modules/auth/forgotPassword";
import CitiesPage from "./components/Cities";
import { OpenAPI } from "@/api/core/OpenAPI";
import { CustomOpenAPIConfig } from "@/api/custom/OpenAPIConfig";
import SopPage from "./components/Sop";
import { AvatarProvider } from "@/stores/AvatarStore";
import ResetPasswordPage from "./modules/auth/resetPassword";
import FallbackRoot from "./ResetFallback";
import UserManagementPage from "./components/user/UsersList";
import FormTemplatesPage from "./components/DynamicForm/FormTemplates";
import FormBuilder from "./components/DynamicForm/builder/form-builder";
import MediaFormPreviewPage from "./components/DynamicForm/preview/FormPreviewPage1";
import PublicFormPage from "./components/DynamicForm/PublicFormPage";
import FormSubmissionDashboard from "./components/DynamicForm/FormSubmissionDashboard";
import BillingItem from "./components/BillingItem/BillingItemList";
import CompanyManagementPage from "./components/company/layout";
import { TaskManagement } from "./components/tasks/TaskManagement";
import { TaskListView } from "./components/tasks/TaskListView";
import { TaskDetails } from "./components/tasks/TaskDetails";
import NotesPage from "./components/notes/NotesPage";
import InvoicesPage from "@/components/Invoice/InvoicePage";
import InvoiceDetailPage from "@/components/Invoice/InvoiceDetailPage";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import TicketDetailPage from "./components/ticket/TicketDetailPage";
import { getAccessToken, storeTokens } from "@/utils/authToken";
import RedirectTicket from "./pages/redirectTicket/index";
import RedirectApp from "./pages/redirectApp/index";


import axios from "axios";
import { toast } from "sonner";
import ActiveUsers from "./components/kanban/ProjectUsers";
import SurveyDashboard from "./components/Survey/SurveyDashboard";
import SupervisorBoard from "./components/Survey/SurveySupervisor";
import SurveyWizard from "./components/Survey/SurveyWizard";
import SurveyDetail from "./components/Survey/SurveyDetail";
import AgentPage from "@/app/page";



const ProjectDashboard = lazy(() => import("@/components/project-dashboard/ProjectDashboard"));
const IncomeManagementPage = lazy(() => import("@/components/income/IncomeManagement").then(m => ({ default: m.IncomeManagement })));
const IncomeTransactionPage = lazy(() => import("@/components/income-transaction/IncomeTransactionPage"));
const LedgerPage = lazy(() => import("@/components/ledger/LedgerPage"));

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
                <main className="flex-1 min-h-screen overflow-x-hidden">
                    <NavigationMenuBar />
                    <SidebarTrigger />
                    <PushManager />
                    <div className="p-4">{children}</div>
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

                    const response = await axios.post(
                        "https://dev2025-ajf0hucveba5fvax.centralindia-01.azurewebsites.net/api/v1/Authentication/AuthenticateRedirectToken",
                        { token },
                    );

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
    const forceMainLayoutRoutes = ["/redirectApp", "/redirectTicket"];
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
                const module = await localeMessages[savedLang]();
                const messages = module.messages || module.default;
                i18n.load(savedLang, messages);
                i18n.activate(savedLang);
            } catch (error) {
                console.error(`Failed to load locale ${savedLang}:`, error);
                const fallback = await localeMessages["en"]();
                i18n.load("en", fallback.messages || fallback.default);
                i18n.activate("en");
            } finally {
                // Critical: Make OpenAPI read token from cookies dynamically
                OpenAPI.BASE = CustomOpenAPIConfig.BASE;
                OpenAPI.VERSION = CustomOpenAPIConfig.VERSION;
                OpenAPI.WITH_CREDENTIALS = CustomOpenAPIConfig.WITH_CREDENTIALS;
                OpenAPI.CREDENTIALS = CustomOpenAPIConfig.CREDENTIALS;

                // This is the key fix: token is read on every request
                OpenAPI.TOKEN = async () => {
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
                            }
                        >
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

                                <Route
                                    path="/redirectTicket"
                                    element={
                                        <RedirectTokenRoute>
                                            <RedirectTicket />
                                        </RedirectTokenRoute>
                                    }
                                />
                                <Route
                                    path="/redirectApp"
                                    element={
                                        <RedirectTokenRoute>
                                            <RedirectApp />
                                        </RedirectTokenRoute>
                                    }
                                />

                                {/* Protected Routes */}
                                <Route path="/" element={<RootTokenHandler />} />
                                <Route
                                    path="/inbox"
                                    element={
                                        <ProtectedRoute>
                                            <Inbox />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/data"
                                    element={
                                        <ProtectedRoute>
                                            <UserTable />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <ProtectedRoute>
                                            <SettingsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/account"
                                    element={
                                        <ProtectedRoute>
                                            <Account />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/kanban"
                                    element={
                                        <ProtectedRoute>
                                            <KanbanBoard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/chart"
                                    element={
                                        <ProtectedRoute>
                                            <OrgChart />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/billing"
                                    element={
                                        <ProtectedRoute>
                                            <InvoiceForm />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/tickets"
                                    element={
                                        <ProtectedRoute>
                                            <TicketingSystem />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/tickets/:id"
                                    element={
                                        <ProtectedRoute>
                                            <TicketDetailPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <ProfilePage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/event"
                                    element={
                                        <ProtectedRoute>
                                            <FormTemplatesPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/formbuilder/:id"
                                    element={
                                        <ProtectedRoute>
                                            <FormBuilder />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/formbuilder/new"
                                    element={
                                        <ProtectedRoute>
                                            <FormBuilder />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/form-submissions"
                                    element={
                                        <ProtectedRoute>
                                            <FormSubmissionDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/cities"
                                    element={
                                        <ProtectedRoute>
                                            <CitiesPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/sop-list"
                                    element={
                                        <ProtectedRoute>
                                            <SopPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/user"
                                    element={
                                        <ProtectedRoute>
                                            <UserManagementPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/companymanagement"
                                    element={
                                        <ProtectedRoute>
                                            <CompanyManagementPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/calendar"
                                    element={
                                        <ProtectedRoute>
                                            <TaskManagement />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/tasks"
                                    element={
                                        <ProtectedRoute>
                                            <TaskListView />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/tasks/:id"
                                    element={
                                        <ProtectedRoute>
                                            <TaskDetails />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/notes"
                                    element={
                                        <ProtectedRoute>
                                            <NotesPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/documents"
                                    element={
                                        <ProtectedRoute>
                                            <DocumentsPage60 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/contacts"
                                    element={
                                        <ProtectedRoute>
                                            <ContactPage61 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/approvals"
                                    element={
                                        <ProtectedRoute>
                                            <ApprovalsPage62 />
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
                                    path="/ProjectDashboard"
                                    element={
                                        <ProtectedRoute>
                                            <ProjectDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Income"
                                    element={
                                        <ProtectedRoute>
                                            <IncomeManagementPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/IncomeTransaction"
                                    element={
                                        <ProtectedRoute>
                                            <IncomeTransactionPage />
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
                                <Route
                                    path="/ExpenseTransaction"
                                    element={
                                        <ProtectedRoute>
                                            <ExpenseTransactionPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Budget"
                                    element={
                                        <ProtectedRoute>
                                            <BudgetPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/file-system"
                                    element={
                                        <ProtectedRoute>
                                            <FileSystemPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Reports"
                                    element={
                                        <ProtectedRoute>
                                            <ReportsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/watermark-camera"
                                    element={
                                        <ProtectedRoute>
                                            <WatermarkCameraPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/users"
                                    element={
                                        <ProtectedRoute>
                                            <ActiveUsers />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/survey"
                                    element={
                                        <ProtectedRoute>
                                            <SurveyDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/survey/supervisor"
                                    element={
                                        <ProtectedRoute>
                                            <SupervisorBoard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/survey/wizard/:mediaId"
                                    element={
                                        <ProtectedRoute>
                                            <SurveyWizard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/survey/detail/:surveyId"
                                    element={
                                        <ProtectedRoute>
                                            <SurveyDetail />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/teams"
                                    element={
                                        <ProtectedRoute>
                                            <TeamPage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Full-screen preview */}
                                <Route
                                    path="/form-preview/:id"
                                    element={
                                        <ProtectedRoute>
                                            <MediaFormPreviewPage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Migrated Additional Routes */}
                                <Route
                                    path="/Inventory/Adjustments/Create"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper0 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/transaction-history"
                                    element={
                                        <ProtectedRoute>
                                            <TransactionHistory1 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/MoveOrder/Create"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper2 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Inventory/Adjustments"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper3 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/inventory-items"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper4 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/myopenoutbound"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper5 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/myopeninbound"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper6 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/openoutbound"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper7 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/alloutbound"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper8 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/openinbound"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper9 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/WarehouseLocation"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper10 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/allinbound"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper12 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Inventory/Types"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper13 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/MoveOrder"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper14 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Warehouse/Users"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper15 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/InventoryItem"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper20 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/move"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper21 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/form/event"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper22 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Warehouse"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper23 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orderform"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper24 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/barcode"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper29 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/barcode/generator"
                                    element={
                                        <ProtectedRoute>
                                            <BarcodeGeneratorPage59 />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper35 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper38 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Customer"
                                    element={
                                        <ProtectedRoute>
                                            <CustomerPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/customers"
                                    element={
                                        <ProtectedRoute>
                                            <CustomerPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/customers/:id"
                                    element={
                                        <ProtectedRoute>
                                            <CustomerDetailsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/quotes"
                                    element={
                                        <ProtectedRoute>
                                            <QuotesPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/quotes/new"
                                    element={
                                        <ProtectedRoute>
                                            <QuoteDetailsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/quotes/:id"
                                    element={
                                        <ProtectedRoute>
                                            <QuoteDetailsPage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/Order/transaction-history/:barcode"
                                    element={
                                        <ProtectedRoute>
                                            <TransactionHistoryDetails45 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/:id/Pick/:lineId"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper46 />
                                        </ProtectedRoute>
                                    }
                                />
                                {/* <Route path="/form/formSubmission/:id" element={<ProtectedRoute><PageWrapper47 /></ProtectedRoute>} /> */}
                                {/* <Route path="/form/posterbuilder/:id" element={<ProtectedRoute><PageWrapper48 /></ProtectedRoute>} /> */}
                                {/* <Route path="/form/formbuilder/:id" element={<ProtectedRoute><PageWrapper49 /></ProtectedRoute>} /> */}
                                {/* <Route path="/form/preview/:formid" element={<ProtectedRoute><PageWrapper50 /></ProtectedRoute>} /> */}
                                <Route
                                    path="/barcode/product/:id"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper51 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/InventoryItem/:id"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper52 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/form-preview/:id"
                                    element={
                                        <ProtectedRoute>
                                            <MediaFormPreviewPage53 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/formbuilder/:id"
                                    element={
                                        <ProtectedRoute>
                                            <FormBuilder55 />
                                        </ProtectedRoute>
                                    }
                                />
                                {/* <Route path="/form/list/:id" element={<ProtectedRoute><PageWrapper56 /></ProtectedRoute>} /> */}
                                <Route
                                    path="/tickets/:id"
                                    element={
                                        <ProtectedRoute>
                                            <TicketDetailPage57 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Order/:id"
                                    element={
                                        <ProtectedRoute>
                                            <PageWrapper58 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="/form/:idOrName" element={<PublicFormPage />} />
                                <Route
                                    path="/user/:id"
                                    element={
                                        <ProtectedRoute>
                                            <UserDetailPage59 />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/BillingItem"
                                    element={
                                        <ProtectedRoute>
                                            <BillingItem />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/BillingItem/:id"
                                    element={
                                        <ProtectedRoute>
                                            <BillingItemDetailPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Invoice"
                                    element={
                                        <ProtectedRoute>
                                            <InvoicesPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/Invoice/:id"
                                    element={
                                        <ProtectedRoute>
                                            <InvoiceDetailPage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/agent"
                                    element={
                                        <ProtectedRoute>
                                            <AgentPage />
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
import SettingsPage from "@/pages/settings/index";

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
