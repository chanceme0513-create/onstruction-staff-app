export type AuthUser = {
  id: string;
  name: string;
  role: string;
  isManager: boolean;
  avatar: string;
};

const AUTH_KEY = "stapo_auth_user";

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_KEY);
}
