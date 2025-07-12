import React, { useContext, useEffect, useState } from 'react'
import { NotesContext } from '../context/NotesContext';

const Note = ({ heading, content, id }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editHeading, setEditHeading] = useState(heading);
  const [editContent, setEditContent] = useState(content);
  const { deleteNote, notes, setNotes } = useContext(NotesContext);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  return (
    <>
      <div className={`bg-slate-600 min-h-28 cursor-pointer hover:bg-gray-500 hover:scale-105 group transition-all p-4 rounded-lg shadow-md hover:shadow-lg duration-1000 ${showModal ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        <h2 className='text-xl font-bold mb-2'>{heading}</h2>
        {/* show time when note was created */}
        <p className='text-gray-300 break-words line-clamp-2 '>{content}</p>
        <div className='flex justify-end mt-2'>
          <button onClick={() => setShowModal(true)} className='text-blue-300 underline text-sm hover:text-blue-500'>View More</button>
        </div>
      </div>

      {/* Modal for full note */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
          <div className='bg-white rounded-lg p-8 max-w-lg w-full shadow-lg relative'>
            <button onClick={() => setShowModal(false)} className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl'>&times;</button>
            {isEditing ? (
              <>
                <input
                  className='w-full mb-4 p-2 border border-gray-300 rounded text-black text-xl font-bold'
                  value={editHeading}
                  onChange={e => setEditHeading(e.target.value)}
                  placeholder='Title'
                />
                <textarea
                  className='w-full mb-4 p-2 border border-gray-300 rounded text-black text-base'
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={8}
                  placeholder='Write your note here...'
                />
              </>
            ) : (
              <>
                <h2 className='text-2xl font-bold mb-4 text-black'>{heading}</h2>
                <p className='text-gray-700 break-words whitespace-pre-line'>{content}</p>
              </>
            )}
            <div className='flex justify-end mt-6'>
              {isEditing ? (
                <>
                  <button
                    className='bg-green-500 text-white px-8 py-2 rounded-lg mr-3 shadow-md hover:bg-green-600 hover:px-16 transition-all duration-500'
                    onClick={() => {
                      setNotes(notes.map(note => note.id === id ? { ...note, heading: editHeading, data: editContent } : note));
                      setIsEditing(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className='bg-gray-400 text-white px-8 py-2 rounded-lg shadow-md hover:bg-gray-600 hover:px-16 transition-all duration-500'
                    onClick={() => {
                      setIsEditing(false);
                      setEditHeading(heading);
                      setEditContent(content);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className='bg-blue-500 text-white px-8 py-2 rounded-lg mr-3 shadow-md hover:bg-blue-600 hover:px-16 transition-all duration-500'
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                  <button
                    className='bg-red-500 text-white px-8 py-2 rounded-lg shadow-md hover:bg-red-600 hover:px-16 transition-all duration-500'
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this note?')) {
                        deleteNote(id);
                        setShowModal(false);
                      }
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Note
