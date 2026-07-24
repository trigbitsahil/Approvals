export function storeTokens(accessToken: string, refreshToken: string) {
  // Tokens are handled automatically by browser via HttpOnly cookie via Vercel Proxy
  localStorage.setItem("isLoggedIn", "true");
}

export function getAccessToken(): string | null {
  return null;
}

export function getRefreshToken(): string | null {
  return null;
}

export function clearTokens() {
  localStorage.removeItem("isLoggedIn");
}


