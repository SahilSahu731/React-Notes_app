
import api from "./axios";

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  color: string;
  updatedAt: string;
  createdAt: string;
}

export const getNotes = async (isTrashed?: boolean, isArchived?: boolean, search?: string) => {
  const params = new URLSearchParams();
  if (isTrashed !== undefined) params.append("isTrashed", String(isTrashed));
  if (isArchived !== undefined) params.append("isArchived", String(isArchived));
  if (search) params.append("search", search);

  const response = await api.get(`/notes?${params.toString()}`);
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
