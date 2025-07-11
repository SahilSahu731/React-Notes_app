import React from 'react'
import Note from './Note'

const NoteList = () => {
  return (
    <div className='m-2 border-2 border-gray-500 p-4 rounded-lg shadow-lg'>
      <h1 className='text-3xl ml-5 font-bold mb-4'>All Notes</h1>
      
      <div className="notes-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Note />
      <Note />
      <Note />
      <Note />
      <Note />
      <Note />
    </div>
    </div>
  )
}

export default NoteList
