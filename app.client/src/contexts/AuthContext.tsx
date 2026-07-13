import { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken, clearTokens } from "@/utils/authToken";

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
      const token = getAccessToken();
      setIsAuthenticated(!!token);
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

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
  };

  const clearAuthState = () => {
    clearTokens();
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
