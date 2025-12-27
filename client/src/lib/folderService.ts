import api from "./axios";

export interface Folder {
  _id: string;
  name: string;
  color: string;
  icon: string;
  owner: string;
  parent: string | null;
  order: number;
  noteCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderData {
  name: string;
  color?: string;
  icon?: string;
  parent?: string | null;
}

export interface UpdateFolderData {
  name?: string;
  color?: string;
  icon?: string;
  parent?: string | null;
  order?: number;
}

// Get all folders
export const getFolders = async (): Promise<{ success: boolean; folders: Folder[] }> => {
  const response = await api.get("/folders");
  return response.data;
};

// Get single folder
export const getFolder = async (id: string): Promise<{ success: boolean; folder: Folder }> => {
  const response = await api.get(`/folders/${id}`);
  return response.data;
};

// Create folder
export const createFolder = async (data: CreateFolderData): Promise<{ success: boolean; folder: Folder }> => {
  const response = await api.post("/folders", data);
  return response.data;
};

// Update folder
export const updateFolder = async (id: string, data: UpdateFolderData): Promise<{ success: boolean; folder: Folder }> => {
  const response = await api.put(`/folders/${id}`, data);
  return response.data;
};

// Delete folder
export const deleteFolder = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/folders/${id}`);
  return response.data;
};

// Reorder folders
export const reorderFolders = async (folderOrders: { id: string; order: number }[]): Promise<{ success: boolean; folders: Folder[] }> => {
  const response = await api.put("/folders/reorder", { folderOrders });
  return response.data;
};
