import { create } from "zustand";
import { 
  getFolders, 
  createFolder, 
  updateFolder, 
  deleteFolder, 
  reorderFolders,
  Folder, 
  CreateFolderData, 
  UpdateFolderData 
} from "./folderService";
import toast from "react-hot-toast";

interface FolderState {
  folders: Folder[];
  isLoading: boolean;
  selectedFolderId: string | null;
  fetchFolders: () => Promise<void>;
  addFolder: (data: CreateFolderData) => Promise<Folder | null>;
  editFolder: (id: string, data: UpdateFolderData) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  setSelectedFolder: (id: string | null) => void;
  reorderFolders: (orders: { id: string; order: number }[]) => Promise<void>;
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  isLoading: false,
  selectedFolderId: null,

  fetchFolders: async () => {
    set({ isLoading: true });
    try {
      const res = await getFolders();
      set({ folders: res.folders, isLoading: false });
    } catch (error: any) {
      console.error("[FolderStore] Fetch error:", error);
      set({ isLoading: false });
    }
  },

  addFolder: async (data) => {
    try {
      const res = await createFolder(data);
      set((state) => ({ folders: [...state.folders, res.folder] }));
      toast.success("Folder created");
      return res.folder;
    } catch (error: any) {
      console.error("[FolderStore] Create error:", error);
      toast.error(error.response?.data?.message || "Failed to create folder");
      return null;
    }
  },

  editFolder: async (id, data) => {
    try {
      const res = await updateFolder(id, data);
      set((state) => ({
        folders: state.folders.map((f) => (f._id === id ? res.folder : f)),
      }));
      toast.success("Folder updated");
    } catch (error: any) {
      console.error("[FolderStore] Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update folder");
    }
  },

  removeFolder: async (id) => {
    try {
      await deleteFolder(id);
      set((state) => ({
        folders: state.folders.filter((f) => f._id !== id),
        selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
      }));
      toast.success("Folder deleted");
    } catch (error: any) {
      console.error("[FolderStore] Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete folder");
    }
  },

  setSelectedFolder: (id) => {
    set({ selectedFolderId: id });
  },

  reorderFolders: async (orders) => {
    try {
      const res = await reorderFolders(orders);
      set({ folders: res.folders });
    } catch (error: any) {
      console.error("[FolderStore] Reorder error:", error);
    }
  },
}));
