import React, { useContext, useEffect, useState } from 'react'
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

  useEffect(() => {
    // This effect can be used to log notes or perform side effects when notes change
    console.log('Notes updated:', notes);
  }, [notes]);

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
    <div className='m-2 border-2 w-1/3 hidden xl:flex border-gray-500 p-8 rounded-lg shadow-lg'>
      {/* will make it later */}
    </div>
    </div>
  )
}

export default CreateNote
