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
    <ul ref={friendListRef} className="space-y-2 z-0 font-medium my-5 pb-5 border-b-2 min-h-10 max-h-72 overflow-y-auto px-3">
      <li className="text-xl font-bold bg-gray-50">Friends</li>
      {friends.friends.length > 0 && friends.friends.map((friend) => {
        
        return (
          <>
            <li className="flex items-center">
            <NavLink
              onClick={() => dispatch(toggle())}
              to={`/chat/${friend.receiverId?._id || friend.senderId?._id}`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full"
            >
              {friend.senderId?.isActiveMyDay || friend.receiverId?.isActiveMyDay && friend.senderId?.myDayEndAt > Number(Date.now()) || friend.receiverId?.myDayEndAt > Number(Date.now()) ? <Link to={`/day/${friend.senderId?._id || friend.receiverId?._id}`}>
              <img
                src={friend.receiverId?.photoUrl || friend.senderId?.photoUrl}
                className="h-8 w-8 ring-4 ring-blue-500 rounded-full"
                alt="image not found"
              />
              </Link> : <img
                src={friend.receiverId?.photoUrl || friend.senderId?.photoUrl}
                className="h-8 w-8 rounded-full"
                alt="image not found"
              />}
              <div className="w-full">
                <div className="flex items-center">
                  <span className="ms-3 mr-auto">
                    {friend.receiverId?.name || friend.senderId?.name}
                  </span>
                  <p className="ms-4 text-sm">
                    {friend.receiverId?.isActive ||
                    friend.senderId?.isActive ? (
                      <div className="h-2 w-2 rounded-full bg-blue-700"></div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-red-700"></div>
                    )}
                  </p>
                </div>
                <div className={`flex justify-between mx-3 ${!friend?.lastMessageSeen && friend?.lastMessageSeenUserId?._id !== me?._id ? "font-extrabold" : ""}`}>
                  <p className="text-sm ">
                    {friend.lastMessage?.split("").slice(0, 5)}...
                  </p>
                  <p className="text-sm ">
                    {formatLastMessage(friend.lastMessageAt)}
                  </p>
                </div>
              </div>
            </NavLink>
            <div className="relative">
              <CiMenuKebab onClick={() => setIsDeleteOpen({open: true, id: friend._id})} className="cursor-pointer" />
              {isDeleteOpen.open && isDeleteOpen.id === friend._id && <DeleteFriend isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} />}
            </div>
            </li>
          </>
        );
      })}
    </ul>
  );
};

export default Friends;
