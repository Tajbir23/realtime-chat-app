import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../../redux/app/store"
import friendsThunk from "../../../redux/thunks/friendsThunks"
import userTypeCheck from "../../../redux/typeCheck/user"
import { NavLink } from "react-router-dom"

const Friends : React.FC = () => {

    const friends = useSelector((state: {friends: {friends: userTypeCheck[],hasMore: boolean, isLoading:boolean, page: number}}) => state.friends)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        
        dispatch(friendsThunk(friends.page))
    },[dispatch, friends.page])

    // console.log("friends", friends)
    return (
        <>
            {friends.friends.map((friend) =>{
                return <NavLink
                to={`/chat/${friend._id}`}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img
                  src={friend.photoUrl}
                  className="h-8 w-8 rounded-full"
                  alt="image not found"
                />
                <span className="ms-3">{friend.name}</span>
                <p className="ms-4 text-sm">{friend.isActive ? <div className="h-2 w-2 rounded-full bg-blue-700"></div> : <div className="h-2 w-2 rounded-full bg-red-700"></div>}</p>
              </NavLink>
            })}
        </>
    )
}

export default Friends