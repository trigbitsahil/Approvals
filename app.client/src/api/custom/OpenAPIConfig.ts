import Cookies from "js-cookie";
import { decryptToken } from "@/utils/encryption";
import { storeTokens } from "@/utils/authToken";

/* --------------------------------------------------------------------- */
/* Configuration constants — adjust BASE / VERSION if needed             */
/* --------------------------------------------------------------------- */
const BASE = "http://localhost:5298";
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
  WITH_CREDENTIALS: true,
  CREDENTIALS: "include",
  /* Token is handled by the browser automatically (HttpOnly Cookie) */
  TOKEN: undefined,
};
