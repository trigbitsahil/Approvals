// src/FallbackRoot.tsx
"use client";
import { useSearchParams } from "react-router-dom";
import ResetPasswordPage from "@/modules/auth/resetPassword/index";

const Home = () => {
  return (
    <>
      {/* Full-screen flexbox container to center the text both vertically & horizontally */}
      <div className="flex items-center justify-center min-h-screen ">
        {/* Large centered welcome text */}
        <h1 className="text-5xl font-bold  text-center">
          Welcome
        </h1>
      </div>
    </>
  );
};

export default function FallbackRoot() {
  const [params] = useSearchParams();
  const hasToken = params?.get("token");
  const hasEmail = params?.get("email");

  return hasToken && hasEmail ? <ResetPasswordPage /> : <Home />;
}
