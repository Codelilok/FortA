import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthState {
  isAdmin: boolean;
  isLoading: boolean;
  username: string | null;
  refetch: () => void;
}

const AuthContext = createContext<AuthState>({
  isAdmin: false,
  isLoading: true,
  username: null,
  refetch: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const check = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setIsAdmin(data.admin === true);
      setUsername(data.username ?? null);
    } catch {
      setIsAdmin(false);
      setUsername(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { check(); }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, username, refetch: check }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AuthContext);
}

export async function adminLogin(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || "Login failed" };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}
