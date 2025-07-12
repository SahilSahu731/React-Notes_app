import React from 'react'

const Note = ({heading, content}) => {

  // Placeholder for note content
  // This will be replaced with actual props or state in the future

  return (
    <div className='bg-slate-600 min-h-28 cursor-pointer hover:bg-gray-500 hover:scale-105 group transition-all  p-4 rounded-lg shadow-md hover:shadow-lg duration-1000'>
        <h2 className='text-xl font-bold mb-2'>{heading}</h2>
        {/* show time when note was created */}
        <p className='text-gray-400 text-xs mb-2'>Created at: {new Date().toLocaleString()}</p>
        <p>{content}</p>
        <div className='group-hover:flex justify-end mt-4 hidden'>
          <button className='bg-blue-500 text-white px-8  py-2 rounded-lg mr-3 shadow-md hover:bg-blue-600 hover:px-16 transition-all duration-500'>Edit</button>
          <button className='bg-red-500 text-white px-8  py-2 rounded-lg shadow-md hover:bg-red-600 hover:px-16 transition-all duration-500'>Delete</button>
        </div>
    </div>
  )
}

export default Note
