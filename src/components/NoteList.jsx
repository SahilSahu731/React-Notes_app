import React, { useContext } from 'react'
import Note from './Note'
import { NotesContext } from '../context/NotesContext';

const NoteList = () => {

  const { notes } = useContext(NotesContext);

  return (
    <div className='m-2 border-2 border-gray-500 p-4 rounded-lg shadow-lg'>
      <h1 className='text-3xl ml-5 font-bold mb-4'>All Notes</h1>
      
      <div className="notes-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {notes.length > 0 ? (
          notes.reverse().map((note) => (
            <Note key={note.id} id={note.id} heading={note.heading} content={note.data} />
          ))
        ) : (
          <p className='text-gray-500 text-xl '>No notes available</p>
        )}
      </div>
    </div>
  )
}

export default NoteList
