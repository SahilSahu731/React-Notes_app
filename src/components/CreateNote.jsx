import React from 'react'

const CreateNote = () => {
  return (
    <div className='flex'>
    <div className='m-2 border-2 w-2/3 border-gray-500 p-8 rounded-lg shadow-lg'>
      <h1 className='text-3xl ml-5 font-bold mb-4'>Create Note</h1>
      <textarea name="" id="" className='w-full min-h-64  ml-4 p-2 border border-gray-300 bg-gray-200 text-black text-xl pl-4 rounded-lg' placeholder='Write your note here...'></textarea>
      <div className='flex justify-end mt-4'>
        <button className='bg-blue-500 text-white px-8 py-2 rounded shadow-md hover:bg-blue-600 hover:px-16 transition-all duration-500'>Save</button>
      </div>

    </div>
    <div className='m-2 border-2 w-1/3 border-gray-500 p-8 rounded-lg shadow-lg'>
      {/* will make it later */}
    </div>
    </div>
  )
}

export default CreateNote
