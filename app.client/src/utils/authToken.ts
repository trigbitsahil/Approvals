import Cookies from "js-cookie";
import { encryptToken, decryptToken } from "@/utils/encryption";

export function storeTokens(accessToken: string, refreshToken: string) {
  const isSecure = window.location.protocol === "https:";
  Cookies.set("accessToken", encryptToken(accessToken), {
    expires: 365,
    secure: isSecure,
    sameSite: "lax",
  });

  Cookies.set("refreshToken", encryptToken(refreshToken), {
    expires: 365,
    secure: isSecure,
    sameSite: "lax",
  });
}

export function getAccessToken(): string | null {
  const token = Cookies.get("accessToken");
  if (!token) return null;
  return decryptToken(token);
}

export function getRefreshToken(): string | null {
  const token = Cookies.get("refreshToken");
  if (!token) return null;
  return decryptToken(token);
}

export function clearTokens() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}
