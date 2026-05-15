import type { UserProfile } from "@/lib/backend";
import type { Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { create } from "zustand";

type LoginStatus = "idle" | "logging-in" | "logged-in";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStatus: LoginStatus;
  identity: Identity | null;
  setUser: (user: UserProfile | null) => void;
  setIsAuthenticated: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  loginStatus: "idle",
  identity: null,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  login: async () => {
    set({ loginStatus: "logging-in" });
    try {
      const client = await AuthClient.create();
      await new Promise<void>((resolve, reject) => {
        client.login({
          identityProvider:
            process.env.DFX_NETWORK === "ic"
              ? "https://identity.ic0.app"
              : "http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai",
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        });
      });
      const identity = client.getIdentity();
      set({ identity, loginStatus: "logged-in" });
    } catch {
      set({ loginStatus: "idle" });
    }
  },
  logout: async () => {
    const client = await AuthClient.create();
    await client.logout();
    set({
      user: null,
      isAuthenticated: false,
      loginStatus: "idle",
      identity: null,
    });
    window.location.href = "/login";
  },
}));
