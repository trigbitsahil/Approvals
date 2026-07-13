"use client";

import React, { useEffect, useState } from "react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AvatarProvider } from "@/stores/AvatarStore";
import { ThemeProvider } from "@/components/ThemeProvider";
import { setupAxios } from "@/api/setupAxios";
import { OpenAPI } from "@/api/core/OpenAPI";
import { CustomOpenAPIConfig } from "@/api/custom/OpenAPIConfig";
import { getAccessToken } from "@/utils/authToken";
import { Toaster } from "@/components/ui/sonner";
import { messages as enMessages } from "@/locales/en/messages.js";
import { ConfirmationProvider } from "@/contexts/ConfirmationContext";

// Initialize i18n with default locale for SSR/Prerendering
if (!i18n.locale) {
    i18n.load("en", enMessages);
    i18n.activate("en");
}

// Initialize Axios interceptors
setupAxios();

const localeMessages = {
    en: () => import("@/locales/en/messages.js"),
    hi: () => import("@/locales/hi/messages.js"),
    de: () => import("@/locales/de/messages.js"),
} as const;

type SupportedLocales = keyof typeof localeMessages;

function AppProviders({ children }: { children: React.ReactNode }) {
    const [isLocaleReady, setIsLocaleReady] = useState(false);

    useEffect(() => {
        const loadPreferredLocale = async () => {
            const savedLang = (localStorage.getItem("lang") || "en") as SupportedLocales;
            setIsLocaleReady(false);
            try {
                const module = await localeMessages[savedLang]();
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
                OpenAPI.CREDENTIALS = CustomOpenAPIConfig.CREDENTIALS as "include" | "omit" | "same-origin";

                // This is the key fix: token is read on every request
                OpenAPI.TOKEN = async () => {
                    const token = getAccessToken();
                    return token || "";
                };

                setIsLocaleReady(true);
            }
        };

        loadPreferredLocale();
    }, []);

    if (!isLocaleReady) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <AvatarProvider>
            <I18nProvider i18n={i18n}>
                <ThemeProvider>
                    {children}
                    <Toaster richColors position="top-center" />
                </ThemeProvider>
            </I18nProvider>
        </AvatarProvider>
    );
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ConfirmationProvider>
                <AppProviders>{children}</AppProviders>
            </ConfirmationProvider>
        </AuthProvider>
    );
}
