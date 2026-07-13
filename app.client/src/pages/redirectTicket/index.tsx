"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RedirectTicket() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // We can use a small loading state to prevent flash of content/redirection
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, authReady } = useAuth();

    useEffect(() => {
        if (!authReady) {
            console.log("[RedirectTicket] Waiting for authReady...");
            return;
        }

        const token = searchParams?.get("token");
        console.log("[RedirectTicket] authReady:", authReady, "isAuthenticated:", isAuthenticated, "tokenPresent:", !!token);

        //// Case 1: User is already authenticated
        //if (isAuthenticated) {
        //    console.log("[RedirectTicket] User authenticated, navigating to /tickets");
        //    navigate("/tickets", { replace: true });
        //    return;
        //}

        // Case 2: User is not authenticated, but Token is present in URL
        if (token) {
            console.log("[RedirectTicket] Token detected, redirecting to /signin?token=...");
            navigate(`/signin?token=${encodeURIComponent(token)}`, { replace: true });
            return;
        }

        // Case 3: Not authenticated, no token
        console.log("[RedirectTicket] No token, user NOT authenticated, navigating to /signin");
        navigate("/signin", { replace: true });

        setLoading(false);

    }, [searchParams, navigate, isAuthenticated, authReady]);

    // Show loading spinner while determining redirect
    if (loading || !authReady) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg font-medium text-foreground">Redirecting...</p>
                </div>
            </div>
        );
    }

    return null;
}
