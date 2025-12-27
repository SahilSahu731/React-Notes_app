import { create } from "zustand";
import { getNotes, createNote, updateNote, deleteNote, restoreNote, Note } from "./noteService";
import { useFolderStore } from "./folderStore";

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  filter: 'active' | 'archived' | 'trash';
  selectedFolderId: string | null;
  fetchNotes: (search?: string) => Promise<void>;
  addNote: (note: Partial<Note>) => Promise<void>;
  editNote: (id: string, note: Partial<Note>) => Promise<void>;
  removeNote: (id: string, permanent?: boolean) => Promise<void>;
  restoreNoteFromTrash: (id: string) => Promise<void>;
  setFilter: (filter: 'active' | 'archived' | 'trash') => void;
  setSelectedFolder: (folderId: string | null) => void;
}

// Helper to refresh folder counts
const refreshFolderCounts = () => {
  useFolderStore.getState().fetchFolders();
};

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  filter: 'active',
  selectedFolderId: null,
  
  fetchNotes: async (search?: string) => {
    set({ isLoading: true });
    try {
      const { filter, selectedFolderId } = get();
      
      const params: any = {};
      
      if (filter === 'trash') params.isTrashed = true;
      if (filter === 'archived') params.isArchived = true;
      if (search) params.search = search;
      if (selectedFolderId) params.folder = selectedFolderId;
      
      const res = await getNotes(params);
      set({ notes: res.notes, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  addNote: async (note) => {
    try {
      const { selectedFolderId, filter } = get();
      
      // Include folder when creating, but allow override if provided in note data
      const noteData = {
        folder: selectedFolderId || undefined,
        ...note,
      };
      
      const res = await createNote(noteData);
      
      // Only add to state if we are in 'active' view
      if (filter === 'active') {
        set((state) => ({ notes: [res.note, ...state.notes] }));
      }
      
      // Refresh folder counts
      refreshFolderCounts();
    } catch (error) {
      console.error(error);
    }
  },

  editNote: async (id, updatedData) => {
    try {
      const res = await updateNote(id, updatedData);
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? res.note : n)),
      }));
      
      // Remove from current view if status changed
      const { filter, selectedFolderId } = get();
      const note = res.note;
      
      if (filter === 'active' && (note.isArchived || note.isTrashed)) {
        set((state) => ({ notes: state.notes.filter(n => n._id !== id) }));
      }
      if (filter === 'archived' && (!note.isArchived || note.isTrashed)) {
        set((state) => ({ notes: state.notes.filter(n => n._id !== id) }));
      }
      
      // If folder changed and we're filtering by folder, remove from view
      const noteFolderId = typeof note.folder === 'object' ? note.folder?._id : note.folder;
      if (selectedFolderId && noteFolderId !== selectedFolderId) {
        set((state) => ({ notes: state.notes.filter(n => n._id !== id) }));
      }
      
      // Refresh folder counts if folder changed
      if (updatedData.folder !== undefined) {
        refreshFolderCounts();
      }
    } catch (error) {
      console.error(error);
    }
  },

  removeNote: async (id, permanent = false) => {
    try {
      await deleteNote(id, permanent);
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== id),
      }));
      
      // Refresh folder counts
      refreshFolderCounts();
    } catch (error) {
      console.error(error);
    }
  },

  restoreNoteFromTrash: async (id) => {
    try {
      await restoreNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== id),
      }));
      
      // Refresh folder counts
      refreshFolderCounts();
    } catch (error) {
      console.error(error);
    }
  },

  setFilter: (filter) => {
    set({ filter, selectedFolderId: null });
    get().fetchNotes();
  },

  setSelectedFolder: (folderId) => {
    set({ selectedFolderId: folderId, filter: 'active' });
    get().fetchNotes();
  },
}));
