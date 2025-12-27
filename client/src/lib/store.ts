import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  role: string;
  plan: string;
  noteCount: number;
  totalStorageUsed: number;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  password?: string;
  followers: string[];
  following: string[];
  ai: {
    model: string;
    tone: string;
    useHistory: boolean;
  };
  preferences: {
    theme: string;
    language: string;
    shortcuts: {
      save: string;
      newNote: string;
      search: string;
    };
  };
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      hasHydrated: false,
      setAuth: (user, token) => set({ user, accessToken: token, isLoading: false }),
      setUser: (user) => set({ user }),
      setProfilePicture: (profilePicture: string) => set({ user: { ...get().user!, avatar: profilePicture } }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, accessToken: null, isLoading: false }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
