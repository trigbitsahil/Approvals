"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RedirectTicket() {
     return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                   
                    <p className="text-lg font-medium text-foreground">ABC123</p>
                </div>
            </div>
        );
}
