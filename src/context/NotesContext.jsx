import { createContext, useEffect, useState } from 'react';

// 1️⃣ Create Context

// eslint-disable-next-line react-refresh/only-export-components
export const NotesContext = createContext();

// 2️⃣ Provider Component
export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    // Load notes from localStorage if available
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  // Add note with heading and data, matching CreateNote component
  function addNote(title, content) {
        const newNote = {
            id: Date.now(),
            heading: title,
            data: content
        };
        setNotes((prevNotes) => [...prevNotes, newNote]);
    }

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
    // No need to update localStorage here; useEffect will handle it after state updates
  };
  
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
};
