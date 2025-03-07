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
    <>
                <ul ref={userListRef} className="space-y-2 font-medium overflow-y-auto to flex-grow px-3 h-1/2 ">
            {users?.map(chatUser => {
              return (
                <li key={chatUser._id} className={`${chatUser?.email === user?.email ? "hidden" : "block"}`}>
                  <NavLink
                    onClick={() => dispatch(toggle())}
                    to={`/chat/${chatUser._id}`}
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    {/* <img
                      src={chatUser.photoUrl}
                      className="h-8 w-8 rounded-full"
                      alt="image not found"
                    /> */}
                    {chatUser?.isActiveMyDay && chatUser?.myDayEndAt > Number(Date.now()) ? <Link to={`/day/${chatUser?._id}`}>
                    <img
                      src={chatUser.photoUrl}
                      className="h-8 w-8 rounded-full ring-4 ring-blue-500"
                      alt="image not found"
                    />
                    </Link> : <img
                      src={chatUser.photoUrl}
                      className="h-8 w-8 rounded-full"
                      alt="image not found"
                    />}
                    <span className="ms-3 mr-auto">{chatUser.name}</span>
                    <p className="ms-4 text-sm ">
                      {chatUser.isActive ? (
                        <div className="h-2 w-2 rounded-full bg-blue-700"></div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-red-700"></div>
                      )}
                    </p>
                  </NavLink>
                </li>
              );
            })}
          </ul>
    </>
  )
}

export default Users
