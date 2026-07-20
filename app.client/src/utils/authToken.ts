export function storeTokens(accessToken: string, refreshToken: string) {
  // We no longer store tokens directly! The backend sets an HttpOnly cookie.
  // We just set a flag so the frontend knows the user is logged in.
  localStorage.setItem("isLoggedIn", "true");
}

export function getAccessToken(): string | null {
  // The token is handled automatically by the browser via HttpOnly cookie.
  return null; 
}

export function getRefreshToken(): string | null {
  return null;
}

export function clearTokens() {
  localStorage.removeItem("isLoggedIn");
}
