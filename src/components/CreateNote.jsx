import React, { useContext, useState } from 'react'
import { NotesContext } from '../context/NotesContext';

const CreateNote = () => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { notes, addNote } = useContext(NotesContext);

  const handleCreateNote = (e) => {
    e.preventDefault();
    addNote(title, content);
    setTitle('');
    setContent('');
  };


  return (
    <div className='flex'>
    <div className='m-2 border-2 xl:w-2/3 w-full border-gray-500 p-8 rounded-lg shadow-lg'>
      <h1 className='text-3xl ml-5 font-bold mb-4'>Create Note</h1>
      <input 
      type="text" 
      value={title} 
      onChange={(e) => setTitle(e.target.value)}
      className='w-full p-2 ml-4 border border-gray-300 bg-gray-200 text-black text-xl pl-4 rounded-lg' 
      placeholder='Title of your note' 
      />
      <br />
      <br />
      <textarea 
      name="" 
      id="" 
      cols="30" 
      value={content} 
      onChange={(e) => setContent(e.target.value)}
      rows="10"
      className='w-full min-h-64  ml-4 p-2 border border-gray-300 bg-gray-200 text-black text-xl pl-4 rounded-lg' 
      placeholder='Write your note here...'></textarea>
      <div className='flex justify-end mt-4'>
        <button
        disabled={!title && !content}
         onClick={handleCreateNote} 
         className='bg-blue-500 text-white px-8 py-2 rounded cursor-pointer shadow-md hover:bg-blue-600 hover:px-16 transition-all duration-500'>
          Save
          </button>
      </div>

    </div>
    <div className='m-2 border-2 w-1/3 hidden xl:flex border-gray-500 p-8 rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-blue-200'>
      <div className='w-full'>
        <h2 className='text-2xl font-bold text-blue-700 mb-6 text-center'>Note Statistics <span className='text-sm text-gray-500'>(including deleted notes)</span></h2>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between bg-white rounded-lg shadow p-4'>
            <span className='text-lg text-gray-600 font-medium'>Total Notes</span>
            <span className='text-2xl font-bold text-blue-600'>{notes.length}</span>
          </div>
          <div className='flex items-center justify-between bg-white rounded-lg shadow p-4'>
            <span className='text-lg text-gray-600 font-medium'>Total Characters</span>
            <span className='text-2xl font-bold text-blue-600'>{notes.reduce((acc, note) => acc + (note.data?.length || 0), 0)}</span>
          </div>
          <div className='flex items-center justify-between bg-white rounded-lg shadow p-4'>
            <span className='text-lg text-gray-600 font-medium'>Last Updated</span>
            <span className='text-md font-semibold text-blue-500'>
              {notes.length > 0 ? new Date(Math.max(...notes.map(n => n.id))).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default CreateNote
