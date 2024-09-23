import { FaComment, FaHeart, FaShare } from "react-icons/fa"
import userTypeCheck from "../../../redux/typeCheck/user"
import { useEffect, useState } from "react"
import CommentSection from "./CommentSection"


const MyDayCard: React.FC<{user: userTypeCheck}> = ({user}) => {
  const [totalLike, setTotalLike] = useState(0)
  const [like, setLike] = useState(false)
  const [message, setMessage] = useState()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/total_like_and_comments`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({userId: user._id, myDayId: user.myDayId}),
    }).then((res) => res.json())
    .then((data) => {
      setTotalLike(data.totalLike)
      setLike(data.myLike)
    })


  }, [message, user])

    const handleLike = async() => {
      if(!like){
        setLike(true)
        setTotalLike(totalLike + 1)
      }

      const res = await fetch(`${import.meta.env.VITE_API}/api/like`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({userId: user._id, myDayId: user.myDayId}),
      })

      const data = await res.json()
      if(res.ok){
        setTotalLike(data.totalLike)
        setMessage(data.message)
        if(res.status === 200){
          setLike(false)
        }
      }
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pb-4">
            <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-2xl sm:text-xl lg:text-2xl font-semibold">{user.name}</p>
              <p className={`text-sm sm:text-base  ${user.isActive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                <span className={`w-2 h-2 bg-green-500 rounded-full mr-2`}></span>
                {user.isActive ? "Active" : "Offline"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 text-base sm:text-lg mb-4" dangerouslySetInnerHTML={{__html: user.myDay}} />
              
            {/* <div className="bg-gray-100 p-3 rounded-lg text-sm sm:text-base">
              <p className="font-semibold mb-1">Today's Reflection:</p>
              <p className="italic">"The sea, once it casts its spell, holds one in its net of wonder forever." - Jacques Cousteau</p>
            </div> */}
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
            <button onClick={() => handleLike()} className="flex items-center justify-center sm:justify-start w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <FaHeart className={`w-5 h-5 mr-2 ${like ? 'text-red-500' : ''}`} />
              <span>{like ? "Liked" : "Like"} ({totalLike})</span>
            </button>
            <button className="flex items-center justify-center sm:justify-start w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <FaComment className="w-5 h-5 mr-2 text-blue-500" />
              <span>Comment (7)</span>
            </button>
            <button className="flex items-center justify-center sm:justify-start w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <FaShare className="w-5 h-5 mr-2 text-green-500" />
              <span>Share (3)</span>
            </button>
          </div>
        </div>
      </div>
      <CommentSection />
    </div>
  )
}

export default MyDayCard