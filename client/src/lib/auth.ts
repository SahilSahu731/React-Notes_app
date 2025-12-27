import api from "./axios";
import { useAuthStore } from "./store";

export type LoginData = {
  email: string;
  password: string;
};

export type SignUpData = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post("/auth/login", data);
    
    // Update Zustand store with user data
    if (response.data.success) {
      useAuthStore.getState().setAuth(
        response.data.user,
        response.data.accessToken
      );
    }
    
    return response.data;
  },

  register: async (data: SignUpData) => {
    const response = await api.post("/auth/register", data);
    
    // Update Zustand store with user data
    if (response.data.success) {
      useAuthStore.getState().setAuth(
        response.data.user,
        response.data.accessToken
      );
    }
    
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("[Auth] Logout error:", error);
    }
    
    // Always clear local state
    useAuthStore.getState().logout();
    
    return { success: true };
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  changeProfilePicture: async (data: FormData) => {
    const response = await api.post("/user/profile/change", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};