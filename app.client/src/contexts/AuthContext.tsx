import { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken, clearTokens } from "@/utils/authToken";
import { OpenAPI } from "@/api/core/OpenAPI";
import { unregisterFirebaseToken } from "@/utils/firebase";

interface AuthContextType {
  isAuthenticated: boolean;
  authReady: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  clearAuthState: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authReady: false,
  login: () => {},
  logout: () => {},
  clearAuthState: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(isLoggedIn);
      setAuthReady(true);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  const login = () => {
    // token is already stored before this is called
    setIsAuthenticated(true);
    setAuthReady(true);
  };

  const logout = async () => {
    try {
      const baseUrl = OpenAPI.BASE || "";
      await fetch(`${baseUrl}/Logout`, {
        method: "POST",
        credentials: "include"
      });
      // Delete Firebase token to stop receiving notifications for this user
      await unregisterFirebaseToken();
    } catch (e) {
      console.error("Logout request failed", e);
    }
    clearTokens();
    sessionStorage.removeItem('view_password');
    setIsAuthenticated(false);
  };

  const clearAuthState = () => {
    clearTokens();
    sessionStorage.removeItem('view_password');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authReady, login, logout, clearAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
