const AUTH_TOKEN_KEY = "auth-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setAuthCookie(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === AUTH_TOKEN_KEY) {
      return value || null;
    }
  }
  return null;
}

export function removeAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
}

export { AUTH_TOKEN_KEY };
