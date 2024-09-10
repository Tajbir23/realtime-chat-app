import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/app/store";
import friendsThunk from "../../../redux/thunks/friendsThunks";
import { NavLink } from "react-router-dom";
import friends from "../../../redux/typeCheck/friends";
import { socket } from "../../../hooks/useSocket";
import { replaceFriends } from "../../../redux/features/user/friendsSlice";

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
  const dispatch = useDispatch<AppDispatch>();

  socket.on("recentMessage", (message) => {
    friends.friends.map((friend) => {
      console.log(message)
      if (
        friend.receiverId?._id === message.senderId?._id ||
        friend.senderId?._id === message.senderId?.id
      ) {
        dispatch(replaceFriends(message));
      }
    })
  })

  useEffect(() => {
    dispatch(friendsThunk(friends.page));
  }, [dispatch, friends.page]);

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
    return new Date(lastMessageAt).toLocaleDateString(); // fallback to full date
  };
  return (
    <>
      {friends.friends.map((friend) => {
        return (
          <>
            <NavLink
              to={`/chat/${friend.receiverId?._id || friend.senderId?._id}`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full"
            >
              <img
                src={friend.receiverId?.photoUrl || friend.senderId?.photoUrl}
                className="h-8 w-8 rounded-full"
                alt="image not found"
              />
              <div className="w-full">
                <div className="flex items-center">
                  <span className="ms-3">
                    {friend.receiverId?.name || friend.senderId?.name}
                  </span>
                  <p className="ms-4 text-sm ml-auto">
                    {friend.receiverId?.isActive ||
                    friend.senderId?.isActive ? (
                      <div className="h-2 w-2 rounded-full bg-blue-700"></div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-red-700"></div>
                    )}
                  </p>
                </div>
                <div className="flex justify-between mx-3">
                  <p className="text-sm text-gray-500">
                    {friend.lastMessage.split("").slice(0, 5)}...
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatLastMessage(friend.lastMessageAt)}
                  </p>
                </div>
              </div>
            </NavLink>
          </>
        );
      })}
    </>
  );
};

export default Friends;
