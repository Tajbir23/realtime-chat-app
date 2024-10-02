import { FaComment, FaHeart, FaShare } from "react-icons/fa"
import userTypeCheck from "../../../redux/typeCheck/user"
import { useEffect, useState } from "react"
import CommentSection from "./CommentSection"
import { useDispatch, useSelector } from "react-redux"
import totalLikeCommentThunk from "../../../redux/thunks/totalLikeCommentThunks"
import { AppDispatch } from "../../../redux/app/store"
import totalLikeCommentType from '../../../redux/typeCheck/totalLikeCommentType';
import { addTotalLike, incrementLike, myLike } from "../../../redux/features/likeAndComment/totalLikeCommentSlice"


const MyDayCard: React.FC<{user: userTypeCheck}> = ({user}) => {
  const [message, setMessage] = useState()
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const totalLikeComment = useSelector((state: {totalLikeComment: {totalLikeComment: totalLikeCommentType}}) => state)


  useEffect(() => {
    if(user){
      dispatch(totalLikeCommentThunk({ userId: user?._id, myDayId: user?.myDayId }));

    }
  }, [message, user, dispatch])

    const handleLike = async() => {
      if(!totalLikeComment.totalLikeComment.totalLikeComment.like){
        dispatch(myLike(true))
        dispatch(incrementLike())
      }

      const res = await fetch(`${import.meta.env.VITE_API}/api/like`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({userId: user._id, myDayId: user.myDayId, like: totalLikeComment.totalLikeComment.totalLikeComment.like}),
      })

      const data = await res.json()
      if(res.ok){
        dispatch(addTotalLike(data.totalLike))
        setMessage(data.message)
        if(res.status === 200){
          dispatch(myLike(true))
        }
      }
    }


    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: "Check out this post!",
          text: `Take a look at ${user.name}'s post on MyDay!`,
          url: `${window.location.origin}/share/${user.myDayId}`, // Can replace with a specific URL
        })
        .then(() => {
          fetch(`${import.meta.env.VITE_API}/api/share`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({share: true, myDayId: user.myDayId}),
          }).then(() => {
            dispatch(totalLikeCommentThunk({ userId: user?._id, myDayId: user?.myDayId }));
          })
        })
        .catch((error) => console.error("Error sharing", error));
      } else {
        console.error("Web Share API not supported in this browser");
      }
    };

    
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
              
            
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
            <button onClick={() => handleLike()} className="flex items-center justify-center sm:justify-start w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <FaHeart className={`w-5 h-5 mr-2 ${totalLikeComment.totalLikeComment.totalLikeComment.like ? 'text-red-500' : ''}`} />
              <span>{totalLikeComment.totalLikeComment.totalLikeComment.like ? "Liked" : "Like"} ({totalLikeComment.totalLikeComment.totalLikeComment.totalLike})</span>
            </button>
            <button onClick={() => setIsCommentOpen(!isCommentOpen)} className="flex items-center justify-center sm:justify-start w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <FaComment className="w-5 h-5 mr-2 text-blue-500" />
              <span>Comment ({totalLikeComment.totalLikeComment.totalLikeComment.totalComment})</span>
            </button>
            <button onClick={() => handleShare()} className="flex items-center justify-center sm:justify-start w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <FaShare className="w-5 h-5 mr-2 text-green-500" />
              
              <span>Share ({totalLikeComment.totalLikeComment.totalLikeComment.totalShare})</span>
            </button>
          </div>
        </div>
      </div>
      {isCommentOpen && <CommentSection myDayId={user.myDayId} userId={user._id} />}
    </div>
  )
}

export default MyDayCard