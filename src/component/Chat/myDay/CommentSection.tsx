

const CommentSection = () => {
  return (
    <>
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto p-4 space-y-4">
      {/* Existing Comment */}
      <div className="flex items-start space-x-3 bg-gray-100 p-4 rounded-lg">
        <img 
          src="https://i.pravatar.cc/40?img=1" 
          alt="John Doe's avatar" 
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-800">John Doe</p>
          <p className="mt-1 text-gray-600">
            This is a great article! I really enjoyed reading it and learned a lot. 
            Looking forward to more content like this in the future.
          </p>
        </div>
      </div>

      {/* Comment Box */}
      <div className="mt-6">
        <div className="flex items-center space-x-3">
          <img 
            src="https://i.pravatar.cc/40?img=2" 
            alt="Your avatar" 
            className="w-10 h-10 rounded-full"
          />
          <input 
            type="text"
            placeholder="Write a comment..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default CommentSection