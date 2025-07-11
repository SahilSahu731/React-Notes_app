import React from 'react'

const Note = () => {
  return (
    <div className='bg-slate-600 min-h-28 cursor-pointer hover:bg-gray-500 hover:scale-105 group transition-all  p-4 rounded-lg shadow-md hover:shadow-lg duration-1000'>
        <h2 className='text-xl font-bold mb-2'>Note heading</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint illum omnis tenetur itaque cupiditate numquam cum similique ipsa velit officia. Lorem ipsum dolor sit amet consectetur adipisicing elit. At accusantium asperiores explicabo ex, provident doloribus cum porro alias voluptatum excepturi, aperiam veniam nam, dolor consequuntur reiciendis molestiae minus maiores dicta?</p>
        <div className='group-hover:flex justify-end mt-4 hidden'>
          <button className='bg-blue-500 text-white px-8  py-2 rounded-lg mr-3 shadow-md hover:bg-blue-600 hover:px-16 transition-all duration-500'>Edit</button>
          <button className='bg-red-500 text-white px-8  py-2 rounded-lg shadow-md hover:bg-red-600 hover:px-16 transition-all duration-500'>Delete</button>
        </div>
    </div>
  )
}

export default Note
