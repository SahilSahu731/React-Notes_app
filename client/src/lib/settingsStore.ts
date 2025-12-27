import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Future settings
  notifications: boolean;
  toggleNotifications: () => void;
  
  autoSave: boolean;
  toggleAutoSave: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      notifications: true,
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      
      autoSave: true,
      toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
    }),
    {
      name: "settings-storage",
    }
  )
);
