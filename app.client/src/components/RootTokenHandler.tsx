"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FallbackRoot from "../ResetFallback";
import SignInForm from "@/modules/auth/signIn";

export default function RootTokenHandler() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, authReady } = useAuth();
    const token = searchParams?.get("token");
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (token) {
            console.log("[RootTokenHandler] Token detected at root, redirecting to /signin?token=...");
            setIsRedirecting(true);
            // User arrived at Root with a token -> send to signin to handle it
            navigate(`/signin?token=${token}`, { replace: true });
        }
    }, [token, navigate]);

    const isVerifying = !!token;

    // Show loading state while:
    // 1. Auth is not ready yet
    // 2. Verifying token
    // 3. Redirecting to signin with token
    if (!authReady || isVerifying || isRedirecting) {
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
                        {isVerifying ? "Validating token..." : "Initializing session..."}
                    </p>
                </div>
            </div>
        );
    }

    // If authenticated, show the fallback root (Welcome page or reset password)
    if (isAuthenticated) {
        return <FallbackRoot />;
    }

    // If not authenticated, show signin form directly instead of redirecting
    return <SignInForm />;
}
