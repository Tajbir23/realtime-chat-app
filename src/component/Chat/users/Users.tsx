import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import allUsersState from "../../../redux/typeCheck/allUserState";
import { AppDispatch } from "../../../redux/app/store";
import { incrementPage } from "../../../redux/features/user/allUsersSlice";
import allUsers from "../../../redux/thunks/allUserThunks";
import userTypeCheck from "../../../redux/typeCheck/user";
import { toggle } from "../../../redux/features/toggle/toggleSlice";


const Users = ({user}: {user: userTypeCheck}) => {
    const userListRef = useRef<HTMLUListElement>(null);
    const { users, page, hasMore, isLoading } = useSelector((state: { allUsers: allUsersState }) => state.allUsers);
    const dispatch = useDispatch<AppDispatch>();

    const handleUserScroll = useCallback(() => {
        const element = userListRef.current
        
        if(element){
          if(element.scrollHeight - element.scrollTop <= element.clientHeight + 1){
            if(hasMore && !isLoading){
              
              dispatch(incrementPage())
              dispatch(allUsers(page))
            }
          }
        }
      },[hasMore, isLoading, dispatch, page])
    
      
      useEffect(() => {
        const element = userListRef.current
        if(element){
          element.addEventListener('scroll', handleUserScroll)
          return () => {
            element.removeEventListener('scroll', handleUserScroll)
          }
        }
      },[handleUserScroll])
  return (
    <ul ref={userListRef} className="space-y-4 overflow-y-auto px-4 bg-white rounded-lg shadow mx-5">
      {users?.map(chatUser => {
        if (chatUser?.email === user?.email) return null;
        
        return (
          <li key={chatUser._id}>
            <NavLink
              onClick={() => dispatch(toggle())}
              to={`/chat/${chatUser._id}`}
              className="flex items-center p-3 rounded-xl transition-colors"
            >
              <div className="relative">
                {chatUser?.isActiveMyDay && chatUser?.myDayEndAt > Number(Date.now()) ? (
                  <Link to={`/day/${chatUser?._id}`}>
                    <div className="relative">
                      <img
                        src={chatUser.photoUrl}
                        className="h-12 w-12 rounded-full object-cover"
                        alt={chatUser.name}
                      />
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </Link>
                ) : (
                  <img
                    src={chatUser.photoUrl} 
                    className="h-12 w-12 rounded-full object-cover"
                    alt={chatUser.name}
                  />
                )}
                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  chatUser.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>

              <div className="ml-4 flex-1">
                <span className="font-medium text-gray-900">
                  {chatUser.name}
                </span>
              </div>
            </NavLink>
          </li>
        );
      })}
    </ul>
  )
}

export default Users
