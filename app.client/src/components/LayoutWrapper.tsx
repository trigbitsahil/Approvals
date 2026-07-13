"use client";

import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/Sidebar";
import { NavigationMenuBar } from "@/components/NavigationMenu";
// import { PushManager } from "@/components/PushManager"; // Commented out in original App.tsx

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <div className="flex w-full">
                <AppSidebar />
                <main className="flex-1 min-h-screen overflow-x-hidden">
                    <NavigationMenuBar />
                    <SidebarTrigger />
                    {/* <PushManager /> */}
                    <div className="p-4">{children}</div>
                </main>
            </div>
        </SidebarProvider>
    );
};

const FullScreenLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
};

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = useLocation().pathname;
    const { isAuthenticated } = useAuth();

    const fullScreenRoutes = ["/form-preview"];
    const bypassAuthRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password"];

    // These routes always get full MainLayout (sidebar + header) even when NOT logged in
    const forceMainLayoutRoutes = ["/redirectApp", "/redirectTicket"];
    const shouldForceMainLayout = forceMainLayoutRoutes.some((route) =>
        pathname?.startsWith(route)
    );

    const isFullScreen = fullScreenRoutes.some((route) =>
        pathname?.startsWith(route)
    );

    const shouldBypassAuth = bypassAuthRoutes.some((route) =>
        pathname?.startsWith(route)
    );

    if (shouldForceMainLayout) {
        return <MainLayout>{children}</MainLayout>;
    }

    // Bypass everything for auth pages — let the component handle logic
    if (shouldBypassAuth) {
        return <FullScreenLayout>{children}</FullScreenLayout>;
    }

    if (!isAuthenticated) {
        return <FullScreenLayout>{children}</FullScreenLayout>;
    }

    if (isFullScreen) {
        return <FullScreenLayout>{children}</FullScreenLayout>;
    }

    return <MainLayout>{children}</MainLayout>;
}
