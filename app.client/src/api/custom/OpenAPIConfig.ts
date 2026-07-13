import Cookies from "js-cookie";
import { decryptToken } from "@/utils/encryption";
import { storeTokens } from "@/utils/authToken";

/* --------------------------------------------------------------------- */
/* Configuration constants — adjust BASE / VERSION if needed             */
/* --------------------------------------------------------------------- */
const BASE = "https://localhost:7282";
//const BASE = "https://oohapi-b7eud8e8hzg0c8bp.centralindia-01.azurewebsites.net";
const VERSION = "1";

/* Shared single‑flight promise so we don’t spam the refresh endpoint */
let refreshingPromise: Promise<string> | null = null;

/* --------------------------------------------------------------------- */
/* Helper – decode JWT payload safely                                    */
/* --------------------------------------------------------------------- */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
    return payload.exp * 1000 < Date.now();
  } catch {
    // If malformed, treat as expired
    return true;
  }
}

/* --------------------------------------------------------------------- */
/* The OpenAPI config object                                             */
/* --------------------------------------------------------------------- */
export const CustomOpenAPIConfig = {
  BASE,
  VERSION,
  WITH_CREDENTIALS: false,
  CREDENTIALS: "include",

  /* TOKEN must be an async function that returns a *fresh* access token */
  TOKEN: async (): Promise<string> => {
    const encAccess = Cookies.get("accessToken");
    const encRefresh = Cookies.get("refreshToken");

    /* No cookies → user is not authenticated */
    if (!encAccess || !encRefresh) return "";

    const accessToken = decryptToken(encAccess);
    const refreshToken = decryptToken(encRefresh);

    /* If access token is still valid, just return it */
    if (!isTokenExpired(accessToken)) return accessToken;

    /* ----------------------------------------------------------------- */
    /* Access token expired → need to refresh                            */
    /* Use single‑flight so parallel calls share one refresh request     */
    /* ----------------------------------------------------------------- */
    if (!refreshingPromise) {
      refreshingPromise = (async () => {
        try {
          const res = await fetch(`${BASE}/api/v${VERSION}/identity/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const data: { accessToken: string; refreshToken: string } =
            await res.json();

          /* Store new tokens in cookies (encrypted) */
          storeTokens(data.accessToken, data.refreshToken);

          return data.accessToken;
        } catch (err) {
          /* Hard fail → clear cookies so app forces re‑login */
          console.error("Token refresh failed:", err);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          return "";
        } finally {
          refreshingPromise = null; // reset for next expiry
        }
      })();
    }

    return refreshingPromise;
  },
};
