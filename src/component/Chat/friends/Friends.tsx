import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/app/store";
import friendsThunk from "../../../redux/thunks/friendsThunks";
import { Link, NavLink } from "react-router-dom";
import friends from "../../../redux/typeCheck/friends";
import { socket } from "../../../hooks/useSocket";
import { replaceFriends, updateFriendActiveStatus } from "../../../redux/features/user/friendsSlice";
import { toggle } from "../../../redux/features/toggle/toggleSlice";
import userTypeCheck from "../../../redux/typeCheck/user";
import { CiMenuKebab } from "react-icons/ci";
import DeleteFriend from "./DeleteFriend";

const Friends: React.FC = () => {
  const friends = useSelector(
    (state: {
      friends: {
        friends: friends[];
        hasMore: boolean;
        isLoading: boolean;
        page: number;
      };
    }) => state.friends
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState({
    open: false,
    id: ''
  });

  const me = useSelector(
    (state: { user: { user: userTypeCheck } }) => state.user.user
  );

  console.log(friends.friends)
  const friendListRef = useRef<HTMLUListElement>(null)

  const dispatch = useDispatch<AppDispatch>();

  socket.on("updateFriendStatus", (friend) => {
    
    dispatch(updateFriendActiveStatus(friend))
    
  })

  socket.on("recentMessage", (message) => {
    
    if(message[0].receiverId?._id === me?._id){
      delete message[0].receiverId
      dispatch(replaceFriends(message[0]))
      
    }else if(message[0].senderId?._id === me?._id){
      delete message[0].senderId
      dispatch(replaceFriends(message[0]))
    }
  })

  useEffect(() => {
    dispatch(friendsThunk(friends.page));
  }, [dispatch, friends.page]);


  // start scroll logic
  const handleFriendScroll = useCallback(() => {
    const element = friendListRef.current
    if(element){
      if(element.scrollHeight - element.scrollTop <= element.clientHeight + 1){
        if(friends.hasMore && !friends.isLoading){
          dispatch(friendsThunk(friends.page + 1))
        }
      }
    }
  },[dispatch, friends])

  useEffect(() => {
    const element = friendListRef.current
    if(element){
      element.addEventListener('scroll', handleFriendScroll)
      return () => {
        element.removeEventListener('scroll', handleFriendScroll)
      }
    }
  }, [handleFriendScroll])
  // end scroll logic

  const formatLastMessage = (lastMessageAt: number): string => {
    const now = Date.now();
    const timeDifference = now - lastMessageAt;
  
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    // const days:number = Math.floor(hours / 24);
  
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
    if (seconds < 60) return rtf.format(-seconds, 'second');
    if (minutes < 60) return rtf.format(-minutes, 'minute');
    if (hours < 24) return rtf.format(-hours, 'hour');
    return new Date(lastMessageAt).toLocaleDateString(); 
  };
  return (
    <ul ref={friendListRef} className="space-y-3 font-medium py-4 min-h-10 max-h-[calc(100vh-240px)] overflow-y-auto px-2">
      {friends.friends.length > 0 && friends.friends.map((friend) => (
        <li key={friend._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center p-3">
            <NavLink
              onClick={() => dispatch(toggle())}
              to={`/chat/${friend.receiverId?._id || friend.senderId?._id}`}
              className="flex items-center flex-1"
            >
              <div className="relative">
                {friend.senderId?.isActiveMyDay || friend.receiverId?.isActiveMyDay && 
                 friend.senderId?.myDayEndAt > Number(Date.now()) || 
                 friend.receiverId?.myDayEndAt > Number(Date.now()) ? (
                  <Link to={`/day/${friend.senderId?._id || friend.receiverId?._id}`}>
                    <div className="relative">
                      <img
                        src={friend.receiverId?.photoUrl || friend.senderId?.photoUrl}
                        className="h-12 w-12 rounded-full object-cover"
                        alt="Profile"
                      />
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </Link>
                ) : (
                  <img
                    src={friend.receiverId?.photoUrl || friend.senderId?.photoUrl}
                    className="h-12 w-12 rounded-full object-cover"
                    alt="Profile"
                  />
                )}
                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  friend.receiverId?.isActive || friend.senderId?.isActive 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}></div>
              </div>

              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {friend.receiverId?.name || friend.senderId?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatLastMessage(friend.lastMessageAt)}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  !friend?.lastMessageSeen && friend?.lastMessageSeenUserId?._id !== me?._id 
                    ? "font-semibold text-gray-900" 
                    : "text-gray-500"
                }`}>
                  {friend.lastMessage?.split("").slice(0, 20).join("")}
                  {friend.lastMessage?.length > 20 ? "..." : ""}
                </p>
              </div>
            </NavLink>

            <div className="relative ml-2">
              <button 
                onClick={() => setIsDeleteOpen({open: true, id: friend._id})}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Friend options menu"
              >
                <CiMenuKebab className="text-gray-500" />
              </button>
              {isDeleteOpen.open && isDeleteOpen.id === friend._id && (
                <DeleteFriend isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} />
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Friends;
