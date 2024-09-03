import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../../redux/app/store"
import friendsThunk from "../../../redux/thunks/friendsThunks"
import { NavLink } from "react-router-dom"
import friends from "../../../redux/typeCheck/friends"

const Friends : React.FC = () => {

    const friends = useSelector((state: {friends: {friends: friends[],hasMore: boolean, isLoading:boolean, page: number}}) => state.friends)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        
        dispatch(friendsThunk(friends.page))
    },[dispatch, friends.page])

    return (
        <>
            {friends.friends.map((friend) =>{
                return <>
                <NavLink
                to={`/chat/${friend.receiverId?._id || friend.senderId?._id}`}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img
                  src={friend.receiverId?.photoUrl || friend.senderId?.photoUrl}
                  className="h-8 w-8 rounded-full"
                  alt="image not found"
                />
                <span className="ms-3">{friend.receiverId?.name || friend.senderId?.name}</span>
                <p className="ms-4 text-sm">{friend.receiverId?.isActive || friend.senderId?.isActive ? <div className="h-2 w-2 rounded-full bg-blue-700"></div> : <div className="h-2 w-2 rounded-full bg-red-700"></div>}</p>
              </NavLink>
                </>
            })}
        </>
    )
}

export default Friends