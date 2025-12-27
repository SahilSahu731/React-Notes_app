
import { create } from "zustand";
import { getNotes, createNote, updateNote, deleteNote, restoreNote, Note } from "./noteService";

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  filter: 'active' | 'archived' | 'trash';
  fetchNotes: (search?: string) => Promise<void>;
  addNote: (note: Partial<Note>) => Promise<void>;
  editNote: (id: string, note: Partial<Note>) => Promise<void>;
  removeNote: (id: string, permanent?: boolean) => Promise<void>;
  restoreNoteFromTrash: (id: string) => Promise<void>;
  setFilter: (filter: 'active' | 'archived' | 'trash') => void;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  filter: 'active',
  
  fetchNotes: async (search?: string) => {
    set({ isLoading: true });
    try {
      const { filter } = get();
      let isTrashed = false;
      let isArchived = false; // Default to undefined (server handles logic) or explicit false
      
      if (filter === 'trash') isTrashed = true;
      if (filter === 'archived') isArchived = true;

      // Note: server logic: 
      // if isTrashed=true -> returns trash.
      // if isArchived=true -> returns archived.
      // default: active notes.
      
      const res = await getNotes(filter === 'trash' ? true : undefined, filter === 'archived' ? true : undefined, search);
      set({ notes: res.notes, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  addNote: async (note) => {
    try {
      const res = await createNote(note);
      // Only add to state if we are in 'active' view
      if (get().filter === 'active') {
          set((state) => ({ notes: [res.note, ...state.notes] }));
      }
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
       // Validation to remove from current view if status changed (e.g. archived)
       const { filter } = get();
       const note = res.note;
       if (filter === 'active' && (note.isArchived || note.isTrashed)) {
           set((state) => ({ notes: state.notes.filter(n => n._id !== id) }));
       }
       if (filter === 'archived' && (!note.isArchived || note.isTrashed)) {
            set((state) => ({ notes: state.notes.filter(n => n._id !== id) }));
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
    } catch (error) {
        console.error(error);
    }
  },

  setFilter: (filter) => {
      set({ filter });
      get().fetchNotes();
  }
}));
