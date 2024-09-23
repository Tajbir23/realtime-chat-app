import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import commentInterface from "../../../redux/typeCheck/comment"


const CommentSection: React.FC<{myDayId: string, userId: string}> = ({myDayId, userId}) => {
  const [message, setMessage] = useState('')
  const [comments, setComments] = useState<commentInterface[]>([])
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/comments/${myDayId}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
    .then((data) => setComments(data))
  },[message, myDayId])

  console.log(comments)

  const handleSubmitComment = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(`${import.meta.env.VITE_API}/api/comment`,{
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        myDayId,
        comment: (e.target as HTMLFormElement).comment.value,
      }),
    })
    if(res.ok){
      toast.success("Comment posted successfully");
      (e.target as HTMLFormElement).comment.value = ""
    }
    const data = await res.json()
    setMessage(data.message)
  }
  return (
    <>
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto p-4 space-y-4">
      {/* Existing Comment */}
      {comments.map((comment) => {
        return (
          <div className="flex items-start space-x-3 bg-gray-100 p-4 rounded-lg">
        <img 
          src={comment.senderId.photoUrl}
          alt="John Doe's avatar" 
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-800">{comment.senderId.name}</p>
          <p className="mt-1 text-gray-600">
            {comment.comment}
          </p>
        </div>
      </div>
        )
      })}

      {/* Comment Box */}
      <div className="mt-6">
        <form onSubmit={handleSubmitComment} className="flex items-center space-x-3">
          <input 
            type="text"
            name="comment"
            required
            placeholder="Write a comment..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default CommentSection