import React from 'react'

const Showimage = ({setshowimage,imageurl}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <div className="relative">
        <img
          src={imageurl}
          alt="Image Preview"
          className="h-2/3 w-96 rounded-lg shadow-md"
        />
        <button
          onClick={() => setshowimage(false)}
          className="absolute top-0 p-2 text-black bg-white text-xl rounded-full"
        >
          <i className="fa-regular fa-circle-xmark"></i>
        </button>
      </div>
    </div>
  </div>
  )
}

export default Showimage
