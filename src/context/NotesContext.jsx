import { createContext, useState } from 'react';

// 1️⃣ Create Context

export const NotesContext = createContext();

// 2️⃣ Provider Component
export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  // Add note with heading and data, matching CreateNote component
  const addNote = (title, content) => {
    const newNote = {
      id: Date.now(),
      heading: title,
      data: content
    };  
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };
  

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};
