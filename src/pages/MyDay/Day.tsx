import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import MyDayCard from "../../component/Chat/myDay/MyDayCard";
import friends from "../../redux/typeCheck/friends";
import allUsersState from "../../redux/typeCheck/allUserState";
import userTypeCheck from "../../redux/typeCheck/user";

const Day = () => {
  const { id } = useParams();
  const [user, setUser] = useState<userTypeCheck | undefined>(undefined);

  const friends = useSelector((state: { friends: { friends: friends[] } }) => state.friends.friends);
  const { users } = useSelector((state: { allUsers: allUsersState }) => state.allUsers);

  useEffect(() => {
    const friend = friends.find(friend => friend.receiverId?._id === id || friend.senderId?._id === id);
    const friendData = friend?.receiverId ? friend.receiverId : friend?.senderId;
    const userData = users.find(user => user?._id === id);
    
    if (friendData) {
      setUser(friendData);
    } else {
      setUser(userData);
    }
  }, [id, friends, users]);
  
  return (
    <div className="sm:ml-80 w-full">
      {user && <MyDayCard user={user} />}
    </div>
  );
};

export default Day;
