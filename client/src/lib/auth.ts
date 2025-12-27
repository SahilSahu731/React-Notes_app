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
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string; avatar?: string }) => {
    const response = await api.put("/user/profile", data);
    
    // Update local store if successful
    if (response.data.success) {
      const { user } = response.data;
      useAuthStore.getState().setUser(user);
    }
    
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.put("/user/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      useAuthStore.getState().setProfilePicture(response.data.profilePicture);
    }

    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put("/user/profile/password", data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete("/user/profile");
    if (response.data.success) {
      useAuthStore.getState().logout();
    }
    return response.data;
  },
};