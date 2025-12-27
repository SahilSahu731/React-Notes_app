import api from "./axios";
import { Folder } from "./folderService";

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  color: string;
  folder: string | Folder | null;
  updatedAt: string;
  createdAt: string;
}

export interface GetNotesParams {
  isTrashed?: boolean;
  isArchived?: boolean;
  search?: string;
  folder?: string | null;
}

export const getNotes = async (params: GetNotesParams = {}) => {
  const searchParams = new URLSearchParams();
  
  if (params.isTrashed !== undefined) searchParams.append("isTrashed", String(params.isTrashed));
  if (params.isArchived !== undefined) searchParams.append("isArchived", String(params.isArchived));
  if (params.search) searchParams.append("search", params.search);
  if (params.folder) searchParams.append("folder", params.folder);

  const response = await api.get(`/notes?${searchParams.toString()}`);
  return response.data;
};

export const createNote = async (noteData: Partial<Note>) => {
  const response = await api.post("/notes", noteData);
  return response.data;
};

export const updateNote = async (id: string, noteData: Partial<Note>) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id: string, permanent: boolean = false) => {
  const response = await api.delete(`/notes/${id}?permanent=${permanent}`);
  return response.data;
};

export const restoreNote = async (id: string) => {
  const response = await api.put(`/notes/${id}/restore`);
  return response.data;
};
